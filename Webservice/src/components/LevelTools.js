"use client";
import { useState, useEffect, useMemo } from "react";
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { ButtonGroup } from 'primereact/buttongroup';
import Link from 'next/link';

/**
 * Component that Renders a dynamic progress bar
 * 
 * @param {String} mode - 'tutorial' or 'challenge'
 * @param {function} progressValue - progress bar value (0 - 100) 
 * @param {function} heartCount - only challenge: number of hearts (5 - 0) 
 * @param {boolean} isSmallScreen - relevant for heartCount, but should actually be determined automatically
 * @returns {JSX.Element}
 */
export function Toolbar({mode = 'tutorial', progressValue, heartCount=5, isSmallScreen=true }){
  // const isSmallScreen = typeof window !== 'undefined' && window.innerWidth < 600;
  return(
      <div>
        <div className="toolbar" style={{
          display: 'flex',
          width: '100%',
          gap: '20px',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}>
            
          <Link href={`/${mode}`}><Button style={{
            background: 'none', border: 'none',
            color: 'var(--color3)',
            padding: 0, margin: 0,
          }}><i className="pi pi-times" style={{ fontSize: '2.5rem' }}></i></Button></Link>
          
          <ProgressBar value={progressValue}  showValue={false} style={{
            background: 'var(--color3)',
            borderRadius: '12px',
            flex: '1',
          }}/>

          {/* hearts */}
          {mode == 'challenge' ? (<div>
            {isSmallScreen ? (
              // small screen
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <i className='pi pi-heart-fill' style={{ fontSize: '2.5rem', color: 'var(--color3)' }}></i>
                <span style={{
                  position: 'absolute', top: '50%', left: '50%', 
                  transform: 'translate(-50%, -50%)',
                  color: 'var(--color2)', fontSize: '1.4rem', fontWeight: 'bold',
                  }}>{heartCount}</span>
              </div>
              )
              :(
              // big screen
              <div>
                {Array.from({ length: 5 }).map((_, i) => (
                  <i key={i} className={i+1 > heartCount ? "pi pi-heart": "pi pi-heart-fill"} style={{
                    fontSize: '2.5rem', padding: '5px',
                    color: 'var(--color3)'}}
                  />
                ))}
              </div>
            )}
          </div>): (<div></div>)}

        </div>
        
        <style>{`
          /* inside */
          .p-progressbar .p-progressbar-value {
            background-color: var(--color4); 
            border-radius: 12px;      
          }
        `}</style>
      </div>
    )
}

/**
 * Component that Renders a Forward and a Backward Arrow
 * 
 * @param {boolean} props.disableBack - if true: backward button disabled
 * @param {function} props.onBack - Callback-function for the backward button
 * @param {function} props.onNext - Callback-function for the forward button
 * @returns {JSX.Element}
 */
export function NavigationArrows({disableBack, onBack, onNext}){
  return (
    <div className='navigator_btn' style={{
          alignItems: 'center', justifyContent: 'center',
          display: 'flex', gap: '20px',
          width: '100%', margin: '5px'
          }}>
      <button onClick={onBack}>
        <i className="pi pi-arrow-left" style={{ 
          fontSize: '2.5rem',
          opacity: disableBack ? 0.3 : 1,
          cursor: disableBack ? 'auto' : "pointer",
          }}></i>
      </button>
      <button onClick={onNext}>
        <i className="pi pi-arrow-right" style={{ fontSize: '2.5rem', cursor: 'pointer' }}></i>
      </button>
    </div>
  )
}

/**
 * Component that renders a congratulation, a repeat level button and a next level buttons
 * 
 * @param {number} nextLevel - next level id, **null** if there is no next level!
 * @param {String} linkMode - which mode should be linked to ('tutorial','challenge')
 * @param {String} linkLevel - which level should be linked to ('1','2',...)
 * @returns {JSX.Element}
 */
export function LevelEndContent({nextLevel = null, linkMode, linkLevel}){

  const congratsList = useMemo(() => [
    "Finished!",'Exercise complete!',
    "Completed!",'Lesson complete!',
    "Well done!","Level Done!",
    "You did it!","Level complete!"
  ], []);

  const [congrats, setCongrats] = useState([]);
  useEffect(() =>{
    setCongrats(congratsList[Math.floor(Math.random() * congratsList.length)]);
  },[congratsList]);

  if(congrats) return(
    <div>
    <div style={{height: '70vh'}}>
      <div className='end_content'>
        <h1>{congrats}</h1>

      <ButtonGroup>
        <Button icon='pi pi-arrow-left' label='repeat level' onClick={() => window.location.reload()}></Button>
        <Link href={`/${linkMode}/${linkLevel}`}>
          <Button label={`${linkMode}`} icon={linkMode === 'challenge' ? ('pi pi-graduation-cap'): ('pi pi-info-circle')} iconPos='right'></Button>
        </Link>
        {nextLevel && 
        <Link href={`${nextLevel}/`}>
          <Button label='next level' icon='pi pi-arrow-right' iconPos='right'></Button>
        </Link>}

      </ButtonGroup>
      </div>
    </div>
    <style>{`
      .end_content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%); /* feste Zentrierung */
        text-align: center;
        animation: popIn 0.3s ease-in;
      }
      .end_content h1 {
        font-size: 50px;
        color: var(--color3);
      }
      @keyframes popIn {
        from { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
        to   { transform: translate(-50%, -50%) scale(1);   opacity: 1; }
      }
      Button {
        color: var(--color3);
        border: 1.8px solid var(--color3);
        padding: 4px 7px;
        margin: 10px;
      }

    `}</style>
    
    </div>
  )
}