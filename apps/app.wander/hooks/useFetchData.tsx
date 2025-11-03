"use client"

import { useCallback, useState } from "react"

export function useFetchData<T = unknown>(){
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async (url: string, options?: RequestInit) => {
        setData(null);
        setError(null);
        setLoading(true);
        
        try {
            const res = await fetch(url, options);
            const json = await res.json();
            setData(json);
            if (!res.ok) {
                // Include status and statusText for better error context
                throw new Error(
                    `HTTP ${res.status}: ${res.statusText}`,
                    json    
                );
            }
            
            
            return json; 
        } catch (e) {
            const errorObj = e instanceof Error 
                ? e 
                : new Error("An unexpected error occurred");
            setError(errorObj);
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