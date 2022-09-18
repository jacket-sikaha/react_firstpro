import React, { useEffect, useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Layout, Menu, Popconfirm, message } from "antd";
import {
  HomeOutlined,
  DiffOutlined,
  EditOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import "./index.scss";
import { useStore } from "@/store";
import { observer } from "mobx-react-lite";
const { Header, Sider } = Layout;

const GeekLayout = () => {
  function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  }

  const items = [
    getItem(<Link to={"/"}>数据概览</Link>, "/", <HomeOutlined />),
    getItem(
      <Link to={"/article"}>内容管理</Link>,
      "/article",
      <DiffOutlined />
    ),
    getItem(
      <Link to={"/publish"}>发布文章</Link>,
      "/publish",
      <EditOutlined />
    ),
  ];
  const { pathname } = useLocation();
  const { userStore, loginStore } = useStore();
  useEffect(() => {
    userStore.getUserInfo();
  }, [userStore]); //[]加上userStore 只是为了避免语法错误

  const navigate = useNavigate();
  const confirm = (e) => {
    //退出登录  删除token
    loginStore.loginOut();
    //跳转到登录
    navigate("/login");
    message.success("退出登录");
  };
  return (
    <Layout>
      <Header className="header">
        <div className="logo" />
        <div className="user-info">
          <span className="user-name">{userStore.userInfo.name}</span>
          <span className="user-logout">
            <Popconfirm
              title="是否确认退出？"
              okText="退出"
              cancelText="取消"
              onConfirm={confirm}
            >
              <LogoutOutlined /> 退出
            </Popconfirm>
          </span>
        </div>
      </Header>
      <Layout>
        <Sider width={200} className="site-layout-background">
          {/* 高亮原理 defaultSelectedKeys === item key */}
          {/* useLocation这个hook获取当前路径 */}
          <Menu
            mode="inline"
            theme="dark"
            selectedKeys={[pathname]}
            defaultSelectedKeys={[pathname]}
            style={{ height: "100%", borderRight: 0 }}
            items={items}
          ></Menu>
        </Sider>
        <Layout className="layout-content" style={{ padding: 20 }}>
          {/* 二级路由出口 */}
          <Outlet />
        </Layout>
      </Layout>
    </Layout>
  );
};

export default observer(GeekLayout); //observer监听userstore的数据变化
