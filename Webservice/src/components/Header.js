import Link from "next/link";


export default function Header({children, home=false}){
    return(
        <div className="header" style={{
            width: '100%', height: '50px',
            background: 'var(--color4)',
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '20px', fontSize: '18px'
        }}>
            {children}
            {!home ? (<Link href={`/`} style={{
                position: 'absolute',
                right: '20px',
                width: '34px', height: '34px',
                display: 'flex', justifyContent: 'center',
                alignItems: 'center',

            }}><i className="pi pi-home" style={{
                background: 'none', border: 'none',
                fontSize: '1.5rem'
            }}/></Link>): (<></>)}
        </div>
    )
}