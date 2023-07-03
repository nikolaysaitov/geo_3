import React, { useState, useMemo, useEffect } from "react";
import withLayout from "../components/WithLayout/WithLayout";
import { connect } from "react-redux";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import "./Main.css";
import { newModifiedData } from "./data.js";

function Main({ onVerifyToken, userGroup }) {
  const [off, setOff] = useState(0);


  useState(() => {
    const gradientOffset = () => {
      const dataMax = Math.max(...newModifiedData.map((i) => i.difference));
      const dataMin = Math.min(...newModifiedData.map((i) => i.difference));
  
      if (dataMax <= 0) {
        return 0;
      }
      if (dataMin >= 0) {
        return 1;
      }
  
      return dataMax / (dataMax - dataMin);
    };
    setOff(gradientOffset());
  }, [newModifiedData]);

  function CustomizedLabel(props) {
    const { x, y, stroke, value } = props;
    return (
      <text x={x} y={y} dy={-4} fill={stroke} fontSize={10} textAnchor="middle">
        {value}
      </text>
    );
  }
  
  function CustomizedAxisTick(props) {
    const { x, y, stroke, payload } = props;
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={10}  style={{ fontSize: "10px" }}  textAnchor="end" fill="#666" transform="rotate(-75)">
          {payload.value}
        </text>
      </g>
    );
  }


  useEffect(() => {
    onVerifyToken();
    const intervalId = setInterval(onVerifyToken, 1000 * 60 * 100); // re-verify token every 10 minutes
    return () => clearInterval(intervalId);
  }, [onVerifyToken]);
  // do something with off
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();

  return (
    <div className="container main_container">
      <h1>Main.js</h1>
      {/* <a>https://expo.dev/artifacts/eas/bm4PvZKjfjQfujQCXBHJq2.apk</a> */}
      <p>Это главная страница, здесь можно добавить информацию о сервисе, правилах работы с ним, статистике по заказам(графики, диаграммы), времени доставки и прочее.  </p>
      <h3 className="mt-4">Ваша группа: {userGroup}</h3>
      <p>Статистика по заказам (время расчетное/фактическое) на {`${day < 10 ? '0' : ''}${day}.${month < 10 ? '0' : ''}${month}.${year}`}</p>

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          width={500}
          height={400}
          data={newModifiedData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" orientation="bottom"  height={160} tick={<CustomizedAxisTick />} />
          <YAxis domain={["dataMin", "dataMax"]} allowDataOverflow="true" tickFormatter={(tick) => `${tick} мин`} style={{ fontSize: "11px" }} />
          <Tooltip/>
          <defs>
            <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset={off} stopColor="#82ca9d" stopOpacity={1} />
              <stop offset={off} stopColor="#ff4d4f8c" stopOpacity={1} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="difference" stroke="none" fill="url(#splitColor)" />
          
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    userGroup: state.userGroup,
  };
}

export default connect(mapStateToProps)(withLayout(Main));
