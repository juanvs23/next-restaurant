import React from 'react'

export interface PropsChildren {
    children?: JSX.Element[] | JSX.Element | React.ReactChild | React.ReactChild[] | React.ReactChildren | React.ReactChildren[] | React.ReactNode;
    childrenProps?:JSX.Element[] | JSX.Element
    title?:string
  }

  export interface ButtonProps{
    margin:string
  }

  export interface ImageData{
    src:string
    url?:string
    title?:string
    height:number
    width:number
    blurDataUrl?:string
  }
  export interface ImageProps{
    
    url:string
    altTitle:string
    heightProps:number
    widthProps:number
  }
  export interface VideoProps{
    videoUrl:string,
    Ratio?:string,
    heightSize?:number,
    widthSize?:number,
    typeVideo?:string,
    showcontrol:boolean,
    mutedControl:boolean,
    autoPlayed:boolean,
    posterUrl?:string
  }