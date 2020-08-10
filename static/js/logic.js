function createMap(earthquake) {
// Create the tile layer that will be the background of our map
    var light_map = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    maxZoom: 18,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
    });
    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
    });

// Create a baseMaps object to hold the lightmap and darkmap layer
    var baseMaps = {
    "Light Map": light_map,
    "Dark Map": darkmap
    };
// Create an overlayMaps object to hold the earthquake layer
    var overlayMaps = {
    "Eqrthquake": earthquake
    };

// Create the map object with options
    var map = L.map("map", {
    center: [15.5994, -28.6731],
    zoom: 3,
    layers:[light_map,earthquake]
    });

// Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
    }).addTo(map);
//create color function for legend
    function getColor(d) {
        return  d === '0-1'  ? "#83FF33" :
                d === '1-2'  ? "#CEFF33" :
                d === '2-3' ? "#FFFC33" :
                d === '3-4' ? "#FFC733" :
                d === '4-5' ? "#FF9033" :
                            "#C70039";
    }
    // Set up the legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function (map) {
        var div = L.DomUtil.create("div", "legend");
            grades = ["0-1","1-2","2-3","3-4","4-5","5 +"];
           
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=       
                "<i style=\"background-color: " + getColor(grades[i]) + "\"></i> " +(grades[i] ? grades[i]+'<br>' : "+");
        }
        
        console.log(div.innerHTML);
        return div;
    };
// Adding legend to the map
    legend.addTo(map);
}

function createMarkers(response) {
// Pull the "feature" property off of response.features
    var features = response.features;
    //console.log(features)

    // Initialize an array to hold earthquake markers
    var earthquakeMarkers = [];

    // Loop through the earthquake array
    for (var index = 0; index < features.length; index++) {
        var feature = features[index];
        var magnitude = +feature.properties.mag;
        var lon = +feature.geometry.coordinates[0];
        var lat = +feature.geometry.coordinates[1];
        var fcolor ="";
        if (magnitude > 5) {
            fcolor = "#C70039";
        }
        else if (magnitude > 4) {
            fcolor = "#FF9033";
        }
        else if (magnitude > 3) {
            fcolor = "#FFC733";
        }
        else if (magnitude > 2) {
            fcolor = "#FFFC33";
        }    
        else if (magnitude > 1) {
            fcolor = "#CEFF33";
        }
        else {
            fcolor = "#83FF33";
        }
        console.log(fcolor);

        // For each , create a marker and bind a popup with the earchquake place's name
        var earthquakeMarker = L.circle(L.latLng(lat,lon),{
            fillOpacity: 0.75,
            color: "black",
            weight:0.5,
            fillColor: fcolor,
            radius: magnitude *25000

        }).bindPopup("<h3>" + feature.properties.place + "<h3><h3>Longitude: "+ lon +"<h3><h3>Latitude: "+lat+"<h3><h3>Magnitude: " + feature.properties.mag + "</h3>");

        // Add the marker to the earthquake place array
        earthquakeMarkers.push(earthquakeMarker);
    }
    
    // Create a layer group made from the earthquake markers array, pass it into the createMap function
    createMap(L.layerGroup(earthquakeMarkers));
};


// Perform an API call to the geo API to get earthquake information. Call createMarkers when complete
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", createMarkers);
