/*global chrome*/
import { Col, Layout, message } from "antd";
import { Component } from "react";
import styles from "../styles/Voting.module.css";
import { SmileOutlined, FrownOutlined, MehOutlined } from "@ant-design/icons";
import { castVote } from "../lib/firebase";

class Voting extends Component {
  state = { vote: -1, votetype: "" };

  componentDidMount = () => {
    let key = this.props.url;
    chrome.storage.sync.get([key], (result) => {
      console.log(result);
      console.log("Value currently is " + result[key]);
      this.setState({ vote: result[key] || -1 });
      let vote = result[key];
      if (vote == 1)
        this.setState({ votetype: "You voted that this news seemed false." });
      if (vote == 2)
        this.setState({
          votetype: "You voted that this news had mixed accuracy.",
        });
      if (vote == 3)
        this.setState({ votetype: "You voted that this news seemed true." });
    });
  };
  castVote = (vote) => {
    if (this.state.vote == -1) {
      this.setState({ vote: vote });
      var voteChoice = [0, 0, 0];
      voteChoice[vote - 1] = 1;
      castVote(this.props.url, voteChoice);
      message.success("Vote cast.");
      let key = this.props.url;
      let value = vote;
      chrome.storage.sync.set({ [key]: value }, function () {
        console.log("Value is set to " + value);
      });
      this.setState({ vote });
      if (vote == 1)
        this.setState({ votetype: "You voted that this news seemed false." });
      if (vote == 2)
        this.setState({
          votetype: "You voted that this news had mixed accuracy.",
        });
      if (vote == 3)
        this.setState({ votetype: "You voted that this news seemed true." });
      this.props.checkVoted();
    }
  };

  uncastVote = () => {
    var voteChoice = [0, 0, 0];
    voteChoice[this.state.vote - 1] = -1;
    castVote(this.props.url, voteChoice);
    this.setState({ vote: -1 });
    let key = this.props.url;
    let value = -1;
    chrome.storage.sync.set({ [key]: value }, function () {
      console.log("key");
      console.log("Value is set to " + value);
    });
    message.success("Vote revoked.");
  };

  render() {
    return (
      <div>
        <h1> Give a Truth Review</h1>
        {this.state.vote == -1 ? (
          <div className={styles.vContainer}>
            <FrownOutlined
              style={{ color: "#8b0000" }}
              className={styles.icon}
              onClick={() => this.castVote(1)}
            />
            {/* <MehOutlined
              style={{ color: "#DBA800" }}
              className={styles.icon}
              onClick={() => this.castVote(2)}
            /> */}
            <SmileOutlined
              style={{ color: "green" }}
              className={styles.icon}
              onClick={() => this.castVote(3)}
            />
          </div>
        ) : (
          <div>
            {" "}
            <h2>
              {" "}
              {this.state.votetype}{" "}
              <a onClick={this.uncastVote}> Click here to revote.</a>
            </h2>
          </div>
        )}
      </div>
    );
  }
}
export default Voting;
