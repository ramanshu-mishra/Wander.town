"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";

const CreateSpace = () => {
  const router = useRouter();
  const [selectedMap, setSelectedMap] = useState<string | null>(null);

  const maps = [
    {
      id: "office",
      name: "Office Space",
      description: "Professional workspace with desks and meeting rooms",
      image: "/map-office.jpg",
      capacity: "Up to 50 people",
    },
    {
      id: "cafe",
      name: "Cozy Cafe",
      description: "Casual meeting space with comfortable seating",
      image: "/map-cafe.jpg",
      capacity: "Up to 30 people",
    },
    {
      id: "conference",
      name: "Conference Center",
      description: "Large venue for presentations and events",
      image: "/map-conference.jpg",
      capacity: "Up to 100 people",
    },
    {
      id: "park",
      name: "Outdoor Park",
      description: "Relaxing outdoor environment for casual gatherings",
      image: "/map-park.jpg",
      capacity: "Up to 40 people",
    },
  ];

  const handleContinue = () => {
    if (selectedMap) {
      router.push(`/dashboard/avatar-selection?mapId=${selectedMap}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-4xl font-bold text-foreground mb-2">Choose Your Map</h1>
          <p className="text-muted-foreground">Select the perfect environment for your space</p>
        </div>

        {/* Maps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {maps.map((map, index) => (
            <Card
              key={map.id}
              className={`cursor-pointer shadow-card hover:shadow-elevated transition-all duration-300 animate-fade-in ${
                selectedMap === map.id ? "ring-2 ring-primary" : ""
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => setSelectedMap(map.id)}
            >
              <div className="relative">
                <img
                  src={map.image}
                  alt={map.name}
                  className="w-full h-64 object-cover rounded-t-lg"
                />
                {selectedMap === map.id && (
                  <div className="absolute top-4 right-4 bg-primary text-primary-foreground rounded-full p-2">
                    <Check className="h-5 w-5" />
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle>{map.name}</CardTitle>
                <CardDescription>{map.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{map.capacity}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Continue Button */}
        {selectedMap && (
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
