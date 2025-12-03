"use client";
import Link from 'next/link';
import '../styles/LevelOverview.css'
import { useState, useEffect } from 'react';

/**
 * Component that creates the Level choosing sites
 * 
 * @param {string} mode - defines the chosen game mode 
 * @returns {JSX.Element}
 */
export default function LevelOverview({mode = "challenge"}){
  const [metaData, setMetaData] = useState([]);
  useEffect(() => {
    fetch("/data/level_meta.json")
    .then(res => res.json())
    .then(data => setMetaData(data))
  }, []);

  let levels = null;
  if(mode === 'tutorial'){
    levels = metaData.map(row => ({
      number: row.id,
      title: row.title,
      description: row.description
    }));
  } else {
      levels = metaData.map(row => ({
      number: row.id,
      title: row.title
    }));
  }

  return (
    <div id="level_container">
      {levels.map(level => (
        <LevelItem key={level.number} number={level.number} title={level.title} description={level.description} mode={mode}/>
      ))}
    </div>
  )
}

function LevelItem({ number = 1, title = 'no title', description='', mode='challenge' }){
  return(
    <div className="level_item">
      <Link href={`/${mode}/${number}`} >
        <button id={`level_${number}_btn`} type="button">
          <div className="level_btn_top">{number}</div>
          <div className="level_btn_bottom"></div>
        </button>
      </Link>
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  )
}