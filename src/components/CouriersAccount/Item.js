import * as React from "react";

import { useState } from "react";
import { useMotionValue, Reorder, useDragControls } from "framer-motion";
import { useRaisedShadow } from "./use-raised-shadow";
import { ReorderIcon } from "./Icon";
import { Col, Row, Button, Modal } from "antd";
import { InfoCircleOutlined, CheckOutlined, GlobalOutlined } from "@ant-design/icons";

export const Item = (props) => {
  const y = useMotionValue(0);
  const boxShadow = useRaisedShadow(y);
  const dragControls = useDragControls();

  //Модалка инфо:
  const [isModalOpenInfo, setIsModalOpenInfo] = useState(false);
  const showModalInfo = () => {
    setIsModalOpenInfo(true);
  };
  const handleOkInfo = () => {
    setIsModalOpenInfo(false);
  };
  const handleCancelInfo = () => {
    setIsModalOpenInfo(false);
  };

  //Модалка выполнено:
  const [isModalOpenDone, setIsModalOpenDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const showModalDone = () => {
    setIsModalOpenDone(true);
  };
  const handleOkDone = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsModalOpenDone(false);
    }, 1000);
  };
  const handleCancelDone = () => {
    setIsModalOpenDone(false);
  };
console.log("props.drag:", props.drag)
  return (
    <>
      <Reorder.Item
        value={props.item}
        id={props.item.id}
        style={{ boxShadow, y, backgroundColor: (props.item.id ===8 ? '#ff000036' : null) }}
        dragListener={props.drag}
        // dragControls={dragControls}
        className="li__routes"
      >
        <Row justify="space-between" align="middle">
          <Col span={2}>
            <p className="item_text_queue">{props.index + 1}</p>
          </Col>
          <Col span={13}>
            <p className="item_text">{props.item.text}</p>
          </Col>
          <Col span={9} className="col__end">
            <CheckOutlined className="button__done" onClick={showModalDone} />
            <InfoCircleOutlined className="button__info" onClick={showModalInfo} />
            <a href="dgis://2gis.ru/routeSearch/rsType/car/to/30.149939,59.849767">
              <GlobalOutlined className="button__navi" />
            </a>

            <ReorderIcon dragControls={dragControls} className="button__info" />
          </Col>
        </Row>
      </Reorder.Item>
      <Modal centered title="Информация о заказе:" open={isModalOpenInfo} onOk={handleOkInfo} onCancel={handleCancelInfo} cancelText="Отмена">
        <p>Имя: Валентина Туманова</p>
        <p>Телефон: <a href="tel:+79999999999">79999999999</a></p>
        <p>Время заказа: 21 мая 2023 г. 3:15</p>
        <p>Место покупки: ИНТЕРНЕТ-МАРКЕТПЛЕЙС ОЗОН ДВ</p>
        <p>Комментарий: (НАЛ) OZON , ЗВОНОК ЗА ЧАС - 8 952 081 11 41 , доп. номер - 8 994 010 20 29 , Ботанический сад , частный дом</p>
      </Modal>

      <Modal
        centered
        title="Заказ выполнен?"
        open={isModalOpenDone}
        cancelText="Отмена"
        onCancel={handleCancelDone}
        footer={[
          <Button key="back" onClick={handleCancelDone}>
            Закрыть
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={handleOkDone}>
            Выполнен!
          </Button>,
        ]}
      >
        <p>Вы уверены?</p>
      </Modal>
    </>
  );
};
