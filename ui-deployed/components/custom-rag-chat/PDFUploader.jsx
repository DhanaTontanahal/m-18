import React, { useState } from "react";
import axios from "axios";
import "./PDFUploader.css";
import { saveChatToFirestoreJustChatMsg } from "./firebaseConfig";

const PDFUploader = ({ onClose, onUpload }) => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      alert("Only PDF files are allowed.");
    }
  };

  const handleUpload = async () => {
    console.log("uploading file");
    if (!file) {
      alert("Please select a PDF file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploadStatus("Uploading...");
      const response = await axios.post(
        "https://va-nodejs-app-855220130399.us-central1.run.app/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setUploadStatus("Upload successful!");
      setFileUrl(response.data.fileUrl);
      console.log(response.data);
      const pdfMessage = {
        id: `msg-${Date.now()}`,
        sender: "user",
        fileName: response.data.fileUrl.substring(
          response.data.fileUrl.lastIndexOf("-") + 1,
          response.data.fileUrl.length
        ),
        message:
          `` +
          response.data.fileUrl.substring(
            response.data.fileUrl.lastIndexOf("-"),
            response.data.fileUrl.length
          ),
        pdfUrl: response.data.fileUrl, // Attach PDF URL
        timestamp: new Date().toISOString(),
      };

      onUpload(pdfMessage); // ✅ Add message to chat
      await saveChatToFirestoreJustChatMsg(
        "urwithdhanulloydsbankinggroup",
        "Russel",
        pdfMessage
      ); // ✅ Save message to Firestore

      //march 17 cloudathno change to show the uploaded document to the chat history
      // onUpload({
      //   sender: "user",
      //   message: "Uploaded a PDF file.",
      //   pdfUrl: response.data.fileUrl, // Attach PDF URL
      // });

      onClose();
    } catch (error) {
      console.error("Upload failed:", error);
      // setUploadStatus("Upload failed.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <span className="close-icon" onClick={onClose}>
          &times;
        </span>
        <h2>Upload a PDF</h2>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
        />
        <button onClick={handleUpload} disabled={!file}>
          Upload
        </button>
        <p>{uploadStatus}</p>

        {fileUrl && (
          <div>
            <h3>File Uploaded Successfully!</h3>
            <a href={fileUrl} target="_blank" rel="noopener noreferrer">
              View PDF
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFUploader;
