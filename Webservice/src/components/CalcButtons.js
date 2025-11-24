"use client";
import './CalcButtons.css'
import React, {useState} from "react";
import { fraction } from "mathjs";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { SelectButton } from "primereact/selectbutton";

import { InlineMath } from "react-katex";
import { SwitchRows, MultiplyRow, AddRows } from "./CalcFunctions";

export function CalcButtons({DisableZV = false, DisableZA = false, DisableZM = false, matrix, setMatrix}) {
  return (
    <div className="calc_btns" >
        <MultButton deactivate={DisableZM} matrix={matrix} setMatrix={setMatrix} />
        <AddButton deactivate={DisableZA} matrix={matrix} setMatrix={setMatrix} />
        <SwitchButton deactivate={DisableZV} matrix={matrix} setMatrix={setMatrix} />
    </div>
  );
}

function MultButton({ deactivate, matrix, setMatrix }){
  const dimension = matrix.length;
  const items = Array.from({ length: dimension }, (_, i) => ({
        label: `${i+1}`, value: i }
  ));

    const [visible, setVisible] = useState(false);
    const [rowValue, setRowValue] = useState(items[0].value);
    const [scalarInput, setScalarInput] = useState("1");
    const [scalarFeedback, setScalarFeedback] = useState('1');
    const [scalar, setScalar] = useState(1)

    function onConfirm(){
      const newMatrix = MultiplyRow(matrix, rowValue, scalar);
      setMatrix(newMatrix);
      setVisible(false);
    }
    function handleInput(input){
      setScalarInput(input);
      try {
        let frac;
        if(input.includes('/')) {
          // fraction
          const [num, den] = input.split('/').map(Number);
          if(!isNaN(num) && !isNaN(den) && num !== 0 && den !== 0) {
            frac = fraction(num, den);
            setScalarFeedback(num+'/'+den);
          } else {setScalarFeedback('invalid')}
        } else {
          // integer
          const num = Number(input);
          if (!isNaN(num) && num !== 0) {
            frac = fraction(num, 1);
            setScalarFeedback(num);
          } else {setScalarFeedback('invalid')}
        }
        if (frac) setScalar(frac);
      }
      catch { setScalarFeedback('invalid')}
    }

    const dialogFooter = (
        <div className='dialog_footer'>
            <Button label="Apply" icon="pi pi-check" onClick={onConfirm}/>
        </div>
    )

  return (
    <div>
      <Button
        disabled={deactivate}
        onClick={() => { setVisible(true); }}>
        <InlineMath math="\xrightarrow{\rm{ZM}_{i} (S)}" />
      </Button>

      <Dialog
        className='dialog'
        header="Multiply Row"
        visible={visible}
        onHide={() => { if (!visible) return; setVisible(false); }}
        footer={dialogFooter}>
          <div style={{marginTop: "10px"}}>
            <InlineMath math={`\\LARGE \\xrightarrow{\\rm{ZM}_{${rowValue +1}} (${scalarFeedback})}`} />
          </div>
          <table className='dialog_table'><thead>
          <tr>
              <th>Row i</th>
              <th>Scalar</th>
          </tr>
          <tr className="row_container">
            <td>
              <SelectButton className="select_btn" value={rowValue} onChange={(e) => setRowValue(e.value)} options={items}/>
            </td>
            <td>
            <input className="scalar_input" 
            type='text'
            value={scalarInput}   
            onChange={(e) => { handleInput(e.target.value)}} 
            />
            </td>
          </tr>
        </thead></table>
      </Dialog>
    </div>
  );
}

