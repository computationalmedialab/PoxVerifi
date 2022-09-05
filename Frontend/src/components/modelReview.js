import { Col, Layout } from "antd";
import { Component } from "react";
import axios from "axios";
import { getClassifications, getSimilarText } from "../lib/mlmodels";
const hosturl = "http://193.122.143.66:5000";

class ModelReview extends Component {
  state = { modelAccuracy: -1 };
  componentDidMount() {
    axios.get(hosturl + "/ml?claim=" + this.props.text).then((res) => {
      this.setState({ modelAccuracy: res.data });
    });
  }

  render() {
    return (
      <div>
        <h2>
          {" "}
          {this.state.modelAccuracy == -1 ? (
            "Loading..."
          ) : this.state.modelAccuracy == 1 ? (
            <div>
              {" "}
              {"Our monkeypox-trained models predict this claim is "}{" "}
              <span color="green" style={{ color: "green" }}>
                {" "}
                {"likely true."}{" "}
              </span>{" "}
            </div>
          ) : (
            <div>
              {" "}
              {"Our monkeypox-trained models predict this claim is "}{" "}
              <span color="red" style={{ color: "red" }}>
                {" "}
                {"likely false."}{" "}
              </span>{" "}
            </div>
          )}
        </h2>
      </div>
    );
  }
}
export default ModelReview;
