"use client"

import { useEffect, useState } from "react";

export function useIsAuthenticated(){
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState<Error|null>(null);
    const [data,setData] = useState<boolean|null>(null);
    
    async function checkAuth(){
        try{
        const res = await fetch(`${process.env.AuthServer}/`);
        if(res.ok){
            setData(true);
        }
        else{
            setData(false);
        }
    }
    catch(e){
        console.log("Error: "+e);
        setError(e as Error);
    }
    finally{
        setLoading(false);
    }
    }
    useEffect(()=>{
        checkAuth();
        
    })
    return {loading,error,data}
}