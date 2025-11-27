"use client";
import React, { useState } from "react";
import { CalcButtons } from "@/components/CalcButtons";
import { StaticMatrix } from "@/components/Matrix";
import { MatrixCreator } from "./CalcFunctions";


export default function Gauss() {

  const result =[
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ];
  
  
  const [matrix, setMatrix] = useState(MatrixCreator(result, 1, 2, 1));

  return (
    <div>
        <div style={{display: "flex", alignItems: "center", margin: "20px"}}>
          <StaticMatrix data={matrix}/>
          <CalcButtons matrix={matrix} setMatrix={setMatrix}/>
        </div>
    </div>
  );
}