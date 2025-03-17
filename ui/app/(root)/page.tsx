"use client";
import HeaderBox from "@/components/HeaderBox";
import TotalBalanceBox from "@/components/TotalBalanceBox";
import RecentTransaction from "../../components/RecentTransaction";
import App from "../../components/custom-rag-chat/App";

const Home = () => {
  const loggedIn = {
    firstName: "Russel",
    lastName: "Jones",
    email: "urwithdhanu@gmail.com",
  };

  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox
            type="greeting"
            title="Welcome"
            user={loggedIn?.firstName || "Guest"}
            subtext="Access and manage your account and transactions efficiently."
          />

          <TotalBalanceBox
            accounts={[]}
            totalBanks={1}
            totalCurrentBalance={122250.35}
          />
        </header>
        RECENT TRANSACTIONS
        <RecentTransaction />
      </div>

      <App
        userName={"Dhana Shekhar T"}
        apiUrl={"http://localhost:8000/api/query"} //mandatory
        instanceName={"urwithdhanutestlclvl1"} //mandatory
        endPoint={"http://localhost:8000"} //mandatory
        welcomeMessage={`Hello, I’m your Virtual Assistant. How can I help you today?`}
        inputMsgPlaceholder={"Ask me anything..."}
        // footerMessage={"Sample chatbot footer message"}
        // responseIcon={
        //   "https://tse3.mm.bing.net/th?id=OIP.NJMu_dmcLZcvdrIegdFkmgHaHa&pid=Api&P=0&h=180"
        // }
        // showMic={false}
        // showFileAttachmentIcon={false}
        // showCaseIconImgUrl={
        //   "https://tse3.mm.bing.net/th?id=OIP.NJMu_dmcLZcvdrIegdFkmgHaHa&pid=Api&P=0&h=180"
        // }
        // showCaseIconImgStyle={{
        //   borderRadius: "60px",
        //   width: "60px",
        //   height: "60px",
        // }}
        // showCaseIconImgWidth={50}
        // showCaseIconImgHeight={50}
        // headerStyle={{ color: "black", backgroundColor: "#11b67a" }}
        // userIcon={
        //   "https://tse3.mm.bing.net/th?id=OIP.e2y09TFSgn5qK8FmayD4pgHaHa&pid=Api&P=0&h=180"
        // }
        // chatterIcon={
        //   "https://tse3.mm.bing.net/th?id=OIP.NJMu_dmcLZcvdrIegdFkmgHaHa&pid=Api&P=0&h=180"
        // }
        // attachIcon={
        //   "https://tse2.mm.bing.net/th?id=OIP.0ULX-waARB3T1oO40CnO3gHaFm&pid=Api&P=0&h=180"
        // }
        // sendIcon={
        //   "https://tse2.mm.bing.net/th?id=OIP._HCqv2W2JZarfgfLjOCIcAHaHa&pid=Api&P=0&h=180"
        // }
        // uploadFileUrl={
        //   "https://va-nodejs-app-855220130399.us-central1.run.app/upload"
        // }
      />
    </section>
  );
};

export default Home;
