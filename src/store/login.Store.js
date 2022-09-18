//login module

import { makeAutoObservable } from "mobx";
import { http, setToken, getToken, removeToken } from "@/utils";
class LoginStore {
  token = getToken() || "";
  constructor() {
    //响应式
    makeAutoObservable(this);
  }

  getToken = async ({ mobile, code }) => {
    //调用登录接口
    const res = await http.post("authorizations", {
      mobile,
      code,
    });
    //存入token
    this.token = res.data.data.token;
    setToken(this.token);
    console.log("this.token", this.token);
  };
  //退出登录
  loginOut = () => {
    this.token = "";
    removeToken();
  };
}

export default LoginStore;
