export interface SuscriptionData{
    message:string,
    code:string
}
export interface SuscriptionResponse{
    status: string;
    data:SuscriptionData
}