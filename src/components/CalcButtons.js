"use client";
import './CalcButtons.css'
import 'primeicons/primeicons.css';     
import React, {useState} from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { SelectButton } from "primereact/selectbutton";
import { InputNumber } from "primereact/inputnumber";
import "katex/dist/katex.min.css";
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
        label: `${matrix[i].join(" ")}`, value: i }
  ));

    const [visible, setVisible] = useState(false);
    const [rowValue, setRowValue] = useState(items[0].value);
    const [scalar, setScalar] = useState(1)

    function onConfirm(){
      const newMatrix = MultiplyRow(matrix, rowValue, scalar);
      setMatrix(newMatrix);
      setVisible(false);
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
            <InlineMath math={`\\LARGE \\xrightarrow{\\rm{ZM}_{${rowValue +1}} (${scalar})}`} />
          </div>
          <table className='dialog_table'><thead>
          <tr>
              <th></th>
              <th>Row i</th>
              <th>Scalar</th>
          </tr>
          <tr className="row_container">
            <td>
              {items.map(items => (<div className='row_index' key={items.value}>{items.value +1}</div>))}
            </td>
            <td>
              <SelectButton className="select_btn" value={rowValue} onChange={(e) => setRowValue(e.value)} options={items}/>
            </td>
            <td>
            <InputNumber className="scalar_input" 
            mode="decimal" value={scalar} 
            minFractionDigits={0}
            onValueChange={(e) => { if (e.value !== 0 && e.value !== null) setScalar(e.value)}} />
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
      label: `${matrix[i].join(" ")}`, value: i }
    ));

    const [visible, setVisible] = useState(false);
    const [sourceValue, setSourceValue] = useState(items[0].value);
    const [targetValue, setTargetValue] = useState(items[0].value)
    const [scalar, setScalar] = useState(1);

    function onConfirm() {
      const newMatrix = AddRows(matrix, sourceValue, targetValue, scalar);
      setMatrix(newMatrix);
      setVisible(false);
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
            <InlineMath math={`\\LARGE \\xrightarrow{\\rm{ZA}_{${sourceValue +1}${targetValue +1}} (${scalar})}`} />
          </div>

          <table className='dialog_table'><thead>
          <tr>
              <th></th>
              <th>Target</th>
              <th>Source</th>
              <th>Scalar</th>
          </tr>
          <tr className="row_container">
            <td >
              {items.map(items => (<div className='row_index' key={items.value}>{items.value +1}</div>))}
            </td>
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
              <InputNumber
                className="scalar_input"
                value={scalar}
                mode="decimal"
                minFractionDigits={0}   // mindestens 1 Nachkommastelle
                maxFractionDigits={10}   
                onValueChange={(e) => { if (e.value !== 0 && e.value !== null) setScalar(e.value)}}
                locale='en-US'
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
    label: `${matrix[i].join(" ")}`, value: i }
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
              <th></th>
              <th>Row i</th>
              <th>Row j</th>
            </tr>
           <tr className="row_container">
            <td >
              {items.map(items => (<div className='row_index' key={items.value}>{items.value +1}</div>))}
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
