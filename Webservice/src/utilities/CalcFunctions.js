import { fraction, randomInt } from "mathjs";

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

/**
 * Help component that Transforms a Matrix with a reverse gauss algorithm
 * 
 * @param {number[][]} result - Starting Matrix
 * @param {number} maxNum - Maximum number in scalar
 * @param {number[]} denominator - array of possible denominators, default is [1]
 * @returns {number[][]}
 */
export function MatrixCreator(result, maxNum, denominator){
  // copy of result
  let downward = result;

  for (let i = 0; i < result.length; i++) {
    const randMult = randomFraction(maxNum, denominator);

    downward = MultiplyRow(downward, i, randMult);
    for (let j = i + 1; j < result.length; j++){
      const randAdd = randomFraction(maxNum, denominator);
      downward = AddRows(downward, i, j, randAdd);
    }
  }
  let upward = downward;
  for (let i = result.length - 1; i >= 0; i--) {
    for (let j = i - 1; j >= 0; j--) {
      const randAdd = randomFraction(maxNum);
      upward = AddRows(upward, i, j, randAdd);
    }
  } 
  const task = upward;
  return task;
}

function randomFraction(maxNum, denominator = [1]){
  const num = randomInt(1, maxNum);
  const den = denominator[randomInt(0, denominator.length)];

  return fraction(num, den);
}