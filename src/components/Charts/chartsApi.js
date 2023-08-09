import store from "../../redux/store";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

export const csrftoken = getCookie("csrftoken");
// console.log("csrftoken:", csrftoken);

export const getRegions = async () => {
  const options = {
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
      //   "Api-Key": "72wEBHUzQ6h2RwydrN3akn6ZpTRDk1QKgvJVbKi1"
    },
  };
  try {
    const response = await fetch("http://192.168.104.187:8000/api/v1/regions", options);
    if (!response.ok) {
      throw new Error("Request failed");
    }
    const jsonData = await response.json();
    //   console.log("regions:", jsonData);

    return { jsonData };
  } catch (error) {
    console.log(error);
  }
};

const selectedRegion = store.getState().selectedRegion;

export const getActiveCouriers = async (selectedRegion) => {
  console.log("selectedRegion in chartsApi:", selectedRegion);
  const options = {
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
      //   "Api-Key": "72wEBHUzQ6h2RwydrN3akn6ZpTRDk1QKgvJVbKi1"
    },
  };
  try {
    const response = await fetch(`http://192.168.104.187:8000/api/v1/statistic/get-active-couriers?region=${selectedRegion}`, options);
    if (!response.ok) {
      throw new Error("Request failed");
    }
    const jsonData = await response.json();

    const couriers = jsonData.couriers;

    const ids = couriers.map((courier) => courier.id);
    return { couriers, ids };
  } catch (error) {
    console.log(error);
  }
};

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth() + 1; // Месяцы в JavaScript нумеруются с 0 до 11, поэтому добавляем 1

// Формируем дату начала текущего месяца
export const startOfMonth = `${currentYear}-${currentMonth.toString().padStart(2, "0")}-01`;

// Определяем последний день текущего месяца
const lastDayOfMonth = new Date(currentYear, currentMonth, 0).getDate();

// Формируем дату конца текущего месяца
export const endOfMonth = `${currentYear}-${currentMonth.toString().padStart(2, "0")}-${lastDayOfMonth.toString().padStart(2, "0")}`;

// Рандомный цвет для линий графиков
export function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
