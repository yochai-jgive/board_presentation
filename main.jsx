import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, Maximize, Minimize, Lock } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, LabelList, Legend, ComposedChart, ReferenceLine
} from "recharts";

const C = {
  bg:"hsl(33,30%,87%)",fg:"hsl(220,25%,18%)",card:"hsl(33,30%,92%)",
  primary:"hsl(288,100%,67%)",muted:"hsl(220,10%,45%)",border:"hsl(33,25%,82%)",
  introCategory:"hsl(220,15%,35%)",dataCategory:"hsl(288,100%,67%)",
  green:"hsl(145,50%,40%)",red:"hsl(0,65%,50%)",magenta47:"hsl(288,80%,47%)",
  beigeDark:"hsl(33,30%,65%)",beigeLight:"hsl(33,25%,80%)",
  darkPurple:"hsl(288,80%,35%)",brown:"hsl(30,50%,40%)",pill:"hsl(33,35%,72%)",
  predBg:"hsla(288,100%,67%,0.10)",
};

// ── INLINE SVGs ──
const JGIVE_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1917 881.92"><defs><style>.jl1{fill:#dd57ff}.jl2{fill:#333}</style></defs><path class="jl2" d="M761.53,305.65v-75.48h98.56v431.54c0,126.09-87.02,220.21-230.87,220.21-98.56,0-209.55-69.26-220.21-170.48h97.67c7.1,41.73,59.5,85.24,121.65,85.24,80.81,0,133.19-47.95,133.19-121.65v-87.91c-23.08,46.17-86.13,83.46-152.73,83.46-115.43,0-208.67-91.46-208.67-221.98v-.89c0-134.08,93.23-227.31,219.32-227.31,71.93,0,129.64,47.06,142.07,85.24ZM496.92,445.05v1.77c0,82.58,63.05,140.3,134.08,140.3s133.19-50.61,133.19-140.3v-1.77c0-89.68-62.16-141.18-134.97-141.18s-132.3,57.72-132.3,141.18Z"/><path class="jl2" d="M1222.5,683.02l-170.48-455.51h102.11l113.66,340.08,112.77-340.08h101.23l-169.6,455.51h-89.69Z"/><path class="jl2" d="M1916.94,481.46h-345.41c7.99,75.48,59.5,124.31,134.08,124.31,53.27,0,95.9-27.53,109.21-72.81h98.56c-23.98,101.22-106.56,157.16-214,157.16-132.3,0-229.09-96.78-229.09-232.64v-.89c0-134.08,96.78-238.86,224.65-238.86,150.95,0,221.99,117.21,221.99,226.42v37.29ZM1820.15,405.98c-.89-46.17-40.85-108.33-121.65-108.33-66.6,0-108.33,48.84-122.54,108.33h244.19Z"/><path class="jl2" d="M156.86,690.26c-80.96,0-149.33-54.53-156.86-60.74l62.47-75.96c13.14,10.67,55.71,38.36,94.39,38.36,48.83,0,104.88-14.86,104.88-130.67V155.23H111.52V56.88h248.57v404.37c0,206.7-142.12,229.01-203.23,229.01Z"/><g><path class="jl2" d="M1012.37,227.51v452.85h-98.56V227.51h98.56Z"/><path class="jl1" d="M1001.75.84l-33.89,12.26c-3.09,1.12-6.47,1.12-9.55,0l-33.89-12.26c-4.77-1.72-10.09-.75-13.93,2.56l-38.61,33.22c-3.91,3.37-5.66,8.61-4.55,13.66l8.3,37.76c.59,2.69,1.96,5.14,3.93,7.06l73.75,71.57c5.45,5.29,14.11,5.29,19.55,0l73.75-71.57c1.97-1.92,3.34-4.37,3.93-7.06l8.3-37.76c1.11-5.04-.64-10.29-4.55-13.66l-38.61-33.22c-3.84-3.31-9.17-4.28-13.93-2.56Z"/></g></svg>`;

const JAY_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080"><defs><style>.jy1{fill:none;stroke:#333;stroke-miterlimit:10;stroke-width:54px}.jy2{fill:#de57ff}.jy3{fill:#333}</style></defs><path class="jy2" d="M741.19,100.43l-176.34,63.8c-16.06,5.81-33.64,5.81-49.7,0l-176.33-63.8c-24.8-8.97-52.51-3.88-72.49,13.32l-200.92,172.88c-20.37,17.52-29.47,44.82-23.7,71.06l43.21,196.49c3.08,13.98,10.2,26.76,20.47,36.73l383.75,372.41c28.34,27.5,73.4,27.5,101.74,0l383.75-372.41c10.28-9.97,17.4-22.75,20.47-36.73l43.21-196.49c5.77-26.24-3.33-53.54-23.69-71.06l-200.92-172.88c-19.99-17.2-47.69-22.29-72.49-13.32"/><g><path class="jy1" d="M393.74,694.31s70,57.8,146.65,57.8,137.77-57.8,137.77-57.8"/><path class="jy3" d="M451.17,405.98c0,28.49-23.09,51.59-51.59,51.59s-51.58-23.09-51.58-51.59,23.1-51.59,51.58-51.59,51.59,23.1,51.59,51.59"/><path class="jy3" d="M794.51,405.98c0,28.49-23.09,51.59-51.59,51.59s-51.58-23.09-51.58-51.59,23.1-51.59,51.58-51.59,51.59,23.1,51.59,51.59"/><path class="jy1" d="M463.73,584.77s32.93,27.19,68.99,27.19,84.64-14.8,84.64-98.82v-195.17h-109.56"/></g></svg>`;

const KF = `
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
@keyframes scaleIn{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}
@keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.6}}
@keyframes breathe{0%,100%{transform:scale(1);opacity:.08}50%{transform:scale(1.1);opacity:.12}}
@keyframes growX{from{transform:scaleX(0)}to{transform:scaleX(1)}}
`;

// ── DATA ──
const executiveSummaryRows = [
  {category:"Total Sum of Donations with Deposits (in NIS)*",y1:"144,439,735",y2:"184,384,550",y3:"302,109,521",changeRate:"64%",bold:true},
  {category:"Total Sum of Donations with Grants (in NIS)*",y1:"147,588,910",y2:"167,055,776",y3:"219,333,928",changeRate:"31%",bold:true},
  {category:"Sum of Local Online Donations (in NIS)",y1:"54,964,870",y2:"57,629,720",y3:"65,424,410",changeRate:"14%"},
  {category:"Sum of Foreign Online Donations (in NIS)",y1:"34,496,699",y2:"23,008,638",y3:"18,739,812",changeRate:"-19%"},
  {category:"DAF Deposits (in NIS)",y1:"32,511,150",y2:"89,408,200",y3:"195,388,605",changeRate:"119%"},
  {category:"DAF Grants (in NIS)",y1:"35,660,325",y2:"72,079,426",y3:"112,613,012",changeRate:"56%"},
  {category:"Others (wire, wallet, cheque)",y1:"12,420,489",y2:"7,397,806",y3:"10,861,562",changeRate:"47%"},
  {category:"Number Of Online Donations",y1:"237,488",y2:"243,062",y3:"236,399",changeRate:"-3%"},
  {category:"Number of Donors",y1:"165,810",y2:"157,859",y3:"155,236",changeRate:"-2%"},
  {category:"Number of Active Charities",y1:"1,802",y2:"2,323",y3:"2,748",changeRate:"18%"},
];
const growthBySources = [
  {source:"Local Online",y1:55,y2:58,y3:65},{source:"Foreign Online",y1:35,y2:23,y3:19},
  {source:"DAF Deposits",y1:33,y2:89,y3:195},{source:"DAF Grants",y1:36,y2:72,y3:113},
  {source:"Others",y1:12,y2:7,y3:11},{source:"Offline",y1:10,y2:7,y3:12},
];

const slides = [
  {id:"title",title:"Board of Directors",category:"intro"},
  {id:"israel-donors",title:"Donors in Israel and Jgive's Share",category:"data"},
  {id:"israel-share-jgive",title:"Jgive's Share of Sum Donations in Israel",category:"data"},
  {id:"fundraising-combined",title:"Fundraising Jan-Jun 2026",category:"data"},
  {id:"donations-year-combined",title:"Sum of Donations by Year",category:"data"},
  {id:"donations-janmay-combined",title:"Donations Jan-Jun",category:"data"},
  {id:"growth-sources",title:"Growth by Sources",category:"data"},
  {id:"num-donations-year",title:"Donations by Year",category:"data"},
  {id:"num-donors-year",title:"Donors by Year",category:"data"},
  {id:"charities-year",title:"Active Charities",category:"data"},
  {id:"daf-year",title:"DAF — Full Year",category:"data"},
  {id:"daf-indepth",title:"DAF In-Depth",category:"data"},
  {id:"executive-summary",title:"Executive Summary",category:"data"},
  {id:"topics",title:"Topics",category:"data"},
  {id:"thank-you",title:"Thank You",category:"intro"},
  {id:"appendix-title",title:"Appendix",category:"intro"},
  {id:"history-deposits",title:"Jgive History (Deposits)",category:"data"},
  {id:"history-grants",title:"Jgive History (Grants)",category:"data"},
  {id:"num-donations-janmay",title:"Donations Jan-May",category:"data"},
  {id:"num-donors-janmay",title:"Donors Jan-May",category:"data"},
  {id:"charities-janmay",title:"Charities Jan-May",category:"data"},
  {id:"daf-janmay",title:"DAF — Jan-May",category:"data"},
];

