import React, { useEffect, useState, useRef } from "react";
import { FileExcelOutlined } from "@ant-design/icons";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";
import { DatePicker, Space, Select, ConfigProvider } from "antd";
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
  const [rating, setRating] = useState([]);

  const [courier, setCourier] = useState(null);
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



  const dataRating = {
    from_date: reviewsStartDate,
    to_date: reviewsEndDate,
    couriers: courier ? [courier] : props.activeId,
  };

  const getChartsDataRating = async () => {
    setLoading(true);
    try {
      const url = "https://geo.impermebel.ru/api/v1/statistic/get-charts-data/grade";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        //   "Api-Key": "72wEBHUzQ6h2RwydrN3akn6ZpTRDk1QKgvJVbKi1"
        },
        body: JSON.stringify(dataRating),
      });

      if (!response.ok) {
        // showError();
        throw new Error("Request failed");
      }

      const jsonData = await response.json();
      const formattedData = jsonData.data.map((item) => ({
        courier: item.courier,
        data: item.data.map((dataItem) => ({
          date: new Date(dataItem.date).toISOString().split("T")[0],
          grade: parseFloat(dataItem.grade.toFixed(1)),
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
      getChartsDataReviews();
    }
  }, [props.activeId, type, courier, reviewsEndDate, props.activeId.length > 0]);

  const dataReviews = {
    from_date: reviewsStartDate,
    to_date: reviewsEndDate,
    couriers: props.activeId,
  };
  const getChartsDataReviews = async () => {
    setLoading(true);
    try {
      const url = "https://geo.impermebel.ru/api/v1/statistic/get-charts-data/medium-grade";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        //   "Api-Key": "72wEBHUzQ6h2RwydrN3akn6ZpTRDk1QKgvJVbKi1"
        },
        body: JSON.stringify(dataReviews),
      });

      if (!response.ok) {
        // showError();
        throw new Error("Request failed");
      }

      const jsonData = await response.json();
      setRating(jsonData.data);
      setLoading(false);
    } catch (error) {
      showError();
      console.error(error);
      setLoading(false);
    }
  };

  const toast = useRef(null);

  return (
    <>
      <div className="d-flex flex-column col-8">
        <Spin className="spin" spinning={loading} size="large">
          <Toast ref={toast} className="ui-toast" />
          <ConfigProvider locale={locale}>
            <Space>
              <Select value={courier} onChange={handleChange} placeholder="Выберите водителя">
                {props.couriersName.map((driver, index) => (
                  <Option key={index} value={driver.id}>
                    {driver.surname} {driver.name}
                  </Option>
                ))}
                 <Option  value={props.activeId}>
                    Все водители
                  </Option>
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
              <LineChart width={500} height={300}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" type="category" allowDuplicatedCategory={false} />
                <YAxis dataKey="grade" domain={[0, 6]}  />
                <Tooltip />
                <Legend />
                <ReferenceLine y={5} stroke="#00800075" strokeWidth={3} strokeDasharray="3 3" />
                <ReferenceLine y={3.5} label={{ value: 'min 3.5 ', angle: 0, position: 'left' }} stroke="#C0504D" strokeWidth={3} strokeDasharray="3 3" />
                {ratingData.map((courier, index) => (
                  <Line
                    dataKey="grade"
                    dot={{ stroke: "#C0504D", strokeWidth: 5 }}
                    strokeWidth={3}
                    stroke={getRandomColor()}
                    data={courier.data}
                    name={courier.courier}
                    key={index}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Spin>
      </div>
      <div className="d-flex flex-column col-3 m-5 mt-5">
        {/* <DataTable
          value={rating ? rating.map((item) => ({
            ...item,
           
          })) : []}
          emptyMessage="Ничего не найдено..."
        >
          <Column className="col-1" field="surname" header="ФИО"></Column>
          <Column className="col-1" field="medium_grade" header="Рейтинг пользователей"></Column>
        </DataTable> */}
      </div>
    </>
  );
};

export default ChartReviews;
