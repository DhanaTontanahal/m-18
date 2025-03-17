import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
} from "firebase/firestore";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBMOS-HOJjJAFSwsB2IgugFmRRVGLeyfwA",
  authDomain: "voltaic-battery-447511-p5.firebaseapp.com",
  projectId: "voltaic-battery-447511-p5",
  storageBucket: "voltaic-battery-447511-p5.firebasestorage.app",
  messagingSenderId: "855220130399",
  appId: "1:855220130399:web:a317fc6aa37a4b68bfc1ea",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Error during login", error);
  }
};

const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error logging out", error);
  }
};

// ✅ Firestore Functions
const saveChatToFirestore = async (props, chatMessage) => {
  try {
    await addDoc(
      collection(db, `${props.instanceName}-${props.userName}-chat_history`),
      chatMessage
    );
  } catch (error) {
    console.error("Error saving chat:", error);
  }
};

// ✅ Firestore Functions
const saveChatToFirestoreJustChatMsg = async (
  instanceName,
  userName,
  chatMessage
) => {
  console.log("saveChatToFirestore");
  console.log(chatMessage);
  try {
    await addDoc(
      collection(db, `${instanceName}-${userName}-chat_history`),
      chatMessage
    );
  } catch (error) {
    console.error("Error saving chat:", error);
  }
};

const getChatHistory = async (props) => {
  try {
    const q = query(
      collection(db, `${props.instanceName}-${props.userName}-chat_history`),
      orderBy("timestamp", "asc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data());
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return [];
  }
};

export {
  auth,
  signInWithGoogle,
  logout,
  db,
  getChatHistory,
  saveChatToFirestore,
  saveChatToFirestoreJustChatMsg,
};
