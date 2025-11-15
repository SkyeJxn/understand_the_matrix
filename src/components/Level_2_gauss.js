"use client";
import React, { useState } from "react";
import { CalcButtons } from "@/components/CalcButtons";
import { StaticMatrix } from "@/components/Matrix";


export default function Gauss() {
    const [matrix, setMatrix] = useState([
    [1,2,4],
    [2,5,1],
    [2,5,4],
    [2,5,4]
  ]);
  return (
    <div>
        <div style={{display: "flex", alignItems: "center", margin: "20px"}}>
          <StaticMatrix data={matrix}/>
          <CalcButtons matrix={matrix} setMatrix={setMatrix}/>
        </div>
    </div>
  );
}