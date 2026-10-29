// R preprocessing runs at publication time; no R process runs inside the Worker.
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
const {WebR}=await import(process.argv[2]||'webr');
const r=new WebR();await r.init();
try{
 const input=await fs.readFile('analysis/data/florida-source.csv');
 await r.FS.writeFile('/input.csv',new Uint8Array(input));
 await r.evalRVoid(await fs.readFile('analysis/county_statistics.R','utf8'));
 const csv=new TextDecoder().decode(await r.FS.readFile('/output.csv'));
 const lines=csv.trim().split(/\r?\n/);const parse=s=>s.split(',').map(x=>x.replace(/^"|"$/g,''));const keys=parse(lines.shift());
 const rows=lines.map(l=>Object.fromEntries(parse(l).map((v,i)=>[keys[i],['county','fips'].includes(keys[i])?v:Number(v)])));
 if(rows.length!==67||rows.some(x=>!Number.isFinite(x.averageKw)))throw Error('Invalid R output');
 const meta={year:2016,publicationYear:2019,computedWith:await r.evalRString('R.version.string'),computedAt:new Date().toISOString(),source:'https://data.openei.org/submissions/149',retrievedFrom:'https://michaelminn.net/tutorials/data/2019-county-energy-profiles.csv',sourceSha256:createHash('sha256').update(input).digest('hex'),methodology:'2016 modeled NREL electricity estimates, published 2019; tabular redistribution by Michael Minn. R computes energy per occupied housing unit, expenditure-weighted average cents/kWh and mean county demand using 8,784 hours. Not measured hourly loads or current tariffs.',rows};
 await fs.writeFile('public/data/florida-counties.csv',csv);await fs.writeFile('public/data/florida-counties.json',JSON.stringify(meta));console.log(JSON.stringify({counties:rows.length,R:meta.computedWith,year:meta.year}));
}finally{await r.close()}
