import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Tabs } from "antd";
import { Link } from "react-router-dom";
import { formatTime } from "../util/tool";
import { Footer, Guide } from "./common/layout";
import request from "../util/request";

const { TabPane } = Tabs;

class Message extends PureComponent {
  state = {
    messCount: 0,
    has_read_messages: [],
    hasnot_read_messages: []
  };
  componentDidMount() {
    const { access_token, dispatch } = this.props;
    dispatch({
      type: "getMsg",
      payload: {
        access_token: access_token
      }
    });
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ ...nextProps });
  }

  render() {
    const { location } = this.props;
    const { has_read_messages, hasnot_read_messages } = this.state;
    return (
      <div style={{ marginTop: "45px", marginBottom: "50px" }}>
        <Guide title={"消息"} />
        <Tabs defaultActiveKey="has_read">
          <TabPane tab="未读消息" key="has_read">
            <Title messages={hasnot_read_messages} />
          </TabPane>
          <TabPane tab="已读消息" key="hasnot_read">
            <Title messages={has_read_messages} />
          </TabPane>
        </Tabs>
        <Footer location={location} />
      </div>
    );
  }
}

const Title = props => {
  const { messages } = props;
  if (messages && messages.length !== 0) {
    return messages.map((item, index) => {
      const { author, create_at, topic, type } = item;
      const { last_reply_at, id, title } = topic;
      return (
        <div key={id + index} className="contant fadeInUp animated">
          <Link className="title" to={`/detail/${id}`}>
            {title}
          </Link>
          <br />
          <div>
            <Link to={`/user/${author.loginname}`}>
              <img src={author.avatar_url} className="avator" alt={author.loginname} />
            </Link>
            <div>
              <p style={{ marginBottom: "13px" }}>
                <span className="loginname">{author.loginname}</span>
              </p>
              <span style={{ marginLeft: "10px" }}>
                在{formatTime(create_at)}
                <span style={{ color: "red" }}>{type === "at" ? "@" : "回复"}</span>了你
              </span>
              <span className="last_reply_at">{formatTime(last_reply_at)}</span>
            </div>
          </div>
        </div>
      );
    });
  } else {
    return <div style={{ textAlign: "center" }}>暂无消息</div>;
  }
};

const mapStateToProps = state => {
  return { ...state.AccessToken, ...state.Msg };
};
const mapDispatchToProps = dispatch => {
  return {
    dispatch: dispatch
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Message);
