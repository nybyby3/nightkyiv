import { useState, useEffect, useMemo, useCallback, useRef } from "react";

const T={en:{brand:"NightKyiv",langSwitch:"ðºð¦ Ð£Ð",greeting:()=>{const h=new Date().getHours();return h<12?"Good morning":h<18?"Good afternoon":"Good evening"},heroTitle:"What's your\nevening plan?",heroSub:"125 activities across Kyiv â find yours",step1Title:"Who's joining?",step2Title:"What's the vibe?",step3Title:"Pick a category",solo:"Solo",duo:"Duo",party:"3+ People",soloDesc:"Me time",duoDesc:"Date or friend",partyDesc:"Group fun",active:"Active",passive:"Chill",activeDesc:"Move & engage",passiveDesc:"Sit back & enjoy",results:"results",backBtn:"Back",resetBtn:"Start over",nav:{home:"Discover",events:"Events",cinema:"Cinema",map:"Map"},eventsTitle:"Events",eventsSubtitle:"All activities in Kyiv",cinemaTitle:"Cinema",cinemaSubtitle:"Live showtimes from Kyiv cinemas",mapTitle:"Map",mapSubtitle:"Discover places",allFilter:"All",footer:"Â© 2026 NightKyiv. All rights reserved.",from:"from",free:"Free",
cats:{concerts:"Concerts",culture:"Culture",nightlife:"Nightlife",gastro:"Gastronomy",sports:"Sports",cinema:"Cinema",entertainment:"Entertainment",cooking:"Cook at Home",health:"Health & Self-dev",home:"Home Leisure"},
cook:{ingredients:"Ingredients",equipment:"Equipment",steps:"Steps",servings:"servings",orderVia:"Order ingredients via",easy:"Easy",medium:"Medium",hard:"Hard"},
live:{loading:"Loading live data...",error:"Could not load",refresh:"Refresh",liveTag:"LIVE",poweredBy:"Powered by AI search"}},
uk:{brand:"NightKyiv",langSwitch:"ð¬ð§ EN",greeting:()=>{const h=new Date().getHours();return h<12?"ÐÐ¾Ð±ÑÐ¾Ð³Ð¾ ÑÐ°Ð½ÐºÑ":h<18?"ÐÐ¾Ð±ÑÐ¾Ð³Ð¾ Ð´Ð½Ñ":"ÐÐ¾Ð±ÑÐ¾Ð³Ð¾ Ð²ÐµÑÐ¾ÑÐ°"},heroTitle:"Ð¯ÐºÐ¸Ð¹ Ð¿Ð»Ð°Ð½\nÐ½Ð° Ð²ÐµÑÑÑ?",heroSub:"125 Ð°ÐºÑÐ¸Ð²Ð½Ð¾ÑÑÐµÐ¹ Ñ ÐÐ¸ÑÐ²Ñ â Ð·Ð½Ð°Ð¹Ð´Ð¸ ÑÐ²Ð¾Ñ",step1Title:"Ð¥ÑÐ¾ Ð· Ð²Ð°Ð¼Ð¸?",step2Title:"Ð¯ÐºÐ¸Ð¹ Ð½Ð°ÑÑÑÑÐ¹?",step3Title:"ÐÐ±ÐµÑÑÑÑ ÐºÐ°ÑÐµÐ³Ð¾ÑÑÑ",solo:"Ð¡Ð¾Ð»Ð¾",duo:"Ð£Ð´Ð²Ð¾Ñ",party:"3+ Ð»ÑÐ´ÐµÐ¹",soloDesc:"Ð§Ð°Ñ Ð´Ð»Ñ ÑÐµÐ±Ðµ",duoDesc:"ÐÐ¾Ð±Ð°ÑÐµÐ½Ð½Ñ ÑÐ¸ Ð´ÑÑÐ³",partyDesc:"ÐÐ¾Ð¼Ð¿Ð°Ð½ÑÑ",active:"ÐÐºÑÐ¸Ð²Ð½Ð¸Ð¹",passive:"Ð¡Ð¿Ð¾ÐºÑÐ¹Ð½Ð¸Ð¹",activeDesc:"Ð ÑÑ ÑÐ° ÐµÐ½ÐµÑÐ³ÑÑ",passiveDesc:"Ð Ð¾Ð·ÑÐ»Ð°Ð±ÑÐµÑÑ",results:"ÑÐµÐ·ÑÐ»ÑÑÐ°ÑÑÐ²",backBtn:"ÐÐ°Ð·Ð°Ð´",resetBtn:"Ð¡Ð¿Ð¾ÑÐ°ÑÐºÑ",nav:{home:"ÐÐ¾Ð»Ð¾Ð²Ð½Ð°",events:"ÐÐ¾Ð´ÑÑ",cinema:"ÐÑÐ½Ð¾",map:"ÐÐ°ÑÑÐ°"},eventsTitle:"ÐÐ¾Ð´ÑÑ",eventsSubtitle:"Ð£ÑÑ Ð°ÐºÑÐ¸Ð²Ð½Ð¾ÑÑÑ Ñ ÐÐ¸ÑÐ²Ñ",cinemaTitle:"ÐÑÐ½Ð¾",cinemaSubtitle:"Ð¡ÐµÐ°Ð½ÑÐ¸ ÐºÑÐ½Ð¾ÑÐµÐ°ÑÑÑÐ² ÐÐ¸ÑÐ²Ð° Ð¾Ð½Ð»Ð°Ð¹Ð½",mapTitle:"ÐÐ°ÑÑÐ°",mapSubtitle:"ÐÑÐ´ÐºÑÐ¸Ð²Ð°Ð¹ÑÐµ Ð¼ÑÑÑÑ",allFilter:"Ð£ÑÑ",footer:"Â© 2026 NightKyiv. Ð£ÑÑ Ð¿ÑÐ°Ð²Ð° Ð·Ð°ÑÐ¸ÑÐµÐ½Ñ.",from:"Ð²ÑÐ´",free:"ÐÐµÐ·ÐºÐ¾ÑÑÐ¾Ð²Ð½Ð¾",
cats:{concerts:"ÐÐ¾Ð½ÑÐµÑÑÐ¸",culture:"ÐÑÐ»ÑÑÑÑÐ°",nightlife:"ÐÑÑÐ½Ðµ Ð¶Ð¸ÑÑÑ",gastro:"ÐÐ°ÑÑÑÐ¾Ð½Ð¾Ð¼ÑÑ",sports:"Ð¡Ð¿Ð¾ÑÑ",cinema:"ÐÑÐ½Ð¾",entertainment:"Ð Ð¾Ð·Ð²Ð°Ð³Ð¸",cooking:"ÐÐ¾ÑÑÑÐ¼Ð¾ Ð²Ð´Ð¾Ð¼Ð°",health:"ÐÐ´Ð¾ÑÐ¾Ð²'Ñ Ñ Ð¡Ð°Ð¼Ð¾ÑÐ¾Ð·Ð²Ð¸ÑÐ¾Ðº",home:"ÐÐ¾Ð¼Ð°ÑÐ½Ñ Ð´Ð¾Ð·Ð²ÑÐ»Ð»Ñ"},
cook:{ingredients:"ÐÐ½Ð³ÑÐµÐ´ÑÑÐ½ÑÐ¸",equipment:"ÐÐ±Ð»Ð°Ð´Ð½Ð°Ð½Ð½Ñ",steps:"ÐÑÐ¾ÐºÐ¸",servings:"Ð¿Ð¾ÑÑÑÐ¹",orderVia:"ÐÐ°Ð¼Ð¾Ð²Ð¸ÑÐ¸ ÑÐ½Ð³ÑÐµÐ´ÑÑÐ½ÑÐ¸ ÑÐµÑÐµÐ·",easy:"ÐÐµÐ³ÐºÐ¾",medium:"Ð¡ÐµÑÐµÐ´Ð½ÑÐ¾",hard:"Ð¡ÐºÐ»Ð°Ð´Ð½Ð¾"},
live:{loading:"ÐÐ°Ð²Ð°Ð½ÑÐ°Ð¶ÐµÐ½Ð½...",error:"ÐÐµ Ð²Ð´Ð°Ð»Ð¾ÑÑ Ð·Ð°Ð²Ð°Ð½ÑÐ°Ð¶Ð¸ÑÐ¸",refresh:"ÐÐ½Ð¾Ð²Ð¸ÑÐ¸",liveTag:"LIVE",poweredBy:"ÐÐ° Ð¾ÑÐ½Ð¾Ð²Ñ AI Ð¿Ð¾ÑÑÐºÑ"}}};

const IC={concerts:"ðµ",culture:"ð¨",nightlife:"ð",gastro:"ð½ï¸",sports:"â½",cinema:"ð¬",entertainment:"ð®",cooking:"ð³",health:"ð§",home:"ð "};
const CC={concerts:"#ff6bca",culture:"#3ecf8e",nightlife:"#a259ff",gastro:"#ff6b6b",sports:"#4fc3f7",cinema:"#f7b731",entertainment:"#ff9f43",cooking:"#ff8a50",health:"#66bb6a",home:"#ab47bc"};
const MOOD_CATS={active:["sports","health","culture","entertainment","nightlife","gastro","cinema"],passive:["health","culture","entertainment","cooking","home","cinema"]};
const STUB_CATS=new Set(["health","home","cooking"]);
const CAT_REMAP={food:"gastro"};
const imgs={concerts:["https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400&h=240&fit=crop","https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=240&fit=crop","https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=240&fit=crop"],culture:["https://images.unsplash.com/photo-1503095396549-807759245b35?w=400&h=240&fit=crop","https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=400&h=240&fit=crop","https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=400&h=240&fit=crop"],nightlife:["https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=400&h=240&fit=crop","https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=400&h=240&fit=crop","https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=240&fit=crop"],gastro:["https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=240&fit=crop","https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=240&fit=crop","https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&h=240&fit=crop"],sports:["https://images.unsplash.com/photo-1522163182402-834f871fd851?w=400&h=240&fit=crop","https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?w=400&h=240&fit=crop","https://images.unsplash.com/photo-1461896836934-bd45ea8be68d?w=400&h=240&fit=crop","https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=240&fit=crop"],cinema:["https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=240&fit=crop","https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=240&fit=crop","https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=240&fit=crop"],entertainment:["https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&h=240&fit=crop","https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=400&h=240&fit=crop","https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?w=400&h=240&fit=crop"],cooking:["https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&h=240&fit=crop","https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?w=400&h=240&fit=crop","https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=400&h=240&fit=crop"]};
const SC={sports:{fitness:{uk:"\u0424\u0456\u0442\u043d\u0435\u0441",en:"Fitness",ic:"\ud83d\udcaa"},swimming:{uk:"\u0411\u0430\u0441\u0435\u0439\u043d\u0438",en:"Swimming",ic:"\ud83c\udfca"},climbing:{uk:"\u0421\u043a\u0430\u043b\u043e\u0434\u0440\u043e\u043c\u0438",en:"Climbing",ic:"\ud83e\uddd7"},bowling:{uk:"\u0411\u043e\u0443\u043b\u0456\u043d\u0433",en:"Bowling",ic:"\ud83c\udfb3"},tennis:{uk:"\u0422\u0435\u043d\u0456\u0441",en:"Tennis",ic:"\ud83c\udfbe"},football:{uk:"\u0424\u0443\u0442\u0431\u043e\u043b",en:"Football",ic:"\u26bd"},basketball:{uk:"\u0411\u0430\u0441\u043a\u0435\u0442\u0431\u043e\u043b",en:"Basketball",ic:"\ud83c\udfc0"},martial_arts:{uk:"\u0411\u043e\u0439\u043e\u0432\u0456 \u043c\u0438\u0441\u0442\u0435\u0446\u0442\u0432\u0430",en:"Martial Arts",ic:"\ud83e\udd4b"},shooting:{uk:"\u0421\u0442\u0440\u0456\u043b\u044c\u0431\u0430",en:"Shooting",ic:"\ud83c\udfaf"},skating:{uk:"\u041a\u043e\u0432\u0437\u0430\u043d\u0438",en:"Skating",ic:"\u26f8"},billiards:{uk:"\u0411\u0456\u043b\u044c\u044f\u0440\u0434",en:"Billiards",ic:"\ud83c\udfb1"},volleyball:{uk:"\u0412\u043e\u043b\u0435\u0439\u0431\u043e\u043b",en:"Volleyball",ic:"\ud83c\udfd0"},equestrian:{uk:"\u041a\u0456\u043d\u043d\u0438\u0439 \u0441\u043f\u043e\u0440\u0442",en:"Equestrian",ic:"\ud83c\udfc7"},cycling:{uk:"\u0412\u0435\u043b\u043e\u0441\u043f\u043e\u0440\u0442",en:"Cycling",ic:"\ud83d\udeb4"},golf:{uk:"\u0413\u043e\u043b\u044c\u0444",en:"Golf",ic:"\u26f3"},stadium:{uk:"\u0421\u0442\u0430\u0434\u0456\u043e\u043d\u0438",en:"Stadiums",ic:"\ud83c\udfdf"},other_sports:{uk:"\u0406\u043d\u0448\u0435",en:"Other",ic:"\ud83c\udfc5"}},entertainment:{quests:{uk:"\u041a\u0432\u0435\u0441\u0442\u0438",en:"Quests",ic:"\ud83d\udd10"},arcade:{uk:"\u0410\u0440\u043a\u0430\u0434\u0438",en:"Arcade",ic:"\ud83c\udfae"},parks:{uk:"\u041f\u0430\u0440\u043a\u0438",en:"Parks",ic:"\ud83c\udf33"},zoo:{uk:"\u0417\u043e\u043e\u043f\u0430\u0440\u043a\u0438",en:"Zoo",ic:"\ud83e\udd81"},dance:{uk:"\u0422\u0430\u043d\u0446\u0456",en:"Dance",ic:"\ud83d\udc83"},playground:{uk:"\u041c\u0430\u0439\u0434\u0430\u043d\u0447\u0438\u043a\u0438",en:"Playgrounds",ic:"\ud83e\uddf8"},attraction:{uk:"\u0410\u0442\u0440\u0430\u043a\u0446\u0456\u043e\u043d\u0438",en:"Attractions",ic:"\ud83c\udfa0"},nature:{uk:"\u041f\u0440\u0438\u0440\u043e\u0434\u0430",en:"Nature",ic:"\ud83c\udf3f"},other_ent:{uk:"\u0406\u043d\u0448\u0435",en:"Other",ic:"\ud83c\udf89"}},culture:{theatre:{uk:"\u0422\u0435\u0430\u0442\u0440\u0438",en:"Theatres",ic:"\ud83c\udfad"},museums:{uk:"\u041c\u0443\u0437\u0435\u0457",en:"Museums",ic:"\ud83c\udfdb"},galleries:{uk:"\u0413\u0430\u043b\u0435\u0440\u0435\u0457",en:"Galleries",ic:"\ud83d\uddbc"},libraries:{uk:"\u0411\u0456\u0431\u043b\u0456\u043e\u0442\u0435\u043a\u0438",en:"Libraries",ic:"\ud83d\udcda"},worship:{uk:"\u0425\u0440\u0430\u043c\u0438",en:"Worship",ic:"\u26ea"},viewpoints:{uk:"\u041e\u0433\u043b\u044f\u0434\u043e\u0432\u0456",en:"Viewpoints",ic:"\ud83d\udc41"},fountain:{uk:"\u0424\u043e\u043d\u0442\u0430\u043d\u0438",en:"Fountains",ic:"\u26f2"}},nightlife:{clubs:{uk:"\u041a\u043b\u0443\u0431\u0438",en:"Clubs",ic:"\ud83c\udf86"},bars:{uk:"\u0411\u0430\u0440\u0438",en:"Bars",ic:"\ud83c\udf7a"},pubs:{uk:"\u041f\u0430\u0431\u0438",en:"Pubs",ic:"\ud83c\udf7b"},karaoke:{uk:"\u041a\u0430\u0440\u0430\u043e\u043a\u0435",en:"Karaoke",ic:"\ud83c\udfa4"}},gastro:{restaurants:{uk:"\u0420\u0435\u0441\u0442\u043e\u0440\u0430\u043d\u0438",en:"Restaurants",ic:"\ud83c\udf7d"},cafes:{uk:"\u041a\u0430\u0444\u0435",en:"Cafes",ic:"\u2615"},fast_food:{uk:"\u0424\u0430\u0441\u0442\u0444\u0443\u0434",en:"Fast Food",ic:"\ud83c\udf54"},ice_cream:{uk:"\u041c\u043e\u0440\u043e\u0437\u0438\u0432\u043e",en:"Ice Cream",ic:"\ud83c\udf66"},bakery:{uk:"\u041f\u0435\u043a\u0430\u0440\u043d\u0456",en:"Bakery",ic:"\ud83c\udf5e"},wine_shops:{uk:"\u0412\u0438\u043d\u043d\u0456 \u043c\u0430\u0433\u0430\u0437\u0438\u043d\u0438",en:"Wine Shops",ic:"\ud83c\udf77"},coffee_shops:{uk:"\u041a\u0430\u0432'\u044f\u0440\u043d\u0456",en:"Coffee Shops",ic:"\u2615"}},cinema:{cinema:{uk:"\u041a\u0456\u043d\u043e\u0442\u0435\u0430\u0442\u0440\u0438",en:"Cinemas",ic:"\ud83c\udfac"}}};


