import React, { useState, useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import { Spin } from "antd";
import { Select, InputNumber } from "antd";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { connect } from "react-redux";
import { csrftoken } from "../chartsApi";
import { useSelector } from "react-redux";
import "./RegionSettings.css";
import { useDispatch } from "react-redux";
const { Option } = Select;



function RegionSettings(props) {
  const toast = useRef(null);
  const dispatch = useDispatch();
  const selectedRegion = useSelector((state) => state.selectedRegion);
  const showError = () => {
    toast.current.show({
      severity: "error",
      summary: "Ошибка получения данных для графиков",
      detail: "Попробуйте еще раз, перезагрузите страницу или обратитесь в службу поддержки",
      life: 4000,
    });
  };
  const showInfo = () => {
    toast.current.show({ severity: "success", summary: "Спасибо", detail: "Данные успешно изменены", life: 2000 });
  };
  const [loading, setLoading] = useState(false);

  const columns = [
    { field: "name", header: "Название параметра" },
    {
      field: "time",
      header: "Время(мин)",
      editable: true,
      body: (rowData) => <InputNumber min={0} defaultValue={Math.round(rowData.time/60)} onChange={(value) => onChangeTime(rowData.id, value)} />,
    },
  ];

  const [region, setRegion] = useState(null);
  const [defaultTime, setDefaultTime] = useState([]);
  const [config, setConfig] = useState([]);

  const handleChangeReg = (selectedRegion) => {
    setRegion(selectedRegion);
    dispatch({ type: "SET_SELECTED_REGION", payload: selectedRegion });
  };

  // const onChangeTime = (value) => {
  //   setDefaultTime(value);
  // };
  const [timeValues, setTimeValues] = useState({});
  const onChangeTime = (id, value) => {
    setTimeValues((prevTimeValues) => ({
      ...prevTimeValues,
      [id]: value,
    }));
  };
  
  function customSort(a, b) {
    // Функция для получения только буквенных символов из строки name
    function getLettersOnly(str) {
      return str.replace(/[^a-zA-Z]/g, '').toLowerCase();
    }
  
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
  
    // Сначала проверяем, начинается ли строка с символов типа > <
    const startsWithSpecialA = /^[<>]/.test(nameA);
    const startsWithSpecialB = /^[<>]/.test(nameB);
  
    // Сортируем по следующим правилам:
    // 1. Если только одна из строк начинается с символов типа > <, то она должна идти последней
    if (startsWithSpecialA && !startsWithSpecialB) return 1;
    if (!startsWithSpecialA && startsWithSpecialB) return -1;
  
    // 2. Если строки начинаются с одинаковых символов > < или обе не начинаются с таких символов, то продолжаем сравнение
  
    // 3. Если строка начинается с цифры, то она должна идти после буквенной строки
    const startsWithNumberA = /^\d/.test(nameA);
    const startsWithNumberB = /^\d/.test(nameB);
    if (startsWithNumberA && !startsWithNumberB) return 1;
    if (!startsWithNumberA && startsWithNumberB) return -1;
  
    // 4. Если обе строки начинаются с цифр или обе с букв, то сортируем по алфавиту
    const lettersOnlyA = getLettersOnly(nameA);
    const lettersOnlyB = getLettersOnly(nameB);
    if (lettersOnlyA < lettersOnlyB) return -1;
    if (lettersOnlyA > lettersOnlyB) return 1;
  
    // 5. Если оба элемента содержат числа, сравниваем их числовые значения
    const numA = parseInt(a.name.match(/\d+/));
    const numB = parseInt(b.name.match(/\d+/));
    if (!isNaN(numA) && !isNaN(numB)) {
      if (numA < numB) return -1;
      if (numA > numB) return 1;
    }
  
    // 6. Если оба элемента не содержат чисел, считаем их равными
    return 0;
  }
  
  
  const getConfig = async () => {
    setLoading(true);
    const options = {
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
        //   "Api-Key": "72wEBHUzQ6h2RwydrN3akn6ZpTRDk1QKgvJVbKi1"
      },
    };
    try {
      const response = await fetch(`http://192.168.104.187:8000/api/v1/configs?region=${selectedRegion}`, options);
      if (!response.ok) {
        throw new Error("Request failed");
      }
      const jsonData = await response.json();
      console.log("getConfig in RegionSettings:", jsonData);
      const sortedArr = jsonData.sort(customSort);
      
      setConfig(sortedArr);
      
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      showError()
    }
  };
  useEffect(() => {
    getConfig();
  }, [selectedRegion]);



  const sendData = {
    region: props.selectedRegion,
    user_id: 40,
    settings: config.map((item)=> ({
      name: item.name,
      time: timeValues[item.id] * 60 || item.time * 60, 
    })),
  };

  console.log("sendData:", sendData)

  const sendConfig = async () => {
    setLoading(true);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
        //   "Api-Key": "72wEBHUzQ6h2RwydrN3akn6ZpTRDk1QKgvJVbKi1"
      },
      body: JSON.stringify(sendData),
    };
    try {
      const response = await fetch(`http://192.168.104.187:8000/api/v1/configs`, options);
      if (!response.ok) {
        throw new Error("Request failed");
      }
      const jsonData = await response.json();
      console.log("sendConfig in RegionSettings:", jsonData);
      setLoading(false);
      showInfo()
    } catch (error) {
      console.log(error);
      setLoading(false);
      showError()
    }
  };

  return (
    <Spin className="spin" spinning={loading} size="large">
      <div className="container main_container d-flex flex-column mb-4">
        <Toast ref={toast} className="ui-toast" />
        <h3>Региональные настройки</h3>
        <div className="d-flex flex-row mt-4 mb-4">
          <Select value={region} onChange={handleChangeReg} placeholder="Выберите регион">
            {props.regions.map((region, index) => (
              <Option key={index} value={region.region}>
                {region.region}
              </Option>
            ))}
          </Select>
        </div>
        <DataTable emptyMessage="Выберите регион для отображения данных..." value={config} tableStyle={{ minWidth: "50rem" }}>
          {columns.map((column, index) => (
            <Column key={index} field={column.field} header={column.header} body={column.body} editable={column.editable} />
          ))}
        </DataTable>
        <Button severity="success" label="Изменить" type="submit" size="small" className="align-self-end mt-4"  onClick={sendConfig}/>
      </div>{" "}
    </Spin>
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

export default connect(mapStateToProps)(RegionSettings);
