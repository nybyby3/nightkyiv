// Tiny i18n. Just two locales — UK (default) and EN.

export const LOCALES = ["uk", "en"];

export const dict = {
  uk: {
    brand: "NightKyiv",
    langLabel: "EN",
    nav: { discover:"Підбір", explore:"Місця", map:"Карта", cinema:"Кіно", cook:"Готуємо" },

    greeting: () => {
      const h = new Date().getHours();
      if (h < 6)  return "Доброї ночі";
      if (h < 12) return "Доброго ранку";
      if (h < 18) return "Доброго дня";
      return "Доброго вечора";
    },

    discover: {
      heroTitle: "Що сьогодні?",
      heroSub:   v => `${v.toLocaleString("uk-UA")} місць у Києві — знайди своє`,
      stepMood:  "Який настрій?",
      stepCat:   "Оберіть напрямок",
      stepSub:   "Конкретніше",
      moods: [
        { id:"active",  label:"Активно",    sub:"Рух, спорт, енергія",  ic:"⚡" },
        { id:"chill",   label:"Спокійно",   sub:"Атмосфера, розслабити",  ic:"🌿" },
        { id:"social",  label:"З друзями",  sub:"Гучна компанія",         ic:"🎉" },
        { id:"solo",    label:"Сам/сама",   sub:"Затишно і тільки моє",   ic:"🌙" },
      ],
      results:  n => `${n} ${pluralUk(n,["місце","місця","місць"])}`,
      back:     "← Назад",
      reset:    "Спочатку",
      seeAll:   "Дивитись усі",
      surprise: "🎲 Здивуй мене",
      saved:    "Збережене",
      noSaved:  "Поки нічого не збережено. Тисни ♡ на картках, які тобі сподобались.",
    },

    explore: {
      title:   "Усі місця Києва",
      sub:     "Шукай за категорією, районом, рейтингом",
      search:  "Пошук...",
      filterCat: "Категорія",
      filterDistrict: "Район",
      sortBy:  "Сортувати",
      sortRating: "За рейтингом",
      sortName:   "За назвою",
      sortFlag:   "Спочатку флагмани",
      noResults:  "Нічого не знайшли — спробуй інший фільтр",
      flagship:   "Флагман",
      reviews:    n => `${n} відгуків`,
    },

    map: {
      title: "Карта Києва",
      sub:   "Місця, парки, маршрути",
      myLocation: "Моя локація",
      radius: "Радіус",
      hide:   "Сховати список",
      show:   "Показати список",
      directions: "Маршрут",
      details:    "Детальніше",
      noCoords:   "Адреса ще не на карті",
    },

    cook: {
      title: "Готуємо вдома",
      sub:   "Кулінарні рецепти від базових до молекулярних",
      diff:  { easy:"Легко", medium:"Середньо", hard:"Складно" },
      ingredients: "Інгредієнти",
      equipment:   "Інвентар",
      steps:       "Як готувати",
      tips:        "Поради шефа",
    },

    venue: {
      open:    "Маршрут",
      call:    "Подзвонити",
      web:     "Сайт",
      hours:   "Години роботи",
      price:   "Ціна",
      notes:   "Особливості",
      flagship: "🏆 Флагман",
    },
  },

  en: {
    brand: "NightKyiv",
    langLabel: "УК",
    nav: { discover:"Discover", explore:"Places", map:"Map", cinema:"Cinema", cook:"Cooking" },

    greeting: () => {
      const h = new Date().getHours();
      if (h < 6)  return "Good night";
      if (h < 12) return "Good morning";
      if (h < 18) return "Good afternoon";
      return "Good evening";
    },

    discover: {
      heroTitle: "What's tonight?",
      heroSub:   v => `${v.toLocaleString("en-US")} places in Kyiv — pick yours`,
      stepMood:  "What's the vibe?",
      stepCat:   "Pick a direction",
      stepSub:   "Narrow it down",
      moods: [
        { id:"active",  label:"Active",  sub:"Move and engage",      ic:"⚡" },
        { id:"chill",   label:"Chill",   sub:"Slow down, enjoy",     ic:"🌿" },
        { id:"social",  label:"Social",  sub:"Loud and with friends",ic:"🎉" },
        { id:"solo",    label:"Solo",    sub:"Quiet and mine only",  ic:"🌙" },
      ],
      results:  n => `${n} ${n===1?"place":"places"}`,
      back:     "← Back",
      reset:    "Start over",
      seeAll:   "See all",
      surprise: "🎲 Surprise me",
      saved:    "Saved",
      noSaved:  "Nothing saved yet. Tap ♡ on cards you like.",
    },

    explore: {
      title:   "All places in Kyiv",
      sub:     "Search by category, district, rating",
      search:  "Search...",
      filterCat: "Category",
      filterDistrict: "District",
      sortBy:  "Sort",
      sortRating: "By rating",
      sortName:   "By name",
      sortFlag:   "Flagships first",
      noResults:  "Nothing found — try a different filter",
      flagship:   "Flagship",
      reviews:    n => `${n} reviews`,
    },

    map: {
      title: "Map of Kyiv",
      sub:   "Places, parks, routes",
      myLocation: "My location",
      radius: "Radius",
      hide:   "Hide list",
      show:   "Show list",
      directions: "Directions",
      details:    "Details",
      noCoords:   "Address not yet on map",
    },

    cook: {
      title: "Cook at home",
      sub:   "Recipes from basic to molecular",
      diff:  { easy:"Easy", medium:"Medium", hard:"Hard" },
      ingredients: "Ingredients",
      equipment:   "Equipment",
      steps:       "Steps",
      tips:        "Chef's tips",
    },

    venue: {
      open:    "Directions",
      call:    "Call",
      web:     "Website",
      hours:   "Hours",
      price:   "Price",
      notes:   "Notes",
      flagship: "🏆 Flagship",
    },
  },
};

// Ukrainian plural helper (місце/місця/місць).
function pluralUk(n, forms) {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return forms[0];
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return forms[1];
  return forms[2];
}
