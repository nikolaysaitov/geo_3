// Страница авторизации
import React, { useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Toast } from "primereact/toast";
import { Spin } from "antd";
import "./SignIn.css";
import withLayout from '../WithLayout/WithLayout';
import { _apiBase } from "../../services/Api";
import { Input } from "antd";


const SignupSchema = yup.object().shape({
  tel: yup
    .string()
    .matches(/^7\d{10}$/, "Введите номер телефона начиная с цифры 7, всего 11 цифр")
    .required("Телефон обязательно"),
  password: yup
    .string()
    .required("Пароль обязателен.")
    .matches(/^(?=.*[A-Za-z0-9А-Яа-я]).{8,}$/, "Пароль должен содержать минимум 8 символов, буквы и цифры"),
});

function SignUp({ onLogin }) {
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const showInfo = () => {
    toast.current.show({ severity: "info", summary: "Спасибо", detail: "Ждите активации аккаунта", life: 7000 });
  };


  const history = useHistory(); // создаем объект history
  // const handleLogout = () => {
  //   localStorage.clear();
  //   history.push("/signin"); // перенаправляем пользователя на страницу /signup
  // };

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(SignupSchema),
  });

  async function onSubmit2(data2) {
    // event.preventDefault();

    const response = await fetch(`${_apiBase}/auth/jwt/create/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data2),
    });

    if (response.ok) {
      const data = await response.json();
      onLogin(data);
      window.location.href = "/";
      console.log(data);
    } else {
      const data = await response.json();
      console.log(data);
      alert(data.detail);
    }
  }

  return (
    <form className="form_signin" onSubmit={handleSubmit(onSubmit2)}>
      <Spin className="spin" spinning={loading} size="large">
      <label>Телефон</label>
      <Controller name="tel" control={control} render={({ field }) => <Input type="phone" placeholder="79998887766" {...field} />} />
      {errors.tel && <p className="p__signup">{errors.tel.message}</p>}
      <label>Пароль</label>
      <Controller name="password" control={control} render={({ field }) => <Input type="password" placeholder="password12345" {...field} />} />
      {errors.password && <p className="p__signup">{errors.password.message}</p>}

      <Button className="button__signin__submit" type="submit" label="Войти" severity="secondary"></Button>
      <p className="p__signin__link">
        Еще не зарегестрированы? <Link to="/signup">Регистрация</Link>
      </p>

      </Spin>
    </form>
  );
}

export default withLayout(SignUp);
