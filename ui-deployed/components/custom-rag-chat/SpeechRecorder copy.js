import React, { useState, useRef } from "react";

const SpeechRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState("");
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

      // Send the latest recorded WAV file to FastAPI
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

  // Upload audio to FastAPI for transcription
  const uploadAudio = async (audioBlob) => {
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.wav");

    try {
      const response = await fetch("http://localhost:8000/transcribe-audio/", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setTranscribedText(data.transcription || "Could not transcribe audio");
    } catch (error) {
      console.error("Error uploading audio:", error);
    }
  };

  return (
    <div>
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
      <p>Transcribed Text: {transcribedText}</p>
    </div>
  );
};

export default SpeechRecorder;
