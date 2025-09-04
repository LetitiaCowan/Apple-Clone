import React, { useEffect, useRef, useState } from "react";
import { hightlightsSlides } from "../constants";
import gsap from "gsap";
import { pauseImg, playImg, replayImg } from "../utils";
import { useGSAP } from "@gsap/react";

import ScrollTrigger from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const VideoCarousel = () => {
  // Refs to hold DOM elements
  const videoRef = useRef([]); // References for each video element
  const videoSpanRef = useRef([]); // References for span elements (progress bars)
  const videoDivRef = useRef([]); // References for outer span containers

  // State to manage video playback and UI states
  const [video, setVideo] = useState({
    isEnd: false, // Indicates if the current video has ended
    startPlay: false, // Indicates if playback has started
    videoId: 0, // Current video index
    isLastVideo: false, // Indicates if the last video is reached
    isPlaying: false, // Playback state
  });

  const [loadedData, setLoadedData] = useState([]);
  const { isEnd, isLastVideo, startPlay, videoId, isPlaying } = video;

  useGSAP(() => {
    // slider animation to move the video out of the screen and bring the next video in
    gsap.to("#slider", {
      transform: `translateX(${-100 * videoId}%)`, // Shift based on video index
      duration: 2,
      ease: "power2.inOut", // Smooth easing for transition
    });

    // video animation to play the video when it is in the view
    gsap.to("#video", {
      scrollTrigger: {
        trigger: "#video",
        toggleActions: "restart none none none",
      },
      onComplete: () => {
        setVideo((pre) => ({
          ...pre,
          startPlay: true, // mark playback as started
          isPlaying: true, // mark playback at playing
        }));
      },
    });
  }, [isEnd, videoId]); // Dependencies to reapply animation

  useEffect(() => {
    const currentVideo = videoRef.current[videoId];
    if (currentVideo) {
      if (isPlaying) {
        currentVideo.play().catch((err) => console.error("Play failed:", err));
      } else {
        currentVideo.pause();
      }
    }
  }, [isPlaying, videoId]);

  const handleLoadedMetaData = (i, e) => setLoadedData((pre) => [...pre, e]);

  useEffect(() => {
    let currentProgress = 0;
    let span = videoSpanRef.current;

    if (span[videoId]) {
      // GSAP animation for progress bar
      let anim = gsap.to(span[videoId], {
        onUpdate: () => {
          const progress = Math.ceil(anim.progress() * 100);

          if (progress != currentProgress) {
            currentProgress = progress; // Update only if there's a change

            // Adjust progress bar width dynamically
            gsap.to(videoDivRef.current[videoId], {
              width:
                window.innerWidth < 760
                  ? `10vw`
                  : window.innerHeight < 1200
                  ? "10vw"
                  : "4vw",
            });

            gsap.to(span[videoId], {
              width: `${currentProgress}%`,
              backgroundColor: "white",
            });
          }
        },

        onComplete: () => {
          // Reset progress bar styling when animation ends
          if (isPlaying) {
            gsap.to(videoDivRef.current[videoId], {
              width: "12px",
            });
            gsap.to(span[videoId], {
              backgroundColor: "#afafaf",
            });
          }
        },
      });

      if (videoId == 0) {
        anim.restart();
      }

      // Function to update animation progress based on video time
      const animUpdate = () => {
        anim.progress(
          videoRef.current[videoId].currentTime /
            hightlightsSlides[videoId].videoDuration
        );
      };

      if (isPlaying) {
        // ticker to update the progress bar
        gsap.ticker.add(animUpdate);
      } else {
        // remove the ticker when the video is paused (progress bar is stopped)
        gsap.ticker.remove(animUpdate);
      }
    }
  }, [videoId, startPlay]);

  useEffect(() => {
    // Manage play/pause state based on video metadata and playback status
    if (loadedData.length > 3) {
      if (!isPlaying) {
        videoRef.current[videoId].pause();
      } else {
        startPlay && videoRef.current[videoId].play();
      }
    }
  }, [startPlay, videoId, isPlaying, loadedData]);

  const handleProcess = (type, i) => {
    switch (type) {
      case "video-end":
        setVideo((pre) => ({ ...pre, isEnd: true, videoId: i + 1 })); // Move to the next video
        break;

      case "video-last":
        setVideo((pre) => ({ ...pre, isLastVideo: true })); // Mark the last video
        break;

      case "video-reset":
        setVideo((pre) => ({ ...pre, isLastVideo: false, videoId: 0 })); // Reset to the first video
        break;

      case "toggle-play":
        setVideo((prev) => ({
          ...prev,
          isPlaying: !prev.isPlaying, // Toggle play/pause state
        }));
        break;

      default:
        return video;
    }
  };

  return (
    <>
      <div className="flex items-center">
        {hightlightsSlides.map((list, i) => (
          <div key={list.id} id="slider" className="sm:pr-20 pr-10">
            <div className="video-carousel_container">
              <div className="w-full h-full flex-center rounded-3xl overflow-hidden bg-black">
                <video
                  className={`${
                    list.id === 2 && "translate-x-44"
                  } pointer-events-none
                  `}
                  id="video"
                  type="video/mp4"
                  playsInline={true}
                  preload="auto"
                  muted
                  ref={(el) => (videoRef.current[i] = el)}
                  onEnded={() =>
                    i !== 3
                      ? handleProcess("video-end", i)
                      : handleProcess("video-last")
                  }
                  onPlay={() => {
                    setVideo((prevVideo) => ({
                      ...prevVideo,
                      isPlaying: true,
                    }));
                  }}
                  onLoadedMetadata={(e) => handleLoadedMetaData(i, e)}
                >
                  <source src={list.video} type="video/mp4" />
                </video>
              </div>

              <div className="absolute top-12 left-[5%] z-10">
                {list.textLists.map((text) => (
                  <p key={text} className="md:text-2xl text-xl font-medium">
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative flex-center mt-10">
        <div className="flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full">
          {videoRef.current.map((_, i) => (
            <span
              key={i}
              className="mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer"
              ref={(el) => (videoDivRef.current[i] = el)}
            >
              <span
                className="absolute h-full w-full rounded-full"
                ref={(el) => (videoSpanRef.current[i] = el)}
              />
            </span>
          ))}
        </div>

        <button className="control-btn">
          <img
            src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
            alt={isLastVideo ? "replay" : !isPlaying ? "play" : "pause"}
            onClick={
              isLastVideo
                ? () => handleProcess("video-reset")
                : () => handleProcess("toggle-play")
            }
          />
        </button>
      </div>
    </>
  );
};

export default VideoCarousel;