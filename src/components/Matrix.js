"use client";
import React from "react";
import './Matrix.css'
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

export function StaticMatrix({data = [[1,2,3],[4,5,6],[7,8,9]], resultCol = false, det = false}){
  const cols = data[0].length;
  const colFormat = resultCol ? 'c'.repeat(cols - 1) + '|c': 'c'.repeat(cols);

  const rows = data.map(row => {
    if (resultCol) {return row.slice(0, -1).join(' & ') + ' & ' + row[row.length - 1];} 
    else {return row.join(' & ');}
  }).join(' \\\\ ');

  const bracketLeft = det ? "|": "("
  const bracketRight = det ? "|": ")"

  const latexMatrix = `
    \\left${bracketLeft}
    \\begin{array}{${colFormat}}
    ${rows}
    \\end{array}
    \\right${bracketRight}
  `;
  
  return (
    <div className='matrix'>
        <InlineMath math={latexMatrix} />      
    </div>
  );
}

export function EditableMatrix({ rows = 3, cols = 3, resultCol = false, det = false, onChange }) {
  const [matrix, setMatrix] = React.useState(
    Array.from({ length: rows }, () => Array(cols).fill("0"))
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
  
  const colFormat = resultCol ? "c".repeat(cols - 1) + "|c" : "c".repeat(cols);
  const dummyRows = Array.from({ length: rows }, () => "\\rule{0pt}{2em}").join(" \\\\ ");

  const latexLeftBracket = `
    \\left${bracketLeft}
    \\vphantom{\\begin{array}{c}
    ${dummyRows}
    \\end{array}}
    \\right.
  `;
  const latexRightBracket = `
    \\left.
    \\vphantom{\\begin{array}{c}
    ${dummyRows}
    \\end{array}}
    \\right${bracketRight}
  `;

  return (
    <div className="matrix-container">
      <InlineMath math={latexLeftBracket} />

      <table className="matrix-inputs">
        <tbody>
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
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <InlineMath math={latexRightBracket} />

    </div>
  );
}
