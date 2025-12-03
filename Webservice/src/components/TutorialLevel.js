"use client";
import '../styles/TutorialLevel.css'
import { InlineMath } from 'react-katex';
import { useState, useEffect } from "react";
import {LevelEndContent, NavigationArrows, Toolbar} from './LevelTools';
import React from "react";

/**
 * Component that renders the content of a given Level
 * 
 * @param {number} level_id - Passes the Level Number
 * @returns {JSX.Element}
 */
export function TutorialLevel({ level_id = "1" }) {

  const [tutorialData, setTutorialData] = useState([]);
  const [metaData, setMetaData] = useState([]);

  useEffect(() => {
    fetch("/data/level_meta.json")
    .then(res => res.json())
    .then(data => setMetaData(data))
  }, []);

  useEffect(() => {
    fetch(`/data/tutorial/tutorial_data_${Number(level_id)}.json`)
    .then(res => res.json())
    .then(data => setTutorialData(data))
  }, []);

  const [page, setPage] = useState("1");
  const [currentPart, setCurrentPart] = useState(1);
  const [progressValue, setProgressValue] = useState(0);

  // number of parts in the level
  const partsOnLevel = Math.max(0, ...tutorialData
      .map(e => Number(e.part))
  );

  // number of parts on a page
  function getMaxPart(page) {
    const partsOnPage = tutorialData
      .filter(row => row.page === page)
      .map(row => Number(row.part));
    return Math.max(...partsOnPage, 0);
  }

  function next() {
    const maxPart = getMaxPart(page);
    if (currentPart < maxPart) {
      setCurrentPart(prev => prev + 1);
      
    } else {
      // next page
      setPage(String(Number(page) + 1));
      setCurrentPart(prev => prev + 1);
    }
    if (partsOnLevel > 0) setProgressValue(prev => prev + (100/partsOnLevel));
  }

  function back() {
    const prevPage = String(Number(page) - 1);
    if (Number(prevPage) >= 1) {
      setPage(prevPage);
      setCurrentPart(getMaxPart(prevPage)); // View full page
    }
  }

  function nextLevel(){
    const exists = metaData.some(row => row.id == (Number(level_id)+1));
    if(exists) return (Number(level_id)+1);
    return null;
  }

  return (
    <div>
      <Toolbar mode='tutorial' progressValue={progressValue} />
      {currentPart <= partsOnLevel ? (<>
      
        <div className='content'>
          <Content page={page} part={currentPart} tutorialData={tutorialData} />
        </div>
        <NavigationArrows onBack={back} onNext={next}/>
        
      </>): (
        <LevelEndContent nextLevel={nextLevel()}/>
        )}
    </div>
  );
}

function Content({ page, part, tutorialData }) {
  // all parts to the current part
  const data = tutorialData.filter(
    row => row.page === page && Number(row.part) <= part
  );

  return (
    <div>
      {data.map((row, i) => (
        <React.Fragment key={i}>
          {row.typ === "title" && <div className='titel'>{row.content}</div>}
          {row.typ === "text" && <div className='text'>{row.content}</div>}
          {row.typ === "katex" && <InlineMath className='katex' math={row.content} />}
        </React.Fragment>
      ))}
    </div>
  );
}