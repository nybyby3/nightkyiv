import { useState, useEffect, useMemo, useCallback } from "react";

const T={en:{brand:"NightKyiv",langSwitch:"🇺🇦 УК",greeting:()=>{const h=new Date().getHours();return h<12?"Good morning":h<18?"Good afternoon":"Good evening"},heroTitle:"What's your\nevening plan?",heroSub:"125 activities across Kyiv — find yours",step1Title:"Who's joining?",step2Title:"What's the vibe?",step3Title:"Pick a category",solo:"Solo",duo:"Duo",party:"3+ People",soloDesc:"Me time",duoDesc:"Date or friend",partyDesc:"Group fun",active:"Active",passive:"Chill",activeDesc:"Move & engage",passiveDesc:"Sit back & enjoy",results:"results",backBtn:"Back",resetBtn:"Start over",nav:{home:"Discover",events:"Events",cinema:"Cinema",map:"Map"},eventsTitle:"Events",eventsSubtitle:"All activities in Kyiv",cinemaTitle:"Cinema",cinemaSubtitle:"Live showtimes from Kyiv cinemas",mapTitle:"Map",mapSubtitle:"Discover places",allFilter:"All",footer:"© 2026 NightKyiv. All rights reserved.",from:"from",free:"Free",
cats:{concerts:"Concerts",culture:"Culture",nightlife:"Nightlife",food:"Food & Drinks",sports:"Sports",wellness:"Wellness",cinema:"Cinema",entertainment:"Entertainment",cooking:"Cook at Home"},
cook:{ingredients:"Ingredients",equipment:"Equipment",steps:"Steps",servings:"servings",orderVia:"Order ingredients via",easy:"Easy",medium:"Medium",hard:"Hard"},
live:{loading:"Loading live data...",error:"Could not load",refresh:"Refresh",liveTag:"LIVE",poweredBy:"Powered by AI search"}},
uk:{brand:"NightKyiv",langSwitch:"🇬🇧 EN",greeting:()=>{const h=new Date().getHours();return h<12?"Доброго ранку":h<18?"Доброго дня":"Доброго вечора"},heroTitle:"Який план\nна вечір?",heroSub:"125 активностей у Києві — знайди свою",step1Title:"Хто з вами?",step2Title:"Який настрій?",step3Title:"Оберіть категорію",solo:"Соло",duo:"Удвох",party:"3+ людей",soloDesc:"Час для себе",duoDesc:"Побачення чи друг",partyDesc:"Компанія",active:"Активний",passive:"Спокійний",activeDesc:"Рух та енергія",passiveDesc:"Розслабтесь",results:"результатів",backBtn:"Назад",resetBtn:"Спочатку",nav:{home:"Головна",events:"Події",cinema:"Кіно",map:"Карта"},eventsTitle:"Події",eventsSubtitle:"Усі активності у Києві",cinemaTitle:"Кіно",cinemaSubtitle:"Сеанси кінотеатрів Києва онлайн",mapTitle:"Карта",mapSubtitle:"Відкривайте місця",allFilter:"Усі",footer:"© 2026 NightKyiv. Усі права захищені.",from:"від",free:"Безкоштовно",
cats:{concerts:"Концерти",culture:"Культура",nightlife:"Нічне життя",food:"Їжа та напої",sports:"Спорт",wellness:"Відпочинок",cinema:"Кіно",entertainment:"Розваги",cooking:"Готуємо вдома"},
cook:{ingredients:"Інгредієнти",equipment:"Обладнання",steps:"Кроки",servings:"порцій",orderVia:"Замовити інгредієнти через",easy:"Легко",medium:"Середньо",hard:"Складно"},
live:{loading:"Завантаження...",error:"Не вдалося завантажити",refresh:"Оновити",liveTag:"LIVE",poweredBy:"На основі AI пошуку"}}};

const IC={concerts:"🎵",culture:"🎭",nightlife:"🌙",food:"🍷",sports:"⚡",wellness:"✨",cinema:"🎬",entertainment:"🎲",cooking:"🍳"};
const CC={concerts:"#ff6bca",culture:"#3ecf8e",nightlife:"#a259ff",food:"#ff6b6b",sports:"#4fc3f7",wellness:"#36d1c4",cinema:"#f7b731",entertainment:"#ff9f43",cooking:"#ff8a50"};
const imgs={concerts:["https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400&h=240&fit=crop","https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=240&fit=crop","https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=240&fit=crop"],culture:["https://images.unsplash.com/photo-1503095396549-807759245b35?w=400&h=240&fit=crop","https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=400&h=240&fit=crop","https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=400&h=240&fit=crop"],nightlife:["https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=400&h=240&fit=crop","https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=400&h=240&fit=crop","https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=240&fit=crop"],food:["https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=240&fit=crop","https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=240&fit=crop","https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&h=240&fit=crop"],sports:["https://images.unsplash.com/photo-1522163182402-834f871fd851?w=400&h=240&fit=crop","https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?w=400&h=240&fit=crop","https://images.unsplash.com/photo-1461896836934-bd45ea8be68d?w=400&h=240&fit=crop","https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=240&fit=crop"],wellness:["https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=240&fit=crop","https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=400&h=240&fit=crop"],cinema:["https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=240&fit=crop","https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=240&fit=crop","https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=240&fit=crop"],entertainment:["https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&h=240&fit=crop","https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=400&h=240&fit=crop","https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?w=400&h=240&fit=crop"],cooking:["https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&h=240&fit=crop","https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?w=400&h=240&fit=crop","https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=400&h=240&fit=crop"]};

