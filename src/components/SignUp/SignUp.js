// // Страница регистрации

import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link } from "react-router-dom";
import "./SignUp.css";
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Spin } from "antd";
import withLayout from '../WithLayout/WithLayout';
import { _apiBase } from "../../services/Api";

const SignupSchema = yup.object().shape({
  name: yup.string().required("Обязательное поле"),
  surname: yup.string().required("Обязательное поле"),
  tel: yup
    .string()
    .matches(/^7\d{10}$/, "Введите номер телефона начиная с цифры 7, всего 11 цифр")
    .required("Телефон обязательно"),
  password: yup
    .string()
    .required("Пароль обязателен.")
    .matches(/^(?=.*[A-Za-z0-9А-Яа-я]).{8,}$/, "Пароль должен содержать минимум 8 символов, буквы и цифры"),
  group: yup.string().required("Группа обязательна."),
});



function SignUp({ onLogin }) {
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const showInfo = () => {
    toast.current.show({severity:'info', summary: 'Спасибо', detail:'Ждите активации аккаунта', life: 7000});
}
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(SignupSchema),
  });

  async function onSubmit(data1) {
    setLoading(true)
    const response = await fetch(`${_apiBase}/auth/users/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data1),
    });

    if (response.ok) {
      const data = await response.json();
      setLoading(false);
      showInfo();
      onLogin(data);
    } else {
      setLoading(false);
      const data = await response.json();
      console.log(data);
      alert(data.detail);
    }
  }

  return (
    <form className="form_signup" onSubmit={handleSubmit(onSubmit)}>
      <Spin className="spin" spinning={loading} size="large">
      <Toast ref={toast} />
      <div>
        <label>Имя</label>
        <input className="input_signup" type="text" placeholder="Иван" {...register("name")} />
        {errors.name && <p className="p__signup" >{errors.name.message}</p>}
      </div>
      <div>
        <label>Фамилия</label>
        <input className="input_signup" type="text" placeholder="Иванов" {...register("surname")} />
        {errors.surname && <p className="p__signup">{errors.surname.message}</p>}
      </div>
      <div>
        <label>Телефон</label>
        <input className="input_signup" type="phone" placeholder="79998887766" {...register("tel")} />
        {errors.tel && <p className="p__signup">{errors.tel.message}</p>}
      </div>
      <div>
        <label>Пароль</label>
        <input className="input_signup" type="password" placeholder="password12345" {...register("password")} />
        {errors.password && <p className="p__signup">{errors.password.message}</p>}
      </div>
      <div >
        <label>Группа</label>
        <input className="input_signup" type="text" placeholder="Группа" {...register("group")} />
        {errors.group && <p className="p__signup">{errors.group.message}</p>}
      </div>
      <Button className="button__signup__submit" type="submit" label="Регистрация" severity="secondary" />

  <p className="p__signup__link">Уже зарегестрированы и активированы? <Link to="/signin">Войти</Link></p>
  </Spin>
    </form>
  );
}

export default withLayout(SignUp);
