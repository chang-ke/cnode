import React from "react";
import ReactDOM from "react-dom";
import Router from "./router";
import { Provider } from "react-redux";
import store from "./redux/store";
import "./index.less";

const render = () =>
  ReactDOM.render(
    <Provider store={store}>
      <Router />
    </Provider>,
    document.getElementById("root")
  );
render();

store.subscribe(render);