let A=[];



/* -- RECIPE DETAILS (keyed by activity id) -- */
const RD={
118:{diff:"medium",ingEn:["Beetroot 3","Cabbage 1/4","Potatoes 3","Carrots 2","Onion 1","Tomato paste 2 tbsp","Garlic 4 cloves","Beef broth 2L","Pork ribs 500g","Sour cream","Fresh dill","Bay leaves"],ingUk:["ÐÑÑÑÐº 3","ÐÐ°Ð¿ÑÑÑÐ° 1/4","ÐÐ°ÑÑÐ¾Ð¿Ð»Ñ 3","ÐÐ¾ÑÐºÐ²Ð° 2","Ð¦Ð¸Ð±ÑÐ»Ñ 1","Ð¢Ð¾Ð¼Ð°ÑÐ½Ð° Ð¿Ð°ÑÑÐ° 2 ÑÑ.Ð».","Ð§Ð°ÑÐ½Ð¸Ðº 4","ÐÑÐ»ÑÐ¹Ð¾Ð½ 2Ð»","Ð ÐµÐ±ÑÐ° 500Ð³","Ð¡Ð¼ÐµÑÐ°Ð½Ð°","ÐÑÑÐ¿","ÐÐ°Ð²ÑÑÐ²ÐºÐ°"],stepsEn:["Boil ribs 1 hour, skim foam","Grate beet & carrot, dice rest","SautÃ© onion, carrot, add paste","Add beet with vinegar 10 min","Add potatoes 10 min","Add vegetables & cabbage 15 min","Season, add garlic & dill","Serve with sour cream"],stepsUk:["ÐÐ°ÑÑÑÑ ÑÐµÐ±ÑÐ° 1 Ð³Ð¾Ð´","ÐÐ°ÑÑÑÑÑ Ð±ÑÑÑÐº, Ð¼Ð¾ÑÐºÐ²Ñ","ÐÐ±ÑÐ¼Ð°Ð¶ÑÐµ ÑÐ¸Ð±ÑÐ»Ñ, Ð´Ð¾Ð´Ð°Ð¹ÑÐµ Ð¿Ð°ÑÑÑ","ÐÐ¾Ð´Ð°Ð¹ÑÐµ Ð±ÑÑÑÐº Ð· Ð¾ÑÑÐ¾Ð¼ 10 ÑÐ²","ÐÐ°ÑÑÐ¾Ð¿Ð»Ñ 10 ÑÐ²","ÐÐ²Ð¾ÑÑ ÑÐ° ÐºÐ°Ð¿ÑÑÑÐ° 15 ÑÐ²","Ð§Ð°ÑÐ½Ð¸Ðº, ÐºÑÑÐ¿, ÑÐ¿ÐµÑÑÑ","ÐÐ¾Ð´Ð°Ð²Ð°Ð¹ÑÐµ Ð·Ñ ÑÐ¼ÐµÑÐ°Ð½Ð¾Ñ"],equipEn:["Large pot 5L+","Frying pan","Grater","Knife & board"],equipUk:["ÐÐ°ÑÑÑÑÐ»Ñ 5Ð»+","Ð¡ÐºÐ¾Ð²Ð¾ÑÐ¾Ð´Ð°","Ð¢ÐµÑÑÐºÐ°","ÐÑÐ¶ ÑÐ° Ð´Ð¾ÑÐºÐ°"]},
119:{diff:"medium",ingEn:["Flour 400g","Eggs 2","Water 150ml","Potatoes 6","Onion 2","Butter 50g","Sour cream","Salt"],ingUk:["ÐÐ¾ÑÐ¾ÑÐ½Ð¾ 400Ð³","Ð¯Ð¹ÑÑ 2","ÐÐ¾Ð´Ð° 150Ð¼Ð»","ÐÐ°ÑÑÐ¾Ð¿Ð»Ñ 6","Ð¦Ð¸Ð±ÑÐ»Ñ 2","ÐÐ°ÑÐ»Ð¾ 50Ð³","Ð¡Ð¼ÐµÑÐ°Ð½Ð°","Ð¡ÑÐ»Ñ"],stepsEn:["Mix dough, rest 30 min","Boil & mash potatoes","Fry onion golden","Mix onion into filling","Roll thin, cut circles","Fill, fold & seal","Boil until float + 2 min","Serve with sour cream"],stepsUk:["ÐÐ°Ð¼ÑÑÑÑÑ ÑÑÑÑÐ¾, 30 ÑÐ²","ÐÐ²Ð°ÑÑÑÑ ÐºÐ°ÑÑÐ¾Ð¿Ð»Ñ","ÐÐ±ÑÐ¼Ð°Ð¶ÑÐµ ÑÐ¸Ð±ÑÐ»Ñ","ÐÐ¼ÑÑÐ°Ð¹ÑÐµ Ð· Ð½Ð°ÑÐ¸Ð½ÐºÐ¾Ñ","Ð Ð¾Ð·ÐºÐ°ÑÐ°Ð¹ÑÐµ, Ð²Ð¸ÑÑÐ¶ÑÐµ","ÐÐ»ÑÐ¿ÑÑÑ Ð²Ð°ÑÐµÐ½Ð¸ÐºÐ¸","ÐÐ°ÑÑÑÑ Ð¿Ð¾ÐºÐ¸ ÑÐ¿Ð»Ð¸Ð²ÑÑÑ + 2 ÑÐ²","ÐÐ¾Ð´Ð°Ð²Ð°Ð¹ÑÐµ Ð·Ñ ÑÐ¼ÐµÑÐ°Ð½Ð¾Ñ"],equipEn:["Rolling pin","Large pot","Bowls","Potato masher"],equipUk:["ÐÐ°ÑÐ°Ð»ÐºÐ°","ÐÐ°ÑÑÑÑÐ»Ñ","ÐÐ¸ÑÐºÐ¸","Ð¢Ð¾Ð²ÐºÐ°ÑÐºÐ°"]},
120:{diff:"hard",ingEn:["Chicken breast 2","Butter 100g cold","Dill & parsley","Garlic 3","Flour 100g","Eggs 3","Breadcrumbs 200g","Oil for frying"],ingUk:["ÐÑÑÑÑÐµ ÑÑÐ»Ðµ 2","ÐÐ°ÑÐ»Ð¾ 100Ð³","ÐÑÑÐ¿ ÑÐ° Ð¿ÐµÑÑÑÑÐºÐ°","Ð§Ð°ÑÐ½Ð¸Ðº 3","ÐÐ¾ÑÐ¾ÑÐ½Ð¾ 100Ð³","Ð¯Ð¹ÑÑ 3","Ð¡ÑÑÐ°ÑÑ 200Ð³","ÐÐ»ÑÑ"],stepsEn:["Mix butter+herbs+garlic, freeze 30min","Butterfly & pound chicken thin","Roll butter inside chicken","Coat: flourâeggsâcrumbs x2","Deep fry 170Â°C 8-10 min","Rest 3 min, serve"],stepsUk:["ÐÐ°ÑÐ»Ð¾+Ð·ÐµÐ»ÐµÐ½Ñ+ÑÐ°ÑÐ½Ð¸Ðº, Ð·Ð°Ð¼Ð¾ÑÐ¾Ð·Ð¸ÑÐ¸ 30ÑÐ²","Ð Ð¾Ð·ÑÑÐ¶ÑÐµ ÑÐ° Ð²ÑÐ´Ð±Ð¸Ð¹ÑÐµ ÑÑÐ»Ðµ","ÐÐ°Ð³Ð¾ÑÐ½ÑÑÑ Ð¼Ð°ÑÐ»Ð¾","ÐÐ¾ÑÐ¾ÑÐ½Ð¾âÑÐ¹ÑÑâÑÑÑÐ°ÑÑ x2","Ð¡Ð¼Ð°Ð¶ÑÐµ 170Â°C 8-10 ÑÐ²","3 ÑÐ² Ð²ÑÐ´Ð¿Ð¾ÑÐ¸Ð½ÐºÑ, Ð¿Ð¾Ð´Ð°Ð²Ð°Ð¹ÑÐµ"],equipEn:["Deep pan","Meat mallet","3 bowls","Thermometer"],equipUk:["ÐÐ»Ð¸Ð±Ð¾ÐºÐ° ÑÐºÐ¾Ð²Ð¾ÑÐ¾Ð´Ð°","ÐÐ¾Ð»Ð¾ÑÐ¾Ðº","3 Ð¼Ð¸ÑÐºÐ¸","Ð¢ÐµÑÐ¼Ð¾Ð¼ÐµÑÑ"]},
121:{diff:"medium",ingEn:["Cabbage 1 head","Ground meat 500g","Rice 150g","Onion 2","Carrots 2","Tomato sauce 400ml","Sour cream 200ml","Garlic, dill"],ingUk:["ÐÐ°Ð¿ÑÑÑÐ° 1","Ð¤Ð°ÑÑ 500Ð³","Ð Ð¸Ñ 150Ð³","Ð¦Ð¸Ð±ÑÐ»Ñ 2","ÐÐ¾ÑÐºÐ²Ð° 2","Ð¢Ð¾Ð¼Ð°ÑÐ½Ð¸Ð¹ ÑÐ¾ÑÑ 400Ð¼Ð»","Ð¡Ð¼ÐµÑÐ°Ð½Ð° 200Ð¼Ð»","Ð§Ð°ÑÐ½Ð¸Ðº, ÐºÑÑÐ¿"],stepsEn:["Blanch cabbage, peel leaves","Half-cook rice, sautÃ© vegs","Mix meat, rice, vegs","Roll in cabbage leaves","Sauce: tomato+sour cream","Layer in pot, pour sauce","Simmer 1.5 hours","Serve with cream"],stepsUk:["ÐÐ»Ð°Ð½ÑÑÐ¹ÑÐµ ÐºÐ°Ð¿ÑÑÑÑ","Ð Ð¸Ñ + Ð·Ð°ÑÐ¼Ð°Ð¶ÐºÐ°","ÐÐ¼ÑÑÐ°Ð¹ÑÐµ ÑÐ°ÑÑ, ÑÐ¸Ñ, Ð¾Ð²Ð¾ÑÑ","ÐÐ°Ð³Ð¾ÑÐ½ÑÑÑ Ð² Ð»Ð¸ÑÑÑ","Ð¡Ð¾ÑÑ: ÑÐ¾Ð¼Ð°Ñ+ÑÐ¼ÐµÑÐ°Ð½Ð°","Ð ÐºÐ°ÑÑÑÑÐ»Ñ, Ð·Ð°Ð»Ð¸Ð¹ÑÐµ","Ð¢ÑÑÐºÑÐ¹ÑÐµ 1.5 Ð³Ð¾Ð´","ÐÐ¾Ð´Ð°Ð²Ð°Ð¹ÑÐµ Ð·Ñ ÑÐ¼ÐµÑÐ°Ð½Ð¾Ñ"],equipEn:["Large pot","Dutch oven","Bowl","Pan"],equipUk:["ÐÐµÐ»Ð¸ÐºÐ° ÐºÐ°ÑÑÑÑÐ»Ñ","ÐÐ°ÑÑÑÑÐ»Ñ Ð· ÐºÑÐ¸ÑÐºÐ¾Ñ","ÐÐ¸ÑÐºÐ°","Ð¡ÐºÐ¾Ð²Ð¾ÑÐ¾Ð´Ð°"]},
122:{diff:"easy",ingEn:["Cottage cheese 500g","Egg 1","Sugar 3 tbsp","Flour 3 tbsp","Vanilla","Butter","Sour cream & jam"],ingUk:["Ð¡Ð¸Ñ 500Ð³","Ð¯Ð¹ÑÐµ 1","Ð¦ÑÐºÐ¾Ñ 3 ÑÑ.Ð».","ÐÐ¾ÑÐ¾ÑÐ½Ð¾ 3 ÑÑ.Ð».","ÐÐ°Ð½ÑÐ»Ñ","ÐÐ°ÑÐ»Ð¾","Ð¡Ð¼ÐµÑÐ°Ð½Ð° ÑÐ° Ð²Ð°ÑÐµÐ½Ð½Ñ"],stepsEn:["Mix cheese, egg, sugar, vanilla","Add flour until holds shape","Form patties, dust flour","Fry in butter 3-4 min/side","Serve with cream & jam"],stepsUk:["ÐÐ¼ÑÑÐ°Ð¹ÑÐµ ÑÐ¸Ñ, ÑÐ¹ÑÐµ, ÑÑÐºÐ¾Ñ","ÐÐ¾Ð´Ð°Ð¹ÑÐµ Ð±Ð¾ÑÐ¾ÑÐ½Ð¾","Ð¡ÑÐ¾ÑÐ¼ÑÐ¹ÑÐµ, Ð¾Ð±Ð²Ð°Ð»ÑÐ¹ÑÐµ","Ð¡Ð¼Ð°Ð¶ÑÐµ 3-4 ÑÐ²/Ð±ÑÐº","ÐÐ¾Ð´Ð°Ð²Ð°Ð¹ÑÐµ Ð·Ñ ÑÐ¼ÐµÑÐ°Ð½Ð¾Ñ"],equipEn:["Non-stick pan","Bowl","Spatula"],equipUk:["Ð¡ÐºÐ¾Ð²Ð¾ÑÐ¾Ð´Ð°","ÐÐ¸ÑÐºÐ°","ÐÐ¾Ð¿Ð°ÑÐºÐ°"]},
123:{diff:"easy",ingEn:["Potatoes 6","Onion 1","Eggs 2","Flour 3 tbsp","Salt","Oil","Sour cream"],ingUk:["ÐÐ°ÑÑÐ¾Ð¿Ð»Ñ 6","Ð¦Ð¸Ð±ÑÐ»Ñ 1","Ð¯Ð¹ÑÑ 2","ÐÐ¾ÑÐ¾ÑÐ½Ð¾ 3 ÑÑ.Ð».","Ð¡ÑÐ»Ñ","ÐÐ»ÑÑ","Ð¡Ð¼ÐµÑÐ°Ð½Ð°"],stepsEn:["Grate potatoes & onion, squeeze","Mix with eggs, flour, salt","Heat oil","Fry 3-4 min each side","Serve hot with cream"],stepsUk:["ÐÐ°ÑÑÑÑÑ, Ð²ÑÐ´Ð¶Ð¼ÑÑÑ","ÐÐ¼ÑÑÐ°Ð¹ÑÐµ Ð· ÑÐ¹ÑÑÐ¼Ð¸, Ð±Ð¾ÑÐ¾ÑÐ½Ð¾Ð¼","Ð Ð¾Ð·ÑÐ³ÑÑÐ¹ÑÐµ Ð¾Ð»ÑÑ","Ð¡Ð¼Ð°Ð¶ÑÐµ 3-4 ÑÐ²/Ð±ÑÐº","ÐÐ¾Ð´Ð°Ð²Ð°Ð¹ÑÐµ Ð³Ð°ÑÑÑÐ¸Ð¼Ð¸"],equipEn:["Grater","Large pan","Bowl"],equipUk:["Ð¢ÐµÑÑÐºÐ°","Ð¡ÐºÐ¾Ð²Ð¾ÑÐ¾Ð´Ð°","ÐÐ¸ÑÐºÐ°"]},
124:{diff:"easy",ingEn:["Cornmeal 200g","Sour cream 400ml","Water 200ml","Bryndza 150g","Smoked bacon 200g","Butter 30g"],ingUk:["ÐÑÑÐ¿Ð° 200Ð³","Ð¡Ð¼ÐµÑÐ°Ð½Ð° 400Ð¼Ð»","ÐÐ¾Ð´Ð° 200Ð¼Ð»","ÐÑÐ¸Ð½Ð·Ð° 150Ð³","ÐÐµÐºÐ¾Ð½ 200Ð³","ÐÐ°ÑÐ»Ð¾ 30Ð³"],stepsEn:["Simmer cream + water","Add cornmeal slowly, stir","Cook 20-25 min low heat","Fry bacon crispy","Top with bryndza & bacon"],stepsUk:["Ð¡Ð¼ÐµÑÐ°Ð½Ð° + Ð²Ð¾Ð´Ð° Ð·Ð°ÐºÐ¸Ð¿ÑÑÑ","ÐÑÐ¸Ð¿ÑÐµ ÐºÑÑÐ¿Ñ, Ð¼ÑÑÐ°Ð¹ÑÐµ","20-25 ÑÐ² Ð½Ð° Ð¼Ð°Ð»Ð¾Ð¼Ñ","ÐÐ±ÑÐ¼Ð°Ð¶ÑÐµ Ð±ÐµÐºÐ¾Ð½","ÐÑÐ¸Ð½Ð·Ð° ÑÐ° Ð±ÐµÐºÐ¾Ð½ Ð·Ð²ÐµÑÑÑ"],equipEn:["Heavy pot","Wooden spoon","Pan"],equipUk:["ÐÐ°ÑÑÑÑÐ»Ñ","ÐÐ¾Ð¶ÐºÐ°","Ð¡ÐºÐ¾Ð²Ð¾ÑÐ¾Ð´Ð°"]},
125:{diff:"medium",ingEn:["Flour 500g","Warm milk 250ml","Yeast 7g","Sugar 2 tbsp","Egg 1","Butter 50g","Garlic 6","Dill","Oil"],ingUk:["ÐÐ¾ÑÐ¾ÑÐ½Ð¾ 500Ð³","ÐÐ¾Ð»Ð¾ÐºÐ¾ 250Ð¼Ð»","ÐÑÑÐ¶Ð´Ð¶Ñ 7Ð³","Ð¦ÑÐºÐ¾Ñ 2 ÑÑ.Ð».","Ð¯Ð¹ÑÐµ 1","ÐÐ°ÑÐ»Ð¾ 50Ð³","Ð§Ð°ÑÐ½Ð¸Ðº 6","ÐÑÑÐ¿","ÐÐ»ÑÑ"],stepsEn:["Mix milk+yeast+sugar, wait 10min","Add flour, egg, butter, knead","Rise 1 hour","Form rolls close together","Rise 20 min, bake 180Â°C 25min","Coat with garlic-dill oil"],stepsUk:["ÐÐ¾Ð»Ð¾ÐºÐ¾+Ð´ÑÑÐ¶Ð´Ð¶Ñ+ÑÑÐºÐ¾Ñ, 10 ÑÐ²","ÐÐ¾ÑÐ¾ÑÐ½Ð¾, ÑÐ¹ÑÐµ, Ð¼Ð°ÑÐ»Ð¾","ÐÑÐ´ÑÑÐ´ 1 Ð³Ð¾Ð´Ð¸Ð½Ð°","Ð¡ÑÐ¾ÑÐ¼ÑÐ¹ÑÐµ Ð±ÑÐ»Ð¾ÑÐºÐ¸","20 ÑÐ² + 180Â°C 25 ÑÐ²","Ð§Ð°ÑÐ½Ð¸ÐºÐ¾Ð²Ð° Ð¾Ð»ÑÑ Ð·Ð²ÐµÑÑÑ"],equipEn:["Baking tray","Bowl","Oven","Mortar"],equipUk:["ÐÐµÐºÐ¾","ÐÐ¸ÑÐºÐ°","ÐÑÑÐ¾Ð²ÐºÐ°","Ð¡ÑÑÐ¿ÐºÐ°"]}
};

