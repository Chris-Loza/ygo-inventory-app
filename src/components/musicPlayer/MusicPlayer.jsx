import React, { useRef, useState } from "react";
import "./musicPlayer.css";

const MusicPlayer = () => {
  const musicRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (isPlaying) {
      musicRef.current.pause();
    } else {
      musicRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  return (
    <div className="musicPlayer" onClick={togglePlay}>
      <audio src="../../../music/ygolofi.mp3" ref={musicRef} loop />
      <div className="music">
        <img
          src={
            isPlaying
              ? "../../../images/MusicNoteFill.svg"
              : "../../../images/MusicOffFill.svg"
          }
          alt="music control"
        />
      </div>
    </div>
  );
};

export default MusicPlayer;
