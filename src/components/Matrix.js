import './Matrix.css'

export function Matrix({data = [[1,2,3],[4,5,6],[7,8,9]], resultCol = false, editable = false, det = false}){
    
    return (
        <div className='matrix_wrapper'>
            <svg viewBox="0 0 20 100" preserveAspectRatio="none">
                <path d="M20,0 Q0,50 20,100" />
            </svg>
            <table className="matrix"><tbody>
                {data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {row.map((value, colIndex) => (
                            <td key={colIndex}>
                                {value}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody></table>
            <svg viewBox="0 0 20 100" preserveAspectRatio="none">
                <path d="M0,0 Q20,50 0,100" />
            </svg>
        </div>
        
    )
    
}