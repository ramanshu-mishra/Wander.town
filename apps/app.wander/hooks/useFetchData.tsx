"use client"

import { useCallback, useState } from "react"
import {FetchError} from "@repo/utils/FetchError";

export function useFetchData<T = unknown>(){
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error |FetchError| null>(null);
  

    const fetchData = useCallback(async (url: string, options?: RequestInit) => {
        setData(null);
        setError(null);
        setLoading(true);
        
        
        try {
            const res = await fetch(url, options);
           
            const json = await res.json();
            if (!res.ok) {
                throw new FetchError(res.status, res.statusText, json);
            }
            
            setData(json);
            return json; 
        } catch (e) {
            console.log("here baby");
            const errorObj = (e instanceof Error || e instanceof FetchError)  ? e  : new Error("An unexpected error occurred");
            setError(errorObj);
            throw errorObj;     
        } finally {
            setLoading(false);
        }
    }, []);

    const reset = useCallback(() => {
        setData(null);
        setError(null);
        setLoading(false);
      
    }, []);

    return { data, loading, error, fetchData, reset };
}