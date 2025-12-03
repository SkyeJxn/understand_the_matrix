"use client";
import React from "react";
import '../styles/Matrix.css'
import { InlineMath } from 'react-katex';
import { fraction } from "mathjs";
/**
 * Component that renders a given matrix
 * 
 * @param {number[][]} data - 2-dim array with the matrix values (each inner list is a row)
 * @param {boolean} resultCol - is the last column a results column
 * @param {boolean} det - is the matrix a determinant
 * @returns {JSX.Element}
 */
export function StaticMatrix({data = [[1,2,3],[4,5,6],[7,8,9]], resultCol = false, det = false}){
  const cols = data[0].length;
  const colFormat = resultCol ? 'c'.repeat(cols - 1) + '|c': 'c'.repeat(cols);

  function formatCell(cell) {
    console.log(cell);
    const frac = fraction(cell);
      if(frac.d !== 1n){ return `${frac.s == -1n ? '-': ''}${frac.n}/${frac.d}`;}
      else { return `${frac}`}
  }

  const rows = data.map(row => {
    if (resultCol) {return row.slice(0, -1).map(formatCell).join(' & ') + ' & ' + formatCell(row[row.length - 1]);} 
    else {return row.map(formatCell).join(' & ');}
  }).join(' \\\\ ');

  const bracketLeft = det ? "|": "("
  const bracketRight = det ? "|": ")"

  const latexMatrix = `\\left${bracketLeft}\\begin{array}{${colFormat}}${rows}\\end{array}\\right${bracketRight}`;
  
  return (
    <div className='matrix-container'>
        <InlineMath math={latexMatrix} />      
    </div>
  );
}
/**
 * Component that renders an empty matrix with room for user inputs
 * 
 * @param {number} rows - number of rows 
 * @param {number} cols - number of columns (including result column if `resultCol` is true)
 * @param {boolean} resultCol - is the last column a results column
 * @param {boolean} det - is the matrix a determinant
 * @param {(matrix: string[][]) => void} onChange - Callback, that returns the current matrix
 * @returns {JSX.Element}
 */
export function EditableMatrix({ rows = 3, cols = 3, resultCol = false, det = false, onChange }) {
  const [matrix, setMatrix] = React.useState(
    Array.from({ length: rows }, () => Array(cols).fill(""))
  );

  const handleChange = (i, j, value) => {
    const newMatrix = matrix.map((row, ri) =>
      row.map((cell, ci) => (ri === i && ci === j ? value : cell))
    );
    setMatrix(newMatrix);
    if (onChange) {
      onChange(newMatrix); // current matrix for the parent
    }
  };
  const bracketLeft = det ? "|": "("
  const bracketRight = det ? "|": ")"
  
  const dummyRows = Array.from({ length: rows }, () => "\\rule{0pt}{2em}").join(" \\\\ ");
  const latexLeftBracket = `\\left${bracketLeft}\\vphantom{\\begin{array}{c}${dummyRows}\\end{array}}\\right.`;
  const latexRightBracket = `\\left.\\vphantom{\\begin{array}{c}${dummyRows}\\end{array}}\\right${bracketRight}`;

  return (
    <div className="matrix-container">
      <InlineMath math={latexLeftBracket} />
      <table className="matrix-inputs"><tbody>
          {matrix.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} className={
                  resultCol && j === cols - 1 ? "result-col" :
                  resultCol && j === cols - 2 ? "before-result-col" : ""}>
                  <input
                    type="number"
                    value={cell}
                    onChange={(e) => handleChange(i, j, e.target.value)}
                    autoFocus={i === 0 && j === 0}
                  />
                </td>
              ))}
            </tr>
          ))}
      </tbody></table>
      <InlineMath math={latexRightBracket} />
    </div>
  );
}
