import React from "react";
import dynamic from "./util/dynamic";
import createHistory from "history/createBrowserHistory";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import { BackTop } from "./components/common/layout";

const history = (function(history) {
  const oldListen = history.listen;
  history.listen = callback => {
    callback(history.location);
    return oldListen.call(history, callback);
  };
  return history;
})(createHistory());

const Title = dynamic(() => import("./components/title"));
const Routes = [
  {
    login: false,
    path: "/user/:id",
    Component: dynamic(() => import("./components/personal"))
  },
  {
    login: false,
    path: "/detail/:id",
    Component: dynamic(() => import("./components/detail"))
  },
  {
    login: true,
    path: "/my/view",
    Component: dynamic(() => import("./components/user"))
  },
  {
    login: true,
    path: "/my/report",
    Component: dynamic(() => import("./components/report"))
  },
  {
    login: true,
    path: "/my/message",
    Component: dynamic(() => import("./components/message"))
  },
  {
    login: false,
    path: "/my/login",
    Component: dynamic(() => import("./components/common/login"))
  }
];

const Routers = () => {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/:type" render={props => <Title {...props} />} history={history} />
          {Routes.map(({ login, Component, path }, index) => {
            if (login) {
              return <LoginComponent exact path={path} render={props => <Component {...props} />} key={index} />;
            } else {
              return <Route exact path={path} render={props => <Component {...props} />} key={index} />;
            }
          })}
          <Redirect from="/" to="/topics" />
        </Switch>
        <BackTop key="backTop" />
      </div>
    </Router>
  );
};

/**
 * 封装Route，跳转前判断本地是否存在token如果不存在则重定向至指定
 * @param {String} path - 原始Route的path
 * @param {Object} Component - 接受组件参数
 */
const LoginComponent = ({ render: Render, ...data }) => {
  const isLogin = sessionStorage.AccessToken;
  const renderRoute = props =>
    isLogin ? (
      <Route render={Render} /> //没有登陆就跳转登陆
    ) : (
      <Redirect
        to={{
          pathname: "/my/login",
          state: { from: props.location } //获取当前的路径，方便登陆完跳转回来
        }}
      />
    );
  return <Route {...data} render={renderRoute} />;
};

export default Routers;
