const data = [
  {
    name: "ул Луговая, д 83В, кв 23",
    calculated_delivery_time: 11.12,
    fact_delivery_time: 11.01,
  },
  {
    name: "ул Адмирала Кузнецова, д 58, кв 22",
    calculated_delivery_time: 11.18,
    fact_delivery_time: 11.26,
  },
  {
    name: "ул Шепеткова, д 46, кв 18",
    calculated_delivery_time: 12.23,
    fact_delivery_time: 12.15,
  },
  {
    name: "ул Нейбута, д 2А к 2, кв 85",
    calculated_delivery_time: 13.12,
    fact_delivery_time: 13.00,
  },
  {
    name: "ул Талалихина, д 1, кв 34",
    calculated_delivery_time: 14.24,
    fact_delivery_time: 14.28,
  },
  {
    name: "ул Талалихина, д 34, кв 334",
    calculated_delivery_time: 14.57,
    fact_delivery_time: 14.50,
  },
  {
    name: "ул Давыдова, д 7, кв 5",
    calculated_delivery_time: 16.20,
    fact_delivery_time: 16.25,
  },
  {
    name: "ул Нейбута, д 2А к 2, кв 85",
    calculated_delivery_time: 13.12,
    fact_delivery_time: 13.00,
  },
  {
    name: "ул Талалихина, д 1, кв 34",
    calculated_delivery_time: 14.24,
    fact_delivery_time: 14.28,
  },
  {
    name: "ул Талалихина, д 34, кв 334",
    calculated_delivery_time: 14.57,
    fact_delivery_time: 15.07,
  },
  {
    name: "ул Давыдова, д 7, кв 5",
    calculated_delivery_time: 16.20,
    fact_delivery_time: 16.25,
  },
];

export const newModifiedData = data.map((item) => {
    
    const calculatedTimeInMinutes = Math.round(item.calculated_delivery_time * 60);
    const factTimeInMinutes = Math.round(item.fact_delivery_time * 60);
    const differenceInMinutes = calculatedTimeInMinutes - factTimeInMinutes;
  
    return {
      ...item,
      difference: differenceInMinutes,
    };
  });