function AddButton({ deactivate, matrix, setMatrix }) {
  const dimension = matrix.length;
    const items = Array.from({ length: dimension }, (_, i) => ({
      label: `${i+1}`, value: i }
    ));

    const [visible, setVisible] = useState(false);
    const [sourceValue, setSourceValue] = useState(items[0].value);
    const [targetValue, setTargetValue] = useState(items[0].value);
    const [scalarInput, setScalarInput] = useState("1");
    const [scalarFeedback, setScalarFeedback] = useState('1');
    const [scalar, setScalar] = useState(1);

    function onConfirm() {
      const newMatrix = AddRows(matrix, sourceValue, targetValue, scalar);
      setMatrix(newMatrix);
      setVisible(false);
    }

    function handleInput(input){
      setScalarInput(input);
      try {
        let frac;
        if(input.includes('/')) {
          // fraction
          const [num, den] = input.split('/').map(Number);
          if(!isNaN(num) && !isNaN(den) && num !== 0 && den !== 0) {
            frac = fraction(num, den);
            setScalarFeedback(num+'/'+den);
          } else {setScalarFeedback('invalid')}
        } else {
          // integer
          const num = Number(input);
          if (!isNaN(num) && num !== 0) {
            frac = fraction(num, 1);
            setScalarFeedback(num);
          } else {setScalarFeedback('invalid')}
        }
        if (frac) setScalar(frac);
      }
      catch { setScalarFeedback('invalid')}
    }

    const dialogFooter = (
       <div className='dialog_footer'>
         <Button label="Apply" icon="pi pi-check" onClick={onConfirm} />
       </div>
    );

    return (
      <div>
        <Button
          disabled={deactivate}
          onClick={() => {
            setVisible(true);
          }}
        >
          <InlineMath math="\xrightarrow{\rm{ZA}_{ij} (S)}" />
        </Button>

        <Dialog
          className='dialog'
          header="Add Rows"
          visible={visible}
          onHide={() => {
            if (!visible) return;
            setVisible(false);
          }}
          footer={dialogFooter}
        >

          <div style={{marginTop: "10px"}}>
            <InlineMath math={`\\LARGE \\xrightarrow{\\rm{ZA}_{${targetValue +1}${sourceValue +1}} (${scalarFeedback})}`} />
          </div>

          <table className='dialog_table'><thead>
          <tr>
              <th>Target</th>
              <th>Source</th>
              <th>Scalar</th>
          </tr>
          <tr className="row_container">
            <td>
              <SelectButton
                className="select_btn"
                value={targetValue}
                onChange={(e) => setTargetValue(e.value)}
                options={items}
              />
            </td>

            <td>
              <SelectButton
                className="select_btn"
                value={sourceValue}
                onChange={(e) => setSourceValue(e.value)}
                options={items}
              />
            </td>

            <td>
              <input
                className="scalar_input"
                type='text'
                value={scalarInput}
                onChange={(e) => { handleInput(e.target.value)}}
              />
            </td>
          </tr>
          </thead></table>
        </Dialog>
      </div>
    );
}

function SwitchButton({ deactivate , matrix, setMatrix}) {
  const dimension = matrix.length;
  const items = Array.from({ length: dimension }, (_, i) => ({
    label: `${i+1}`, value: i }
  ));

   const [visible, setVisible] = useState(false);
   const [sourceValue, setSourceValue] = useState(items[0].value)
   const [targetValue, setTargetValue] = useState(items[0].value);

   function onConfirm() {
    const newMatrix = SwitchRows(matrix, sourceValue, targetValue);
    setMatrix(newMatrix);
    setVisible(false);
   }

   const dialogFooter = (
     <div className='dialog_footer'>
       <Button label="Apply"  icon="pi pi-check" onClick={onConfirm} />
     </div>
   );

   return (
     <div>
       <Button
         disabled={deactivate}
         onClick={() => {
           setVisible(true);
         }}
       >
         <InlineMath math="\xrightarrow{\rm{ZV}_{ij}}" />
       </Button>

       <Dialog
         className='dialog'
         header="Switch Rows"
         visible={visible}
         onHide={() => {
           if (!visible) return;
           setVisible(false);
         }}
         footer={dialogFooter}
       >

          <div style={{marginTop: "10px"}}>
            <InlineMath math={`\\LARGE \\xrightarrow{\\rm{ZV}_{${sourceValue +1}${targetValue +1}}}`} />
          </div>

          <table className='dialog_table'><thead>
            <tr>
              <th>Row i</th>
              <th>Row j</th>
            </tr>
           <tr className="row_container">
            <td>
             <SelectButton
               className="select_btn"
               value={sourceValue}
               onChange={(e) => setSourceValue(e.value)}
               options={items}
             />
            </td>
           <td>
             <SelectButton
               className="select_btn"
               value={targetValue}
               onChange={(e) => setTargetValue(e.value)}
               options={items}
             />
           </td>
           </tr>
          </thead></table>
       </Dialog>
     </div>
   );
}