const A=[
{id:1,en:"Kozak System — Grand Concert",uk:"KOZAK SYSTEM: великий концерт",v:"Zhovtnevyi Palats",c:"concerts",g:["solo","duo","party"],t:"passive",p:480,tm:"18:00",s:"Mar 27"},
{id:2,en:"Rammstein Symphonic Tribute",uk:"Rammstein з симфонічним оркестром",v:"Zhovtnevyi Palats",c:"concerts",g:["solo","duo","party"],t:"passive",p:350,tm:"18:00",s:"Mar 22"},
{id:3,en:"Dakh Daughters Concert",uk:"Концерт Dakh Daughters",v:"Zhovtnevyi Palats",c:"concerts",g:["solo","duo","party"],t:"passive",p:490,tm:"18:00",s:"May 30"},
{id:4,en:"DREVO — Live",uk:"DREVO — живий виступ",v:"Zhovtnevyi Palats",c:"concerts",g:["solo","duo","party"],t:"passive",p:649,tm:"19:00",s:"Mar 21"},
{id:5,en:"Ponomariov Solo",uk:"Пономарьов концерт",v:"Nat. Palace of Arts",c:"concerts",g:["solo","duo","party"],t:"passive",p:490,tm:"18:00",s:"Mar 28"},
{id:6,en:"Jerry Heil",uk:"Jerry Heil",v:"Palace of Sports",c:"concerts",g:["solo","duo","party"],t:"active",p:590,tm:"19:00",s:"Apr 4"},
{id:7,en:"Boombox Solo",uk:"Бумбокс сольник",v:"Blockbuster Mall",c:"concerts",g:["solo","duo","party"],t:"active",p:450,tm:"17:00",s:"May 16"},
{id:8,en:"Jazz Night Atlas",uk:"Джаз Atlas",v:"Atlas",c:"concerts",g:["solo","duo","party"],t:"passive",p:450,tm:"20:00",s:"Fridays"},
{id:9,en:"Vivienne Mort",uk:"Vivienne Mort",v:"Nat. Philharmonic",c:"concerts",g:["solo","duo"],t:"passive",p:400,tm:"18:00",s:"Mar 21"},
{id:10,en:"Music Without Borders",uk:"Музика без кордонів",v:"Nat. Philharmonic",c:"concerts",g:["solo","duo"],t:"passive",p:350,tm:"18:00",s:"Mar 28"},
{id:11,en:"Classical Evening",uk:"Лятошинський.Скорик",v:"Nat. Philharmonic",c:"concerts",g:["solo","duo"],t:"passive",p:300,tm:"18:00",s:"Mar 27"},
{id:12,en:"Grammy Hits",uk:"ГРЕММІ хіти",v:"Zhovtnevyi Palats",c:"concerts",g:["solo","duo","party"],t:"passive",p:450,tm:"18:00",s:"Apr 18"},
{id:13,en:"Stand-Up Comedy",uk:"Стендап комеді",v:"Caribbean Club",c:"concerts",g:["solo","duo","party"],t:"passive",p:500,tm:"19:30",s:"Thu-Sat"},
{id:14,en:"Modern Art Exhibition",uk:"Виставка мистецтва",v:"Pinchuk Art Centre",c:"culture",g:["solo","duo","party"],t:"passive",p:0,tm:"10-21",s:"Daily"},
{id:15,en:"Vovchykha Theatre",uk:"Вовчиха вистава",v:"Franko Theatre",c:"culture",g:["solo","duo"],t:"passive",p:350,tm:"15:00",s:"Mar 22"},
{id:16,en:"Viktorina Theatre",uk:"Вікторина",v:"Lesya Ukrainka",c:"culture",g:["solo","duo"],t:"passive",p:800,tm:"19:00",s:"Mar-Apr"},
{id:17,en:"Be Healthy Monsieur",uk:"Будьте здорові",v:"Armed Forces Bldg",c:"culture",g:["solo","duo","party"],t:"passive",p:250,tm:"18:00",s:"Mar 24"},
{id:18,en:"Shadows Teulis",uk:"Театр тіней",v:"Armed Forces Bldg",c:"culture",g:["solo","duo","party"],t:"passive",p:250,tm:"13:00",s:"Mar 28"},
{id:19,en:"Two Hares Play",uk:"За двома зайцями",v:"Armed Forces Bldg",c:"culture",g:["solo","duo","party"],t:"passive",p:250,tm:"18:00",s:"Mar 29"},
{id:20,en:"Night Tour Kyiv",uk:"Нічна екскурсія",v:"Maidan",c:"culture",g:["solo","duo","party"],t:"active",p:350,tm:"21:00",s:"Daily"},
{id:21,en:"National Opera",uk:"Національна Опера",v:"National Opera",c:"culture",g:["solo","duo"],t:"passive",p:300,tm:"19:00",s:"Weekly"},
{id:22,en:"Mystetskyi Arsenal",uk:"Мистецький Арсенал",v:"Mystetskyi Arsenal",c:"culture",g:["solo","duo","party"],t:"passive",p:150,tm:"11-20",s:"Tue-Sun"},
{id:23,en:"22 Theatre Ladder",uk:"22 Театр Драбина",v:"Lesya Ukrainka",c:"culture",g:["solo","duo"],t:"passive",p:450,tm:"19:00",s:"Mar 22"},
{id:24,en:"Chicago Operetta",uk:"Чикаго Оперета",v:"Operetta Theatre",c:"culture",g:["solo","duo","party"],t:"passive",p:200,tm:"18:00",s:"May 13"},
{id:25,en:"Poetry Marathon",uk:"Поетичний марафон",v:"Various",c:"culture",g:["solo","duo","party"],t:"passive",p:200,tm:"18:00",s:"Seasonal"},
{id:26,en:"Volcano of Passion",uk:"Вулкан пристрасті",v:"Lesya Ukrainka",c:"culture",g:["duo"],t:"passive",p:600,tm:"19:00",s:"Mar 31"},
{id:27,en:"Electronic Closer",uk:"Електронна Closer",v:"Closer",c:"nightlife",g:["solo","duo","party"],t:"active",p:400,tm:"22:00",s:"Weekends"},
{id:28,en:"K41 Techno",uk:"K41 Техно",v:"K41 (∄)",c:"nightlife",g:["solo","duo","party"],t:"active",p:500,tm:"16:00",s:"Saturdays"},
{id:29,en:"SkyBar Rooftop",uk:"SkyBar тераса",v:"SkyBar",c:"nightlife",g:["solo","duo"],t:"passive",p:0,tm:"20:00",s:"Daily"},
{id:30,en:"Parovoz Cocktails",uk:"Parovoz коктейлі",v:"Parovoz",c:"nightlife",g:["solo","duo"],t:"passive",p:250,tm:"19:00",s:"Daily"},
{id:31,en:"Loggerhead Bar",uk:"Loggerhead Bar",v:"Loggerhead",c:"nightlife",g:["solo","duo","party"],t:"passive",p:200,tm:"18:00",s:"Daily"},
{id:32,en:"Karaoke Night",uk:"Караоке",v:"Caribbean Club",c:"nightlife",g:["duo","party"],t:"active",p:400,tm:"21:00",s:"Weekends"},
{id:33,en:"D.Fleur Club",uk:"D.Fleur клуб",v:"D.Fleur",c:"nightlife",g:["duo","party"],t:"active",p:300,tm:"22:00",s:"Fri-Sat"},
{id:34,en:"Shooters",uk:"Shooters",v:"Shooters",c:"nightlife",g:["solo","duo","party"],t:"active",p:150,tm:"20:00",s:"Daily"},
{id:35,en:"Varvar Craft Beer",uk:"Varvar пиво",v:"Varvar Bar",c:"nightlife",g:["solo","duo","party"],t:"passive",p:150,tm:"17:00",s:"Daily"},
{id:36,en:"Alchemist Cocktails",uk:"Alchemist коктейлі",v:"Alchemist",c:"nightlife",g:["solo","duo"],t:"passive",p:300,tm:"19:00",s:"Daily"},
{id:37,en:"Hangover 90s",uk:"Hangover 90-ті",v:"Hangover",c:"nightlife",g:["duo","party"],t:"active",p:200,tm:"22:00",s:"Fri-Sat"},
{id:38,en:"Heaven Club",uk:"Heaven Club",v:"Heaven Club",c:"nightlife",g:["duo","party"],t:"active",p:350,tm:"22:00",s:"Fri-Sat"},
{id:39,en:"Wine Tasting",uk:"Дегустація вин",v:"Good Wine",c:"food",g:["solo","duo","party"],t:"passive",p:850,tm:"19:00",s:"Weekly"},
{id:40,en:"Street Food VDNG",uk:"Їжа ВДНГ",v:"VDNG",c:"food",g:["solo","duo","party"],t:"passive",p:0,tm:"18:00",s:"Weekends"},
{id:41,en:"Cocktail Masterclass",uk:"Коктейль клас",v:"Parovoz",c:"food",g:["duo","party"],t:"active",p:750,tm:"20:00",s:"Reservation"},
{id:42,en:"Food Tour Podil",uk:"Гастро-тур Поділ",v:"Podil",c:"food",g:["solo","duo","party"],t:"active",p:600,tm:"17:00",s:"Daily"},
{id:43,en:"Ukrainian Dinner",uk:"Вечеря українська",v:"Kanapa",c:"food",g:["duo","party"],t:"passive",p:1200,tm:"19:00",s:"Daily"},
{id:44,en:"Craft Beer Tour",uk:"Крафт пиво тур",v:"Breweries",c:"food",g:["solo","duo","party"],t:"active",p:500,tm:"18:00",s:"Weekends"},
{id:45,en:"Coffee Tour",uk:"Кава тур",v:"Coffeehouses",c:"food",g:["solo","duo"],t:"passive",p:350,tm:"14:00",s:"Daily"},
{id:46,en:"Borscht Class",uk:"Борщ клас",v:"Cooking Academy",c:"food",g:["duo","party"],t:"active",p:900,tm:"16:00",s:"Reservation"},
{id:47,en:"Wine Bar",uk:"Good Wine бар",v:"Good Wine",c:"food",g:["solo","duo"],t:"passive",p:400,tm:"18:00",s:"Daily"},
{id:48,en:"Climbing SPACE",uk:"Climbing SPACE",v:"Climbing SPACE",c:"sports",g:["solo","duo","party"],t:"active",p:350,tm:"12-22",s:"Daily"},
{id:49,en:"Hyperion Climbing",uk:"Hyperion",v:"Hyperion",c:"sports",g:["solo","duo","party"],t:"active",p:300,tm:"10-22",s:"Daily"},
{id:50,en:"Tsekh Bouldering",uk:"Tsekh",v:"Tsekh Climbing",c:"sports",g:["solo","duo"],t:"active",p:280,tm:"11-22",s:"Daily"},
{id:51,en:"Climbing Up!",uk:"Climbing Up!",v:"Climbing Up!",c:"sports",g:["solo","duo"],t:"active",p:250,tm:"15-21",s:"Daily"},
{id:52,en:"PIK Climbing",uk:"ПІК",v:"PIK Dream Town",c:"sports",g:["solo","duo","party"],t:"active",p:300,tm:"10-21",s:"Daily"},
{id:53,en:"Gulliver Bowling",uk:"Боулінг Gulliver",v:"Gulliver",c:"sports",g:["duo","party"],t:"active",p:280,tm:"12-22",s:"Daily"},
{id:54,en:"Brooklyn Bowling",uk:"Боулінг Brooklyn",v:"Brooklyn Dream",c:"sports",g:["duo","party"],t:"active",p:320,tm:"12-22",s:"Daily"},
{id:55,en:"Astro Bowling",uk:"Астро Боулінг",v:"Astro Cosmo",c:"sports",g:["duo","party"],t:"active",p:300,tm:"10-22",s:"Daily"},
{id:56,en:"SkyMall Karting",uk:"SkyMall Картинг",v:"SkyMall Karting",c:"sports",g:["duo","party"],t:"active",p:400,tm:"12-21",s:"Daily"},
{id:57,en:"Ingul Kart",uk:"Ingul Kart",v:"Ingul Kart",c:"sports",g:["duo","party"],t:"active",p:450,tm:"12-22",s:"Daily"},
{id:58,en:"Blockbuster Karting",uk:"Картинг Blockbuster",v:"Blockbuster",c:"sports",g:["duo","party"],t:"active",p:350,tm:"13-21",s:"Daily"},
{id:59,en:"Trampoline Mega City",uk:"Батути Mega City",v:"Jumping Hall",c:"sports",g:["solo","duo","party"],t:"active",p:250,tm:"10-20",s:"Daily"},
{id:60,en:"X-Park Trampolines",uk:"X-Park батути",v:"X-Park",c:"sports",g:["solo","duo","party"],t:"active",p:250,tm:"14:00",s:"Daily"},
{id:61,en:"Paintball Avaks",uk:"Пейнтбол Avaks",v:"Avaks Hydropark",c:"sports",g:["party"],t:"active",p:400,tm:"09-23",s:"Daily"},
{id:62,en:"Paintball Warriors",uk:"Пейнтбол Warriors",v:"Warriors",c:"sports",g:["party"],t:"active",p:350,tm:"24/7",s:"Daily"},
{id:63,en:"Paintball Planeta",uk:"Пейнтбол Planeta",v:"Planeta",c:"sports",g:["party"],t:"active",p:300,tm:"10-19",s:"Daily"},
{id:64,en:"CQB Airsoft",uk:"CQB Airsoft",v:"CQB Field",c:"sports",g:["party"],t:"active",p:350,tm:"09-20",s:"Daily"},
{id:65,en:"CSA Shooting",uk:"CSA Тир",v:"CSA Range",c:"sports",g:["solo","duo","party"],t:"active",p:500,tm:"09-21",s:"Daily"},
{id:66,en:"Kyiv Shooting Club",uk:"Shooting Club",v:"Kyiv Shooting",c:"sports",g:["solo","duo","party"],t:"active",p:600,tm:"09-20",s:"Daily"},
{id:67,en:"Tennis Podil",uk:"Теніс Поділ",v:"Korty Podil",c:"sports",g:["duo"],t:"active",p:350,tm:"07-20",s:"Daily"},
{id:68,en:"Tenisna Arena",uk:"Тенісна Арена",v:"Tenisna Arena",c:"sports",g:["duo"],t:"active",p:400,tm:"08-21",s:"Daily"},
{id:69,en:"Tennis Park Padel",uk:"Tennis Park 2.0",v:"Tennis Park",c:"sports",g:["duo","party"],t:"active",p:500,tm:"07-22",s:"Daily"},
{id:70,en:"A7 Padel",uk:"A7 Padel",v:"A7 Padel",c:"sports",g:["duo","party"],t:"active",p:600,tm:"07-23",s:"Daily"},
{id:71,en:"Dream Padel",uk:"Dream Padel",v:"Dream Padel",c:"sports",g:["duo","party"],t:"active",p:550,tm:"08-22",s:"Daily"},
{id:72,en:"Svoi Basketball",uk:"Svoi баскетбол",v:"Svoi Arena",c:"sports",g:["party"],t:"active",p:400,tm:"06-23",s:"Daily"},
{id:73,en:"Football Meridian",uk:"Футбол Меридіан",v:"FC Meridian",c:"sports",g:["party"],t:"active",p:500,tm:"24/7",s:"Daily"},
{id:74,en:"REJO Football",uk:"REJO Футбол",v:"REJO-Polit",c:"sports",g:["party"],t:"active",p:450,tm:"06:30-00:30",s:"Daily"},
{id:75,en:"KYI Pool Hall",uk:"KYI Більярд",v:"KYI Pool",c:"sports",g:["duo","party"],t:"passive",p:250,tm:"16-23",s:"Daily"},
{id:76,en:"Platon Billiards",uk:"Platon Більярд",v:"Platon",c:"sports",g:["duo","party"],t:"passive",p:300,tm:"09:30-23",s:"Daily"},
{id:77,en:"Turboxspot Skatepark",uk:"Turboxspot скейт",v:"Turboxspot",c:"sports",g:["solo","duo"],t:"active",p:200,tm:"10-22",s:"Daily"},
{id:78,en:"Urban Park Skate",uk:"Urban Park скейт",v:"Urban Park",c:"sports",g:["solo","duo"],t:"active",p:0,tm:"24/7",s:"Daily"},
{id:79,en:"Basketball Courts",uk:"Баскетбол",v:"Various Parks",c:"sports",g:["solo","duo","party"],t:"active",p:0,tm:"Daylight",s:"Daily"},
{id:80,en:"Football Pickup",uk:"Футбол збірні",v:"Various Fields",c:"sports",g:["party"],t:"active",p:0,tm:"Daylight",s:"Daily"},
{id:81,en:"Running Trukhaniv",uk:"Біг Труханів",v:"Trukhaniv Island",c:"sports",g:["solo","duo"],t:"active",p:0,tm:"Daylight",s:"Daily"},
{id:82,en:"Cycling Kyiv",uk:"Велосипед Київ",v:"Bike Paths",c:"sports",g:["solo","duo"],t:"active",p:100,tm:"Daylight",s:"Daily"},
{id:83,en:"Table Tennis",uk:"Настільний теніс",v:"Various Parks",c:"sports",g:["duo"],t:"active",p:0,tm:"Daylight",s:"Daily"},
{id:84,en:"Badminton",uk:"Бадмінтон",v:"Various Centers",c:"sports",g:["duo"],t:"active",p:300,tm:"09-21",s:"Daily"},
{id:85,en:"Swimming Pool",uk:"Басейн",v:"Various Pools",c:"sports",g:["solo"],t:"active",p:200,tm:"07-21",s:"Daily"},
{id:86,en:"Evening Yoga",uk:"Вечірня йога",v:"Various Studios",c:"wellness",g:["solo"],t:"active",p:250,tm:"19:30",s:"Daily"},
{id:87,en:"Hammam Bath",uk:"Хамам",v:"Various Spas",c:"wellness",g:["solo","duo"],t:"passive",p:800,tm:"10-22",s:"Daily"},
{id:88,en:"Thai Massage",uk:"Тайський масаж",v:"Amari Thai",c:"wellness",g:["solo","duo"],t:"passive",p:1000,tm:"10-21",s:"Daily"},
{id:89,en:"Salt Cave",uk:"Соляна печера",v:"Salt Caves",c:"wellness",g:["solo","duo"],t:"passive",p:300,tm:"10-20",s:"Daily"},
{id:90,en:"Pilates",uk:"Пілатес",v:"Various Studios",c:"wellness",g:["solo","duo"],t:"active",p:300,tm:"18:00",s:"Daily"},
{id:91,en:"Planeta Kino IMAX",uk:"Planeta Kino IMAX",v:"Planeta Blockbuster",c:"cinema",g:["solo","duo","party"],t:"passive",p:220,tm:"Multiple",s:"Daily"},
{id:92,en:"Planeta Kino 4DX",uk:"Planeta Kino 4DX",v:"Planeta Blockbuster",c:"cinema",g:["solo","duo","party"],t:"passive",p:320,tm:"Multiple",s:"Daily"},
{id:93,en:"Planeta River Mall",uk:"Planeta River Mall",v:"Planeta River Mall",c:"cinema",g:["solo","duo","party"],t:"passive",p:200,tm:"Multiple",s:"Daily"},
{id:94,en:"Zhovten Cinema",uk:"Жовтень кіно",v:"Zhovten",c:"cinema",g:["solo","duo"],t:"passive",p:110,tm:"Multiple",s:"Daily"},
{id:95,en:"Multiplex Cinema",uk:"Мультиплекс",v:"Multiplex",c:"cinema",g:["solo","duo","party"],t:"passive",p:180,tm:"Multiple",s:"Daily"},
{id:96,en:"Premiere Na Draivi",uk:"Прем'єра На драйві",v:"Nat. Palace Arts",c:"cinema",g:["solo","duo","party"],t:"passive",p:400,tm:"18:00",s:"Apr 2"},
{id:97,en:"Wizoria Cinema",uk:"Wizoria",v:"Wizoria",c:"cinema",g:["solo","duo","party"],t:"passive",p:160,tm:"Multiple",s:"Daily"},
{id:98,en:"KADRooM Escape",uk:"KADRooM квести",v:"KADRooM",c:"entertainment",g:["duo","party"],t:"active",p:500,tm:"12-20",s:"Daily"},
{id:99,en:"Quest Podil",uk:"Квест Поділ",v:"Quest Podil",c:"entertainment",g:["duo","party"],t:"active",p:450,tm:"10-21:30",s:"Daily"},
{id:100,en:"Insomnia Horror",uk:"Insomnia жахи",v:"Insomnia",c:"entertainment",g:["duo","party"],t:"active",p:400,tm:"12-22",s:"Daily"},
{id:101,en:"Escape Quest",uk:"Escape Quest",v:"Escape Quest",c:"entertainment",g:["duo","party"],t:"active",p:450,tm:"11-23",s:"Daily"},
{id:102,en:"i-LABYRINTH",uk:"i-LABYRINTH",v:"i-LABYRINTH",c:"entertainment",g:["duo","party"],t:"active",p:400,tm:"10-20",s:"Daily"},
{id:103,en:"VIAR VR",uk:"VIAR VR",v:"VIAR Cosmo",c:"entertainment",g:["solo","duo","party"],t:"active",p:400,tm:"12-21",s:"Daily"},
{id:104,en:"VR Motion",uk:"VR Motion",v:"VR Motion",c:"entertainment",g:["solo","duo","party"],t:"active",p:350,tm:"13:30-21:30",s:"Daily"},
{id:105,en:"VRtuality Park",uk:"VRtuality",v:"VRtuality",c:"entertainment",g:["solo","duo","party"],t:"active",p:300,tm:"10-21",s:"Daily"},
{id:106,en:"Laser 1st Legion",uk:"Лазертаг 1st Legion",v:"1st Legion Dream",c:"entertainment",g:["party"],t:"active",p:300,tm:"10-21",s:"Daily"},
{id:107,en:"Laser Central",uk:"Лазертаг центр",v:"1st Legion Olymp",c:"entertainment",g:["party"],t:"active",p:300,tm:"12-20",s:"Daily"},
{id:108,en:"Laser G-75",uk:"Лазертаг G-75",v:"G-75",c:"entertainment",g:["party"],t:"active",p:280,tm:"10-21",s:"Daily"},
{id:109,en:"Galaxy Family Park",uk:"Galaxy Park",v:"Galaxy Lavina",c:"entertainment",g:["duo","party"],t:"active",p:250,tm:"10-22",s:"Daily"},
{id:110,en:"Neopolis Center",uk:"Neopolis",v:"Neopolis",c:"entertainment",g:["duo","party"],t:"active",p:300,tm:"12-22",s:"Daily"},
{id:111,en:"Board Games Café",uk:"Настільні ігри",v:"Igroteka",c:"entertainment",g:["duo","party"],t:"passive",p:150,tm:"17:00",s:"Daily"},
{id:112,en:"Sky Family Park",uk:"Sky Family",v:"Sky Family SkyMall",c:"entertainment",g:["duo","party"],t:"active",p:300,tm:"10-20",s:"Daily"},
{id:113,en:"Date Night",uk:"Романтична пригода",v:"Downtown Kyiv",c:"entertainment",g:["duo"],t:"active",p:600,tm:"18:00",s:"Weekends"},
{id:114,en:"Mini Golf",uk:"Міні-гольф",v:"Various",c:"entertainment",g:["duo","party"],t:"active",p:200,tm:"12-20",s:"Daily"},
{id:115,en:"Blockbuster Fun",uk:"Blockbuster розваги",v:"Blockbuster",c:"entertainment",g:["solo","duo","party"],t:"active",p:300,tm:"10-22",s:"Daily"},
{id:116,en:"Wind Tunnel",uk:"Аеротруба Ulet",v:"Ulet.pro",c:"entertainment",g:["solo","duo","party"],t:"active",p:600,tm:"10-21",s:"Daily"},
{id:117,en:"Kidlandia",uk:"Kidlandia",v:"Kidlandia",c:"entertainment",g:["party"],t:"active",p:350,tm:"10-20",s:"Daily"}
,

{id:118,en:"Classic Borscht",uk:"Класичний борщ",v:"Home Kitchen",c:"cooking",g:["duo"],t:"passive",p:250,tm:"90 min",s:"Daily"},
{id:119,en:"Varenyky (Pierogies)",uk:"Вареники з картоплею",v:"Home Kitchen",c:"cooking",g:["duo"],t:"passive",p:200,tm:"75 min",s:"Daily"},
{id:120,en:"Chicken Kyiv",uk:"Котлета по-київськи",v:"Home Kitchen",c:"cooking",g:["duo"],t:"passive",p:350,tm:"60 min",s:"Daily"},
{id:121,en:"Holubtsi (Cabbage Rolls)",uk:"Голубці",v:"Home Kitchen",c:"cooking",g:["duo"],t:"passive",p:300,tm:"120 min",s:"Daily"},
{id:122,en:"Syrnyky (Cheese Pancakes)",uk:"Сирники",v:"Home Kitchen",c:"cooking",g:["solo","duo"],t:"passive",p:150,tm:"30 min",s:"Daily"},
{id:123,en:"Deruny (Potato Pancakes)",uk:"Деруни",v:"Home Kitchen",c:"cooking",g:["solo","duo"],t:"passive",p:100,tm:"40 min",s:"Daily"},
{id:124,en:"Banosh (Cornmeal Dish)",uk:"Банош",v:"Home Kitchen",c:"cooking",g:["duo"],t:"passive",p:200,tm:"45 min",s:"Daily"},
{id:125,en:"Pampushky (Garlic Rolls)",uk:"Пампушки з часником",v:"Home Kitchen",c:"cooking",g:["duo"],t:"passive",p:150,tm:"120 min",s:"Daily"}
];

