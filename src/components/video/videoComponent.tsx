import React, { useState, useEffect, createRef } from "react";
import { VideoProps } from "../../models/React";
import styled from "styled-components";
import { BsFillPauseFill, BsFillPlayFill } from "react-icons/bs";

const VideoWrapper = styled.article`
  position: relative;
  width: 100%;

  .video-overlay {
    position: absolute;
    top: 0;
    inset: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.3);
    transition: 0.5s all;
    &.active {
      background: rgba(0, 0, 0, 0);
    }
    &.active {
      .outlinePlay {
        opacity: 0;
        transition: 0.5s all;
        &:hover {
          opacity: 1;
        }
      }
    }

    .outlinePlay {
      border: 1px solid var(--golden);
      padding: 20px;
      background-color: transparent;
      apparence: none;
      border-radius: 50%;
      font-size: 0;
      cursor: pointer;
      transition: 0.5s all;
      svg {
        fill: var(--white);
        height: 45px;
        width: 45px;
        transition: 0.5s;
      }
    }
  }
  video {
    width: 100%;
  }
`;

function VideoComponent({
  videoUrl,
  typeVideo,
  showcontrol,
  mutedControl,
  autoPlayed,
}: VideoProps) {
  const videoRef = createRef<any>();
  const [playAction, setplayAction] = useState<boolean>(false);
  //const [resize,setResize]=useState<Number>(0)

  const handlerPlay = () => {
    setplayAction((prevState) => !prevState);
  };
  /*  const getRatio=()=>{
        const getRatio:string[]=Ratio? Ratio.split('/') :['1','1']
        const ratio:number= parseInt(getRatio[0])/parseInt(getRatio[1])
       const height:any=resize?? resize/ratio
      
    } */

  /*  useEffect(()=>{
        const resizeListener = () => {
            // change width from the state object
            setResize(getWidth());
          };
          // set resize listener
          window.addEventListener('resize', resizeListener);
          window.addEventListener('load', resizeListener);
          // clean up function
          return () => {
              // remove resize listener
              window.removeEventListener('resize', resizeListener);
            window.addEventListener('load', resizeListener);
          }
    },[]) */

  useEffect(() => {
    if (playAction) {
      videoRef.current?.play();
    } else {
      videoRef?.current?.pause();
    }
  }, [playAction]);

  /* 
    useEffect(()=>{
        getRatio()

    },[resize]) */

  const playPauseButton = playAction ? <BsFillPauseFill /> : <BsFillPlayFill />;
  return (
    <VideoWrapper>
      <video
        controls={showcontrol}
        muted={mutedControl}
        autoPlay={autoPlayed}
        preload="auto"
        className="video"
        ref={videoRef}
      >
        <source src={videoUrl} type={typeVideo} />
        <p>
          Video tag not supported. Download the video{" "}
          <a href={videoUrl}>here</a>.
        </p>
      </video>

      <div className={`video-overlay ${playAction ? "active" : ""}`}>
        <button type="button" onClick={handlerPlay} className="outlinePlay">
          {playPauseButton}
        </button>
      </div>
    </VideoWrapper>
  );
}

export default VideoComponent;
