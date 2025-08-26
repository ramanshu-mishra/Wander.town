"use client"
import axios from "axios";
import React, { useState } from "react";
import { getCookie } from "@/app/utils/getCookie";
import { useRouter } from "next/navigation";

export default function SignupPage() {
	const [userName, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [error, setError] = useState<null|string>(null);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
    setError(null);
    try{
        const d = await axios.post("http://localhost:3000/login", {
            username: userName,
            password: password
        });
        if(getCookie("connect.sid")){
          router.push("/");
        }
        else{
          setError(d.data);
        }
      }
      catch{
        setError("NetWork Error");
      }
        
	};

	const handleGoogleSignIn = () => {
  const width = 500;
  const height = 600;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;
 window.addEventListener("message", (event) => {
    if (event.origin !== "http://localhost:3000"){console.log("returned"); return;} // security check
    console.log("yesss");
    const { token } = event.data;
    console.log(token);
    if (token) {
        console.log(token);
      localStorage.setItem("token", token);
    }
     popup?.close();
      window.location.href = "/"; 
  });
    const popup =   window.open(
    "http://localhost:3000/auth/google",
    "GoogleSignIn",
    `width=${width},height=${height},left=${left},top=${top},status=no,toolbar=no,menubar=no,scrollbars=yes,resizable=yes`
  );
  
 
};

	return (
		<div style={{ maxWidth: 400, margin: "40px auto", padding: 24, border: "1px solid #eee", borderRadius: 8 }}>
			{error && <div className="bg-red-500">{error}</div>}
			<h2 style={{ textAlign: "center" }}>Sign Up</h2>
			<form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
				<input
					type="text"
					placeholder="Name"
					value={name}
					onChange={e => setName(e.target.value)}
					required
					style={{ padding: 8, fontSize: 16 }}
				/>
				<input
					type="text"
					placeholder="Username"
					value={userName}
					onChange={e => setUsername(e.target.value)}
					required
					style={{ padding: 8, fontSize: 16 }}
				/>
				<input
					type="password"
					placeholder="Password"
					value={password}
					onChange={e => setPassword(e.target.value)}
					required
					style={{ padding: 8, fontSize: 16 }}
				/>
				<button type="submit" style={{ padding: 10, fontSize: 16, background: "#0070f3", color: "white", border: "none", borderRadius: 4 }}>
					Sign Up
				</button>
			</form>
			<hr style={{ margin: "24px 0" }} />
			<button onClick={handleGoogleSignIn} style={{ width: "100%", padding: 10, fontSize: 16, background: "#4285F4", color: "white", border: "none", borderRadius: 4 }}>
				Sign up with Google
			</button>
		</div>
	);
}
