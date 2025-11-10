import './Matrix.css'

export function Matrix({data = [[1,2,3],[4,5,6],[7,8,9]], resultCol = false, editable = false}){
    
    return (
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
    )
    
}