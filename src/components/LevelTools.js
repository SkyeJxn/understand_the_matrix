import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { useState } from 'react';
import "primereact/resources/themes/nano/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import Link from 'next/link';

export default function Toolbar({mode = 'tutorial', progressValue, heartCount }){
  const isSmallScreen = typeof window !== 'undefined' && window.innerWidth < 600;
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
            background: 'var(--color2)',
            borderRadius: '12px',
            flex: '1',
          }}/>

          {/* hearts */}
          {mode == 'tutorial' ? (<div>
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