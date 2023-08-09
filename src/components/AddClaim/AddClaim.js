import React, { useState} from "react";
import { Tabs } from "antd";
import "./AddClaim.css";

import TransportationTask from "./TransportationTask";
import JobAssignment from "./JobAssignment";
import withLayout from "../WithLayout/WithLayout";

function AddClaim() {
  const [size, setSize] = useState('small');
  return (
    <div className="container mt-5 ">
      <Tabs
        defaultActiveKey="1"
        type="card"
        size={size}
        items={[{
            label: "Задание на перевозку",
            key: 1,
            children: <TransportationTask />,
          }, {
            label: "Задание на выполнение работ",
            key: 2,
            children: <JobAssignment />,
          }]
        }
      />
    </div>
  );
}

export default withLayout(AddClaim);
