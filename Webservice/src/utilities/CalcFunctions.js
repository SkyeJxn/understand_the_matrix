import { fraction } from "mathjs";

/**
 * Help component that Switches given Rows in a Matrix
 * 
 * @param {number[][]} matrix - matrix that get's passed by the challenge
 * @param {number} row1 - first row to switch
 * @param {number} row2 - second row to switch
 * @returns {number[][]}
 */
export function SwitchRows(matrix, row1, row2) {
  // copy of matrix
  let newMatrix =  matrix.map(rowArr => [...rowArr]);

  const temp = newMatrix[row1];
  newMatrix[row1] = newMatrix[row2];
  newMatrix[row2] = temp;
  return newMatrix;
}

/**
 * Help Component that Adds given Rows in a Matrix
 * 
 * @param {number[][]} matrix - Matrix passed by the challenge
 * @param {number} sourceRow - Row that's getting added to another
 * @param {number} targetRow - Row to add sourceRow on
 * @param {number} scalar - Multiplicator for the sourceRow
 * @returns {number[][]}
 */
export function AddRows(matrix, sourceRow, targetRow, scalar) {
  // copy of matrix
  let newMatrix = matrix.map(rowArr => rowArr.map(cell => fraction(cell).simplify()));

  for (let i = 0; i < newMatrix[targetRow].length; i++) {
    const s = fraction(scalar);
    newMatrix[targetRow][i] = newMatrix[targetRow][i].add(s.mul(newMatrix[sourceRow][i]));
  }

  return newMatrix;
}

/**
 * Help Component that Multiplies a given Row in a Matrix
 * 
 * @param {number[][]} matrix - Matrix passed by the challenge
 * @param {number} Row - Row that's getting multiplied
 * @param {number} scalar - Multiplicator for the Row
 * @returns {number[][]}
 */
export function MultiplyRow(matrix, Row, scalar) {
  // copy of matrix
  let newMatrix = matrix.map(rowArr => rowArr.map(cell => fraction(cell).simplify()));

  for (let i = 0; i < newMatrix[Row].length; i++) {
    newMatrix[Row][i] = fraction(scalar).mul(newMatrix[Row][i]);
  }

  return newMatrix;
}

function toFractionValue(value) {
  return fraction(value).simplify();
}

function getOperationSymbol(item) {
  if (!item || item.type !== "operation") return null;

  if (typeof item.data === "string") return item.data;
  if (item.data && typeof item.data === "object" && "operand" in item.data) {
    return item.data.operand;
  }

  return null;
}

function formatCellValue(item) {
  return toFractionValue(item.data).toString();
}

export function Determinant(matrix) {
  if (!Array.isArray(matrix) || matrix.length === 0) {
    return {
      formula: "",
      value: fraction(0),
      valueText: "0",
      lines: [],
    };
  }

  const lines = [];
  const values = [];
  let currentLine = [];
  let currentValue = fraction(1);

  const flushLine = () => {
    if (currentLine.length === 0) return;

    lines.push(currentLine);
    values.push(currentValue);
    currentLine = [];
    currentValue = fraction(1);
  };

  matrix.forEach((item) => {
    if (item?.type === "operation") {
      const op = getOperationSymbol(item);
      if (op === "-") {
        flushLine();
      }
      return;
    }

    if (item?.type === "cell") {
      currentLine.push(formatCellValue(item));
      currentValue = currentValue.mul(toFractionValue(item.data));
    }
  });

  flushLine();

  const value = values.reduce((accumulator, lineValue, index) => {
    if (index === 0) return accumulator.add(lineValue);
    return accumulator.sub(lineValue);
  }, fraction(0));

  console.log("det:",String(value))

  return value;
}