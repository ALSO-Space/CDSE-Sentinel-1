// Copernicus Sentinel-1 Floods Visualization 
// Author: Annamaria Luongo (Twitter: @annamaria_84, https://www.linkedin.com/in/annamaria-luongo-RS) 
// License: CC BY 4.0 International - https://creativecommons.org/licenses/by/4.0/ 

var earliest_date = "2024-10-31"; var middle_date = "2024-11-12"; var latest_date = "2024-11-24"; // Kilauea volcano evolution during 2018's eruption 

var stretch_min = 0.0; var stretch_max = 1.1; // default value are stretch_min = 0; stretch_max = 1.1.
function setup() {
  return {
    input: [{
      bands: [
        "VV"
      ]
    }],
    output: { bands: 3 },
    mosaicking: "ORBIT"
  }
}


function preProcessScenes(collections) {
  var allowedDates = [latest_date, middle_date, earliest_date];  //(1°date/latest image-> red; 2°date-> green;  3°date/earliest image->blue)
  collections.scenes.orbits = collections.scenes.orbits.filter(function (orbit) {
    var orbitDateFrom = orbit.dateFrom.split("T")[0];
    return allowedDates.includes(orbitDateFrom);
  })
  return collections
}

function dateformat(d) {
  var dd = d.getDate();
  var mm = d.getMonth() + 1;
  var yyyy = d.getFullYear();
  if (dd < 10) { dd = '0' + dd }
  if (mm < 10) { mm = '0' + mm }
  var isodate = yyyy + '-' + mm + '-' + dd;
  return isodate;
}


function calcdB(sample) {
  return (Math.max(0, Math.log((sample.VV)) * 0.21714724095 + 1));
}


function stretch(val, min, max) {
  return (val - min) / (max - min);
}

function evaluatePixel(samples) {
  var band1 = calcdB(samples[2]); // R: latest image
  var band2 = calcdB(samples[0]); // G: middle-time image
  var band3 = calcdB(samples[0]); // B: earliest image
  var FalseColors = [stretch(band1, stretch_min, stretch_max), stretch(band2, stretch_min, stretch_max), stretch(band3, stretch_min, stretch_max)];
  return (FalseColors);
}
 