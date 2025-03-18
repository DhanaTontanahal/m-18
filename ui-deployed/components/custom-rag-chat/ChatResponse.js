import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";

const ChatResponse = ({
  message,
  videoLink,
  isAssistant,
  autoPlay,
  endPoint,
  audioUrl,
  uniqueChatHistoryLength,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [audioSrc, setAudioSrc] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(new Audio());
  const hasPlayed = useRef(false);

  // Convert YouTube URL into an Embed URL
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const regExp =
      /(?:youtube\.com\/(?:.*v=|.*\/|.*embed\/)|youtu.be\/)([^"&?\/\s]+)/;
    const match = url.match(regExp);
    const videoId = match ? match[1] : null;
    return videoId
      ? `https://www.youtube.com/embed/${videoId}?autoplay=1`
      : null;
  };

  const youtubeEmbedUrl = getYouTubeEmbedUrl(videoLink);
  const isYouTubeVideo = !!youtubeEmbedUrl;

  // ✅ Safely parse the response message
  let parsedMessage;
  try {
    parsedMessage = JSON.parse(message); // Try parsing as JSON
  } catch (e) {
    parsedMessage = { answer: message, follow_up_question: null }; // Use plain text if not JSON
  }

  const playReceivedSpeech = useCallback(async () => {
    if (isMuted) return;
    try {
      audioRef.current.src = audioUrl;
      audioRef.current.play();
      setIsPlaying(true);
      audioRef.current.onended = () => setIsPlaying(false);
    } catch (error) {
      console.error("Error generating speech:", error);
    }
  }, [isMuted, audioUrl]); // ✅ Dependencies stay stable

  /*
  const playReceivedSpeech = async () => {
    if (isMuted) return; 
    try {
      audioRef.current.src = audioUrl;
      audioRef.current.play();
      setIsPlaying(true);
      audioRef.current.onended = () => setIsPlaying(false);
    } catch (error) {
      console.error("Error generating speech:", error);
    }
  };
  */

  // Auto-play when receiving a new assistant message (Run only once)
  useEffect(() => {
    if (autoPlay && isAssistant && !hasPlayed.current && !isMuted) {
      hasPlayed.current = true;
      setTimeout(() => {
        // playSpeech();
        playReceivedSpeech();
      }, 2000);
    }
  }, [autoPlay, isAssistant, isMuted, playReceivedSpeech]);

  /*
  const playSpeech = async () => {
    if (isMuted) return; 
    try {
      const response = await fetch(`${endPoint}/generate-audio/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: parsedMessage.answer,
          endpointUrl: endPoint,
        }),
      });

      const data = await response.json();
      audioRef.current.src = data.audio_url;
      audioRef.current.play();
      setIsPlaying(true);
      audioRef.current.onended = () => setIsPlaying(false);
    } catch (error) {
      console.error("Error generating speech:", error);
    }
  };
*/

  if (!message && !videoLink) return null;

  const generateSpeech = async (text) => {
    if (isMuted) return;
    try {
      const response = await fetch(`${endPoint}/generate-audio/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, endpointUrl: endPoint }),
      });

      const data = await response.json();
      setAudioSrc(data.audio_url);
      audioRef.current.src = data.audio_url;
      audioRef.current.play();
      setIsPlaying(true);
      audioRef.current.onended = () => setIsPlaying(false);
    } catch (error) {
      console.error("Error generating speech:", error);
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => {
      if (prev) {
        if (audioSrc) {
          audioRef.current.play();
          setIsPlaying(true);
        }
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
      return !prev;
    });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.1 }}
        className="bg-gray-100 rounded-md p-4 relative"
      >
        {/* {!!isAssistant && (
          <button className="mute-button" onClick={toggleMute}>
            {isMuted ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
          </button>
        )} */}

        <ReactMarkdown className="text-gray-800 text-pretty font-bold  leading-relaxed">
          {parsedMessage.answer}
        </ReactMarkdown>

        {/* {parsedMessage.follow_up_question && (
          <p className="text-sm text-gray-500 mt-2">
            {parsedMessage.follow_up_question}
          </p>
        )} */}

        {/* Animated Waves when Audio is Playing */}
        {isPlaying && (
          <div className="wave-container">
            <div className="wave wave1"></div>
            <div className="wave wave2"></div>
            <div className="wave wave3"></div>
          </div>
        )}

        {/* Feedback Section (Only for Assistant Responses) */}
        {isAssistant && uniqueChatHistoryLength > 1 && (
          <div
            style={{ position: "absolute", left: "-33px", bottom: "-8px" }}
            className="feedback-section"
          >
            <motion.div
              className="play-button-wrapper"
              whileTap={{ scale: 0.9 }}
              animate={isPlaying ? { scale: [1, 1.2, 1] } : {}}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            ></motion.div>
            {/* <span>Was this helpful?</span> */}
            <FaThumbsUp
              style={{ color: "green" }}
              className={`feedback-icon ${feedback === "like" ? "active" : ""}`}
              onClick={() => setFeedback("like")}
            />
            <FaThumbsDown
              style={{ color: "red" }}
              className={`feedback-icon ${
                feedback === "dislike" ? "active" : ""
              }`}
              onClick={() => setFeedback("dislike")}
            />
          </div>
        )}

        {videoLink && (
          <div
            className="video-thumbnail mt-3"
            onClick={(e) => {
              e.preventDefault();
              setIsModalOpen(true);
            }}
            style={{ cursor: "pointer", position: "relative" }}
          >
            {isYouTubeVideo ? (
              <Image
                src={`https://img.youtube.com/vi/${
                  youtubeEmbedUrl.split("/embed/")[1].split("?")[0]
                }/hqdefault.jpg`}
                alt="Video Thumbnail"
                width={500}
                height={300}
                className="rounded-md shadow-md"
              />
            ) : (
              <video width="100%" height="200" className="rounded-md shadow-md">
                <source src={videoLink} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
            <div className="play-button-overlay">▶</div>
          </div>
        )}
      </motion.div>

      {/* Video Modal Popup */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <span
              className="close-button"
              onClick={() => setIsModalOpen(false)}
            >
              ✖
            </span>

            {/* YouTube Video Embed */}
            {isYouTubeVideo ? (
              <iframe
                width="100%"
                height="400"
                src={youtubeEmbedUrl}
                title="Video Response"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              /* Direct Video Embed */
              <video width="100%" height="400" controls autoPlay>
                <source src={videoLink} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </div>
      )}

      {/* Styling */}
      <style jsx>{`
        .video-thumbnail {
          position: relative;
          display: inline-block;
        }

        .play-button-overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(0, 0, 0, 0.6);
          color: white;
          font-size: 40px;
          padding: 10px 20px;
          border-radius: 50%;
          cursor: pointer;
        }

        .close-button {
          position: absolute;
          top: 10px;
          right: 15px;
          font-size: 24px;
          cursor: pointer;
          color: #333;
          background: white;
          border: 2px solid #999;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease-in-out;
        }

        .close-button:hover {
          color: white;
          background: red;
          border: 2px solid red;
        }
      `}</style>
    </>
  );
};

export default ChatResponse;
