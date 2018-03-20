import React, { Component } from "react";
import { connect } from "react-redux";
import { Select, Input, message } from "antd";
import { FooterBar, NavBar } from "../common/layout";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./style.less";

const { Option } = Select;
class Report extends Component {
  state = {
    title: "",
    tab: "select",
    content: ""
  };

  modules = {
    toolbar: [
      [{ size: [] }, { header: [1, 2, 3, 4, 5, 6, false] }, { font: [] }],
      [{ script: "sub" }, { script: "super" }],
      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
      [{ align: [] }, { direction: "rtl" }],
      ["code-block", "link", "image", "video", "formula"],
      ["clean"]
    ]
  };
  formats = [
    "background",
    "bold",
    "color",
    "font",
    "code",
    "italic",
    "link",
    "size",
    "strike",
    "script",
    "underline",
    "blockquote",
    "header",
    "indent",
    "list",
    "align",
    "direction",
    "code-block",
    "formula",
    "bullet",
    "image",
    "video"
  ];
  send = () => {
    const { access_token, dispatch } = this.props;
    const { title, tab, content } = this.state;
    if (title.trim() && tab !== "select" && content.trim()) {
      dispatch({
        type: "handleTopic",
        payload: {
          accesstoken: access_token,
          title: title,
          tab: tab,
          content: content
        }
      });
    } else {
      message.error("请填写完整");
    }
  };
  handleTab = value => {
    this.setState({ tab: value });
  };
  handleTitle = e => {
    this.setState({ title: e.target.value });
  };
  handleContent = value => {
    //console.log(value)
    this.setState({ content: value });
  };
  render() {
    const { location } = this.props;
    return (
      <div style={{ height: "101vh" }}>
        <NavBar title="发表主题">
          <i onClick={this.send} className="iconfont icon-report report" />
        </NavBar>
        <Select defaultValue="select" onChange={this.handleTab} style={{ width: "100%", margin: "65px 0 20px 0" }}>
          <Option value="select" disabled>
            请选择发表的板块
          </Option>
          <Option value="share">分享</Option>
          <Option value="ask">问答</Option>
          <Option value="job">招聘</Option>
          <Option value="dev">客户端测试</Option>
        </Select>
        <Input onChange={this.handleTitle} placeholder="请输入标题" style={{ height: "35px" }} />
        <ReactQuill
          value={this.state.content}
          theme={"snow"}
          onChange={this.handleContent}
          id="quill-editor"
          modules={this.modules}
          formats={this.formats}
          placeholder="请输入内容，不少于30字，支持markdown语法"
        />
        <FooterBar location={location} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { ...state.AccessToken };
};

const mapDispatchToProps = dispatch => {
  return { dispatch };
};
export default connect(mapStateToProps)(Report);
