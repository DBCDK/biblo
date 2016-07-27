import React from 'react';

export function getVideoPlayer(videoProp) {
  let thumbUrl = null;
  const sources = [];

  videoProp.resolutions.forEach((resolution, key) => {
    if (resolution.size !== 'original_video') {
      const pureFileName = resolution.video.name.substring(0, resolution.video.name.lastIndexOf('.'));
      if (!thumbUrl) {
        thumbUrl = `${pureFileName}_thumb_00001.png`;
      }

      sources.push(
        <source src={`https://s3-eu-west-1.amazonaws.com/${resolution.video.container}/${resolution.video.name}`} type={`${resolution.video.type}`} key={key} />);
    }
  });

  let posterUrl = sources.length > 0 && thumbUrl ? `https://s3-eu-west-1.amazonaws.com/uxdev-biblo-video-thumbnails/${thumbUrl}` : '/video_behandler.png';

  return (
    <video controls preload="none"
           poster={posterUrl} >
      {sources}
    </video>
  );
}
