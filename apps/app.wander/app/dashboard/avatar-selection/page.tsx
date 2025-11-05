"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { useUserDetails } from "@/store";
import { useFetchData } from "@/hooks/useFetchData";
import { ToastContainer, toast } from "react-toastify";
import ErrorToast from "../../../components/ErrorToast";
import { FetchError } from "@repo/utils/FetchError";
import Spinner from "@/components/spinner";





interface SpaceCreationData{
  id:string,
  name:string,
  hostId:string,
  orgId:string
}

const AvatarSelection = () => {
  const {data,loading,fetchData,reset} = useFetchData();
  const [_data,setData] = useState<SpaceCreationData|null>(null);
 
  const {userDetails} = useUserDetails();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);


  const avatars= userDetails?.avatars && Array.isArray(userDetails.avatars)
    ? userDetails.avatars.map((avatar) => ({
        id: avatar.id ?? "",
        name: avatar.image ?? "Unknown Avatar",
        image: avatar.image ?? "❓"
      }))
    : [];

  const createSpace = async() => {
    if (selectedAvatar) {
      const mapId = searchParams.get("mapId");
      const name = searchParams.get("name");
      if(!mapId || !name){
        router.push("/dashboard");
        return;
      }
      try{
      const data = await fetchData(`${process.env.NEXT_PUBLIC_AuthServer}/createSpace`,{
        method: "POST",
        credentials: "include",
        headers:{
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          mapId: mapId,
          avatarId: selectedAvatar,
          name: name
        })
      } );
      console.log(data);
        setData(data);
    }
    catch(e){
      
      if(e instanceof FetchError){
        if(e.json.message = "unauthorized-session"){
            router.push("/login");
        }
          toast(<ErrorToast message={e.json.message}></ErrorToast>)
      }
      else if(e instanceof Error){
        toast(<ErrorToast message={e.message}></ErrorToast>)
      }
      else{
        toast(<ErrorToast></ErrorToast>)
      }
    }
    finally{
      reset();
    }
    }
  };


  useEffect(()=>{
    if(!userDetails){
      router.push("/dashboard");
    } 
  },[])

  useEffect(()=>{
    
    if(_data){
    router.push(`/dashboard/invitemembers/${_data.id}`)
    }
  },[_data]);

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard/create-space")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Map Selection
          </Button>
          <h1 className="text-4xl font-bold text-neutral-950 mb-2">Choose Your Avatar</h1>
          <p className="text-neutral-600">Select an avatar that represents you</p>
        </div>

        {/* Avatars Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 mb-8 max-w-4xl mx-auto">
          {avatars && avatars.length > 0 ? avatars.map((avatar, index) => (
            <Card
              key={avatar.id}
              className={`cursor-pointer shadow-card hover:shadow-elevated transition-all duration-300 animate-fade-in ${
                String(selectedAvatar) === String(avatar.id) ? "ring-2 ring-primary" : ""
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => setSelectedAvatar(avatar.id)}
            >
              <CardContent className="p-6 flex flex-col items-center justify-center relative">
                {String(selectedAvatar) === String(avatar.id) && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                    <Check className="h-4 w-4" />
                  </div>
                )}
                <div className="text-6xl mb-3">{avatar.image}</div>
                <p className="text-sm font-medium text-center">{avatar.name}</p>
              </CardContent>
            </Card>
          )) : (
            <div className="col-span-full text-center py-12">
              <p className="text-neutral-600">No avatars available</p>
            </div>
          )}
        </div>

        {/* Continue Button */}
        {selectedAvatar && (
          <div className="flex justify-center animate-fade-in">
            <Button variant="gradient" className="flex gap-5" size="lg" onClick={createSpace}>
              create Space
              {loading && <Spinner color={"var(--color-neutral-50)"}></Spinner>}
            </Button>
          </div>
        )}
      </div>
      <ToastContainer autoClose={1500} draggable={false} position="bottom-right"></ToastContainer>
    </div>
    
  );
};

export default AvatarSelection;
