import * as React from "react";
import { useState, useEffect } from "react";
import { Reorder } from "framer-motion";
import { Item } from "./Item";
import { Switch, Button, Modal, Result, Dropdown, Space } from "antd";
import { DownOutlined, PhoneOutlined, RedoOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";

import { TileLayer } from "react-leaflet/TileLayer";
import { MapContainer } from "react-leaflet";
import { Popup } from "react-leaflet/Popup";
import { Marker } from "react-leaflet/Marker";
import { Link } from "react-router-dom";
import Draggable from "react-draggable";
import { connect } from "react-redux";
import IconTruck from "./icons/IconTruck";
import IconFinish from "./icons/IconFinish";

import "./CourierMain.css";
const initialItems = [
  {
    id: 1,
    order: 107644,
    text: "Владивосток, ул Адмирала Кузнецова, д 18, кв 426",
  },
  { id: 2, order: 108486, text: "Владивосток, ул Луговая, д 64, кв 71" },
  { id: 3, order: 110316, text: "Владивосток, ул Нейбута, д 25" },
  {
    id: 4,
    order: 110372,
    text: "Владивосток, ул Черняховского, д 421, кв 42",
  },
  { id: 5, order: 108340, text: "Владивосток, ул Ладыгина, д 1, офис 12" },
  { id: 6, order: 16340, text: "Владивосток, ул Давыдова, д 111, офис 7/12" },
  { id: 7, order: 1086740, text: "Владивосток, ул Ленина, д 8, офис 17" },
  { id: 8, order: 18340, text: "Владивосток, ул Ризеншнауцера-Циммер-Вандершпигеля, д 7, офис 6" },
  { id: 9, order: 14340, text: "Владивосток, ул Адыгина, д 9, офис 142" },
  { id: 10, order: 1670, text: "Владивосток, ул Ли, д 191, офис 7912" },
  { id: 11, order: 176740, text: "Владивосток, ул Хренова, д 24, офис 14" },
  { id: 12, order: 1640, text: "Владивосток, ул Парк Авеню, д 88, офис 36" },
];

function CourierMain({userName, userSurName}) {
  //Подключение css лифлетовской карты, именно здесь потому что могу, а в index.html не могу!
  // useEffect(() => {
  //   const link = document.createElement("link");
  //   link.rel = "stylesheet";
  //   link.href = "https://unpkg.com/leaflet@1.7.1/dist/leaflet.css";
  //   link.integrity = "sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A==";
  //   link.crossOrigin = "";
  //   document.head.appendChild(link);
  //   return () => {
  //     document.head.removeChild(link);
  //   };
  // }, []);
  //Фейк данные:
  const [adress, setAdress] = useState(initialItems);
  console.log("initialItems:", initialItems);
  console.log("adress:", adress);

  //Возможность изменить порядок вкл/выкл:
  const [drag, setDrag] = useState(false);

  const onChange = (checked) => {
    console.log(`switch to ${checked}`);
    setDrag(checked);
  };

  // Модалка кнопки начала маршрута:
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 1000);
  };
  const handleCancel = () => {
    setOpen(false);
  };

  //Перетаскивание блока:
  const handleDrag = (e, data) => {
    // console.log(data.y);
  };
  const bounds = {
    top: 0,
    bottom: 400,
  };
  const history = useHistory(); // создаем объект history
  const handleLogout = () => {
    localStorage.clear();
    history.push("/signin"); // перенаправляем пользователя на страницу /signup
  };
  // Меню аккаунта водителя
  const handleMenuClick = (e) => {
    console.log("click", e);
  };
  const items = [
    {
      label: "Изменить пароль",
      key: "1",
      // icon: <UserOutlined />,
    },

    {
      label: <Link to="/">На главную</Link>,
      key: "/",
    },
    {
      label: <div onClick={handleLogout}>Выйти</div>,
      key: "/signin",
      // icon: <UserOutlined />,
    },
  ];
  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  return (
    <>
      <MapContainer center={[43.0956391, 131.9037986]} zoom={13} scrollWheelZoom={false}>
        <Dropdown menu={menuProps}>
          <Button style={{ zIndex: "99999", position: "absolute", right: "10px", top: "10px", outlineStyle: "none" }}>
            <Space>
            {userSurName}{userName}
              <DownOutlined />
            </Space>
          </Button>
        </Dropdown>
        <a href="tel:+79999999999">
          <PhoneOutlined style={{ fontSize: "18px" }} className="phone__dispatcher" />
        </a>

        <a href="##" onClick={() => window.location.reload()}>
          <RedoOutlined style={{ fontSize: "18px" }} className="phone__update" />
        </a>

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[43.0956391, 131.9037986]}>
          <Popup>
            {/* <a target="_blank" rel="noopener noreferrer" href="yandexnavi://build_route_on_map?lat_to=43.13002&lon_to=131.92016"> */}
            <a target="_blank" rel="noopener noreferrer" href="dgis://2gis.ru/routeSearch/rsType/car/to/30.149939,59.849767">
              Владивосток, ул Ризеншнауцера-Циммер-Вандершпигеля, д 7, офис 6
            </a>
          </Popup>
        </Marker>

        <Marker position={[43.0966391, 131.9137986]} icon={IconTruck}></Marker>
        <Marker position={[43.0926391, 131.9537986]} icon={IconFinish}></Marker>
      </MapContainer>
      <Draggable
        axis="y"
        bounds={bounds}
        scale={1}
        grid={[100, 100]}
        onDrag={handleDrag}
        cancel=".switch__title__button, .ul__routes, .check__drag__button"
      >
        <div className="main__routes__block">
          <div>
            <div className="button__swipe__div">
              <button className="swipe_line mt-2 mb-1"></button>
            </div>

            <div className="container__buttons">
              <div className="check__drag">
                <p className="switch__title">Изменить порядок маршрута</p>
                <Switch size="small" checked={drag} onChange={onChange} className="switch__title__button" />
              </div>
              <div className="check__drag">
                {/* <p className="switch__title">Начать поездку</p> */}
                <Button type="primary" onClick={showModal} disabled={drag} className="check__drag__button">
                  Выехал
                </Button>
              </div>
            </div>
            <Modal
              centered
              open={open}
              title="Внимание!"
              onOk={handleOk}
              onCancel={handleCancel}
              style={{ zIndex: "9999" }}
              footer={[
                <Button key="back" onClick={handleCancel}>
                  Закрыть
                </Button>,
                <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
                  Начать
                </Button>,
              ]}
            >
              <Result
                status="warning"
                style={{ fontSize: "13px" }}
                title="Нажимая кнопку 'Начать', клиенты получат уведомления, что вы выехали. Желаете начать маршрут?"
                className="result__go"
              />
            </Modal>
            <Reorder.Group axis="y" onReorder={setAdress} values={adress} className="ul__routes">
              {adress.map((item, index) => (
                <Item key={item.id} item={item} index={index} drag={drag}/>
              ))}
            </Reorder.Group>
          </div>
        </div>
      </Draggable>
    </>
  );
}

function mapStateToProps(state) {
  return {
    userGroup: state.userGroup,
    userName: state.userName,
    userSurName: state.userSurName
  };
}

export default connect(mapStateToProps)(CourierMain);