import{writeFileSync as w,mkdirSync as mk}from"fs";
const bb="50.35,30.25,50.59,30.83";
const OV="https://overpass-api.de/api/interpreter";
const queries=[
`[out:json][timeout:120];(node["amenity"~"restaurant|cafe|bar|pub|fast_food|ice_cream|food_court|biergarten|wine_bar"](${bb});way["amenity"~"restaurant|cafe|bar|pub|fast_food"](${bb}););out center;`,
`[out:json][timeout:120];(node["amenity"~"theatre|cinema|arts_centre|community_centre|library|nightclub|karaoke|casino"](${bb});node["tourism"~"museum|gallery|viewpoint|theme_park|zoo|aquarium|attraction"](${bb});way["tourism"~"museum|gallery|theme_park|zoo"](${bb}););out center;`,
`[out:json][timeout:120];(node["leisure"~"fitness_centre|sports_centre|swimming_pool|bowling_alley|escape_game|amusement_arcade|dance|miniature_golf|sauna|stadium|pitch|ice_rink|horse_riding|park|playground|garden|dog_park|nature_reserve"](${bb});node["sport"](${bb});way["leisure"~"fitness_centre|sports_centre|swimming_pool|stadium|park|garden|nature_reserve"](${bb}););out center;`,
`[out:json][timeout:120];(node["shop"](${bb});way["shop"](${bb}););out center;`,
`[out:json][timeout:120];(node["tourism"~"hotel|hostel|guest_house|motel|apartment|camp_site"](${bb});way["tourism"~"hotel|hostel|guest_house|motel"](${bb}););out center;`,
`[out:json][timeout:120];(node["amenity"~"school|university|college|kindergarten|driving_school|language_school|hospital|clinic|doctors|dentist|veterinary|pharmacy|bank|atm|post_office|car_rental|car_wash|fuel|parking|taxi|police|fire_station|townhall|courthouse|embassy|coworking_space|charging_station|place_of_worship|marketplace|social_facility|childcare|nursing_home|fountain|toilets"](${bb});node["office"](${bb});node["craft"](${bb});way["amenity"~"school|university|hospital|place_of_worship"](${bb}););out center;`
];
const cats={
sports:{fitness:{leisure:["fitness_centre"],sport:["fitness","yoga","pilates","crossfit"]},swimming:{leisure:["swimming_pool"],sport:["swimming"]},climbing:{sport:["climbing","free_climbing"]},bowling:{leisure:["bowling_alley"]},tennis:{sport:["tennis","table_tennis","padel"]},football:{sport:["soccer","american_football","football"]},basketball:{sport:["basketball"]},martial_arts:{sport:["martial_arts","judo","karate","boxing","taekwondo","aikido","fencing","wrestling"]},shooting:{sport:["shooting"]},skating:{leisure:["ice_rink"],sport:["ice_skating","roller_skating","skateboard"]},billiards:{sport:["billiards","9pin","10pin"]},volleyball:{sport:["volleyball","beachvolleyball"]},equestrian:{leisure:["horse_riding"],sport:["equestrian"]},cycling:{sport:["cycling","bmx"]},golf:{sport:["golf"],leisure:["miniature_golf"]},stadium:{leisure:["stadium","pitch","track"]},other_sports:{sport:["multi","running","athletics","handball","rugby","cricket","baseball","archery","rowing","canoe","diving","surfing","water_polo","chess","badminton","hockey","water_ski","kitesurfing","paragliding","motor","karting"]}},
entertainment:{quests:{leisure:["escape_game"]},arcade:{leisure:["amusement_arcade"]},parks:{leisure:["park","garden","dog_park"],tourism:["theme_park"]},zoo:{tourism:["zoo","aquarium"]},dance:{leisure:["dance"]},playground:{leisure:["playground"]},attraction:{tourism:["attraction"]},nature:{leisure:["nature_reserve"]},other_ent:{amenity:["casino","gambling","community_centre"],leisure:["water_park"]}},
culture:{theatre:{amenity:["theatre"]},museums:{tourism:["museum"]},galleries:{tourism:["gallery"],amenity:["arts_centre"]},libraries:{amenity:["library"]},worship:{amenity:["place_of_worship"]},viewpoints:{tourism:["viewpoint"]},fountain:{amenity:["fountain"]}},
nightlife:{clubs:{amenity:["nightclub"]},bars:{amenity:["bar","biergarten","wine_bar"]},pubs:{amenity:["pub"]},karaoke:{amenity:["karaoke"]}},
food:{restaurants:{amenity:["restaurant","food_court"]},cafes:{amenity:["cafe"]},fast_food:{amenity:["fast_food"]},ice_cream:{amenity:["ice_cream"]},bakery:{shop:["bakery","pastry"]},wine_shops:{shop:["wine","alcohol","beverages"]},coffee_shops:{shop:["coffee","tea"]}},
cinema:{cinema:{amenity:["cinema"]}},
wellness:{spa:{leisure:["spa","sauna"],amenity:["spa","sauna"]},beauty:{shop:["beauty","cosmetics","hairdresser","massage"]},pharmacy:{amenity:["pharmacy"]},clinic:{amenity:["clinic","doctors","dentist","veterinary"]}},
shopping:{clothes:{shop:["clothes","shoes","fashion","boutique","bag","leather","fabric","sewing"]},jewelry:{shop:["jewelry","watches"]},electronics:{shop:["electronics","computer","mobile_phone","hifi","appliance"]},books:{shop:["books","stationery","newsagent"]},gifts:{shop:["gift","toys","games","art","antiques","second_hand","charity","frame","musical_instrument"]},pets:{shop:["pet","pet_grooming"]},sports_shop:{shop:["sports","outdoor","fishing","hunting","bicycle","scuba_diving"]},optician:{shop:["optician","hearing_aids","medical_supply"]},supermarket:{shop:["supermarket","convenience","greengrocer","butcher","deli","organic","health_food","frozen_food","seafood","cheese","dairy","farm","spices","chocolate","confectionery","candy"]},mall:{shop:["mall","department_store"]},marketplace:{amenity:["marketplace"]},florist:{shop:["florist","garden_centre"]},hardware:{shop:["hardware","doityourself","paint","glaziery","bathroom_furnishing","kitchen","interior_decoration","curtain","carpet","bed","furniture","lighting","tiles","doors","windows","houseware"]},car_parts:{shop:["car","car_parts","car_repair","tyres","motorcycle"]},other_shop:{shop:["variety_store","photo","dry_cleaning","laundry","travel_agency","copyshop","money_lender","pawnbroker","tobacco","e-cigarette","lottery","kiosk","ticket","funeral_directors","storage_rental","locksmith","trade","wholesale","nutrition_supplements","perfumery","cosmetics","chemist","herbalist","erotic","weapons","pyrotechnics"]}},
hotels:{hotels:{tourism:["hotel","motel","apartment"]},hostels:{tourism:["hostel","guest_house","camp_site"]}},
services:{bank:{amenity:["bank","atm","bureau_de_change"]},post:{amenity:["post_office"]},car:{amenity:["car_rental","car_wash","fuel","charging_station","parking","taxi"]},coworking:{amenity:["coworking_space"],office:["coworking"]},tattoo:{shop:["tattoo","piercing"]},education:{amenity:["school","university","college","kindergarten","driving_school","language_school","music_school"]},government:{amenity:["police","fire_station","townhall","courthouse","embassy"]},healthcare:{amenity:["hospital"]},childcare:{amenity:["childcare","nursing_home","social_facility"]},office:{office:["company","government","insurance","it","lawyer","estate_agent","travel_agent","accountant","architect","association","consulting","educational_institution","employment_agency","engineer","financial","foundation","graphic_design","marketing","newspaper","ngo","notary","political_party","religion","research","telecommunication","therapist","translator","advertising_agency"]},craft:{craft:["carpenter","electrician","plumber","painter","photographer","shoemaker","tailor","jeweller","optician","watchmaker","key_cutter","glazier","beekeeper","blacksmith","bookbinder","brewery","caterer","confectionery","distillery","dressmaker","gardener","handicraft","hvac","insulation","metal_construction","pottery","rigger","roofer","scaffolder","sculptor","stonemason","sun_protection","tiler","turner","upholsterer","winery"]}}
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
// Fallback: assign based on primary tag
if(tags.amenity)return{c:"services",s:"other_service"};
if(tags.shop)return{c:"shopping",s:"other_shop"};
if(tags.office)return{c:"services",s:"office"};
if(tags.craft)return{c:"services",s:"craft"};
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
if(!t||!t.name)continue;
const cat=categorize(t);
if(!cat)continue;
const lat=e.lat||(e.center&&e.center.lat);
const lon=e.lon||(e.center&&e.center.lon);
venues.push({n:t["name:uk"]||t.name,e:t["name:en"]||t.name,c:cat.c,s:cat.s,a:t["addr:street"]?(t["addr:street"]+" "+(t["addr:housenumber"]||"")).trim():"",p:t.phone||t["contact:phone"]||"",w:t.website||t["contact:website"]||"",la:lat,lo:lon,h:t.opening_hours||"",cu:t.cuisine||""});
}
console.log("Total unique named: "+venues.length);
venues.sort((a,b)=>{
const sa=(a.a?1:0)+(a.p?1:0)+(a.w?1:0)+(a.h?1:0);
const sb=(b.a?1:0)+(b.p?1:0)+(b.w?1:0)+(b.h?1:0);
return sb-sa;
});
const top=venues.slice(0,10000);
mk("public",{recursive:true});
w("public/data.json",JSON.stringify(top));
console.log("Wrote "+top.length+" venues to public/data.json");
}
main().catch(e=>{console.error(e);process.exit(0)});
