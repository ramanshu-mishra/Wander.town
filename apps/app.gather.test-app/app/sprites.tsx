"use client"
import { useEffect, useState } from "react";
import { usePosition } from "./store"

export default function Sprite({userid}: {userid:string}){
    const {positions} = usePosition();
    const [positionUser, setPositionUser] = useState(positions[userid]);
    useEffect(()=>{
        if(positions[userid] != positionUser)
        setPositionUser(positions[userid]);
    }, [positions]);
    return(
        <span className="relative"
        style={{
            left: positionUser?.x ?? 0,
            bottom: positionUser?.y ?? 0
        }}
        >
            <h1>A</h1>
        </span>
    )
}