/* -- RECIPE DETAILS (keyed by activity id) -- */
const RD={
118:{diff:"medium",ingEn:["Beetroot 3","Cabbage 1/4","Potatoes 3","Carrots 2","Onion 1","Tomato paste 2 tbsp","Garlic 4 cloves","Beef broth 2L","Pork ribs 500g","Sour cream","Fresh dill","Bay leaves"],ingUk:["Буряк 3","Капуста 1/4","Картопля 3","Морква 2","Цибуля 1","Томатна паста 2 ст.л.","Часник 4","Бульйон 2л","Ребра 500г","Сметана","Кріп","Лаврівка"],stepsEn:["Boil ribs 1 hour, skim foam","Grate beet & carrot, dice rest","Sauté onion, carrot, add paste","Add beet with vinegar 10 min","Add potatoes 10 min","Add vegetables & cabbage 15 min","Season, add garlic & dill","Serve with sour cream"],stepsUk:["Варіть ребра 1 год","Натріть буряк, моркву","Обсмажте цибулю, додайте пасту","Додайте буряк з оцтом 10 хв","Картопля 10 хв","Овочі та капуста 15 хв","Часник, кріп, спеції","Подавайте зі сметаною"],equipEn:["Large pot 5L+","Frying pan","Grater","Knife & board"],equipUk:["Каструля 5л+","Сковорода","Тертка","Ніж та дошка"]},
119:{diff:"medium",ingEn:["Flour 400g","Eggs 2","Water 150ml","Potatoes 6","Onion 2","Butter 50g","Sour cream","Salt"],ingUk:["Борошно 400г","Яйця 2","Вода 150мл","Картопля 6","Цибуля 2","Масло 50г","Сметана","Сіль"],stepsEn:["Mix dough, rest 30 min","Boil & mash potatoes","Fry onion golden","Mix onion into filling","Roll thin, cut circles","Fill, fold & seal","Boil until float + 2 min","Serve with sour cream"],stepsUk:["Замісіть тісто, 30 хв","Зваріть картоплю","Обсмажте цибулю","Змішайте з начинкою","Розкачайте, виріжте","Зліпіть вареники","Варіть поки спливуть + 2 хв","Подавайте зі сметаною"],equipEn:["Rolling pin","Large pot","Bowls","Potato masher"],equipUk:["Качалка","Каструля","Миски","Товкачка"]},
120:{diff:"hard",ingEn:["Chicken breast 2","Butter 100g cold","Dill & parsley","Garlic 3","Flour 100g","Eggs 3","Breadcrumbs 200g","Oil for frying"],ingUk:["Куряче філе 2","Масло 100г","Кріп та петрушка","Часник 3","Борошно 100г","Яйця 3","Сухарі 200г","Олія"],stepsEn:["Mix butter+herbs+garlic, freeze 30min","Butterfly & pound chicken thin","Roll butter inside chicken","Coat: flour→eggs→crumbs x2","Deep fry 170°C 8-10 min","Rest 3 min, serve"],stepsUk:["Масло+зелень+часник, заморозити 30хв","Розріжте та відбийте філе","Загорніть масло","Борошно→яйця→сухарі x2","Смажте 170°C 8-10 хв","3 хв відпочинку, подавайте"],equipEn:["Deep pan","Meat mallet","3 bowls","Thermometer"],equipUk:["Глибока сковорода","Молоток","3 миски","Термометр"]},
121:{diff:"medium",ingEn:["Cabbage 1 head","Ground meat 500g","Rice 150g","Onion 2","Carrots 2","Tomato sauce 400ml","Sour cream 200ml","Garlic, dill"],ingUk:["Капуста 1","Фарш 500г","Рис 150г","Цибуля 2","Морква 2","Томатний соус 400мл","Сметана 200мл","Часник, кріп"],stepsEn:["Blanch cabbage, peel leaves","Half-cook rice, sauté vegs","Mix meat, rice, vegs","Roll in cabbage leaves","Sauce: tomato+sour cream","Layer in pot, pour sauce","Simmer 1.5 hours","Serve with cream"],stepsUk:["Бланшуйте капусту","Рис + засмажка","Змішайте фарш, рис, овочі","Загорніть в листя","Соус: томат+сметана","В каструлю, залийте","Тушкуйте 1.5 год","Подавайте зі сметаною"],equipEn:["Large pot","Dutch oven","Bowl","Pan"],equipUk:["Велика каструля","Каструля з кришкою","Миска","Сковорода"]},
122:{diff:"easy",ingEn:["Cottage cheese 500g","Egg 1","Sugar 3 tbsp","Flour 3 tbsp","Vanilla","Butter","Sour cream & jam"],ingUk:["Сир 500г","Яйце 1","Цукор 3 ст.л.","Борошно 3 ст.л.","Ваніль","Масло","Сметана та варення"],stepsEn:["Mix cheese, egg, sugar, vanilla","Add flour until holds shape","Form patties, dust flour","Fry in butter 3-4 min/side","Serve with cream & jam"],stepsUk:["Змішайте сир, яйце, цукор","Додайте борошно","Сформуйте, обваляйте","Смажте 3-4 хв/бік","Подавайте зі сметаною"],equipEn:["Non-stick pan","Bowl","Spatula"],equipUk:["Сковорода","Миска","Лопатка"]},
123:{diff:"easy",ingEn:["Potatoes 6","Onion 1","Eggs 2","Flour 3 tbsp","Salt","Oil","Sour cream"],ingUk:["Картопля 6","Цибуля 1","Яйця 2","Борошно 3 ст.л.","Сіль","Олія","Сметана"],stepsEn:["Grate potatoes & onion, squeeze","Mix with eggs, flour, salt","Heat oil","Fry 3-4 min each side","Serve hot with cream"],stepsUk:["Натріть, віджміть","Змішайте з яйцями, борошном","Розігрійте олію","Смажте 3-4 хв/бік","Подавайте гарячими"],equipEn:["Grater","Large pan","Bowl"],equipUk:["Тертка","Сковорода","Миска"]},
124:{diff:"easy",ingEn:["Cornmeal 200g","Sour cream 400ml","Water 200ml","Bryndza 150g","Smoked bacon 200g","Butter 30g"],ingUk:["Крупа 200г","Сметана 400мл","Вода 200мл","Бринза 150г","Бекон 200г","Масло 30г"],stepsEn:["Simmer cream + water","Add cornmeal slowly, stir","Cook 20-25 min low heat","Fry bacon crispy","Top with bryndza & bacon"],stepsUk:["Сметана + вода закипіть","Всипте крупу, мішайте","20-25 хв на малому","Обсмажте бекон","Бринза та бекон зверху"],equipEn:["Heavy pot","Wooden spoon","Pan"],equipUk:["Каструля","Ложка","Сковорода"]},
125:{diff:"medium",ingEn:["Flour 500g","Warm milk 250ml","Yeast 7g","Sugar 2 tbsp","Egg 1","Butter 50g","Garlic 6","Dill","Oil"],ingUk:["Борошно 500г","Молоко 250мл","Дріжджі 7г","Цукор 2 ст.л.","Яйце 1","Масло 50г","Часник 6","Кріп","Олія"],stepsEn:["Mix milk+yeast+sugar, wait 10min","Add flour, egg, butter, knead","Rise 1 hour","Form rolls close together","Rise 20 min, bake 180°C 25min","Coat with garlic-dill oil"],stepsUk:["Молоко+дріжджі+цукор, 10 хв","Борошно, яйце, масло","Підхід 1 година","Сформуйте булочки","20 хв + 180°C 25 хв","Часникова олія зверху"],equipEn:["Baking tray","Bowl","Oven","Mortar"],equipUk:["Деко","Миска","Духовка","Ступка"]}
};

