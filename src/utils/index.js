//先把所有的工具函数导出的模块在这里导入
//然后统一导出

//工具统一管理

import { http } from "./http";
import { getToken, removeToken, setToken } from "./token";
export { http, getToken, removeToken, setToken };
