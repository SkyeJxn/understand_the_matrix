import React, { useState, useEffect} from "react";
import { BlockMath} from "react-katex";

export function Equations({ solMatrix, setSolution }){
  const [equations, setEquations] = useState(['error']);

  console.log(matrixStairForm(3,3,3,3,2));

  useEffect(() => {
    if (!solMatrix || solMatrix.length === 0) return;

    const solutionMatrix = [...solMatrix];
    
    const eq = solutionMatrix.map((row) => {
      // last col
      const rhs = row[row.length - 1];
      // all except last col
      const coeffs = row.slice(0, -1) 
      const terms = coeffs.map((coef, i) => {
        const sign = coef.s < 0n ? "-" : (i === 0 ? "" : "+");
        const absVal = coef.abs().toString();
        return `${sign} ${absVal}x_${i + 1}`;
      })  
      return `${terms.join(" ")} = ${rhs.toString()}`;
    });
    setEquations(eq);

  }, [solMatrix]);

  useEffect(() => {
    if (typeof setSolution === "function") {
      setSolution(solMatrix);
    }
  }, [solMatrix, setSolution]);

  return <>
      { equations.map((eq, i) => (
      <BlockMath key={i} className="katex" math={eq} />
    ))}
  </>
    
}
/**
 * 
 * @param {Number} acceptance - 0 (equivalent), 1 (lines swapped), 2 (multiples), 3 (line swapped & multiples)
 * @returns {boolean}
 */
export function SolutionVerifier(acceptance = 0, solutionMatrix, userMatrix) {
  if (JSON.stringify(solutionMatrix) === JSON.stringify(userMatrix)) return true;
  if (solutionMatrix.length !== userMatrix.length) return false;
  if (solutionMatrix[0].length !== userMatrix[0].length) return false;

  if (acceptance === 1) return rowsEqual(solutionMatrix, userMatrix);
  if (acceptance === 2) return rowsMultiples(solutionMatrix, userMatrix);
  if (acceptance === 3) return rowsEqual(solutionMatrix, userMatrix) || rowsMultiples(solutionMatrix, userMatrix);

  return false;
}

function rowsEqual(solutionMatrix, userMatrix) {
  const serializeRow = (row) => JSON.stringify(row.map(cell => cell.toString()));
  const solRows = solutionMatrix.map(serializeRow).sort();
  const userRows = userMatrix.map(serializeRow).sort();
  return JSON.stringify(solRows) === JSON.stringify(userRows);
}

function rowsMultiples(solutionMatrix, userMatrix) {
  for (let i = 0; i < solutionMatrix.length; i++) {
    const solRow = solutionMatrix[i];
    const userRow = userMatrix[i];

    let factor = null;
    for (let j = 0; j < solRow.length; j++) {
      if (solRow[j].n !== 0n) {
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
  }
  return true;
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
export function matrixStairForm(minRows, maxRows, minCols, maxCols, acceptance = 0){
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