// ── COMPONENTS ──
function SL({children,bgColor,dir,footnote}) {
  return <div dir={dir||"ltr"} style={{width:1920,height:1080,background:bgColor||C.bg,position:"relative",overflow:"hidden",fontFamily:"'Inter',sans-serif"}}>
    {children}
    {footnote && <div style={{position:"absolute",bottom:55,right:40,fontSize:16,color:C.muted,fontStyle:"italic"}}>* {footnote}</div>}
    <div style={{position:"absolute",bottom:0,left:0,right:0,height:50,borderTop:"1px solid hsl(33,20%,75%)",display:"flex",alignItems:"center",justifyContent:"flex-end",paddingRight:40}}>
      <span style={{fontSize:14,fontWeight:300,color:C.muted}}><span style={{fontWeight:600,color:C.primary}}>Jgive</span> | Internal Document</span>
    </div>
  </div>;
}
function Pill({children,style:s}) {
  return <div style={{display:"inline-block",background:"hsla(33,20%,80%,0.6)",borderRadius:999,padding:"14px 40px",marginBottom:30,...s}}>
    <span style={{fontSize:40,fontWeight:900,color:C.fg}}>{children}</span>
  </div>;
}
const mkY=(s,e,v)=>v.map((val,i)=>({year:String(s+i),value:val}));

function PredDot(props,color,key) {
  if(!props||!props.cx||!props.cy)return null;
  const v=key==="predLine"?props.payload?.predLine:props.payload?.obs;
  if(v==null)return null;
  if(key==="predLine"&&props.payload.main!=null)return null;
  const fmt=typeof v==="number"&&v>1000?v.toLocaleString():v;
  return <g key={props.key}><circle cx={props.cx} cy={props.cy} r={6} fill={color} stroke="white" strokeWidth={2}/><text x={props.cx} y={props.cy-14} textAnchor="middle" fill={color} fontSize={14} fontWeight={700}>{fmt}</text></g>;
}

// Fixed ticks helper
const fixedTicks = (ticks) => ({ ticks, domain: [0, ticks[ticks.length - 1]] });

function PredLineChart({title,subtitle,data,observed,predicted,vf,noteText,yDomain,yTicks,extraLine}) {
  const fmt=vf||(v=>v!=null?v:"");
  const ny=String(Number(data[data.length-1].year)+1);
  const lv=data[data.length-1].value;
  const cd=data.map((d,i)=>({year:d.year,main:d.value,predLine:i===data.length-1?lv:null,obs:null}));
  cd.push({year:ny,main:null,predLine:predicted,obs:observed});
  const yAxisProps = yTicks
    ? { ticks: yTicks, domain: [0, yTicks[yTicks.length - 1]] }
    : { domain: yDomain||["auto","auto"] };
  return <div style={{flex:1,display:"flex",flexDirection:"column"}}>
    {noteText && <div style={{fontSize:18,fontWeight:700,color:C.darkPurple,background:"hsla(288,80%,35%,0.12)",borderRadius:8,padding:"4px 14px",marginBottom:8,alignSelf:"flex-start"}}>{noteText}</div>}
    <div style={{flex:1,display:"flex"}}>
      <div style={{flex:1,position:"relative"}}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={cd} margin={{top:30,right:40,bottom:20,left:10}}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsla(33,20%,70%,0.3)" vertical={false}/>
            <XAxis dataKey="year" tick={{fill:C.introCategory,fontSize:14}}/>
            <YAxis tick={{fill:C.introCategory,fontSize:12}} {...yAxisProps}
              tickFormatter={v=>typeof v==="number"&&v>=1000?(v/1000)+"K":v}/>
            <Line type="monotone" dataKey="main" stroke={C.primary} strokeWidth={3} dot={{r:5,fill:C.primary,stroke:"white",strokeWidth:2}}>
              <LabelList dataKey="main" position="top" fill={C.fg} style={{fill:C.fg,fontSize:12,fontWeight:600}} formatter={fmt}/></Line>
            <Line type="monotone" dataKey="predLine" stroke={C.brown} strokeWidth={2} strokeDasharray="8 4" dot={p=>PredDot(p,C.brown,"predLine")}/>
            <Line type="monotone" dataKey="obs" stroke="transparent" strokeWidth={0} dot={p=>PredDot(p,C.darkPurple,"obs")}/>
          </ComposedChart>
        </ResponsiveContainer>
        <div style={{position:"absolute",bottom:80,right:60,background:"hsla(288,100%,67%,0.13)",border:"1.5px solid "+C.primary,borderRadius:10,padding:"7px 12px",maxWidth:300,fontSize:11,fontWeight:600,color:C.darkPurple,lineHeight:1.4,pointerEvents:"none"}}>
          Prediction for 2026 is a conservative forecast based on the growth rate from Jan-Jun 2026 vs. Jan-Jun 2025, applied to total 2025 donations
          {extraLine && <div style={{marginTop:6,paddingTop:6,borderTop:"1px solid "+C.primary}}>{extraLine}</div>}
        </div>
      </div>
      <div style={{width:130,display:"flex",flexDirection:"column",justifyContent:"center",gap:14,paddingLeft:10}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:14,height:14,borderRadius:"50%",background:C.darkPurple}}/><span style={{fontSize:13,fontWeight:600}}>Observed</span></div>
        <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:14,height:14,borderRadius:"50%",background:C.brown}}/><span style={{fontSize:13,fontWeight:600}}>Predicted</span></div>
      </div>
    </div>
  </div>;
}

function GrowthLine({data,noteText,yDomain,yTicks,vf,growthOverride}) {
  const fmt=vf||(v=>v);
  const growthRates=growthOverride ? [null,...growthOverride] : data.map((d,i)=>{
    if(i===0)return null;
    const prev=data[i-1].value;
    const curr=d.value;
    if(prev===0)return null;
    return ((curr-prev)/prev*100).toFixed(1)+"%";
  });
  const yAxisProps = yTicks
    ? { ticks: yTicks, domain: [0, yTicks[yTicks.length - 1]] }
    : { domain: yDomain||["auto","auto"] };
  return <div style={{flex:1,display:"flex",flexDirection:"column"}}>
    {noteText && <div style={{fontSize:18,fontWeight:700,color:C.darkPurple,background:"hsla(288,80%,35%,0.12)",borderRadius:8,padding:"4px 14px",marginBottom:8,alignSelf:"flex-start"}}>{noteText}</div>}
    <div style={{flex:1}}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{top:40,right:60,bottom:20,left:10}}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsla(33,20%,70%,0.3)" vertical={false}/>
          <XAxis dataKey="year" tick={{fill:C.introCategory,fontSize:14}}/>
          <YAxis tick={{fill:C.introCategory,fontSize:12}} {...yAxisProps}
            tickFormatter={v=>typeof v==="number"&&v>=1000?(v/1000)+"K":v}/>
          <Line type="monotone" dataKey="value" stroke={C.primary} strokeWidth={3}
            dot={{r:5,fill:C.primary,stroke:"white",strokeWidth:2}}
            label={({x,y,index,value})=>{
              if(index===0)return null;
              const gr=growthRates[index];
              if(!gr)return null;
              return <text x={x} y={y-28} textAnchor="middle" fill={C.green} fontSize={12} fontWeight={700}>{gr}</text>;
            }}>
            <LabelList dataKey="value" position="top" fill={C.fg} style={{fill:C.fg,fontSize:12,fontWeight:600}} formatter={fmt}/>
          </Line>
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>;
}

function SimpleLine({title,data,footnote,vf}) {
  const fmt=vf||(v=>v);
  return <SL footnote={footnote}><div style={{padding:"80px 80px 60px",height:"100%",display:"flex",flexDirection:"column"}}>
    <Pill>{title}</Pill><div style={{flex:1}}><ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{top:30,right:60,bottom:20,left:20}}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsla(33,20%,70%,0.3)" vertical={false}/>
        <XAxis dataKey="year" tick={{fill:C.introCategory,fontSize:16}}/><YAxis tick={{fill:C.introCategory,fontSize:14}}/>
        <Line type="monotone" dataKey="value" stroke={C.primary} strokeWidth={3} dot={{r:5,fill:C.primary}}>
          <LabelList dataKey="value" position="top" fill={C.fg} style={{fill:C.fg,fontSize:14,fontWeight:600}} formatter={fmt}/></Line>
      </LineChart></ResponsiveContainer></div></div></SL>;
}

