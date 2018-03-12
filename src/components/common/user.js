import React from "react";
import { Tabs } from "antd";
import { Link } from "react-router-dom";
import { formatTime } from "../../util/tool";

const { TabPane } = Tabs;

const UserPanel = props => {
  return (
    <div className="user">
      <img src={props.avatar_url} className="user-view-avator" alt={props.loginname} />
      <span className="user-props">{props.loginname}</span>
      <br />
      <span>
        <span className="user-props">积分</span>:&nbsp;{props.score}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="user-props">
          注册于
        </span>:&nbsp;{formatTime(props.create_at)}
      </span>
    </div>
  );
};

const Recent = ({ recent_topics, recent_replies }) => {
  return (
    <Tabs style={{ marginBottom: "40px" }}>
      <TabPane tab="最近创建的话题" key="recent_topics">
        {recent_topics &&
          recent_topics.map((data, index) => {
            return (
              <div key={data.title + index} className="recent">
                <Link className="user-view-title" to={`/detail/${data.id}`}>
                  {data.title}
                </Link>
              </div>
            );
          })}
        {recent_topics && recent_topics.length === 0 ? "这个家伙很懒，什么也没留下" : ""}
      </TabPane>
      <TabPane tab="最近参与的话题" key="recent_replies">
        {recent_replies &&
          recent_replies.map((data, index) => {
            return (
              <div key={data.title + index} className="recent">
                <Link className="user-view-title" to={`/detail/${data.id}`}>
                  {data.title}
                </Link>
                <Link to={`/user/${data.author.loginname}`}>
                  <img src={data.author.avatar_url} className="avator" alt={data.author.loginname} />
                </Link>
              </div>
            );
          })}
        {recent_replies && recent_replies.length === 0 ? "这个家伙很懒，什么也没留下" : ""}
      </TabPane>
    </Tabs>
  );
};
export { UserPanel, Recent };
