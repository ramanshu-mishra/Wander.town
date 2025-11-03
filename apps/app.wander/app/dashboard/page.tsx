"use client";
import Loading from "@/page/loading";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Cookie from "js-cookie"
import { Plus, Building2, Crown, History } from "lucide-react";
import {
  RecentlyVisited,
  Organisations,
  MySpaces,
  CreateOrganisation,
} from "./components";
import Navbar from "./components/navbar";
import useGetUserDetails from "@/hooks/useGetUserDetails";
import { useUserDetails } from "@/store";
import {orgInterface, spaceInterface} from "@repo/interface"

type ViewType = "recent" | "organisations" | "my-spaces" | "create-org";


function getDiff(a: Date | string | number, b: Date | string | number): string {
  const timeA = a instanceof Date ? a.getTime() : Date.parse(String(a));
  const timeB = b instanceof Date ? b.getTime() : Date.parse(String(b));
  const diff = timeA - timeB;
  
  const seconds = diff/1000;
  if(seconds < 60)return `${Math.round(seconds)} seconds ago`;
  const minutes = seconds/60;
  if(minutes < 60)return `${Math.round(minutes)} minutes ago`
  const hours = minutes/60;
  if(hours < 24) return `${Math.round(hours)} hours ago`;
  const days = hours/24;
  if(days < 31)return `${Math.round(days)} days ago`;
  const months = days / 30;
  if (months < 12) return `${Math.round(months)} months ago`;
  const years = months / 12;
  return `${Math.round(years)} years ago`;
}


function parseSpace(spaces: spaceInterface[] | undefined, isOwner:boolean, userId:string | undefined){
  if (!Array.isArray(spaces) || spaces.length === 0) return [];
  
  const parsedSpaces = spaces.map((space)=>({
    id: space.id,
    name: space.name ?? "Untitled",
    map: space.map?.map?.name ??"Unknown",
    lastActive: getDiff(Date.now(), space.users?.find((u) => u.userId === userId)?.lastVisit ?? Date.now()),
    image: space.map?.map?.thumbnail ?? null,
    isOwner: isOwner,
    orgId: space.orgId ?? null,
    members: Array.isArray(space.users) ? space.users.length : 0
  }));

  return parsedSpaces;
}





function countMembers(org: orgInterface | undefined){
  if (!org) return 0;
  
  function countMembersHelper(current: orgInterface | undefined, arr: Set<string>){
    if (!current) return;
    
    if (Array.isArray(current.spaces)) {
      current.spaces.forEach((space)=>{
        if (Array.isArray(space.users)) {
          space.users.forEach((user)=>{
            if (user?.userId) arr.add(user.userId);
          });
        }
      });
    }

    if (Array.isArray(current.childorgs) && current.childorgs.length > 0){
      current.childorgs.forEach((childOrg)=>{
        countMembersHelper(childOrg, arr);
      });
    }
  } 

  const memberSet = new Set<string>();
  countMembersHelper(org, memberSet);
  return memberSet.size;
}
const Dashboard = () => {

  const {loading,error,data} = useGetUserDetails();
  const {setUserDetails} = useUserDetails();
  

  useEffect(()=>{
    if(data){
      console.log(data);
      setUserDetails(data);
    }
  }, [data, setUserDetails]);

  const router = useRouter();
  useEffect(()=>{
    if(error){
      Cookie.remove("connect.sid");
      router.push("/login");
    }
  },[error, router]);
  const [activeView, setActiveView] = useState<ViewType>("recent");

  // Mock data for spaces
  // const recentSpaces = [
  //   { id: 1, name: "Team Workspace", map: "Office", members: 12, lastActive: "2 hours ago", image: "/assets/map-office.jpg", isOwner: false },
  //   { id: 2, name: "Friday Social", map: "Cafe", members: 8, lastActive: "1 day ago", image: "/assets/map-cafe.jpg", isOwner: true },
  // ];

  const recentSpaces = [
    ...parseSpace(data?.hostSpaces ?? [], true, data?.id as string),
    ...parseSpace(data?.cohostSpaces ?? [], false, data?.id as string),
    ...parseSpace(data?.memberSpaces ?? [], false, data?.id as string)
  ]

  const mySpaces = [...parseSpace(data?.hostSpaces ?? [], true, data?.id as string)];


  

const organisations = data?.organisations?.map((org)=>({
  id: org.id,
  name: org.name,
  spaces : org.spaces.length,
  members : countMembers(org),
  logo: org.logo as string
})) ?? [];

  const unassignedSpaces = mySpaces.filter(space => !space.orgId);

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
    <>
    {loading && <Loading></Loading>}
    {!loading  && data && 
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <Navbar></Navbar>
          

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
    }  
    </>
    
  );
};




export default Dashboard;
