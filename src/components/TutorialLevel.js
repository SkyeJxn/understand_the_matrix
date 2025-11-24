"use client";
import './TutorialLevel.css'
import tutorial_data from "../data/tutorial_data.json"
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { useState } from "react";

import "primereact/resources/themes/nano/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import {LevelEndContent, NavigationArrows, Toolbar} from './LevelTools';


export function TutorialLevel({ level_id = "1" }) {
  const [page, setPage] = useState("1");
  const [currentPart, setCurrentPart] = useState(1);
  const [progressValue, setProgressValue] = useState(0);

  // number of parts in the level
  const partsOnLevel = Math.max(
    ...tutorial_data
      .filter(e => e.id === level_id)
      .map(e => Number(e.part))
  );

  // number of parts on a page
  function getMaxPart(page) {
    const partsOnPage = tutorial_data
      .filter(row => row.id === level_id && row.page === page)
      .map(row => Number(row.part));
    return Math.max(...partsOnPage);
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
    setProgressValue(prev => prev + (100/partsOnLevel));
  }

  function back() {
    const prevPage = String(Number(page) - 1);
    if (Number(prevPage) >= 1) {
      setPage(prevPage);
      setCurrentPart(getMaxPart(prevPage)); // View full page
    }
  }

  function nextLevel(){
    const exists = tutorial_data.some(row => row.id == (Number(level_id)+1));
    if(exists) return (Number(level_id)+1);
    return null;
  }

  return (
    <div>
      <Toolbar mode='tutorial' progressValue={progressValue} />
      {currentPart <= partsOnLevel ? (<>
      
        <div className='content'>
          <Content id={level_id} page={page} part={currentPart} />
        </div>
        <NavigationArrows onBack={back} onNext={next}/>
        
      </>): (
        <LevelEndContent nextLevel={nextLevel()}/>
        )}
    </div>
  );
}
import React from 'react';
function Content({ id, page, part }) {
  // all parts to the current part
  const data = tutorial_data.filter(
    row => row.id === id && row.page === page && Number(row.part) <= part
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
