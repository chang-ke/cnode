import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Input, message, Button } from "antd";
import { Guide, Tip } from "./common/layout";
import { Spin } from "./common/spin";
import { toBottom, formatTime, debounce } from "../util/tool";

const { TextArea } = Input;

class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      floor: 10,
      text: "",
      loading: true
    };
  }
  getReply = debounce(
    () => {
      if (toBottom()) {
        this.setState({
          floor: this.state.floor + 10
        });
      }
    },
    100,
    false
  );
  componentWillReceiveProps(nextProps) {
    if (nextProps.topic) {
      this.setState({ data: nextProps.topic, loading: nextProps.loading });
    }
  }

  componentWillMount() {
    this.update();
  }
  componentDidMount() {
    window.addEventListener("scroll", this.getReply);
  }
  componentWillUnmount() {
    window.removeEventListener("scroll", this.getReply);
  }
  /**
   * 回复消息后更新数据
   */
  update = () => {
    const { id } = this.props.match.params;
    this.props.dispatch({
      type: "fetchTopic",
      payload: { id }
    });
  };
  handleText = e => {
    this.setState({ text: e.target.value });
  };
  send = () => {
    const { text } = this.state;
    const { id } = this.props.match.params;
    const { access_token } = this.props;
    this.props.dispatch({
      type: "handleMsg",
      payload: {
        id: id,
        accesstoken: access_token,
        content: text
      }
    });

    this.setState({ text: "" });
  };
  render() {
    const { data, floor, loading } = this.state;
    const { access_token, user, history, dispatch } = this.props;

    return (
      <div className="topic-container">
        <Guide history={history} title={data.title} />
        {loading ? (
          <Spin loading={loading} />
        ) : (
          <div ref={container => (this.container = container)}>
            <User data={data} />
            <h2 className="topic-title">{data.title}</h2>
            <div
              dangerouslySetInnerHTML={{
                __html: `${data.content.replace("markdown-text", "topic-text")}`
              }}
            />
            <div className="topic-reply-count">
              共<span style={{ color: "#108ee9" }}>{data.reply_count}</span>条回复
            </div>
            <ReplyCotent
              replies={data.replies}
              floor={floor}
              access_token={access_token}
              id={data.id}
              dispatch={dispatch}
              myname={user.loginname || ""}
              authorname={data.author.loginname}
              update={this.update}
            />
            {access_token === "" ? (
              <Tip style={{ padding: "20px 0" }} location={this.props.location} />
            ) : (
              <div>
                <TextArea
                  id="reply-textArea"
                  placeholder="支持markdown语法"
                  onChange={this.handleText}
                  value={this.state.text}
                />
                <Button id="reply-btn" onClick={this.send}>
                  回复
                </Button>
              </div>
            )}
            <div style={{ height: "35px" }} />
          </div>
        )}
      </div>
    );
  }
}

const User = ({ data }) => {
  return (
    <div className="topic-content">
      <Link to={`/user/${data.author.loginname}`}>
        <img
          src={data.author.avatar_url}
          className="avator"
          alt={data.author.loginname}
          title={data.author.loginname}
        />
      </Link>
      <p style={{ marginBottom: "13px" }}>
        <span className="loginname">{data.author.loginname}</span>
        <span className="visted-count">阅读:{data.visit_count}</span>
      </p>
      <span style={{ marginLeft: "10px" }}>{formatTime(data.create_at)}</span>
      <span className="last_reply_at">{formatTime(data.last_reply_at)}</span>
    </div>
  );
};
/**
 * 回帖楼层
 * @param {*} props
 */
