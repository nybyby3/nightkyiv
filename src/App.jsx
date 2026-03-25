import { useState, useEffect, useMemo, useCallback, useRef } from "react";

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
const SC={
sports:{climbing:{uk:"\u0421\u043a\u0430\u043b\u043e\u0434\u0440\u043e\u043c\u0438",en:"Climbing",ic:"\ud83e\uddd7",ids:[48,49,50,51,52]},bowling:{uk:"\u0411\u043e\u0443\u043b\u0456\u043d\u0433",en:"Bowling",ic:"\ud83c\udfb3",ids:[53,54,55]},karting:{uk:"\u041a\u0430\u0440\u0442\u0438\u043d\u0433",en:"Karting",ic:"\ud83c\udfce\ufe0f",ids:[56,57,58]},trampolines:{uk:"\u0411\u0430\u0442\u0443\u0442\u0438",en:"Trampolines",ic:"\ud83e\udd38",ids:[59,60]},paintball:{uk:"\u041f\u0435\u0439\u043d\u0442\u0431\u043e\u043b",en:"Paintball",ic:"\ud83d\udd2b",ids:[61,62,63,64]},shooting:{uk:"\u0421\u0442\u0440\u0456\u043b\u044c\u0431\u0438\u0449\u0430",en:"Shooting",ic:"\ud83c\udfaf",ids:[65,66]},tennis:{uk:"\u0422\u0435\u043d\u0456\u0441/\u041f\u0430\u0434\u0435\u043b",en:"Tennis/Padel",ic:"\ud83c\udfbe",ids:[67,68,69,70,71]},team:{uk:"\u041a\u043e\u043c\u0430\u043d\u0434\u043d\u0456 \u0456\u0433\u0440\u0438",en:"Team Sports",ic:"\u26bd",ids:[72,73,74,79,80]},billiards:{uk:"\u0411\u0456\u043b\u044c\u044f\u0440\u0434",en:"Billiards",ic:"\ud83c\udfb1",ids:[75,76]},skatepark:{uk:"\u0421\u043a\u0435\u0439\u0442\u043f\u0430\u0440\u043c",en:"Skatepark",ic:"\ud83d\udef9",ids:[77,78]},active:{uk:"\u0410\u043a\u0442\u0438\u0432\u043d\u0438\u0439 \u0432\u0456\u0434\u043f\u043e\u0447\u0438\u043d\u043e\u043a",en:"Active Recreation",ic:"\ud83c\udfc3",ids:[81,82,83,84,85]}},
entertainment:{quests:{uk:"\u041a\u0432\u0435\u0441\u0442\u0438",en:"Escape Rooms",ic:"\ud83d\udd11",ids:[98,99,100,101,102]},vr:{uk:"VR",en:"Virtual Reality",ic:"\ud83e\udd7d",ids:[103,104,105]},laser:{uk:"\u041b\u0430\u0437\u0435\u0440\u0442\u0430\u0433",en:"Laser Tag",ic:"\ud83d\udd2e",ids:[106,107,108]},parks:{uk:"\u0420\u043e\u0437\u0432\u0430\u0436\u0430\u043b\u044c\u043d\u0456 \u043f\u0430\u0440\u043a\u0438",en:"Fun Parks",ic:"\ud83c\udfa1",ids:[109,110,112,115,117]},other:{uk:"\u0406\u043d\u0448\u0435",en:"Other Fun",ic:"\ud83c\udfaf",ids:[111,113,114,116]}},
culture:{theatre:{uk:"\u0422\u0435\u0430\u0442\u0440\u0438",en:"Theatre",ic:"\ud83c\udfad",ids:[15,16,17,18,19,23,24,26]},museums:{uk:"\u041c\u0443\u0437\u0435\u0457/\u0413\u0430\u043b\u0435\u0440\u0435\u0457",en:"Museums",ic:"\ud83d\uddbc\ufe0f",ids:[14,22]},opera:{uk:"\u041e\u043f\u0435\u0440\u0430",en:"Opera",ic:"\ud83c\udfb6",ids:[21,24]},tours:{uk:"\u0415\u043a\u0441\u043a\u0443\u0440\u0441\u0456\u0457",en:"Tours",ic:"\ud83d\udeb6",ids:[20,25]}},
concerts:{rock:{uk:"\u0420\u043e\u043a/\u041f\u043e\u043f",en:"Rock & Pop",ic:"\ud83c\udfb8",ids:[1,2,6,7]},alt:{uk:"\u0410\u043b\u044c\u0442\u0435\u0440\u043d\u0430\u0442\u0438\u0432\u0430",en:"Alternative",ic:"\ud83c\udfa4",ids:[3,4,9]},classical:{uk:"\u041a\u043b\u0430\u0441\u0438\u043a\u0430/\u0414\u0436\u0430\u0437",en:"Classical & Jazz",ic:"\ud83c\udfbb",ids:[5,8,10,11,12]},comedy:{uk:"\u0421\u0442\u0435\u043d\u0434\u0430\u043f",en:"Stand-Up",ic:"\ud83d\ude02",ids:[13]}},
nightlife:{clubs:{uk:"\u041a\u043b\u0443\u0431\u0438",en:"Clubs",ic:"\ud83d\udd7a",ids:[27,28,33,38]},bars:{uk:"\u0411\u0430\u0440\u0438",en:"Bars",ic:"\ud83c\udf78",ids:[30,31,34,35,36,37]},karaoke:{uk:"\u041a\u0430\u0440\u0430\u043e\u043a\u0435",en:"Karaoke",ic:"\ud83c\udfa4",ids:[32]},rooftop:{uk:"\u0420\u0443\u0444\u0442\u043e\u043f",en:"Rooftop",ic:"\ud83c\udfd9\ufe0f",ids:[29]}},
food:{wine:{uk:"\u0412\u0438\u043d\u043e",en:"Wine",ic:"\ud83c\udf77",ids:[39,47]},street:{uk:"\u0412\u0443\u043b\u0438\u0447\u043d\u0430 \u0457\u0436\u0430",en:"Street Food",ic:"\ud83c\udf2e",ids:[40]},cocktails:{uk:"\u041a\u043e\u043a\u0442\u0435\u0439\u043b\u0456",en:"Cocktails",ic:"\ud83c\udf79",ids:[41]},tours:{uk:"\u0413\u0430\u0441\u0442\u0440\u043e\u0442\u0443\u0440\u0438",en:"Food Tours",ic:"\ud83c\udf7d\ufe0f",ids:[42,43]},beer:{uk:"\u041a\u0440\u0430\u0444\u0442\u043e\u0432\u0435 \u043f\u0438\u0432\u043e",en:"Craft Beer",ic:"\ud83c\udf7a",ids:[44]},coffee:{uk:"\u041a\u0430\u0432\u0430",en:"Coffee",ic:"\u2615",ids:[45]},masterclass:{uk:"\u041a\u0443\u043b\u0456\u043d\u0430\u0440\u0456\u044f",en:"Cooking",ic:"\ud83d\udc68\u200d\ud83c\udf73",ids:[46]}},
wellness:{yoga:{uk:"\u0419\u043e\u0433\u0430",en:"Yoga",ic:"\ud83e\uddd8",ids:[86]},spa:{uk:"\u0421\u043f\u0430/\u0425\u0430\u043c\u043c\u0430\u043c",en:"Spa",ic:"\ud83e\uddd6",ids:[87,88]},relax:{uk:"\u0420\u0435\u043b\u0430\u043a\u0441",en:"Relaxation",ic:"\ud83d\udc86",ids:[89,90]}},
cinema:{imax:{uk:"IMAX/4DX",en:"IMAX",ic:"\ud83c\udfac",ids:[91,92]},multiplex:{uk:"\u041c\u0443\u043b\u044c\u0442\u0438\u043f\u043b\u0435\u043a\u0441",en:"Multiplex",ic:"\ud83c\udf9e\ufe0f",ids:[93,95,96,97]},arthouse:{uk:"\u0410\u0440\u0442\u0445\u0430\u0443\u0441",en:"Arthouse",ic:"\ud83c\udfa5",ids:[94]}},
cooking:{traditional:{uk:"\u0422\u0440\u0430\u0434\u0438\u0446\u0456\u0439\u043d\u0456",en:"Traditional",ic:"\ud83e\udd5f",ids:[118,119,121,124,125]},modern:{uk:"\u0421\u0443\u0447\u0430\u0441\u043d\u0456",en:"Modern",ic:"\ud83c\udf73",ids:[120,122,123]}}
};


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
function HomePage({lang,T:t,A:allVenues,CC:cc,IC:ic,SC:sc,setPage}){
const[step,setStep]=useState(0);
const[grp,setGrp]=useState(null);
const[tempo,setTempo]=useState(null);
const[cat,setCat]=useState(null);
const[subcat,setSubcat]=useState(null);
const[sortBy,setSortBy]=useState("name");
const[dir,setDir]=useState(1);
const[selVenue,setSelVenue]=useState(null);
const[animDir,setAnimDir]=useState(1);
const prev=useCallback(()=>{setAnimDir(-1);setTimeout(()=>setStep(s=>Math.max(0,s-1)),10);},[]);
const next=useCallback((s)=>{setAnimDir(1);setTimeout(()=>setStep(s),10);},[]);
const reset=useCallback(()=>{setAnimDir(-1);setStep(0);setGrp(null);setTempo(null);setCat(null);setSubcat(null);setSelVenue(null);},[]);
const avCats=useMemo(()=>{const filtered=allVenues.filter(v=>(!grp||v.g.includes(grp))&&(!tempo||v.t===tempo));const counts={};filtered.forEach(v=>{counts[v.c]=(counts[v.c]||0)+1;});return counts;},[allVenues,grp,tempo]);
const subResults=useMemo(()=>{if(!cat||!sc[cat])return{};const filtered=allVenues.filter(v=>(!grp||v.g.includes(grp))&&(!tempo||v.t===tempo)&&v.c===cat);const groups={};Object.entries(sc[cat]).forEach(([key,val])=>{const items=filtered.filter(v=>val.ids.includes(v.id));if(items.length>0)groups[key]={...val,items};});return groups;},[allVenues,grp,tempo,cat,sc]);
const results=useMemo(()=>{let filtered=allVenues.filter(v=>(!grp||v.g.includes(grp))&&(!tempo||v.t===tempo)&&v.c===cat);if(subcat&&sc[cat]&&sc[cat][subcat]){filtered=filtered.filter(v=>sc[cat][subcat].ids.includes(v.id));}return filtered.sort((a,b)=>{if(sortBy==="price")return(a.p-b.p)*dir;return a[lang].localeCompare(b[lang])*dir;});},[allVenues,grp,tempo,cat,subcat,sortBy,dir,lang,sc]);
const slideAnim=animDir>0?"slideIn":"slideOut";
const slideStyle={animation:`${slideAnim} 0.3s ease`};
if(selVenue){const v=selVenue;return(<div style={{padding:20,maxWidth:600,margin:"0 auto"}}><button onClick={()=>setSelVenue(null)} style={{background:"none",border:"none",color:"#a78bfa",fontSize:16,cursor:"pointer",marginBottom:16}}>{"\u2190 "+(lang==="uk"?"\u041D\u0430\u0437\u0430\u0434":"Back")}</button><h2 style={{fontSize:28,fontWeight:700,color:"#fff",marginBottom:8}}>{v[lang]}</h2><p style={{color:"#a78bfa",fontSize:14,marginBottom:4}}>{ic[v.c]} {v.v}</p><p style={{color:"#9ca3af",fontSize:14,marginBottom:4}}>{lang==="uk"?"\u0426\u0456\u043D\u0430":"Price"}: {v.p>0?v.p+(lang==="uk"?" \u0433\u0440\u043D":" UAH"):(lang==="uk"?"\u0411\u0435\u0437\u043A\u043E\u0448\u0442\u043E\u0432\u043D\u043E":"Free")}</p>{v.tm&&<p style={{color:"#9ca3af",fontSize:14,marginBottom:4}}>{lang==="uk"?"\u0427\u0430\u0441":"Time"}: {v.tm}</p>}{v.s&&<p style={{color:"#9ca3af",fontSize:14}}>{lang==="uk"?"\u0413\u0440\u0430\u0444\u0456\u043A":"Schedule"}: {v.s}</p>}</div>);}
const W=({children})=><div style={{...slideStyle,padding:"40px 20px",maxWidth:500,margin:"0 auto",textAlign:"center"}}>{children}</div>;
const Hdr=({text})=><div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>{step>0&&<button onClick={prev} style={{background:"none",border:"none",color:"#a78bfa",fontSize:24,cursor:"pointer"}}>{"\u2190"}</button>}<h2 style={{fontSize:22,fontWeight:700,color:"#fff",margin:0}}>{text}</h2></div>;
const Opt=({label,icon,onClick,color})=><button onClick={onClick} style={{display:"block",width:"100%",padding:"16px 20px",marginBottom:12,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,color:"#fff",fontSize:16,cursor:"pointer",textAlign:"left",transition:"all 0.2s"}} onMouseEnter={e=>{e.target.style.background=color||"rgba(167,139,250,0.2)";e.target.style.borderColor=color||"#a78bfa";}} onMouseLeave={e=>{e.target.style.background="rgba(255,255,255,0.05)";e.target.style.borderColor="rgba(255,255,255,0.1)";}}>{icon?icon+" ":""}{label}</button>;
if(step===0)return(<W><p style={{color:"#a78bfa",fontSize:14,marginBottom:8}}>{t[lang].greeting()}</p><h2 style={{fontSize:32,fontWeight:800,color:"#fff",marginBottom:12,lineHeight:1.2}}>{lang==="uk"?"\u0413\u043E\u0442\u043E\u0432\u0456 \u0434\u043E \u043F\u0440\u0438\u0433\u043E\u0434 \u0432 \u041A\u0438\u0454\u0432\u0456?":"Ready for adventures in Kyiv?"}</h2><p style={{color:"#9ca3af",fontSize:14,marginBottom:32}}>{allVenues.length+(lang==="uk"?" \u0430\u043A\u0442\u0438\u0432\u043D\u043E\u0441\u0442\u0435\u0439 \u0443 \u041A\u0438\u0454\u0432\u0456 \u2014 \u0437\u043D\u0430\u0439\u0434\u0435\u043C\u043E \u0456\u0434\u0435\u0430\u043B\u044C\u043D\u0443 \u0440\u043E\u0437\u0432\u0430\u0433\u0443":" activities in Kyiv \u2014 find your perfect match")}</p><button onClick={()=>next(1)} style={{width:"100%",padding:"18px 32px",background:"linear-gradient(135deg,#7c3aed,#a78bfa)",border:"none",borderRadius:16,color:"#fff",fontSize:18,fontWeight:600,cursor:"pointer"}}>{lang==="uk"?"\u0417\u043D\u0430\u0439\u0434\u0435\u043C\u043E \u0449\u043E\u0441\u044C \u2192":"Let's find something \u2192"}</button></W>);
if(step===1)return(<W><Hdr text={lang==="uk"?"\u0425\u0442\u043E \u0439\u0434\u0435?":"Who's going?"}/><Opt label={lang==="uk"?"\u042F \u0441\u0430\u043C":"Solo"} icon="🙋" onClick={()=>{setGrp("solo");next(2);}}/><Opt label={lang==="uk"?"\u0412\u0434\u0432\u043E\u0445":"Together"} icon="👫" onClick={()=>{setGrp("duo");next(2);}}/><Opt label={lang==="uk"?"\u041A\u043E\u043C\u043F\u0430\u043D\u0456\u044F 3+":"Group 3+"} icon="🎉" onClick={()=>{setGrp("party");next(2);}}/><Opt label={lang==="uk"?"\u041D\u0435 \u0432\u0430\u0436\u043B\u0438\u0432\u043E":"Doesn't matter"} icon="🤷" onClick={()=>{setGrp(null);next(2);}}/></W>);
if(step===2)return(<W><Hdr text={lang==="uk"?"\u042F\u043C\u0438\u0439 \u043D\u0430\u0441\u0442\u0440\u0456\u0439?":"What's the mood?"}/><Opt label={lang==="uk"?"\u0410\u043A\u0442\u0438\u0432\u043D\u0438\u0439":"Active"} icon={"⚡"} onClick={()=>{setTempo("active");next(3);}}/><Opt label={lang==="uk"?"\u0421\u043F\u043E\u043A\u0456\u0439\u043D\u0438\u0439":"Calm"} icon="🌿" onClick={()=>{setTempo("passive");next(3);}}/><Opt label={lang==="uk"?"\u041D\u0435 \u0432\u0430\u0436\u043B\u0438\u0432\u043E":"Doesn't matter"} icon="🤷" onClick={()=>{setTempo(null);next(3);}}/></W>);
if(step===3){const cats=Object.entries(avCats).filter(([,n])=>n>0);return(<W><Hdr text={lang==="uk"?"\u0429\u043E \u0446\u0456\u043A\u0430\u0432\u0438\u0442\u044C?":"What interests you?"}/>{cats.map(([c,n])=><Opt key={c} label={(lang==="uk"?t[lang].cats[c]:c.charAt(0).toUpperCase()+c.slice(1))+" ("+n+")"} icon={ic[c]} color={cc[c]+"33"} onClick={()=>{setCat(c);const subs=Object.keys(sc[c]||{});if(subs.length>0)next(4);else next(5);}}/>)}</W>);}
if(step===4){const subs=Object.entries(subResults);return(<W><Hdr text={(lang==="uk"?t[lang].cats[cat]:cat.charAt(0).toUpperCase()+cat.slice(1))+" \u2014 "+(lang==="uk"?"\u043F\u0456\u0434\u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0456\u0457":"subcategories")}/><Opt label={lang==="uk"?"\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u0438 \u0432\u0441\u0435":"Show all"} icon="📋" onClick={()=>{setSubcat(null);next(5);}}/>{subs.map(([key,val])=><Opt key={key} label={(lang==="uk"?val.uk:val.en)+" ("+val.items.length+")"} icon={val.ic} onClick={()=>{setSubcat(key);next(5);}}/>)}</W>);}
if(step===5)return(<W><Hdr text={(lang==="uk"?t[lang].cats[cat]:cat.charAt(0).toUpperCase()+cat.slice(1))+(subcat&&sc[cat]&&sc[cat][subcat]?" \u2014 "+(lang==="uk"?sc[cat][subcat].uk:sc[cat][subcat].en):"")}/><div style={{display:"flex",gap:8,marginBottom:16,justifyContent:"center"}}><button onClick={()=>{setSortBy("name");setDir(1);}} style={{padding:"8px 16px",borderRadius:8,border:"1px solid "+(sortBy==="name"?"#a78bfa":"rgba(255,255,255,0.1)"),background:sortBy==="name"?"rgba(167,139,250,0.2)":"transparent",color:"#fff",cursor:"pointer",fontSize:13}}>{lang==="uk"?"\u0417\u0430 \u043D\u0430\u0437\u0432\u043E\u044E":"By name"}</button><button onClick={()=>{setSortBy("price");setDir(d=>d*-1);}} style={{padding:"8px 16px",borderRadius:8,border:"1px solid "+(sortBy==="price"?"#a78bfa":"rgba(255,255,255,0.1)"),background:sortBy==="price"?"rgba(167,139,250,0.2)":"transparent",color:"#fff",cursor:"pointer",fontSize:13}}>{lang==="uk"?"\u0417\u0430 \u0446\u0456\u043D\u043E\u044E":"By price"} {sortBy==="price"?(dir===1?"\u2191":"\u2193"):""}</button></div><p style={{color:"#9ca3af",fontSize:13,marginBottom:12}}>{lang==="uk"?"\u0417\u043D\u0430\u0439\u0434\u0435\u043D\u043E":"Found"}: {results.length}</p>{results.map(v=><div key={v.id} onClick={()=>setSelVenue(v)} style={{padding:"14px 16px",marginBottom:8,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,cursor:"pointer",textAlign:"left",transition:"all 0.2s"}} onMouseEnter={e=>{e.currentTarget.style.background="rgba(167,139,250,0.15)";}} onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.05)";}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{color:"#fff",fontSize:15,fontWeight:500}}>{ic[v.c]} {v[lang]}</span><span style={{color:"#a78bfa",fontSize:13}}>{v.p>0?v.p+(lang==="uk"?" \u0433\u0440\u043D":" UAH"):(lang==="uk"?"\u0411\u0435\u0437\u043A\u043E\u0448\u0442\u043E\u0432\u043D\u043E":"Free")}</span></div><div style={{color:"#6b7280",fontSize:12,marginTop:4}}>{v.v}{v.s?" \u00B7 "+v.s:""}</div></div>)}</W>);
return(<W><p>{lang==="uk"?"\u0417\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u043D\u044F...":"Loading..."}</p></W>);
}
function CinemaContent({t,lang}){
  var ex=useState(null),expanded=ex[0],setExpanded=ex[1];
  var ds=useState(null),data=ds[0],setData=ds[1];
  var ls=useState(true),loading=ls[0],setLoading=ls[1];
  var es=useState(null),error=es[0],setError=es[1];
  var di=useState(0),dayIdx=di[0],setDayIdx=di[1];
  var us=useState(null),updatedAt=us[0],setUpdatedAt=us[1];

  var fetchData=useCallback(function(){
    setLoading(true);setError(null);
    fetch('/api/cinema').then(function(r){return r.json()}).then(function(j){
      if(j.ok){setData(j);setUpdatedAt(new Date())}else{setError(j.error||'API error')}
      setLoading(false);
    }).catch(function(e){setError(e.message);setLoading(false)});
  },[]);

  useEffect(function(){
    fetchData();
    var iv=setInterval(fetchData,15*60*1000);
    return function(){clearInterval(iv)};
  },[fetchData]);

  function formatDateLabel(isoDate,i){
    var parts=isoDate.split('-');
    var d=new Date(parseInt(parts[0]),parseInt(parts[1])-1,parseInt(parts[2]));
    var today=new Date();today.setHours(0,0,0,0);
    var tom=new Date(today);tom.setDate(tom.getDate()+1);
    var dNorm=new Date(d);dNorm.setHours(0,0,0,0);
    if(dNorm.getTime()===today.getTime()) return lang==="en"?"Today":"Сьогодні";
    if(dNorm.getTime()===tom.getTime()) return lang==="en"?"Tomorrow":"Завтра";
    return d.toLocaleDateString(lang==="en"?"en-US":"uk-UA",{weekday:"short",day:"numeric",month:"short"});
  }

  function getMoviesForDate(dateStr){
    if(!data||!data.movies) return [];
    return data.movies.map(function(m){
      var daySchedule=null;
      if(m.schedule){
        for(var i=0;i<m.schedule.length;i++){
          if(m.schedule[i].date===dateStr){daySchedule=m.schedule[i];break;}
        }
      }
      if(!daySchedule||!daySchedule.cinemas||daySchedule.cinemas.length===0) return null;
      return {title:m.title,url:m.url,id:m.id,poster:m.poster,genre:m.genre,duration:m.duration,age:m.age,desc:m.desc,cinemas:daySchedule.cinemas};
    }).filter(Boolean);
  }

  var dates=data&&data.dates?data.dates:[];
  var activeDate=dates[dayIdx]||dates[0]||'';
  var movies=getMoviesForDate(activeDate);

  function renderMovie(m,i){
    var isE=expanded===i;
    var cl=m.cinemas||[];
    var vis=isE?cl:cl.slice(0,3);
    var more=cl.length>3;
    return (
      <div key={i} style={{background:"rgba(247,183,49,0.04)",border:"1px solid rgba(247,183,49,0.1)",borderRadius:18,marginBottom:14,overflow:"hidden"}}>
        <div style={{display:"flex",gap:14,padding:"14px"}}>
          {m.poster?<img src={m.poster} alt="" style={{width:80,height:115,objectFit:"cover",borderRadius:10,flexShrink:0}} onError={function(e){e.target.style.display='none'}}/>:null}
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
              {m.age && <span style={{background:"rgba(255,255,255,0.1)",borderRadius:4,padding:"1px 7px",fontSize:10,fontWeight:700,color:"#8b86a3"}}>{m.age}</span>}
              <a href={m.url} target="_blank" rel="noopener noreferrer" style={{fontFamily:"'Outfit',sans-serif",fontSize:15,fontWeight:700,color:"#fff",margin:0,lineHeight:1.3,textDecoration:"none"}}>{m.title}</a>
            </div>
            <div style={{fontSize:11,color:"#8b86a3",marginTop:3}}>{[m.genre,m.duration].filter(Boolean).join(" / ")}</div>
            {m.desc && <div style={{fontSize:11,color:"#6b6782",marginTop:5,lineHeight:1.4}}>{m.desc}</div>}
          </div>
        </div>
        <div style={{padding:"0 14px 14px"}}>
          {vis.map(function(cin,j){
            return (
              <div key={j} style={{marginBottom:8,paddingTop:j>0?8:0,borderTop:j>0?"1px solid rgba(255,255,255,0.04)":"none"}}>
                <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:4}}>
                  <span style={{fontSize:10}}>📍</span>
                  <span style={{fontSize:12,fontWeight:600,color:"#c4c0d8"}}>{cin.name}</span>
                  {j===0 && i===0 && <span style={{fontSize:9,color:"#6b6782",marginLeft:4}}>{lang==="en"?"tap time to buy":"натисніть час для купівлі"}</span>}
                </div>
                <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                  {cin.sessions.map(function(s,k){
                    return (
                      <a key={k} href={m.url} target="_blank" rel="noopener noreferrer" style={{background:"rgba(247,183,49,0.12)",border:"1px solid rgba(247,183,49,0.2)",borderRadius:6,padding:"4px 10px",fontSize:11,fontWeight:600,color:"#f7b731",textDecoration:"none",cursor:"pointer",transition:"all 0.15s"}} onMouseEnter={function(e){e.currentTarget.style.background="rgba(247,183,49,0.3)"}} onMouseLeave={function(e){e.currentTarget.style.background="rgba(247,183,49,0.12)"}}>
                        {s.time}{s.fmt ? <span style={{fontSize:9,color:"#ff9f43",marginLeft:3}}>{s.fmt}</span> : null}
                      </a>
                    );
                  })}
                </div>
              </div>
            );
          })}
          {more && <button onClick={function(){setExpanded(isE?null:i)}} style={{background:"rgba(247,183,49,0.08)",border:"1px solid rgba(247,183,49,0.15)",borderRadius:10,padding:"8px",color:"#f7b731",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",width:"100%"}}>
            {isE ? (lang==="en"?"Show less":"Згорнути") : (lang==="en"?"+ "+(cl.length-3)+" more cinemas":"Ще "+(cl.length-3)+" кінотеатрів")}
          </button>}
        </div>
      </div>
    );
  }

  if(loading && !data) return (<div style={{textAlign:"center",padding:"40px 20px"}}><div style={{fontSize:24,marginBottom:12,animation:"pulse 1.5s infinite"}}>🎬</div><p style={{fontSize:13,color:"#8b86a3"}}>{lang==="en"?"Loading showtimes...":"Завантаження сеансів..."}</p></div>);
  if(error && !data) return (<div style={{textAlign:"center",padding:"40px 20px"}}><p style={{fontSize:13,color:"#ff6b6b",marginBottom:12}}>{lang==="en"?"Could not load showtimes":"Не вдалося завантажити сеанси"}</p><button onClick={fetchData} style={{background:"rgba(247,183,49,0.15)",border:"1px solid rgba(247,183,49,0.3)",borderRadius:10,padding:"8px 20px",color:"#f7b731",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>{lang==="en"?"Retry":"Спробувати знову"}</button></div>);

  return (
    <div>
      <div style={{display:"flex",alignItems:"center",gap:8,margin:"0 0 10px"}}>
        <p style={{fontSize:10,color:"#4d4a60",margin:0}}>{lang==="en"?"Live showtimes from multiplex.ua":"Сеанси з multiplex.ua в реальному часі"}</p>
        {loading && <span style={{fontSize:9,color:"#f7b731",animation:"pulse 1.5s infinite"}}>⟳</span>}
        {updatedAt && <span style={{fontSize:9,color:"#3d3a50",marginLeft:"auto"}}>{updatedAt.toLocaleTimeString(lang==="en"?"en-US":"uk-UA",{hour:"2-digit",minute:"2-digit"})}</span>}
      </div>
      <div style={{display:"flex",gap:8,overflowX:"auto",marginBottom:16,scrollbarWidth:"none"}}>
        {dates.map(function(d,i){
          var isActive=i===dayIdx;
          return (<button key={d} onClick={function(){setDayIdx(i);setExpanded(null)}} style={{background:isActive?"rgba(247,183,49,0.2)":"rgba(255,255,255,0.05)",border:isActive?"1px solid rgba(247,183,49,0.4)":"1px solid rgba(255,255,255,0.07)",borderRadius:20,padding:"7px 16px",color:isActive?"#f7b731":"#8b86a3",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",whiteSpace:"nowrap"}}>{formatDateLabel(d,i)}</button>);
        })}
      </div>
      {movies.length===0?(<div style={{textAlign:"center",padding:"30px 20px"}}><p style={{fontSize:13,color:"#6b6782"}}>{lang==="en"?"No showtimes for this day":"Немає сеансів на цей день"}</p></div>):(<div style={{marginBottom:16}}>{movies.map(renderMovie)}</div>)}
      <div style={{display:"flex",justifyContent:"center",marginBottom:16}}>
        <button onClick={fetchData} style={{background:"rgba(247,183,49,0.08)",border:"1px solid rgba(247,183,49,0.15)",borderRadius:10,padding:"8px 20px",color:"#f7b731",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",gap:6}}>
          <span>⟳</span> {lang==="en"?"Refresh showtimes":"Оновити сеанси"}
        </button>
      </div>
      <div style={{marginBottom:28}}>
        <h3 style={{fontFamily:"'Outfit',sans-serif",fontSize:14,fontWeight:700,color:"#dddaf0",marginBottom:10}}>{lang==="en"?"Buy Tickets":"Купити квитки"}</h3>
        {[{n:"Multiplex",u:"https://multiplex.ua/",d:lang==="en"?"All Kyiv locations":"Усі кінотеатри Києва",c:"#a259ff"},{n:"Planeta Kino",u:"https://planetakino.ua/",d:"IMAX, 4DX, RE'LUX",c:"#e84393"},{n:"Oscar",u:"https://oskar.kyiv.ua/",d:"Gulliver, Smart Plaza",c:"#4fc3f7"},{n:"Zhovten",u:"https://zhovten-kino.kyiv.ua/",d:lang==="en"?"Art-house":"Арт-хаус",c:"#3ecf8e"}].map(function(tk){
          return (
            <a key={tk.n} href={tk.u} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:10,background:tk.c+"08",border:"1px solid "+tk.c+"22",borderRadius:12,padding:"10px 12px",textDecoration:"none",marginBottom:6}}>
              <span style={{fontSize:16}}>🎬</span>
              <div style={{flex:1}}>
                <div style={{fontSize:12,fontWeight:700,color:"#fff"}}>{tk.n}</div>
                <div style={{fontSize:10,color:"#8b86a3"}}>{tk.d}</div>
              </div>
              <span style={{background:tk.c,borderRadius:6,padding:"4px 10px",fontSize:10,fontWeight:700,color:"#fff"}}>{lang==="en"?"Tickets":"Квитки"} →</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}

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


function MapPage({t,lang}){
var mapRef=useRef(null),mapInst=useRef(null),markersRef=useRef([]),userCircle=useRef(null);
var[selCat,setSelCat]=useState(null);
var[userLoc,setUserLoc]=useState(null);
var[maxDist,setMaxDist]=useState(15);
var[search,setSearch]=useState("");
var[selVenue,setSelVenue]=useState(null);
var[sidebarOpen,setSidebarOpen]=useState(true);
var[mapReady,setMapReady]=useState(false);
var cats={
cinema:{uk:"Кінотеатри",en:"Cinemas",ico:"🎬",col:"#e74c3c"},
theater:{uk:"Театри",en:"Theaters",ico:"🎭",col:"#9b59b6"},
museum:{uk:"Музеї",en:"Museums",ico:"🏛️",col:"#3498db"},
concerts:{uk:"Концерти",en:"Concerts",ico:"🎵",col:"#e67e22"},
books:{uk:"Книжкові",en:"Books",ico:"📚",col:"#1abc9c"},
nightlife:{uk:"Клуби",en:"Clubs",ico:"🌙",col:"#8e44ad"},
hookah:{uk:"Кальянні",en:"Hookah",ico:"💨",col:"#95a5a6"},
karaoke:{uk:"Караоке",en:"Karaoke",ico:"🎤",col:"#e91e63"},
bowling:{uk:"Боулінг",en:"Bowling",ico:"🎳",col:"#2ecc71"},
karting:{uk:"Картинг",en:"Karting",ico:"🏎️",col:"#f39c12"},
climbing:{uk:"Скалодроми",en:"Climbing",ico:"🧗",col:"#00bcd4"},
quests:{uk:"Квести",en:"Quests",ico:"🔐",col:"#ff5722"},
boardgames:{uk:"Настілки",en:"Board Games",ico:"🎲",col:"#607d8b"},
water:{uk:"Вейкборд",en:"Water",ico:"🏄",col:"#03a9f4"},
trampoline:{uk:"Батути",en:"Trampoline",ico:"🤸",col:"#ff9800"},
vr:{uk:"VR",en:"VR",ico:"🎮",col:"#673ab7"},
spa:{uk:"Спа/Сауни",en:"Spa",ico:"💆",col:"#ec407a"},
creative:{uk:"Творчі",en:"Creative",ico:"🎨",col:"#26a69a"},
parks:{uk:"Парки",en:"Parks",ico:"🌳",col:"#4caf50"},
food:{uk:"Ресторани",en:"Food",ico:"🍽️",col:"#ff7043"},
coffee:{uk:"Кав'ярні",en:"Coffee",ico:"☕",col:"#8d6e63"},
dance:{uk:"Танці",en:"Dance",ico:"💃",col:"#ab47bc"},
shooting:{uk:"Стрільбища",en:"Shooting",ico:"🎯",col:"#78909c"}
};
var V=[
{n:"Multiplex Lavina",a:"просп. Берестейський, 87А",lat:50.4583,lng:30.3959,c:"cinema"},
{n:"Multiplex Retroville",a:"просп. Бандери, 34В",lat:50.4875,lng:30.4133,c:"cinema"},
{n:"Planeta Kino IMAX",a:"Дніпровська наб., 12",lat:50.4268,lng:30.5635,c:"cinema"},
{n:"Oscar (Gulliver)",a:"просп. Перемоги, 6",lat:50.4380,lng:30.5234,c:"cinema"},
{n:"Жовтень",a:"вул. Костянтинівська, 26",lat:50.4627,lng:30.5106,c:"cinema"},
{n:"Multiplex Prospect",a:"просп. Перемоги, 55",lat:50.4500,lng:30.4540,c:"cinema"},
{n:"Театр Франка",a:"вул. Івана Франка, 3",lat:50.4432,lng:30.5189,c:"theater"},
{n:"Театр Лесі Українки",a:"вул. Хмельницького, 5",lat:50.4445,lng:30.5230,c:"theater"},
{n:"Національна опера",a:"вул. Володимирська, 50",lat:50.4490,lng:30.5125,c:"theater"},
{n:"Театр на Подолі",a:"Андріївський узвіз, 20Б",lat:50.4600,lng:30.5165,c:"theater"},
{n:"Молодий театр",a:"вул. Прорізна, 17",lat:50.4475,lng:30.5175,c:"theater"},
{n:"Національний музей історїї",a:"вул. Володимирська, 2",lat:50.4548,lng:30.5172,c:"museum"},
{n:"PinchukArtCentre",a:"вул. Бассейна/Басейна, 1-3",lat:50.4400,lng:30.5215,c:"museum"},
{n:"Мистецький Арсенал",a:"вул. Лаврська, 10-12",lat:50.4335,lng:30.5410,c:"museum"},
{n:"ВДНГ",a:"просп. Академіка Глушкова, 1",lat:50.3790,lng:30.4755,c:"museum"},
{n:"Музей води",a:"вул. Грушевського, 1В",lat:50.4515,lng:30.5285,c:"museum"},
{n:"Київський Планетарій",a:"вул. Велика Васильківська, 57/3",lat:50.4355,lng:30.5175,c:"museum"},
{n:"Atlas",a:"вул. Січових Стрільців, 37-41",lat:50.4560,lng:30.4965,c:"concerts"},
{n:"Caribbean Club",a:"вул. Петлюри, 4",lat:50.4397,lng:30.5060,c:"concerts"},
{n:"Бочка на Хрещатику",a:"Хрещатик, 19А",lat:50.4465,lng:30.5220,c:"concerts"},
{n:"Docker Pub",a:"вул. Богатирська, 25",lat:50.4940,lng:30.4825,c:"concerts"},
{n:"Книгарня Є",a:"вул. Хрещатик, 46",lat:50.4475,lng:30.5210,c:"books"},
{n:"Книголав",a:"вул. Паньківська, 2",lat:50.4395,lng:30.5105,c:"books"},
{n:"Сенс Букшоп",a:"вул. Велика Васильківська, 6",lat:50.4420,lng:30.5215,c:"books"},
{n:"Читай-місто",a:"вул. Лесі Українки, 30А",lat:50.4310,lng:30.5380,c:"books"},
{n:"Closer",a:"вул. Нижньоюрківська, 31",lat:50.4655,lng:30.5035,c:"nightlife"},
{n:"CHI",a:"вул. Десятинна, 12",lat:50.4570,lng:30.5150,c:"nightlife"},
{n:"Skybar",a:"вул. Велика Васильківська, 5",lat:50.4430,lng:30.5220,c:"nightlife"},
{n:"D.Fleur",a:"вул. Мечникова, 3",lat:50.4365,lng:30.5340,c:"nightlife"},
{n:"River Port",a:"Набережно-Хрещатицька, 2",lat:50.4570,lng:30.5290,c:"nightlife"},
{n:"Вагон",a:"Набережно-Хрещатицька, 12",lat:50.4575,lng:30.5310,c:"nightlife"},
{n:"Indigo Lounge",a:"вул. Хрещатик, 15/4",lat:50.4480,lng:30.5200,c:"hookah"},
{n:"Hookah Place SkyBar",a:"вул. Велика Васильківська, 5",lat:50.4428,lng:30.5218,c:"hookah"},
{n:"Мята Lounge",a:"вул. Саксаганського, 42",lat:50.4380,lng:30.5090,c:"hookah"},
{n:"Тепло",a:"вул. Велика Васильківська, 52",lat:50.4370,lng:30.5185,c:"hookah"},
{n:"SplitKaraoke",a:"вул. Прорізна, 3",lat:50.4485,lng:30.5180,c:"karaoke"},
{n:"Dороги Караоке",a:"вул. Антоновича, 48",lat:50.4310,lng:30.5185,c:"karaoke"},
{n:"Vibes Karaoke",a:"вул. Саксаганського, 7",lat:50.4415,lng:30.5140,c:"karaoke"},
{n:"Strike Bowling",a:"просп. Берестейський, 87А",lat:50.4585,lng:30.3965,c:"bowling"},
{n:"Sam's Bowling",a:"вул. Льва Толстого, 11А",lat:50.4390,lng:30.5140,c:"bowling"},
{n:"Le Mans Karting",a:"вул. Новокостянтинівська, 1А",lat:50.4690,lng:30.4920,c:"karting"},
{n:"ProKart",a:"вул. Бориспільська, 9",lat:50.4155,lng:30.6095,c:"karting"},
{n:"Climbing SPACE",a:"вул. Велика Васильківська, 100",lat:50.4285,lng:30.5135,c:"climbing"},
{n:"TATO climbing",a:"вул. Набережно-Лугова, 8",lat:50.4610,lng:30.4750,c:"climbing"},
{n:"QuestPlanet",a:"вул. Хрещатик, 7/11",lat:50.4490,lng:30.5200,c:"quests"},
{n:"Лабіринти страху",a:"вул. Прорізна, 22",lat:50.4472,lng:30.5155,c:"quests"},
{n:"Escape Quest",a:"вул. Мечникова, 9",lat:50.4358,lng:30.5355,c:"quests"},
{n:"Ігротека",a:"вул. Хрещатик, 46",lat:50.4477,lng:30.5212,c:"boardgames"},
{n:"BoardGames Party",a:"вул. Саксаганського, 33",lat:50.4392,lng:30.5085,c:"boardgames"},
{n:"X-Park Wakeboard",a:"Дніпровська наб., 14А",lat:50.4272,lng:30.5650,c:"water"},
{n:"Dnepr Wake Park",a:"о. Гідропарк",lat:50.4430,lng:30.5750,c:"water"},
{n:"Fly Park",a:"просп. Берестейський, 87А",lat:50.4587,lng:30.3970,c:"trampoline"},
{n:"Sky Park",a:"вул. Бориспільська, 9",lat:50.4160,lng:30.6100,c:"trampoline"},
{n:"Galaxy VR",a:"вул. Хрещатик, 15",lat:50.4478,lng:30.5195,c:"vr"},
{n:"VR Motion",a:"вул. Антоновича, 50",lat:50.4305,lng:30.5180,c:"vr"},
{n:"Термаль Star",a:"вул. Червонозоряний, 119",lat:50.3820,lng:30.4550,c:"spa"},
{n:"Баня Forest",a:"Бориспільське шосе, 10",lat:50.4050,lng:30.6250,c:"spa"},
{n:"San Siro Spa",a:"вул. Велика Васильківська, 55",lat:50.4363,lng:30.5175,c:"spa"},
{n:"Вовня Арт",a:"вул. Рейтарська, 9",lat:50.4525,lng:30.5120,c:"creative"},
{n:"Художній центр Шоколадний будинок",a:"вул. Шовковична, 17/2",lat:50.4440,lng:30.5285,c:"creative"},
{n:"Гончарна майстерня GlazurSpace",a:"вул. Рогнідинська, 3",lat:50.4377,lng:30.5148,c:"creative"},
{n:"Мирний Кераміст",a:"вул. Рогнідинська, 3",lat:50.4377,lng:30.5148,c:"creative"},
{n:"Маріїнський парк",a:"вул. Михайла Грушевського",lat:50.4480,lng:30.5380,c:"parks"},
{n:"Парк Шевченка",a:"вул. Володимирська",lat:50.4445,lng:30.5100,c:"parks"},
{n:"Пейзажна алея",a:"вул. Десятинна",lat:50.4580,lng:30.5130,c:"parks"},
{n:"Гідропарк",a:"острів Гідропарк",lat:50.4440,lng:30.5770,c:"parks"},
{n:"Труханів острів",a:"Труханів острів",lat:50.4650,lng:30.5500,c:"parks"},
{n:"Сільпо Делікатес",a:"вул. Хрещатик, 21",lat:50.4470,lng:30.5220,c:"food"},
{n:"Kanapa",a:"вул. Андріївський узвіз, 19А",lat:50.4600,lng:30.5155,c:"food"},
{n:"Остання Барикада",a:"вул. Маланюка, 3",lat:50.4485,lng:30.5265,c:"food"},
{n:"Beef",a:"вул. Шота Руставелі, 11",lat:50.4360,lng:30.5295,c:"food"},
{n:"Under Wonder",a:"вул. Велика Васильківська, 21",lat:50.4405,lng:30.5210,c:"food"},
{n:"Blue Cup Coffee",a:"вул. Велика Васильківська, 41",lat:50.4385,lng:30.5195,c:"coffee"},
{n:"Takava Coffee-Buffet",a:"вул. Велика Васильківська, 49/2",lat:50.4370,lng:30.5190,c:"coffee"},
{n:"3.14 Coffee",a:"вул. Прорізна, 21",lat:50.4472,lng:30.5160,c:"coffee"},
{n:"DRUZI café",a:"вул. Прорізна, 18",lat:50.4470,lng:30.5150,c:"coffee"},
{n:"Salsa Studio",a:"вул. Межигірська, 23",lat:50.4640,lng:30.5070,c:"dance"},
{n:"Kizomba Kyiv",a:"вул. Саксаганського, 43",lat:50.4383,lng:30.5075,c:"dance"},
{n:"Dance Academy",a:"вул. Жилянська, 118",lat:50.4355,lng:30.4965,c:"dance"},
{n:"Тир ТАК",a:"вул. Червонозоряний, 119",lat:50.3825,lng:30.4555,c:"shooting"},
{n:"Козак Тір",a:"вул. Лейпцизька, 13",lat:50.4217,lng:30.5200,c:"shooting"}
];

function hav(a1,g1,a2,g2){var R=6371,dL=(a2-a1)*Math.PI/180,dG=(g2-g1)*Math.PI/180,x=Math.sin(dL/2)*Math.sin(dL/2)+Math.cos(a1*Math.PI/180)*Math.cos(a2*Math.PI/180)*Math.sin(dG/2)*Math.sin(dG/2);return R*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x))}

var filtered=useMemo(function(){
return V.filter(function(v){
if(selCat&&v.c!==selCat)return false;
if(search){var s=search.toLowerCase();if(v.n.toLowerCase().indexOf(s)===-1&&v.a.toLowerCase().indexOf(s)===-1&&(cats[v.c]?cats[v.c][lang]:"").toLowerCase().indexOf(s)===-1)return false;}
if(userLoc){var d=hav(userLoc[0],userLoc[1],v.lat,v.lng);if(d>maxDist)return false;}
return true;
});
},[selCat,search,userLoc,maxDist,lang]);

function updMarkers(){
if(!mapInst.current||!window.L)return;
markersRef.current.forEach(function(m){mapInst.current.removeLayer(m)});
markersRef.current=[];
filtered.forEach(function(v){
var cat=cats[v.c]||{ico:"📍",col:"#999"};
var isSelected=selVenue&&selVenue.n===v.n;
var size=isSelected?44:34;
var ic=window.L.divIcon({className:"nk-marker",html:'<div style="width:'+size+'px;height:'+size+'px;border-radius:50%;background:'+cat.col+';display:flex;align-items:center;justify-content:center;font-size:'+(isSelected?24:18)+'px;box-shadow:0 0 8px '+cat.col+'88,0 0 20px '+cat.col+'44,0 2px 6px rgba(0,0,0,0.5);border:2px solid '+(isSelected?'#fff':cat.col+'88')+';cursor:pointer;transition:all 0.2s">'+cat.ico+'</div>',iconSize:[size,size],iconAnchor:[size/2,size/2]});
var mk=window.L.marker([v.lat,v.lng],{icon:ic}).addTo(mapInst.current);
mk.bindPopup('<div style="font-weight:700;font-size:14px;margin-bottom:4px">'+v.n+'</div><div style="color:#666;font-size:12px">'+v.a+'</div>',{className:"nk-popup"});
mk.on("click",function(){setSelVenue(v);mapInst.current.flyTo([v.lat,v.lng],15,{duration:0.5});});
markersRef.current.push(mk);
});
}

useEffect(updMarkers,[filtered,selVenue]);

useEffect(function(){
if(!mapRef.current||mapInst.current)return;
if(!window.L)return;
var m=window.L.map(mapRef.current,{zoomControl:false,attributionControl:false}).setView([50.4501,30.5234],12);
window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19}).addTo(m);
window.L.control.zoom({position:"bottomright"}).addTo(m);
mapInst.current=m;
setMapReady(true);
setTimeout(updMarkers,200);
},[]);

useEffect(function(){
if(mapInst.current)setTimeout(function(){mapInst.current.invalidateSize()},350);
},[sidebarOpen]);

function findMe(){
if(!navigator.geolocation)return;
navigator.geolocation.getCurrentPosition(function(p){
var lat=p.coords.latitude,lng=p.coords.longitude;
setUserLoc([lat,lng]);
if(mapInst.current){
mapInst.current.flyTo([lat,lng],14,{duration:0.8});
if(userCircle.current)mapInst.current.removeLayer(userCircle.current);
userCircle.current=window.L.circle([lat,lng],{radius:maxDist*1000,color:"#a855f7",fillColor:"#a855f7",fillOpacity:0.08,weight:1}).addTo(mapInst.current);
}
});
}

useEffect(function(){
if(!userCircle.current||!mapInst.current)return;
userCircle.current.setRadius(maxDist*1000);
},[maxDist]);

var catKeys=Object.keys(cats);

// Group categories for filter chips display
var catGroups=[
{label:lang==="uk"?"Розваги":"Entertainment",keys:["cinema","theater","concerts","nightlife","karaoke","bowling","karting","quests","vr","trampoline"]},
{label:lang==="uk"?"Культура":"Culture",keys:["museum","books","creative","parks"]},
{label:lang==="uk"?"Їжа та напої":"Food & Drinks",keys:["food","coffee","hookah"]},
{label:lang==="uk"?"Активності":"Activities",keys:["climbing","water","dance","shooting","spa","boardgames"]}
];

function handleVenueClick(v){
setSelVenue(v);
if(mapInst.current)mapInst.current.flyTo([v.lat,v.lng],15,{duration:0.5});
}

return(<div style={{position:"fixed",top:0,left:0,right:0,bottom:0,zIndex:9999,width:"100vw",height:"100vh",background:"#0a0a1a",color:"#fff",display:"flex",overflow:"hidden"}}>

{/* Map area */}
<div style={{flex:1,position:"relative",height:"100%",transition:"all 0.3s ease"}}>
<div ref={mapRef} style={{width:"100%",height:"100%"}}/>

{/* Search bar overlay on map */}
<div style={{position:"absolute",top:16,left:16,zIndex:1000,display:"flex",gap:8,alignItems:"center",maxWidth:420}}>
<div style={{flex:1,position:"relative",minWidth:200}}>
<span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:16,pointerEvents:"none"}}>🔍</span>
<input value={search} onChange={function(e){setSearch(e.target.value)}} placeholder={lang==="uk"?"Пошук місць...":"Search venues..."} style={{width:"100%",padding:"12px 36px 12px 40px",borderRadius:12,border:"1px solid rgba(168,85,247,0.3)",background:"rgba(10,10,26,0.9)",backdropFilter:"blur(12px)",color:"#fff",fontSize:14,outline:"none",boxSizing:"border-box"}}/>
{search&&<button onClick={function(){setSearch("")}} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#888",fontSize:16,cursor:"pointer",padding:0}}>✕</button>}
</div>
<button onClick={findMe} title={lang==="uk"?"Моя локація":"My location"} style={{width:44,height:44,borderRadius:12,border:"1px solid rgba(168,85,247,0.3)",background:userLoc?"rgba(168,85,247,0.3)":"rgba(10,10,26,0.9)",backdropFilter:"blur(12px)",color:"#fff",fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>📍</button>
</div>

{/* Category filter chips on map */}
<div style={{position:"absolute",top:72,left:16,zIndex:999,display:"flex",gap:6,flexWrap:"wrap",maxWidth:sidebarOpen?"calc(100% - 420px)":"calc(100% - 32px)"}}>
<button onClick={function(){setSelCat(null)}} style={{padding:"7px 14px",borderRadius:20,border:"1px solid "+(selCat===null?"#a855f7":"rgba(255,255,255,0.12)"),background:selCat===null?"rgba(168,85,247,0.25)":"rgba(10,10,26,0.85)",backdropFilter:"blur(8px)",color:selCat===null?"#c084fc":"#bbb",fontSize:12,cursor:"pointer",fontWeight:selCat===null?600:400,whiteSpace:"nowrap"}}>{lang==="uk"?"Усі":"All"} ({filtered.length})</button>
{catKeys.map(function(k){var c=cats[k];var cnt=V.filter(function(v){return v.c===k}).length;return <button key={k} onClick={function(){setSelCat(selCat===k?null:k)}} style={{padding:"7px 12px",borderRadius:20,border:"1px solid "+(selCat===k?c.col+"88":"rgba(255,255,255,0.1)"),background:selCat===k?c.col+"22":"rgba(10,10,26,0.85)",backdropFilter:"blur(8px)",color:selCat===k?c.col:"#999",fontSize:12,cursor:"pointer",fontWeight:selCat===k?600:400,whiteSpace:"nowrap",transition:"all 0.2s"}}>{c.ico+" "+c[lang]}</button>})}
</div>

{/* Distance slider when geolocated */}
{userLoc&&<div style={{position:"absolute",bottom:16,left:16,zIndex:999,background:"rgba(10,10,26,0.9)",backdropFilter:"blur(12px)",borderRadius:12,padding:"10px 16px",border:"1px solid rgba(168,85,247,0.2)",display:"flex",alignItems:"center",gap:12,fontSize:13}}>
<span style={{color:"#aaa"}}>{lang==="uk"?"Радіус":"Radius"}</span>
<input type="range" min="1" max="30" value={maxDist} onChange={function(e){setMaxDist(Number(e.target.value))}} style={{width:100,accentColor:"#a855f7"}}/>
<span style={{color:"#c084fc",fontWeight:600,minWidth:40}}>{maxDist} km</span>
</div>}

{/* Toggle sidebar button */}
<button onClick={function(){setSidebarOpen(!sidebarOpen)}} style={{position:"absolute",bottom:16,right:sidebarOpen?408:16,zIndex:1000,padding:"10px 16px",borderRadius:12,border:"1px solid rgba(168,85,247,0.3)",background:"rgba(10,10,26,0.9)",backdropFilter:"blur(12px)",color:"#c084fc",fontSize:13,cursor:"pointer",fontWeight:600,transition:"right 0.3s ease",display:"flex",alignItems:"center",gap:6}}>
{sidebarOpen?(lang==="uk"?"Сховати список ▶":"Hide List ▶"):(lang==="uk"?"◀ Показати список":"◀ Show List")}
</button>
</div>

{/* Right sidebar */}
<div style={{width:sidebarOpen?390:0,minWidth:sidebarOpen?390:0,height:"100%",background:"#0d0d20",borderLeft:sidebarOpen?"1px solid rgba(168,85,247,0.15)":"none",transition:"all 0.3s ease",overflow:"hidden",display:"flex",flexDirection:"column"}}>

{/* Sidebar header */}
<div style={{padding:"16px 20px 12px",borderBottom:"1px solid rgba(168,85,247,0.1)",flexShrink:0}}>
<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
<h3 style={{margin:0,fontSize:18,fontWeight:700,background:"linear-gradient(135deg,#a855f7,#6366f1)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{lang==="uk"?"Місця":"Places"}</h3>
<span style={{fontSize:13,color:"#888"}}>{filtered.length} {lang==="uk"?"знайдено":"found"}</span>
</div>
</div>

{/* Venue cards scrollable list */}
<div style={{flex:1,overflowY:"auto",padding:"12px 16px",display:"flex",flexDirection:"column",gap:10}} className="nk-sidebar-scroll">
{filtered.length===0&&<div style={{textAlign:"center",padding:"40px 20px",color:"#555"}}>
<div style={{fontSize:40,marginBottom:12}}>🔍</div>
<div style={{fontSize:14}}>{lang==="uk"?"Нічого не знайдено":"No venues found"}</div>
<div style={{fontSize:12,color:"#444",marginTop:4}}>{lang==="uk"?"Спробуйте інший пошук":"Try a different search"}</div>
</div>}
{filtered.map(function(v,i){
var cat=cats[v.c]||{ico:"📍",col:"#999",uk:"",en:""};
var isActive=selVenue&&selVenue.n===v.n;
return <div key={i} onClick={function(){handleVenueClick(v)}} style={{background:isActive?"rgba(168,85,247,0.12)":"rgba(255,255,255,0.03)",border:"1px solid "+(isActive?"rgba(168,85,247,0.4)":"rgba(255,255,255,0.06)"),borderRadius:14,padding:14,cursor:"pointer",transition:"all 0.2s"}}>
{/* Category badge */}
<div style={{display:"inline-flex",alignItems:"center",gap:5,padding:"3px 10px",borderRadius:12,background:cat.col+"18",border:"1px solid "+cat.col+"33",marginBottom:10}}>
<span style={{fontSize:12}}>{cat.ico}</span>
<span style={{fontSize:11,color:cat.col,fontWeight:600}}>{cat[lang]}</span>
</div>
{/* Venue name */}
<div style={{fontSize:15,fontWeight:600,marginBottom:6,lineHeight:1.3}}>{v.n}</div>
{/* Address */}
<div style={{fontSize:12,color:"#888",display:"flex",alignItems:"flex-start",gap:6}}>
<span style={{color:"#a855f7",fontSize:13,flexShrink:0,marginTop:1}}>📍</span>
<span>{v.a}</span>
</div>
{/* Distance if available */}
{userLoc&&<div style={{fontSize:11,color:"#a855f7",marginTop:6}}>📏 {hav(userLoc[0],userLoc[1],v.lat,v.lng).toFixed(1)} km</div>}
{/* Action buttons when selected */}
{isActive&&<div style={{display:"flex",gap:8,marginTop:10}}>
<a href={"https://www.google.com/maps/dir/?api=1&destination="+v.lat+","+v.lng} target="_blank" rel="noopener noreferrer" style={{flex:1,padding:"8px 0",borderRadius:10,background:"linear-gradient(135deg,#a855f7,#7c3aed)",color:"#fff",textDecoration:"none",textAlign:"center",fontSize:12,fontWeight:600}}>🧭 {lang==="uk"?"Маршрут":"Directions"}</a>
<a href={"https://www.google.com/search?q="+encodeURIComponent(v.n+" Kyiv")} target="_blank" rel="noopener noreferrer" style={{flex:1,padding:"8px 0",borderRadius:10,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",color:"#ccc",textDecoration:"none",textAlign:"center",fontSize:12,fontWeight:600}}>🔍 {lang==="uk"?"Детальніше":"Details"}</a>
</div>}
</div>;
})}
</div>
</div>

<style>{"\
.nk-marker{background:none!important;border:none!important}\
.nk-marker div:hover{transform:scale(1.15)!important;z-index:999!important}\
.nk-popup .leaflet-popup-content-wrapper{background:#1a1a2e;color:#fff;border-radius:10px;border:1px solid rgba(168,85,247,0.2);box-shadow:0 4px 20px rgba(0,0,0,0.5)}\
.nk-popup .leaflet-popup-tip{background:#1a1a2e}\
.nk-popup .leaflet-popup-close-button{color:#888}\
.leaflet-control-zoom a{background:rgba(10,10,26,0.9)!important;color:#fff!important;border-color:rgba(168,85,247,0.2)!important;backdrop-filter:blur(8px)}\
.leaflet-control-zoom a:hover{background:rgba(168,85,247,0.3)!important}\
.nk-sidebar-scroll::-webkit-scrollbar{width:4px}\
.nk-sidebar-scroll::-webkit-scrollbar-track{background:transparent}\
.nk-sidebar-scroll::-webkit-scrollbar-thumb{background:rgba(168,85,247,0.3);border-radius:4px}\
.nk-sidebar-scroll::-webkit-scrollbar-thumb:hover{background:rgba(168,85,247,0.5)}\
@media(max-width:768px){.nk-sidebar-mobile{position:absolute!important;right:0;top:0;bottom:0;z-index:1001;width:100%!important;min-width:100%!important}}\
"}</style>
</div>);
}

/* -- APP -- */
export default function App(){const[lang,setLang]=useState("uk");const[page,setPage]=useState("home");const[mounted,setMounted]=useState(false);const t=T[lang];useEffect(()=>{setMounted(true)},[]);
return(<div style={{minHeight:"100vh",background:"linear-gradient(170deg,#0d0b1a 0%,#15122a 40%,#1a1333 100%)",color:"#e8e6f0",fontFamily:"'DM Sans',sans-serif",position:"relative",overflow:"hidden",maxWidth:480,margin:"0 auto"}}>
<style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
<div style={{position:"fixed",top:-120,right:-120,width:340,height:340,background:"radial-gradient(circle,rgba(162,89,255,0.13) 0%,transparent 70%)",borderRadius:"50%",pointerEvents:"none",zIndex:0}}/>
<header style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 20px 10px",position:"relative",zIndex:2}}><div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>setPage("home")}><div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#a259ff,#6c3ecf)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:16,color:"#fff",boxShadow:"0 4px 16px rgba(162,89,255,0.35)"}}>N</div><span style={{fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:19,letterSpacing:-0.5,color:"#fff"}}>{t.brand}</span></div><button onClick={()=>setLang(lang==="en"?"uk":"en")} style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:20,padding:"6px 14px",color:"#c4c0d8",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>{t.langSwitch}</button></header>
<main style={{position:"relative",zIndex:1,paddingBottom:90,minHeight:"calc(100vh - 60px)"}}>
{page==="home"&&<HomePage lang={lang} T={T} A={A} CC={CC} IC={IC} SC={SC} setPage={setPage}/>}
{page==="events"&&<EventsPage t={t} lang={lang}/>}
{page==="cinema"&&<CinemaPage t={t} lang={lang}/>}
{page==="map"&&<MapPage t={t} lang={lang}/>}
</main>
<nav style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:"rgba(13,11,26,0.92)",backdropFilter:"blur(20px)",borderTop:"1px solid rgba(255,255,255,0.06)",display:"flex",justifyContent:"space-around",padding:"10px 0 18px",zIndex:10}}>
{[{k:"home",ic:"⌂",l:t.nav.home},{k:"events",ic:"◈",l:t.nav.events},{k:"cinema",ic:"🎬",l:t.nav.cinema},{k:"map",ic:"◎",l:t.nav.map}].map(n=>(<button key={n.k} onClick={()=>setPage(n.k)} style={{background:"none",border:"none",color:page===n.k?"#a259ff":"#6b6782",display:"flex",flexDirection:"column",alignItems:"center",gap:3,cursor:"pointer",fontSize:11,fontFamily:"'DM Sans',sans-serif",fontWeight:600}}><span style={{fontSize:18,lineHeight:1}}>{n.ic}</span>{n.l}</button>))}
</nav></div>);}
