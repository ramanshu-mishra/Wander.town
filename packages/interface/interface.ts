export interface userInterface{
    id:string,
    name:string,
    username:string,
    email: string,
    image:string,
    spaces:{
        spaceId: string,
        avatarId:string,
        lastVisit:string
    }[],
    hostSpaces: spaceInterface[],
    cohostSpaces:spaceInterface[],
    memberSpaces:spaceInterface[],
    organisations: orgInterface[]
}

export interface defaultMapsInterface{
    id:string,
    name:string,
    thumbnail:string
}   

export interface avatarsInteraface{
    id:string,
    name:string,
    image:string
}

export interface spaceInterface{
    id:string,
    name:string,
    orgId?:string,
    organisation ?:{
        id:true,
        name:string
    },
    map:{
        id:string,
        map:{
            id:string,
            name:string,
            thumbnail:string
        }
    },
    users:{
        spaceId:string,
        userId:string,
        lastVisit:string
    }[]
}


export interface orgInterface{
    id:string,
    name:string,
    spaces: spaceInterface[],
    parentOrgId ?: string,
    childorgs: orgInterface[],
    hostId: string,
    logo ?: string
}


export type combinedInterface = userInterface & {
    avatars: avatarsInteraface[];
    defaultMaps: defaultMapsInterface[];
};