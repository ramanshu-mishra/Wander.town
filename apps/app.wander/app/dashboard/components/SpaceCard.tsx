import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Clock, MapPin, Crown } from "lucide-react";
import { useRouter } from "next/navigation";

interface Space {
  id: number;
  name: string;
  map: string;
  members: number;
  lastActive: string;
  image: string | null;
  isOwner?: boolean;
}

interface SpaceCardProps {
  space: Space;
  index: number;
}

export const SpaceCard = ({ space, index }: SpaceCardProps) => {
  const router = useRouter();

  return (
    <Card
      key={space.id}
      className="group overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 cursor-pointer animate-fade-in border-0 bg-card/50 backdrop-blur-sm"
      style={{ animationDelay: `${index * 100}ms` }}
      onClick={() => router.push("/dashboard/maps")}
    >
      <div className="relative h-48 overflow-hidden">
        {space.image ? (
          <img
            src={space.image}
            alt={space.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/30 transition-transform duration-300 group-hover:scale-110 flex items-center justify-center">
            <MapPin className="h-16 w-16 text-primary/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
        <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
          <MapPin className="h-3 w-3 text-primary" />
          <span className="text-xs font-medium">{space.map}</span>
        </div>
        {space.isOwner && (
          <div className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
            <Crown className="h-3 w-3 text-primary-foreground" />
            <span className="text-xs font-medium text-primary-foreground">Host</span>
          </div>
        )}
      </div>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl group-hover:text-primary transition-colors">
          {space.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4 text-primary" />
            <span className="font-medium">{space.members} members</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-primary" />
            <span>{space.lastActive}</span>
          </div>
        </div>
        <Button variant="gradient" className="w-full shadow-sm">
          Join Space
        </Button>
      </CardContent>
    </Card>
  );
};
