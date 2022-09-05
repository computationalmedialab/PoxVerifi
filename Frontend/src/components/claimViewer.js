import { Col, Layout } from "antd";
import { Component } from "react";

class ClaimViewer extends Component {
  render() {
    return (
      <div
        style={{
          flex: 1,
          flexDirection: "column",
          alignContent: "center",
          justifyContent: "center",
          height: 70,
          marginBottom: 20,
        }}
      >
        <h4 style={{ fontSize: 12, flex: 1 }}>{this.props.claim["claim"]}</h4>

        <div style={{ flex: 100 }} />
        <h2 style={{ flex: 1 }}> Rated: {this.props.claim["rating"]}</h2>
      </div>
    );
  }
}
export default ClaimViewer;
