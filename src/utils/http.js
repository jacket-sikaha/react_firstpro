//封装axios请求

//实例化    请求拦截器  响应拦截器

import axios from "axios";
import { getToken, removeToken } from "./token";
import { history } from "./history";
// import { useNavigate } from "react-router-dom";
// const a = useNavigate();

const http = axios.create({
  baseURL: "http://geek.itheima.net/v1_0",
  timeout: 5000,
});

// 添加请求拦截器
http.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    const token = getToken();
    if (token) {
      // config.headers.Authorization = `Sikara ${token}`;
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
http.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response;
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    //处理token错误/token超时失效
    if (error.response.status === 401) {
      //跳回登录  react-router不允许在react上下文之外下使用useNavigate
      // a("/login"); //React Hook "useNavigate" cannot be called at the top level.
      //借助history包实现跳转
      removeToken();
      console.log("error", error);
      history.push("/login");
    }
    return Promise.reject(error);
  }
);

export { http };
