import React, { useEffect, useState, useRef } from "react";
import { FileExcelOutlined } from "@ant-design/icons";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Bar, BarChart, Legend, ResponsiveContainer, ReferenceLine } from "recharts";
import { DatePicker, Space, Select, ConfigProvider, Checkbox } from "antd";
import { Toast } from "primereact/toast";
import { Spin } from "antd";
import { csrftoken, startOfMonth, endOfMonth, getRandomColor } from "../chartsApi";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import locale from "antd/locale/ru_RU";
const { RangePicker } = DatePicker;
const { Option } = Select;

const ChartReviews = (props) => {
  const formatPercent2 = (value) => `${value} %`;
  const showError = () => {
    toast.current.show({
      severity: "error",
      summary: "Ошибка получения данных для графиков",
      detail: "Попробуйте еще раз, перезагрузите страницу или обратитесь в службу поддержки",
      life: 4000,
    });
  };

  const [ratingData, setRatingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reviewsStartDate, setReviewsStartDate] = useState(startOfMonth);
  const [reviewsEndDate, setReviewsEndDate] = useState(endOfMonth);
  const [type, setType] = useState();

  const [courier, setCourier] = useState();

  const [selectedDrivers, setSelectedDrivers] = useState([]);

  const handleChangeCheck = (selectedCourier) => {
    setSelectedDrivers(selectedCourier);
  };

  const handleChange = (selectedCourier) => {
    setCourier(selectedCourier);
  };

  const handleDateChange = (dates) => {
    if (dates) {
      const [start, end] = dates;
      setReviewsStartDate(start.format("YYYY-MM-DD"));
      setReviewsEndDate(end.format("YYYY-MM-DD"));
    }
  };

  const handleDateChange2 = (date, dateString, type) => {
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

      setReviewsStartDate(startDate);
      setReviewsEndDate(endDate);
    }
  };

  const dataRegion = {
    from_date: reviewsStartDate,
    to_date: reviewsEndDate,
    // region: "Владивосток",
    // couriers: courier ? [courier] : [props.activeId[2]],
    couriers: selectedDrivers.length > 0 ? selectedDrivers : [props.activeId[0]],
  };
//   console.log("props.activeId[0]:", props.activeId[0]);
  const getChartsDataRating = async () => {
    setLoading(true);
    try {
      const url = "https://geo.impermebel.ru/api/v1/statistic/get-charts-data/region-stat";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
            // "Api-Key": "72wEBHUzQ6h2RwydrN3akn6ZpTRDk1QKgvJVbKi1"
        },
        body: JSON.stringify(dataRegion),
      });

      if (!response.ok) {
        // showError();
        throw new Error("Request failed");
      }

      const jsonData = await response.json();
      const formattedData = jsonData.data.map((item) => ({
        courier: item.courier,
        avg_rate: parseFloat(item.avg_rate.toFixed(1)),
        data: item.data.map((dataItem) => ({
          date: new Date(dataItem.date).toISOString().split("T")[0],
          punctuality_rate: parseFloat(dataItem.punctuality_rate.toFixed(1)),
          //   grade: parseFloat(dataItem.grade.toFixed(1)),
        })),
      }));

      setRatingData(formattedData);
      setLoading(false);
    } catch (error) {
      showError();
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (props.activeId.length > 0) {
      getChartsDataRating();
    }
  }, [props.activeId, type, selectedDrivers, reviewsEndDate, props.activeId.length > 0]);

  const toast = useRef(null);


  return (
    <>
      <div className="d-flex flex-column col-8">
        <Spin className="spin" spinning={loading} size="large">
          <Toast ref={toast} className="ui-toast" />
          <ConfigProvider locale={locale}>
            <Space>
              {/* <Select value={courier} onChange={handleChange} placeholder="Выберите водителя">
                {props.couriersName.map((driver) => (
                  <Option key={driver.id} value={driver.id}>
                    {driver.surname} {driver.name}
                  </Option>
                ))}

              </Select> */}
              {/* <Checkbox.Group value={selectedDrivers} onChange={handleChangeCheck}>
                {props.couriersName.map((driver) => (
                  <Checkbox key={driver.id} value={driver.id}>
                    {driver.surname} {driver.name}
                  </Checkbox>
                ))}
              </Checkbox.Group> */}
              <Select showSearch={false} mode="multiple" placeholder="Выберите водителей" onChange={handleChangeCheck} style={{minWidth: "200px"}}>
                {props.couriersName.map((driver) => (
                  <Option key={driver.id} value={driver.id} dataName={driver.surname}>
                    {`${driver.surname} ${driver.name}`}
                  </Option>
                ))}
              </Select>
              <Select value={type} onChange={setType} placeholder="Выберите период">
                <Option value="date">Дата</Option>
                <Option value="week">Неделя</Option>
                <Option value="month">Месяц</Option>
                <Option value="quarter">Квартал</Option>
                <Option value="year">Год</Option>
              </Select>
              {type === "date" ? (
                <RangePicker format={"DD-MM-YYYY"} onChange={handleDateChange} />
              ) : (
                <DatePicker picker={type} onChange={(date, dateString) => handleDateChange2(date, dateString, type)} />
              )}
            </Space>
          </ConfigProvider>
          <div className="d-flex flex-row mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart width={500} height={300} data={ratingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" type="category" allowDuplicatedCategory={false} />
                <YAxis dataKey="delay_percent" domain={[0, 6]} />
                {/* <Tooltip content={<CustomTooltip/>} /> */}
                <Tooltip />
                <Legend />
                {/* <ReferenceLine y={5} stroke="#00800075" strokeWidth={3} strokeDasharray="3 3" /> */}

                <ReferenceLine y={5} label={{ value: "5  ", angle: 0, position: "left", color: "red" }} stroke="red" strokeDasharray="3 3" />
                {ratingData.map((courier, index) => (

                  <Bar
                    dataKey="punctuality_rate"
                    data={courier.data}
                    name={courier.courier}
                    key={courier.index}
                    barSize={100}
                    fill={getRandomColor()}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Spin>
      </div>
      <div className="d-flex flex-column col-4 m-5 mt-5">
        <DataTable
          value={ratingData.map((item) => ({
            ...item,
           
          }))}
          emptyMessage="Ничего не найдено..."
        >
          <Column className="col-1" field="courier" header="ФИО"></Column>
          <Column className="col-1" field="avg_rate" header="Рейтинг пунктуальности"></Column>
        </DataTable>
      </div>
    </>
  );
};

export default ChartReviews;
