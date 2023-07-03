import React, { useState, useEffect, useRef } from "react";
import withLayout from "../WithLayout/WithLayout";
import { _apiBase } from "../../services/Api";
import "./Cars.css";
import { BsSearch } from "react-icons/bs";

import { Spin } from "antd";
// import { Switch } from "antd";
import { Dialog } from "primereact/dialog";
import { FilterMatchMode, FilterOperator, filterMatchModeOptions } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const SignupSchema = yup.object().shape({
  car_model: yup.string().required("Обязательное поле"),
  car_number: yup.string().required("Обязательное поле"),
  volume: yup.number().required("Обязательное поле"),
  mass: yup.string().required("Обязательное поле"),
  courier: yup.mixed().notOneOf(["", null], "Обязательное поле").required("Обязательное поле"),
});

function Cars() {
  const [autoDialog, setAutoDialog] = useState(false);

  const hideDialog = () => {
    setAutoDialog(false);
  };

  const openNew = () => {
    setAutoDialog(true);
  };

  const defaultValues = {
    car_model: "",
    car_number: "",
    volume: null,
    mass: null,
    courier: "",
  };

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(SignupSchema),
    defaultValues,
  });

  async function onSubmit(data) {
    const courierId = data.courier.id;
    const newData = { ...data, courier: courierId };

    setLoading(true);
    try {
      const token = localStorage.getItem("access");
      const response = await fetch(`${_apiBase}/api/v1/register-car/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${token}`,
        },
        body: JSON.stringify(newData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setLoading(false);
        reset();
        setCars((prevCars) => [...prevCars, data]);
        setAutoDialog(false);
      } else {
        setLoading(false);
        const data = await response.json();
        console.log(data);
        alert(data.detail);
      }
    } catch (error) {
      console.error(error);
      showError();
    }
  }

  const [selectedCourier, setSelectedCourier] = useState([]);

  const couriers = [
    { name: "Giger", id: "1" },
    { name: "Петров", id: "25" },
    { name: "Saitov", id: "2" },
  ];

  useEffect(() => {
    async function getCouriers() {
      try {
        const token = localStorage.getItem("access");
        const response = await fetch(`${_apiBase}/accounts/filter-by/?group=Courier&is_active=True`, {
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
              name: `${item.name} ${item.surname}`,
            };
          });

          setSelectedCourier(modifiedData);
        } else {
          const data = await response.json();
          console.log(data);
          alert(data.detail);
        }
      } catch (error) {
        console.error(error);
        showError();
      }
    }
    getCouriers();
  }, []);

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
      <>
        <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center">
          <h5 className="m-0">Автомобили</h5>

          <div>
            <span className="p-input-icon-left">
              <BsSearch />
              <InputText className="search__input" value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Поиск" />
            </span>
            <Button label="Добавить автомобиль" type="primary" onClick={openNew} style={{ height: "38px", marginLeft: "10px" }} />
          </div>
        </div>
      </>
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
          rows={10}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          rowsPerPageOptions={[10, 25, 50]}
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

        <Dialog
          visible={autoDialog}
          style={{ width: "32rem" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          header="Добавление автомобиля"
          modal
          className="p-fluid"
          onHide={hideDialog}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="field">
              <label htmlFor="car_model" className="font-bold">
                Марка, модель
              </label>
              <InputText id="car_model" autoFocus placeholder="Isuzu Elf" {...register("car_model")} />
              {errors.car_model && <p className="p__signup">{errors.car_model.message}</p>}
            </div>
            <div className="field">
              <label htmlFor="car_number" className="font-bold">
                Гос. номер автомобиля
              </label>
              <InputText id="car_number" placeholder="A001AA125" {...register("car_number")} />
              {errors.car_number && <p className="p__signup">{errors.car_number.message}</p>}
            </div>

            <div className="formgrid grid">
              <div className="field col">
                <label htmlFor="volume" className="font-bold">
                  Объем(м3)
                </label>
                <InputText type="number" id="volume" placeholder="5" {...register("volume")} />
                {errors.volume && <p className="p__signup">{errors.volume.message}</p>}
              </div>
              <div className="field col">
                <label htmlFor="mass" className="font-bold">
                  Грузоподъемность(т)
                </label>
                <InputText type="number" id="mass" placeholder="4" {...register("mass")} />
                {errors.mass && <p className="p__signup">{errors.mass.message}</p>}
              </div>
              <div className="field">
                <label htmlFor="courier" className="font-bold">
                  Водитель
                </label>
                <Controller
                  name="courier"
                  control={control}
                  rules={{ required: "Courier is required." }}
                  render={({ field }) => (
                    <Dropdown
                      id={field.courier}
                      value={field.value}
                      optionLabel="name"
                      placeholder="Выберите водителя"
                      options={selectedCourier}
                      focusInputRef={field.ref}
                      onChange={(e) => field.onChange(e.value)}
                    />
                  )}
                />

                {errors.courier && <p className="p__signup">{errors.courier.message}</p>}
              </div>
              <div className="d-flex mt-5">
                <Button label="Закрыть" outlined onClick={hideDialog} style={{ marginRight: "10px" }} />
                <Button label="Добавить автомобиль" type="submit" />
              </div>
            </div>
          </form>
        </Dialog>
      </Spin>
    </div>
  );
}

export default withLayout(Cars);
