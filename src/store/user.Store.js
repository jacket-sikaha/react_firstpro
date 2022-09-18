//login module

import { makeAutoObservable } from "mobx";
import { http } from "@/utils";
class UserStore {
  userInfo = {};
  constructor() {
    //响应式
    makeAutoObservable(this);
  }

  getUserInfo = async () => {
    //调用接口获取数据
    const res = await http.get("/user/profile");
    this.userInfo = res.data.data;
    console.log("this.userInfo", res.data.data);
  };
}

export default UserStore;
