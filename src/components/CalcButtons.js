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

export function CalcButtons({DisableZV = false, DisableZA = false, DisableZM = false, matrix, dimension}) {
  return (
    <div className="calc_btns" >
        <MultButton deactivate={DisableZM} matrix={matrix} dimension={dimension} />
        <AddButton deactivate={DisableZA} matrix={matrix} dimension={dimension}/>
        <SwitchButton deactivate={DisableZV} matrix={matrix} dimension={dimension}/>
    </div>
  );
}

function MultButton({ deactivate, matrix, dimension }){
  const items = [
        {label: 'Row 1', value: 1 },
        {label: 'Row 2', value: 2 },
        {label: 'Row 3', value: 3 }
    ];

    const [visible, setVisible] = useState(false);
    const [rowValue, setRowValue] = useState(items[0].value);
    const [scalar, setScalar] = useState(1)

    function onConfirm(){
        MultiplyRow(matrix, rowValue, scalar, dimension);
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
        <div>
            <div>
                <h4>Row</h4>
                <SelectButton className="select_btn" value={rowValue} onChange={(e) => setRowValue(e.value)} options={items}/>
            </div>

            <div>
            <h4>Scalar</h4>
            <InputNumber className="scalar_input" value={scalar} onValueChange={(e) => setScalar(e.value)} />
            </div>

        </div>
      </Dialog>
    </div>
  );
}

function AddButton({ deactivate, matrix, dimension }) {
    const items = [
       { label: "Row 1", value: 1 },
       { label: "Row 2", value: 2 },
       { label: "Row 3", value: 3 },
    ];

    const [visible, setVisible] = useState(false);
    const [sourceValue, setSourceValue] = useState(items[0].value);
    const [targetValue, setTargetValue] = useState(items[0].value)
    const [scalar, setScalar] = useState(1);

    function onConfirm() {
       AddRows(matrix, sourceValue, targetValue, scalar, dimension);
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
          <div>
            <div>
              <h4>Source</h4>
              <SelectButton
                className="select_btn"
                value={sourceValue}
                onChange={(e) => setSourceValue(e.value)}
                options={items}
              />
            </div>

            <div>
              <h4>Target</h4>
              <SelectButton
                className="select_btn"
                value={targetValue}
                onChange={(e) => setTargetValue(e.value)}
                options={items}
              />
            </div>

            <div>
              <h4>Scalar</h4>
              <InputNumber
                className="scalar_input"
                value={scalar}
                onValueChange={(e) => setScalar(e.value)}
              />
            </div>
          </div>
        </Dialog>
      </div>
    );
}

function SwitchButton({ deactivate , matrix, dimension}) {
   const items = [
     { label: "Row 1", value: 1 },
     { label: "Row 2", value: 2 },
     { label: "Row 3", value: 3 },
   ];

   const [visible, setVisible] = useState(false);
   const [sourceValue, setSourceValue] = useState(items[0].value)
   const [targetValue, setTargetValue] = useState(items[0].value);

   function onConfirm() {
     SwitchRows(matrix, sourceValue, targetValue, dimension);
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
         <InlineMath math="\xrightarrow{\rm{ZV}_{ij} (S)}" />
       </Button>

       <Dialog
         className='dialog'
         header="Multiply Row"
         visible={visible}
         onHide={() => {
           if (!visible) return;
           setVisible(false);
         }}
         footer={dialogFooter}
       >
         <div>
           <div>
             <h4>Source</h4>
             <SelectButton
               className="select_btn"
               value={sourceValue}
               onChange={(e) => setSourceValue(e.value)}
               options={items}
             />
           </div>

           <div>
             <h4>Target</h4>
             <SelectButton
               className="select_btn"
               value={targetValue}
               onChange={(e) => setTargetValue(e.value)}
               options={items}
             />
           </div>
         </div>
       </Dialog>
     </div>
   );
}
