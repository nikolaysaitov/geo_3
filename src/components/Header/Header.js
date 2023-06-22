import React from "react";
import { Menu } from "antd";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { GrUserAdmin, GrUserWorker, GrUser, GrUserManager, GrCar, GrDuplicate, GrTask, GrMapLocation, GrUserExpert } from "react-icons/gr";
import { FiUsers } from "react-icons/fi";
import "./Header.css";

import { connect } from "react-redux";

const Header = ({ userGroup, userName, userSurName }) => {
  const history = useHistory(); // создаем объект history
  const handleLogout = () => {
    localStorage.clear();
    history.push("/signin"); // перенаправляем пользователя на страницу /signup
  };
  function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  }

  const itemsOwner = [
    getItem(`${userSurName} ${userName}`, "sub2", <GrUserExpert />, [
      
      getItem(<Link to="##">Изменить пароль</Link>, "/pass"),
      getItem(<div onClick={handleLogout}>Выйти</div>, "/signin"),
    ]),

    {
      label: <Link to="/admin">Админка</Link>,
      key: "/admin",
      icon: <GrUserAdmin />,
    },

    {
      label: <Link to="/">Главная</Link>,
      key: "/",
      icon: <GrUserAdmin />,
    },

    getItem("Пользователи", "sub3", <FiUsers />, [
      getItem(<Link to="/couriers">Водители</Link>, "/couriers", <GrUserWorker />),
      getItem(<Link to="/dispatchers">Диспетчера</Link>, "/dispatchers", <GrUser />),
      getItem(<Link to="/managers">Управляющие</Link>, "/managers", <GrUserManager />),
    ]),

    {
      label: <Link to="/cars">Автомобили</Link>,
      key: "/cars",
      icon: <GrCar />,
    },
    {
      label: <Link to="##">Добавить заявку</Link>,
      key: "/add_claim",
      icon: <GrDuplicate />,
    },

    {
      label: <Link to="##">Распределить заказы</Link>,
      key: "/districts",
      icon: <GrTask />,
    },
    {
      label: <Link to="/routes">Посмотреть маршруты</Link>,
      key: "/routes",
      icon: <GrMapLocation />,
    },
  ];
  const itemsDispatcher = [
    getItem(`${userSurName} ${userName}`, "sub2", <GrUserExpert />, [
  
      getItem(<Link to="##">Изменить пароль</Link>, "/pass"),
      getItem(<div onClick={handleLogout}>Выйти</div>, "/signin"),
    ]),

    {
      label: <Link to="/">Главная</Link>,
      key: "/",
      icon: <GrUserAdmin />,
    },
    {
      label: <Link to="/couriers">Водители</Link>,
      key: "/couriers",
      icon: <GrUserWorker />,
    },

   

    {
      label: <Link to="/cars">Автомобили</Link>,
      key: "/cars",
      icon: <GrCar />,
    },
    {
      label: <Link to="##">Добавить заявку</Link>,
      key: "/add_claim",
      icon: <GrDuplicate />,
    },

    {
      label: <Link to="##">Распределить заказы</Link>,
      key: "/districts",
      icon: <GrTask />,
    },
    {
      label: <Link to="/routes">Посмотреть маршруты</Link>,
      key: "/routes",
      icon: <GrMapLocation />,
    },
  ];
  const itemsManager = [
    getItem(`${userSurName} ${userName}`, "sub2", <GrUserExpert />, [
     
      getItem(<Link to="##">Изменить пароль</Link>, "/pass"),
      getItem(<div onClick={handleLogout}>Выйти</div>, "/signin"),
    ]),

    {
      label: <Link to="/admin">Админка</Link>,
      key: "/admin",
      icon: <GrUserAdmin />,
    },

    {
      label: <Link to="/">Главная</Link>,
      key: "/",
      icon: <GrUserAdmin />,
    },

    getItem("Пользователи", "sub3", <FiUsers />, [
      getItem(<Link to="/couriers">Водители</Link>, "/couriers", <GrUserWorker />),
      getItem(<Link to="/dispatchers">Диспетчера</Link>, "/dispatchers", <GrUser />),
      getItem(<Link to="/managers">Управляющие</Link>, "/managers", <GrUserManager />),
    ]),

    {
      label: <Link to="/cars">Автомобили</Link>,
      key: "/cars",
      icon: <GrCar />,
    },
    {
      label: <Link to="##">Добавить заявку</Link>,
      key: "/add_claim",
      icon: <GrDuplicate />,
    },

    {
      label: <Link to="##">Распределить заказы</Link>,
      key: "/districts",
      icon: <GrTask />,
    },
    {
      label: <Link to="/routes">Посмотреть маршруты</Link>,
      key: "/routes",
      icon: <GrMapLocation />,
    },
  ];
  const itemsCourier = [
    getItem(`${userSurName} ${userName}`, "sub2", <GrUserExpert />, [
      getItem(<Link to="/">На главную</Link>, "/"),
      getItem(<Link to="##">Изменить пароль</Link>, "/pass"),
      getItem(<div onClick={handleLogout}>Выйти</div>, "/signin"),
    ]),



    {
      label: <Link to="/routes">Посмотреть маршруты</Link>,
      key: "/routes",
      icon: <GrMapLocation />,
    },
  ];

  let items = [];

  if (userGroup === "Owner") {
    items = itemsOwner;
  } else if (userGroup === "Dispatcher") {
    items = itemsDispatcher;
  } else if (userGroup === "Manager") {
    items = itemsManager;
  } else if (userGroup === "Courier") {
    items = itemsCourier;
  }

  const location = useLocation();

  const [current, setCurrent] = useState(location.pathname);

  const handleClick = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
    console.log(location.pathname);
  };

  useEffect(() => {
    // console.log("click useeffect");
    setCurrent(location.pathname);
  }, [location]);

  return (
    <div className="menu__header">
      <Menu className="container" onClick={handleClick} selectedKeys={[current]} mode="horizontal" items={items} />
      {/* <p>User Group: {userGroup}{userName}{userSurName}</p> */}
    </div>
  );
};

function mapStateToProps(state) {
  return {
    userGroup: state.userGroup,
    userName: state.userName,
    userSurName: state.userSurName
  };
}

export default connect(mapStateToProps)(Header);
