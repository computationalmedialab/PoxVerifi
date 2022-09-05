import { Col, Layout, Popover } from "antd";
import { Component } from "react";
import React from "react";
import styles from "../styles/Info.module.css";
import { InfoCircleOutlined } from "@ant-design/icons";

const content = (
  <div className={styles.container}>
    <p></p>
    PoxVerifi is an information verification system to combat monkeypox
    misinformation. PoxVerifi combines community given reviews with automated
    machine learning models in order to accurately verify the credibility of
    monkeypox related information.
    <p></p>
  </div>
);

const Info = () => (
  <Popover placement="bottom" content={content} title="About PoxVerifi">
    <InfoCircleOutlined> Hoverme </InfoCircleOutlined>
  </Popover>
);

export default Info;
