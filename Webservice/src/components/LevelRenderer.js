"use client";
import "../styles/LevelDesign.css"
import { InlineMath } from "react-katex";
import { StaticMatrix, EditableMatrix } from "./Matrix";
import { MatrixCreator } from "./CalcFunctions";
import React, { useState, useEffect, useRef } from "react";
import { LevelEndContent, NavigationArrows, Toolbar } from "./LevelTools";
import { CalcButtons } from "./CalcButtons";

export function LevelRenderer({mode, level_id}){

    const [levelData, setLeveldata] = useState([]);
    const [error, setError] = useState(null);
    const [metaData, setMetaData] = useState([]);

    const [matrix, setMatrix] = useState([]);

     useEffect(() => {
        fetch(`/data/${mode}/level_meta.json`)
        .then(res => res.json())
        .then(data => setMetaData(data))
      }, [mode]);

    useEffect(() => {
        getFileData(mode, level_id)
        .then(setLeveldata)
        .catch(err => setError(err.message));
    }, [mode, level_id]);
    
    const [page, setPage] = useState("1");
    const [currentPart, setCurrentPart] = useState(1);
    const [progressValue, setProgressValue] = useState(0);

    const partsOnLevel = Math.max(
        0,
        ...levelData.map((e) => Number(e.part))
    );

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
    }

    function back() {
      const prevPage = String(Number(page) - 1);
      if (Number(prevPage) >= 1) {
        setPage(prevPage);
        setCurrentPart(getMaxPart(prevPage, levelData)); // View full page
      }
    }

    function nextLevel() {
      const exists = metaData.some((row) => row.id == Number(level_id) + 1);
      if (exists) return Number(level_id) + 1;
      return null;
    }

    return (
        <div style={{minHeight: 0, flex: '1', display: 'flex', flexDirection: 'column', overflow: 'hidden'}}>
          <Toolbar mode={mode} progressValue={progressValue} />
          {currentPart <= partsOnLevel ? (<>
          
            <div className='content'>
              <Content page={page} part={currentPart} Data={levelData} matrix={matrix} setMatrix={setMatrix} />
            </div>
            <NavigationArrows disableBack={page < 2} onBack={back} onNext={next}/>
            
          </>): (
              <>
              {mode == "tutorial" && <LevelEndContent nextLevel={nextLevel()} linkMode='challenge' linkLevel={level_id} />}
              {mode == "challenge" && <LevelEndContent nextLevel={nextLevel()} linkMode='tutorial' linkLevel={level_id} />}
              </>
            )}
        </div>
      );
}

function Content({ page, part, Data, matrix, setMatrix }) {
  const containerRef = useRef(null);

  // all parts to the current part
  const data = Data.filter(
    row => row.page === page && Number(row.part) <= part
  );

  // scroll down
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [part]);
  useEffect(() => {
    const staticRow = data.find(row => row.typ === "StaticMatrix");
    if (staticRow) {
      setMatrix(MatrixCreator(
        parseMatrix(staticRow.solution),
        Number(staticRow.maxnum),
        parseArray(staticRow.denominator)));
    }
  }, [data, setMatrix]);

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
            Array.isArray(matrix) &&
            matrix.length > 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  margin: "20px",
                }}
              >
                <StaticMatrix
                  data={matrix}
                  resultCol={toBool(row.resultcol)}
                  det={toBool(row.determinant)}
                  onChange={setMatrix}
                />
                <CalcButtons matrix={matrix} setMatrix={setMatrix} />
              </div>
            )}
          {row.typ === "EditableM atrix" && (
            <EditableMatrix
              rows={Number(row.rows)}
              cols={Number(row.columns)}
              resultCol={toBool(row.resultcol)}
              det={toBool(row.determinant)}
              onChange={setMatrix}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

async function getFileData(mode, level_id){
    const res = await fetch(`/api/file-system?mode=${mode}&level_id=${level_id}`);
    if (!res.ok) throw new Error("file not found");
    const data = await res.json();
    
    const fileRes = await fetch(data.filename);
    if (!fileRes.ok) throw new Error("Level data not found");
    return await fileRes.json();

}

function parseMatrix(matrix){
  return matrix.map(row => row.map(cell => Number(cell)));
}

function parseArray(array) {
  return array.map((cell) => Number(cell));
}

function toBool(val) {
  return val === true || val === "True" || val === "true";
}