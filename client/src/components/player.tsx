import * as React from "react";
import VideoPlayer from "react-video-js-player";

export const Player: React.FC = () => {
  return (
    <VideoPlayer
      controls={true}
      src={"https://www.welovedogs.jp/movie/video_001.mp4"}
      width="400"
      height="250"
    />
  );
};
