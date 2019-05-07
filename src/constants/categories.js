export const COLORS = {
  red: "#f44262",
  orange: "#f48341",
  lightBlue: "#41c4f4",
  pink: "#f959b9",
  white: "#ffffff",
  blue: "#5b59f9",
  green: "#088931",
  lightGreen: "#68f26a",
  turquoise: "#3ee8ba",
  yellow: "#eef73d",
  violet: "#7b00ff",
  burgundy: "#5b0000",
  gray: "#afafaf",
  black: "#000000",
};

export const ICONS = {
  PUBS_AND_BARS: "utensils",
  FOOD_DELIVERY: "map-marker-alt",
  HEALTH: "heartbeat",
  BEAUTY: "spray-can",
  FOREIGN_LANGUAGES: "language",
  SPORTS: "dumbbell",
  TOURISM: "hiking",
  QUESTS: "stopwatch",
  LEISURE: "bicycle",
  BOOKS: "book",
  BOARD_GAMES: "dice",
  DESIGN_AND_BUILDINGS: "home",
  AUTO: "car",
  OTHER: "shopping-cart",
};

export const ICONS_NEXT = {
  PUBS_AND_BARS: "local_bar",
  FOOD_DELIVERY: "local_pizza",
  HEALTH: "local_hospital",
  BEAUTY: "face",
  FOREIGN_LANGUAGES: "translate",
  SPORTS: "fitness_center",
  TOURISM: "rowing",
  QUESTS: "vpn_key",
  LEISURE: "directions_bike",
  BOOKS: "book",
  BOARD_GAMES: "casino",
  DESIGN_AND_BUILDINGS: "home",
  AUTO: "directions_car",
  SHOPPING: "shopping_cart",
  OTHER: "category",
};

export const BENEFITS_CATEGORIES_NEXT = {
  "бары и пабы": {
    color: COLORS.red,
    icon: ICONS_NEXT.PUBS_AND_BARS,
  },
  "доставка еды": { color: COLORS.orange, icon: ICONS_NEXT.FOOD_DELIVERY },
  "медицинские услуги": { color: COLORS.lightBlue, icon: ICONS_NEXT.HEALTH },
  "красота и уход": { color: COLORS.pink, icon: ICONS_NEXT.BEAUTY },
  "курсы иностранных языков": {
    color: COLORS.black,
    icon: ICONS_NEXT.FOREIGN_LANGUAGES,
  },
  "спорт": { color: COLORS.blue, icon: ICONS_NEXT.SPORTS },
  "туризм": { color: COLORS.green, icon: ICONS_NEXT.TOURISM },
  "квест-румы": { color: COLORS.lightGreen, icon: ICONS_NEXT.QUESTS },
  "активный отдых": { color: COLORS.turquoise, icon: ICONS_NEXT.LEISURE },
  "книги": { color: COLORS.yellow, icon: ICONS_NEXT.BOOKS },
  "настольные игры": { color: COLORS.violet, icon: ICONS_NEXT.BOARD_GAMES },
  "дизайн и ремонт": {
    color: COLORS.burgundy,
    icon: ICONS_NEXT.DESIGN_AND_BUILDINGS,
  },
  "авто": { color: COLORS.gray, icon: ICONS_NEXT.AUTO },
  "покупка товаров": { color: COLORS.gray, icon: ICONS_NEXT.SHOPPING },
  other: { color: COLORS.black, icon: ICONS_NEXT.OTHER },
};

// eslint-disable-next-line no-confusing-arrow
export const getCategoryIcon = name =>
  (name && Object.keys(BENEFITS_CATEGORIES_NEXT).find(item => item === name.toLowerCase()))
    ? BENEFITS_CATEGORIES_NEXT[name.toLowerCase()]
    : BENEFITS_CATEGORIES_NEXT["other"];

export const BENEFITS_CATEGORIES = {
  "pubs and bars": {
    color: COLORS.red,
    icon: ICONS.PUBS_AND_BARS,
  },
  "food delivery": { color: COLORS.orange, icon: ICONS.FOOD_DELIVERY },
  health: { color: COLORS.lightBlue, icon: ICONS.HEALTH },
  beauty: { color: COLORS.pink, icon: ICONS.BEAUTY },
  "foreign language": { color: COLORS.black, icon: ICONS.FOREIGN_LANGUAGES },
  sport: { color: COLORS.blue, icon: ICONS.SPORTS },
  tourism: { color: COLORS.green, icon: ICONS.TOURISM },
  quests: { color: COLORS.lightGreen, icon: ICONS.QUESTS },
  leisure: { color: COLORS.turquoise, icon: ICONS.LEISURE },
  books: { color: COLORS.yellow, icon: ICONS.BOOKS },
  "board games": { color: COLORS.violet, icon: ICONS.BOARD_GAMES },
  "design ang buildings": {
    color: COLORS.burgundy,
    icon: ICONS.DESIGN_AND_BUILDINGS,
  },
  auto: { color: COLORS.gray, icon: ICONS.AUTO },
  other: { color: COLORS.black, icon: ICONS.OTHER },
};
