"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LogOut, Users, Mic, MicOff, Video, VideoOff } from "lucide-react";
import { toast } from "sonner";

const Maps = () => {
  const router = useRouter();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  // Mock participants
  const participants = [
    { id: 1, name: "You", x: 50, y: 50 },
    { id: 2, name: "Alice", x: 30, y: 40 },
    { id: 3, name: "Bob", x: 70, y: 60 },
  ];

  useEffect(() => {
    toast.success("Welcome to the space!");
  }, []);

  const handleLeave = () => {
    toast.info("Leaving space...");
    setTimeout(() => {
      router.push("/dashboard");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      {/* Top Bar */}
      <div className="bg-card shadow-sm border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">Team Workspace</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{participants.length} online</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={isMuted ? "destructive" : "outline"}
            size="icon"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          <Button
            variant={isVideoOff ? "destructive" : "outline"}
            size="icon"
            onClick={() => setIsVideoOff(!isVideoOff)}
          >
            {isVideoOff ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
          </Button>
          <Button variant="outline" onClick={handleLeave}>
            <LogOut className="h-4 w-4 mr-2" />
            Leave
          </Button>
        </div>
      </div>

      {/* Main Map Area */}
      <div className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-accent/10">
          {/* Map Canvas */}
          <div className="w-full h-full flex items-center justify-center">
            <div className="relative w-full max-w-6xl aspect-video bg-card/50 backdrop-blur-sm rounded-lg border-2 border-primary/20 shadow-elevated">
              {/* Participants */}
              {participants.map((participant, index) => (
                <div
                  key={participant.id}
                  className="absolute w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold shadow-lg transform -translate-x-1/2 -translate-y-1/2 animate-fade-in cursor-pointer hover:scale-110 transition-transform"
                  style={{
                    left: `${participant.x}%`,
                    top: `${participant.y}%`,
                    animationDelay: `${index * 150}ms`,
                  }}
                >
                  {participant.name.charAt(0)}
                </div>
              ))}

              {/* Instructions */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-card/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-elevated">
                <p className="text-sm text-muted-foreground">
                  Click anywhere to move your avatar
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Participants List */}
      <div className="bg-card shadow-sm border-t border-border px-6 py-4">
        <div className="flex items-center gap-4 overflow-x-auto">
          {participants.map((participant) => (
            <div
              key={participant.id}
              className="flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-full"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-semibold">
                {participant.name.charAt(0)}
              </div>
              <span className="text-sm font-medium">{participant.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Maps;
