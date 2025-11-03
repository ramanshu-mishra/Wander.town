"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { useUserDetails } from "@/store";

const CreateSpace = () => {
  const router = useRouter();
  const [name,setName] = useState("");
  const [selectedMap, setSelectedMap] = useState<string | null>(null);
  
  const {userDetails} = useUserDetails();

  // const maps = userDetails?.defaultMaps && Array.isArray(userDetails.defaultMaps)
  //   ? userDetails.defaultMaps.map((map) => ({
  //       id: map.id ?? "",
  //       name: map.name ?? "Untitled Map",
  //       image: map.thumbnail ?? null
  //     }))
  //   : [{
  //       id: "default-park",
  //       name: "Park",
  //       image: "/assets/map-park.jpg"
  //     }];

 const maps =  [{
        id: "default-park",
        name: "Park",
        image: "/assets/map-park.jpg"
      }];
  const handleContinue = () => {
    if (selectedMap) {
      router.push(`/dashboard/avatar-selection?mapId=${selectedMap}&name=${name}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className=" container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard")}
            className="mb-4 "
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-4xl font-bold text-neutral-800 mb-2">Choose Your Map</h1>
          <p className="text-neutral-600">Select the perfect environment for your space</p>
        </div>

        {/* Maps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {maps && maps.length > 0 ? maps.map((map, index) => (
            <Card
              key={map.id}
              className={`cursor-pointer shadow-card hover:shadow-elevated transition-all duration-300 animate-fade-in overflow-hidden ${
                selectedMap === map.id ? "ring-2 ring-primary" : ""
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => setSelectedMap(map.id)}
            >
              <div className="relative w-full h-64 overflow-hidden rounded-lg group">
                {map.image ? (
                  <>
                    <img
                      src={map.image}
                      alt={map.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                  </>
                ) : null}
                
                {/* Gradient placeholder when no image */}
                {!map.image && (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-background/20" />
                )}
                
                {/* Dark gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Map name at bottom left */}
                <div className="absolute bottom-0 left-0 p-4">
                  <CardTitle className="text-white">{map.name}</CardTitle>
                </div>

                {/* Check mark at top right when selected */}
                {selectedMap === map.id && (
                  <div className="absolute top-4 right-4 bg-primary text-primary-foreground rounded-full p-2 shadow-lg">
                    <Check className="h-5 w-5" />
                  </div>
                )}
              </div>
            </Card>
          )) : (
            <div className="col-span-full text-center py-12">
              <p className="text-neutral-600">No maps available</p>
            </div>
          )}
        </div>

        {/* Continue Button */}
        
        {
          selectedMap && (
            <div className="flex flex-col items-center mb-5 ">
            <div className="text-neutral-950 font-bold">Enter Name for new Space</div>
            <div className="flex justify-center">
              <input type="text" placeholder="Space's Name" onChange={(e)=>{
                setName(e.target.value)
              }} value={name}
              className="bg-neutral-50 rounded-full placeholder:text-neutral-400 placeholder:px-2 text-neutral-950 px-2 placeholder:rounded-full"
              ></input>
            </div>
            </div>
          )
        }
        {selectedMap &&  name && (
          <div className="flex justify-center animate-fade-in">
            <Button variant="gradient" size="lg" onClick={handleContinue}>
              Continue to Avatar Selection
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateSpace;
