"use client";
import React, { useState, useEffect, createRef } from "react";
import { VideoProps } from "@/types/React";
import { BsFillPauseFill, BsFillPlayFill } from "react-icons/bs";

function VideoComponent({
  videoUrl,
  typeVideo,
  showcontrol,
  mutedControl,
  autoPlayed,
  posterUrl,
}: VideoProps) {
  const videoRef = createRef<any>();
  const [playAction, setplayAction] = useState<boolean>(false);

  const handlerPlay = () => {
    setplayAction((prevState) => !prevState);
  };

  useEffect(() => {
    if (playAction) {
      videoRef.current?.play();
    } else {
      videoRef?.current?.pause();
    }
  }, [playAction]);

  const playPauseButton = playAction ? <BsFillPauseFill /> : <BsFillPlayFill />;
  return (
    <article className="relative w-full">
      <video
        controls={showcontrol}
        muted={mutedControl}
        autoPlay={autoPlayed}
        preload="none"
        className="w-full"
        ref={videoRef}
        poster={posterUrl}
      >
        <source src={videoUrl} type={typeVideo} />
        <p>
          Video tag not supported. Download the video{" "}
          <a href={videoUrl}>here</a>.
        </p>
      </video>

      <div className={`video-overlay absolute top-0 inset-0 w-full h-full flex justify-center items-center bg-black/30 transition-all duration-500 ${playAction ? "bg-transparent" : ""}`}>
        <button type="button" onClick={handlerPlay} className="outlinePlay">
          {playPauseButton}
        </button>
      </div>
    </article>
  );
}

export default VideoComponent;
