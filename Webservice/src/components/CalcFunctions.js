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
  let newMatrix = matrix.map(rowArr => rowArr.map(cell => fraction(cell)));

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
  let newMatrix = matrix.map(rowArr => rowArr.map(cell => fraction(cell)));

  for (let i = 0; i < newMatrix[Row].length; i++) {
    newMatrix[Row][i] = fraction(scalar).mul(newMatrix[Row][i]);
  }

  return newMatrix;
}