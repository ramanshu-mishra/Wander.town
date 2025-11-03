"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Users } from "lucide-react";

interface Space {
  id: string;
  name: string;
  map: string;
  members: number;
  lastActive: string;
  image: string | null;
  orgId: string | null;
}

interface CreateOrganisationProps {
  unassignedSpaces: Space[];
  onCancel: () => void;
  onSubmit?: () => void;
}

export const CreateOrganisation = ({ unassignedSpaces, onCancel, onSubmit }: CreateOrganisationProps) => {
  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-card animate-fade-in">
        <CardHeader>
          <CardTitle className="text-2xl">Create Organisation</CardTitle>
          <CardDescription>
            Group your spaces under an organisation for better management
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Organisation Name</label>
              <input
                type="text"
                placeholder="Enter organisation name"
                className="w-full px-4 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Description (Optional)</label>
              <textarea
                placeholder="Describe your organisation"
                rows={3}
                className="w-full px-4 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {unassignedSpaces.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Add Existing Spaces</h3>
              <p className="text-sm text-muted-foreground">
                Select spaces you own to add to this organisation
              </p>
              <div className="space-y-2">
                {unassignedSpaces.map((space) => (
                  <label
                    key={space.id}
                    className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-accent/50 cursor-pointer transition-colors"
                  >
                    <input type="checkbox" className="w-4 h-4" />
                    <div className="flex-1">
                      <div className="font-medium">{space.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        {space.map}
                        <span>•</span>
                        <Users className="h-3 w-3" />
                        {space.members} members
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button variant="gradient" className="flex-1" onClick={onSubmit}>
              Create Organisation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
