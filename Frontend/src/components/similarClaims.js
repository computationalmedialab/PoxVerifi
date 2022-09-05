import { Col, Layout, Pagination } from "antd";
import { Component } from "react";
import axios from "axios";
import ClaimViewer from "./claimViewer";
import { getClassifications, getSimilarText } from "../lib/mlmodels";
const hosturl = "http://193.122.143.66:5000";

class SimilarClaims extends Component {
  state = { similarTexts: [], pageNumber: 1 };
  componentDidMount() {
    axios.get(hosturl + "/matches?text=" + this.props.text).then((res) => {
      console.log(res.data);
      this.setState({ similarTexts: res.data });
    });
  }

  render() {
    return this.state.similarTexts.length == 0 ? (
      <h2>
        {" "}
        We didn't find any similar claims. Are you sure your news is related to
        Monkeypox?
      </h2>
    ) : (
      <div
        style={{
          flex: 1,
          alignContent: "center",
          justifyContent: "center",
          height: 300,
        }}
      >
        <div
          style={{
            flex: 1,
            alignContent: "center",
            justifyContent: "center",
            height: 260,
          }}
        >
          {this.state.similarTexts
            .slice(this.state.pageNumber * 3 - 3, this.state.pageNumber * 3)
            .map((claim) => {
              return <ClaimViewer claim={claim} />;
            })}
        </div>
        {this.state.similarTexts.length <= 3 ? null : (
          <Pagination
            style={{
              height: 30,
              marginTop: 20,
              marginLeft: 45,
              alignSelf: "flex-end",
            }}
            simple
            defaultCurrent={this.state.pageNumber}
            total={this.state.similarTexts.length}
            pageSize={3}
            onChange={(pageNumber) => {
              this.setState({ pageNumber });
            }}
          />
        )}
      </div>
    );
  }
}
export default SimilarClaims;
