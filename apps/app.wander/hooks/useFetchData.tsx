"use client"

import { useCallback, useState } from "react"

interface statusInterface{
    ok: boolean,
    status: number,
    statusText: string
}

export function useFetchData<T = unknown>(){
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [status,setStatus] = useState<statusInterface|null>(null);

    const fetchData = useCallback(async (url: string, options?: RequestInit) => {
        setData(null);
        setError(null);
        setLoading(true);
        setStatus(null);
        
        try {
            const res = await fetch(url, options);
            setStatus({
                ok: res.ok,
                status: res.status,
                statusText: res.statusText
            });
            const json = await res.json();
            // can be accessed throw e.message.message, e.message.json
            if (!res.ok) {
                // Include status and statusText for better error context
                throw new Error(JSON.stringify({
                    status: res.status,
                    json : json
                })  
                );
            }
            
            setData(json);
            return json; 
        } catch (e) {
            const errorObj = e instanceof Error 
                ? e 
                : new Error("An unexpected error occurred");
            setError(errorObj);
        } finally {
            setLoading(false);
        }
        return null;
    }, []);

    const reset = useCallback(() => {
        setData(null);
        setError(null);
        setLoading(false);
        setStatus(null);
    }, []);

    return { data, loading, error, fetchData, reset,status };
}