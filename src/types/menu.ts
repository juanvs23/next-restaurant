import { ImageData } from "./React";


export interface SizePrice{
    id:string
   name:string
   price:number
   tax:number
}


export interface Product{
    type:string
    title:string
    categories:string[]
    images?:ImageData[]
    specs:{
        ingredients?:string[]
        unit:string[],
        sizes:SizePrice[]
    }    
        
    description:string
    SKU:string
   
}