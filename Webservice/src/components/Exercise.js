import { MatrixCreator } from "./CalcFunctions";
import React, { useState, useEffect} from "react";
import { InlineMath } from "react-katex";
import { EditableMatrix, StaticMatrix } from "./Matrix";
import { fraction } from "mathjs";


export default function Exercise({ type = 1, correct, userMatrixOnChange}){
    const solutionMatrix=[
  [new fraction(0), new fraction(-4), new fraction(-10), new fraction(7)],
  [new fraction(1), new fraction(5), new fraction(7), new fraction(7)],
  [new fraction(1), new fraction(5), new fraction(7), new fraction(7)]

];


    const [userMatrix, setUserMatrix] = useState([[0,0,0,0],[0,0,0,0],[0,0,0,0]]);
    let equations = 'eq'

    // useEffect(() => {
    //   if (type === 1) {
    //     setMatrix(MatrixCreator([[1,0,0,0],[0,1,0,0],[0,0,1,1]],-3,[1]));
    //     // setMatrix([[1,-4,-6,0],[0,0,0,0],[0,0,0,0]]);
    //   }
    // }, [type]);

    const handleUserInput = (input) => {
        const m = input.map(row =>
            row.map(cell => cell === '' ? 0 : Number(cell))
        );
        setUserMatrix(m);
         if (typeof userMatrixOnChange === "function") {
          userMatrixOnChange(m);
        }
        if (typeof correct === "function") {
            console.log(JSON.stringify(m));
            console.log(JSON.stringify(solutionMatrix));
            if (JSON.stringify(m) === JSON.stringify(solutionMatrix)){
                correct(true);
            }
        }
        
    }
        // console.log(matrix);

    if (type == 1) {
        equations = solutionMatrix.map(([a, b, c, d]) => {
            const signb = b.s < 0n ? "-" : "+"; // Vorzeichen auslesen
            const signc = c.s < 0n ? "-" : "+"; 
            // console.log(a)
            // console.log(b)
            // console.log(c)


            return `${a.toString()}x ${signb} ${b.abs().toString()}y ${signc} ${c.abs().toString()}z = ${d.toString()}`;
        });
    }
        // console.log(matrix);

    // useEffect(() => {console.log(userMatrix);}, [userMatrix]);
    return <>
        {equations.map((eq, i) => (
        <InlineMath key={i} className="katex" math={eq} />
      ))}
      <EditableMatrix rows={3} cols={4} resultCol={true} onChange={(input) => handleUserInput(input)}/>
      {/* test display */}
      <StaticMatrix data={userMatrix} resultCol={true}/>
      <StaticMatrix data={solutionMatrix} resultCol={true}/>

    </>
    
}

export function SolutionVerifier({solutionMatrix, userMatrix}){
    
}