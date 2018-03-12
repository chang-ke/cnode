import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Popconfirm, message } from "antd";
import { Footer, Guide } from "./common/layout";
import { UserPanel, Recent } from "./common/user";

class Mine extends PureComponent {
  constructor(props) {
    super(props);
    const { user, location } = this.props;
    this.state = { position: "北京市", user, location };
  }
  componentWillMount() {
    this.getPosition();
  }
  getPosition = async () => {
    try {
      let res = await fetch("http://freegeoip.net/json/");
      res = await res.json();
      let state = await fetch(`http://restapi.amap.com/v3/ip?key=c5c368adb8bb95aac7cab8099f2b716c&ip=${res.ip}`);
      state = await state.json();
      this.setState({ position: state.city });
    } catch (error) {
      message.error("获取地理位置失败");
    }
  };
  logout = () => {
    this.props.dispatch({
      type: "logout"
    });
    this.props.history.push("/");
  };
  render() {
    const { position, user, location } = this.state;
    return (
      <div className="userView" style={{ marginTop: "45px" }}>
        <Guide title={"个人中心"}>
          <i id="position" className="iconfont icon-dingwei">
            {position}
          </i>
          <Popconfirm title="确认退出?" okText="退出" cancelText="取消" onConfirm={this.logout}>
            <a style={{ position: "absolute", right: "15px", color: "#fff" }} className="iconfont icon-tuichu" />
          </Popconfirm>
        </Guide>
        <UserPanel {...user} />
        <Recent {...user} />
        <Footer location={location} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { ...state.User };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch: dispatch
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Mine);
