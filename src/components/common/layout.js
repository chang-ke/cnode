import React, { Component } from "react";
import { Link } from "react-router-dom";
import { ScrollTop, debounce } from "../../util/tool";
import "./layout.less"

export const Tip = props => {
  return (
    <div id="login-tip" style={props.style}>
      您还未登陆,请<Link to={{ pathname: "/my/login", state: { from: props.location } }}>登陆</Link>
    </div>
  );
};
Tip.defaultProps = {
  style: {},
  title: "详情"
};
export const NavBar = ({ title, history, children }) => {
  return (
    <div className="navbar">
      {children}
      {history ? <span className="iconfont icon-fanhui back" onClick={() => history.goBack()} /> : ""}
      <h4 className="navbar-title">{title}</h4>
    </div>
  );
};
NavBar.defaultProps = {
  title: ""
};

export const HeaderBar = ({ location }) => {
  const addClass = e => {
    let div = document.getElementById("header").children;
    if (e.target.parentNode.id !== "header") {
      //防止点击li标签也执行
      for (let i = 0; i < div.length; ++i) {
        if (div[i].className === "header_active") div[i].removeAttribute("class");
      }
      e.target.parentNode.className = "header_active";
    } //点击的是a标签,需要设置的样式是父节点
  };

  return (
    <header id="header" onClick={addClass}>
      {headerTab.map((item, index) => {
        return (
          <div key={index} className={item.path === location.pathname + location.search ? "header_active" : ""}>
            {/*默认第一个*/}
            <Link to={item.path}>{item.text}</Link>
          </div>
        );
      })}
    </header>
  );
};

export const FooterBar = ({ location }) => {
  const addClass = e => {
    e.preventDefault();
    let div = document.getElementById("footer").children;
    if (
      e.target.parentNode.id !== "footer" &&
      e.target.className.indexOf("iconfont") < 0 &&
      e.target.className.indexOf("footer_active") < 0
    ) {
      //避免重复点击执行 防止点击li标签也执行
      for (let i = 0; i < div.length; ++i) {
        if (div[i].className === "footer_active") div[i].removeAttribute("class");
      }
      e.target.parentNode.className = "footer_active";
    } //点击的是a标签,需要设置的样式是父节点
    if (e.target.parentNode.id === "footer") {
      for (let i = 0; i < div.length; ++i) {
        if (div[i].className === "footer_active") div[i].removeAttribute("class");
      }
      e.target.className = "footer_active";
    }
  };

  return (
    <footer id="footer" onClick={addClass}>
      {footerTab.map((item, index) => {
        return (
          <div key={index} className={item.path === location.pathname ? "footer_active" : ""}>
            <Link to={item.path} className={item.class}>
              <span className="linkname">{item.text}</span>
            </Link>
          </div>
        );
      })}
    </footer>
  );
};

export class BackTop extends Component {
  state = {
    visible: false
  };
  back = () => {
    const Document = !document.documentElement.scrollTop ? document.body : document.documentElement,
      step = Document.scrollTop / 100;
    let Interval = setInterval(() => {
      if (Document.scrollTop > step) Document.scrollTop -= step;
      else {
        Document.scrollTop = 4;
        clearInterval(Interval);
      }
    }, 0);
  };
  show = () => {
    if (ScrollTop() > window.innerHeight && !this.state.visible) this.setState({ visible: true });
    else if (ScrollTop() < window.innerHeight && this.state.visible) this.setState({ visible: false });
  };
  componentDidMount() {
    document.addEventListener("scroll", debounce(this.show, 100, false));
  }
  componentWillUnmount() {
    document.removeEventListener("scroll", debounce(this.show, 100, false));
  }
  render() {
    const { visible } = this.state;
    return visible ? <div className="iconfont icon-backtop" onClick={this.back} /> : null;
  }
}

const footerTab = [
  {
    text: "首页",
    path: "/topics",
    class: "icon-shouye iconfont"
  },
  {
    text: "发表",
    path: "/my/report",
    class: "icon-fabiao iconfont"
  },
  {
    text: "消息",
    path: "/my/message",
    class: "icon-xiaoxi iconfont"
  },
  {
    text: "我的",
    path: "/my/view",
    class: "icon-wode iconfont"
  }
];
const headerTab = [
  {
    text: "全部",
    path: "/topics"
  },
  {
    text: "精华",
    path: "/topics?tab=good"
  },
  {
    text: "分享",
    path: "/topics?tab=share"
  },
  {
    text: "问答",
    path: "/topics?tab=ask"
  },
  {
    text: "招聘",
    path: "/topics?tab=job"
  }
];
