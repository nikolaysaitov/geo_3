import React, { useEffect, useState, useRef } from "react";
import { FileExcelOutlined } from "@ant-design/icons";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";
import { DatePicker, Space, Select, ConfigProvider, Radio, Checkbox } from "antd";
import { Toast } from "primereact/toast";
import { Spin } from "antd";
import { csrftoken, startOfMonth, endOfMonth, getRandomColor } from "../chartsApi";
import { connect } from "react-redux";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import CustomTooltip from "../CustomTooltip";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import locale from "antd/locale/ru_RU";
const { RangePicker } = DatePicker;
const { Option } = Select;

const regionsData = ["Владивосток", "Хабаровск", "Артем", "Находка"];

const ChartPersonalStat = (props) => {
  const formatPercent2 = (value) => `${value} мин`;
  const [responseError, setResponseError] = useState("sdfasf");
  const showError = () => {
    toast.current.show({
      severity: "error",
      summary: "Ошибка получения данных для графиков",
      //   detail: responseError,
      life: 3000,
    });
  };

  const [ratingData, setRatingData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [reviewsStartDate, setReviewsStartDate] = useState(startOfMonth);
  const [reviewsEndDate, setReviewsEndDate] = useState(endOfMonth);
  const [date, setDate] = useState(getFormattedDate());
  function getFormattedDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const [type, setType] = useState();
  const [courier, setCourier] = useState(null);
  const [region, setRegion] = useState("Владивосток");
  const [radio, setRadio] = useState(1);

  const onChangeRadio = (e) => {
    setRadio(e.target.value);
  };

  const handleChange = (selectedCourier) => {
    setCourier(selectedCourier);
  };

  const handleChangeRegion = (selectedRegion) => {
    setRegion(selectedRegion);
  };

  const handleDateChange = (dates) => {
    if (dates) {
      const [start, end] = dates;
      setReviewsStartDate(start.format("YYYY-MM-DD"));
      setReviewsEndDate(end.format("YYYY-MM-DD"));
    }
  };

  const onChangeDate = (date, dateString) => {
    setDate(date.format("YYYY-MM-DD"));
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

  const dataStatReg = {
    personal_stat: "false",
    date: date,
    region: props.selectedRegion ? props.selectedRegion : null,
  };
console.log("selectedRegion in ChartPersonalStat:", props.selectedRegion)
  const dataStatPers = {
    personal_stat: "true",
    from_date: reviewsStartDate,
    to_date: reviewsEndDate,
    courier: courier ? courier : props.activeId[0],
  };

  

  const getChartsDataRating = async () => {
    setLoading(true);
    try {
      const url = "https://geo.impermebel.ru/api/v1/statistic/get-charts-data/details-stat";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
          // "Api-Key": "72wEBHUzQ6h2RwydrN3akn6ZpTRDk1QKgvJVbKi1"
        },
        body: JSON.stringify(radio === 1 ? dataStatReg : dataStatPers),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      const jsonData = await response.json();

      const formattedData = jsonData.data.map((item) => ({
        courier: item.courier,
        data: item.data.map((dataItem) => ({
          diff: Math.round(dataItem.diff / 60),
          order_number: dataItem.order_number,
        })),
      }));

      if (radio === 1) {
        setRatingData(formattedData);
      } else if (radio === 2) {
        const formattedData2 = jsonData.data.map((item) => ({
          courier: item.courier,
          data: item.data.map((dataItem) => ({
            diff: Math.round(dataItem.diff / 60),
            order_number: dataItem.order_number,
          })),
          date: new Date(item.date).toISOString().split("T")[0],
        }));

        setRatingData(formattedData2);
      }

      setLoading(false);
    } catch (error) {
      showError();
      setRatingData([]);
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (props.activeId.length > 0) {
      getChartsDataRating();
    }
  }, [props.activeId, type, courier, region, date, radio, reviewsEndDate, props.activeId.length > 0]);

  const toast = useRef(null);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const courierName = payload[0].unit;

      // console.log("payload:", payload);
      return (
        <div className="custom-tooltip" style={{ minWidth: "200px", backgroundColor: "white", padding: "10px", border: "1px solid lightgray" }}>
          <p>{`Водитель: ${courierName}`}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <div className="d-flex flex-column col-12  mb-4">
        <Spin className="spin" spinning={loading} size="large">
          <Toast ref={toast} className="ui-toast" />
          <Radio.Group onChange={onChangeRadio} value={radio} className="mb-4">
            <Radio value={1}>По региону</Radio>
            <Radio value={2}>По водителю</Radio>
          </Radio.Group>
          {radio == 2 ? (
            <ConfigProvider locale={locale}>
              <Space>
                <Select value={courier} onChange={handleChange} placeholder="Выберите водителя">
                  {props.couriersName.map((driver) => (
                    <Option key={driver.id} value={driver.id}>
                      {driver.surname} {driver.name}
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
          ) : (
            <ConfigProvider locale={locale}>
              <Space>
                {/* <Select value={region} onChange={handleChangeRegion} placeholder="Выберите регион">
                  {regionsData.map((region, index) => (
                    <Option key={index} value={region}>
                      {region}
                    </Option>
                  ))}
                </Select> */}

                <DatePicker format={"DD-MM-YYYY"} onChange={onChangeDate} />
              </Space>
            </ConfigProvider>
          )}

          <div className="d-flex flex-row mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart width={500} height={300}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="order_number" type="category" allowDuplicatedCategory={false} />
                <YAxis dataKey="diff" tickFormatter={formatPercent2} type="number" domain={[-120, 120]} allowDataOverflow />
                {radio === 2 ? <Tooltip content={<CustomTooltip />} /> : <Tooltip />}

                <Legend />
                <ReferenceLine y={0} stroke="gray" strokeWidth={1.5} strokeOpacity={0.65} />
                <ReferenceLine y={60} stroke="#C0504D" strokeWidth={3} strokeDasharray="3 3" />
                <ReferenceLine y={-60} stroke="#C0504D" strokeWidth={3} strokeDasharray="3 3" />
                {radio === 1
                  ? ratingData.map((courier, index) => (
                      <Line
                        type="monotone"
                        dataKey="diff"
                        dot={{ stroke: "#C0504D", strokeWidth: 5 }}
                        strokeWidth={3}
                        stroke={getRandomColor()}
                        data={courier.data}
                        name={courier.courier}
                        key={index}
                      />
                    ))
                  : ratingData.map((courier, index) => (
                      <Line
                        type="monotone"
                        dataKey="diff"
                        dot={{ stroke: "#C0504D", strokeWidth: 5 }}
                        strokeWidth={3}
                        stroke={getRandomColor()}
                        data={courier.data}
                        name={courier.date}
                        unit={courier.courier}
                        key={index}
                      />
                    ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Spin>
      </div>
    </>
  );
};

function mapStateToProps(state) {
  return {
    userGroup: state.userGroup,
    userName: state.userName,
    userSurName: state.userSurName,
    selectedRegion: state.selectedRegion,
    
  };
}

export default connect(mapStateToProps)(ChartPersonalStat);