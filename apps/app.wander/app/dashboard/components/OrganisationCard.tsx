import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Users } from "lucide-react";

interface Organisation {
  id: number;
  name: string;
  spaces: number;
  members: number;
  logo: string;
}

interface OrganisationCardProps {
  organisation: Organisation;
  index: number;
  onClick?: () => void;
}

export const OrganisationCard = ({ organisation, index, onClick }: OrganisationCardProps) => {
  return (
    <Card
      key={organisation.id}
      className="group shadow-card hover:shadow-elevated transition-all duration-300 cursor-pointer animate-fade-in border-0 bg-card/50 backdrop-blur-sm"
      style={{ animationDelay: `${index * 100}ms` }}
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="text-5xl">{organisation.logo}</div>
          <div className="flex-1">
            <CardTitle className="text-2xl group-hover:text-primary transition-colors mb-2">
              {organisation.name}
            </CardTitle>
            <CardDescription className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {organisation.spaces} spaces
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {organisation.members} members
              </span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Button variant="outline" className="w-full">
          View Spaces
        </Button>
      </CardContent>
    </Card>
  );
};
