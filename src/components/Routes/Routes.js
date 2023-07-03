import React, { useState, useEffect, useRef } from "react";
import withLayout from "../WithLayout/WithLayout";
import { _apiBase } from "../../services/Api";
import { DatePicker, Space } from "antd";
import { ConfigProvider } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import locale from "antd/locale/ru_RU";

import "./Routes.css";
import { BsSearch } from "react-icons/bs";

import { Spin } from "antd";
import { Switch } from "antd";
import { FilterMatchMode, FilterOperator, filterMatchModeOptions } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";

const { RangePicker } = DatePicker;

function Routes() {
  //Поиск маршрутов по дате:
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleDateChange = (dates) => {
    if (dates) {
      const [start, end] = dates;
      setStartDate(start.format("YYYY-MM-DD"));
      setEndDate(end.format("YYYY-MM-DD"));
    }
  };

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
  console.log(startDate);
  console.log(endDate);

  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const showError = () => {
    toast.current.show({
      severity: "error",
      summary: "Ошибка",
      detail: "Попробуйте еще раз, перезагрузите страницу или обратитесь в службу поддержки",
      life: 5000,
    });
  };

  const [routes, setRoutes] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    fullName: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    "car.car_number": {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    delivery_date: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
  });
  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access");
        const response = await fetch(
          `${_apiBase}/api/v1/routes/?delivery_date__gte=${startDate ? startDate : formattedDate}&delivery_date__lte=${
            endDate ? endDate : formattedDate
          }`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `JWT ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();

          const modifiedData = data.map((item) => {
            return {
              ...item,
              fullName: `${item.courier.name} ${item.courier.surname}`,
            };
          });

          setRoutes(modifiedData);

          setLoading(false);
        } else {
          const data = await response.json();
          console.log(data);
          setLoading(false);
          showError();
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
        showError();
      }
    };

    fetchData();
  }, [endDate, startDate]);

  const renderHeader = () => {
    return (
      <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center">
        <h5 className="m-0">Маршруты</h5>

        <span className="d-flex p-input-icon-left">
          <BsSearch />
          <InputText className="col" value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Поиск" />
          <ConfigProvider locale={locale}>
            <Space className="col" direction="vertical" size={12}>
              <RangePicker format={"DD-MM-YYYY"} onChange={handleDateChange} />
            </Space>
          </ConfigProvider>
        </span>
      </div>
    );
  };
  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  console.log("routes:", routes);
  const header = renderHeader();
  return (
    <div className="container container__routes card mt-4">
      <Toast ref={toast} className="ui-toast" />
      <Spin className="spin" spinning={loading} size="large">
        <DataTable
          value={routes}
          paginator
          header={header}
          rows={50}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          rowsPerPageOptions={[25, 50, 100]}
          dataKey="id"
          selectionMode="checkbox"
          filters={filters}
          filterDisplay="menu"
          globalFilterFields={["fullName", "car.car_number", "delivery_date"]}
          emptyMessage="Ничего не найдено..."
          currentPageReportTemplate="Показано с {first} по {last} маршрут из {totalRecords}"
        >
          <Column field="fullName" header="Водитель" sortable filterField="fullName" filterPlaceholder="Поиск по фамилии" />

          <Column field="car.car_number" header="Автомобиль" sortable filterField="car.car_number" filterPlaceholder="Поиск по авто" />
          <Column field="delivery_date" header="Дата" sortable filterField="delivery_date" filterPlaceholder="Поиск по дате" />
        </DataTable>
      </Spin>
    </div>
  );
}

export default withLayout(Routes);
