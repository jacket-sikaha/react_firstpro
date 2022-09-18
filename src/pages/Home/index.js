import React from "react";
import { useNavigate } from "react-router-dom";
import Bar from "../Bar";
export default function Home() {
  const navigate = useNavigate();

  const handleClickToHome = () => {
    navigate("/login", { replace: true });
    // history 的 replace 模式
  };

  const barObj1 = {
    title: "主流框架使用满意度",
    style: { width: "500px", height: "400px" },
    xData: ["react", "vue", "angular"],
    sData: [30, 40, 50],
  };
  const barObj2 = {
    title: "主流框架使用满意度",
    style: { width: "300px", height: "200px" },
    xData: ["react", "vue", "angular"],
    sData: [60, 70, 80],
  };
  return (
    <div>
      Home
      {/* <button onClick={handleClickToHome}>to Home</button> */}
      {/* 渲染Bar组件 */}
      <Bar {...barObj1}></Bar>
      <Bar {...barObj2}></Bar>
    </div>
  );
}
