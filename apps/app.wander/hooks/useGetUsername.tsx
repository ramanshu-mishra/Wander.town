"use client"

import { useEffect, useState } from "react";


export function useGetUsername(){
    const [cookie,setCookie] = useState("");
    
    return cookie;
}