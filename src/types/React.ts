import React from "react";

export interface PropsChildren {
  children?: React.ReactNode;
  childrenProps?: React.ReactNode;
  title?: string;
}

export interface ButtonProps {
  margin: string;
}

export interface ImageData {
  src: string;
  url?: string;
  title?: string;
  height: number;
  width: number;
  blurDataUrl?: string;
}
export interface ImageProps {
  url: string;
  altTitle: string;
  heightProps: number;
  widthProps: number;
}
export interface VideoProps {
  videoUrl: string;
  Ratio?: string;
  heightSize?: number;
  widthSize?: number;
  typeVideo?: string;
  showcontrol: boolean;
  mutedControl: boolean;
  autoPlayed: boolean;
  posterUrl?: string;
}
