export function SwitchRows({ matrix, row1, row2, dimension }) {
  let newMatrix = null;

  for (let i = 0; i < dimension; i++) {
    newMatrix[row1][i] = matrix[row2][i];
    newMatrix[row2][i] = matrix[row1][i];
    if (i !== row1 && i !== row2) newMatrix[i] = matrix[i];
  }
  return newMatrix;
}

export function AddRows({ matrix, sourceRow, targetRow, scalar, dimension }) {
  let newMatrix = null;

  for (let i = 0; i < dimension; i++) {
    newMatrix[targetRow] = matrix[targetRow] + matrix[sourceRow] * scalar;
    if (i != sourceRow && i != targetRow) newMatrix[i] = matrix[i];
  }

  return newMatrix;
}

export function MultiplyRow({ matrix, Row, scalar, dimension }) {
  let newMatrix = null;

  for (let i = 0; i < dimension; i++) {
    newMatrix[Row] = newMatrix[Row] * scalar;
    if (i != Row) newMatrix[i] = matrix[i];
  }

  return newMatrix;
}