"use client";
import './TutorialLevel.css'
import tutorial_data from "./tutorial_data.json"
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { useState } from "react";

import "primereact/resources/themes/nano/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import Toolbar from './LevelTools';


export function TutorialLevel({ level_id = "1" }) {
  const [page, setPage] = useState("1");
  const [currentPart, setCurrentPart] = useState(1);
  const [progressValue, setProgressValue] = useState(0);
  const [heartCount, setheartCount] = useState(5);


  const partsOnLevel = tutorial_data.filter(row => row.id === level_id).length;

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
      setPage(String(Number(page) + 1));
      setCurrentPart(1);
    }
    setProgressValue(prev => prev + (100/partsOnLevel));
    setheartCount(prev => prev - 1);
  }

  function back() {
    const prevPage = String(Number(page) - 1);
    if (Number(prevPage) >= 1) {
      setPage(prevPage);
      setCurrentPart(getMaxPart(prevPage)); // View full page
    }
  }

  return (
    <div>
      <Toolbar mode='tutorial' progressValue={progressValue} heartCount={heartCount}/>

      <div className='content'>
        {Array.from({ length: currentPart }, (_, i) => (
          <Content key={i} id={level_id} page={page} part={String(i + 1)} />
        ))}
      </div>
      <div className='navigator_btn'>
        <button onClick={back}><i className="pi pi-arrow-left" style={{ fontSize: '2.5rem' }}></i></button>
        <button onClick={next}><i className="pi pi-arrow-right" style={{ fontSize: '2.5rem' }}></i></button>
      </div>
    </div>
  );
}

function Content({ id, page, part }) {
  const data = tutorial_data.filter(
    row => row.id === id && row.page === page && row.part === part
  );

  return (
    <div>
      {data.map((row, i) => (
        <div key={i}>
          {row.typ === "titel" && <div className='titel'>{row.content}</div>}
          {row.typ === "text" && <div className='text'>{row.content}</div>}
          {row.typ === "katex" && <InlineMath className='katex' math={row.content} />}
        </div>
      ))}
    </div>
  );
}