const deliveryLinks=[
{name:"Glovo",icon:"🟡",color:"#F9C50B",url:"https://glovoapp.com/ua/en/kyiv-right-bank/store/"},
{name:"Silpo",icon:"🔵",color:"#2196F3",url:"https://shop.silpo.ua/"},
{name:"Zakaz.ua",icon:"🟢",color:"#4CAF50",url:"https://zakaz.ua/uk/"},
{name:"Bolt Food",icon:"🟩",color:"#34D186",url:"https://food.bolt.eu/en-US/"}
];

/* -- UI COMPONENTS -- */
const Chip=({label,active,onClick,color})=><button onClick={onClick} style={{background:active?(color?`${color}22`:"rgba(162,89,255,0.2)"):"rgba(255,255,255,0.05)",border:active?`1px solid ${color||"rgba(162,89,255,0.4)"}`:"1px solid rgba(255,255,255,0.07)",borderRadius:20,padding:"7px 16px",color:active?(color||"#c9a0ff"):"#8b86a3",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",whiteSpace:"nowrap"}}>{label}</button>;
const Badge=({children,bg})=><span style={{background:bg||"rgba(162,89,255,0.85)",borderRadius:7,padding:"3px 9px",fontSize:11,fontWeight:700,color:"#fff"}}>{children}</span>;

function Card({a,lang,t,onClick}){const ci=imgs[a.c]||imgs.entertainment;const img=ci[a.id%ci.length];
return(<div onClick={onClick} style={{borderRadius:16,overflow:"hidden",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.06)",cursor:"pointer",transition:"transform 0.2s"}} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.01)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}><div style={{position:"relative"}}><img src={img} alt="" style={{width:"100%",height:160,objectFit:"cover",display:"block"}}/><div style={{position:"absolute",top:10,left:10,display:"flex",gap:6,flexWrap:"wrap"}}><Badge>{a.tm}</Badge><Badge bg={CC[a.c]+"cc"}>{IC[a.c]} {t.cats[a.c]}</Badge></div><div style={{position:"absolute",bottom:0,left:0,right:0,background:"linear-gradient(transparent,rgba(0,0,0,0.65))",padding:"28px 14px 10px",display:"flex",gap:8,alignItems:"center"}}>{a.p>0?<Badge bg="rgba(62,207,142,0.8)">{t.from} {a.p} ₴</Badge>:<Badge bg="rgba(62,207,142,0.8)">{t.free}</Badge>}</div></div><div style={{padding:"12px 14px"}}><div style={{fontSize:15,fontWeight:700,color:"#fff",marginBottom:4}}>{a[lang]}</div><div style={{fontSize:12,color:"#8b86a3"}}>📍 {a.v} · {a.s}</div>{a.c==="cooking"&&<div style={{marginTop:6,fontSize:11,color:"#ff8a50",fontWeight:600}}>{lang==="en"?"Tap for recipe & delivery →":"Натисніть для рецепту та доставки →"}</div>}</div></div>);}

/* -- RECIPE DETAIL PANEL -- */
function RecipeDetail({a,lang,t,onBack}){
  const r=RD[a.id];if(!r)return null;
  const c=t.cook;const dc={easy:"#3ecf8e",medium:"#f7b731",hard:"#ff6b6b"};
  return(<div>
    <button onClick={onBack} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:10,padding:"6px 14px",color:"#8b86a3",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",marginBottom:16}}>← {t.backBtn}</button>
    <img src={(imgs.cooking||[""])[0]} alt="" style={{width:"100%",height:180,objectFit:"cover",borderRadius:18,marginBottom:16}}/>
    <h2 style={{fontFamily:"'Outfit',sans-serif",fontSize:22,fontWeight:800,color:"#fff",margin:"0 0 8px"}}>{a[lang]}</h2>
    <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}><Badge bg="rgba(162,89,255,0.4)">⏱ {a.tm}</Badge><Badge bg="rgba(62,207,142,0.4)">👥 {a.g.length>1?a.g.join("/"):a.g[0]}</Badge><Badge bg={dc[r.diff]+"66"}>{c[r.diff]}</Badge></div>

    <div style={{background:"rgba(255,135,80,0.06)",border:"1px solid rgba(255,135,80,0.15)",borderRadius:16,padding:"16px",marginBottom:14}}>
      <h3 style={{fontSize:14,fontWeight:700,color:"#ff8a50",margin:"0 0 10px"}}>🥕 {c.ingredients}</h3>
      {(lang==="en"?r.ingEn:r.ingUk).map((ing,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"4px 0"}}><span style={{width:5,height:5,borderRadius:"50%",background:"#ff8a50",flexShrink:0}}/><span style={{fontSize:13,color:"#dddaf0"}}>{ing}</span></div>))}
    </div>

    <div style={{background:"rgba(162,89,255,0.06)",border:"1px solid rgba(162,89,255,0.15)",borderRadius:16,padding:"16px",marginBottom:14}}>
      <h3 style={{fontSize:14,fontWeight:700,color:"#a259ff",margin:"0 0 10px"}}>🔧 {c.equipment}</h3>
      {(lang==="en"?r.equipEn:r.equipUk).map((eq,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"3px 0"}}><span style={{fontSize:11}}>✓</span><span style={{fontSize:13,color:"#dddaf0"}}>{eq}</span></div>))}
    </div>

    <div style={{background:"rgba(62,207,142,0.06)",border:"1px solid rgba(62,207,142,0.15)",borderRadius:16,padding:"16px",marginBottom:14}}>
      <h3 style={{fontSize:14,fontWeight:700,color:"#3ecf8e",margin:"0 0 10px"}}>👨‍🍳 {c.steps}</h3>
      {(lang==="en"?r.stepsEn:r.stepsUk).map((st,i)=>(<div key={i} style={{display:"flex",gap:10,padding:"7px 0",borderBottom:i<r.stepsEn.length-1?"1px solid rgba(255,255,255,0.04)":"none"}}><span style={{width:22,height:22,borderRadius:"50%",background:"rgba(62,207,142,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#3ecf8e",flexShrink:0}}>{i+1}</span><span style={{fontSize:13,color:"#dddaf0",lineHeight:1.5}}>{st}</span></div>))}
    </div>

    <div style={{background:"rgba(247,183,49,0.06)",border:"1px solid rgba(247,183,49,0.15)",borderRadius:16,padding:"16px",marginBottom:32}}>
      <h3 style={{fontSize:14,fontWeight:700,color:"#f7b731",margin:"0 0 10px"}}>🛒 {c.orderVia}</h3>
      {deliveryLinks.map(dl=>(<a key={dl.name} href={dl.url} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,0.04)",textDecoration:"none"}}><span style={{fontSize:20}}>{dl.icon}</span><span style={{fontSize:13,fontWeight:600,color:"#fff",flex:1}}>{dl.name}</span><span style={{background:dl.color,borderRadius:8,padding:"5px 12px",fontSize:11,fontWeight:700,color:"#fff"}}>{lang==="en"?"Order":"Замовити"} →</span></a>))}
    </div>
  </div>);
}

/* -- HOME PAGE -- */
function HomePage({t,lang,mounted}){
  const[step,setStep]=useState(0);const[grp,setGrp]=useState(null);const[tempo,setTempo]=useState(null);const[cat,setCat]=useState(null);const[selRecipe,setSelRecipe]=useState(null);
  const reset=()=>{setStep(0);setGrp(null);setTempo(null);setCat(null);setSelRecipe(null)};
  const back=()=>{if(selRecipe){setSelRecipe(null)}else if(step===4){setCat(null);setStep(3)}else if(step===3){setTempo(null);setStep(2)}else if(step===2){setGrp(null);setStep(1)}else setStep(0)};
  const avCats=useMemo(()=>{let f=A;if(grp)f=f.filter(a=>a.g.includes(grp));if(tempo)f=f.filter(a=>a.t===tempo);return[...new Set(f.map(a=>a.c))]},[grp,tempo]);
  const results=useMemo(()=>{let f=A;if(grp)f=f.filter(a=>a.g.includes(grp));if(tempo)f=f.filter(a=>a.t===tempo);if(cat)f=f.filter(a=>a.c===cat);return f},[grp,tempo,cat]);

  if(selRecipe)return(<div style={{padding:"0 20px"}}><RecipeDetail a={selRecipe} lang={lang} t={t} onBack={()=>setSelRecipe(null)}/></div>);

  return(<div style={{padding:"0 20px",minHeight:"calc(100vh - 150px)"}}>
    {step>0&&<div style={{marginBottom:20}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><button onClick={back} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:10,padding:"6px 14px",color:"#8b86a3",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>← {t.backBtn}</button>{step>1&&<button onClick={reset} style={{background:"none",border:"none",color:"#6b6782",fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",textDecoration:"underline"}}>{t.resetBtn}</button>}</div><div style={{height:3,background:"rgba(255,255,255,0.06)",borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:`${(step/4)*100}%`,background:"linear-gradient(90deg,#a259ff,#6c3ecf)",borderRadius:3,transition:"width 0.4s"}}/></div></div>}

    {step===0&&<div style={{opacity:mounted?1:0,transform:mounted?"translateY(0)":"translateY(20px)",transition:"all 0.7s"}}><p style={{fontSize:14,color:"#8b86a3",margin:"14px 0 4px"}}>{t.greeting()}</p><h1 style={{fontFamily:"'Outfit',sans-serif",fontSize:32,fontWeight:800,margin:"0 0 10px",color:"#fff",letterSpacing:-1,lineHeight:1.15,whiteSpace:"pre-line"}}>{t.heroTitle}</h1><p style={{fontSize:14,color:"#6b6782",margin:"0 0 36px"}}>{t.heroSub}</p><button onClick={()=>setStep(1)} style={{width:"100%",padding:"18px",borderRadius:16,background:"linear-gradient(135deg,#a259ff,#7c3aed)",border:"none",color:"#fff",fontSize:16,fontWeight:700,fontFamily:"'Outfit',sans-serif",cursor:"pointer",boxShadow:"0 8px 32px rgba(162,89,255,0.3)"}}>{lang==="en"?"Let's find something →":"Знайдемо щось →"}</button></div>}

    {step===1&&<div><h2 style={{fontFamily:"'Outfit',sans-serif",fontSize:24,fontWeight:800,color:"#fff",margin:"4px 0 20px"}}>{t.step1Title}</h2><div style={{display:"flex",flexDirection:"column",gap:12}}>{[{k:"solo",ic:"👤",l:t.solo,d:t.soloDesc,gr:"linear-gradient(135deg,#6c3ecf22,#a259ff11)"},{k:"duo",ic:"👥",l:t.duo,d:t.duoDesc,gr:"linear-gradient(135deg,#ff6bca22,#ff6b6b11)"},{k:"party",ic:"🎉",l:t.party,d:t.partyDesc,gr:"linear-gradient(135deg,#f7b73122,#ff9f4311)"}].map(g=>{const cnt=A.filter(a=>a.g.includes(g.k)).length;return (<button key={g.k} onClick={()=>{setGrp(g.k);setStep(2)}} style={{background:g.gr,border:"1px solid rgba(255,255,255,0.08)",borderRadius:18,padding:"22px 20px",display:"flex",alignItems:"center",gap:16,cursor:"pointer",textAlign:"left",width:"100%"}}><span style={{fontSize:36}}>{g.ic}</span><div style={{flex:1}}><div style={{fontFamily:"'Outfit',sans-serif",fontSize:18,fontWeight:700,color:"#fff"}}>{g.l}</div><div style={{fontSize:13,color:"#8b86a3"}}>{g.d}</div></div><div style={{fontSize:18,fontWeight:800,color:"#a259ff"}}>{cnt}</div><span style={{color:"#6b6782",fontSize:18}}>→</span></button>)})}</div></div>}

    {step===2&&<div><h2 style={{fontFamily:"'Outfit',sans-serif",fontSize:24,fontWeight:800,color:"#fff",margin:"4px 0 20px"}}>{t.step2Title}</h2><div style={{display:"flex",gap:14}}>{[{k:"active",ic:"🏃",l:t.active,d:t.activeDesc,gr:"linear-gradient(135deg,#4fc3f722,#3ecf8e11)"},{k:"passive",ic:"🛋️",l:t.passive,d:t.passiveDesc,gr:"linear-gradient(135deg,#a259ff22,#6c3ecf11)"}].map(o=>{const cnt=A.filter(a=>a.g.includes(grp)&&a.t===o.k).length;return (<button key={o.k} onClick={()=>{setTempo(o.k);setStep(3)}} style={{flex:1,background:o.gr,border:"1px solid rgba(255,255,255,0.08)",borderRadius:20,padding:"32px 16px",display:"flex",flexDirection:"column",alignItems:"center",gap:10,cursor:"pointer"}}><span style={{fontSize:44}}>{o.ic}</span><div style={{fontFamily:"'Outfit',sans-serif",fontSize:18,fontWeight:700,color:"#fff"}}>{o.l}</div><div style={{fontSize:12,color:"#8b86a3"}}>{o.d}</div><div style={{marginTop:6,background:"rgba(162,89,255,0.15)",borderRadius:10,padding:"4px 12px",fontSize:12,fontWeight:700,color:"#c9a0ff"}}>{cnt}</div></button>)})}</div></div>}

    {step===3&&<div><h2 style={{fontFamily:"'Outfit',sans-serif",fontSize:24,fontWeight:800,color:"#fff",margin:"4px 0 20px"}}>{t.step3Title}</h2><div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12}}>{avCats.map(c=>{const cnt=A.filter(a=>a.c===c&&a.g.includes(grp)&&a.t===tempo).length;return (<button key={c} onClick={()=>{setCat(c);setStep(4)}} style={{background:`${CC[c]}11`,border:`1px solid ${CC[c]}22`,borderRadius:18,padding:"24px 14px",display:"flex",flexDirection:"column",alignItems:"center",gap:8,cursor:"pointer"}}><span style={{fontSize:34}}>{IC[c]}</span><div style={{fontSize:14,fontWeight:700,color:"#fff"}}>{t.cats[c]}</div><div style={{fontSize:11,color:"#6b6782"}}>{cnt}</div></button>)})}</div></div>}

    {step===4&&<div>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}><span style={{fontSize:26}}>{IC[cat]}</span><h2 style={{fontFamily:"'Outfit',sans-serif",fontSize:22,fontWeight:800,color:"#fff",margin:0}}>{t.cats[cat]}</h2></div>
      <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}><Badge bg="rgba(162,89,255,0.4)">{grp==="solo"?"👤 "+t.solo:grp==="duo"?"👥 "+t.duo:"🎉 "+t.party}</Badge><Badge bg="rgba(62,207,142,0.4)">{tempo==="active"?"🏃 "+t.active:"🛋️ "+t.passive}</Badge></div>
      {cat==="cinema"?<CinemaContent t={t} lang={lang}/>
      :results.length===0?<div style={{textAlign:"center",padding:"48px 20px",color:"#6b6782"}}><span style={{fontSize:48}}>🌙</span><br/><button onClick={reset} style={{marginTop:16,background:"rgba(162,89,255,0.15)",border:"1px solid rgba(162,89,255,0.3)",borderRadius:12,padding:"10px 20px",color:"#c9a0ff",cursor:"pointer"}}>{t.resetBtn}</button></div>
      :<div style={{display:"flex",flexDirection:"column",gap:14,marginBottom:32}}>{results.map(a=>(<Card key={a.id} a={a} lang={lang} t={t} onClick={a.c==="cooking"?()=>setSelRecipe(a):undefined}/>))}</div>}
    </div>}
    <div style={{textAlign:"center",padding:"24px 0 8px",fontSize:12,color:"#3d3a50"}}>{t.footer}</div>
  </div>);}

/* -- CINEMA DATA (from vkino.com.ua, updated 23.03.2026) -- */
var MOVIES_FALLBACK=[
{title:"Коли ти розлучишся?",url:"https://vkino.com.ua/ua/show/11157-koli-ti-rozluchishsya/kyiv",en:"When Will You Divorce?",genre:"Комедія",age:"16+",duration:"90 хв",desc:"Весілля мрії обертається хаосом після зникнення нареченого. Романтична комедія-пригода.",descEn:"A dream wedding turns to chaos when the groom vanishes. A romantic comedy adventure.",poster:"https://images.unsplash.com/photo-1529636798458-92182e662485?w=200&h=290&fit=crop",cinemas:[
{name:"Multiplex Lavina",times:["15:00","17:00","19:00","21:00"]},{name:"Multiplex Retroville",times:["15:00","17:00","19:00"]},{name:"Multiplex Prospekt",times:["15:00","17:00","19:00"]},{name:"Оскар Gulliver",times:["16:00","18:10","20:20"]},{name:"Оскар Smart Plaza",times:["15:30","17:40"]},{name:"Neostar ТРЦ Квадрат",times:["15:00","17:10","19:20"]},{name:"Boomer",times:["15:00","17:00","19:00"]},{name:"Ліра",times:["16:30","18:40"]},{name:"Магнат",times:["17:00","19:10"]},{name:"Лейпціг",times:["15:50","18:00","20:10"]},{name:"ім. Шевченка",times:["16:00","18:10"]}]},
{title:"Стрибунці",url:"https://vkino.com.ua/ua/show/11155-stribuntsi-hoppers/kyiv",en:"Hoppers",genre:"Анімація",age:"0+",duration:"1 год 45 хв",desc:"Юна Мейбл переносить свідомість у робота-бобра, щоб врятувати природу. Pixar.",descEn:"Young Mabel transfers her mind into a robotic beaver to save wildlife. A Pixar adventure.",poster:"https://images.unsplash.com/photo-1535016120720-40c646be5580?w=200&h=290&fit=crop",cinemas:[
{name:"Boomer",times:["16:00","18:00"]},{name:"Neostar ТРЦ Квадрат",times:["16:15","18:20"]},{name:"Multiplex Prospekt",times:["16:00","18:20"],formats:["","3D"]},{name:"Multiplex Lavina",times:["15:30","17:40"]},{name:"Multiplex Retroville",times:["16:00","18:10"]},{name:"Оскар Gulliver",times:["15:00","17:10"]},{name:"Ліра",times:["15:20"]},{name:"Магнат",times:["15:00","17:10"]},{name:"Лейпціг",times:["16:00"]}]},
{title:"Спогади про нього",url:"https://vkino.com.ua/ua/show/11158-spogadi-pro-nogo-reminders-of-him/kyiv",en:"Reminders of Him",genre:"Мелодрама",age:"16+",duration:"110 хв",desc:"Жінка після тюрми намагається повернути доньку та довіру оточуючих. За романом Колін Гувер.",descEn:"After prison, a woman fights to reunite with her daughter. Based on Colleen Hoover.",poster:"https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=200&h=290&fit=crop",cinemas:[
{name:"Оскар Gulliver",times:["15:00","19:40"]},{name:"Оскар Smart Plaza",times:["18:00"]},{name:"Multiplex Retroville",times:["18:00","20:30"]},{name:"Multiplex Lavina",times:["17:00","19:10"]},{name:"Neostar ТРЦ Квадрат",times:["15:30","19:40"]},{name:"Boomer",times:["20:00"]},{name:"Магнат",times:["15:30"]},{name:"Лейпціг",times:["19:50"]},{name:"ім. Шевченка",times:["17:30"]}]},
{title:"Крик 7",url:"https://vkino.com.ua/ua/show/11159-krik-7-scream-7/kyiv",en:"Scream 7",genre:"Жахи",age:"18+",duration:"1 год 54 хв",desc:"Новий Привид полює на доньку Сідні Прескотт. Їй знову доведеться зіткнутися з минулим.",descEn:"A new Ghostface targets Sidney Prescott daughter. She must face her past once more.",poster:"https://images.unsplash.com/photo-1509281373149-e957c6296406?w=200&h=290&fit=crop",cinemas:[
{name:"Multiplex Prospekt",times:["15:30","17:40","20:10"]},{name:"Multiplex Retroville",times:["16:00","18:20","20:40"],formats:["ScreenX","ScreenX","ScreenX"]},{name:"Multiplex Lavina",times:["15:00","17:30","20:00"]},{name:"Планета Кіно Blockbuster",times:["16:00","18:30","21:00"],formats:["IMAX","",""]},{name:"Планета Кіно River Mall",times:["17:00","19:30"]},{name:"Neostar ТРЦ Квадрат",times:["20:30"]},{name:"Оскар Gulliver",times:["20:00"]}]},
{title:"Кракен",url:"https://vkino.com.ua/ua/show/11160-kraken/kyiv",en:"Kraken",genre:"Пригоди",age:"12+",duration:"100 хв",desc:"Норвезький пригодницький трилер про зіткнення з легендарним морським чудовиськом.",descEn:"Norwegian adventure thriller about encountering the legendary sea monster.",poster:"https://images.unsplash.com/photo-1518399681705-1c1a55e5e883?w=200&h=290&fit=crop",cinemas:[
{name:"Neostar ТРЦ Квадрат",times:["17:15","20:35"]},{name:"ім. Шевченка",times:["15:30"]},{name:"Лейпціг",times:["17:50"]},{name:"Multiplex Lavina",times:["16:00","18:30"]},{name:"Multiplex Retroville",times:["15:00","17:20","19:40"]},{name:"Boomer",times:["17:00"]},{name:"Ліра",times:["19:30"]},{name:"Магнат",times:["18:00","20:20"]}]},
{title:"Мавка. Справжній міф",url:"https://vkino.com.ua/ua/show/11136-mavka-spravzhnii-mif/kyiv",en:"Mavka. The True Myth",genre:"Анімація",age:"16+",duration:"95 хв",desc:"Лісова Мавка закохується у біолога замість того, щоб згубити його. Нова версія від FILM.UA.",descEn:"Forest nymph Mavka falls in love instead of luring him to doom. By FILM.UA.",poster:"https://images.unsplash.com/photo-1448375240586-882707db888b?w=200&h=290&fit=crop",cinemas:[
{name:"Multiplex Lavina",times:["15:00","17:10","19:20"]},{name:"Multiplex Retroville",times:["15:20","20:20"]},{name:"Neostar ТРЦ Квадрат",times:["17:00"]},{name:"Планета Кіно Blockbuster",times:["15:30","17:40","19:50"]},{name:"Планета Кіно River Mall",times:["16:00","18:10"]},{name:"Оскар Gulliver",times:["15:00","17:10"]}]},
{title:"Мисливець за спадком",url:"https://vkino.com.ua/ua/show/11137-mislivets-za-spadkom/kyiv",en:"How to Make a Killing",genre:"Бойовик",age:"16+",duration:"105 хв",desc:"Два брати-авантюристи полюють за спадком, але темне минуле ускладнює все.",descEn:"Two brothers hunt for an inheritance, but their dark past complicates everything.",poster:"https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=200&h=290&fit=crop",cinemas:[
{name:"Multiplex Retroville",times:["15:10","17:20","19:40"]},{name:"Multiplex Lavina",times:["15:00","17:20","19:40"]},{name:"Multiplex Respublika Park",times:["15:40","20:30"]},{name:"Neostar ТРЦ Квадрат",times:["16:00","18:10"]},{name:"Планета Кіно Blockbuster",times:["16:30","20:00"]}]},
{title:"Братська четвірка",url:"https://vkino.com.ua/ua/show/11138-bratska-chetvirka/kyiv",en:"The Brotherhood Four",genre:"Бойовик",age:"16+",duration:"100 хв",desc:"Четверо побратимів обєднуються заради небезпечної місії, де на кону все.",descEn:"Four brothers-in-arms unite for a dangerous mission where everything is at stake.",poster:"https://images.unsplash.com/photo-1533488765986-dfa2a9939acd?w=200&h=290&fit=crop",cinemas:[
{name:"Ліра",times:["15:40"]},{name:"Магнат",times:["15:40"]},{name:"ім. Шевченка",times:["20:00"]},{name:"Супутник",times:["17:30"]},{name:"Лейпціг",times:["15:30","19:50"]},{name:"Boomer",times:["15:30"]}]},
{title:"Кутюр",url:"https://vkino.com.ua/ua/show/11139-kutiur-couture/kyiv",en:"Couture",genre:"Драма",age:"16+",duration:"108 хв",desc:"Режисерка приїжджає на Паризький тиждень моди шукати нову себе. З Марґо Роббі.",descEn:"A director comes to Paris Fashion Week to reinvent herself. With Margot Robbie.",poster:"https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=200&h=290&fit=crop",cinemas:[
{name:"Multiplex Retroville",times:["16:30","18:40"]},{name:"Оскар Gulliver",times:["16:50"]},{name:"Multiplex Prospekt",times:["17:20","20:30"]},{name:"Multiplex Lavina",times:["16:00","18:10","20:20"]},{name:"Neostar ТРЦ Квадрат",times:["19:00"]}]},
{title:"Наречена",url:"https://vkino.com.ua/ua/show/11140-narechena-the-bride/kyiv",en:"The Bride",genre:"Жахи",age:"16+",duration:"115 хв",desc:"Грейс знову в грі, ставки вищі за життя одного подружжя. Сиквел хіта.",descEn:"Grace is back in the game, stakes higher than one couples life. The hit sequel.",poster:"https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=200&h=290&fit=crop",cinemas:[
{name:"Планета Кіно River Mall",times:["16:15"],formats:["IMAX"]},{name:"Планета Кіно Blockbuster",times:["16:00","17:00"],formats:["IMAX","RE\'LUX"]},{name:"Multiplex Lavina",times:["17:00","19:40","20:30"],formats:["IMAX","IMAX",""]},{name:"Multiplex Retroville",times:["18:00","20:10"]},{name:"Neostar ТРЦ Квадрат",times:["20:00"]}]},
{title:"Відьма: Родове прокляття",url:"https://vkino.com.ua/ua/show/11141-vidma-rodove-proklyattya/kyiv",en:"The Witch: Bloodline Curse",genre:"Жахи",age:"16+",duration:"95 хв",desc:"Старовинне прокляття пробуджується, коли жінка повертається до сімейного маєтку.",descEn:"An ancient curse awakens when a young woman returns to the family estate.",poster:"https://images.unsplash.com/photo-1509248961898-e54b4aa65f4c?w=200&h=290&fit=crop",cinemas:[
{name:"Магнат",times:["19:10"]},{name:"Супутник",times:["20:50"]},{name:"ім. Шевченка",times:["18:00"]},{name:"Лейпціг",times:["20:20"]},{name:"Ліра",times:["20:00"]},{name:"Boomer",times:["21:00"]}]}
];

function CinemaContent({t,lang}){
var ex=useState(null),expanded=ex[0],setExpanded=ex[1];
var ld=useState(true),loading=ld[0],setLoading=ld[1];
var md=useState(null),liveMovies=md[0],setLiveMovies=md[1];
var er=useState(null),error=er[0],setError=er[1];
useEffect(function(){
setLoading(true);
fetch("/api/cinema")
.then(function(r){return r.json()})
.then(function(data){
if(data.ok && data.movies && data.movies.length>0){ setLiveMovies(data.movies); }
setLoading(false);
})
.catch(function(){setLoading(false);setError(true);});
},[]);
var movies=liveMovies||MOVIES_FALLBACK;
return React.createElement("div",{style:{padding:"18px 0"}},
React.createElement("p",{style:{color:"#b0b0b0",fontSize:13,marginBottom:18,textAlign:"center"}},
loading?("\u23F3 "+(lang==="en"?"Loading live showtimes...":"\u0417\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u043D\u044F \u0430\u043A\u0442\u0443\u0430\u043B\u044C\u043D\u0438\u0445 \u0441\u0435\u0430\u043D\u0441\u0456\u0432...")):(liveMovies?(lang==="en"?"Live showtimes from vkino.com.ua":"\u0421\u0435\u0430\u043D\u0441\u0438 \u0437 vkino.com.ua \u0432 \u0440\u0435\u0430\u043B\u044C\u043D\u043E\u043C\u0443 \u0447\u0430\u0441\u0456"):(lang==="en"?"Showtimes from vkino.com.ua":"\u0421\u0435\u0430\u043D\u0441\u0438 \u0437 vkino.com.ua"))),
movies.map(function(mv,i){return React.createElement("div",{key:i,style:{marginBottom:14,background:"#23243a",borderRadius:14,overflow:"hidden",cursor:"pointer"},onClick:function(){setExpanded(expanded===i?null:i)}},
React.createElement("div",{style:{display:"flex",alignItems:"center",gap:14,padding:12}},
React.createElement("img",{src:mv.poster,alt:mv.title,style:{width:54,height:78,objectFit:"cover",borderRadius:8,background:"#1a1a2e"},onError:function(e){e.target.style.display="none"}}),
React.createElement("div",{style:{flex:1}},
React.createElement("div",{style:{fontWeight:700,fontSize:15,color:"#fff"}},mv.title),
mv.genre?React.createElement("div",{style:{fontSize:12,color:"#b0b0b0",marginTop:2}},mv.genre+(mv.duration?" \u00B7 "+mv.duration:"")+(mv.age?" \u00B7 "+mv.age:"")):"",
React.createElement("div",{style:{fontSize:12,color:"#ffd700",marginTop:4}},mv.cinemas?mv.cinemas.length+(lang==="en"?" cinemas":" \u043A\u0456\u043D\u043E\u0442\u0435\u0430\u0442\u0440\u0456\u0432"):"")),
React.createElement("span",{style:{color:"#ffd700",fontSize:18}},expanded===i?"\u25B2":"\u25BC")),
expanded===i?React.createElement("div",{style:{padding:"0 14px 14px",borderTop:"1px solid #333"}},
mv.cinemas&&mv.cinemas.map(function(cin,j){return React.createElement("div",{key:j,style:{marginTop:10}},
React.createElement("div",{style:{fontWeight:600,fontSize:13,color:"#e0e0e0",marginBottom:4}},cin.name),
React.createElement("div",{style:{display:"flex",flexWrap:"wrap",gap:6}},
cin.times&&cin.times.map(function(time,k){return React.createElement("span",{key:k,style:{background:"#ffd700",color:"#000",padding:"3px 10px",borderRadius:8,fontSize:12,fontWeight:600}},time)})))}),
mv.desc?React.createElement("p",{style:{fontSize:12,color:"#999",marginTop:8,lineHeight:1.4}},mv.desc):"",
React.createElement("a",{href:mv.url,target:"_blank",rel:"noopener noreferrer",style:{display:"inline-block",marginTop:8,fontSize:12,color:"#ffd700",textDecoration:"underline"}},lang==="en"?"Buy tickets on vkino.com.ua":"\u041A\u0432\u0438\u0442\u043A\u0438 \u043D\u0430 vkino.com.ua")):null)}));}
function CinemaPage({t,lang}){
  return (
    <div style={{padding:"0 20px"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
        <h1 style={{fontFamily:"'Outfit',sans-serif",fontSize:26,fontWeight:800,color:"#fff",margin:"10px 0 0"}}>{t.cinemaTitle}</h1>
      </div>
      <p style={{fontSize:13,color:"#6b6782",margin:"4px 0 4px"}}>{t.cinemaSubtitle}</p>
      <CinemaContent t={t} lang={lang}/>
    </div>
  );
}


/* -- EVENTS, MAP (compact) -- */
function EventsPage({t,lang}){const[cf,setCf]=useState("all");const allCats=[...new Set(A.map(a=>a.c))];const filtered=cf==="all"?A:A.filter(a=>a.c===cf);return(<div style={{padding:"0 20px"}}><h1 style={{fontFamily:"'Outfit',sans-serif",fontSize:26,fontWeight:800,color:"#fff",margin:"10px 0 4px"}}>{t.eventsTitle}</h1><p style={{fontSize:13,color:"#6b6782",margin:"0 0 16px"}}>{t.eventsSubtitle}</p><div style={{display:"flex",gap:8,overflowX:"auto",marginBottom:20,paddingBottom:4,scrollbarWidth:"none"}}><Chip label={t.allFilter} active={cf==="all"} onClick={()=>setCf("all")}/>{allCats.map(c=>(<Chip key={c} label={`${IC[c]} ${t.cats[c]}`} active={cf===c} onClick={()=>setCf(c)} color={CC[c]}/>))}</div><p style={{fontSize:14,fontWeight:700,color:"#dddaf0",marginBottom:14}}>{filtered.length} {lang==="en"?"activities":"активностей"}</p><div style={{display:"flex",flexDirection:"column",gap:14,marginBottom:32}}>{filtered.map(a=>(<Card key={a.id} a={a} lang={lang} t={t}/>))}</div></div>);}

function MapPage({t,lang}){const[filter,setFilter]=useState("all");const[sel,setSel]=useState(null);const venues=[{n:"Zhovtnevyi Palats",lat:50.444,lng:30.525,c:"concerts"},{n:"Atlas",lat:50.440,lng:30.523,c:"concerts"},{n:"Philharmonic",lat:50.449,lng:30.528,c:"concerts"},{n:"Franko Theatre",lat:50.451,lng:30.512,c:"culture"},{n:"National Opera",lat:50.451,lng:30.514,c:"culture"},{n:"Mystetskyi Arsenal",lat:50.436,lng:30.531,c:"culture"},{n:"Closer",lat:50.459,lng:30.489,c:"nightlife"},{n:"K41",lat:50.461,lng:30.482,c:"nightlife"},{n:"SkyBar",lat:50.443,lng:30.520,c:"nightlife"},{n:"Good Wine",lat:50.448,lng:30.522,c:"food"},{n:"VDNG",lat:50.379,lng:30.476,c:"food"},{n:"Climbing SPACE",lat:50.487,lng:30.491,c:"sports"},{n:"Hyperion",lat:50.473,lng:30.499,c:"sports"},{n:"SkyMall Kart",lat:50.492,lng:30.561,c:"sports"},{n:"CSA Range",lat:50.443,lng:30.631,c:"sports"},{n:"Svoi Arena",lat:50.431,lng:30.413,c:"sports"},{n:"Urban Park",lat:50.375,lng:30.477,c:"sports"},{n:"Planeta Kino",lat:50.488,lng:30.471,c:"cinema"},{n:"Zhovten",lat:50.462,lng:30.512,c:"cinema"},{n:"KADRooM",lat:50.447,lng:30.518,c:"entertainment"},{n:"Galaxy Park",lat:50.496,lng:30.358,c:"entertainment"},{n:"Neopolis",lat:50.375,lng:30.448,c:"entertainment"}];
const pins=filter==="all"?venues:venues.filter(v=>v.c===filter);const catEmoji={food:"🍽️",nightlife:"🌙",culture:"🎭",cinema:"🎬",concerts:"🎵",sports:"⚡",entertainment:"🎲"};const toX=lng=>((lng-30.33)/0.32)*100;const toY=lat=>((50.55-lat)/0.22)*100;
return(<div style={{padding:"0 20px"}}><h1 style={{fontFamily:"'Outfit',sans-serif",fontSize:26,fontWeight:800,color:"#fff",margin:"10px 0 4px"}}>{t.mapTitle}</h1><p style={{fontSize:13,color:"#6b6782",margin:"0 0 16px"}}>{t.mapSubtitle}</p><div style={{display:"flex",gap:8,overflowX:"auto",marginBottom:16,scrollbarWidth:"none"}}>{[{k:"all",l:t.allFilter},{k:"concerts",l:t.cats.concerts},{k:"culture",l:t.cats.culture},{k:"nightlife",l:t.cats.nightlife},{k:"food",l:t.cats.food},{k:"sports",l:t.cats.sports},{k:"cinema",l:t.cats.cinema},{k:"entertainment",l:t.cats.entertainment}].map(f=>(<Chip key={f.k} label={f.l} active={filter===f.k} onClick={()=>{setFilter(f.k);setSel(null)}} color={CC[f.k]}/>))}</div><div style={{borderRadius:20,overflow:"hidden",background:"linear-gradient(135deg,#1a1840,#1e1b3a,#17152d)",border:"1px solid rgba(255,255,255,0.08)",height:400,position:"relative",marginBottom:32}}>{[20,40,60,80].map(p=>(<div key={`h${p}`} style={{position:"absolute",top:`${p}%`,left:0,right:0,height:1,background:"rgba(255,255,255,0.03)"}}/>))}{[20,40,60,80].map(p=>(<div key={`v${p}`} style={{position:"absolute",left:`${p}%`,top:0,bottom:0,width:1,background:"rgba(255,255,255,0.03)"}}/>))}<svg style={{position:"absolute",inset:0,width:"100%",height:"100%"}} viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M72,0 Q69,20 75,40 Q79,55 73,70 Q69,85 77,100" fill="none" stroke="rgba(60,140,200,0.15)" strokeWidth="4"/></svg>{pins.map((pin,i)=>{const x=toX(pin.lng),y=toY(pin.lat),isSel=sel===pin.n;const color=CC[pin.c]||"#a259ff";return(<div key={i} onClick={()=>setSel(isSel?null:pin.n)} style={{position:"absolute",left:`${Math.min(92,Math.max(8,x))}%`,top:`${Math.min(92,Math.max(8,y))}%`,transform:"translate(-50%,-50%)",cursor:"pointer",zIndex:isSel?5:2}}><div style={{width:isSel?34:26,height:isSel?34:26,borderRadius:"50%",background:`radial-gradient(circle,${color}cc,${color}66)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:isSel?16:11,boxShadow:`0 0 ${isSel?18:8}px ${color}55`,border:`2px solid ${isSel?"#fff":color}44`}}>{catEmoji[pin.c]||"📍"}</div>{isSel&&<div style={{position:"absolute",top:"110%",left:"50%",transform:"translateX(-50%)",background:"rgba(20,18,40,0.95)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:12,padding:"8px 14px",whiteSpace:"nowrap",boxShadow:"0 8px 24px rgba(0,0,0,0.4)",zIndex:10}}><div style={{fontSize:13,fontWeight:700,color:"#fff"}}>{pin.n}</div><div style={{fontSize:11,color:"#8b86a3"}}>{t.cats[pin.c]}</div></div>}</div>)})}<div style={{position:"absolute",bottom:12,left:14,fontSize:11,color:"rgba(255,255,255,0.2)",fontWeight:600}}>{lang==="en"?"Kyiv":"Київ"}</div></div></div>);}

/* -- APP -- */
export default function App(){const[lang,setLang]=useState("uk");const[page,setPage]=useState("home");const[mounted,setMounted]=useState(false);const t=T[lang];useEffect(()=>{setMounted(true)},[]);
return(<div style={{minHeight:"100vh",background:"linear-gradient(170deg,#0d0b1a 0%,#15122a 40%,#1a1333 100%)",color:"#e8e6f0",fontFamily:"'DM Sans',sans-serif",position:"relative",overflow:"hidden",maxWidth:480,margin:"0 auto"}}>
<style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
<div style={{position:"fixed",top:-120,right:-120,width:340,height:340,background:"radial-gradient(circle,rgba(162,89,255,0.13) 0%,transparent 70%)",borderRadius:"50%",pointerEvents:"none",zIndex:0}}/>
<header style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 20px 10px",position:"relative",zIndex:2}}><div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>setPage("home")}><div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#a259ff,#6c3ecf)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:16,color:"#fff",boxShadow:"0 4px 16px rgba(162,89,255,0.35)"}}>N</div><span style={{fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:19,letterSpacing:-0.5,color:"#fff"}}>{t.brand}</span></div><button onClick={()=>setLang(lang==="en"?"uk":"en")} style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:20,padding:"6px 14px",color:"#c4c0d8",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>{t.langSwitch}</button></header>
<main style={{position:"relative",zIndex:1,paddingBottom:90,minHeight:"calc(100vh - 60px)"}}>
{page==="home"&&<HomePage t={t} lang={lang} mounted={mounted}/>}
{page==="events"&&<EventsPage t={t} lang={lang}/>}
{page==="cinema"&&<CinemaPage t={t} lang={lang}/>}
{page==="map"&&<MapPage t={t} lang={lang}/>}
</main>
<nav style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:"rgba(13,11,26,0.92)",backdropFilter:"blur(20px)",borderTop:"1px solid rgba(255,255,255,0.06)",display:"flex",justifyContent:"space-around",padding:"10px 0 18px",zIndex:10}}>
{[{k:"home",ic:"⌂",l:t.nav.home},{k:"events",ic:"◈",l:t.nav.events},{k:"cinema",ic:"🎬",l:t.nav.cinema},{k:"map",ic:"◎",l:t.nav.map}].map(n=>(<button key={n.k} onClick={()=>setPage(n.k)} style={{background:"none",border:"none",color:page===n.k?"#a259ff":"#6b6782",display:"flex",flexDirection:"column",alignItems:"center",gap:3,cursor:"pointer",fontSize:11,fontFamily:"'DM Sans',sans-serif",fontWeight:600}}><span style={{fontSize:18,lineHeight:1}}>{n.ic}</span>{n.l}</button>))}
</nav></div>);}
