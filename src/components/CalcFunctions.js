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
  let newMatrix = matrix.map(rowArr => [...rowArr]);

  for (let i = 0; i < newMatrix[targetRow].length; i++) {
    newMatrix[targetRow][i] += newMatrix[sourceRow][i] * scalar;
  }

  return newMatrix;
}

export function MultiplyRow(matrix, Row, scalar) {
  // copy of matrix
  let newMatrix = matrix.map(rowArr => [...rowArr]);

  for (let i = 0; i < newMatrix[Row].length; i++) {
    newMatrix[Row][i] = newMatrix[Row][i] * scalar;
  }

  return newMatrix;
}