import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { FooterBar, HeaderBar } from "../common/layout";
import { formatTime, throttle, toBottom, ScrollTop } from "../../util/tool";
import { Spin } from "../common/spin";
import "./style.less"

class Title extends PureComponent {
  state = {
    data: [],
    page: 4
  };
  //page=2是因为初始的时候已经请求过一页了
  getTitles = throttle(
    () => {
      const { location: { pathname, search }, downLoading } = this.props; //获取当前页的路径
      const type = pathname + search;
      const { page } = this.state;
      if (isScrollDown() && !downLoading) {
        this.props.dispatch({
          type: "fetchTitles",
          payload: { type: type, size: 5, page: page }
        });
      }
    },
    100,
    false
  );
  componentDidMount() {
    document.ScrollTop = 0;
    this.props.history.listen((location, action) => {
      const { search, pathname } = location;
      const type = pathname + search;
      if (pathname === "/topics")
        this.props.dispatch({
          type: "fetchTitles",
          payload: { type: type, size: 20 }
        });
    });
    const { search, pathname } = this.props.location; //获取当前页的路径
    const type = pathname + search;
    window.onload = () => {
      this.props.dispatch({
        type: "fetchTitles",
        payload: { type: type, size: 20 }
      });
    };
    if (sessionStorage[type])
      //从文章详情页返回到原页面
      this.setState({
        data: JSON.parse(sessionStorage[type])
      }); //本地缓存，避免多次请求浪费资源,恢复现场

    document.addEventListener("scroll", this.getTitles);
  }

  componentWillReceiveProps(nextProps) {
    const { search, pathname } = this.props.location; //不能使用this.props,在这个生命周期前并未更新
    const type = pathname + search;
    const { data, page } = this.state; //点击其他页面且数据不存在重新请求
    if (nextProps.title.length === 5) {
      this.setState({ data: [...data, ...nextProps.title], page: page + 1 });
    } else {
      this.setState({ data: [...nextProps.title], page: 3 });
    }
    sessionStorage[type] = JSON.stringify(data);
  }

  componentWillUnmount() {
    const { search, pathname } = this.props.location;
    const type = pathname + search;
    const { data } = this.state;
    sessionStorage[type] = JSON.stringify(data);
    document.removeEventListener("scroll", this.getTitles);
  }
  render() {
    const { data } = this.state;
    const { loading, location, downLoading } = this.props;
    const style = {
      marginBottom: loading === true ? "120px" : "40px"
    };
    return (
      <div className="index" style={style}>
        <div id="logo">
          <img src="https://o4j806krb.qnssl.com/public/images/cnodejs_light.svg" alt="cnode标志" />
        </div>
        <HeaderBar location={location} />
        {data && data.length === 0 ? <Spin loading={loading} /> : <TitleList data={data} />}
        <div style={{ height: downLoading ? "55px" : 0 }}>
          <Spin loading={downLoading} style={{ bottom: "50px" }} />
        </div>
        <FooterBar location={location} />
      </div>
    );
  }
}

export const TitleList = props => {
  return props.data.map((data, index) => {
    const { id, top, tab, good, title, author, reply_count, visit_count, create_at, last_reply_at } = data;
    return (
      <div key={id + index} className="contant fadeInUp animated">
        <Link className="title" to={`/detail/${id}`}>
          <i className={top ? "iconfont icon-top mark" : ""} />
          <i className={good ? "iconfont icon-good mark" : ""} />
          <i className={`iconfont icon-${tab} mark`} />
          {title}
        </Link>
        <br />
        <div>
          <Link to={`/user/${author.loginname}`}>
            <img src={author.avatar_url} className="avatar" alt={author.loginname} title={author.loginname} />
          </Link>
          <div>
            <p style={{ marginBottom: "13px" }}>
              <span className="loginname">{author.loginname}</span>
              <span className="visted-count">
                {reply_count}/{visit_count}
              </span>
            </p>
            <span className="create_at">{formatTime(create_at)}</span>
            <span className="last_reply_at">{formatTime(last_reply_at)}</span>
          </div>
        </div>
      </div>
    );
  });
};

const isScrollDown = (function() {
  //创造单独的作用域。避免使用全局变量
  let currHeight = 0;
  let prevHeight = 0;
  return function() {
    prevHeight = currHeight;
    currHeight = ScrollTop();
    return currHeight >= prevHeight && toBottom();
  };
})();

const mapStateToProps = state => {
  return { ...state.Titles };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch: dispatch
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Title);
