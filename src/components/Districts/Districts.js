import * as React from "react";
import { useState, useEffect } from "react";
import { RedoOutlined } from "@ant-design/icons";
import { TileLayer } from "react-leaflet/TileLayer";
import { MapContainer, useMap } from "react-leaflet";
import { Popup } from "react-leaflet/Popup";
import { Marker } from "react-leaflet/Marker";
import { connect } from "react-redux";
import IconTruck from "../CouriersAccount/icons/IconTruck";
import IconFinish from "../CouriersAccount/icons/IconFinish";
import withLayout from "../WithLayout/WithLayout";
import "./Districts.css";
import { Polyline } from "react-leaflet";
import { decode } from "polyline";
import { GeoJSON } from "geojson";
import { data } from "./data";
import { data2 } from "./data2";

import L from "leaflet";
import "leaflet-polylinedecorator";


function Districts() {
  const decodeGeometry = (geometry) => {
    const decodedCoordinates = decode(geometry);
    return decodedCoordinates.map(([longitude, latitude]) => [latitude, longitude]);
  };

  const geometry = data.routes[0].geometry;
  const coordinates = decodeGeometry(geometry);

  const geojsonData = {
    type: "LineString",
    coordinates: coordinates.map(([longitude, latitude]) => [latitude, longitude]),
  };


  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    setMarkers(
      data2
        .filter((_, index) => index % 100 === 0)
        .map((coord) => ({
          active: Math.random() >= 0.5,
          done: Math.random() >= 0.5,
          backlog: Math.random() >= 0.5,
          position: [coord[0], coord[1]],
        }))
    );
  }, []);

  console.log("markers:", markers);

  const arrow = [
    {
      offset: 0,
      repeat: 100,
      symbol: L.Symbol.arrowHead({
        pixelSize: 15,
        polygon: true,
        pathOptions: {
          stroke: false,
          fill: "#3388ff", // Добавляем заливку стрелке
          fillOpacity: 1,
          color: "blue",
        },
      }),
    },
  ];

  function PolylineDecorator({ patterns, polylines }) {
    const map = useMap();

    useEffect(() => {
      if (!map) return;

      polylines.forEach((polyline) => {
        L.polyline(polyline).addTo(map);
        L.polylineDecorator(polyline, {
          patterns,
        }).addTo(map);
      });
    }, [map]);

    return null;
  }

  // CSS стили для пользовательского икон
  const customIconStyles = `
  .custom-marker {
    width: 30px !important;
    height: 30px !important;
    background-color: #ff4d4f !important;
    border-radius: 50% !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
  }

  .marker-label {
    color: white !important;
    font-weight: bold !important;
  }
`;
  // Добавьте стили пользовательского икон в head элемента
  const styleElement = document.createElement("style");
  styleElement.innerHTML = customIconStyles;
  document.head.appendChild(styleElement);

  // Создайте функцию, которая будет генерировать пользовательскую иконку с указанным номером
  function createCustomIcon(number) {
    return L.divIcon({
      className: "custom-marker",
      html: `<div class="marker-label">${number}</div>`,
    });
  }

  console.log(geojsonData.coordinates);


  
  
  return (
    <>
      <MapContainer id="map" center={[43.0956391, 131.9037986]} zoom={13} scrollWheelZoom={true}>
        <a href="##" onClick={() => window.location.reload()}>
          <RedoOutlined style={{ fontSize: "18px" }} className="phone__update__districts" />
        </a>

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {markers.map((marker, index) => (
          <Marker key={index} position={marker.position} icon={createCustomIcon(index + 1)}>
            <Popup>
              {marker.active && <div>Active</div>}
              {marker.done && <div>Done</div>}
              {marker.backlog && <div>Backlog</div>}
              <a target="_blank" rel="noopener noreferrer" href="dgis://2gis.ru/routeSearch/rsType/car/to/30.149939,59.849767">
                Владивосток, ул Ризеншнауцера-Циммер-Вандершпигеля, д 7, офис 6
              </a>
            </Popup>
          </Marker>
        ))}

        <Marker position={[43.21335, 131.95415]} icon={IconTruck}></Marker>
        <Marker position={[43.0926391, 131.9537986]} icon={IconFinish}></Marker>

        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {/* <Polyline  positions={geojsonData.coordinates} className="arrow" /> */}
        <PolylineDecorator  pathOptions={{ stroke: "green" }} patterns={arrow} polylines={[geojsonData.coordinates]} />
        {/* <MapComponent  polylines={[geojsonData.coordinates]} />  */}

      </MapContainer>
      {/* <div className="legend__district__block"></div> */}
    </>
  );
}

export default withLayout(Districts);
