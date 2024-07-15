// Copernicus Sentinel-1 Floods Visualization 
// Author: Annamaria Luongo (Twitter: @annamaria_84, https://www.linkedin.com/in/annamaria-luongo-RS) 
// License: CC BY 4.0 International - https://creativecommons.org/licenses/by/4.0/ 

//Definition date/images used in the composite
var earliest_date = "2023-11-17"; var middle_date = "2023-10-29"; var latest_date = "2023-11-10";  


// Definition stretch value for Composite
var stretch_min = 0.1; var stretch_max = 0.95; 
// ***********************************


// Selection of polarization
function setup() {
  return {
    input: [{
      bands: [
        "VV",
        "VH"
      ]
    }],
    output: { bands: 3 },
    mosaicking: "ORBIT"
  }
}

// Selection of dates for composite / analysis

function preProcessScenes(collections) {
  var allowedDates = [latest_date, middle_date, earliest_date];  //(1°date/latest image-> red; 2°date-> green;  3°date/earliest image->blue)
  collections.scenes.orbits = collections.scenes.orbits.filter(function (orbit) {
    var orbitDateFrom = orbit.dateFrom.split("T")[0];
    return allowedDates.includes(orbitDateFrom);
  })
  return collections
}

// Date conversion  
function dateformat(d) {
  var dd = d.getDate();
  var mm = d.getMonth() + 1;
  var yyyy = d.getFullYear();
  if (dd < 10) { dd = '0' + dd }
  if (mm < 10) { mm = '0' + mm }
  var isodate = yyyy + '-' + mm + '-' + dd;
  return isodate;
}


// Backscatter Coefficient
function calcdB(sample) {
  return (Math.max(0, Math.log((sample.VV)) * 0.21714724095 + 1));
}


// Stretch of RGB
function stretch(val, min, max) {
  return (val - min) / (max - min);
}

// RGB visualization
function evaluatePixel(samples) {
  var band1 = 1.1*calcdB(samples[0]); // R: latest image
  var band2 = calcdB(samples[0]); // G: middle-time image
  var band3 = calcdB(samples[1]); // B: earliest image
  var FalseColors = [stretch(band3, stretch_min, stretch_max),stretch(band2, stretch_min, stretch_max),stretch(band2, stretch_min, stretch_max)];
  return (FalseColors);
}
