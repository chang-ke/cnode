import React from "react";
import "./animation.less";

const Spin = props => {
  let style = {};
  if (!Object.prototype.hasOwnProperty.call(props, "style"))
    style = {
      top: "45px"
    };
  else style = props.style;
  return (
    <div className={props.loading === true ? "spinner" : ""} style={style}>
      <div className={props.loading === true ? "spinner-container container1" : ""}>
        <div className="circle1" />
        <div className="circle2" />
        <div className="circle3" />
        <div className="circle4" />
      </div>
      <div className={props.loading === true ? "spinner-container container2" : ""}>
        <div className="circle1" />
        <div className="circle2" />
        <div className="circle3" />
        <div className="circle4" />
      </div>
      <div className={props.loading === true ? "spinner-container container3" : ""}>
        <div className="circle1" />
        <div className="circle2" />
        <div className="circle3" />
        <div className="circle4" />
      </div>
    </div>
  );
};
Spin.Defaultprops = {
  loading: true
};
export { Spin };
