import React, { useState, useEffect } from "react";
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  Marker,
  InfoWindow
} from "react-google-maps";
import Header from "./components/Header";
import Footer from "./components/Footer";
import * as stationData from "./data/stations.json";
import * as busData from "./data/routes.json";


function Map() {
  const [selectedStop, setSelectedStop] = useState(null);

  useEffect(() => {
    const listener = e => {
      if (e.key === "Escape") {
        setSelectedStop(null);
      }
    };
    window.addEventListener("keydown", listener);

    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, []);

  let j = 0;
  let stopData = [];
  for(let i=0;i< stationData.features.length;i++)
    if(stationData.features[i].properties.BUS_ID==localStorage.getItem("busNumber")){
      stopData[j] = stationData.features[i];
      j++;
    }

  return (
    <div>
      <GoogleMap
        defaultZoom={12}
        defaultCenter={{ lat: 53.897690, lng: 27.549419 }}
        
      >
        {stopData.map(stop => (
          
          <Marker
            key={stop.properties.STATION_ID}
            position={{
              lat: stop.geometry.coordinates[1],
              lng: stop.geometry.coordinates[0]
            }}
            onClick={() => {
              setSelectedStop(stop);
            }}
          />
        ))}

        {selectedStop && (
          <InfoWindow
            onCloseClick={() => {
              setSelectedStop(null);
            }}
            position={{
              lat: selectedStop.geometry.coordinates[1],
              lng: selectedStop.geometry.coordinates[0]
            }}
          >
            <div>
              <p>{selectedStop.properties.NAME}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}

const MapWrapped = withScriptjs(withGoogleMap(Map));

export default class App extends React.Component {

  state={busNumber:""};
  
  render(){
    
    return (
      <div>
        <Header/>
        <div className="bus_block">
          {busData.features.map(bus => (         
            <div className="bus" tabindex={bus.properties.BUS_ID} onClick={() => {
                                                                    this.setState({busNumber:bus.properties.BUS_ID});
                                                                    localStorage.setItem("busNumber",bus.properties.BUS_ID)}}
            >
              {bus.properties.BUS_ID} {bus.properties.NAME}
            </div>
          ))}
        </div>
        <div className="map">
          <MapWrapped
            googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyBkAPxHP0xDoStfd8GMg4CW83HPA1jH8bQ`}
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `100%` }} />}
            mapElement={<div style={{ height: `100%` }} />}
          />
        </div>
        <Footer/>
      </div>
    );
  }
}