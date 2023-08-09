import React from "react";
import PropTypes from "prop-types";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload; // Данные выбранной линии
    return (
      <div className="custom-tooltip">
        <p>{data.name}</p>
        <p>Diff: {data.diff}</p>
      </div>
    );
  }
  
  return null;
};

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
};

export default CustomTooltip;
