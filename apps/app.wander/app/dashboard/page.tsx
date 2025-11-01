"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus, Building2, Crown, History } from "lucide-react";
import {
  RecentlyVisited,
  Organisations,
  MySpaces,
  CreateOrganisation,
} from "./components";
import Navbar from "./components/navbar";

type ViewType = "recent" | "organisations" | "my-spaces" | "create-org";

const Dashboard = () => {
  const router = useRouter();
  const [activeView, setActiveView] = useState<ViewType>("recent");

  // Mock data for spaces
  const recentSpaces = [
    { id: 1, name: "Team Workspace", map: "Office", members: 12, lastActive: "2 hours ago", image: "/assets/map-office.jpg", isOwner: false },
    { id: 2, name: "Friday Social", map: "Cafe", members: 8, lastActive: "1 day ago", image: "/assets/map-cafe.jpg", isOwner: true },
  ];

  const mySpaces = [
    { id: 2, name: "Friday Social", map: "Cafe", members: 8, lastActive: "1 day ago", image: null, organisationId: null },
    { id: 3, name: "Dev Team Hub", map: "Office", members: 15, lastActive: "3 hours ago", image: null, organisationId: null },
  ];

  const organisations = [
    { id: 1, name: "Acme Corp", spaces: 5, members: 45, logo: "🏢" },
    { id: 2, name: "Design Studio", spaces: 3, members: 12, logo: "🎨" },
  ];

  const unassignedSpaces = mySpaces.filter(space => !space.organisationId);

  const renderContent = () => {
    switch (activeView) {
      case "recent":
        return <RecentlyVisited spaces={recentSpaces} />;

      case "organisations":
        return (
          <Organisations
            organisations={organisations}
            onCreateOrg={() => setActiveView("create-org")}
          />
        );

      case "my-spaces":
        return <MySpaces spaces={mySpaces} />;

      case "create-org":
        return (
          <CreateOrganisation
            unassignedSpaces={unassignedSpaces}
            onCancel={() => setActiveView("organisations")}
            onSubmit={() => {
              // Handle form submission
              setActiveView("organisations");
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <Navbar></Navbar>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div className="flex flex-col">
              <div className="text-[4rem] text-neutral-950 font-normal tracking-widest select-none">WANDER </div>
              <p className="text-lg text-muted-foreground">Manage your spaces and organisations</p>
            </div>
            <Button
              variant="gradient"
              size="lg"
              onClick={() => router.push("/dashboard/create-space")}
              className="gap-2 shadow-glow"
            >
              <Plus className="h-5 w-5" />
              Create New Space
            </Button>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-wrap gap-3 bg-card/50 backdrop-blur-sm p-2 rounded-lg shadow-card">
            <Button
              variant={activeView === "recent" ? "default" : "ghost"}
              onClick={() => setActiveView("recent")}
              className="gap-2"
            >
              <History className="h-4 w-4" />
              Recently Visited
            </Button>
            <Button
              variant={activeView === "organisations" ? "default" : "ghost"}
              onClick={() => setActiveView("organisations")}
              className="gap-2"
            >
              <Building2 className="h-4 w-4" />
              Organisations
            </Button>
            <Button
              variant={activeView === "my-spaces" ? "default" : "ghost"}
              onClick={() => setActiveView("my-spaces")}
              className="gap-2"
            >
              <Crown className="h-4 w-4" />
              My Spaces
            </Button>
            <Button
              variant={activeView === "create-org" ? "default" : "ghost"}
              onClick={() => setActiveView("create-org")}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Organisation
            </Button>
          </div>
        </div>

        {/* Content Area */}
        {renderContent()}
      </div>
    </div>
  );
};




export default Dashboard;
