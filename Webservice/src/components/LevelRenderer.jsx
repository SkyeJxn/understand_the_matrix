import "../styles/LevelDesign.css"
import { InlineMath } from "react-katex";
import { StaticMatrix, EditableMatrix } from "./Matrix";
import { MatrixCreator } from "../utilities/CalcFunctions";
import React, { useState, useEffect, useRef } from "react";
import { ContinueBtn, LevelEndContent, NavigationArrows, Toolbar } from "./LevelTools";
import { CalcButtons } from "./CalcButtons";
import {Equations} from "./Exercise";
import {SolutionVerifier, matrixStairForm } from "../utilities/matrixCheck";
import { fraction } from "mathjs";
import { useKeyMap } from "@/hooks/useKeyboard";
import {getFile} from "../utilities/getFile";
import { useParams } from "react-router-dom";

/**
 * React component that renders a level (tutorial or challenge).
 * It loads metadata and level data, manages progress state,
 * and displays the content along with navigation controls.
 *
 * @returns {JSX.Element} Rendered level view including toolbar, content, and navigation.
 *
 * @description
 * - Fetches metadata from `/data/{mode}/level_meta.json`.
 * - Loads level data via `getFileData`.
 * - Tracks progress across pages and parts of the level.
 * - Provides navigation functions (`next`, `back`, `nextLevel`).
 * - Renders different navigation controls depending on mode:
 *   - Tutorial: navigation arrows
 *   - Challenge: continue button
 * - At the end of a level, renders `LevelEndContent` with links to the next level.
 */
export function LevelRenderer(){
  const { mode, id } = useParams();

    const [levelData, setLevelData] = useState([]);
    const [error, setError] = useState(null);
    const [metaData, setMetaData] = useState([]);

    const [solutionState, setSolutionState] = useState(false);

     useEffect(() => {
        fetch(`/data/${mode}/level_meta.json`)
        .then(res => res.json())
        .then(data => setMetaData(data))
      }, [mode]);

    useEffect(() => {
        getFileData(mode, id)
        .then(setLevelData)
        .catch(err => setError(err.message));
    }, [mode, id]);
    
    const [page, setPage] = useState("1");
    const [currentPart, setCurrentPart] = useState(1);
    const [progressValue, setProgressValue] = useState(0);

    const partsOnLevel = Math.max(
        0,
        ...levelData.map((e) => Number(e.part))
    );

    // Reset view state when navigating to a different mode or level id
    useEffect(() => {
      setPage("1");
      setCurrentPart(1);
      setProgressValue(0);
      setSolutionState(false);
    }, [mode, id]);

    function getMaxPart(page, data) {
      const partsOnPage = data
        .filter((row) => row.page === page)
        .map((row) => Number(row.part));
      return Math.max(...partsOnPage, 0);
    }
    
    function next() {
        const maxPart = getMaxPart(page, levelData);
        if (currentPart < maxPart) {
            setCurrentPart((prev) => prev + 1);
        } else {
            // next page
            setPage(String(Number(page) + 1));
            setCurrentPart((prev) => prev + 1);
        }
        if (partsOnLevel > 0) setProgressValue((prev) => prev + 100 / partsOnLevel);
        setSolutionState(false);
    }

    function back() {
      const prevPage = String(Number(page) - 1);
      if (Number(prevPage) >= 1) {
        setPage(prevPage);
        setCurrentPart(getMaxPart(prevPage, levelData)); // View full page
      }
    }

    useKeyMap(next, back, mode)

    function nextLevelExists() {
      const exists = metaData.some((row) => Number(row.id) === Number(id) + 1);
      if (exists) return true;
      return false;
    }

    // If loading the level failed, show a clear not-found message.
    if (error !== null) {
      return (
          <div>Level not found</div>
      );
    }

    return (
        <div className="level-renderer-container">
          <Toolbar progressValue={progressValue} />
          {currentPart <= partsOnLevel ? (<>
          
            <div className='content'>
              <Content page={page} part={currentPart} Data={levelData} setSolutionState={setSolutionState}/>
            </div >
            {mode === 'tutorial' ? (<NavigationArrows disableBack={page < 2} onBack={back} onNext={next}/>)
                                : (<ContinueBtn stage={solutionState ? 2: 0} onContinue={next} />)
            }
            
          </>): (
              <LevelEndContent nextLevelExists={nextLevelExists()} />
            )}
        </div>
      );
}
/**
 * React component that renders the content of a level.
 * Dynamically displays text, formulas, matrices, and interactive elements
 * based on the provided data.
 *
 * @param {String} page - Current page of the level
 * @param {Number} part - Current part within the page
 * @param {Array<Object>} Data - Level data
 * @param {Function} setSolutionState - Callback to set whether the user’s solution is correct
 *
 * @returns {JSX.Element} Rendered content view for the current page and part.
 *
 * @description
 * - Filters data for the current page and part.
 * - Automatically scrolls down when a new part is loaded.
 * - Initializes and compares matrices (solution vs. user input).
 * - Uses `SolutionVerifier` to check correctness of user input.
 * - Supports multiple content types:
 *   - "title": heading text
 *   - "text": paragraph text
 *   - "katex": mathematical formulas
 *   - "StaticMatrix": static matrix display (optional with CalcButtons)
 *   - "CalcButtons": calculation buttons for matrices
 *   - "EditableMatrix": editable matrix input
 *   - "Equations": equation display
 */
