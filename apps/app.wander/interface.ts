export interface userInterface{
    id:string,
    name:string,
    username:string,
    email: string,
    image:string,
    spaces:{
        spaceId: string,
        avatarId:string
    }[],
    hostSpaces: spaceInterface,
    cohostSpaces:spaceInterface,
    memberSpaces:spaceInterface,
    organisations: orgInterface
}


interface spaceInterface{
    id:string,
    name:string,
    orgId?:string,
    organisation ?:{
        name:string
    }
}


interface orgInterface{
    id:string,
    name:string,
    spaces: spaceInterface,
    parentOrgId ?: string,
    childorgs: orgInterface[],
    hostId:string
}
