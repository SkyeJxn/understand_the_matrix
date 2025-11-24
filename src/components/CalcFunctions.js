import { fraction } from "mathjs";
export function SwitchRows(matrix, row1, row2) {
  // copy of matrix
  let newMatrix =  matrix.map(rowArr => [...rowArr]);

  const temp = newMatrix[row1];
  newMatrix[row1] = newMatrix[row2];
  newMatrix[row2] = temp;
  return newMatrix;
}

export function AddRows(matrix, sourceRow, targetRow, scalar) {
  // copy of matrix
  let newMatrix = matrix.map(rowArr => rowArr.map(cell => fraction(cell)));

  for (let i = 0; i < newMatrix[targetRow].length; i++) {
    const s = fraction(scalar);
    newMatrix[targetRow][i] = newMatrix[targetRow][i].add(s.mul(newMatrix[sourceRow][i]));
  }

  return newMatrix;
}

export function MultiplyRow(matrix, Row, scalar) {
  // copy of matrix
  let newMatrix = matrix.map(rowArr => rowArr.map(cell => fraction(cell)));

  for (let i = 0; i < newMatrix[Row].length; i++) {
    newMatrix[Row][i] = fraction(scalar).mul(newMatrix[Row][i]);
  }

  return newMatrix;
}