function Content({ page, part, Data, setSolutionState }) {
  const containerRef = useRef(null);
  const [solutionMatrix, setSolutionMatrix] = useState([]);
  const [userMatrix, setUserMatrix] = useState([]);
  const [acceptance, setAcceptance] = useState(0);
  const [data, setData] = useState(Data.filter(row => row.page === page && Number(row.part) <= part));
  
  // compare user value with solution
  useEffect(() => {
    const isCorrect = SolutionVerifier(acceptance, solutionMatrix, userMatrix);
    setSolutionState(isCorrect);
  }, [userMatrix, acceptance, setSolutionState, solutionMatrix]);
 
  // all parts to the current part
  useEffect(() => {
    const curData = Data.filter(
      row => row.page === page && Number(row.part) <= part
    );
    setData(curData);
  }, [Data,page,part]);

  // scroll down
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [part]);
  // set solution, set user value, set acceptance
  useEffect(() => {
    // element with solution
    const rowWithSolution = data.find(row => row.solution !== undefined);
    let solMatrix = solutionMatrix;
    if (rowWithSolution) {
      if(rowWithSolution.solution === "variable"){
        solMatrix = MatrixCreator(
          matrixStairForm(Number(rowWithSolution.minRows),Number(rowWithSolution.maxRows),Number(rowWithSolution.minCols),Number(rowWithSolution.maxCols),1),
          Number(rowWithSolution.maxnum),
          [Number(rowWithSolution.denominator)]);
        setSolutionMatrix(solMatrix);
      } else{
        solMatrix = parseMatrix(rowWithSolution.solution);
        setSolutionMatrix(solMatrix);

        // element with solution and maxnum and denominator
        if (rowWithSolution.maxnum !== undefined && rowWithSolution.denominator !== undefined){
          setUserMatrix(MatrixCreator(
            solMatrix,
            Number(rowWithSolution.maxnum),
            parseArray(rowWithSolution.denominator)));
        }
        else {setUserMatrix(solMatrix);}

      }
      // element with acceptance
      if (rowWithSolution.acceptance !== undefined){
        setAcceptance(Number(rowWithSolution.acceptance));
      }
    }
  }, [data, setUserMatrix]);

  return (
    <div className="scrollable_content" ref={containerRef}>
      {data.map((row, i) => (
        <React.Fragment key={i}>
          {row.typ === "title" && <div className="titel">{row.content}</div>}
          {row.typ === "text" && <div className="text">{row.content}</div>}
          {row.typ === "katex" && (
            <InlineMath className="katex" math={row.content} />
          )}
          {row.typ === "StaticMatrix" &&
            Array.isArray(userMatrix) &&
            userMatrix.length > 0 && (
              <div style={{display: "flex",alignItems: "center",margin: "20px",}}>
                <StaticMatrix
                  data={userMatrix}
                  resultCol={toBool(row.resultcol)}
                  det={toBool(row.determinant)}
                />
                {toBool(row.calcbtns) && (
                  <CalcButtons matrix={userMatrix} setMatrix={setUserMatrix} />
                )}
              </div>
            )}
          {row.typ === "CalcButtons" && (
            <CalcButtons matrix={userMatrix} setMatrix={setUserMatrix} />
          )}
          {row.typ === "EditableMatrix" && (
            <EditableMatrix
              rows={Number(row.rows)}
              cols={Number(row.columns)}
              resultCol={toBool(row.resultcol)}
              det={toBool(row.determinant)}
              onChange={setUserMatrix}
            />
          )}
          {row.typ === "Equations" && (
            <Equations
              solMatrix={solutionMatrix}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

async function getFileData(mode, level_id){
    const res = await getFile(mode, level_id);
    if (!res.ok) throw new Error("file not found");
    const data = await res.json();
    
    const fileRes = await fetch(data.filename);
    if (!fileRes.ok) throw new Error("Level data not found");
    return await fileRes.json();

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