/*global chrome*/
import "./App.css";
import "antd/dist/antd.css";
import styles from "./styles/Home.module.css";
import Voting from "./components/voting";
import Info from "./components/info";
import PageReview from "./components/pageReview";
import { InfoCircleOutlined } from "@ant-design/icons";
import { initFirebase } from "./lib/firebase";

function App() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        PoxVerifi {"    "} <Info />
      </header>
      <PageReview></PageReview>
    </div>
  );
}

export default App;
