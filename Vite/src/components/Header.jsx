import { SpeedDial } from "primereact/speeddial";
import { Link } from 'react-router-dom';

/**
 * Renders the header component with home button and theme changer.
 *
 * @param {React.ReactNode} props.children - Content to be displayed inside the header.
 * @param {boolean} [props.home=false] - If true, hides the home button (for the homepage itself)
 * @returns {JSX.Element} The rendered header component.
 */
export default function Header({children, home=false}){
    return(
        <div className="header" style={{
            width: '100%', height: '50px',
            background: 'var(--color3)',
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '20px', fontSize: '18px',
            position: 'relative'
        }}>
            {children}
            <div style={{
                position: 'absolute',
                right: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
            }}>
                <div style={{width: '40px', height: '40px'}}>
                    <ThemeChanger />
                </div>
                {!home && (<Link to={`/`} style={{
                    width: '40px', height: '40px',
                    display: 'flex', justifyContent: 'center',
                    alignItems: 'center',
                }}><i className="pi pi-home" style={{
                    background: 'none', border: 'none',
                    fontSize: '1.5rem'
                }}/></Link>)}
            </div>
        </div>
    )
}

/**
 * Renders a SpeedDial component that allows the user to switch between predefined themes.
 *
 * Each SpeedDial item represents a theme option (green, blue, red) and applies the corresponding
 * CSS class to the document body when selected.
 *
 * @returns {JSX.Element} The rendered theme changer component.
 */
function ThemeChanger(){
        const items = [
        {
            label: 'green',
            icon: 'pi pi-palette',
            command: () => setTheme('theme-green'),
            style: { backgroundColor: '#66BB6A', color: 'var(--color5)' }
        },
        {
            label: 'blue',
            icon: 'pi pi-palette',
            command: () => setTheme('theme-blue'),
            style: { backgroundColor: '#1E4FA3', color: 'var(--color5)' }
        },
        {
            label: 'red',
            icon: 'pi pi-palette',
            command: () => setTheme('theme-red'),
            style: { backgroundColor: '#E53935', color: 'var(--color5)' }
        },
    ];
    return (
        <div style={{
            position: 'relative'}}>
            <SpeedDial showIcon='pi pi-palette' hideIcon='pi pi-times'
                    model={items} 
                    direction="down" 
                    radius={0}
                    buttonStyle={{ background: 'none', border: 'none',
                        color: 'var(--color5)',
                        width: '100%',height: '100%', 
                        padding: '0',margin: '0', fontSize: '1.5rem',
                        paddingTop: '3px'
                    }} 
                    style={{ width: '100%', }}
            />
        </div>
    )
}
/**
 * Applies a given theme class to the document body by removing existing theme classes
 * and adding the new one.
 *
 * @param {string} themeName - The CSS class name of the theme to apply (e.g., "theme-green").
 */
function setTheme(themeName) {
  document.body.classList.remove("theme-blue", "theme-green", "theme-red");
  document.body.classList.add(themeName);
}