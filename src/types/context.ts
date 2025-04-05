import { Dispatch, SetStateAction } from "react";
export interface UseInterface{
    openLoginState:OpenLogin
}

export interface OpenLogin{
    openLogin: boolean; 
    setopenLogin: Dispatch <SetStateAction<boolean>>
}