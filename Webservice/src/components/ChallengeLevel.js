"use client";
import { InlineMath } from "react-katex";
import { StaticMatrix, EditableMatrix } from "./Matrix";
import { useState, useEffect, React } from "react";
import { LevelEndContent, NavigationArrows, Toolbar } from "./LevelTools";

export function ChallengeLevel({level_id = '01'}){

    const [levelData, setLeveldata] = useState([]);
    const [error, setError] = useState([]);

    useEffect(() => {
        getFileData(level_id)
        .then(setLeveldata)
        .catch(err => setError(err.message));
    }, [level_id]);

    if (error) return <div>Error: {error}</div>
    if (!levelData) return <div>loading...</div>
    
    return (
        <div>
            <pre>{JSON.stringify(levelData, null, 2)}</pre>
        </div>
    )
}

async function getFileData(level_id){
    const res = await fetch(`api/filesystem?mode=challenge&level_id=${level_id}`);
    if (!res.ok) throw new Error("file not found");
    const data = await res.json();
    
    const fileRes = await fetch(data.filename);
    if (!fileRes.ok) throw new Error("Level data not found");
    return await fileRes.json();

}