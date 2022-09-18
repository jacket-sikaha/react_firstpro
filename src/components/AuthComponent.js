// 1    判断token是否存在
// 2    如果存在    直接正常渲染
// 3    如果不存在  重定向到登录路由

import GeekLayout from "@/pages/Layout";
import { getToken } from "@/utils";
import { Navigate } from "react-router-dom"; //重定向组件
//高阶组件(类比高阶函数)：把一个组件当场另外一个组件的参数传入
//然后通过一定的判断    返回新的组件

function AuthComponent({ children }) {
  const isToken = getToken();
  console.log("children", children);
  if (isToken) {
    return <>{children}</>;
  } else {
    return <Navigate to={"/login"} replace></Navigate>;
  }
}

export default AuthComponent;
{
  /* <AuthComponent>
  <Layout />
</AuthComponent>; */
}
//登录  <><Layout/></> children属性就是Layout组件对象
//非登录   <Navigate to={"/login"} replace></Navigate>;