function DualPred({tL,dL,oL,pL,tR,dR,oR,pR,topText,footnote,yTicksL,yTicksR,exL,exR}) {
  const rc=(data,obs,pred,t,yTicks,ex)=>{
    const ny=String(Number(data[data.length-1].year)+1),lv=data[data.length-1].value;
    const cd=data.map((d,i)=>({year:d.year,main:d.value,predLine:i===data.length-1?lv:null,obs:null}));
    cd.push({year:ny,main:null,predLine:pred,obs:obs});
    const yAxisProps = yTicks
      ? { ticks: yTicks, domain: [0, yTicks[yTicks.length - 1]] }
      : {};
    return <div style={{flex:1,display:"flex",flexDirection:"column"}}><h3 style={{fontSize:20,fontWeight:700,marginBottom:8}}>{t}</h3>
      <div style={{flex:1,display:"flex"}}><div style={{flex:1,position:"relative"}}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={cd} margin={{top:20,right:20,bottom:10,left:10}}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsla(33,20%,70%,0.3)" vertical={false}/>
            <XAxis dataKey="year" tick={{fontSize:13}}/>
            <YAxis tick={{fontSize:13}} {...yAxisProps}/>
            <Line type="monotone" dataKey="main" stroke={C.primary} strokeWidth={2} dot={{r:4,fill:C.primary}}>
              <LabelList dataKey="main" position="top" fill={C.fg} style={{fill:C.fg,fontSize:12,fontWeight:600}}/></Line>
            <Line type="monotone" dataKey="predLine" stroke={C.brown} strokeWidth={2} strokeDasharray="8 4" dot={p=>PredDot(p,C.brown,"predLine")}/>
            <Line type="monotone" dataKey="obs" stroke="transparent" strokeWidth={0} dot={p=>PredDot(p,C.darkPurple,"obs")}/>
          </ComposedChart>
        </ResponsiveContainer>
        <div style={{position:"absolute",bottom:55,right:"8%",background:"hsla(288,100%,67%,0.13)",border:"1.5px solid "+C.primary,borderRadius:8,padding:"5px 9px",maxWidth:230,fontSize:10,fontWeight:600,color:C.darkPurple,lineHeight:1.4,pointerEvents:"none"}}>
          This prediction indicates that total donations for Jun-Dec 2026 will be lower than the same period in 2025
          {ex && <div style={{marginTop:5,paddingTop:5,borderTop:"1px solid "+C.primary}}>{ex}</div>}
        </div>
      </div>
        <div style={{width:90,display:"flex",flexDirection:"column",justifyContent:"center",gap:10}}>
          <div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:10,height:10,borderRadius:"50%",background:C.darkPurple}}/><span style={{fontSize:11,fontWeight:600}}>Observed</span></div>
          <div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:10,height:10,borderRadius:"50%",background:C.brown}}/><span style={{fontSize:11,fontWeight:600}}>Predicted</span></div>
        </div></div></div>;
  };
  return <SL footnote={footnote}><div style={{padding:"60px 60px 50px",display:"flex",flexDirection:"column",height:"100%"}}>
    <Pill style={{marginBottom:16}}>In-depth analysis: DAF</Pill>
    {topText&&<p style={{fontSize:17,lineHeight:1.6,color:"hsl(220,20%,30%)",maxWidth:1700,marginBottom:16}} dangerouslySetInnerHTML={{__html:topText}}/>}
    <div style={{flex:1,display:"flex",gap:40}}>{rc(dL,oL,pL,tL,yTicksL,exL)}<div style={{width:3,background:C.primary,alignSelf:"stretch",borderRadius:2}}/>{rc(dR,oR,pR,tR,yTicksR,exR)}</div>
  </div></SL>;
}

function DualSimple({tL,dL,tR,dR}) {
  const rc=(data,t)=><div style={{flex:1,display:"flex",flexDirection:"column"}}><h3 style={{fontSize:20,fontWeight:700,marginBottom:8}}>{t}</h3>
    <div style={{flex:1}}><ResponsiveContainer width="100%" height="100%"><LineChart data={data} margin={{top:20,right:40,bottom:10,left:10}}>
      <CartesianGrid strokeDasharray="3 3" stroke="hsla(33,20%,70%,0.3)" vertical={false}/>
      <XAxis dataKey="year" tick={{fontSize:13}}/><YAxis tick={{fontSize:13}}/>
      <Line type="monotone" dataKey="value" stroke={C.primary} strokeWidth={2} dot={{r:4,fill:C.primary}}>
        <LabelList dataKey="value" position="top" fill={C.fg} style={{fill:C.fg,fontSize:12,fontWeight:600}}/></Line>
    </LineChart></ResponsiveContainer></div></div>;
  return <SL><div style={{padding:"60px 60px 50px",display:"flex",flexDirection:"column",height:"100%"}}>
    <Pill style={{marginBottom:16}}>In-depth analysis: DAF</Pill>
    <div style={{flex:1,display:"flex",gap:40}}>{rc(dL,tL)}<div style={{width:3,background:C.primary,alignSelf:"stretch",borderRadius:2}}/>{rc(dR,tR)}</div>
  </div></SL>;
}

