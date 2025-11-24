import Link from 'next/link';
import './LevelOverview.css'
export default function LevelOverview({mode = "challenge"}){
    // tutorial content
    const tutorial_levels = [
    { number: 1, title: "What's a Matrix?", description: 'system of linear equations, homogeneous LGS' },
    { number: 2, title: 'Elementary row operations', description: '(ZV, ZM, ZA)' },
    { number: 3, title: 'Solution sets', description: 'no, one, infinite' },
    { number: 4, title: 'Gauss-jordan algorithm', description: '(without a strategy)' },
    { number: 5, title: 'Vector spaces', description: 'Addition and scalar multiplication' },
  ];
  // challenge content
  const challenge_levels = [
    { number: 1, title: 'Basic definitions' },
    { number: 2, title: 'Gauss-Jordan algorithm' },
    { number: 3, title: 'Vector spaces' },
    { number: 4, title: '' },
    { number: 5, title: '' },
  ];
  const levels = mode === "tutorial" ? tutorial_levels : challenge_levels;
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