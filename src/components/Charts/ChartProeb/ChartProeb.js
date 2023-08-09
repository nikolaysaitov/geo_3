import React, { useEffect, useState, useRef } from "react";
import { FileExcelOutlined } from "@ant-design/icons";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";
import { DatePicker, Space, Select, ConfigProvider } from "antd";
import { Toast } from "primereact/toast";
import { Spin } from "antd";
import { csrftoken, startOfMonth, endOfMonth, getRandomColor } from "../chartsApi";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import locale from "antd/locale/ru_RU";
const { RangePicker } = DatePicker;
const { Option } = Select;
const ChartProeb = (props) => {
  const formatPercent = (value) => `${value} шт`;
  const formatPercent2 = (value) => `${value} %`;
  const showError = () => {
    toast.current.show({
      severity: "error",
      summary: "Ошибка получения данных для графиков",
      detail: "Попробуйте еще раз, перезагрузите страницу или обратитесь в службу поддержки",
      life: 4000,
    });
  };
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState();
  const [chartsData, setChartsData] = useState([]);
  const [proebStartDate, setProebStartDate] = useState(startOfMonth);
  const [proebEndDate, setProebEndDate] = useState(endOfMonth);
  const [courier, setCourier] = useState(null);
  const handleChange = (selectedCourier) => {
    setCourier(selectedCourier);
  };
  // Файл статистики Excel
  const [fileExcel, setFileExcel] = useState("");

  const handleProebDateChange = (dates) => {
    if (dates) {
      const [start, end] = dates;
      setProebStartDate(start.format("YYYY-MM-DD"));
      setProebEndDate(end.format("YYYY-MM-DD"));
    }
  };

  const handleProebDateChange2 = (date, dateString, type) => {
    if (date) {
      let startDate = date.startOf(type).format("YYYY-MM-DD");
      let endDate;

      if (type === "week") {
        endDate = date.endOf("week").format("YYYY-MM-DD");
      } else if (type === "month") {
        endDate = date.endOf("month").format("YYYY-MM-DD");
      } else if (type === "quarter") {
        const quarterStartMonth = Math.floor(date.month() / 3) * 3;
        const quarterStartDate = date.startOf("year").month(quarterStartMonth).startOf("month").format("YYYY-MM-DD");
        endDate = date
          .startOf("year")
          .month(quarterStartMonth + 2)
          .endOf("month")
          .format("YYYY-MM-DD");
        startDate = quarterStartDate;
      } else if (type === "year") {
        endDate = date.endOf("year").format("YYYY-MM-DD");
      }
      setProebStartDate(startDate);
      setProebEndDate(endDate);
    }
  };

  const proebData = {
    from_date: proebStartDate,
    to_date: proebEndDate,
    couriers: courier ? [courier] : props.activeId,
  };

  const getChartsData = async () => {
    setLoading(true);
    try {
      const url = "https://geo.impermebel.ru/api/v1/statistic/get-charts-data/punctuality";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
          // "Api-Key": "72wEBHUzQ6h2RwydrN3akn6ZpTRDk1QKgvJVbKi1"
        },
        body: JSON.stringify(proebData),
      });

      if (!response.ok) {
        // showError();
        throw new Error("Request failed");
      }

      const jsonData = await response.json();
      setChartsData(jsonData.data);
      setLoading(false);
    } catch (error) {
      showError();
      console.error(error);
      setLoading(false);
    }
  };
  const dataFiles = {
    from_date: proebStartDate,
    to_date: proebEndDate,
    couriers: courier ? [courier] : null,
    file_holder_id: 40,
  };

  const getFiles = async () => {
    setLoading(true);
    try {
      const url = "https://geo.impermebel.ru/api/v1/statistic/get-xlfile";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
          // "Api-Key": "72wEBHUzQ6h2RwydrN3akn6ZpTRDk1QKgvJVbKi1"
        },
        body: JSON.stringify(dataFiles),
      });

      const jsonData = await response.json();
      setFileExcel(jsonData);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (props.activeId.length > 0) {
      getChartsData();
   
    }
  }, [props.activeId, type, courier, proebEndDate, props.activeId.length > 0]);

  useEffect(() => {
    if (props.activeId.length > 0) {
      getFiles();
   
    }
  }, [props.activeId, courier]);


  const toast = useRef(null);
  return (
    <div className="d-flex flex-column col-12">
      <Spin className="spin" spinning={loading} size="large">
        <Toast ref={toast} className="ui-toast" />

        <ConfigProvider locale={locale}>
          <Space>
            <Select value={courier} onChange={handleChange} placeholder="Выберите водителя">
              {props.couriersName.map((driver) => (
                <Option key={driver.id} value={driver.id}>
                  {driver.surname} {driver.name}
                </Option>
              ))}
              <Option value={props.activeId}>Все водители</Option>
            </Select>
            <Select value={type} onChange={setType} placeholder="Выберите период">
              <Option value="date">Дата</Option>
              <Option value="week">Неделя</Option>
              <Option value="month">Месяц</Option>
              <Option value="quarter">Квартал</Option>
              <Option value="year">Год</Option>
            </Select>
            {type === "date" ? (
              <RangePicker format={"DD-MM-YYYY"} onChange={handleProebDateChange} />
            ) : (
              <DatePicker picker={type} onChange={(date, dateString) => handleProebDateChange2(date, dateString, type)} />
            )}
          </Space>
        </ConfigProvider>

        <div className="d-flex flex-row mt-4 mb-5">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              width={500}
              height={300}
              data={chartsData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="surname" />
              <YAxis tickFormatter={formatPercent} />
              <Tooltip />
              <Legend />
              <Bar name="Количество доставок" dataKey="deliveries_count" fill="#4F81BD" />
              <Bar name='Количество доставок "Более часа"' dataKey="gte_hour_count" fill="#C0504D" />
            </BarChart>
          </ResponsiveContainer>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              width={500}
              height={300}
              data={chartsData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="surname" />
              <YAxis tickFormatter={formatPercent2} />
              <Tooltip />
              <Legend />
              {/* <ReferenceLine y={50} label={{ value: '50 %', angle: 0, position: 'left', color: 'red' }} stroke="red" strokeDasharray="3 3" /> */}

              <Bar name='Количество доставок "Более часа"' dataKey="delay_percent" fill="#4F81BD" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {courier && type && proebEndDate ? (

          
          <a
            className="d-flex flex-row justify-content-center align-items-center mb-5"
            style={{ width: "200px", margin: "auto" }}
            href={fileExcel}
            target="_blank"
            
            
          >
            <FileExcelOutlined />
            <p style={{ marginBottom: "0px", marginLeft: "5px" }}>Скачать таблицу.xlsx</p>
          </a>
        ) : null}
      </Spin>
    </div>
  );
};

export default ChartProeb;
