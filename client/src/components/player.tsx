import * as React from "react";
import VideoPlayer from "react-video-js-player";
type PlayerProps = { url: string };
export const Player: React.FC<PlayerProps> = ({ url }: PlayerProps) => {
  const onPlayerReady = (player) => {
    player.fluid(true);
  };
  return <VideoPlayer controls={true} onReady={onPlayerReady} src={url} />;
};
