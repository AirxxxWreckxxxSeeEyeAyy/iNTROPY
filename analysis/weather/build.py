"""Reproduce published Tampa Bay weather summaries from retained NOAA/IEM source files."""
import csv,json,calendar,datetime,pathlib
from zoneinfo import ZoneInfo
root=pathlib.Path(__file__).resolve().parent
normals=[]
for r in csv.DictReader((root/'tampa-normals.csv').open()):
 normals.append({'month':int(r['month'])-1,'meanF':float(r['MLY-TAVG-NORMAL']),'highF':float(r['MLY-TMAX-NORMAL']),'lowF':float(r['MLY-TMIN-NORMAL']),'rainIn':float(r['MLY-PRCP-NORMAL'])})
# One routine report per local hour: last available report, no filling missing hours.
slots={}
for r in csv.DictReader((root/'airport-2025.csv').open()):
 t=datetime.datetime.fromisoformat(r['valid']).replace(tzinfo=datetime.timezone.utc).astimezone(ZoneInfo('America/New_York'))
 if t.year!=2025 or not 8<=t.hour<18: continue
 slots[(r['station'],t.month,t.day,t.hour)]=r
stations=[]
for station,name,kind in [('TPA','Tampa International','ASOS'),('PIE','St. Pete–Clearwater','ASOS'),('ZPH','Zephyrhills Municipal','AWOS')]:
 rows=[]
 for month in range(1,13):
  counts={'clear':0,'some':0,'cloudy':0,'obscured':0,'missing':0}
  for (s,m,d,h),r in slots.items():
   if s!=station or m!=month:continue
   sky={r.get('skyc'+str(i),'M') for i in range(1,5)}
   category='obscured' if 'VV' in sky else 'cloudy' if sky & {'BKN','OVC'} else 'some' if sky & {'FEW','SCT'} else 'clear' if sky & {'CLR','SKC','NSC','NCD'} else 'missing'
   counts[category]+=1
  valid=sum(counts[k] for k in ['clear','some','cloudy','obscured'])
  rows.append({'month':month-1,**counts,'valid':valid,'expected':calendar.monthrange(2025,month)[1]*10,'cloudyPct':round(counts['cloudy']/valid*100,1) if valid else None})
 stations.append({'id':station,'name':name,'kind':kind,'rows':rows})
result={'year':2025,'normalPeriod':'1991–2020','normals':normals,'stations':stations,'retrievedAt':'2026-10-10','sources':{'climate':'https://www.ncei.noaa.gov/data/normals-monthly/1991-2020/access/USW00012842.csv','clouds':'https://mesonet.agron.iastate.edu/request/download.phtml','faa':'https://www.faa.gov/air_traffic/weather/asos'}}
assert len(normals)==12 and all(len(s['rows'])==12 for s in stations)
assert all(r['valid']<=r['expected'] for s in stations for r in s['rows'])
(root.parent.parent/'public/data/tampa-weather.json').write_text(json.dumps(result))
print([(s['id'],sum(r['valid'] for r in s['rows'])) for s in stations])
