import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Circle, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet.heat';
import { FaLocationDot } from 'react-icons/fa6';
import ReactDOMServer from 'react-dom/server';

const createCustomIcon = () => {
  // Convert the FaLocationDot icon to an SVG string
  const svgString = ReactDOMServer.renderToString(<FaLocationDot size={24} color="red" />);
  
  // Encode SVG to base64
  const encodedSvg = encodeURIComponent(svgString).replace(/'/g, "%27").replace(/"/g, "%22");
  
  return new L.Icon({
    iconUrl: `data:image/svg+xml;charset=UTF-8,${encodedSvg}`,
    iconSize: [24, 24], // Size of the icon
    iconAnchor: [12, 24], // Point of the icon which will correspond to marker's location
    popupAnchor: [0, -24] // Point from which the popup should open relative to the iconAnchor
  });
};
const PatientMap = ({ hospitalLocation, patientCoordinates }) => {
  const [heatmapData, setHeatmapData] = useState([]);

  useEffect(() => {
    // Prepare data for heatmap
    const data = patientCoordinates.map(coord => [coord[0], coord[1], 1]); // [lat, lng, intensity]
    setHeatmapData(data);
  }, [patientCoordinates]);

  // Calculate patient counts within circles (1km and 2km radius)
  const counts = { within1km: 0, within2km: 0, outside2km: 0 };

  patientCoordinates.forEach(coord => {
    const distance = L.latLng(hospitalLocation).distanceTo(L.latLng(coord));
    if (distance <= 1000) {
      counts.within1km += 1;
    } else if (distance <= 2000) {
      counts.within2km += 1;
    } else {
      counts.outside2km += 1;
    }
  });
  const customIcon = createCustomIcon();
  return (
    <div style={{ width: '75%', margin: '0 auto' }}>
      <MapContainer center={hospitalLocation} zoom={13} style={{ height: '500px', width: '100%' }}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {/* Hospital Marker */}
        <Marker position={hospitalLocation} icon={customIcon}>
          <Popup>Hospital Location</Popup>
        </Marker>

        {/* Geofencing Circles with Different Colors */}
        <Circle center={hospitalLocation} radius={1000} color="red" fillOpacity={0.4}>
          <Popup>{`1 km Radius: ${counts.within1km} patients`}</Popup>
        </Circle>
        <Circle center={hospitalLocation} radius={2000} color="blue" fillOpacity={0.4}>
          <Popup>{`2 km Radius: ${counts.within2km} patients`}</Popup>
        </Circle>

        {/* Patient Markers */}
        {patientCoordinates.map((coord, index) => (
          <Marker key={index} position={coord} icon={customIcon}>
            <Popup>
              Location: {coord[0].toFixed(4)}, {coord[1].toFixed(4)}<br />
              Number of Patients: {1} {/* Assuming each coordinate represents one patient */}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Display Patient Counts */}
      <div style={{ marginTop: '20px' }}>
        <h3>Patient Distribution:</h3>
        <p>Within 1 km: {counts.within1km}</p>
        <p>Within 2 km: {counts.within2km}</p>
        <p>Outside 2 km: {counts.outside2km}</p>
      </div>
    </div>
  );
};

export default PatientMap;
