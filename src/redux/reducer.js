import { combineReducers } from "redux";

const user = {
  user: sessionStorage["USER_ON"] ? JSON.parse(sessionStorage["USER_ON"]) : {}
};
const accesstoken = {
  access_token: sessionStorage["AccessToken"] || ""
};

const titles = {
  title: [],
  loading: true,
  downLoading: false
};
function User(state = user, action) {
  switch (action.type) {
    case "USER_SGIN_IN":
      return {
        ...state,
        user: action.user
      };
    case "USER_SGIN_OUT":
      return {
        ...state,
        user: {}
      };
    default:
      return { ...state };
  }
}

function AccessToken(state = accesstoken, action) {
  switch (action.type) {
    case "ACCESS_TOKEN":
      return {
        ...state,
        access_token: action.access_token
      };
    default:
      return { ...state };
  }
}

function Titles(state = titles, action) {
  switch (action.type) {
    case "TITLE_FETCH_SUCCESSED":
      return {
        ...state,
        title: action.titles,
        loading: false,
        downLoading: false
      };
    case "TITLE_FETCHING":
      return {
        ...state,
        ...action
      };
    case "FETCH_TITLE_FAILED":
      return { ...state, loading: false };
    default:
      return { ...state };
  }
}
function Topic(state = { loading: true }, action) {
  switch (action.type) {
    case "TOPIC_FETCH_SUCCESSED":
      return {
        ...state,
        topic: action.topic,
        loading: false
      };
    case "TOPIC_FETCHING":
      return {
        ...state,
        loading: true
      };
    default:
      return { ...state };
  }
}

const initMsg = {
  has_read_messages: [],
  hasnot_read_messages: []
};
function Msg(state = initMsg, action) {
  switch (action.type) {
    case "MSG_FETCHING":
      return {
        ...state,
        has_read_messages: [],
        hasnot_read_messages: []
      };
    case "MSG_FETCH_SUCCESSED":
      return {
        ...state,
        has_read_messages: action.has_read_messages,
        hasnot_read_messages: action.hasnot_read_messages
      };
    default:
      return { ...state };
  }
}
const Reducers = combineReducers({ Titles, User, AccessToken, Topic, Msg });

export default Reducers;
