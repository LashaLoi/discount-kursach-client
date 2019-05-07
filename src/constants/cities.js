export const CITIES = [
  {
    name: "Минск",
    alias: "minsk",
    lat: 53.9,
    lng: 27.56667,
    zoom: 12,
  },
  {
    name: "Брест",
    alias: "brest",
    lat: 52.09755,
    lng: 23.68775,
    zoom: 12,
  },
  {
    name: "Витебск",
    alias: "viciebsk",
    lat: 55.1904,
    lng: 30.2049,
    zoom: 12,
  },
  {
    name: "Гомель",
    alias: "homiel",
    lat: 52.4345,
    lng: 30.9754,
    zoom: 12,
  },
  {
    name: "Гродно",
    alias: "hrodna",
    lat: 53.6884,
    lng: 23.8258,
    zoom: 12,
  },
  {
    name: "Могилев",
    alias: "mahiliou",
    lat: 53.9168,
    lng: 30.3449,
    zoom: 12,
  },
];


export const findCityByName = name => CITIES.find(city => city.name.toLowerCase() === name.toLowerCase()) || CITIES[0];
