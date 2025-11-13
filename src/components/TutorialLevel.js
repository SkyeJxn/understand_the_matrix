"use client";
import './TutorialLevel.css'
import tutorial_data from "./tutorial_data.json"
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { useState } from "react";

export function TutorialLevel({ level_id = "1" }) {
  const [page, setPage] = useState("1");
  const [currentPart, setCurrentPart] = useState(1);

  // number of parts on a page
  function getMaxPart(page) {
    const partsOnPage = tutorial_data
      .filter(row => row.id === level_id && row.page === page)
      .map(row => Number(row.part));
    return Math.max(...partsOnPage);
  }

  function next() {
    const maxPart = getMaxPart(page);
    if (currentPart < maxPart) {setCurrentPart(prev => prev + 1);
    } else {
      setPage(String(Number(page) + 1));
      setCurrentPart(1);
    }
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
      <div className='navigator_btn'>
        <button onClick={back}>Back</button>
        <button onClick={next}>Next</button>
      </div>
      <div className='content'>
        {Array.from({ length: currentPart }, (_, i) => (
          <Content key={i} id={level_id} page={page} part={String(i + 1)} />
        ))}
      </div>
      <div className='navigator_btn'>
        <button onClick={back}>Back</button>
        <button onClick={next}>Next</button>
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
          {row.typ === "titel" && <h2>{row.content}</h2>}
          {row.typ === "text" && <p>{row.content}</p>}
          {row.typ === "katex" && <InlineMath math={row.content} />}
        </div>
      ))}
    </div>
  );
}
