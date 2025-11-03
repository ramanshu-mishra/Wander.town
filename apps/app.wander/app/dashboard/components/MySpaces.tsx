"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { SpaceCard } from "./SpaceCard";

interface Space {
  id: string;
  name: string;
  map: string;
  members: number;
  lastActive: string;
  image: string | null;
  orgId: string | null;
}

interface MySpacesProps {
  spaces: Space[];
}

export const MySpaces = ({ spaces }: MySpacesProps) => {
  const router = useRouter();

  if (spaces.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="col-span-full shadow-card animate-fade-in">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Crown className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No spaces created yet</h3>
            <p className="text-muted-foreground text-center mb-6">
              Create your first space where you&apos;ll be the host
            </p>
            <Button variant="gradient" onClick={() => router.push("/dashboard/create-space")}>
              <Plus className="h-4 w-4 mr-2" />
              Create Space
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {spaces.map((space, index) => (
        <SpaceCard
          key={space.id}
          space={{ ...space, isOwner: true }}
          index={index}
        />
      ))}
    </div>
  );
};
