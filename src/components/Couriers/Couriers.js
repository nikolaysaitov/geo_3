import React, { useState, useEffect, useRef } from "react";
import withLayout from "../WithLayout/WithLayout";

import "./Couriers.css";
import { BsSearch } from "react-icons/bs";

import { Spin } from "antd";
import { Switch } from "antd";
import { _apiBase } from "../../services/Api";
import { FilterMatchMode, FilterOperator, filterMatchModeOptions } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useSelector } from 'react-redux';


function Couriers() {
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
  const onChange = async (checked, rowData) => {
    try {
      const token = localStorage.getItem("access");
      const response = await fetch(`${_apiBase}/accounts/switch-activity/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${token}`,
        },
        body: JSON.stringify({
          user_id: rowData.id.toString(),
          is_active: checked.toString(),
        }),
      });

      if (response.ok) {
        console.log(`Switched activity for user ${rowData.id} to ${checked}`);
      } else {
        const data = await response.json();
        console.log(data);
        showError();
      }
    } catch (error) {
      console.error(error);
      showError();
    }
  };

  const [couriers, setCouriers] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    fullName: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    activity_region: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    tel: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
  });
  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access");
        const response = await fetch(`${_apiBase}/accounts/filter-by/?group=Courier`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();

          const modifiedData = data.map((item) => {
            return {
              ...item,
              fullName: `${item.name} ${item.surname}`,
            };
          });

          setCouriers(modifiedData);

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
  }, []);

  const renderHeader = () => {
    return (
      <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center">
        <h5 className="m-0">Водители</h5>
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

  console.log("couriers:", couriers);
  const header = renderHeader();


  const data = useSelector(state => state.userGroup);
  return (
    <div className="container container__couriers card mt-4">

      <Toast ref={toast} className="ui-toast" />
      <Spin className="spin" spinning={loading} size="large">
        <DataTable
          value={couriers}
          paginator
          header={header}
          rows={50}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          rowsPerPageOptions={[25, 50, 100]}
          dataKey="id"
          selectionMode="checkbox"
          filters={filters}
          filterDisplay="menu"
          globalFilterFields={["fullName", "activity_region", "tel"]}
          emptyMessage="Ничего не найдено..."
          currentPageReportTemplate="Показано с {first} по {last} водитель из {totalRecords}"
        >
          <Column field="fullName" header="ФИО" sortable filterField="fullName" filterPlaceholder="Поиск по фамилии" />

          <Column field="activity_region" header="Регион активности" sortable filterField="activity_region" filterPlaceholder="Поиск по региону" />
          <Column field="tel" header="Телефон" sortable filterField="tel" filterPlaceholder="Поиск по телефону" />

          <Column
            header="Активность"
            body={(rowData) => (
              <Switch
                defaultChecked={Boolean(rowData.is_active)}

                onChange={(checked) => onChange(checked, rowData)}
              
              />
            )}
          />
        </DataTable>
      </Spin>
    </div>
  );
}

export default withLayout(Couriers);
