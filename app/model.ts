import {planeIrradiance,type Radiation} from './solar-math';
export type Config={radiation?:Radiation;tilt:number;area:number;panels:number;watts:number;battery:number;direction:string;sun:number;shade:number;ac:number;hours:number;reserve:number;dayRate:number;nightRate:number;exportRate:number;fuel:number;burn:number;generatorKw:number;exportOn:boolean;efficiency:number;usable:number;inverter:number};
export const initial:Config={tilt:25,area:1800,panels:12,watts:420,battery:10.24,direction:'South',sun:5,shade:10,ac:2.5,hours:6,reserve:20,dayRate:16,nightRate:24,exportRate:0,fuel:3.5,burn:.55,generatorKw:3,exportOn:false,efficiency:.90,usable:.95,inverter:5};
export function simulate(c:Config){
 const orientation:Record<string,number>={North:.65,South:1,East:.82,West:.85};
 const poa=c.radiation?planeIrradiance(c.radiation,c.tilt,c.direction):null;
 const dailySolar=c.panels*c.watts/1000*(poa?poa.daily:c.sun*orientation[c.direction])*(1-c.shade/100)*.86;
 const weights=poa?poa.hourly:Array.from({length:24},(_,h)=>Math.max(0,Math.sin((h-6+(c.direction==='East'?1:c.direction==='West'?-1:0))/12*Math.PI))*(h>=5&&h<=20?1:0));const total=weights.reduce((a,b)=>a+b,0)||1;
 const max=c.battery*c.usable; const floor=max*c.reserve/100; let soc=floor;
 const eta=Math.sqrt(c.efficiency); let charged=0,discharged=0,direct=0,exported=0,curtailed=0,base=0,cost=0,loadTotal=0,nightLoad=0;
 const rows=weights.map((w,h)=>{const solar=dailySolar*w/total;const night=h>=18&&h<18+c.hours||h<Math.max(0,c.hours-6);const ac=night?c.ac:0;const load=.35*c.area/1800+ac;const use=Math.min(solar,load);const surplus=solar-use;const charge=Math.min(surplus,c.inverter,Math.max(0,(max-soc)/eta));soc+=charge*eta;const discharge=night?Math.min(load-use,c.inverter,Math.max(0,(soc-floor)*eta)):0;soc-=discharge/eta;const grid=load-use-discharge;const exp=c.exportOn?surplus-charge:0;const rate=night?c.nightRate:c.dayRate;const bill=(grid*rate-exp*c.exportRate)/100;
 charged+=charge;discharged+=discharge;direct+=use;exported+=exp;curtailed+=surplus-charge-exp;base+=load*rate/100;cost+=bill;loadTotal+=load;if(night)nightLoad+=load;
 return {h,solar,load,grid,charge,discharge,soc,export:exp,bill};});
 return {rows,dailySolar,charged,discharged,direct,exported,curtailed,base,cost,loadTotal,nightLoad,saved:base-cost,offset:100*(direct+discharged)/loadTotal,nightCoverage:nightLoad?100*discharged/nightLoad:0,generator:c.fuel*c.burn/c.generatorKw,storageIncrement:discharged*c.nightRate/100-charged*(c.exportOn?c.exportRate:0)/100};
}