const ReplyCotent = props => {
  return props.replies.map((anwser, index) => {
    if (index < props.floor)
      return (
        <div className="anwser" key={anwser.author.loginname + index}>
          <Link to={`/user/${anwser.author.loginname}`}>
            <img
              src={anwser.author.avatar_url}
              className="avator"
              alt={anwser.author.loginname}
              title={anwser.author.loginname}
            />
          </Link>
          <span className="loginname">
            {anwser.author.loginname}&nbsp;{anwser.author.loginname === props.authorname ? "楼主" : ""}
          </span>
          <span style={{ fontSize: "1.3rem" }}>{formatTime(anwser.create_at)}</span>
          <span style={{ fontSize: "1.3rem", float: "right", marginRight: "8px" }}>{`${index + 1}楼`}</span>
          <div
            dangerouslySetInnerHTML={{
              __html: `${anwser.content}`
            }}
            key={index}
          />
          <div style={{ textAlign: "right" }}>
            <ThumbUps
              length={anwser.ups.length}
              id={anwser.id}
              dispatch={props.dispatch}
              access_token={props.access_token}
              authorname={props.authorname}
              anwsername={anwser.author.loginname}
              myname={props.myname}
            />
            <Reply
              id={props.id}
              access_token={props.access_token}
              reply_id={anwser.id}
              dispatch={props.dispatch}
              loginname={anwser.author.loginname}
              update={props.update}
            />
          </div>
        </div>
      );
    else return <div key={index} />;
  });
};
/**
 * 点赞
 */
class ThumbUp extends Component {
  state = {
    action: ""
  };
  sendUps = () => {
    const { id, access_token, myname, anwsername, history, dispatch } = this.props;
    if (access_token) {
      if (anwsername !== myname) {
        dispatch({
          type: "handleUp",
          payload: {
            id: id,
            accesstoken: access_token
          }
        });
        /*request(`/reply/${id}/ups`, { accesstoken: access_token }).then(res => {
          this.setState({ action: res.action });
        });*/
      } else {
        message.warning("不能给自己点赞哦");
      }
    } else {
      message.info("您还没有登陆");
      setTimeout(() => {
        history.push("/my/login");
      }, 300);
    }
  };
  render() {
    const { action } = this.state;
    const { length } = this.props;
    const style = {
      color: action === "up" ? "#108ee9" : "rgba(0,0,0,0.65)",
      fontWeight: action === "up" ? "600" : "400"
    };
    return (
      <span>
        <i className="iconfont icon-dianzan" style={style} onClick={this.sendUps}>
          <span className="icon-dianzan-num">{action === "up" ? length + 1 : length}</span>
        </i>
      </span>
    );
  }
}
const ThumbUps = withRouter(ThumbUp);
/**
 * 评论
 */
class Reply extends Component {
  state = {
    status: false,
    content: ""
  };
  handleReply = () => {
    this.setState({
      status: !this.state.status
    });
  };
  handleValue = e => {
    this.setState({ content: e.target.value });
  };
  send = () => {
    const { content } = this.state;
    const { id, access_token, reply_id, dispatch } = this.props;
    if (access_token) {
      if (content.trim()) {
        dispatch({
          type: "handleReply",
          payload: {
            id: id,
            accesstoken: access_token,
            content: content,
            reply_id: reply_id
          }
        });
      } else {
        message.warning("总要写点什么吧");
      }
      /*request(`/topic/${id}/replies`, {
          accesstoken: access_token,
          content: content,
          reply_id: reply_id
        }).then(res => {
          if (res.success && res.success === true) this.setState({ status: false });
          message.success("发送成功");
          this.props.update(); //发送完数据更新
        ;*/
    } else {
      message.info("您还没有登陆");
    }
  };
  render() {
    const { status } = this.state;
    const { loginname } = this.props;
    return (
      <span>
        <i className="iconfont icon-huifu" onClick={this.handleReply} />
        {status ? (
          <p>
            <TextArea
              style={{ height: "60px" }}
              onChange={this.handleValue}
              defaultValue={`@${loginname} `}
              minLength={`@${loginname}`.length}
            />
            <Button style={{ float: "left" }} onClick={this.send}>
              回复
            </Button>
          </p>
        ) : null}
      </span>
    );
  }
}
const mapStateToProps = state => {
  return {
    ...state.AccessToken,
    ...state.User,
    ...state.Topic
  };
};

const mapDispatchToProps = dispatch => {
  return { dispatch };
};

export default connect(mapStateToProps, mapDispatchToProps)(Detail);
