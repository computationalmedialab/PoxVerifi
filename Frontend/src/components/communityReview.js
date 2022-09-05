import { toHaveStyle } from "@testing-library/jest-dom/dist/matchers";
import { Col, Layout } from "antd";
import { Component } from "react";
import { PieChart } from "react-minimal-pie-chart";
import { getWebsite, addWebsite } from "../lib/firebase";

class CommunityReview extends Component {
  state = { upvote: 0, neutralvote: 0, downvote: 0, empty: true };
  componentDidMount = () => {
    this.getVotes();
  };

  componentDidUpdate = () => {
    this.getVotes();
  };

  getVotes = () => {
    getWebsite(this.props.url).then((res) => {
      if (res == "DNA") {
        addWebsite(this.props.url).then((res2) => {});
      } else {
        if (res.downvote != 0 || res.upvote != 0 || res.neutralvote != 0) {
          this.setState({ empty: false });
          this.setState({ downvote: res.downvote });
          this.setState({ upvote: res.upvote });
          this.setState({ neutralvote: res.neutralvote });
        }
      }
    });
  };
  render() {
    return (
      <div>
        {this.state.empty | !this.props.hasVoted ? (
          <h2> You must vote first to see the community review! </h2>
        ) : (
          <PieChart
            style={{
              fontFamily:
                '"Nunito Sans", -apple-system, Helvetica, Arial, sans-serif',
              fontSize: "8px",
            }}
            radius={PieChart.defaultProps.radius - 6}
            lineWidth={60}
            segmentsStyle={{ transition: "stroke .8s", cursor: "pointer" }}
            animate
            label={({ dataEntry }) =>
              dataEntry.value > 0 ? dataEntry.value : ""
            }
            labelPosition={100 - 60 / 2}
            labelStyle={{
              fill: "#fff",
              opacity: 0.75,
              pointerEvents: "none",
            }}
            data={[
              { title: "True", value: this.state.upvote, color: "green" },
              // {
              //   title: "Mixed",
              //   value: this.state.neutralvote,
              //   color: "#DBA800",
              // },
              { title: "False", value: this.state.downvote, color: "#8b0000" },
            ]}
          />
        )}
      </div>
    );
  }
}
export default CommunityReview;
