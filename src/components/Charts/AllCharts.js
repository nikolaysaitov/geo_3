import React, { useState, useEffect, useRef } from "react";
import { FileExcelOutlined } from "@ant-design/icons";
import ChartProeb from "../Charts/ChartProeb/ChartProeb";
import ChartReviews from "../Charts/ChartReviews/ChartReviews";
import ChartPunctuality from "../Charts/ChartPunctuality/ChartPunctuality";
import ChartPersonalStat from "./ChartPersonalStat/ChartPersonalStat";
import { getActiveCouriers, getRegions } from "./chartsApi";
import RegionSettings from "./RegionSettings/RegionSettings";
import { connect } from "react-redux";

import { Toast } from "primereact/toast";
import { Spin } from "antd";
import { DatePicker, Space, Select, TimePicker, ConfigProvider } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import locale from "antd/locale/ru_RU";

function AllCharts({ selectedRegion }) {
  const today = new Date();
  const year = today.getFullYear();
  let month = today.getMonth() + 1;
  let day = today.getDate();

  if (month < 10) {
    month = "0" + month;
  }

  if (day < 10) {
    day = "0" + day;
  }

  const formattedDate = `${year}-${month}-${day}`;

  const showError = () => {
    toast.current.show({
      severity: "error",
      summary: "Ошибка получения данных для графиков",
      detail: "Попробуйте еще раз, перезагрузите страницу или обратитесь в службу поддержки",
      life: 4000,
    });
  };

  // ID активных водителей
  const [activeId, setActiveId] = useState([]);
  const [couriersName, setCouriersName] = useState([]);
  const [regions, setRegions] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const { jsonData } = await getRegions();
        setRegions(jsonData);
      } catch (error) {
        showError();
        console.log(error);
      }
    };
    getData();
  }, []);
  //   console.log("regions in AllCharts:", regions);
  console.log("selectedRegion in AllCharts:", selectedRegion);
  useEffect(() => {
    const getData = async () => {
      try {
        const { couriers, ids } = await getActiveCouriers(selectedRegion);
        setActiveId(ids);
        setCouriersName(couriers);
      } catch (error) {
        showError();
        console.log(error);
      }
    };
    getData();
  }, [selectedRegion]);

  const toast = useRef(null);
  return (
    <div className="container main_container">
      <RegionSettings regions={regions} />
      <h1 className="mb-4 pb-4">{selectedRegion}:</h1>
      <Toast ref={toast} className="ui-toast" />
      <h3>Абсолютное отклонение("-" раньше, "+" позже)</h3>
      <div className="d-flex flex-row mt-4 mb-4">
        <ChartPersonalStat couriersName={couriersName} activeId={activeId} />
      </div>

      <h3>Коэффициент пунктуальности (доставка в доверительном интервале)</h3>
      <div className="d-flex flex-row mt-4 mb-4">
        <ChartPunctuality couriersName={couriersName} activeId={activeId} />
      </div>

      <h3>Рейтинг водителей по отзывам клиентов</h3>
      <div className="d-flex flex-row mt-4 mb-4">
        <ChartReviews couriersName={couriersName} activeId={activeId} />
      </div>

      <h3>Общее количество доставок/с задержкой более часа</h3>
      <div className="d-flex flex-row mt-4">
        <ChartProeb couriersName={couriersName} activeId={activeId} />
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    userGroup: state.userGroup,
    userName: state.userName,
    userSurName: state.userSurName,
    selectedRegion: state.selectedRegion,
  };
}

export default connect(mapStateToProps)(AllCharts);
