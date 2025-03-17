"use client";
import type { Metadata } from "next";
import { Inter, IBM_Plex_Serif } from "next/font/google";
import "./globals.css";
// import Sidebar from "@/components/Sidebar";
import App from "@/components/custom-rag-chat/App";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-ibm-plex-serif",
});

const metadata: Metadata = {
  title: "Sample Testing App",
  description:
    "This app tests the RAG instance created and chatbot configured on GENR AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${ibmPlexSerif.variable}`}>
        {children}
        <App
          userName={"Russel"}
          apiUrl={
            "https://fastapi-app4-855220130399.us-central1.run.app/api/query"
          } //mandatory
          instanceName={"urwithdhanulloydsbankinggroup"} //mandatory
          endPoint={"https://fastapi-app4-855220130399.us-central1.run.app"} //mandatory
          welcomeMessage={`Hello, I’m your Virtual Assistant. How can I help you today? You can ask me about credit cards, application process, eligibility, and more!`}
          inputMsgPlaceholder={"Ask me anything..."}
        />
      </body>
    </html>
  );
}
