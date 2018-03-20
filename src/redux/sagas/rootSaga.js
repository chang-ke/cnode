import { takeLatest } from "redux-saga/effects";
import { fetchTitles, fetchTopic } from "./topicSaga";
import { login, logout, getUserMsg, handleMsg, handleReply, handleUp, getMsg, handleTopic } from "./userSaga";

export function* mySaga() {
  yield [
    takeLatest("login", login),
    takeLatest("logout", logout),
    takeLatest("getUserMsg", getUserMsg),
    takeLatest("fetchTitles", fetchTitles),
    takeLatest("fetchTopic", fetchTopic),
    takeLatest("handleMsg", handleMsg),
    takeLatest("handleReply", handleReply),
    takeLatest("handleUp", handleUp),
    takeLatest("getMsg", getMsg),
    takeLatest("handleTopic", handleTopic)
  ];
}
