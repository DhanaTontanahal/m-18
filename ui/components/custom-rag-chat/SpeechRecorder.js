import React, { useState, useRef } from "react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";

const SpeechRecorder = ({ setInput, handleSend, endPoint }) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Start recording
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      audioChunksRef.current = [];
      await uploadAudio(audioBlob);
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  // Stop recording
  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  // Upload audio to FastAPI for transcription & send message
  const uploadAudio = async (audioBlob) => {
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.wav");

    try {
      const response = await fetch(`${endPoint}/transcribe-audio/`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.transcription) {
        setInput(data.transcription); // Set transcribed text in input field
        setTimeout(() => handleSend(data.transcription), 500); // Auto-send message after 0.5 sec
      }
    } catch (error) {
      console.error("Error uploading audio:", error);
    }
  };

  return (
    <button
      style={{ marginRight: "5px" }}
      className={`mic-button ${isRecording ? "recording" : ""}`}
      onClick={isRecording ? stopRecording : startRecording}
    >
      {isRecording ? <FaMicrophoneSlash /> : "🎙️  "}
    </button>
  );
};

export default SpeechRecorder;
