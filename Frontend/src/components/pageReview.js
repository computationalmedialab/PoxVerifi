/*global chrome*/
import { Spin, Space } from "antd";
import { Component } from "react";
import SimilarClaims from "./similarClaims";
import CommunityReview from "./communityReview";
import ModelReview from "./modelReview";
import axios from "axios";
import Voting from "./voting";
import styles from "../styles/PageReview.module.css";
import { Collapse } from "antd";
import React from "react";
const { Panel } = Collapse;

const hosturl = "http://193.122.143.66:5000";
const claim =
  "Monkeypox is a zoonotic imilar to smallpox, although with notably lower mort although with notably lower mortali although with notably lower mortaliali although with notably lower mortality.";
const text = "sjkdfhalskjdhfajksadhlf";
const sitename = "WHO";

class PageReview extends Component {
  state = {
    claim: "",
    author: "",
    loading: true,
    claimless: true,
    url: "",
    hasVoted: false,
  };
  componentDidMount() {
    // this.setState({
    //   url: "https://www.washingtonpost.com/health/2022/07/30/monkeypox-jynneos-vaccine-supply-united-states/",
    // });
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      let url = tabs[0].url;
      console.log("Th=e yrl is" + url);
      this.setState({ url: url });
      this.getClaim();
    });

    this.checkVoted();
  }

  componentDidUpdate() {
    // this.setState({
    //   url: "https://www.washingtonpost.com/health/2022/07/30/monkeypox-jynneos-vaccine-supply-united-states/",
    // });
    // chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    //   let url = tabs[0].url;
    //   console.log("Th=e yrl is" + url);
    //   this.setState({ url: url });
    //   this.getClaim();
    // });

    this.checkVoted();
  }

  checkVoted = () => {
    let key = this.state.url;
    chrome.storage.sync.get([key], (result) => {
      let vote = result[key] || -1;
      if (vote != -1) {
        this.setState({ hasVoted: true });
      }
    });
  };

  getClaim = () => {
    try {
      axios.get(hosturl + "/headline?url=" + this.state.url).then((res) => {
        console.log(res.data);
        this.setState({ claim: res.data.title });
        this.setState({ author: res.data.signature });
        this.setState({ loading: false });
        this.setState({ claimless: false });
      });
    } catch {
      console.log("error caught");
      this.setState({ loading: false });
    }
  };
  render() {
    return this.state.claimless ? (
      <div
        style={{
          height: 100,
          alignContent: "center",
          justifyContent: "center",
          marginTop: 70,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        {this.state.loading ? (
          <Spin size="large" />
        ) : (
          <h2 className={styles.soloh2}> No Claim Found Here</h2>
        )}
      </div>
    ) : (
      <div className={styles.container}>
        <div className={styles.subContainer}>
          <h1> Reviewing Claim</h1>{" "}
          <h2 style={{ marginBottom: 0 }}> {this.state.claim}</h2>
          <h3 style={{ fontWeight: "normal" }}>
            <a link={this.state.url} style={{ fontSize: 12 }}>
              {this.state.author}
            </a>
          </h3>
        </div>
        <div className={styles.subContainer2}>
          <h1>Accuracy Assessment</h1>
          <Collapse defaultActiveKey={[]} ghost="true">
            <Panel header="Automated Review" key="1">
              <ModelReview text={this.state.claim} />
            </Panel>
            <Panel header="Community Review" key="2">
              <CommunityReview
                url={this.state.url}
                hasVoted={this.state.hasVoted}
              />
            </Panel>
            <Panel header="Similar Vetted Claims" key="3">
              <SimilarClaims text={this.state.claim} />
            </Panel>
          </Collapse>
        </div>
        <div className={styles.subContainer}>
          <Voting url={this.state.url} checkVoted={this.checkVoted} />
        </div>
      </div>
    );
  }
}
export default PageReview;

/*
<div className={styles.subContainer}>
          <h1> Communites Truth Review</h1> <h2> </h2>
        </div>
        <div className={styles.subContainer}>
          <h1> Automated Truth Review</h1> <h2> </h2>
        </div>
        <div className={styles.subContainer}>
          <h1> Vetted Similar Claims</h1> <h2> </h2>
        </div>
        <div className={styles.subContainer}>
          <h1> Cast Your Vote</h1> <h2> </h2>
        </div>

        */
