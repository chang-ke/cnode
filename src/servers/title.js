import request from "../util/request";

export function queryTopics(params) {
  const connect = params.type === "/topics" ? "?" : "&";
  return request(`${params.type}${connect}page=${params.page}&limit=${params.size}`);
}

export function queryTitle(params) {
  return request(`/topic/${params.id}`);
}
