import React, { useState, useEffect} from "react";
import { BlockMath} from "react-katex";
/**
 * React component that renders equations from a matrix.
 *
 * @param {number[][] | fraction[][]} solMatrix - The solution matrix.
 *
 * @returns {JSX.Element} A rendered list of equations displayed with KaTeX via `BlockMath`.
 *
 * @description
 * - Skips coefficients equal to zero.
 * - Ensures at least one term is present (defaults to "0x₁" if all coefficients are zero).
 */
export function Equations({ solMatrix }){
  const [equations, setEquations] = useState(['error']);
  useEffect(() => {
    if (!solMatrix || solMatrix.length === 0) return;

    const solutionMatrix = [...solMatrix];
    
    const eq = solutionMatrix.map((row) => {
      // last col
      const rhs = row[row.length - 1];
      // all except last col
      const coeffs = row.slice(0, -1) 
      const terms = coeffs.map((coef, i) => {
        const value = typeof coef === "bigint" ? coef : BigInt(coef);
        if (value === 0n) return null; // skip 0
        const sign = coef.s < 0n ? "-" : (i === 0 ? "" : "+");
        const absVal = (value < 0n ? -value : value).toString();
        return `${sign} ${absVal}x_${i + 1}`;
      }).filter(Boolean);
      // all coeffs = 0
      if (terms.length === 0) {
        terms.push("0x_1");
      }
      return `${terms.join(" ")} = ${rhs.toString()}`;
    });
    setEquations(eq);

  }, [solMatrix]);

  return <>
      { equations.map((eq, i) => (
      <BlockMath key={i} className="katex" math={eq} />
    ))}
  </>
    
}
