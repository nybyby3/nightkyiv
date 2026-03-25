import{writeFileSync as w,mkdirSync as mk}from"fs";
const bb="50.35,30.25,50.59,30.83";
const OV="https://overpass-api.de/api/interpreter";
const queries=[
`[out:json][timeout:120];(node["amenity"~"restaurant|cafe|bar|pub|fast_food|ice_cream|food_court|biergarten|wine_bar"](${bb});way["amenity"~"restaurant|cafe|bar|pub|fast_food"](${bb}););out center;`,
`[out:json][timeout:120];(node["amenity"~"theatre|cinema|arts_centre|community_centre|library|nightclub|karaoke|casino"](${bb});node["tourism"~"museum|gallery|viewpoint|theme_park|zoo|aquarium|attraction"](${bb});way["tourism"~"museum|gallery|theme_park|zoo"](${bb}););out center;`,
`[out:json][timeout:120];(node["leisure"~"fitness_centre|sports_centre|swimming_pool|bowling_alley|escape_game|amusement_arcade|dance|miniature_golf|sauna|stadium|pitch|ice_rink|horse_riding|park|playground|garden|dog_park|nature_reserve"](${bb});node["sport"](${bb});way["leisure"~"fitness_centre|sports_centre|swimming_pool|stadium|pitch|park|garden|nature_reserve"](${bb});way["sport"](${bb}););out center;`
];
const sportNamesUk={soccer:"Футбольне поле",football:"Футбольне поле",basketball:"Баскетбольний майданчик",tennis:"Тенісний корт",table_tennis:"Стіл для настільного тенісу",volleyball:"Волейбольний майданчик",beachvolleyball:"Пляжний волейбол",handball:"Гандбольний майданчик",baseball:"Бейсбольний майданчик",hockey:"Хокейний майданчик",rugby:"Регбійне поле",cricket:"Крикетне поле",badminton:"Бадмінтонний корт",swimming:"Басейн",running:"Бігова доріжка",athletics:"Легкоатлетичний майданчик",skateboard:"Скейтпарк",climbing:"Скалодром",fitness:"Фітнес-зал",yoga:"Йога-студія",boxing:"Боксерський клуб",martial_arts:"Зал бойових мистецтв",archery:"Тир для стрільби з лука",shooting:"Тир",equestrian:"Кінний клуб",cycling:"Велотрек",multi:"Спортивний майданчик",golf:"Гольф-поле",padel:"Падел-корт",ice_skating:"Ковзанка",roller_skating:"Ролердром",billiards:"Більярдний клуб",chess:"Шаховий клуб",karting:"Картинг",bmx:"BMX-трек"};
const sportNamesEn={soccer:"Football field",football:"Football field",basketball:"Basketball court",tennis:"Tennis court",table_tennis:"Table tennis",volleyball:"Volleyball court",beachvolleyball:"Beach volleyball",handball:"Handball court",baseball:"Baseball field",hockey:"Hockey rink",rugby:"Rugby field",cricket:"Cricket field",badminton:"Badminton court",swimming:"Swimming pool",running:"Running track",athletics:"Athletics field",skateboard:"Skatepark",climbing:"Climbing wall",fitness:"Fitness center",yoga:"Yoga studio",boxing:"Boxing club",martial_arts:"Martial arts gym",archery:"Archery range",shooting:"Shooting range",equestrian:"Equestrian club",cycling:"Cycling track",multi:"Sports ground",golf:"Golf course",padel:"Padel court",ice_skating:"Ice rink",roller_skating:"Roller rink",billiards:"Billiards club",chess:"Chess club",karting:"Karting",bmx:"BMX track"};
const leisureNamesUk={pitch:"Спортивний майданчик",sports_centre:"Спортивний центр",fitness_centre:"Фітнес-центр",swimming_pool:"Басейн",stadium:"Стадіон",ice_rink:"Ковзанка",track:"Бігова доріжка",horse_riding:"Кінний клуб",bowling_alley:"Боулінг",miniature_golf:"Міні-гольф"};
const leisureNamesEn={pitch:"Sports ground",sports_centre:"Sports center",fitness_centre:"Fitness center",swimming_pool:"Swimming pool",stadium:"Stadium",ice_rink:"Ice rink",track:"Running track",horse_riding:"Equestrian club",bowling_alley:"Bowling alley",miniature_golf:"Mini golf"};
function genSportName(tags,lang){const sp=tags.sport;const le=tags.leisure;if(lang==="uk"){if(sp&&sportNamesUk[sp])return sportNamesUk[sp];if(le&&leisureNamesUk[le])return leisureNamesUk[le];if(sp)return sp.charAt(0).toUpperCase()+sp.slice(1).replace(/_/g," ");return"Спортивний майданчик";}else{if(sp&&sportNamesEn[sp])return sportNamesEn[sp];if(le&&leisureNamesEn[le])return leisureNamesEn[le];if(sp)return sp.charAt(0).toUpperCase()+sp.slice(1).replace(/_/g," ");return"Sports ground";}}
const cats={
sports:{fitness:{leisure:["fitness_centre"],sport:["fitness","yoga","pilates","crossfit"]},swimming:{leisure:["swimming_pool"],sport:["swimming"]},climbing:{sport:["climbing","free_climbing"]},bowling:{leisure:["bowling_alley"]},tennis:{sport:["tennis","table_tennis","padel"]},football:{sport:["soccer","american_football","football"]},basketball:{sport:["basketball"]},martial_arts:{sport:["martial_arts","judo","karate","boxing","taekwondo","aikido","fencing","wrestling"]},shooting:{sport:["shooting"]},skating:{leisure:["ice_rink"],sport:["ice_skating","roller_skating","skateboard"]},billiards:{sport:["billiards","9pin","10pin"]},volleyball:{sport:["volleyball","beachvolleyball"]},equestrian:{leisure:["horse_riding"],sport:["equestrian"]},cycling:{sport:["cycling","bmx"]},golf:{sport:["golf"],leisure:["miniature_golf"]},stadium:{leisure:["stadium","pitch","track"]},other_sports:{sport:["multi","running","athletics","handball","rugby","cricket","baseball","archery","rowing","canoe","diving","surfing","water_polo","chess","badminton","hockey","water_ski","kitesurfing","paragliding","motor","karting"]}},
entertainment:{quests:{leisure:["escape_game"]},arcade:{leisure:["amusement_arcade"]},parks:{leisure:["park","garden","dog_park"],tourism:["theme_park"]},zoo:{tourism:["zoo","aquarium"]},dance:{leisure:["dance"]},playground:{leisure:["playground"]},attraction:{tourism:["attraction"]},nature:{leisure:["nature_reserve"]},other_ent:{amenity:["casino","gambling","community_centre"],leisure:["water_park"]}},
culture:{theatre:{amenity:["theatre"]},museums:{tourism:["museum"]},galleries:{tourism:["gallery"],amenity:["arts_centre"]},libraries:{amenity:["library"]},worship:{amenity:["place_of_worship"]},viewpoints:{tourism:["viewpoint"]},fountain:{amenity:["fountain"]}},
nightlife:{clubs:{amenity:["nightclub"]},bars:{amenity:["bar","biergarten","wine_bar"]},pubs:{amenity:["pub"]},karaoke:{amenity:["karaoke"]}},
food:{restaurants:{amenity:["restaurant","food_court"]},cafes:{amenity:["cafe"]},fast_food:{amenity:["fast_food"]},ice_cream:{amenity:["ice_cream"]},bakery:{shop:["bakery","pastry"]},wine_shops:{shop:["wine","alcohol","beverages"]},coffee_shops:{shop:["coffee","tea"]}},
cinema:{cinema:{amenity:["cinema"]}}
};
async function fetchWithRetry(query,retries=3,delay=5000){
for(let i=0;i<retries;i++){
try{
const r=await fetch(OV,{method:"POST",body:"data="+encodeURIComponent(query),headers:{"Content-Type":"application/x-www-form-urlencoded"}});
if(r.status===429||r.status===504){console.log("HTTP "+r.status+", retry "+(i+1));await new Promise(r=>setTimeout(r,delay*(i+1)));continue}
if(!r.ok){console.log("HTTP "+r.status);return[]}
const d=await r.json();
return d.elements||[];
}catch(e){console.log("Error: "+e.message+", retry "+(i+1));await new Promise(r=>setTimeout(r,delay*(i+1)))}
}
return[];
}
function categorize(tags){
for(const[cat,subs]of Object.entries(cats)){
for(const[sub,matchers]of Object.entries(subs)){
for(const[tagKey,vals]of Object.entries(matchers)){
const tv=tags[tagKey];
if(tv&&vals.some(v=>tv===v||tv.includes(v)))return{c:cat,s:sub};
}}}
if(tags.leisure)return{c:"entertainment",s:"other_ent"};
if(tags.tourism)return{c:"culture",s:"other_culture"};
if(tags.sport)return{c:"sports",s:"other_sports"};
return null;
}
async function main(){
console.log("Fetching Kyiv venues from OpenStreetMap...");
let all=[];
for(let i=0;i<queries.length;i++){
console.log("Query "+(i+1)+"/"+queries.length+"...");
const els=await fetchWithRetry(queries[i]);
console.log("Got "+els.length+" elements");
all=all.concat(els);
if(i<queries.length-1)await new Promise(r=>setTimeout(r,2000));
}
const seen=new Set();
const venues=[];
for(const e of all){
const k=e.type+"/"+e.id;
if(seen.has(k))continue;
seen.add(k);
const t=e.tags;
if(!t)continue;
const cat=categorize(t);
if(!cat)continue;
const isSport=cat.c==="sports";
const hasName=!!t.name;
if(!hasName&&!isSport)continue;
const ukName=hasName?(t["name:uk"]||t.name):genSportName(t,"uk");
const enName=hasName?(t["name:en"]||t.name):genSportName(t,"en");
const addr=t["addr:street"]?(t["addr:street"]+" "+(t["addr:housenumber"]||"")).trim():"";
const lat=e.lat||(e.center&&e.center.lat);
const lon=e.lon||(e.center&&e.center.lon);
if(!lat||!lon)continue;
if(isSport&&!hasName){const locKey=cat.s+"_"+Math.round(lat*1000)+"_"+Math.round(lon*1000);if(seen.has(locKey))continue;seen.add(locKey);}
venues.push({n:ukName,e:enName,c:cat.c,s:cat.s,a:addr,p:t.phone||t["contact:phone"]||"",w:t.website||t["contact:website"]||"",la:lat,lo:lon,h:t.opening_hours||"",cu:t.cuisine||""});
}
console.log("Total unique venues: "+venues.length);
venues.sort((a,b)=>{
const sa=(a.a?1:0)+(a.p?1:0)+(a.w?1:0)+(a.h?1:0);
const sb=(b.a?1:0)+(b.p?1:0)+(b.w?1:0)+(b.h?1:0);
return sb-sa;
});
const top=venues.slice(0,10000);
mk("public",{recursive:true});
w("public/data.json",JSON.stringify(top));
console.log("Wrote "+top.length+" venues to public/data.json");
const sportCount=top.filter(v=>v.c==="sports").length;
const sportSubs={};top.filter(v=>v.c==="sports").forEach(v=>{sportSubs[v.s]=(sportSubs[v.s]||0)+1;});
console.log("Sports venues: "+sportCount,JSON.stringify(sportSubs));
}
main().catch(e=>{console.error(e);process.exit(0);});
