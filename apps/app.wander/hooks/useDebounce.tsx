"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useFetchData } from "./useFetchData";

export function useDebounce<T = unknown>(value: string , delay: number, url: string, opt ?: RequestInit){
    const [debouncedValue, setDebouncedValue] = useState<T|null>(null);
    const {fetchData,loading,error,data,reset} = useFetchData();
    const timeoutRef = useRef<NodeJS.Timeout|null>(null);
    
   
    
    useEffect(()=>{
        if(!value || value  == ""){
            setDebouncedValue(null);
            return;
        }


        if(timeoutRef.current){
            clearTimeout(timeoutRef.current);
        }
        const t = setTimeout(()=>{
        if(value.trim().includes(" ")){
            setDebouncedValue({verdict: null} as T)
        }
        else
        fetchData(url, opt);
        },delay);
        
        timeoutRef.current = t;
        return ()=>{
            if(timeoutRef.current)clearTimeout(timeoutRef.current);
        }
    },[value, delay]);

    useEffect(()=>{
        if(data){
            setDebouncedValue(data as T);
        }
        reset();
    }, [data,error]);

     const _reset = useCallback(() => {
            setDebouncedValue(null);
        }, []);

    return {debouncedValue, loading, error, reset:_reset};
}