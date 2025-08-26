"use client";
import { useFetchData } from "@/hooks/fetchData";
import { useEffect } from "react";

export default function Spaces() {
  const { loading, data, error, fetchData } = useFetchData();

  useEffect(() => {
    fetchData("http://localhost:3000/spaces/all");
  }, []);

  return (
    <div>
      {loading && (
        <div className="flex justify-center items-center">Loading ...</div>
      )}
      {data && <div>{JSON.stringify(data, null, 2)}</div>}
      {error && (
        <div className="flex justify-center items-center">{error.message}</div>
      )}
    </div>
  );
}
