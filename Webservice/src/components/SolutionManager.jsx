import { solMatrixRREF, MatrixCreator } from "../utilities/MatrixGeneration";
import { SolutionVerifier } from "../utilities/matrixCheck";
import { useState, useEffect } from "react";
import { SolutionContext } from "@/hooks/SolutionContext";
import { fraction } from "mathjs";

export default function SolutionManager({ children, Data, page, part, setSolutionState }) {
  const [options, setOptions] = useState(null);
  const [solutionOption, setSolutionOption] = useState(null);
  const [userOption, setUserOption] = useState(null);
  
  const [solutionMatrix, setSolutionMatrix] = useState(null);
  const [userMatrix, setUserMatrix] = useState(null);
  const [acceptance, setAcceptance] = useState(null);
  const [data, setData] = useState([]);

  // all parts to the current part
  useEffect(() => {
    const curData = Data.filter(
          row => row.page === page && Number(row.part) <= part
    );
    setData(curData);
    // reset
    setUserMatrix(null);
    setSolutionMatrix(null);
    setUserOption(null);
    setSolutionOption(null);
    setOptions(null);
    setSolutionState(false);

  }, [Data, page, part]);

  // set solution, set user value, set acceptance
  useEffect(() => {
    async function run() {
      const rowWithSolution = data.find(row => row.solution !== undefined);
      if (!rowWithSolution) return;
    
      // ---------------------------
      // Matrix Creation
      // ---------------------------
      if (rowWithSolution.matrixCreator !== undefined) {
        const creatorRow = rowWithSolution.matrixCreator;

        // parameter setting
        const rawParams = creatorRow.params || {};
        const params = {};
        for (const key in rawParams) {
          const value = rawParams[key];
          switch (key) {
              case "resultcol":
                  params.resultCol = toBool(value);
                  break;
              case "zeroCols":
                  params.zeroCols = toBool(value);
                  break;
              case "solMatrix":
                  params.solMatrix = parseMatrix(value);
                  break;
              case "transformations":
                  params.transformations = parseArray(value);
                  break;
              case "denominator":
                  params.denominator = parseArray(value);
                  break;
              default:
                  params[key] = value;
          }
        }

        // call MatrixCreator
        const result = await MatrixCreator(params);

        // return map
        const returnMap = creatorRow.return || {};
        // setter map
        const setterMap = { 
          setUserMatrix, setSolutionMatrix, setSolutionOption 
        };
        // helper: always array
        const toArray = (val) => Array.isArray(val) ? val : [val];

        // change states
        // MATRIX 
        if (returnMap.matrix) { 
          for (const setterName of toArray(returnMap.matrix)) { 
            if (setterMap[setterName]) { 
              setterMap[setterName](result.matrix); 
            } 
          } 
        } 
        // SOLMATRIX 
        if (returnMap.solMatrix) { 
          for (const setterName of toArray(returnMap.solMatrix)) { 
            if (setterMap[setterName]) { 
              setterMap[setterName](result.solMatrix); 
            } 
          } 
        } 
        // SOLUTION 
        if (returnMap.solution) { 
          for (const setterName of toArray(returnMap.solution)) { 
            if (setterMap[setterName]) { 
              setterMap[setterName](result.solution); 
            } 
          } 
        }
      }
    
    
    
      // ---------------------------
      // options
      // ---------------------------
      if (rowWithSolution.options !== undefined) {
        setOptions(rowWithSolution.options.possibilities);
      
        if (rowWithSolution.options.solution !== "dynamic") {
          setSolutionOption(rowWithSolution.options.solution);
        }
      }
      // --------------------------
      // acceptance
      // --------------------------
      if (rowWithSolution.acceptance !== undefined) {
        setAcceptance(Number(rowWithSolution.acceptance));
      }
    
    }
  
    run();
  }, [data]);


  // compare user value with solution
  useEffect(() => {
    if (userMatrix === null) return;

    const isCorrect = SolutionVerifier(acceptance, solutionMatrix, userMatrix);
    if (isCorrect) setSolutionState(true);

  }, [userMatrix, acceptance, solutionMatrix]);

  useEffect(() => {
    if (userOption === null) return;

    if (userOption === solutionOption){
      setSolutionState(true);
    }
  }, [userOption, solutionOption]);


  return (
    <SolutionContext.Provider
      value={{
        options,
        setUserOption,
        userOption,
        solutionMatrix,
        setSolutionMatrix,
        userMatrix,
        setUserMatrix,
        acceptance,
        data
      }}
    >
      {children}
    </SolutionContext.Provider>
  );
}

function parseMatrix(matrix){
  return matrix.map(row => row.map(cell => fraction(Number(cell))));
}

function parseArray(array) {
  return array.map((cell) => Number(cell));
}
function toBool(val) {
  return val === true || val === "True" || val === "true";
}
