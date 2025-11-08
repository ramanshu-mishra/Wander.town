"use client"
import { useIsAuthenticated } from "@/hooks/isAuthenticated";
import Loading from "@/page/loading";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function DashBoard(){
  const router = useRouter();
  const {loading,error,data} = useIsAuthenticated();

  useEffect(()=>{
    if(error || data == false){
      router.push("/login");
    }
    if(data == true){
      router.push("/dashboard");
    }
  },[data,error,loading]);
  
  return (
    <div>
        {<Loading></Loading>}
    </div>
  )
}