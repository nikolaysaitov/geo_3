import React, { useState, useMemo, useEffect, useRef } from "react";
import withLayout from "../components/WithLayout/WithLayout";
import { connect } from "react-redux";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import "./Main.css";
import { newModifiedData } from "./data.js";
import { FileExcelOutlined } from "@ant-design/icons";
import ChartProeb from "./Charts/ChartProeb/ChartProeb";
import { getActiveCouriers } from "../components/Charts/chartsApi";
import { Toast } from "primereact/toast";
import { Spin } from "antd";
import { DatePicker, Space } from "antd";
import { ConfigProvider } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import locale from "antd/locale/ru_RU";
import AllCharts from "./Charts/AllCharts";

const { RangePicker } = DatePicker;

function Main({ onVerifyToken, userGroup }) {
  const [loading, setLoading] = useState(false);
 

  useEffect(() => {
    onVerifyToken();
    const intervalId = setInterval(onVerifyToken, 1000 * 60 * 100); // re-verify token every 10 minutes
    return () => clearInterval(intervalId);
  }, [onVerifyToken]);

  const toast = useRef(null);
  return (
    <div className="container main_container">
      <Toast ref={toast} className="ui-toast" />
      <Spin className="spin" spinning={loading} size="large">
      <h1>Main.js</h1>
      <p>
        Это главная страница, здесь можно добавить информацию о сервисе, правилах работы с ним, статистике по заказам(графики, диаграммы), времени
        доставки и прочее.{" "}
      </p>
      {/* <h3 className="mt-4 mb-4">Ваша группа: {userGroup}</h3> */}
      {/* <p>Статистика по заказам (время расчетное/фактическое) на {`${day < 10 ? "0" : ""}${day}.${month < 10 ? "0" : ""}${month}.${year}`}</p> */}
      
      <AllCharts/>
      </Spin>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    userGroup: state.userGroup,
  };
}

export default connect(mapStateToProps)(withLayout(Main));
