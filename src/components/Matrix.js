import './Matrix.css'
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

export function StaticMatrix({data = [[1,2,3],[4,5,6],[7,8,9]], resultCol = false, det = false}){
  const cols = data[0].length;
  const colFormat = resultCol ? 'c'.repeat(cols - 1) + '|c': 'c'.repeat(cols);

  const rows = data.map(row => {
    if (resultCol) {return row.slice(0, -1).join(' & ') + ' & ' + row[row.length - 1];} 
    else {return row.join(' & ');}
  }).join(' \\\\ ');

  const bracketLeft = det ? "|": "("
  const bracketRight = det ? "|": ")"

  const latexMatrix = `
    \\left${bracketLeft}
    \\begin{array}{${colFormat}}
    ${rows}
    \\end{array}
    \\right${bracketRight}
  `;
  
  return (
    <div className='matrix'>
        <InlineMath math={latexMatrix} />      
    </div>
  );
}

