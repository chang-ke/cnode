import request from "../util/request";

export function checkToken(params) {
  return request(`/accesstoken`, {
    method: "POST",
    mode: "cors",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(params)
  });
}

export function getIp(params) {
  return request("http://freegeoip.net/json/");
}

export function getPosition(params) {
  return request(`http://restapi.amap.com/v3/ip?key=c5c368adb8bb95aac7cab8099f2b716c&ip=${params}`);
}

export function getUser(params) {
  return request(`/user/${params}`);
}

export function sendMsg(params) {
  const { id, ...body } = params;
  return request(`/topic/${id}/replies`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
}
export function sendReply(params) {
  const { id, ...body } = params;
  return request(`/topic/${id}/replies`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
}

export function sendUp(params) {
  const { id, ...body } = params;
  return request(`/reply/${id}/ups`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
}

export function queryMsg(params) {
  return request(`/messages?accesstoken=${params}`);
}
