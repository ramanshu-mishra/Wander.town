export interface UserInterface{
    id:string,
    name:string,
    username:string
}
export interface elementInterface{
    id:string,
    x:number,
    y:number,
    elementid: string,
    element:{
        id:string,
        height:number,
        width:number,
        image:string
    }
}
export interface mapInterface{
    id: string,
    height:number,
    width:number,
    image:string,
    elements:elementInterface[]
}
export interface SpaceInterface{
    id:string,
    name:string,
    map_id: string,
    host_id: string,
    host: UserInterface
    cohosts: UserInterface[],
    members:UserInterface[],
    map: mapInterface | null
}

export interface UserData{
        username:string,
        userId:string,
        name:string,
        avatarid:string,
        avatar?: {
                hair?:string,
                body?:string,
                shirt?:string,
                pant?:string,
                eyes?:string
        },
        userRole:string,
}

export interface positionInterface{
        x:number,
        y:number
}

