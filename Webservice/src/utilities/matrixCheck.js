import { equal } from 'mathjs';

/**
 *
 * @param {Number} acceptance -
 * - 0 (equivalent),
 * - 1 (multiples),
 * - 2 (lines swapped),
 * - 3 (line swapped & multiples)
 * - 4 (line swapped & multiples & ignore zero lines)
 * @param {number[][] | fraction[][]} solutionMatrix - The solution matrix.
 * @param {number[][] | fraction[][]} userMatrix - The user matrix.
 *
 * @returns {boolean}
 */
export function SolutionVerifier(acceptance = 0, solutionMatrix, userMatrix) {
  if (!Array.isArray(solutionMatrix) || !Array.isArray(userMatrix)) return false;
  if (JSON.stringify(solutionMatrix) === JSON.stringify(userMatrix)) return true;

  if (solutionMatrix.length !== userMatrix.length       && acceptance !== 4) return false;
  if (solutionMatrix[0].length !== userMatrix[0].length && acceptance !== 4) return false;

  if (acceptance === 0) return rowsEqual(solutionMatrix, userMatrix);
  if (acceptance === 1) return rowsMultiples(solutionMatrix, userMatrix);
  if (acceptance === 2) return rowsEqualWithSwap(solutionMatrix, userMatrix);
  if (acceptance === 3) return rowsMultiplesWithSwap(solutionMatrix, userMatrix);
  if (acceptance === 4) return rowsMultiplesWithSwap(solutionMatrix, userMatrix, true);

  return false;
}

function rowsEqual(solutionMatrix, userMatrix) {
  const serializeRow = (row) =>
    JSON.stringify(row.map((cell) => cell.toString()));
  const solRows = solutionMatrix.map(serializeRow);
  const userRows = userMatrix.map(serializeRow);
  return JSON.stringify(solRows) === JSON.stringify(userRows);
}
function rowsEqualWithSwap(solutionMatrix, userMatrix) {
  const serializeRow = (row) =>
    JSON.stringify(row.map((cell) => cell.toString()));
  const solRows = solutionMatrix.map(serializeRow).sort();
  const userRows = userMatrix.map(serializeRow).sort();
  return JSON.stringify(solRows) === JSON.stringify(userRows);
}

function rowsMultiples(solutionMatrix, userMatrix) {
  for (let i = 0; i < solutionMatrix.length; i++) {
    if (!rowIsMultiple(solutionMatrix[i], userMatrix[i])) return false;
  }
  return true;
}

function rowsMultiplesWithSwap(solutionMatrix, userMatrix, ignoreZeroLines = false) {
  if (ignoreZeroLines) {
    userMatrix = removeZeroRows(userMatrix);
    userMatrix = removeZeroCols(userMatrix);
    solutionMatrix = removeZeroRows(solutionMatrix);
    solutionMatrix = removeZeroCols(solutionMatrix);
  }
  // sorting both sets
  const solRows = solutionMatrix.map((row) => normalizeRow(row)).sort();
  const userRows = userMatrix.map((row) => normalizeRow(row)).sort();
  return JSON.stringify(solRows) === JSON.stringify(userRows);
}

function rowIsMultiple(solRow, userRow) {
  let factor = null;
  for (let j = 0; j < solRow.length; j++) {
    if (solRow[j].valueOf() !== 0) {
      factor = userRow[j].valueOf() / solRow[j].valueOf();
      break;
    }
  }
  if (factor === null || factor === 0) return false;

  for (let j = 0; j < solRow.length; j++) {
    const sVal = solRow[j].valueOf();
    const uVal = userRow[j].valueOf();
    if (Math.abs(uVal - factor * sVal) > 1e-12) {
      return false;
    }
  }
  return true;
}

function normalizeRow(row) {
  // Normalize to multiples: divide by the first non-zero value
  let divisor = null;
  for (let j = 0; j < row.length; j++) {
    if (row[j].valueOf() !== 0) {
      divisor = row[j].valueOf();
      break;
    }
  }
  if (divisor === null) divisor = 1;
  return JSON.stringify(
    row.map((cell) => (cell.valueOf() / divisor).toFixed(12))
  );
}

function removeZeroRows(matrix) {
  return matrix.filter(row => {
    const isZeroRow = row.every(value => equal(value, 0));
    return !isZeroRow;
  });
}

function removeZeroCols(matrix) {
  if (matrix.length === 0) return matrix;

  const cols = matrix[0].length;
  const nonZeroColIndices = [];

  for (let col = 0; col < cols; col++) {
    const isZeroCol = matrix.every(row => equal(row[col], 0));

    if (!isZeroCol) {
      nonZeroColIndices.push(col);
    }
  }

  return matrix.map(row => nonZeroColIndices.map(i => row[i]));
}
