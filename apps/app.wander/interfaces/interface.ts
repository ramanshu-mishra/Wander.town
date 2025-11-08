

export interface UserInterface{
    id:string,
    name:string,
    username:string,
    email:string,
    image:string
}

// since we are using a tiled map x and y here represent the top left block and height represent number of vertical blocks covered and width represents number of horizontal blocks covered
interface elementInterface{
    id:string,
    x:number, 
    y:number,
    elementid: string,
    element:{
        id:string,
        type:string,
        variant:string,
        image:string,
        height:number,
        width:number
    }
}
interface mapInterface{
    id: string,
    mapId:string,
    spaceId:string,
    elements:elementInterface[],
    map:{
        id:string,
        name:string,
        image:string,
        height: number,
        width:number,
        thumbnail:string
    },
    spawnPoints : spawnPoints[]
}

export interface spawnPoints{
    x:number,
    y:number
}

export interface SpaceInterface{
    id:string,
    name:string,
    hostId: string,
    host: UserInterface
    cohosts: UserInterface[],
    members:UserInterface[],
    map: mapInterface,
}


export type userAndPositionInterface = UserInterface & {
    position: spawnPoints
}

