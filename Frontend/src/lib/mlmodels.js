import axios from "axios";

const hosturl = "http://127.0.0.1:5000";

export const getSimilarText = async (text) => {
  axios.get(hosturl + "/matches?text=" + text).then((res) => {
    console.log(text);
    return res;
  });
};

export const getClassifications = async (text) => {
  axios.get(hosturl + "/classify?text=" + text).then((res) => {
    console.log(res.data);
    return res.data;
  });
};
