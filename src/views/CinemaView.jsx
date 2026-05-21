/* IMPORTANT — DO NOT MODIFY THE CINEMA LOGIC.
 * Lifted verbatim from the original src/App.jsx (the only thing changed is
 * the wrapping export and import of React hooks at the top). The cinema
 * scraper at /api/cinema.js depends on the exact contract here.
 */
import { useState, useEffect, useCallback } from "react";

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

export default function CinemaView({ lang, dict }) {
  // The original CinemaPage used a tiny `t` translation object with
  // `cinemaTitle`/`cinemaSubtitle`. We adapt to the new i18n shape but keep
  // the cinema content component untouched.
  const t = {
    cinemaTitle:    lang === "en" ? "Cinema"               : "Кіно",
    cinemaSubtitle: lang === "en" ? "Live showtimes from Kyiv cinemas" : "Сеанси кінотеатрів Києва онлайн",
  };
  return (
    <div style={{ padding:"0 20px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
        <h1 style={{ fontFamily:"'Outfit',sans-serif", fontSize:26, fontWeight:800, color:"#fff", margin:"10px 0 0" }}>{t.cinemaTitle}</h1>
      </div>
      <p style={{ fontSize:13, color:"#6b6782", margin:"4px 0 4px" }}>{t.cinemaSubtitle}</p>
      <CinemaContent t={t} lang={lang}/>
    </div>
  );
}
