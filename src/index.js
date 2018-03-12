import React from "react";
import ReactDOM from "react-dom";
import Router from "./router";
import { Provider } from "react-redux";
import store from "./redux/store";
import "./index.less";
import "./css/index.less";
import "./css/home.less";
import "./css/detail.less";

const render = () =>
  ReactDOM.render(
    <Provider store={store}>
      <Router />
    </Provider>,
    document.getElementById("root")
  );
render();

store.subscribe(render);
