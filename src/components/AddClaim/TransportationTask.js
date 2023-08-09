import React, { useState, useRef } from "react";
import { useForm, Controller} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./AddClaim.css";
import { Toast } from "primereact/toast";
import { _apiBase } from "../../services/Api";
import { Select, Space, DatePicker, Radio, Divider, Input, Spin, ConfigProvider, Button } from "antd";
import { AddressSuggestions } from "react-dadata";
import "react-dadata/dist/react-dadata.css";
import locale from "antd/locale/ru_RU";
const { TextArea } = Input;

function TransportationTask() {
  const [value, setValue] = useState(1);

  const TransportationTaskSchema = yup.object().shape({
    name: yup.string().required("Имя - обязательно"),
    surname: yup.string().required("Фамилия - обязательно"),
    patronymic: yup.string().required("Отчество - обязательно"),
    tel: yup
      .string()
      .matches(/^7\d{10}$/, "Введите номер телефона начиная с цифры 7, всего 11 цифр")
      .required("Телефон - обязательно"),
    description: yup.string().required("Наименование - обязательно"),
    volume: yup.number().positive("Значение должно быть положительным числом").required("Обязательное поле"),
    weight: yup.number().positive("Значение должно быть положительным числом").required("Обязательное поле"),
    order_number: yup.number().positive("Введите номер из 1С").required("Введите номер документа из 1С"),
    storehouse: yup.string().required("Выберите склад"),
    delivery_address: yup.object().required("Выберите из подсказок"),
    date: value === 1 ? yup.string().required("Заполните дату") : yup.string(),
    route: value === 2 ? yup.string().required("Выберите из выпадающего списка") : yup.string(),
    comment: yup.string(),
  });
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const showInfo = () => {
    toast.current.show({ severity: "success", summary: "Спасибо", detail: "Задание отправлено", life: 4000 });
  };
  const showError = () => {
    toast.current.show({
        severity: "error",
        summary: "Ошибка",
        detail: "Попробуйте еще раз, или обратитесь в службу поддержки",
        life: 4000,
    });
};
  const {
    control,
    reset,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(TransportationTaskSchema),
  });

  async function onSubmitTransportationTask(data1) {
    try {
      setLoading(true);
      const token = "6228605012:AAF4NV_6J40nfpPF6OrO-yr6ugzlT50ZaOU";
      const url = `https://api.telegram.org/bot${token}/sendMessage`;
      const updatedData = { chat_id: 245743597, text: { ...data1, delivery_address: data1.delivery_address.value } };
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
  
      if (response.ok) {
        const data = await response.json();
        setLoading(false);
        showInfo();
        reset();
      } else {
        setLoading(false);
        const data = await response.json();
        // console.log(data);
        showError();
      }
    } catch (error) {
        setLoading(false);
    //   console.error(error);
      showError();

    }
  }
  
  // при выборе радио кнопки сбрасываем противоположное значение , иначе ошибка locale...
//   const onChange = (e) => {
//     if (e.target.value === 2) {
//       reset({
//         ...getValues(),
//         date: "",
//       });
//     } else if (e.target.value === 1) {
//       reset({
//         ...getValues(),
//         route: "",
//       });
//     }

