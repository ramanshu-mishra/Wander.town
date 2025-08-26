import { useState } from "react";

export function useFetchData() {
  const [data, setData] = useState<null|object>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null|Error>(null);

  const fetchData = async (url:string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url, {method: "GET", credentials: "include"});
      if (!res.ok) throw new Error("Network error");
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Server Side Error"));
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchData };
}
