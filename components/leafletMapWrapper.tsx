import { MapContainer, TileLayer,CircleMarker,Popup, LayerGroup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import "leaflet-defaulticon-compatibility";
import { useRouter } from 'next/router';
import { LatLngExpression } from 'leaflet';
import style from '../styles/Home.module.css';
import { useState, useRef, useEffect } from 'react';
import P5SmallWrapper from './p5SmallCanvas';

const parisPorteChoisyLoc: LatLngExpression = [2.364, 48.82];

const Map = ({ arrayFeatures }: any) => {
  console.log('leaflet MapWrapper loads');
  const router = useRouter();

  // The features must be part of the state as they will be modified
  const [features, setFeatures] = useState<any[]>(arrayFeatures);

  useEffect(() => {
    console.log('rLayer MapWrapper useEffect loads');
    if (arrayFeatures[0]) { 
        console.log('featureISS[0] exists');
        arrayFeatures.forEach((feature: any) => {
            if (!features.includes(feature)) {
                features.push(feature)                
            };
        });

        setFeatures(features);

    };

  }, [ features, arrayFeatures, router.events ]);

  let initLoc = parisPorteChoisyLoc;

  if (arrayFeatures[0]){
    initLoc = [arrayFeatures[0].lat, arrayFeatures[0].lon];
  };

  const handleSizeOnZoom = (zoom: number) => {

  };


  return (
    <div className={style.moduleContainer}>
      <MapContainer 
        center={initLoc} 
        zoom={4}
        style={{ height: "100%", width: "100%" }}
        className={style.map}

      >
        <TileLayer
          url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.mapboxKey}`}
          attribution='Map data &copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors, <a href=&quot;https://creativecommons.org/licenses/by-sa/2.0/&quot;>CC-BY-SA</a>, Imagery &copy; <a href=&quot;https://www.mapbox.com/&quot;>Mapbox</a>'
        />
        <LayerGroup>
          {features.map((f: any) => (
            console.log('markers are rendering'),
            <CircleMarker center={[f.lat, f.lon]} fillColor="navy" key={f.uid}>
              <Popup>
                <div className={style.cardSmall}>
                    <div>
                        <strong>
                            <em>{f.name}</em>, {f.date}
                        </strong>
                        <p>
                            <em>{f.weather}, {Math.round(f.temp)}°C</em>
                        </p>
                    </div>

                <P5SmallWrapper drawing={f.drawing} />
                </div>
              </Popup>
            </CircleMarker>
            
          ))}
        </LayerGroup>


      </MapContainer>
    </div>

  )
}

export default Map