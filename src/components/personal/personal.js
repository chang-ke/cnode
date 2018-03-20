import React, { Component } from "react";
import { NavBar } from "../common/layout";
import { BaseUserPanel, Recent } from "../common/user";
import request from "../../util/request";
import { Spin } from "../common/spin";
import "./style.less";

class Personal extends Component {
  state = {
    data: {
      recent_topics: [],
      recent_replies: []
    }
  };

  async componentDidMount() {
    const { id } = this.props.match.params;
    const { data } = await request(`/user/${id}`);
    this.setState({ data: data.data });
  }

  async componentWillReceiveProps(nextProps) {
    const { id } = nextProps.match.params;

    if (id !== this.props.match.params.id) {
      //在用户详情页下点击该用户不再加载该用户
      const { data } = await request(`/user/${id}`);
      this.setState({ data: data.data });
    }
  }

  render() {
    const { data } = this.state;
    return (
      <div>
        <NavBar history={this.props.history} title={data.loginname ? `${data.loginname}的个人中心` : ""} />
        {data.loginname ? (
          <div className="user-view">
            <BaseUserPanel {...data} />
            <Recent {...data} />
          </div>
        ) : (
          <Spin loading={true} />
        )}
      </div>
    );
  }
}

export default Personal;
