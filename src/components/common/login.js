import React from "react";
import { Input, Button } from "antd";
import { connect } from "react-redux";
import { NavBar } from "./layout";
import "./login.less"

const Login = ({ dispatch, location, history }) => {
  const login = () => {
    const access_token = document.getElementById("submit-token").value;
    const path = location.state ? location.state.from.pathname : "detail";
    dispatch({ type: "login", payload: { access_token: access_token, path: path, history: history } });
  };

  return (
    <div id="submit">
      <NavBar history={history} title={"登陆"} />
      <Input
        type="password"
        id="submit-token"
        placeholder="请输入access_token"
        defaultValue="0356a904-b9cf-4ab0-9a03-2cac15a9e1b9"
      />
      <br />
      <Button id="submit-btn" onClick={login}>
        登陆
      </Button>
    </div>
  );
};
const mapStateToProps = state => {
  return {
    ...state.User
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch: dispatch
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
