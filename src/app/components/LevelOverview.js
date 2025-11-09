import './LevelOverview.css'
export default function LevelOverview(){
  const levels = [
    { number: 1, description: 'Koeffizientenmatrix' },
    { number: 2, description: 'Elementare Zeilenoperationen (ZV, ZM, ZA)' },
    { number: 3, description: 'Losungsmengen' },
    { number: 4, description: 'Gauß-Algorithmus' },
    { number: 5, description: 'Gauß-Jordan-Algorithmus' },
  ];

  return (
    <div id="level_container">
      {levels.map(level => (
        <LevelItem key={level.number} number={level.number} description={level.description} />
      ))}
    </div>
  )
}

function LevelItem({ number = 1, description = 'no description' }){
  return(
    <div className="level_item">
      <button id={`level_${number}_btn`} type="button">
        <div className="level_btn_top">{number}</div>
        <div className="level_btn_bottom"></div>
      </button>
      <p>{description}</p>
    </div>
  )
}