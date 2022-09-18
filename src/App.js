import React from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  unstable_HistoryRouter as HistoryRouter,
} from "react-router-dom";
import GeekLayout from "./pages/Layout";
import Login from "@/pages/Login";
import AuthComponent from "./components/AuthComponent";
import Article from "./pages/Article";
import Publish from "./pages/Publish";
import Home from "./pages/Home";
import { history } from "./utils/history";
export default function App() {
  return (
    //路由配置
    <HistoryRouter history={history}>
      <div className="App">
        <Routes>
          {/* 创建路由path和组件对应关系 */}
          {/* Layout需要鉴权处理 */}
          {/* 这里的Layout一定不能写死，要根据是否登录进行判断 */}
          <Route
            path="/"
            element={
              <AuthComponent>
                <GeekLayout />
              </AuthComponent>
            }
          >
            {/* 二级路由默认主页 */}
            <Route index element={<Home></Home>}></Route>
            <Route path="article" element={<Article></Article>}></Route>
            <Route path="publish" element={<Publish></Publish>}></Route>
          </Route>

          <Route path="login" element={<Login></Login>}></Route>
        </Routes>
      </div>
    </HistoryRouter>
  );
}
