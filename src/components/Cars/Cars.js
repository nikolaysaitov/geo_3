import React, { useState, useEffect, useRef } from "react";
import withLayout from "../WithLayout/WithLayout";
import { _apiBase } from "../../services/Api";
import "./Cars.css";
import { BsSearch } from "react-icons/bs";

import { Spin } from "antd";
// import { Switch } from "antd";

import { FilterMatchMode, FilterOperator, filterMatchModeOptions } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";

function Cars() {
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

  const [cars, setCars] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    car_model: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    car_number: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    volume: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    mass: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
  });
  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access");
        const response = await fetch(`${_apiBase}/api/v1/cars/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCars(data);
          setLoading(false);
        } else {
          const data = await response.json();
        //   console.log(data);
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
  }, []);

  const renderHeader = () => {
    return (
      <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center">
        <h5 className="m-0">Автомобили</h5>
        <span className="p-input-icon-left">
          <BsSearch />
          <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Поиск" />
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

//   console.log("cars:", cars);
  const header = renderHeader();
  return (
    <div className="container container__cars card mt-4">
      <Toast ref={toast} className="ui-toast" />
      <Spin className="spin" spinning={loading} size="large">
        <DataTable
          value={cars}
          paginator
          header={header}
          rows={50}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          rowsPerPageOptions={[25, 50, 100]}
          dataKey="id"
          selectionMode="checkbox"
          filters={filters}
          filterDisplay="menu"
          globalFilterFields={["car_model", "car_number", "volume", "mass", "balance", "courier"]}
          emptyMessage="Ничего не найдено..."
          currentPageReportTemplate="Показано с {first} по {last} авто из {totalRecords}"
        >
          <Column field="car_model" header="Модель" sortable filterField="car_model" filterPlaceholder="Поиск по модели" />
          <Column field="car_number" header="Гос.номер" sortable filterField="car_number" filterPlaceholder="Поиск по номеру" />
          <Column field="volume" header="	Объем(м3)" sortable filterField="volume" filterPlaceholder="Поиск по объему" />
          <Column field="mass" header="Грузоподъемность(т)" sortable filterField="mass" filterPlaceholder="Поиск по массе" />
         
        </DataTable>
      </Spin>
    </div>
  );
}

export default withLayout(Cars);
