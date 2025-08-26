"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Myspaces from "./components/mySpaces";

function getCookie(name:string) {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    // Does this cookie string begin with the name we want?
    if (cookie.startsWith(name + '=')) {
      return cookie.substring(name.length + 1);
    }
  }
  return null; // Cookie not found
}
export default function DashBoard(){
  const router = useRouter();
  const [session,setSession] = useState(false);
  useEffect(()=>{
    const cookie = getCookie("connect.sid");
    if(cookie){
      setSession(true);
    }
    else{
      router.push("/login")
    }
  },[]);

  

  
  return (
    <div className="h-screen w-screen bg-blue-200 flex ">
      <div>
          <Myspaces></Myspaces>
      </div>
    </div>
  )
}