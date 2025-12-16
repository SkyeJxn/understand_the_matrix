/**
 *
 * @param {Number} acceptance -
 * 0 (equivalent),
 * 1 (multiples),
 * 2 (lines swapped),
 * 3 (line swapped & multiples)
 * @param {number[][] | fraction[][]} solutionMatrix - The solution matrix.
 * @param {number[][] | fraction[][]} userMatrix - The user matrix.
 *
 * @returns {boolean}
 */
export function SolutionVerifier(acceptance = 0, solutionMatrix, userMatrix) {
  if (JSON.stringify(solutionMatrix) === JSON.stringify(userMatrix))
    return true;
  if (solutionMatrix.length !== userMatrix.length) return false;
  if (solutionMatrix[0].length !== userMatrix[0].length) return false;

  if (acceptance === 0) return rowsEqual(solutionMatrix, userMatrix);
  if (acceptance === 1) return rowsMultiples(solutionMatrix, userMatrix);
  if (acceptance === 2) return rowsEqualWithSwap(solutionMatrix, userMatrix);
  if (acceptance === 3)
    return rowsMultiplesWithSwap(solutionMatrix, userMatrix);
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

function rowsMultiplesWithSwap(solutionMatrix, userMatrix) {
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
/**
 * Generates a random matrix in a staircase shape
 * @param {Number} minRows - minimum number of rows
 * @param {Number} maxRows - maximum number of rows
 * @param {Number} minCols - minimum number of columns
 * @param {Number} maxCols - maximum number of columns
 * @param {Number} acceptance - 0 (strict stair shape), 1 (half with 1s), 2 (half without 1s)
 * @returns {number[][]}
 */
export function matrixStairForm(
  minRows,
  maxRows,
  minCols,
  maxCols,
  acceptance = 0
) {
  //random dim
  const rows = Math.floor(Math.random() * (maxRows - minRows + 1)) + minRows;
  const cols = Math.floor(Math.random() * (maxCols - minCols + 1)) + minCols;

  const matrix = [];

  for (let i = 0; i < rows; i++) {
    const row = [];

    for (let j = 0; j < cols; j++) {
      if (j < i) {
        row.push(0);
      } else if (j === i) {
        // pivot
        if (acceptance === 2) row.push(Math.floor(Math.random() * 11) + -5);
        else row.push(1);
      } else {
        if (acceptance === 0) row.push(0);
        else row.push(Math.floor(Math.random() * 11) - 5);
      }
    }
    matrix.push(row);
  }
  return matrix;
}