//     setValue(e.target.value);
//   };
  
  const onChange = (e) => {

    if (e.target.value === 1) {
              reset({
                ...getValues(),
                route: null,
              });}
    setValue(e.target.value);
  };

  const resetForm = () => {
    reset();
  };

  return (
    <form className="container  mt-5" onSubmit={handleSubmit(onSubmitTransportationTask)}>
      <Spin className="spin" spinning={loading} size="large">
        <Toast ref={toast} />
        <div className="form_block">
          <div className="input_add_claim_block col-sm">
            <label>Фамилия получателя</label>
            <Controller name="surname" control={control} render={({ field }) => <Input type="text" placeholder="Иванов" {...field} />} />
            {errors.surname && <p className="p__add_claim">{errors.surname.message}</p>}
          </div>
          <div className="input_add_claim_block col-sm">
            <label>Имя получателя</label>
            <Controller name="name" control={control} render={({ field }) => <Input type="text" placeholder="Иван" {...field} />} />
            {errors.name && <p className="p__add_claim">{errors.name.message}</p>}
          </div>
          <div className="input_add_claim_block col-sm">
            <label>Отчество получателя</label>
            <Controller name="patronymic" control={control} render={({ field }) => <Input type="text" placeholder="Иванович" {...field} />} />
            {errors.patronymic && <p className="p__add_claim">{errors.patronymic.message}</p>}
          </div>
          <div className="input_add_claim_block col-sm">
            <label>Телефон</label>
            <Controller name="tel" control={control} render={({ field }) => <Input type="phone" placeholder="79998887766" {...field} />} />
            {errors.tel && <p className="p__add_claim">{errors.tel.message}</p>}
          </div>
        </div>
        <div className="form_block">
          <div className="input_add_claim_block  col-sm-6">
            <label>Наименование</label>
            <Controller name="description" control={control} render={({ field }) => <Input type="text" placeholder="Диван, стол, " {...field} />} />
            {errors.description && <p className="p__add_claim">{errors.description.message}</p>}
          </div>
          <div className="input_add_claim_block  col-sm">
            <label>Объем груза(м3):</label>
            <Controller
              name="volume"
              control={control}
              render={({ field }) => <Input type="number" placeholder="1.2" step="0.1" min="0" {...field} />}
            />
            {errors.volume && <p className="p__add_claim">{errors.volume.message}</p>}
          </div>
          <div className="input_add_claim_block  col-sm">
            <label>Вес груза(кг)::</label>
            <Controller
              name="weight"
              control={control}
              render={({ field }) => <Input type="number" placeholder="58" step="1" min="0" {...field} />}
            />
            {errors.weight && <p className="p__add_claim">{errors.weight.message}</p>}
          </div>
        </div>
        <Divider />
        <div className="form_block">
          <div className="input_add_claim_block  col-sm-3">
            <label>Номер документа:</label>
            <Controller
              name="order_number"
              control={control}
              render={({ field }) => (
                <Input
                  onKeyPress={(e) => {
                    if (isNaN(Number(e.key))) {
                      e.preventDefault();
                    }
                  }}
                  type="text"
                  {...field}
                  placeholder="0099999999"
                  minLength="2"
                  maxLength="10"
                />
              )}
            />
            {errors.order_number && <p className="p__add_claim">{errors.order_number.message}</p>}
          </div>
          <div className="input_add_claim_block col-sm-3">
            <label>Склад отгрузки:</label>
            <Controller
              name="storehouse"
              control={control}
              render={({ field }) => (
                <Select
                  className="col-sm-11"
                  
                  {...field}
                  placeholder="Выберите склад отгрузки"
                  options={[
                    {
                      value: "Артем, Бийская, 6/4",
                      label: "Артем, Бийская, 6/4",
                    },
                  ]}
                />
              )}
            />
            {errors.storehouse && <p className="p__add_claim">{errors.storehouse.message}</p>}
          </div>
          <div className="input_add_claim_block col-sm">
            <label>Адрес доставки:</label>
            <Controller
              name="delivery_address"
              control={control}
              render={({ field }) => (
                <AddressSuggestions
                  className="input_add_claim_block col-sm-6"
                  type="text"
                  name="delivery_address"
                  {...field}
                  token="38eb532716e82a08806ad6ecfc6da847d723e6aa"
                  inputProps={{ placeholder: "Владивосток, Давыдова 7" }}
                  autocomplete
                  geolocation
                />
              )}
            />
            {errors.delivery_address && <p className="p__add_claim">{errors.delivery_address.message}</p>}
          </div>
        </div>
        <Divider />
        <div className="form_block align-items-center">
          <div className="input_add_claim_block col-sm-3">
            <Controller
              name="radio"
              control={control}
              render={({ field }) => (
                <Radio.Group className="d-flex flex-column" {...field} onChange={onChange} value={value}>
                  <Radio value={1}>Добавить к планированию на:</Radio>
                  <Radio value={2}>Добавить к маршруту:</Radio>
                </Radio.Group>
              )}
            />
            {errors.radio && <p className="p__add_claim">{errors.radio.message}</p>}
          </div>

          {value === 1 ? (
            <div className="input_add_claim_block col-sm-3">
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <ConfigProvider locale={locale}>
                    <Space direction="vertical" size={12}>
                      <DatePicker {...field} format={"DD-MM-YYYY"} name="date" />
                    </Space>
                  </ConfigProvider>
                )}
              />
              {errors.date && <p className="p__add_claim">{errors.date.message}</p>}
            </div>
          ) : (
            <div className="input_add_claim_block col-sm-3">
              <Controller
                name="route"
                control={control}
                render={({ field }) => (
                  <Select
                    className="col-sm-11"
                    placeholder={"Добавить к актуальному маршруту"}
                    {...field}
                    // placeholder="Добавить к актуальному маршруту"
                    options={[
                      {
                        value: "Giger Den - Фрунзенский - 4 июля 2023 г. - Mazda Titan",
                        label: "Giger Den - Фрунзенский - 4 июля 2023 г. - Mazda Titan",
                      },
                      {
                        value: "Петров Андрей - Ленина - 5 июля 2023 г. - Mazda Titan",
                        label: "Петров Андрей - Ленина - 5 июля 2023 г. - Mazda Titan",
                      },
                      {
                        value: "Иванов Андрей - Ленина - 5 июля 2023 г. - Mazda Titan",
                        label: "Иванов Андрей - Мира - 4 июля 2023 г. - Mazda Titan",
                      },
                    ]}
                  />
                )}
              />
              {errors.route && <p className="p__add_claim">{errors.route.message}</p>}
            </div>
          )}

          <div className="input_add_claim_block  col-sm">
            <label>Заметка для перевозчика:</label>
            <Controller
              name="comment"
              control={control}
              render={({ field }) => (
                <TextArea rows={4} placeholder="Закрытый двор, шлагбаум, на домофоне набрать 5433#" maxLength={600} {...field} />
              )}
            />
            {errors.comment && <p className="p__add_claim">{errors.comment.message}</p>}
          </div>
        </div>

        <Divider />

        <div className="d-flex align-items-center justify-content-end">
          <Button onClick={resetForm} className="m-2">
            Сбросить форму
          </Button>
          <Button type="primary" htmlType="submit">
            Сформировать заявку
          </Button>
        </div>
      </Spin>
    </form>
  );
}

export default TransportationTask;