// ── MAIN ──
export default function App() {
  const [cur,setCur]=useState(0);
  const [isFs,setIsFs]=useState(false);
  const [unlocked,setUnlocked]=useState(()=>{try{return sessionStorage.getItem("pu")==="1"}catch{return false}});
  const [pw,setPw]=useState("");const [err,setErr]=useState(false);
  const ref=useRef(null);const [scale,setScale]=useState(1);
  const total=slides.length;
  const goN=useCallback(()=>setCur(c=>Math.min(c+1,total-1)),[total]);
  const goP=useCallback(()=>setCur(c=>Math.max(c-1,0)),[]);
  useEffect(()=>{const h=e=>{if(e.key==="ArrowRight"||e.key==="ArrowDown"||e.key===" "){e.preventDefault();goN()}if(e.key==="ArrowLeft"||e.key==="ArrowUp"){e.preventDefault();goP()}if(e.key==="f"||e.key==="F"){if(!document.fullscreenElement)ref.current?.requestFullscreen?.();else document.exitFullscreen?.()}};window.addEventListener("keydown",h);return()=>window.removeEventListener("keydown",h)},[goN,goP]);
  useEffect(()=>{const h=()=>setIsFs(!!document.fullscreenElement);document.addEventListener("fullscreenchange",h);return()=>document.removeEventListener("fullscreenchange",h)},[]);
  useEffect(()=>{const el=ref.current;if(!el)return;const c=()=>setScale(Math.min(el.clientWidth/1920,el.clientHeight/1080));c();const ro=new ResizeObserver(c);ro.observe(el);return()=>ro.disconnect()},[]);
  const tFs=()=>{if(!document.fullscreenElement)ref.current?.requestFullscreen?.();else document.exitFullscreen?.()};
  const cc=cat=>cat==="intro"?C.introCategory:C.dataCategory;
  const sub=()=>{if(pw==="Jgive2026!"){setUnlocked(true);try{sessionStorage.setItem("pu","1")}catch{}}else{setErr(true);setTimeout(()=>setErr(false),2000)}};

  if(!unlocked) return <div style={{width:"100vw",height:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Inter',sans-serif"}}>
    <div style={{background:"hsl(33,30%,92%)",borderRadius:24,padding:"48px 56px",boxShadow:"0 8px 40px hsla(220,20%,10%,0.08)",textAlign:"center",maxWidth:420}}>
      <div style={{width:64,height:64,borderRadius:"50%",background:C.primary,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 24px"}}><Lock size={28} color="white"/></div>
      <div style={{fontSize:28,fontWeight:800,color:C.fg,marginBottom:8}}>Internal Presentation</div>
      <div style={{fontSize:16,color:C.muted,marginBottom:32}}>Enter password to access</div>
      <input type="password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sub()} placeholder="Password" style={{width:"100%",padding:"14px 18px",fontSize:18,borderRadius:12,border:"2px solid "+(err?"hsl(0,65%,50%)":C.border),outline:"none",background:"white",marginBottom:16,boxSizing:"border-box"}}/>
      <button onClick={sub} style={{width:"100%",padding:"14px",fontSize:18,fontWeight:700,color:"white",background:C.primary,border:"none",borderRadius:12,cursor:"pointer"}}>Unlock</button>
      {err&&<div style={{marginTop:12,fontSize:14,color:"hsl(0,65%,50%)"}}>Incorrect password</div>}
    </div></div>;

  const rs=()=>{
    const id=slides[cur].id;
    switch(id){

    // ── 1. TITLE ──
    case "title": return <SL bgColor={C.bg}><div style={{width:"100%",height:"100%",position:"relative",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
      <div style={{position:"absolute",top:-100,right:-100,width:420,height:420,borderRadius:"50%",background:C.primary,opacity:0.07,animation:"breathe 6s infinite"}}/>
      <div style={{position:"absolute",bottom:-80,left:-80,width:340,height:340,borderRadius:"50%",background:C.primary,opacity:0.05,animation:"breathe 6s infinite 1s"}}/>
      <div style={{position:"absolute",top:"50%",left:-120,transform:"translateY(-50%)",width:220,height:220,borderRadius:"50%",background:C.primary,opacity:0.04}}/>
      <div style={{position:"absolute",top:200,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,"+C.primary+",transparent)",opacity:0.35}}/>
      <div style={{position:"absolute",bottom:200,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,"+C.primary+",transparent)",opacity:0.35}}/>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:0,position:"relative",zIndex:2}}>
        <div style={{width:440,marginBottom:32,filter:"drop-shadow(0 4px 16px hsla(288,100%,50%,0.12))"}}
          dangerouslySetInnerHTML={{__html:JGIVE_LOGO_SVG}}/>
        <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:32,width:560}}>
          <div style={{flex:1,height:1.5,background:"linear-gradient(90deg,transparent,"+C.primary+")"}}/>
          <div style={{width:8,height:8,borderRadius:"50%",background:C.primary}}/>
          <div style={{flex:1,height:1.5,background:"linear-gradient(90deg,"+C.primary+",transparent)"}}/>
        </div>
        <div style={{width:260,marginBottom:32,filter:"drop-shadow(0 8px 32px hsla(288,100%,50%,0.20))"}}
          dangerouslySetInnerHTML={{__html:JAY_SVG}}/>
        <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:32,width:560}}>
          <div style={{flex:1,height:1.5,background:"linear-gradient(90deg,transparent,"+C.primary+")"}}/>
          <div style={{width:8,height:8,borderRadius:"50%",background:C.primary}}/>
          <div style={{flex:1,height:1.5,background:"linear-gradient(90deg,"+C.primary+",transparent)"}}/>
        </div>
        <div style={{background:"hsl(33,38%,71%)",borderRadius:999,padding:"14px 48px"}}>
          <span style={{fontSize:26,fontWeight:700,color:"hsl(220,25%,20%)",letterSpacing:1}}>Board of Directors  |  July 2026</span>
        </div>
      </div>
    </div></SL>;

    // ── 2a. DONORS IN ISRAEL (right plot, full width) ──
    case "israel-donors": {
      const donorBars=[{y:"2015",d:0,p:0},{y:"2016",d:15,p:0.4},{y:"2017",d:43,p:1.2},{y:"2018",d:81,p:2.3},{y:"2019",d:153,p:4.5},{y:"2020",d:196,p:6.2},{y:"2021",d:161,p:4.4},{y:"2022",d:201,p:5.7},{y:"2023",d:314,p:7.2},{y:"2024",d:294,p:7.2},{y:"2025",d:276,p:null}];
      const rightYTicks=[50,100,150,200,250,300,350];
      return <SL><div style={{padding:"70px 60px 60px",height:"100%",display:"flex",flexDirection:"column"}}>
        <Pill>Donors in Israel and Jgive's Share</Pill>
        <h3 style={{fontSize:22,fontWeight:700,marginBottom:6}}>Number of Jgive Donors, and their share of all Israeli Donors</h3>
        <div style={{fontSize:17,fontWeight:600,color:C.darkPurple,marginBottom:14}}>In 2020, online donors accounted for 20% of all donors</div>
        <div style={{flex:1}}><ResponsiveContainer width="100%" height="100%"><ComposedChart data={donorBars} margin={{top:30,right:60,bottom:20,left:20}}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsla(33,20%,70%,0.3)" vertical={false}/>
          <XAxis dataKey="y" tick={{fill:C.introCategory,fontSize:16}}/>
          <YAxis yAxisId="left" tick={{fill:C.introCategory,fontSize:14}} tickFormatter={v=>v+"K"}
            ticks={rightYTicks} domain={[0, 350]}/>
          <YAxis yAxisId="right" orientation="right" tick={{fill:C.muted,fontSize:14}} tickFormatter={v=>v+"%"} domain={[0,9]}/>
          <Bar yAxisId="left" dataKey="d" fill={C.primary} radius={[6,6,0,0]} barSize={54}>
            <LabelList dataKey="d" position="inside" fill={"white"} style={{fill:"white",fontSize:14,fontWeight:700}} formatter={v=>v>0?v+"K":""}/></Bar>
          <Line yAxisId="right" type="monotone" dataKey="p" stroke={C.fg} strokeWidth={2} dot={{r:5,fill:C.fg}}>
            <LabelList dataKey="p" position="top" fill={C.fg} style={{fill:C.fg,fontSize:14,fontWeight:700}} formatter={v=>v!=null?v+"%":""}/></Line>
        </ComposedChart></ResponsiveContainer></div>
      </div></SL>;}

    // ── 2b. JGIVE'S SHARE OF SUM DONATIONS IN ISRAEL (left plot, full width + purple box) ──
    case "israel-share-jgive": {
      const shareData=[{year:"2019",value:0.61},{year:"2020",value:0.69},{year:"2021",value:0.67},{year:"2022",value:0.72},{year:"2023",value:1.35}];
      return <SL><div style={{padding:"70px 60px 60px",height:"100%",display:"flex",flexDirection:"column"}}>
        <Pill>Jgive's Share of Sum Donations in Israel</Pill>
        <div style={{flex:1}}><ResponsiveContainer width="100%" height="100%"><LineChart data={shareData} margin={{top:30,right:60,bottom:20,left:20}}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsla(33,20%,70%,0.3)" vertical={false}/>
          <XAxis dataKey="year" tick={{fill:C.introCategory,fontSize:16}}/><YAxis tick={{fill:C.introCategory,fontSize:14}} tickFormatter={v=>v+"%"} domain={[0.5,1.5]}/>
          <Line type="monotone" dataKey="value" stroke={C.primary} strokeWidth={3} dot={{r:6,fill:C.primary,stroke:"white",strokeWidth:2}}>
            <LabelList dataKey="value" position="top" fill={C.fg} style={{fill:C.fg,fontSize:16,fontWeight:700}} formatter={v=>v+"%"}/></Line>
        </LineChart></ResponsiveContainer></div>
        <div style={{marginTop:20,background:"linear-gradient(135deg,"+C.darkPurple+",hsl(288,80%,45%))",borderRadius:14,padding:"18px 28px",color:"white",fontSize:19,fontWeight:700,lineHeight:1.5}}>
          In 2023, Jgive accounted for 10% of donations from big donors (50K+) in Israel
        </div>
      </div></SL>;}

    // ── 3. FUNDRAISING COMBINED (moved before "Sum of Donations by Year") ──
    case "fundraising-combined": return <SL><div style={{width:"100%",height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 80px",gap:40}}>
      <div style={{maxWidth:1400,width:"100%",borderRadius:32,padding:"40px 60px",background:"linear-gradient(135deg,"+C.primary+",hsl(288,80%,55%))",boxShadow:"0 20px 60px -15px hsla(288,100%,40%,0.4)",position:"relative",overflow:"hidden"}}>
        <div style={{position:"relative",zIndex:1}}>
          <div style={{fontSize:20,fontWeight:500,textTransform:"uppercase",color:"hsla(0,0%,100%,0.75)",letterSpacing:1.5,marginBottom:10}}>
            TOTAL RAISED VIA Jgive IN JAN-JUN 2026: <strong>Inc. Deposits</strong>
          </div>
          <div style={{display:"flex",alignItems:"baseline",gap:12}}>
            <span style={{fontSize:72,fontWeight:900,color:"white",lineHeight:1}}>290,414,389</span>
            <span style={{fontSize:34,fontWeight:800,color:"hsla(0,0%,100%,0.8)"}}>NIS</span>
          </div>
          <div style={{fontSize:20,color:"hsla(0,0%,100%,0.85)",marginTop:8}}>to help charities do what they do best</div>
          <div style={{fontSize:16,color:"hsla(0,0%,100%,0.7)",marginTop:4}}>(302,109,521 Including Offline)</div>
        </div>
        <div style={{position:"absolute",top:20,right:30,textAlign:"center"}}>
          <div style={{background:"hsla(0,0%,100%,0.2)",backdropFilter:"blur(8px)",borderRadius:16,padding:"10px 22px",marginBottom:8}}>
            <div style={{fontSize:22,fontWeight:700,color:"white"}}>↑ 64%</div>
            <div style={{fontSize:12,color:"hsla(0,0%,100%,0.7)"}}>compared to Jan-Jun 2025</div>
          </div>
          <div style={{background:"hsla(0,0%,100%,0.15)",backdropFilter:"blur(8px)",borderRadius:12,padding:"8px 18px"}}>
            <div style={{fontSize:12,color:"hsla(0,0%,100%,0.7)"}}>Jan-Jun 2025</div>
            <div style={{fontSize:18,fontWeight:800,color:"white"}}>177,444,364 NIS</div>
          </div>
        </div>
      </div>
      <div style={{maxWidth:1400,width:"100%",borderRadius:32,padding:"40px 60px",background:"linear-gradient(135deg,"+C.primary+",hsl(288,80%,55%))",boxShadow:"0 20px 60px -15px hsla(288,100%,40%,0.4)",position:"relative",overflow:"hidden"}}>
        <div style={{position:"relative",zIndex:1}}>
          <div style={{fontSize:20,fontWeight:500,textTransform:"uppercase",color:"hsla(0,0%,100%,0.75)",letterSpacing:1.5,marginBottom:10}}>
            TOTAL RAISED VIA Jgive IN JAN-JUN 2026: <strong>Inc. Grants</strong>
          </div>
          <div style={{display:"flex",alignItems:"baseline",gap:12}}>
            <span style={{fontSize:72,fontWeight:900,color:"white",lineHeight:1}}>207,638,796</span>
            <span style={{fontSize:34,fontWeight:800,color:"hsla(0,0%,100%,0.8)"}}>NIS</span>
          </div>
          <div style={{fontSize:20,color:"hsla(0,0%,100%,0.85)",marginTop:8}}>to help charities do what they do best</div>
          <div style={{fontSize:16,color:"hsla(0,0%,100%,0.7)",marginTop:4}}>(219,333,928 Including Offline)</div>
        </div>
        <div style={{position:"absolute",top:20,right:30,textAlign:"center"}}>
          <div style={{background:"hsla(0,0%,100%,0.2)",backdropFilter:"blur(8px)",borderRadius:16,padding:"10px 22px",marginBottom:8}}>
            <div style={{fontSize:22,fontWeight:700,color:"white"}}>↑ 30%</div>
            <div style={{fontSize:12,color:"hsla(0,0%,100%,0.7)"}}>compared to Jan-Jun 2025</div>
          </div>
          <div style={{background:"hsla(0,0%,100%,0.15)",backdropFilter:"blur(8px)",borderRadius:12,padding:"8px 18px"}}>
            <div style={{fontSize:12,color:"hsla(0,0%,100%,0.7)"}}>Jan-Jun 2025</div>
            <div style={{fontSize:18,fontWeight:800,color:"white"}}>160,115,590 NIS</div>
          </div>
        </div>
      </div>
    </div></SL>;

    // ── 4. COMBINED DONATIONS BY YEAR — Y axis: 150, 300, 450, 600 ──
    case "donations-year-combined": {
      const dataDeposits=mkY(2018,2025,[37,75,106,129,170,361,354,416]);
      const dataGrants=mkY(2018,2025,[37,74,104,109,138,335,314,367]);
      const yTicks = [150, 300, 450, 600];
      return <SL><div style={{padding:"60px 60px 50px",display:"flex",flexDirection:"column",height:"100%"}}>
        <Pill style={{marginBottom:16}}>Sum of Donations (Excl. offline) by Year (M NIS)</Pill>
        <div style={{flex:1,display:"flex",flexDirection:"column",gap:20}}>
          <PredLineChart data={dataDeposits} observed={290} predicted={503} noteText="Including Deposits" yTicks={yTicks} extraLine="Sum Donations in H2 2025:  238.4 M NIS"/>
          <div style={{height:2,background:C.border,margin:"0 20px"}}/>
          <PredLineChart data={dataGrants} observed={208} predicted={439} noteText="Including Grants" yTicks={yTicks} extraLine="Sum Donations in H2 2025:  206.9 M NIS"/>
        </div>
      </div></SL>;}

    // ── 5. DONATIONS JAN-MAY COMBINED — Y axis: 50, 100, 150, 200, 250, 300 ──
    case "donations-janmay-combined": {
      const dataDeposits=mkY(2018,2026,[15,32,43,55,70,99,134,177,290]);
      const dataGrants=mkY(2018,2026,[15,32,42,49,68,85,138,160,208]);
      const yTicks = [50, 100, 150, 200, 250, 300];
      return <SL><div style={{padding:"60px 60px 50px",display:"flex",flexDirection:"column",height:"100%"}}>
        <Pill style={{marginBottom:16}}>Sum of Donations Jan-Jun (Excl. offline) by Year (M NIS)</Pill>
        <div style={{flex:1,display:"flex",flexDirection:"column",gap:20}}>
          <GrowthLine data={dataDeposits} noteText="Including Deposits" yTicks={yTicks} growthOverride={["106%","33%","29%","28%","41%","36%","32%","64%"]}/>
          <div style={{height:2,background:C.border,margin:"0 20px"}}/>
          <GrowthLine data={dataGrants} noteText="Including Grants" yTicks={yTicks} growthOverride={["106%","33%","15%","41%","25%","61%","16%","30%"]}/>
        </div>
      </div></SL>;}

    // ── 6. GROWTH SOURCES ──
    case "growth-sources": return <SL><div style={{padding:"70px 50px",display:"flex",gap:30,height:"100%"}}>
      <div style={{width:400,borderRight:"3px solid "+C.primary,paddingRight:30,display:"flex",flexDirection:"column",justifyContent:"center"}}>
        <Pill style={{fontSize:36,padding:"12px 28px"}}>Overview 2026</Pill>
        <p style={{fontSize:17,lineHeight:1.65,color:"hsl(220,20%,30%)"}}>In 2026, we observed a <strong>64% increase</strong> in total donations (inc. Deposits) and <strong>30% increase</strong> in total donations (inc. Grants). This increase is mainly due to <strong>119% increase in DAF Deposits</strong> and <strong>56% increase in DAF Grants</strong>, marking the most significant area of growth. Other segments also increased: online donations increased by 4%, with 14% increase in local online donations and 19% decrease in foreign online donations. Other payment methods (wire, cheques, etc.) increased by 47%, and offline donations increased by 69%.</p>
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}><h3 style={{fontSize:22,fontWeight:700,color:C.fg,marginBottom:16}}>Growth in Funds Raised by Sources (Million NIS)</h3>
        <div style={{flex:1}}><ResponsiveContainer width="100%" height="100%"><BarChart data={growthBySources} margin={{top:20,right:30,bottom:20,left:10}}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsla(33,20%,70%,0.3)" vertical={false}/>
          <XAxis dataKey="source" tick={{fill:C.introCategory,fontSize:13}}/><YAxis domain={[0,200]} tick={{fill:C.introCategory,fontSize:13}}/>
          <Bar dataKey="y1" name="Jan-Jun 2024" fill={C.beigeLight} radius={[4,4,0,0]}><LabelList dataKey="y1" position="top" fill={C.fg} style={{fill:C.fg,fontSize:12}}/></Bar>
          <Bar dataKey="y2" name="Jan-Jun 2025" fill={C.beigeDark} radius={[4,4,0,0]}><LabelList dataKey="y2" position="top" fill={C.fg} style={{fill:C.fg,fontSize:12}}/></Bar>
          <Bar dataKey="y3" name="Jan-Jun 2026" fill={C.primary} radius={[4,4,0,0]}><LabelList dataKey="y3" position="top" fill={C.fg} style={{fill:C.fg,fontSize:12}}/></Bar>
          <Legend wrapperStyle={{fontSize:14,fontWeight:600}}/></BarChart></ResponsiveContainer></div>
      </div></div></SL>;

    // ── 7. NUM DONATIONS BY YEAR ──
    case "num-donations-year": {
      const data=mkY(2018,2025,[108042,230844,277061,241802,290440,471250,499283,491097]);
      const ny="2026";const lv=data[data.length-1].value;
      const cd=data.map((d,i)=>({year:d.year,main:d.value,predLine:i===data.length-1?lv:null,obs:null}));
      cd.push({year:ny,main:null,predLine:477635,obs:236399});
      return <SL><div style={{padding:"80px 80px 60px",height:"100%",display:"flex",flexDirection:"column"}}>
        <Pill>Number of Donations by Year</Pill>
        <div style={{fontSize:17,fontWeight:600,color:"hsl(220,20%,40%)",marginBottom:18}}>In Jan-Jun 2025, Jgive recorded 243,062 donations, 3% higher than the same period in 2026</div>
        <div style={{flex:1,display:"flex"}}>
          <div style={{flex:1}}><ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={cd} margin={{top:30,right:40,bottom:20,left:20}}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsla(33,20%,70%,0.3)" vertical={false}/>
              <XAxis dataKey="year" tick={{fill:C.introCategory,fontSize:16}}/>
              <YAxis tick={{fill:C.introCategory,fontSize:14}} tickFormatter={v=>v>=1000?(v/1000)+"K":v} domain={[0,600000]}/>
              <Line type="monotone" dataKey="main" stroke={C.primary} strokeWidth={3} dot={{r:5,fill:C.primary,stroke:"white",strokeWidth:2}}>
                <LabelList dataKey="main" position="top" fill={C.fg} style={{fill:C.fg,fontSize:12,fontWeight:600}} formatter={v=>v?v.toLocaleString():""}/></Line>
              <Line type="monotone" dataKey="predLine" stroke={C.brown} strokeWidth={2} strokeDasharray="8 4" dot={p=>PredDot(p,C.brown,"predLine")}/>
              <Line type="monotone" dataKey="obs" stroke="transparent" strokeWidth={0} dot={p=>PredDot(p,C.darkPurple,"obs")}/>
            </ComposedChart>
          </ResponsiveContainer></div>
          <div style={{width:140,display:"flex",flexDirection:"column",justifyContent:"center",gap:16,paddingLeft:16}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:14,height:14,borderRadius:"50%",background:C.darkPurple}}/><span style={{fontSize:14,fontWeight:600}}>Observed</span></div>
            <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:14,height:14,borderRadius:"50%",background:C.brown}}/><span style={{fontSize:14,fontWeight:600}}>Predicted</span></div>
          </div>
        </div>
      </div></SL>;}

    // ── 8. NUM DONORS BY YEAR ──
    case "num-donors-year": {
      const data=mkY(2018,2025,[81302,152930,196493,161069,201350,313728,294136,276210]);
      const ny="2026";const lv=data[data.length-1].value;
      const cd=data.map((d,i)=>({year:d.year,main:d.value,predLine:i===data.length-1?lv:null,obs:null}));
      cd.push({year:ny,main:null,predLine:271621,obs:155236});
      return <SL><div style={{padding:"80px 80px 60px",height:"100%",display:"flex",flexDirection:"column"}}>
        <Pill>Number of Donors by Year</Pill>
        <div style={{fontSize:17,fontWeight:600,color:"hsl(220,20%,40%)",marginBottom:18}}>In Jan-Jun 2025, Jgive recorded 157,859 donors, 2% higher than the same period in 2026</div>
        <div style={{flex:1,display:"flex"}}>
          <div style={{flex:1}}><ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={cd} margin={{top:30,right:40,bottom:20,left:20}}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsla(33,20%,70%,0.3)" vertical={false}/>
              <XAxis dataKey="year" tick={{fill:C.introCategory,fontSize:16}}/>
              <YAxis tick={{fill:C.introCategory,fontSize:14}} tickFormatter={v=>v>=1000?(v/1000)+"K":v} domain={[0,400000]}/>
              <Line type="monotone" dataKey="main" stroke={C.primary} strokeWidth={3} dot={{r:5,fill:C.primary,stroke:"white",strokeWidth:2}}>
                <LabelList dataKey="main" position="top" fill={C.fg} style={{fill:C.fg,fontSize:12,fontWeight:600}} formatter={v=>v?v.toLocaleString():""}/></Line>
              <Line type="monotone" dataKey="predLine" stroke={C.brown} strokeWidth={2} strokeDasharray="8 4" dot={p=>PredDot(p,C.brown,"predLine")}/>
              <Line type="monotone" dataKey="obs" stroke="transparent" strokeWidth={0} dot={p=>PredDot(p,C.darkPurple,"obs")}/>
            </ComposedChart>
          </ResponsiveContainer></div>
          <div style={{width:140,display:"flex",flexDirection:"column",justifyContent:"center",gap:16,paddingLeft:16}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:14,height:14,borderRadius:"50%",background:C.darkPurple}}/><span style={{fontSize:14,fontWeight:600}}>Observed</span></div>
            <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:14,height:14,borderRadius:"50%",background:C.brown}}/><span style={{fontSize:14,fontWeight:600}}>Predicted</span></div>
          </div>
        </div>
      </div></SL>;}

    // ── 9. CHARITIES BY YEAR ──
    case "charities-year": {
      const chData=[
        {year:"2024",bottom:2429,top:0},
        {year:"2025",bottom:3073,top:0},
        {year:"2026",bottom:2748,top:887},
      ];
      const BottomLabel=(props)=>{
        const {x,y,width,height,value,index}=props;
        if(!value||value===0)return null;
        if(index===0||index===1){
          return <text x={x+width/2} y={y-12} textAnchor="middle" fill={C.fg} fontSize={22} fontWeight={700}>{value.toLocaleString()}</text>;
        }
        const cy=y+height/2+7;
        return <text x={x+width/2} y={cy} textAnchor="middle" fill="white" fontSize={18} fontWeight={700}>{value.toLocaleString()}</text>;
      };
      const TopLabel=(props)=>{
        const {x,y,width,height,index}=props;
        if(index!==2)return null;
        const cy=y+height/2+7;
        return <text x={x+width/2} y={cy} textAnchor="middle" fill="white" fontSize={18} fontWeight={700}>887</text>;
      };
      const TotalLabel=(props)=>{
        const {x,y,width,index}=props;
        if(index!==2)return null;
        return <text x={x+width/2} y={y-12} textAnchor="middle" fill={C.fg} fontSize={22} fontWeight={900}>3,635</text>;
      };
      return <SL><div style={{padding:"80px 80px 60px",height:"100%",display:"flex",flexDirection:"column"}}>
        <Pill>Active Charities by Year</Pill>
        <div style={{flex:1,display:"flex"}}><div style={{flex:1}}><ResponsiveContainer width="100%" height="100%">
          <BarChart data={chData} margin={{top:70,right:120,bottom:20,left:20}} barCategoryGap="40%">
            <CartesianGrid strokeDasharray="3 3" stroke="hsla(33,20%,70%,0.3)" vertical={false}/>
            <XAxis dataKey="year" tick={{fill:C.introCategory,fontSize:18}}/>
            <YAxis tick={{fill:C.introCategory,fontSize:14}} domain={[0,4500]}/>
            <Bar dataKey="bottom" stackId="s" fill={C.primary} radius={[0,0,0,0]} label={<BottomLabel/>}/>
            <Bar dataKey="top" stackId="s" fill={C.brown} radius={[8,8,0,0]} label={<TopLabel/>}>
              <LabelList content={<TotalLabel/>}/>
            </Bar>
          </BarChart>
        </ResponsiveContainer></div>
        <div style={{width:150,display:"flex",flexDirection:"column",justifyContent:"center",gap:14}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:14,height:14,borderRadius:3,background:C.primary}}/><span style={{fontSize:14,fontWeight:600}}>Observed</span></div>
          <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:14,height:14,borderRadius:3,background:C.brown}}/><span style={{fontSize:14,fontWeight:600}}>Predicted</span></div>
        </div></div>
      </div></SL>;}

    // ── 10. DAF FULL YEAR — 2025 left value updated to 220, extra note lines added ──
    case "daf-year": {
      const sharedYTicks = [50, 100, 150, 200, 250, 300, 350];
      return <DualPred
        tL="Deposits in Million NIS, by Year"
        dL={mkY(2020,2025,[9.2,41.9,69.4,105.5,133.1,220])}
        oL={195.4} pL={313.2}
        tR="Grants in Million NIS, by Year"
        dR={mkY(2020,2025,[7.9,22.3,36.9,79.2,98.2,171.8])}
        oR={112.6} pR={226.3}
        yTicksL={sharedYTicks}
        yTicksR={sharedYTicks}
        exL="Sum Deposits in H2 2025:  130.9 M NIS"
        exR="Sum Grants in H2 2025:  99.4 M NIS"
        topText="Our Donor-Advised Funds (DAFs) have demonstrated an exceptional growth in Jan-Jun 2026. In this period, 1,051 donors deposited more than 195 million NIS into their accounts, representing a <strong>119% increase</strong> compared to the same period in 2025 (89 million NIS). In parallel, approximately 113 million NIS were granted to charities from DAFs — an impressive <strong>56% increase</strong> of the same period last year — 72 million NIS."
      />;
    }

    // ── 11. DAF INDEPTH ──
    case "daf-indepth": {
      const pD=[
        {year:"2020",existing:0,newC:13,predNew:0,total:13},
        {year:"2021",existing:13,newC:48,predNew:0,total:61},
        {year:"2022",existing:61,newC:63,predNew:0,total:124},
        {year:"2023",existing:124,newC:80,predNew:0,total:204},
        {year:"2024",existing:204,newC:219,predNew:0,total:423},
        {year:"2025",existing:423,newC:244,predNew:0,total:667},
        {year:"2026",existing:667,newC:104,predNew:217,total:988},
      ];
      const TotalLabel=(props)=>{
        const {x,y,width,index}=props;
        const t=pD[index]?.total;
        if(t==null)return null;
        return <text x={x+width/2} y={y-8} textAnchor="middle" fill={C.fg} fontSize={14} fontWeight={800}>{t}</text>;
      };
      const sD=[{year:"2023",main:1.5,predLine:null,obs:null},{year:"2024",main:25,predLine:null,obs:null},{year:"2025",main:84,predLine:84,obs:null},{year:"2026",main:null,predLine:111,obs:47}];
      return <SL><div style={{padding:"60px 50px 50px",display:"flex",flexDirection:"column",height:"100%"}}>
        <Pill style={{marginBottom:20}}>In-depth analysis: DAF</Pill>
        <div style={{flex:1,display:"flex",gap:40}}>
          <div style={{flex:1,borderRight:"3px solid "+C.primary,paddingRight:30,display:"flex",flexDirection:"column"}}>
            <h3 style={{fontSize:20,fontWeight:700,marginBottom:10}}>New vs. Existing Platinum Clients by Year</h3>
            <div style={{flex:1}}><ResponsiveContainer width="100%" height="100%"><BarChart data={pD} margin={{top:36,right:10,bottom:10,left:10}}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsla(33,20%,70%,0.3)" vertical={false}/><XAxis dataKey="year" tick={{fontSize:14}}/><YAxis tick={{fontSize:14}}/>
              <Bar dataKey="existing" name="Existing Clients" stackId="a" fill={C.beigeDark}><LabelList dataKey="existing" position="inside" fill={"white"} style={{fill:"white",fontSize:12,fontWeight:600}}/></Bar>
              <Bar dataKey="newC" name="New Clients" stackId="a" fill={C.primary} radius={[0,0,0,0]}>
                <LabelList dataKey="newC" position="inside" fill={"white"} style={{fill:"white",fontSize:12,fontWeight:600}}/>
              </Bar>
              <Bar dataKey="predNew" name="Predicted New" stackId="a" fill="hsla(288,100%,67%,0.25)" radius={[4,4,0,0]}
                label={<TotalLabel/>}>
                <LabelList dataKey="predNew" position="inside" fill={C.fg} style={{fill:C.fg,fontSize:12,fontWeight:600}} formatter={v=>v>0?v+"(Pred.)":""}/>
              </Bar>
              <Legend wrapperStyle={{fontSize:13,fontWeight:700}}/>
            </BarChart></ResponsiveContainer></div>
          </div>
          <div style={{flex:1,display:"flex",flexDirection:"column"}}>
            <h3 style={{fontSize:20,fontWeight:700,marginBottom:10}}>Stock Donations in Million NIS by Year</h3>
            <div style={{flex:1,display:"flex"}}><div style={{flex:1}}><ResponsiveContainer width="100%" height="100%"><ComposedChart data={sD} margin={{top:20,right:20,bottom:10,left:10}}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsla(33,20%,70%,0.3)" vertical={false}/><XAxis dataKey="year" tick={{fontSize:14}}/><YAxis tick={{fontSize:14}}/>
              <Line type="monotone" dataKey="main" stroke={C.primary} strokeWidth={2} dot={{r:5,fill:C.primary}} connectNulls={false}><LabelList dataKey="main" position="top" fill={C.fg} style={{fill:C.fg,fontSize:14,fontWeight:600}}/></Line>
              <Line type="monotone" dataKey="predLine" stroke={C.brown} strokeWidth={2} strokeDasharray="8 4" dot={p=>PredDot(p,C.brown,"predLine")}/>
              <Line type="monotone" dataKey="obs" stroke="transparent" strokeWidth={0} dot={p=>PredDot(p,C.darkPurple,"obs")}/>
            </ComposedChart></ResponsiveContainer></div>
            <div style={{width:90,display:"flex",flexDirection:"column",justifyContent:"center",gap:10}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:10,height:10,borderRadius:"50%",background:C.darkPurple}}/><span style={{fontSize:11,fontWeight:600}}>Observed</span></div>
              <div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:10,height:10,borderRadius:"50%",background:C.brown}}/><span style={{fontSize:11,fontWeight:600}}>Predicted</span></div>
            </div></div>
            <div style={{marginTop:16,padding:"16px 24px",background:"linear-gradient(135deg,hsla(288,100%,67%,0.12),hsla(288,100%,67%,0.05))",borderRadius:16,borderLeft:"4px solid "+C.primary}}>
              <p style={{fontSize:26,fontWeight:800,color:C.fg,margin:0}}>In Jan-Jun 2026, Sum of Stock donations increased by more than <span style={{color:C.primary}}>220%</span></p>
            </div>
          </div>
        </div>
      </div></SL>;}

    // ── 12. EXECUTIVE SUMMARY ──
    case "executive-summary": {
      const isN=v=>v.startsWith("-");
      return <SL><div style={{padding:"70px 50px"}}>
        <Pill>Executive Summary</Pill>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:19}}>
          <thead><tr style={{background:"hsla(33,25%,80%,0.5)",borderBottom:"2px solid hsla(33,20%,70%,0.6)"}}>
            {["Category","Jan-Jun 2024","Jan-Jun 2025","Jan-Jun 2026","Change Rate 2025-2026"].map((h,i)=>
              <th key={i} style={{padding:"12px 14px",textAlign:i===0?"left":"center",fontWeight:600,color:C.fg,fontSize:17}}>{h}</th>)}
          </tr></thead>
          <tbody>{executiveSummaryRows.map((r,i)=>
            <tr key={i} style={{borderBottom:"1px solid hsla(33,20%,75%,0.3)"}}>
              <td style={{padding:"10px 14px",fontWeight:r.bold?700:400,fontSize:17}}>{r.category}</td>
              <td style={{padding:"10px 14px",textAlign:"center"}}>{r.y1}</td>
              <td style={{padding:"10px 14px",textAlign:"center"}}>{r.y2}</td>
              <td style={{padding:"10px 14px",textAlign:"center",fontWeight:600}}>{r.y3}</td>
              <td style={{padding:"10px 14px",textAlign:"center",fontWeight:700,color:isN(r.changeRate)?C.primary:C.green}}>{r.changeRate}</td>
            </tr>)}
          </tbody>
        </table>
      </div></SL>;}

    // ── 13. TOPICS ──
    case "topics": return <SL><div style={{width:"100%",height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
      <div style={{fontSize:56,fontWeight:900,color:C.fg,marginBottom:60}}>Topics</div>
      <div style={{maxWidth:700}}>
        {["Bank Accounts","KPMG Project","Adding Members: General Assembly and Board of Directors","Updates on Amendment 13 to the Privacy Protection Law"].map((item,i)=>
          <div key={i} style={{fontSize:28,fontWeight:500,color:C.fg,marginBottom:28,paddingLeft:20,borderLeft:"4px solid "+C.primary}}>
            {item}
          </div>)}
      </div>
    </div></SL>;

    // ── 14. THANK YOU ──
    case "thank-you": return <SL><div style={{width:"100%",height:"100%",position:"relative",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
      <div style={{position:"absolute",top:-80,right:-80,width:300,height:300,borderRadius:"50%",background:C.primary,opacity:0.08,animation:"breathe 5s infinite"}}/>
      <div style={{position:"absolute",bottom:-60,left:-60,width:250,height:250,borderRadius:"50%",background:C.primary,opacity:0.06}}/>
      <div style={{fontSize:82,fontWeight:900,color:C.fg}}>Thank You</div>
      <div style={{width:120,height:3,background:C.primary,marginTop:20,animation:"growX 0.8s ease 0.3s both",transformOrigin:"center"}}/>
      <div style={{marginTop:16,fontSize:20,color:C.muted,fontWeight:300}}>Jgive — Board of Directors 2026</div>
      <div style={{marginTop:30,width:220,filter:"drop-shadow(0 6px 24px hsla(288,100%,50%,0.2))"}}
        dangerouslySetInnerHTML={{__html:JAY_SVG}}/>
    </div></SL>;

    // ── 15. APPENDIX TITLE ──
    case "appendix-title": return <SL><div style={{width:"100%",height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
      <div style={{fontSize:28,fontWeight:500,color:C.muted,marginBottom:10,letterSpacing:4,textTransform:"uppercase"}}>Supplementary Data</div>
      <div style={{fontSize:120,fontWeight:900,color:C.fg}}>Appendix</div>
      <div style={{width:200,height:4,background:C.primary,marginTop:20,borderRadius:2}}/>
    </div></SL>;

    // ── 16-17. HISTORY ──
    case "history-deposits": return <SL footnote="Including Deposits, without Grants"><div style={{padding:"80px 80px 60px",height:"100%",display:"flex",flexDirection:"column"}}>
        <Pill>Jgive Throughout the Years</Pill>
        <div style={{fontSize:24,fontWeight:700,color:C.fg,marginBottom:20}}>Sum Donations in Jgive (Inc. Offline)</div>
        <div style={{flex:1}}><ResponsiveContainer width="100%" height="100%"><LineChart data={mkY(2015,2025,[0,6,31,59,105,136,147,186,421,374,432])} margin={{top:30,right:60,bottom:20,left:20}}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsla(33,20%,70%,0.3)" vertical={false}/>
          <XAxis dataKey="year" tick={{fill:C.introCategory,fontSize:16}}/><YAxis tick={{fill:C.introCategory,fontSize:14}}/>
          <Line type="monotone" dataKey="value" stroke={C.primary} strokeWidth={3} dot={{r:5,fill:C.primary}}>
            <LabelList dataKey="value" position="top" fill={C.fg} style={{fill:C.fg,fontSize:14,fontWeight:600}}/></Line>
        </LineChart></ResponsiveContainer></div></div></SL>;
    case "history-grants": return <SL footnote="Including Grants, without Deposits"><div style={{padding:"80px 80px 60px",height:"100%",display:"flex",flexDirection:"column"}}>
        <Pill>Jgive Throughout the Years</Pill>
        <div style={{fontSize:24,fontWeight:700,color:C.fg,marginBottom:20}}>Sum Donations in Jgive (Inc. Offline)</div>
        <div style={{flex:1}}><ResponsiveContainer width="100%" height="100%"><LineChart data={mkY(2015,2025,[0,6,31,59,105,136,127,154,394,334,383])} margin={{top:30,right:60,bottom:20,left:20}}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsla(33,20%,70%,0.3)" vertical={false}/>
          <XAxis dataKey="year" tick={{fill:C.introCategory,fontSize:16}}/><YAxis tick={{fill:C.introCategory,fontSize:14}}/>
          <Line type="monotone" dataKey="value" stroke={C.primary} strokeWidth={3} dot={{r:5,fill:C.primary}}>
            <LabelList dataKey="value" position="top" fill={C.fg} style={{fill:C.fg,fontSize:14,fontWeight:600}}/></Line>
        </LineChart></ResponsiveContainer></div></div></SL>;

    // ── 18. NUM DONATIONS JAN-MAY ──
    case "num-donations-janmay": {
      const data=mkY(2018,2026,[39486,91550,105800,102379,133679,170775,195707,210503,201861]);
      return <SL><div style={{padding:"80px 80px 60px",height:"100%",display:"flex",flexDirection:"column"}}>
        <Pill>Number of Donations Jan-May by Year</Pill>
        <div style={{flex:1}}><ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{top:30,right:60,bottom:20,left:20}}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsla(33,20%,70%,0.3)" vertical={false}/>
            <XAxis dataKey="year" tick={{fill:C.introCategory,fontSize:16}}/>
            <YAxis tick={{fill:C.introCategory,fontSize:14}} tickFormatter={v=>v>=1000?(v/1000)+"K":v}/>
            <Line type="monotone" dataKey="value" stroke={C.primary} strokeWidth={3} dot={{r:5,fill:C.primary}}>
              <LabelList dataKey="value" position="top" fill={C.fg} style={{fill:C.fg,fontSize:13,fontWeight:600}} formatter={v=>v?v.toLocaleString():""}/>
            </Line>
          </LineChart>
        </ResponsiveContainer></div>
      </div></SL>;}

    // ── 19. NUM DONORS JAN-MAY ──
    case "num-donors-janmay": {
      const data=mkY(2018,2026,[31583,70378,85118,75103,107258,132368,140880,139678,134511]);
      return <SL><div style={{padding:"80px 80px 60px",height:"100%",display:"flex",flexDirection:"column"}}>
        <Pill>Number of Donors Jan-May by Year</Pill>
        <div style={{flex:1}}><ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{top:30,right:60,bottom:20,left:20}}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsla(33,20%,70%,0.3)" vertical={false}/>
            <XAxis dataKey="year" tick={{fill:C.introCategory,fontSize:16}}/>
            <YAxis tick={{fill:C.introCategory,fontSize:14}} tickFormatter={v=>v>=1000?(v/1000)+"K":v}/>
            <Line type="monotone" dataKey="value" stroke={C.primary} strokeWidth={3} dot={{r:5,fill:C.primary}}>
              <LabelList dataKey="value" position="top" fill={C.fg} style={{fill:C.fg,fontSize:13,fontWeight:600}} formatter={v=>v?v.toLocaleString():""}/>
            </Line>
          </LineChart>
        </ResponsiveContainer></div>
      </div></SL>;}

    // ── 20. CHARITIES JAN-MAY ──
    case "charities-janmay": return <SL><div style={{padding:"80px 80px 60px",height:"100%",display:"flex",flexDirection:"column"}}><Pill>Number of Active Charities Jan-May by Year</Pill>
      <div style={{flex:1}}><ResponsiveContainer width="100%" height="100%"><BarChart data={[{year:"2024",value:1802},{year:"2025",value:2197},{year:"2026",value:2675}]} margin={{top:30,right:60,bottom:20,left:20}}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsla(33,20%,70%,0.3)" vertical={false}/><XAxis dataKey="year" tick={{fill:C.introCategory,fontSize:20}}/><YAxis tick={{fill:C.introCategory,fontSize:14}}/>
        <Bar dataKey="value" fill={C.primary} radius={[8,8,0,0]} barSize={120}><LabelList dataKey="value" position="top" fill={C.fg} style={{fill:C.fg,fontSize:22,fontWeight:700}} formatter={v=>v.toLocaleString()}/></Bar>
      </BarChart></ResponsiveContainer></div></div></SL>;

    // ── 21. DAF JAN-MAY ──
    case "daf-janmay": return <DualSimple tL="Deposits in Millions NIS, Jan-May" dL={mkY(2020,2026,[3.9,14.7,19.9,24.8,26.8,66.9,180.7])} tR="Grants in Millions NIS, Jan-May" dR={mkY(2020,2026,[3.4,7.7,16.6,18.6,29.9,62.2,96.1])}/>;

    default: return null;
    }
  };

  return <>
    <style>{KF}</style>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
    <div ref={ref} style={{width:"100vw",height:"100vh",background:"hsl(220,15%,12%)",position:"relative",overflow:"hidden",fontFamily:"'Inter',sans-serif"}}>
      <div style={{position:"absolute",left:"50%",top:"50%",width:1920,height:1080,marginLeft:-960,marginTop:-540,transform:`scale(${scale})`,transformOrigin:"center center"}}>
        <div key={cur}>{rs()}</div>
      </div>
      <div style={{position:"absolute",top:16,left:20,display:"flex",gap:10,alignItems:"center",zIndex:50}}>
        <div style={{background:"hsla(0,0%,100%,0.8)",backdropFilter:"blur(8px)",borderRadius:999,padding:"6px 14px",fontSize:14,fontWeight:600,color:"hsl(220,25%,25%)"}}>{cur+1}/{total}</div>
        <button onClick={tFs} style={{width:34,height:34,borderRadius:999,background:"hsla(0,0%,100%,0.8)",backdropFilter:"blur(8px)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
          {isFs?<Minimize size={15}/>:<Maximize size={15}/>}
        </button>
      </div>
      <div style={{position:"absolute",top:16,left:"50%",transform:"translateX(-50%)",zIndex:50}}>
        <div style={{background:cc(slides[cur].category),borderRadius:999,padding:"5px 18px",fontSize:13,fontWeight:700,color:"white",whiteSpace:"nowrap"}}>{slides[cur].title}</div>
      </div>
      <button onClick={goP} disabled={cur===0} style={{position:"absolute",left:16,top:"50%",transform:"translateY(-50%)",width:48,height:48,borderRadius:"50%",background:"hsla(0,0%,100%,0.6)",backdropFilter:"blur(8px)",border:"none",cursor:cur===0?"default":"pointer",opacity:cur===0?0.2:1,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 20px hsla(0,0%,0%,0.15)",zIndex:50}}>
        <ChevronLeft size={24} color="hsl(220,25%,25%)"/>
      </button>
      <button onClick={goN} disabled={cur===total-1} style={{position:"absolute",right:16,top:"50%",transform:"translateY(-50%)",width:48,height:48,borderRadius:"50%",background:"hsla(0,0%,100%,0.6)",backdropFilter:"blur(8px)",border:"none",cursor:cur===total-1?"default":"pointer",opacity:cur===total-1?0.2:1,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 20px hsla(0,0%,0%,0.15)",zIndex:50}}>
        <ChevronRight size={24} color="hsl(220,25%,25%)"/>
      </button>
      <div style={{position:"absolute",bottom:16,left:"50%",transform:"translateX(-50%)",display:"flex",gap:4,zIndex:50}}>
        {slides.map((s,i)=><button key={i} onClick={()=>setCur(i)} style={{width:i===cur?22:8,height:8,borderRadius:999,background:cc(s.category),opacity:i===cur?1:0.35,border:"none",cursor:"pointer",transition:"all 0.2s",padding:0}}/>)}
      </div>
    </div>
  </>;
}
