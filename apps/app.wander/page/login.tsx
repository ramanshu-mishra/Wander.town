"use client"
import Image from "next/image"
import googleLogo from "@/public/assets/google.png"
import Button from '@/components/Button'
import { cn } from "@/utils/cn"
import { DetailedHTMLProps, Dispatch, InputHTMLAttributes, SetStateAction, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {motion} from "motion/react"



export default function Login(){
    const router = useRouter();
    const [username,setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error,setError] = useState<Error|null>(null);


    async function Auth({opt}:{opt: "local" | "google"}){
        if(opt == "local"){
            try{
            const res = await fetch(`${process.env.NEXT_PUBLIC_AuthServer}/login`, {
                method: "POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    password
                })
            });

            if(res.ok){
                router.push("/dashboard");
            }
            else{
                setError(new Error("Invalid UserName or Password"));
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
                <div className="font-poppins font-bold text-neutral-700">LogIn to your Wander account</div>
                <div className="flex flex-col gap-4  justify-center items-center  w-3/4">
                         <Button onClick={()=>Auth({opt: "google"})} className=" px-3 py-1 justify-center w-full flex items-center tracking-wide bg-neutral-50 "><Image src={googleLogo} alt="googleLogo" width={25}></Image> Continue with Google</Button>
                         <div className="text-neutral-500 w-full flex justify-center">or</div>
                         <div className="flex flex-col gap-3 w-full">
                            <InputBox onClick={()=>error && setError(null)} value={username} onChange={setUsername} className="w-full flex justify-center placeholder:text-sm focus:outline-1 focus:outline-neutral-500" type="text" placeholder="Enter your UserName "></InputBox>
                            <InputBox onClick={()=>error && setError(null)} value={password} onChange={setPassword} type="text" className="w-full placeholder:text-sm ring-0 focus:outline-1 focus:outline-neutral-500" placeholder="Enter your password"></InputBox>
                            <Button onClick={()=>{
                                if(error)setError(null);
                                Auth({opt: "local"});
                            }} className="w-full tracking-tight flex justify-center text-neutral-50 bg-blue-600 text-sm font-semibold px-3 py-2">LogIn with Username</Button>
                            <Link href={"/signup"} className="flex justify-center text-neutral-500">
                                  <motion.div 
                                  whileHover={{scale:1.05}}
                                  whileTap={{scale:0.95}}
                                  >
                                    New to Wander?
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