const deliveryLinks=[
{name:"Glovo",icon:"ð¡",color:"#F9C50B",url:"https://glovoapp.com/ua/en/kyiv-right-bank/store/"},
{name:"Silpo",icon:"ðµ",color:"#2196F3",url:"https://shop.silpo.ua/"},
{name:"Zakaz.ua",icon:"ð¢",color:"#4CAF50",url:"https://zakaz.ua/uk/"},
{name:"Bolt Food",icon:"ð©",color:"#34D186",url:"https://food.bolt.eu/en-US/"}
];

/* -- UI COMPONENTS -- */
const Chip=({label,active,onClick,color})=><button onClick={onClick} style={{background:active?(color?`${color}22`:"rgba(162,89,255,0.2)"):"rgba(255,255,255,0.05)",border:active?`1px solid ${color||"rgba(162,89,255,0.4)"}`:"1px solid rgba(255,255,255,0.07)",borderRadius:20,padding:"7px 16px",color:active?(color||"#c9a0ff"):"#8b86a3",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",whiteSpace:"nowrap"}}>{label}</button>;
const Badge=({children,bg})=><span style={{background:bg||"rgba(162,89,255,0.85)",borderRadius:7,padding:"3px 9px",fontSize:11,fontWeight:700,color:"#fff"}}>{children}</span>;

function Card({a,lang,t,onClick}){const ci=imgs[a.c]||imgs.entertainment;const img=ci[a.id%ci.length];
return(<div onClick={onClick} style={{borderRadius:16,overflow:"hidden",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.06)",cursor:"pointer",transition:"transform 0.2s"}} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.01)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}><div style={{position:"relative"}}><img src={img} alt="" style={{width:"100%",height:160,objectFit:"cover",display:"block"}}/><div style={{position:"absolute",top:10,left:10,display:"flex",gap:6,flexWrap:"wrap"}}><Badge>{a.tm}</Badge><Badge bg={CC[a.c]+"cc"}>{IC[a.c]} {t.cats[a.c]}</Badge></div><div style={{position:"absolute",bottom:0,left:0,right:0,background:"linear-gradient(transparent,rgba(0,0,0,0.65))",padding:"28px 14px 10px",display:"flex",gap:8,alignItems:"center"}}>{a.p>0?<Badge bg="rgba(62,207,142,0.8)">{t.from} {a.p} â´</Badge>:<Badge bg="rgba(62,207,142,0.8)">{t.free}</Badge>}</div></div><div style={{padding:"12px 14px"}}><div style={{fontSize:15,fontWeight:700,color:"#fff",marginBottom:4}}>{a[lang]}</div><div style={{fontSize:12,color:"#8b86a3"}}>ð {a.v} Â· {a.s}</div>{a.c==="cooking"&&<div style={{marginTop:6,fontSize:11,color:"#ff8a50",fontWeight:600}}>{lang==="en"?"Tap for recipe & delivery â":"ÐÐ°ÑÐ¸ÑÐ½ÑÑÑ Ð´Ð»Ñ ÑÐµÑÐµÐ¿ÑÑ ÑÐ° Ð´Ð¾ÑÑÐ°Ð²ÐºÐ¸ â"}</div>}</div></div>);}

/* -- RECIPE DETAIL PANEL -- */
function RecipeDetail({a,lang,t,onBack}){
  const r=RD[a.id];if(!r)return null;
  const c=t.cook;const dc={easy:"#3ecf8e",medium:"#f7b731",hard:"#ff6b6b"};
  return(<div>
    <button onClick={onBack} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:10,padding:"6px 14px",color:"#8b86a3",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",marginBottom:16}}>â {t.backBtn}</button>
    <img src={(imgs.cooking||[""])[0]} alt="" style={{width:"100%",height:180,objectFit:"cover",borderRadius:18,marginBottom:16}}/>
    <h2 style={{fontFamily:"'Outfit',sans-serif",fontSize:22,fontWeight:800,color:"#fff",margin:"0 0 8px"}}>{a[lang]}</h2>
    <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}><Badge bg="rgba(162,89,255,0.4)">â± {a.tm}</Badge><Badge bg="rgba(62,207,142,0.4)">ð¥ {a.g.length>1?a.g.join("/"):a.g[0]}</Badge><Badge bg={dc[r.diff]+"66"}>{c[r.diff]}</Badge></div>

    <div style={{background:"rgba(255,135,80,0.06)",border:"1px solid rgba(255,135,80,0.15)",borderRadius:16,padding:"16px",marginBottom:14}}>
      <h3 style={{fontSize:14,fontWeight:700,color:"#ff8a50",margin:"0 0 10px"}}>ð¥ {c.ingredients}</h3>
      {(lang==="en"?r.ingEn:r.ingUk).map((ing,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"4px 0"}}><span style={{width:5,height:5,borderRadius:"50%",background:"#ff8a50",flexShrink:0}}/><span style={{fontSize:13,color:"#dddaf0"}}>{ing}</span></div>))}
    </div>

    <div style={{background:"rgba(162,89,255,0.06)",border:"1px solid rgba(162,89,255,0.15)",borderRadius:16,padding:"16px",marginBottom:14}}>
      <h3 style={{fontSize:14,fontWeight:700,color:"#a259ff",margin:"0 0 10px"}}>ð§ {c.equipment}</h3>
      {(lang==="en"?r.equipEn:r.equipUk).map((eq,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"3px 0"}}><span style={{fontSize:11}}>â</span><span style={{fontSize:13,color:"#dddaf0"}}>{eq}</span></div>))}
    </div>

    <div style={{background:"rgba(62,207,142,0.06)",border:"1px solid rgba(62,207,142,0.15)",borderRadius:16,padding:"16px",marginBottom:14}}>
      <h3 style={{fontSize:14,fontWeight:700,color:"#3ecf8e",margin:"0 0 10px"}}>ð¨âð³ {c.steps}</h3>
      {(lang==="en"?r.stepsEn:r.stepsUk).map((st,i)=>(<div key={i} style={{display:"flex",gap:10,padding:"7px 0",borderBottom:i<r.stepsEn.length-1?"1px solid rgba(255,255,255,0.04)":"none"}}><span style={{width:22,height:22,borderRadius:"50%",background:"rgba(62,207,142,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#3ecf8e",flexShrink:0}}>{i+1}</span><span style={{fontSize:13,color:"#dddaf0",lineHeight:1.5}}>{st}</span></div>))}
    </div>

    <div style={{background:"rgba(247,183,49,0.06)",border:"1px solid rgba(247,183,49,0.15)",borderRadius:16,padding:"16px",marginBottom:32}}>
      <h3 style={{fontSize:14,fontWeight:700,color:"#f7b731",margin:"0 0 10px"}}>ð {c.orderVia}</h3>
      {deliveryLinks.map(dl=>(<a key={dl.name} href={dl.url} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,0.04)",textDecoration:"none"}}><span style={{fontSize:20}}>{dl.icon}</span><span style={{fontSize:13,fontWeight:600,color:"#fff",flex:1}}>{dl.name}</span><span style={{background:dl.color,borderRadius:8,padding:"5px 12px",fontSize:11,fontWeight:700,color:"#fff"}}>{lang==="en"?"Order":"ÐÐ°Ð¼Ð¾Ð²Ð¸ÑÐ¸"} â</span></a>))}
    </div>
  </div>);
}

/* -- HOME PAGE -- */
function HomePage({lang,T:t,A:allVenues,CC:cc,IC:ic,SC:sc,setPage,userLoc,requestGeo,geoStatus}){
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
const avCats=useMemo(()=>{const counts={};allVenues.forEach(v=>{const k=CAT_REMAP[v.c]||v.c;if(cc[k])counts[k]=(counts[k]||0)+1;});return counts;},[allVenues,grp,tempo]);
const subResults=useMemo(()=>{if(!cat||!sc[cat])return{};const rc=Object.entries(CAT_REMAP).find(([,v])=>v===cat);const dataKey=rc?rc[0]:cat;const filtered=allVenues.filter(v=>v.c===dataKey);const groups={};Object.entries(sc[cat]).forEach(([key,val])=>{const items=filtered.filter(v=>v.s===key);if(items.length>0)groups[key]={...val,items};});return groups;},[allVenues,grp,tempo,cat,sc]);
const results=useMemo(()=>{let filtered=allVenues.filter(v=>true&&(CAT_REMAP[v.c]||v.c)===cat);if(subcat&&sc[cat]&&sc[cat][subcat]){filtered=filtered.filter(v=>v.s===subcat);}return filtered.sort((a,b)=>{if(sortBy==="dist"&&userLoc){var da=hav(userLoc[0],userLoc[1],a.lat,a.lng),db=hav(userLoc[0],userLoc[1],b.lat,b.lng);return(da-db)*dir;}if(sortBy==="price")return(a.p-b.p)*dir;return a[lang].localeCompare(b[lang])*dir;});},[allVenues,grp,tempo,cat,subcat,sortBy,dir,lang,sc,userLoc]);
const slideAnim=animDir>0?"slideIn":"slideOut";
const slideStyle={animation:`${slideAnim} 0.3s ease`};
if(selVenue){const v=selVenue;return(<div style={{padding:20,maxWidth:600,margin:"0 auto"}}><button onClick={()=>setSelVenue(null)} style={{background:"none",border:"none",color:"#a78bfa",fontSize:16,cursor:"pointer",marginBottom:16}}>{"\u2190 "+(lang==="uk"?"\u041D\u0430\u0437\u0430\u0434":"Back")}</button><h2 style={{fontSize:28,fontWeight:700,color:"#fff",marginBottom:8}}>{v[lang]}</h2><p style={{color:"#a78bfa",fontSize:14,marginBottom:4}}>{ic[v.c]} {v.v}</p><p style={{color:"#9ca3af",fontSize:14,marginBottom:4}}>{lang==="uk"?"\u0426\u0456\u043D\u0430":"Price"}: {v.p>0?v.p+(lang==="uk"?" \u0433\u0440\u043D":" UAH"):(lang==="uk"?"\u0411\u0435\u0437\u043A\u043E\u0448\u0442\u043E\u0432\u043D\u043E":"Free")}</p>{v.tm&&<p style={{color:"#9ca3af",fontSize:14,marginBottom:4}}>{lang==="uk"?"\u0427\u0430\u0441":"Time"}: {v.tm}</p>}{v.s&&<p style={{color:"#9ca3af",fontSize:14}}>{lang==="uk"?"\u0413\u0440\u0430\u0444\u0456\u043A":"Schedule"}: {v.s}</p>}</div>);}
const W=({children})=><div style={{...slideStyle,padding:"40px 20px",maxWidth:500,margin:"0 auto",textAlign:"center"}}>{children}</div>;
const Hdr=({text})=><div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>{step>0&&<button onClick={prev} style={{background:"none",border:"none",color:"#a78bfa",fontSize:24,cursor:"pointer"}}>{"\u2190"}</button>}<h2 style={{fontSize:22,fontWeight:700,color:"#fff",margin:0}}>{text}</h2></div>;
const Opt=({label,icon,onClick,color})=><button onClick={onClick} style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"20px 8px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:16,color:"#fff",cursor:"pointer",fontSize:14,fontWeight:500,gap:8,minHeight:100,textAlign:"center",transition:"all 0.2s"}} onMouseEnter={e=>{e.currentTarget.style.background=color||"rgba(167,139,250,0.2)";e.currentTarget.style.borderColor=color||"#a78bfa";e.currentTarget.style.transform="scale(1.03)";}} onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.05)";e.currentTarget.style.borderColor="rgba(255,255,255,0.1)";e.currentTarget.style.transform="scale(1)";}}>{icon&&<span style={{fontSize:32,lineHeight:1}}>{icon}</span>}<span>{label}</span></button>;
const G=({children})=><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>{children}</div>
if(step===0)return(<W><p style={{color:"#a78bfa",fontSize:14,marginBottom:8}}>{t[lang].greeting()}</p><h2 style={{fontSize:32,fontWeight:800,color:"#fff",marginBottom:12,lineHeight:1.2}}>{lang==="uk"?"\u0413\u043E\u0442\u043E\u0432\u0456 \u0434\u043E \u043F\u0440\u0438\u0433\u043E\u0434 \u0432 \u041A\u0438\u0454\u0432\u0456?":"Ready for adventures in Kyiv?"}</h2><p style={{color:"#9ca3af",fontSize:14,marginBottom:32}}>{allVenues.length+(lang==="uk"?" \u0430\u043A\u0442\u0438\u0432\u043D\u043E\u0441\u0442\u0435\u0439 \u0443 \u041A\u0438\u0454\u0432\u0456 \u2014 \u0437\u043D\u0430\u0439\u0434\u0435\u043C\u043E \u0456\u0434\u0435\u0430\u043B\u044C\u043D\u0443 \u0440\u043E\u0437\u0432\u0430\u0433\u0443":" activities in Kyiv \u2014 find your perfect match")}</p><button onClick={()=>next(2)} style={{width:"100%",padding:"18px 32px",background:"linear-gradient(135deg,#7c3aed,#a78bfa)",border:"none",borderRadius:16,color:"#fff",fontSize:18,fontWeight:600,cursor:"pointer"}}>{lang==="uk"?"\u0417\u043D\u0430\u0439\u0434\u0435\u043C\u043E \u0449\u043E\u0441\u044C \u2192":"Let's find something \u2192"}</button>{!userLoc&&<button onClick={requestGeo} style={{marginTop:16,padding:"12px 24px",borderRadius:20,border:"1px solid rgba(168,85,247,0.3)",background:"rgba(168,85,247,0.1)",color:"#a78bfa",cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",gap:8,margin:"16px auto 0"}}>{geoStatus==="loading"?"â³":<span style={{fontSize:18}}>ð</span>}{geoStatus==="loading"?(lang==="uk"?"ÐÐ¸Ð·Ð½Ð°ÑÐ°ÑÐ¼Ð¾...":"Locating..."):(lang==="uk"?"ÐÐ¸Ð·Ð½Ð°ÑÐ¸ÑÐ¸ Ð¼Ð¾Ñ Ð¼ÑÑÑÐµ":"Find my location")}</button>}{userLoc&&<div style={{marginTop:16,padding:"10px 20px",borderRadius:20,background:"rgba(34,197,94,0.1)",border:"1px solid rgba(34,197,94,0.3)",color:"#4ade80",fontSize:13,display:"flex",alignItems:"center",gap:8,justifyContent:"center"}}><span style={{fontSize:16}}>â</span>{lang==="uk"?"ÐÑÑÑÐµÐ·Ð½Ð°ÑÐ¾Ð´Ð¶ÐµÐ½Ð½Ñ Ð²Ð¸Ð·Ð½Ð°ÑÐµÐ½Ð¾":"Location found"}</div>}{geoStatus==="denied"&&<div style={{marginTop:12,color:"#f87171",fontSize:12,textAlign:"center"}}>{lang==="uk"?"ÐÐµÐ¾Ð»Ð¾ÐºÐ°ÑÑÑ Ð·Ð°Ð±Ð»Ð¾ÐºÐ¾Ð²Ð°Ð½Ð¾. ÐÐ¾Ð·Ð²Ð¾Ð»ÑÑÐµ Ð² Ð½Ð°Ð»Ð°ÑÑÑÐ²Ð°Ð½Ð½ÑÑ Ð±ÑÐ°ÑÐ·ÐµÑÐ°":"Location blocked. Allow in browser settings"}</div>}</W>);
if(step===2)return(<W><Hdr text={lang==="uk"?"\u042F\u043A\u0438\u0439 \u043D\u0430\u0441\u0442\u0440\u0456\u0439?":"What's the mood?"}/><G><Opt label={lang==="uk"?"\u0410\u043A\u0442\u0438\u0432\u043D\u0438\u0439":"Active"} icon={"â¡"} onClick={()=>{setTempo("active");next(3);}}/><Opt label={lang==="uk"?"\u0421\u043F\u043E\u043A\u0456\u0439\u043D\u0438\u0439":"Calm"} icon="ð¿" onClick={()=>{setTempo("passive");next(3);}}/><Opt label={lang==="uk"?"\u041D\u0435 \u0432\u0430\u0436\u043B\u0438\u0432\u043E":"Doesn't matter"} icon="ð¤·" onClick={()=>{setTempo(null);next(3);}}/></G></W>);
if(step===3){const moodList=tempo?MOOD_CATS[tempo]:null;const dataCats=Object.entries(avCats).filter(([k])=>!moodList||moodList.includes(k)).map(([k,cnt])=>({key:k,name:t[lang].cats[k],cnt,stub:false}));const stubKeys=(moodList||[]).filter(k=>STUB_CATS.has(k)&&!avCats[k]);const stubs=stubKeys.map(k=>({key:k,name:t[lang].cats[k],cnt:0,stub:true}));const cats=[...dataCats,...stubs];return(<W><Hdr text={lang==="uk"?"\u0429\u043E \u0442\u044F\u0431\u0435 \u0446\u0456\u043A\u0430\u0432\u0438\u0442\u044C?":"What are you in the mood for?"}/><G>{cats.map(c=>c.stub?<button key={c.key} style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"20px 8px",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:16,color:"rgba(255,255,255,0.3)",cursor:"default",fontSize:14,fontWeight:500,gap:8,minHeight:100,textAlign:"center",opacity:0.5}}><span style={{fontSize:32,lineHeight:1}}>{ic[c.key]}</span><span>{c.name}</span><span style={{fontSize:10,color:"rgba(255,255,255,0.2)"}}>{"\u0421\u043A\u043E\u0440\u043E"}</span></button>:<Opt key={c.key} label={`${c.name} (${c.cnt})`} icon={ic[c.key]} color={cc[c.key]} onClick={()=>{setCat(c.key);next(4);}}/>)}</G></W>);}
if(step===4){const subs=Object.entries(subResults);return(<W><Hdr text={(lang==="uk"?t[lang].cats[cat]:cat.charAt(0).toUpperCase()+cat.slice(1))+" \u2014 "+(lang==="uk"?"\u043F\u0456\u0434\u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0456\u0457":"subcategories")}/><G><Opt label={lang==="uk"?"\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u0438 \u0432\u0441\u0435":"Show all"} icon="ð" onClick={()=>{setSubcat(null);next(5);}}/>{subs.map(([key,val])=><Opt key={key} label={(lang==="uk"?val.uk:val.en)+" ("+val.items.length+")"} icon={val.ic} onClick={()=>{setSubcat(key);next(5);}}/>)}</G></W>);}
if(step===5)return(<W><Hdr text={(lang==="uk"?t[lang].cats[cat]:cat.charAt(0).toUpperCase()+cat.slice(1))+(subcat&&sc[cat]&&sc[cat][subcat]?" \u2014 "+(lang==="uk"?sc[cat][subcat].uk:sc[cat][subcat].en):"")}/><div style={{display:"flex",gap:8,marginBottom:16,justifyContent:"center"}}><button onClick={()=>{setSortBy("name");setDir(1);}} style={{padding:"8px 16px",borderRadius:8,border:"1px solid "+(sortBy==="name"?"#a78bfa":"rgba(255,255,255,0.1)"),background:sortBy==="name"?"rgba(167,139,250,0.2)":"transparent",color:"#fff",cursor:"pointer",fontSize:13}}>{lang==="uk"?"\u0417\u0430 \u043D\u0430\u0437\u0432\u043E\u044E":"By name"}</button><button onClick={()=>{setSortBy("price");setDir(d=>d*-1);}} style={{padding:"8px 16px",borderRadius:8,border:"1px solid "+(sortBy==="price"?"#a78bfa":"rgba(255,255,255,0.1)"),background:sortBy==="price"?"rgba(167,139,250,0.2)":"transparent",color:"#fff",cursor:"pointer",fontSize:13}}>{lang==="uk"?"\u0417\u0430 \u0446\u0456\u043D\u043E\u044E":"By price"} {sortBy==="price"?(dir===1?"\u2191":"\u2193"):""}</button>{userLoc&&<button onClick={()=>{if(sortBy==="dist")setDir(d=>d*-1);else{setSortBy("dist");setDir(1);}}} style={{padding:"6px 14px",borderRadius:20,border:sortBy==="dist"?"1px solid #a855f7":"1px solid rgba(255,255,255,0.15)",background:sortBy==="dist"?"rgba(168,85,247,0.15)":"rgba(255,255,255,0.05)",color:"#fff",cursor:"pointer",fontSize:13}}>{lang==="uk"?"\u0411\u043B\u0438\u0436\u0447\u0435":"Nearby"} {sortBy==="dist"?(dir===1?"\u2191":"\u2193"):""}</button>}</div><p style={{color:"#9ca3af",fontSize:13,marginBottom:12}}>{lang==="uk"?"\u0417\u043D\u0430\u0439\u0434\u0435\u043D\u043E":"Found"}: {results.length}</p>{results.map(v=><div key={v.id} onClick={()=>setSelVenue(v)} style={{padding:"14px 16px",marginBottom:8,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,cursor:"pointer",textAlign:"left",transition:"all 0.2s"}} onMouseEnter={e=>{e.currentTarget.style.background="rgba(167,139,250,0.15)";}} onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.05)";}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{color:"#fff",fontSize:15,fontWeight:500}}>{ic[v.c]} {v[lang]}</span><span style={{color:"#a78bfa",fontSize:13}}>{v.p>0?v.p+(lang==="uk"?" \u0433\u0440\u043D":" UAH"):(lang==="uk"?"\u0411\u0435\u0437\u043A\u043E\u0448\u0442\u043E\u0432\u043D\u043E":"Free")}</span></div><div style={{color:"#6b7280",fontSize:12,marginTop:4}}>{v.v}{v.s?" \u00B7 "+v.s:""}</div>{v.addr&&<div style={{color:"#9ca3af",fontSize:11,marginTop:3,display:"flex",alignItems:"center",gap:4}}><span style={{color:"#a855f7"}}>ð</span>{v.addr}</div>}{userLoc&&v.lat&&<div style={{color:"#a855f7",fontSize:11,marginTop:3,fontWeight:500}}>{hav(userLoc[0],userLoc[1],v.lat,v.lng)<1?(hav(userLoc[0],userLoc[1],v.lat,v.lng)*1000).toFixed(0)+" "+(lang==="uk"?"\u043C":"m"):hav(userLoc[0],userLoc[1],v.lat,v.lng).toFixed(1)+" "+(lang==="uk"?"\u043A\u043C":"km")}</div>}</div>)}</W>);
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
    if(dNorm.getTime()===today.getTime()) return lang==="en"?"Today":"Ð¡ÑÐ¾Ð³Ð¾Ð´Ð½Ñ";
    if(dNorm.getTime()===tom.getTime()) return lang==="en"?"Tomorrow":"ÐÐ°Ð²ÑÑÐ°";
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
                  <span style={{fontSize:10}}>ð</span>
                  <span style={{fontSize:12,fontWeight:600,color:"#c4c0d8"}}>{cin.name}</span>
                  {j===0 && i===0 && <span style={{fontSize:9,color:"#6b6782",marginLeft:4}}>{lang==="en"?"tap time to buy":"Ð½Ð°ÑÐ¸ÑÐ½ÑÑÑ ÑÐ°Ñ Ð´Ð»Ñ ÐºÑÐ¿ÑÐ²Ð»Ñ"}</span>}
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
            {isE ? (lang==="en"?"Show less":"ÐÐ³Ð¾ÑÐ½ÑÑÐ¸") : (lang==="en"?"+ "+(cl.length-3)+" more cinemas":"Ð©Ðµ "+(cl.length-3)+" ÐºÑÐ½Ð¾ÑÐµÐ°ÑÑÑÐ²")}
          </button>}
        </div>
      </div>
    );
  }

  if(loading && !data) return (<div style={{textAlign:"center",padding:"40px 20px"}}><div style={{fontSize:24,marginBottom:12,animation:"pulse 1.5s infinite"}}>ð¬</div><p style={{fontSize:13,color:"#8b86a3"}}>{lang==="en"?"Loading showtimes...":"ÐÐ°Ð²Ð°Ð½ÑÐ°Ð¶ÐµÐ½Ð½Ñ ÑÐµÐ°Ð½ÑÑÐ²..."}</p></div>);
  if(error && !data) return (<div style={{textAlign:"center",padding:"40px 20px"}}><p style={{fontSize:13,color:"#ff6b6b",marginBottom:12}}>{lang==="en"?"Could not load showtimes":"ÐÐµ Ð²Ð´Ð°Ð»Ð¾ÑÑ Ð·Ð°Ð²Ð°Ð½ÑÐ°Ð¶Ð¸ÑÐ¸ ÑÐµÐ°Ð½ÑÐ¸"}</p><button onClick={fetchData} style={{background:"rgba(247,183,49,0.15)",border:"1px solid rgba(247,183,49,0.3)",borderRadius:10,padding:"8px 20px",color:"#f7b731",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>{lang==="en"?"Retry":"Ð¡Ð¿ÑÐ¾Ð±ÑÐ²Ð°ÑÐ¸ Ð·Ð½Ð¾Ð²Ñ"}</button></div>);

  return (
    <div>
      <div style={{display:"flex",alignItems:"center",gap:8,margin:"0 0 10px"}}>
        <p style={{fontSize:10,color:"#4d4a60",margin:0}}>{lang==="en"?"Live showtimes from multiplex.ua":"Ð¡ÐµÐ°Ð½ÑÐ¸ Ð· multiplex.ua Ð² ÑÐµÐ°Ð»ÑÐ½Ð¾Ð¼Ñ ÑÐ°ÑÑ"}</p>
        {loading && <span style={{fontSize:9,color:"#f7b731",animation:"pulse 1.5s infinite"}}>â³</span>}
        {updatedAt && <span style={{fontSize:9,color:"#3d3a50",marginLeft:"auto"}}>{updatedAt.toLocaleTimeString(lang==="en"?"en-US":"uk-UA",{hour:"2-digit",minute:"2-digit"})}</span>}
      </div>
      <div style={{display:"flex",gap:8,overflowX:"auto",marginBottom:16,scrollbarWidth:"none"}}>
        {dates.map(function(d,i){
          var isActive=i===dayIdx;
          return (<button key={d} onClick={function(){setDayIdx(i);setExpanded(null)}} style={{background:isActive?"rgba(247,183,49,0.2)":"rgba(255,255,255,0.05)",border:isActive?"1px solid rgba(247,183,49,0.4)":"1px solid rgba(255,255,255,0.07)",borderRadius:20,padding:"7px 16px",color:isActive?"#f7b731":"#8b86a3",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",whiteSpace:"nowrap"}}>{formatDateLabel(d,i)}</button>);
        })}
      </div>
      {movies.length===0?(<div style={{textAlign:"center",padding:"30px 20px"}}><p style={{fontSize:13,color:"#6b6782"}}>{lang==="en"?"No showtimes for this day":"ÐÐµÐ¼Ð°Ñ ÑÐµÐ°Ð½ÑÑÐ² Ð½Ð° ÑÐµÐ¹ Ð´ÐµÐ½Ñ"}</p></div>):(<div style={{marginBottom:16}}>{movies.map(renderMovie)}</div>)}
      <div style={{display:"flex",justifyContent:"center",marginBottom:16}}>
        <button onClick={fetchData} style={{background:"rgba(247,183,49,0.08)",border:"1px solid rgba(247,183,49,0.15)",borderRadius:10,padding:"8px 20px",color:"#f7b731",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",gap:6}}>
          <span>â³</span> {lang==="en"?"Refresh showtimes":"ÐÐ½Ð¾Ð²Ð¸ÑÐ¸ ÑÐµÐ°Ð½ÑÐ¸"}
        </button>
      </div>
      <div style={{marginBottom:28}}>
        <h3 style={{fontFamily:"'Outfit',sans-serif",fontSize:14,fontWeight:700,color:"#dddaf0",marginBottom:10}}>{lang==="en"?"Buy Tickets":"ÐÑÐ¿Ð¸ÑÐ¸ ÐºÐ²Ð¸ÑÐºÐ¸"}</h3>
        {[{n:"Multiplex",u:"https://multiplex.ua/",d:lang==="en"?"All Kyiv locations":"Ð£ÑÑ ÐºÑÐ½Ð¾ÑÐµÐ°ÑÑÐ¸ ÐÐ¸ÑÐ²Ð°",c:"#a259ff"},{n:"Planeta Kino",u:"https://planetakino.ua/",d:"IMAX, 4DX, RE'LUX",c:"#e84393"},{n:"Oscar",u:"https://oskar.kyiv.ua/",d:"Gulliver, Smart Plaza",c:"#4fc3f7"},{n:"Zhovten",u:"https://zhovten-kino.kyiv.ua/",d:lang==="en"?"Art-house":"ÐÑÑ-ÑÐ°ÑÑ",c:"#3ecf8e"}].map(function(tk){
          return (
            <a key={tk.n} href={tk.u} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:10,background:tk.c+"08",border:"1px solid "+tk.c+"22",borderRadius:12,padding:"10px 12px",textDecoration:"none",marginBottom:6}}>
              <span style={{fontSize:16}}>ð¬</span>
              <div style={{flex:1}}>
                <div style={{fontSize:12,fontWeight:700,color:"#fff"}}>{tk.n}</div>
                <div style={{fontSize:10,color:"#8b86a3"}}>{tk.d}</div>
              </div>
              <span style={{background:tk.c,borderRadius:6,padding:"4px 10px",fontSize:10,fontWeight:700,color:"#fff"}}>{lang==="en"?"Tickets":"ÐÐ²Ð¸ÑÐºÐ¸"} â</span>
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
function EventsPage({t,lang}){const[cf,setCf]=useState("all");const allCats=[...new Set(A.map(a=>a.c))];const filtered=cf==="all"?A:A.filter(a=>a.c===cf);return(<div style={{padding:"0 20px"}}><h1 style={{fontFamily:"'Outfit',sans-serif",fontSize:26,fontWeight:800,color:"#fff",margin:"10px 0 4px"}}>{t.eventsTitle}</h1><p style={{fontSize:13,color:"#6b6782",margin:"0 0 16px"}}>{t.eventsSubtitle}</p><div style={{display:"flex",gap:8,overflowX:"auto",marginBottom:20,paddingBottom:4,scrollbarWidth:"none"}}><Chip label={t.allFilter} active={cf==="all"} onClick={()=>setCf("all")}/>{allCats.map(c=>(<Chip key={c} label={`${IC[c]} ${t.cats[c]}`} active={cf===c} onClick={()=>setCf(c)} color={CC[c]}/>))}</div><p style={{fontSize:14,fontWeight:700,color:"#dddaf0",marginBottom:14}}>{filtered.length} {lang==="en"?"activities":"Ð°ÐºÑÐ¸Ð²Ð½Ð¾ÑÑÐµÐ¹"}</p><div style={{display:"flex",flexDirection:"column",gap:14,marginBottom:32}}>{filtered.map(a=>(<Card key={a.id} a={a} lang={lang} t={t}/>))}</div></div>);}


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
cinema:{uk:"ÐÑÐ½Ð¾ÑÐµÐ°ÑÑÐ¸",en:"Cinemas",ico:"ð¬",col:"#e74c3c"},
theater:{uk:"Ð¢ÐµÐ°ÑÑÐ¸",en:"Theaters",ico:"ð­",col:"#9b59b6"},
museum:{uk:"ÐÑÐ·ÐµÑ",en:"Museums",ico:"ðï¸",col:"#3498db"},
concerts:{uk:"ÐÐ¾Ð½ÑÐµÑÑÐ¸",en:"Concerts",ico:"ðµ",col:"#e67e22"},
books:{uk:"ÐÐ½Ð¸Ð¶ÐºÐ¾Ð²Ñ",en:"Books",ico:"ð",col:"#1abc9c"},
nightlife:{uk:"ÐÐ»ÑÐ±Ð¸",en:"Clubs",ico:"ð",col:"#8e44ad"},
hookah:{uk:"ÐÐ°Ð»ÑÑÐ½Ð½Ñ",en:"Hookah",ico:"ð¨",col:"#95a5a6"},
karaoke:{uk:"ÐÐ°ÑÐ°Ð¾ÐºÐµ",en:"Karaoke",ico:"ð¤",col:"#e91e63"},
bowling:{uk:"ÐÐ¾ÑÐ»ÑÐ½Ð³",en:"Bowling",ico:"ð³",col:"#2ecc71"},
karting:{uk:"ÐÐ°ÑÑÐ¸Ð½Ð³",en:"Karting",ico:"ðï¸",col:"#f39c12"},
climbing:{uk:"Ð¡ÐºÐ°Ð»Ð¾Ð´ÑÐ¾Ð¼Ð¸",en:"Climbing",ico:"ð§",col:"#00bcd4"},
quests:{uk:"ÐÐ²ÐµÑÑÐ¸",en:"Quests",ico:"ð",col:"#ff5722"},
boardgames:{uk:"ÐÐ°ÑÑÑÐ»ÐºÐ¸",en:"Board Games",ico:"ð²",col:"#607d8b"},
water:{uk:"ÐÐµÐ¹ÐºÐ±Ð¾ÑÐ´",en:"Water",ico:"ð",col:"#03a9f4"},
trampoline:{uk:"ÐÐ°ÑÑÑÐ¸",en:"Trampoline",ico:"ð¤¸",col:"#ff9800"},
vr:{uk:"VR",en:"VR",ico:"ð®",col:"#673ab7"},
spa:{uk:"Ð¡Ð¿Ð°/Ð¡Ð°ÑÐ½Ð¸",en:"Spa",ico:"ð",col:"#ec407a"},
creative:{uk:"Ð¢Ð²Ð¾ÑÑÑ",en:"Creative",ico:"ð¨",col:"#26a69a"},
parks:{uk:"ÐÐ°ÑÐºÐ¸",en:"Parks",ico:"ð³",col:"#4caf50"},
food:{uk:"Ð ÐµÑÑÐ¾ÑÐ°Ð½Ð¸",en:"Food",ico:"ð½ï¸",col:"#ff7043"},
coffee:{uk:"ÐÐ°Ð²'ÑÑÐ½Ñ",en:"Coffee",ico:"â",col:"#8d6e63"},
dance:{uk:"Ð¢Ð°Ð½ÑÑ",en:"Dance",ico:"ð",col:"#ab47bc"},
shooting:{uk:"Ð¡ÑÑÑÐ»ÑÐ±Ð¸ÑÐ°",en:"Shooting",ico:"ð¯",col:"#78909c"}
};
var V=[
{n:"Multiplex Lavina",a:"Ð¿ÑÐ¾ÑÐ¿. ÐÐµÑÐµÑÑÐµÐ¹ÑÑÐºÐ¸Ð¹, 87Ð",lat:50.4583,lng:30.3959,c:"cinema"},
{n:"Multiplex Retroville",a:"Ð¿ÑÐ¾ÑÐ¿. ÐÐ°Ð½Ð´ÐµÑÐ¸, 34Ð",lat:50.4875,lng:30.4133,c:"cinema"},
{n:"Planeta Kino IMAX",a:"ÐÐ½ÑÐ¿ÑÐ¾Ð²ÑÑÐºÐ° Ð½Ð°Ð±., 12",lat:50.4268,lng:30.5635,c:"cinema"},
{n:"Oscar (Gulliver)",a:"Ð¿ÑÐ¾ÑÐ¿. ÐÐµÑÐµÐ¼Ð¾Ð³Ð¸, 6",lat:50.4380,lng:30.5234,c:"cinema"},
{n:"ÐÐ¾Ð²ÑÐµÐ½Ñ",a:"Ð²ÑÐ». ÐÐ¾ÑÑÑÐ½ÑÐ¸Ð½ÑÐ²ÑÑÐºÐ°, 26",lat:50.4627,lng:30.5106,c:"cinema"},
{n:"Multiplex Prospect",a:"Ð¿ÑÐ¾ÑÐ¿. ÐÐµÑÐµÐ¼Ð¾Ð³Ð¸, 55",lat:50.4500,lng:30.4540,c:"cinema"},
{n:"Ð¢ÐµÐ°ÑÑ Ð¤ÑÐ°Ð½ÐºÐ°",a:"Ð²ÑÐ». ÐÐ²Ð°Ð½Ð° Ð¤ÑÐ°Ð½ÐºÐ°, 3",lat:50.4432,lng:30.5189,c:"theater"},
{n:"Ð¢ÐµÐ°ÑÑ ÐÐµÑÑ Ð£ÐºÑÐ°ÑÐ½ÐºÐ¸",a:"Ð²ÑÐ». Ð¥Ð¼ÐµÐ»ÑÐ½Ð¸ÑÑÐºÐ¾Ð³Ð¾, 5",lat:50.4445,lng:30.5230,c:"theater"},
{n:"ÐÐ°ÑÑÐ¾Ð½Ð°Ð»ÑÐ½Ð° Ð¾Ð¿ÐµÑÐ°",a:"Ð²ÑÐ». ÐÐ¾Ð»Ð¾Ð´Ð¸Ð¼Ð¸ÑÑÑÐºÐ°, 50",lat:50.4490,lng:30.5125,c:"theater"},
{n:"Ð¢ÐµÐ°ÑÑ Ð½Ð° ÐÐ¾Ð´Ð¾Ð»Ñ",a:"ÐÐ½Ð´ÑÑÑÐ²ÑÑÐºÐ¸Ð¹ ÑÐ·Ð²ÑÐ·, 20Ð",lat:50.4600,lng:30.5165,c:"theater"},
{n:"ÐÐ¾Ð»Ð¾Ð´Ð¸Ð¹ ÑÐµÐ°ÑÑ",a:"Ð²ÑÐ». ÐÑÐ¾ÑÑÐ·Ð½Ð°, 17",lat:50.4475,lng:30.5175,c:"theater"},
{n:"ÐÐ°ÑÑÐ¾Ð½Ð°Ð»ÑÐ½Ð¸Ð¹ Ð¼ÑÐ·ÐµÐ¹ ÑÑÑÐ¾ÑÑÑ",a:"Ð²ÑÐ». ÐÐ¾Ð»Ð¾Ð´Ð¸Ð¼Ð¸ÑÑÑÐºÐ°, 2",lat:50.4548,lng:30.5172,c:"museum"},
{n:"PinchukArtCentre",a:"Ð²ÑÐ». ÐÐ°ÑÑÐµÐ¹Ð½Ð°/ÐÐ°ÑÐµÐ¹Ð½Ð°, 1-3",lat:50.4400,lng:30.5215,c:"museum"},
{n:"ÐÐ¸ÑÑÐµÑÑÐºÐ¸Ð¹ ÐÑÑÐµÐ½Ð°Ð»",a:"Ð²ÑÐ». ÐÐ°Ð²ÑÑÑÐºÐ°, 10-12",lat:50.4335,lng:30.5410,c:"museum"},
{n:"ÐÐÐÐ",a:"Ð¿ÑÐ¾ÑÐ¿. ÐÐºÐ°Ð´ÐµÐ¼ÑÐºÐ° ÐÐ»ÑÑÐºÐ¾Ð²Ð°, 1",lat:50.3790,lng:30.4755,c:"museum"},
{n:"ÐÑÐ·ÐµÐ¹ Ð²Ð¾Ð´Ð¸",a:"Ð²ÑÐ». ÐÑÑÑÐµÐ²ÑÑÐºÐ¾Ð³Ð¾, 1Ð",lat:50.4515,lng:30.5285,c:"museum"},
{n:"ÐÐ¸ÑÐ²ÑÑÐºÐ¸Ð¹ ÐÐ»Ð°Ð½ÐµÑÐ°ÑÑÐ¹",a:"Ð²ÑÐ». ÐÐµÐ»Ð¸ÐºÐ° ÐÐ°ÑÐ¸Ð»ÑÐºÑÐ²ÑÑÐºÐ°, 57/3",lat:50.4355,lng:30.5175,c:"museum"},
{n:"Atlas",a:"Ð²ÑÐ». Ð¡ÑÑÐ¾Ð²Ð¸Ñ Ð¡ÑÑÑÐ»ÑÑÑÐ², 37-41",lat:50.4560,lng:30.4965,c:"concerts"},
{n:"Caribbean Club",a:"Ð²ÑÐ». ÐÐµÑÐ»ÑÑÐ¸, 4",lat:50.4397,lng:30.5060,c:"concerts"},
{n:"ÐÐ¾ÑÐºÐ° Ð½Ð° Ð¥ÑÐµÑÐ°ÑÐ¸ÐºÑ",a:"Ð¥ÑÐµÑÐ°ÑÐ¸Ðº, 19Ð",lat:50.4465,lng:30.5220,c:"concerts"},
{n:"Docker Pub",a:"Ð²ÑÐ». ÐÐ¾Ð³Ð°ÑÐ¸ÑÑÑÐºÐ°, 25",lat:50.4940,lng:30.4825,c:"concerts"},
{n:"ÐÐ½Ð¸Ð³Ð°ÑÐ½Ñ Ð",a:"Ð²ÑÐ». Ð¥ÑÐµÑÐ°ÑÐ¸Ðº, 46",lat:50.4475,lng:30.5210,c:"books"},
{n:"ÐÐ½Ð¸Ð³Ð¾Ð»Ð°Ð²",a:"Ð²ÑÐ». ÐÐ°Ð½ÑÐºÑÐ²ÑÑÐºÐ°, 2",lat:50.4395,lng:30.5105,c:"books"},
{n:"Ð¡ÐµÐ½Ñ ÐÑÐºÑÐ¾Ð¿",a:"Ð²ÑÐ». ÐÐµÐ»Ð¸ÐºÐ° ÐÐ°ÑÐ¸Ð»ÑÐºÑÐ²ÑÑÐºÐ°, 6",lat:50.4420,lng:30.5215,c:"books"},
{n:"Ð§Ð¸ÑÐ°Ð¹-Ð¼ÑÑÑÐ¾",a:"Ð²ÑÐ». ÐÐµÑÑ Ð£ÐºÑÐ°ÑÐ½ÐºÐ¸, 30Ð",lat:50.4310,lng:30.5380,c:"books"},
{n:"Closer",a:"Ð²ÑÐ». ÐÐ¸Ð¶Ð½ÑÐ¾ÑÑÐºÑÐ²ÑÑÐºÐ°, 31",lat:50.4655,lng:30.5035,c:"nightlife"},
{n:"CHI",a:"Ð²ÑÐ». ÐÐµÑÑÑÐ¸Ð½Ð½Ð°, 12",lat:50.4570,lng:30.5150,c:"nightlife"},
{n:"Skybar",a:"Ð²ÑÐ». ÐÐµÐ»Ð¸ÐºÐ° ÐÐ°ÑÐ¸Ð»ÑÐºÑÐ²ÑÑÐºÐ°, 5",lat:50.4430,lng:30.5220,c:"nightlife"},
{n:"D.Fleur",a:"Ð²ÑÐ». ÐÐµÑÐ½Ð¸ÐºÐ¾Ð²Ð°, 3",lat:50.4365,lng:30.5340,c:"nightlife"},
{n:"River Port",a:"ÐÐ°Ð±ÐµÑÐµÐ¶Ð½Ð¾-Ð¥ÑÐµÑÐ°ÑÐ¸ÑÑÐºÐ°, 2",lat:50.4570,lng:30.5290,c:"nightlife"},
{n:"ÐÐ°Ð³Ð¾Ð½",a:"ÐÐ°Ð±ÐµÑÐµÐ¶Ð½Ð¾-Ð¥ÑÐµÑÐ°ÑÐ¸ÑÑÐºÐ°, 12",lat:50.4575,lng:30.5310,c:"nightlife"},
{n:"Indigo Lounge",a:"Ð²ÑÐ». Ð¥ÑÐµÑÐ°ÑÐ¸Ðº, 15/4",lat:50.4480,lng:30.5200,c:"hookah"},
{n:"Hookah Place SkyBar",a:"Ð²ÑÐ». ÐÐµÐ»Ð¸ÐºÐ° ÐÐ°ÑÐ¸Ð»ÑÐºÑÐ²ÑÑÐºÐ°, 5",lat:50.4428,lng:30.5218,c:"hookah"},
{n:"ÐÑÑÐ° Lounge",a:"Ð²ÑÐ». Ð¡Ð°ÐºÑÐ°Ð³Ð°Ð½ÑÑÐºÐ¾Ð³Ð¾, 42",lat:50.4380,lng:30.5090,c:"hookah"},
{n:"Ð¢ÐµÐ¿Ð»Ð¾",a:"Ð²ÑÐ». ÐÐµÐ»Ð¸ÐºÐ° ÐÐ°ÑÐ¸Ð»ÑÐºÑÐ²ÑÑÐºÐ°, 52",lat:50.4370,lng:30.5185,c:"hookah"},
{n:"SplitKaraoke",a:"Ð²ÑÐ». ÐÑÐ¾ÑÑÐ·Ð½Ð°, 3",lat:50.4485,lng:30.5180,c:"karaoke"},
{n:"DÐ¾ÑÐ¾Ð³Ð¸ ÐÐ°ÑÐ°Ð¾ÐºÐµ",a:"Ð²ÑÐ». ÐÐ½ÑÐ¾Ð½Ð¾Ð²Ð¸ÑÐ°, 48",lat:50.4310,lng:30.5185,c:"karaoke"},
{n:"Vibes Karaoke",a:"Ð²ÑÐ». Ð¡Ð°ÐºÑÐ°Ð³Ð°Ð½ÑÑÐºÐ¾Ð³Ð¾, 7",lat:50.4415,lng:30.5140,c:"karaoke"},
{n:"Strike Bowling",a:"Ð¿ÑÐ¾ÑÐ¿. ÐÐµÑÐµÑÑÐµÐ¹ÑÑÐºÐ¸Ð¹, 87Ð",lat:50.4585,lng:30.3965,c:"bowling"},
{n:"Sam's Bowling",a:"Ð²ÑÐ». ÐÑÐ²Ð° Ð¢Ð¾Ð»ÑÑÐ¾Ð³Ð¾, 11Ð",lat:50.4390,lng:30.5140,c:"bowling"},
{n:"Le Mans Karting",a:"Ð²ÑÐ». ÐÐ¾Ð²Ð¾ÐºÐ¾ÑÑÑÐ½ÑÐ¸Ð½ÑÐ²ÑÑÐºÐ°, 1Ð",lat:50.4690,lng:30.4920,c:"karting"},
{n:"ProKart",a:"Ð²ÑÐ». ÐÐ¾ÑÐ¸ÑÐ¿ÑÐ»ÑÑÑÐºÐ°, 9",lat:50.4155,lng:30.6095,c:"karting"},
{n:"Climbing SPACE",a:"Ð²ÑÐ». ÐÐµÐ»Ð¸ÐºÐ° ÐÐ°ÑÐ¸Ð»ÑÐºÑÐ²ÑÑÐºÐ°, 100",lat:50.4285,lng:30.5135,c:"climbing"},
{n:"TATO climbing",a:"Ð²ÑÐ». ÐÐ°Ð±ÐµÑÐµÐ¶Ð½Ð¾-ÐÑÐ³Ð¾Ð²Ð°, 8",lat:50.4610,lng:30.4750,c:"climbing"},
{n:"QuestPlanet",a:"Ð²ÑÐ». Ð¥ÑÐµÑÐ°ÑÐ¸Ðº, 7/11",lat:50.4490,lng:30.5200,c:"quests"},
{n:"ÐÐ°Ð±ÑÑÐ¸Ð½ÑÐ¸ ÑÑÑÐ°ÑÑ",a:"Ð²ÑÐ». ÐÑÐ¾ÑÑÐ·Ð½Ð°, 22",lat:50.4472,lng:30.5155,c:"quests"},
{n:"Escape Quest",a:"Ð²ÑÐ». ÐÐµÑÐ½Ð¸ÐºÐ¾Ð²Ð°, 9",lat:50.4358,lng:30.5355,c:"quests"},
{n:"ÐÐ³ÑÐ¾ÑÐµÐºÐ°",a:"Ð²ÑÐ». Ð¥ÑÐµÑÐ°ÑÐ¸Ðº, 46",lat:50.4477,lng:30.5212,c:"boardgames"},
{n:"BoardGames Party",a:"Ð²ÑÐ». Ð¡Ð°ÐºÑÐ°Ð³Ð°Ð½ÑÑÐºÐ¾Ð³Ð¾, 33",lat:50.4392,lng:30.5085,c:"boardgames"},
{n:"X-Park Wakeboard",a:"ÐÐ½ÑÐ¿ÑÐ¾Ð²ÑÑÐºÐ° Ð½Ð°Ð±., 14Ð",lat:50.4272,lng:30.5650,c:"water"},
{n:"Dnepr Wake Park",a:"Ð¾. ÐÑÐ´ÑÐ¾Ð¿Ð°ÑÐº",lat:50.4430,lng:30.5750,c:"water"},
{n:"Fly Park",a:"Ð¿ÑÐ¾ÑÐ¿. ÐÐµÑÐµÑÑÐµÐ¹ÑÑÐºÐ¸Ð¹, 87Ð",lat:50.4587,lng:30.3970,c:"trampoline"},
{n:"Sky Park",a:"Ð²ÑÐ». ÐÐ¾ÑÐ¸ÑÐ¿ÑÐ»ÑÑÑÐºÐ°, 9",lat:50.4160,lng:30.6100,c:"trampoline"},
{n:"Galaxy VR",a:"Ð²ÑÐ». Ð¥ÑÐµÑÐ°ÑÐ¸Ðº, 15",lat:50.4478,lng:30.5195,c:"vr"},
{n:"VR Motion",a:"Ð²ÑÐ». ÐÐ½ÑÐ¾Ð½Ð¾Ð²Ð¸ÑÐ°, 50",lat:50.4305,lng:30.5180,c:"vr"},
{n:"Ð¢ÐµÑÐ¼Ð°Ð»Ñ Star",a:"Ð²ÑÐ». Ð§ÐµÑÐ²Ð¾Ð½Ð¾Ð·Ð¾ÑÑÐ½Ð¸Ð¹, 119",lat:50.3820,lng:30.4550,c:"spa"},
{n:"ÐÐ°Ð½Ñ Forest",a:"ÐÐ¾ÑÐ¸ÑÐ¿ÑÐ»ÑÑÑÐºÐµ ÑÐ¾ÑÐµ, 10",lat:50.4050,lng:30.6250,c:"spa"},
{n:"San Siro Spa",a:"Ð²ÑÐ». ÐÐµÐ»Ð¸ÐºÐ° ÐÐ°ÑÐ¸Ð»ÑÐºÑÐ²ÑÑÐºÐ°, 55",lat:50.4363,lng:30.5175,c:"spa"},
{n:"ÐÐ¾Ð²Ð½Ñ ÐÑÑ",a:"Ð²ÑÐ». Ð ÐµÐ¹ÑÐ°ÑÑÑÐºÐ°, 9",lat:50.4525,lng:30.5120,c:"creative"},
{n:"Ð¥ÑÐ´Ð¾Ð¶Ð½ÑÐ¹ ÑÐµÐ½ÑÑ Ð¨Ð¾ÐºÐ¾Ð»Ð°Ð´Ð½Ð¸Ð¹ Ð±ÑÐ´Ð¸Ð½Ð¾Ðº",a:"Ð²ÑÐ». Ð¨Ð¾Ð²ÐºÐ¾Ð²Ð¸ÑÐ½Ð°, 17/2",lat:50.4440,lng:30.5285,c:"creative"},
{n:"ÐÐ¾Ð½ÑÐ°ÑÐ½Ð° Ð¼Ð°Ð¹ÑÑÐµÑÐ½Ñ GlazurSpace",a:"Ð²ÑÐ». Ð Ð¾Ð³Ð½ÑÐ´Ð¸Ð½ÑÑÐºÐ°, 3",lat:50.4377,lng:30.5148,c:"creative"},
{n:"ÐÐ¸ÑÐ½Ð¸Ð¹ ÐÐµÑÐ°Ð¼ÑÑÑ",a:"Ð²ÑÐ». Ð Ð¾Ð³Ð½ÑÐ´Ð¸Ð½ÑÑÐºÐ°, 3",lat:50.4377,lng:30.5148,c:"creative"},
{n:"ÐÐ°ÑÑÑÐ½ÑÑÐºÐ¸Ð¹ Ð¿Ð°ÑÐº",a:"Ð²ÑÐ». ÐÐ¸ÑÐ°Ð¹Ð»Ð° ÐÑÑÑÐµÐ²ÑÑÐºÐ¾Ð³Ð¾",lat:50.4480,lng:30.5380,c:"parks"},
{n:"ÐÐ°ÑÐº Ð¨ÐµÐ²ÑÐµÐ½ÐºÐ°",a:"Ð²ÑÐ». ÐÐ¾Ð»Ð¾Ð´Ð¸Ð¼Ð¸ÑÑÑÐºÐ°",lat:50.4445,lng:30.5100,c:"parks"},
{n:"ÐÐµÐ¹Ð·Ð°Ð¶Ð½Ð° Ð°Ð»ÐµÑ",a:"Ð²ÑÐ». ÐÐµÑÑÑÐ¸Ð½Ð½Ð°",lat:50.4580,lng:30.5130,c:"parks"},
{n:"ÐÑÐ´ÑÐ¾Ð¿Ð°ÑÐº",a:"Ð¾ÑÑÑÑÐ² ÐÑÐ´ÑÐ¾Ð¿Ð°ÑÐº",lat:50.4440,lng:30.5770,c:"parks"},
{n:"Ð¢ÑÑÑÐ°Ð½ÑÐ² Ð¾ÑÑÑÑÐ²",a:"Ð¢ÑÑÑÐ°Ð½ÑÐ² Ð¾ÑÑÑÑÐ²",lat:50.4650,lng:30.5500,c:"parks"},
{n:"Ð¡ÑÐ»ÑÐ¿Ð¾ ÐÐµÐ»ÑÐºÐ°ÑÐµÑ",a:"Ð²ÑÐ». Ð¥ÑÐµÑÐ°ÑÐ¸Ðº, 21",lat:50.4470,lng:30.5220,c:"food"},
{n:"Kanapa",a:"Ð²ÑÐ». ÐÐ½Ð´ÑÑÑÐ²ÑÑÐºÐ¸Ð¹ ÑÐ·Ð²ÑÐ·, 19Ð",lat:50.4600,lng:30.5155,c:"food"},
{n:"ÐÑÑÐ°Ð½Ð½Ñ ÐÐ°ÑÐ¸ÐºÐ°Ð´Ð°",a:"Ð²ÑÐ». ÐÐ°Ð»Ð°Ð½ÑÐºÐ°, 3",lat:50.4485,lng:30.5265,c:"food"},
{n:"Beef",a:"Ð²ÑÐ». Ð¨Ð¾ÑÐ° Ð ÑÑÑÐ°Ð²ÐµÐ»Ñ, 11",lat:50.4360,lng:30.5295,c:"food"},
{n:"Under Wonder",a:"Ð²ÑÐ». ÐÐµÐ»Ð¸ÐºÐ° ÐÐ°ÑÐ¸Ð»ÑÐºÑÐ²ÑÑÐºÐ°, 21",lat:50.4405,lng:30.5210,c:"food"},
{n:"Blue Cup Coffee",a:"Ð²ÑÐ». ÐÐµÐ»Ð¸ÐºÐ° ÐÐ°ÑÐ¸Ð»ÑÐºÑÐ²ÑÑÐºÐ°, 41",lat:50.4385,lng:30.5195,c:"coffee"},
{n:"Takava Coffee-Buffet",a:"Ð²ÑÐ». ÐÐµÐ»Ð¸ÐºÐ° ÐÐ°ÑÐ¸Ð»ÑÐºÑÐ²ÑÑÐºÐ°, 49/2",lat:50.4370,lng:30.5190,c:"coffee"},
{n:"3.14 Coffee",a:"Ð²ÑÐ». ÐÑÐ¾ÑÑÐ·Ð½Ð°, 21",lat:50.4472,lng:30.5160,c:"coffee"},
{n:"DRUZI cafÃ©",a:"Ð²ÑÐ». ÐÑÐ¾ÑÑÐ·Ð½Ð°, 18",lat:50.4470,lng:30.5150,c:"coffee"},
{n:"Salsa Studio",a:"Ð²ÑÐ». ÐÐµÐ¶Ð¸Ð³ÑÑÑÑÐºÐ°, 23",lat:50.4640,lng:30.5070,c:"dance"},
{n:"Kizomba Kyiv",a:"Ð²ÑÐ». Ð¡Ð°ÐºÑÐ°Ð³Ð°Ð½ÑÑÐºÐ¾Ð³Ð¾, 43",lat:50.4383,lng:30.5075,c:"dance"},
{n:"Dance Academy",a:"Ð²ÑÐ». ÐÐ¸Ð»ÑÐ½ÑÑÐºÐ°, 118",lat:50.4355,lng:30.4965,c:"dance"},
{n:"Ð¢Ð¸Ñ Ð¢ÐÐ",a:"Ð²ÑÐ». Ð§ÐµÑÐ²Ð¾Ð½Ð¾Ð·Ð¾ÑÑÐ½Ð¸Ð¹, 119",lat:50.3825,lng:30.4555,c:"shooting"},
{n:"ÐÐ¾Ð·Ð°Ðº Ð¢ÑÑ",a:"Ð²ÑÐ». ÐÐµÐ¹Ð¿ÑÐ¸Ð·ÑÐºÐ°, 13",lat:50.4217,lng:30.5200,c:"shooting"}
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
var cat=cats[v.c]||{ico:"ð",col:"#999"};
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
{label:lang==="uk"?"Ð Ð¾Ð·Ð²Ð°Ð³Ð¸":"Entertainment",keys:["cinema","theater","concerts","nightlife","karaoke","bowling","karting","quests","vr","trampoline"]},
{label:lang==="uk"?"ÐÑÐ»ÑÑÑÑÐ°":"Culture",keys:["museum","books","creative","parks"]},
{label:lang==="uk"?"ÐÐ¶Ð° ÑÐ° Ð½Ð°Ð¿Ð¾Ñ":"Food & Drinks",keys:["food","coffee","hookah"]},
{label:lang==="uk"?"ÐÐºÑÐ¸Ð²Ð½Ð¾ÑÑÑ":"Activities",keys:["climbing","water","dance","shooting","spa","boardgames"]}
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
<span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:16,pointerEvents:"none"}}>ð</span>
<input value={search} onChange={function(e){setSearch(e.target.value)}} placeholder={lang==="uk"?"ÐÐ¾ÑÑÐº Ð¼ÑÑÑÑ...":"Search venues..."} style={{width:"100%",padding:"12px 36px 12px 40px",borderRadius:12,border:"1px solid rgba(168,85,247,0.3)",background:"rgba(10,10,26,0.9)",backdropFilter:"blur(12px)",color:"#fff",fontSize:14,outline:"none",boxSizing:"border-box"}}/>
{search&&<button onClick={function(){setSearch("")}} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#888",fontSize:16,cursor:"pointer",padding:0}}>â</button>}
</div>
<button onClick={findMe} title={lang==="uk"?"ÐÐ¾Ñ Ð»Ð¾ÐºÐ°ÑÑÑ":"My location"} style={{width:44,height:44,borderRadius:12,border:"1px solid rgba(168,85,247,0.3)",background:userLoc?"rgba(168,85,247,0.3)":"rgba(10,10,26,0.9)",backdropFilter:"blur(12px)",color:"#fff",fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>ð</button>
</div>

{/* Category filter chips on map */}
<div style={{position:"absolute",top:72,left:16,zIndex:999,display:"flex",gap:6,flexWrap:"wrap",maxWidth:sidebarOpen?"calc(100% - 420px)":"calc(100% - 32px)"}}>
<button onClick={function(){setSelCat(null)}} style={{padding:"7px 14px",borderRadius:20,border:"1px solid "+(selCat===null?"#a855f7":"rgba(255,255,255,0.12)"),background:selCat===null?"rgba(168,85,247,0.25)":"rgba(10,10,26,0.85)",backdropFilter:"blur(8px)",color:selCat===null?"#c084fc":"#bbb",fontSize:12,cursor:"pointer",fontWeight:selCat===null?600:400,whiteSpace:"nowrap"}}>{lang==="uk"?"Ð£ÑÑ":"All"} ({filtered.length})</button>
{catKeys.map(function(k){var c=cats[k];var cnt=V.filter(function(v){return v.c===k}).length;return <button key={k} onClick={function(){setSelCat(selCat===k?null:k)}} style={{padding:"7px 12px",borderRadius:20,border:"1px solid "+(selCat===k?c.col+"88":"rgba(255,255,255,0.1)"),background:selCat===k?c.col+"22":"rgba(10,10,26,0.85)",backdropFilter:"blur(8px)",color:selCat===k?c.col:"#999",fontSize:12,cursor:"pointer",fontWeight:selCat===k?600:400,whiteSpace:"nowrap",transition:"all 0.2s"}}>{c.ico+" "+c[lang]}</button>})}
</div>

{/* Distance slider when geolocated */}
{userLoc&&<div style={{position:"absolute",bottom:16,left:16,zIndex:999,background:"rgba(10,10,26,0.9)",backdropFilter:"blur(12px)",borderRadius:12,padding:"10px 16px",border:"1px solid rgba(168,85,247,0.2)",display:"flex",alignItems:"center",gap:12,fontSize:13}}>
<span style={{color:"#aaa"}}>{lang==="uk"?"Ð Ð°Ð´ÑÑÑ":"Radius"}</span>
<input type="range" min="1" max="30" value={maxDist} onChange={function(e){setMaxDist(Number(e.target.value))}} style={{width:100,accentColor:"#a855f7"}}/>
<span style={{color:"#c084fc",fontWeight:600,minWidth:40}}>{maxDist} km</span>
</div>}

{/* Toggle sidebar button */}
<button onClick={function(){setSidebarOpen(!sidebarOpen)}} style={{position:"absolute",bottom:16,right:sidebarOpen?408:16,zIndex:1000,padding:"10px 16px",borderRadius:12,border:"1px solid rgba(168,85,247,0.3)",background:"rgba(10,10,26,0.9)",backdropFilter:"blur(12px)",color:"#c084fc",fontSize:13,cursor:"pointer",fontWeight:600,transition:"right 0.3s ease",display:"flex",alignItems:"center",gap:6}}>
{sidebarOpen?(lang==="uk"?"Ð¡ÑÐ¾Ð²Ð°ÑÐ¸ ÑÐ¿Ð¸ÑÐ¾Ðº â¶":"Hide List â¶"):(lang==="uk"?"â ÐÐ¾ÐºÐ°Ð·Ð°ÑÐ¸ ÑÐ¿Ð¸ÑÐ¾Ðº":"â Show List")}
</button>
</div>

{/* Right sidebar */}
<div style={{width:sidebarOpen?390:0,minWidth:sidebarOpen?390:0,height:"100%",background:"#0d0d20",borderLeft:sidebarOpen?"1px solid rgba(168,85,247,0.15)":"none",transition:"all 0.3s ease",overflow:"hidden",display:"flex",flexDirection:"column"}}>

{/* Sidebar header */}
<div style={{padding:"16px 20px 12px",borderBottom:"1px solid rgba(168,85,247,0.1)",flexShrink:0}}>
<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
<h3 style={{margin:0,fontSize:18,fontWeight:700,background:"linear-gradient(135deg,#a855f7,#6366f1)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{lang==="uk"?"ÐÑÑÑÑ":"Places"}</h3>
<span style={{fontSize:13,color:"#888"}}>{filtered.length} {lang==="uk"?"Ð·Ð½Ð°Ð¹Ð´ÐµÐ½Ð¾":"found"}</span>
</div>
</div>

{/* Venue cards scrollable list */}
<div style={{flex:1,overflowY:"auto",padding:"12px 16px",display:"flex",flexDirection:"column",gap:10}} className="nk-sidebar-scroll">
{filtered.length===0&&<div style={{textAlign:"center",padding:"40px 20px",color:"#555"}}>
<div style={{fontSize:40,marginBottom:12}}>ð</div>
<div style={{fontSize:14}}>{lang==="uk"?"ÐÑÑÐ¾Ð³Ð¾ Ð½Ðµ Ð·Ð½Ð°Ð¹Ð´ÐµÐ½Ð¾":"No venues found"}</div>
<div style={{fontSize:12,color:"#444",marginTop:4}}>{lang==="uk"?"Ð¡Ð¿ÑÐ¾Ð±ÑÐ¹ÑÐµ ÑÐ½ÑÐ¸Ð¹ Ð¿Ð¾ÑÑÐº":"Try a different search"}</div>
</div>}
{filtered.map(function(v,i){
var cat=cats[v.c]||{ico:"ð",col:"#999",uk:"",en:""};
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
<span style={{color:"#a855f7",fontSize:13,flexShrink:0,marginTop:1}}>ð</span>
<span>{v.a}</span>
</div>
{/* Distance if available */}
{userLoc&&<div style={{fontSize:11,color:"#a855f7",marginTop:6}}>ð {hav(userLoc[0],userLoc[1],v.lat,v.lng).toFixed(1)} km</div>}
{/* Action buttons when selected */}
{isActive&&<div style={{display:"flex",gap:8,marginTop:10}}>
<a href={"https://www.google.com/maps/dir/?api=1&destination="+v.lat+","+v.lng} target="_blank" rel="noopener noreferrer" style={{flex:1,padding:"8px 0",borderRadius:10,background:"linear-gradient(135deg,#a855f7,#7c3aed)",color:"#fff",textDecoration:"none",textAlign:"center",fontSize:12,fontWeight:600}}>ð§­ {lang==="uk"?"ÐÐ°ÑÑÑÑÑ":"Directions"}</a>
<a href={"https://www.google.com/search?q="+encodeURIComponent(v.n+" Kyiv")} target="_blank" rel="noopener noreferrer" style={{flex:1,padding:"8px 0",borderRadius:10,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",color:"#ccc",textDecoration:"none",textAlign:"center",fontSize:12,fontWeight:600}}>ð {lang==="uk"?"ÐÐµÑÐ°Ð»ÑÐ½ÑÑÐµ":"Details"}</a>
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
const[dataLoaded,setDataLoaded]=useState(false);
const[userLoc,setUserLoc]=useState(null);
const[geoStatus,setGeoStatus]=useState("idle");const requestGeo=useCallback(()=>{if(!navigator.geolocation){setGeoStatus("unavailable");return;}setGeoStatus("loading");navigator.geolocation.getCurrentPosition(p=>{setUserLoc([p.coords.latitude,p.coords.longitude]);setGeoStatus("granted");},()=>setGeoStatus("denied"),{enableHighAccuracy:true,timeout:10000});},[]);useEffect(()=>{requestGeo();},[]);useEffect(()=>{fetch('/data.json').then(r=>r.json()).then(d=>{A=d.map((x,i)=>({id:i+1,en:x.e||x.n,uk:x.n,v:'',c:x.c,g:x.c,t:x.s,p:'',tm:x.h||'',s:x.s,addr:x.a||'',phone:x.p||'',lat:x.la,lng:x.lo,web:x.w||''}));setDataLoaded(true)}).catch(()=>setDataLoaded(true))},[]);if(!dataLoaded)return(<div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh',color:'#fff',fontSize:'1.5em'}}>Loading...</div>);
return(<div style={{minHeight:"100vh",background:"linear-gradient(170deg,#0d0b1a 0%,#15122a 40%,#1a1333 100%)",color:"#e8e6f0",fontFamily:"'DM Sans',sans-serif",position:"relative",overflow:"hidden",maxWidth:480,margin:"0 auto"}}>
<style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
<div style={{position:"fixed",top:-120,right:-120,width:340,height:340,background:"radial-gradient(circle,rgba(162,89,255,0.13) 0%,transparent 70%)",borderRadius:"50%",pointerEvents:"none",zIndex:0}}/>
<header style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 20px 10px",position:"relative",zIndex:2}}><div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>setPage("home")}><div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#a259ff,#6c3ecf)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:16,color:"#fff",boxShadow:"0 4px 16px rgba(162,89,255,0.35)"}}>N</div><span style={{fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:19,letterSpacing:-0.5,color:"#fff"}}>{t.brand}</span></div><button onClick={()=>setLang(lang==="en"?"uk":"en")} style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:20,padding:"6px 14px",color:"#c4c0d8",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>{t.langSwitch}</button></header>
<main style={{position:"relative",zIndex:1,paddingBottom:90,minHeight:"calc(100vh - 60px)"}}>
{page==="home"&&<HomePage lang={lang} T={T} A={A} CC={CC} IC={IC} SC={SC} setPage={setPage} userLoc={userLoc} requestGeo={requestGeo} geoStatus={geoStatus}/>}
{page==="events"&&<EventsPage t={t} lang={lang}/>}
{page==="cinema"&&<CinemaPage t={t} lang={lang}/>}
{page==="map"&&<MapPage t={t} lang={lang}/>}
</main>
<nav style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:"rgba(13,11,26,0.92)",backdropFilter:"blur(20px)",borderTop:"1px solid rgba(255,255,255,0.06)",display:"flex",justifyContent:"space-around",padding:"10px 0 18px",zIndex:10}}>
{[{k:"home",ic:"â",l:t.nav.home},{k:"events",ic:"â",l:t.nav.events},{k:"cinema",ic:"ð¬",l:t.nav.cinema},{k:"map",ic:"â",l:t.nav.map}].map(n=>(<button key={n.k} onClick={()=>setPage(n.k)} style={{background:"none",border:"none",color:page===n.k?"#a259ff":"#6b6782",display:"flex",flexDirection:"column",alignItems:"center",gap:3,cursor:"pointer",fontSize:11,fontFamily:"'DM Sans',sans-serif",fontWeight:600}}><span style={{fontSize:18,lineHeight:1}}>{n.ic}</span>{n.l}</button>))}
</nav></div>);}
