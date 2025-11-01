"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";

const AvatarSelection = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);

  // Avatar options with emoji representations
  const avatars = [
    { id: 1, emoji: "👨‍💼", name: "Professional" },
    { id: 2, emoji: "👩‍💼", name: "Executive" },
    { id: 3, emoji: "🧑‍💻", name: "Developer" },
    { id: 4, emoji: "👨‍🎨", name: "Creative" },
    { id: 5, emoji: "👩‍🔬", name: "Scientist" },
    { id: 6, emoji: "🧑‍🏫", name: "Teacher" },
    { id: 7, emoji: "👨‍🚀", name: "Astronaut" },
    { id: 8, emoji: "👩‍⚕️", name: "Doctor" },
  ];

  const handleContinue = () => {
    if (selectedAvatar) {
      const mapId = searchParams.get("mapId");
      router.push(`/dashboard/maps?mapId=${mapId}&avatarId=${selectedAvatar}`);
    }
  };

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
          <h1 className="text-4xl font-bold text-foreground mb-2">Choose Your Avatar</h1>
          <p className="text-muted-foreground">Select an avatar that represents you</p>
        </div>

        {/* Avatars Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 mb-8 max-w-4xl mx-auto">
          {avatars.map((avatar, index) => (
            <Card
              key={avatar.id}
              className={`cursor-pointer shadow-card hover:shadow-elevated transition-all duration-300 animate-fade-in ${
                selectedAvatar === avatar.id ? "ring-2 ring-primary" : ""
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => setSelectedAvatar(avatar.id)}
            >
              <CardContent className="p-6 flex flex-col items-center justify-center relative">
                {selectedAvatar === avatar.id && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                    <Check className="h-4 w-4" />
                  </div>
                )}
                <div className="text-6xl mb-3">{avatar.emoji}</div>
                <p className="text-sm font-medium text-center">{avatar.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Continue Button */}
        {selectedAvatar && (
          <div className="flex justify-center animate-fade-in">
            <Button variant="gradient" size="lg" onClick={handleContinue}>
              Join Space
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AvatarSelection;
