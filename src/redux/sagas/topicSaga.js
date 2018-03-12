import { put, call } from "redux-saga/effects";
import { message } from "antd";
import { queryTopics, queryTitle } from "../../servers/title";

export function* fetchTitles(action) {
  const titles = sessionStorage[action.payload.type];
  if (titles && titles !== "[]" && action.payload.size === 20) {
    yield put({ type: "TITLE_FETCH_SUCCESSED", titles: JSON.parse(titles), loading: false });
  } else {
    try {
      if (action.payload.size === 20) {
        yield put({ type: "TITLE_FETCHING", loading: true });
      } else {
        yield put({ type: "TITLE_FETCHING", downLoading: true });
      }
      const { data } = yield call(queryTopics, { page: 1, ...action.payload });
      if (data && data.success) {
        yield put({ type: "TITLE_FETCH_SUCCESSED", titles: data.data });
        sessionStorage.setItem(action.payload.type, JSON.stringify(data.data));
      } else {
        message.error("获取帖子失败");
      }
    } catch (err) {
      message.error("网络好像有点问题");
      yield put({ type: "TITLE_FETCH_FAILED", message: err.message });
    }
  }
}

export function* fetchTopic(action) {
  yield put({ type: "TOPIC_FETCHING", loading: true });
  try {
    const { data } = yield call(queryTitle, action.payload);
    if (data.success) {
      yield put({ type: "TOPIC_FETCH_SUCCESSED", topic: data.data, loading: false });
    } else {
      yield put({ type: "TOPIC_FETCH_SUCCESSED", topic: {}, loading: false });
      message.error("获取帖子详情失败");
    }
  } catch (error) {
    message.error("获取帖子详情失败");
  }
}
