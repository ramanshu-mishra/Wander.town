"use client"
import Image from "next/image"
import googleLogo from "@/public/assets/google.png"
import Button from '@/components/Button'
import { cn } from "@/utils/cn"
import { DetailedHTMLProps, Dispatch, InputHTMLAttributes, SetStateAction, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useDebounce } from "@/hooks/useDebounce"
import Spinner from "@/components/spinner"
import Link from "next/link"
import {motion} from "motion/react"

interface userVerdict{
    verdict: boolean|null
}

export default function Login(){
    const router = useRouter()
    const [username,setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name,setName] = useState("");
    const [exists, setExists] = useState<boolean|null>(null);
    const [error,setError] = useState<Error|null>(null);

    const {debouncedValue, loading, reset } = useDebounce(username, 200, `${process.env.NEXT_PUBLIC_AuthServer}/userExists`, {
        headers : {
            username
        }
    }) as { debouncedValue: userVerdict | null; loading: boolean;reset: ()=>void};

    useEffect(()=>{
        if(debouncedValue){
            // console.log(debouncedValue);
            setExists((debouncedValue as userVerdict).verdict);
        }
        else setExists(null);
    }, [debouncedValue]);

    useEffect(()=>{
        if(loading)reset();
    },[loading])
    
    async function Auth({opt}:{opt: "local" | "google"}){
        if(opt == "local"){
            try{
            const res = await fetch(`${process.env.NEXT_PUBLIC_AuthServer}/signUp`, {
                method: "POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name : name.trim(),
                    username: username.trim(),
                    password
                })
            });

            if(res.ok){
                router.push("/login");
            }
            else{
                setError(new Error("Unexpected Error"));
            }
        }
        catch(e){
           if(e instanceof Error)setError(e) 
            else setError(new Error("Server Side Error"));
        }
        }
        else if(opt == "google"){
            console.log(process.env.NEXT_PUBLIC_AuthServer)
            const width = 500;
  const height = 600;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;
 window.addEventListener("message", (event) => {
    console.log(event.origin);
    if (event.origin !== `http://localhost:3000`){console.log("returned"); return;} // security check
    console.log("yesss");
    const { token } = event.data;
    console.log(token);
    if (token) {
        console.log(token);
      localStorage.setItem("token", token);
    }
     popup?.close();
      window.location.href = "/dashboard"; 
  });
    const popup =   window.open(
    `${process.env.NEXT_PUBLIC_AuthServer}/auth/google`,
    "GoogleSignIn",
    `width=${width},height=${height},left=${left},top=${top},status=no,toolbar=no,menubar=no,scrollbars=yes,resizable=yes`
  );
        }
    }
    
    return (
        <div className=" flex flex-col items-center justify-center min-h-screen gap-4">
          
            <div className="text-[4rem] font-normal tracking-widest select-none">WANDER </div>
            <div className="flex flex-col gap-8  w-sm items-center">
                <div className="font-poppins font-bold text-neutral-700">Welcome to Wander</div>
                <div className="flex flex-col gap-4  justify-center items-center  w-3/4">
                         <Button onClick={()=>Auth({opt: "google"})} className=" px-3 py-1 justify-center w-full flex items-center tracking-wide bg-neutral-50 "><Image src={googleLogo} alt="googleLogo" width={25}></Image> Continue with Google</Button>
                         <div className="text-neutral-500 w-full flex justify-center">or</div>
                         <div className="flex flex-col gap-3 w-full">
                           
                            <InputBox onChange={setName} value={name} className="w-full flex justify-center placeholder:text-sm focus:outline-1 focus:outline-neutral-500" type="text" placeholder="Enter your Name"></InputBox>
                            <div className="flex gap-2 relative">
                               
                            <InputBox onChange={setUsername} value={username} className="w-full flex justify-center placeholder:text-sm focus:outline-1 focus:outline-neutral-500" type="text" placeholder="Enter your UserName "></InputBox>
                            <div className="absolute right-1 top-1/7">
                                {loading && <Spinner width={"1.5rem"} color={"var(--color-green-400)"}></Spinner>}
                            <div className="absolute right-0 translate-x-[110%] -top-1 whitespace-nowrap px-2 py-1 rounded">
                                
                                {!loading && exists === false && <div className="flex items-center text-green-400 ">username available</div>}
                                
                                {!loading && exists === true && <div className="flex items-center text-red-400 ">username exists</div>}

                                {!loading && debouncedValue && exists === null && <div className="flex items-center text-red-400 ">Invalid username</div>}

                            </div>
                            </div>
                            </div>
                           
                            <InputBox onChange={setPassword} value={password} type="text" className="w-full placeholder:text-sm ring-0 focus:outline-1 focus:outline-neutral-500" placeholder="Enter your password"></InputBox>
                            <Button onClick={()=>{
                                Auth({opt: "local"});
                                setUsername(""); setName(""); setPassword("");
                            }} className="w-full tracking-tight flex justify-center text-neutral-50 bg-blue-600 text-sm font-semibold px-3 py-2">Register</Button>
                            
                            
                            <Link href={"/login"} className="flex justify-center text-neutral-500">
                                  <motion.div 
                                  whileHover={{scale:1.05}}
                                  whileTap={{scale:0.95}}
                                  >
                                    already a user?
                                    </motion.div>  
                                </Link>
                         </div>
                </div>
               
            </div>
        </div>
    )
}


type InputBoxProps = {
    type:string,
  className?: string;
  onChange?: Dispatch<SetStateAction<string>>;
  value?: string;
} & Omit<DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, 'onChange' | 'value' | 'type' | 'className'>;

function InputBox({type, className, onChange, value, ...opt}:InputBoxProps){
    return (
        <input {...opt} type={type} onChange={onChange ? (e)=>onChange(e.target.value) : ()=>{}}   value = {value} className= {cn("rounded-lg px-3 py-1 bg-neutral-50",className )}></input>
    )
}