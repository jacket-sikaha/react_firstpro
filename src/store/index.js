// 把所有模块做统一处理
// 导出一个统一的方法 useStore

import React from "react";
import ChannelStore from "./channel.Store";
import LoginStore from "./login.Store";
import UserStore from "./user.Store";
class RootStore {
  constructor() {
    this.loginStore = new LoginStore();
    this.userStore = new UserStore();
    this.channelStore = new ChannelStore();
    //...
  }
}

//实例化根
//导出useState context

const rootStore = new RootStore();
const context = React.createContext(rootStore);

const useStore = () => React.useContext(context);

export { useStore };
