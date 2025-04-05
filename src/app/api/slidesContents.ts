import {menu} from './menu'
import CenterImage from '@/public/menu/cocktell.jpg'
import { SlideMenuSection } from '@/types/sections'


const categories= ['Wine & Beer','Cocktails']

export const getSlidesContents=():SlideMenuSection[] =>{

    const catSections=categories.map((category)=>{
        return menu.filter(drink=>drink.categories[0]===category)
    })
    const SlidesContents=[
        {
            title:'Today’s Special',
            subTitle:'Menu that fits you palatte',
            sectionA:{title:categories[0], products:catSections[0]},
            sectionB:{title:categories[1], products:catSections[1]},
            centerImage:{
                src:CenterImage.src,
                width:CenterImage.width,
                height:CenterImage.height,
                title:'Drinks'
            }
        },
        {
            title:'Specials Drink',
            subTitle:'Menu that fits you palatte',
            sectionA:{title:categories[0], products:catSections[0]},
            sectionB:{title:categories[1], products:catSections[1]},
            centerImage:{
                src:CenterImage.src,
                width:CenterImage.width,
                height:CenterImage.height,
                title:'Drinks'
            }
        },
    ]
    return SlidesContents

}

