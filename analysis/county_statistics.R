# SHIFT county statistics, derived from NREL City and County Energy Profiles.
# 2016 modeled energy data, published 2019. The source CSV is a documented
# Michael Minn tabular redistribution; see provenance.json for exact URLs.
# Run with Rscript analysis/county_statistics.R from the Site root, or run.mjs.
input <- if (file.exists('analysis/data/florida-source.csv')) 'analysis/data/florida-source.csv' else '/input.csv'
output <- if (dir.exists('public/data')) 'public/data/florida-counties.csv' else '/output.csv'
x <- read.csv(input, stringsAsFactors=FALSE, check.names=FALSE)
required <- c('ST','Name','GEOIDFQ','Latitude','Longitude','Elec_MWh','Residential_Elec_MWh','Residential_Elec_1k_Dollars','Residential_Housing_Units')
stopifnot(all(required %in% names(x)))
x <- x[x$ST == 'FL', ]
stopifnot(nrow(x)==67, !anyDuplicated(x$Name), !anyDuplicated(x$GEOIDFQ))
for (col in c('Elec_MWh','Residential_Elec_MWh','Residential_Elec_1k_Dollars','Residential_Housing_Units')) {
 stopifnot(all(is.finite(x[[col]])),all(x[[col]]>0))
}
# 2016 is a leap year: 366 * 24 hours. Do not use 8760 for this vintage.
y <- data.frame(county=x$Name,fips=sub('0500000US','',x$GEOIDFQ),latitude=x$Latitude,longitude=x$Longitude,
 year=2016,totalKwh=x$Elec_MWh*1000,totalGwh=x$Elec_MWh/1000,
 averageKw=x$Elec_MWh*1000/(366*24),
 residentialKwhPerHousehold=x$Residential_Elec_MWh*1000/x$Residential_Housing_Units,
 residentialCentsPerKwh=x$Residential_Elec_1k_Dollars/x$Residential_Elec_MWh*100,
 residentialHousingUnits=x$Residential_Housing_Units)
y <- y[order(y$county), ]
y$residentialUseRank <- rank(-y$residentialKwhPerHousehold,ties.method='min')
y$countyEnergySharePct <- y$totalKwh/sum(y$totalKwh)*100
stopifnot(abs(sum(y$countyEnergySharePct)-100)<1e-8,all(y$residentialCentsPerKwh<100))
write.csv(y,output,row.names=FALSE,na='')
cat(sprintf('Computed %d counties in R; statewide total %.3f TWh; no current-tariff substitution.\n',nrow(y),sum(y$totalKwh)/1e9))
