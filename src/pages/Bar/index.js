//封装图表bar组件
import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

export default function Bar({ style, xData, sData, title }) {
  const domRef = useRef();

  useEffect(() => {
    const chartInit = () => {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(domRef.current);
      // 绘制图表
      myChart.setOption({
        title: {
          text: title,
        },
        tooltip: {},
        xAxis: {
          data: xData,
        },
        yAxis: {},
        series: [
          {
            name: "销量",
            type: "bar",
            data: sData,
          },
        ],
      });
    };
    chartInit();
  }, []);
  return (
    // 准备一个挂载节点
    <div ref={domRef} style={style}></div>
  );
}
