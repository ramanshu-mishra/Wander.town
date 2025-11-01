"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Plus } from "lucide-react";
import { OrganisationCard } from "./OrganisationCard";

interface Organisation {
  id: number;
  name: string;
  spaces: number;
  members: number;
  logo: string;
}

interface OrganisationsProps {
  organisations: Organisation[];
  onCreateOrg: () => void;
}

export const Organisations = ({ organisations, onCreateOrg }: OrganisationsProps) => {
  if (organisations.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-full shadow-card animate-fade-in">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Building2 className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No organisations yet</h3>
            <p className="text-muted-foreground text-center mb-6">
              Create an organisation to group your spaces
            </p>
            <Button variant="gradient" onClick={onCreateOrg}>
              <Plus className="h-4 w-4 mr-2" />
              Create Organisation
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {organisations.map((org, index) => (
        <OrganisationCard
          key={org.id}
          organisation={org}
          index={index}
          onClick={() => {/* Navigate to org spaces */}}
        />
      ))}
    </div>
  );
};
