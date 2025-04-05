import { Product } from "./menu";
import { ImageData } from "./React";

export interface SlideMenuSection{
    title:string,
    subTitle:string,
    sectionA:{title:string, products:Product[]},
    sectionB:{title:string, products:Product[]},
    centerImage:ImageData
}