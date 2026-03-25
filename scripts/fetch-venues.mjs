import{writeFileSync as w,mkdirSync as mk}from"fs";
const bb="50.35,30.25,50.59,30.83";
const queries=[
  `[out:json][timeout:90];(node["amenity"~"restaurant|cafe|bar|pub|nightclub|theatre|cinema|museum|arts_centre|fast_food|biergarten|food_court|ice_cream|casino|community_centre|karaoke|library|place_of_worship|pharmacy|marketplace|bank|post_office|clinic|dentist|veterinary|car_wash|fuel"](${bb}););out tags;`,
  `[out:json][timeout:90];(node["leisure"~"fitness_centre|sports_centre|bowling_alley|escape_game|amusement_arcade|dance|swimming_pool|sauna|spa|stadium|water_park"](50.35,30.25,50.59,30.83);node["sport"](50.35,30.25,50.59,30.83);node["tourism"~"museum|gallery|viewpoint|attraction|theme_park|zoo|aquarium|hotel|hostel|guest_house"](50.35,30.25,50.59,30.83););out tags;`,
  `[out:json][timeout:90];(node["shop"~"wine|alcohol|coffee|tea|bakery|books|music|art|confectionery|chocolate|deli|cheese|clothes|shoes|jewelry|beauty|cosmetics|gift|florist|electronics|computer|mobile_phone|optician|pet|bicycle|sports|toys|games|supermarket|convenience|mall|department_store"](50.35,30.25,50.59,30.83);node["office"~"coworking"](50.35,30.25,50.59,30.83);node["craft"~"tattoo"](50.35,30.25,50.59,30.83););out tags;`,
  `[out:json][timeout:90];(way["amenity"~"restaurant|cafe|bar|pub|nightclub|theatre|cinema|museum|arts_centre|fast_food"](50.35,30.25,50.59,30.83);way["leisure"~"fitness_centre|sports_centre|bowling_alley|escape_game|swimming_pool|spa|stadium|park"](50.35,30.25,50.59,30.83);way["tourism"~"museum|gallery|attraction|theme_park|zoo"](50.35,30.25,50.59,30.83);way["shop"~"clothes|shoes|jewelry|beauty|cosmetics|gift|florist|electronics|mall|department_store|supermarket"](50.35,30.25,50.59,30.83);way["amenity"~"marketplace|library|place_of_worship"](50.35,30.25,50.59,30.83););out center tags;`
];
const cats={
  sports:{fitness:{leisure:["fitness_centre"],sport:["fitness","yoga","pilates","crossfit"]},swimming:{leisure:["swimming_pool"],sport:["swimming"]},climbing:{sport:["climbing"]},bowling:{leisure:["bowling_alley"]},tennis:{sport:["tennis","padel","table_tennis"]},football:{sport:["soccer","football","futsal"]},basketball:{sport:["basketball"]},martial_arts:{sport:["boxing","martial_arts","judo","karate","taekwondo","wrestling","aikido","mma"]},shooting:{sport:["shooting"]},skating:{sport:["ice_skating","roller_skating","skateboard"]},billiards:{sport:["billiards","pool","snooker"]},volleyball:{sport:["volleyball","beachvolleyball"]},equestrian:{sport:["equestrian"]},cycling:{sport:["cycling"]},other_sports:{leisure:["sports_centre","stadium"],sport:["multi","handball","badminton","squash","archery","chess","gymnastics","athletics"]}},
  entertainment:{quests:{leisure:["escape_game"]},arcade:{leisure:["amusement_arcade"]},parks:{tourism:["theme_park"],leisure:["water_park"]},zoo:{tourism:["zoo","aquarium"]},dance:{leisure:["dance"]},other_ent:{amenity:["casino","community_centre"]}},
  culture:{theatre:{amenity:["theatre"]},museums:{tourism:["museum"],amenity:["museum"]},galleries:{tourism:["gallery"],amenity:["arts_centre"]},libraries:{amenity:["library"]},worship:{amenity:["place_of_worship"]},viewpoints:{tourism:["viewpoint","attraction"]}},
  nightlife:{clubs:{amenity:["nightclub"]},bars:{amenity:["bar","biergarten"]},pubs:{amenity:["pub"]},karaoke:{amenity:["karaoke"]}},
  food:{restaurants:{amenity:["restaurant"]},cafes:{amenity:["cafe"]},fast_food:{amenity:["fast_food","food_court"]},ice_cream:{amenity:["ice_cream"]},bakery:{shop:["bakery","confectionery","chocolate","cheese","deli"]},wine_shops:{shop:["wine","alcohol"]},coffee_shops:{shop:["coffee","tea"]}},
  cinema:{cinema:{amenity:["cinema"]}},
  wellness:{spa:{leisure:["spa","sauna"]},beauty:{shop:["beauty","cosmetics"]},pharmacy:{amenity:["pharmacy"]},clinic:{amenity:["clinic","dentist","veterinary"]}},
  shopping:{clothes:{shop:["clothes","shoes"]},jewelry:{shop:["jewelry"]},electronics:{shop:["electronics","computer","mobile_phone"]},books:{shop:["books","music"]},gifts:{shop:["gift","florist","art","toys","games"]},pets:{shop:["pet"]},sports_shop:{shop:["sports","bicycle"]},optician:{shop:["optician"]},supermarket:{shop:["supermarket","convenience"]},mall:{shop:["mall","department_store"]},marketplace:{amenity:["marketplace"]}},
  hotels:{hotels:{tourism:["hotel"]},hostels:{tourism:["hostel","guest_house"]}},
  services:{bank:{amenity:["bank"]},post:{amenity:["post_office"]},car:{amenity:["car_wash","fuel","charging_station"]},coworking:{office:["coworking"]},tattoo:{craft:["tattoo"]}}
};
function match(el,def){const t=el.tags||{};for(const[k,v]of Object.entries(def)){if(Array.isArray(v)&&v.includes(t[k]))return true}return false}
async function main(){
  console.log("Fetching Kyiv venues from OpenStreetMap...");
  let all=[];
  for(let i=0;i<queries.length;i++){
    console.log(`Query ${i+1}/${queries.length}...`);
    try{
      const r=await fetch("https://overpass-api.de/api/interpreter",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:"data="+encodeURIComponent(queries[i])});
      if(!r.ok){console.log("HTTP "+r.status);continue}
      const d=await r.json();all.push(...d.elements);
      console.log(`Got ${d.elements.length} elements`);
      if(i<queries.length-1)await new Promise(r=>setTimeout(r,2000));
    }catch(e){console.log("Error: "+e.message)}
  }
  const seen=new Set();
  const unique=all.filter(e=>{const k=e.type+"/"+e.id;if(seen.has(k))return false;seen.add(k);return true}).filter(e=>e.tags&&e.tags.name);
  console.log(`Total unique named: ${unique.length}`);
  const venues=[];
  unique.forEach(el=>{
    const t=el.tags||{};
    for(const[cat,subs]of Object.entries(cats)){
      for(const[sub,matcher]of Object.entries(subs)){
        if(match(el,matcher)){
          const r={n:t["name:uk"]||t.name};
          if(t["name:en"]&&t["name:en"]!==r.n)r.e=t["name:en"];
          r.c=cat;r.s=sub;
          if(t["addr:street"]){r.a=t["addr:street"]+(t["addr:housenumber"]?", "+t["addr:housenumber"]:"");}
          if(t.phone||t["contact:phone"])r.p=t.phone||t["contact:phone"];
          if(t.website||t["contact:website"])r.w=t.website||t["contact:website"];
          const la=el.lat||(el.center&&el.center.lat);
          const lo=el.lon||(el.center&&el.center.lon);
          if(la)r.la=Math.round(la*1e4)/1e4;
          if(lo)r.lo=Math.round(lo*1e4)/1e4;
          if(t.opening_hours)r.h=t.opening_hours;
          if(t.cuisine)r.cu=t.cuisine;
          venues.push(r);return;
        }
      }
    }
  });
  venues.sort((a,b)=>{const sa=(a.a?1:0)+(a.p?1:0)+(a.w?1:0);const sb=(b.a?1:0)+(b.p?1:0)+(b.w?1:0);return sb-sa});
  const top=venues.slice(0,10000);
  mk("public",{recursive:true});w("public/data.json",JSON.stringify(top));
  console.log(`Wrote ${top.length} venues to public/data.json`);
}
main().catch(e=>console.error(e));
