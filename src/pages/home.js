import React, { useRef, useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
 
mapboxgl.accessToken = "pk.eyJ1IjoidGJveWVyMzIiLCJhIjoiY2wyODVveWxuMDY3NzNrcGVxN3k3OWF0eCJ9.Cli_pZ5QcWNpbVSKG_0NiQ"

export default function Home() {
  
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-103.77);
  const [lat, setLat] = useState(44.96);
  const [zoom, setZoom] = useState(3);

  //get user location and center the map
  const geoOptions = {
    enableHighAccuracy: false,
    timeout: 50000,
    maximumAge: Infinity
  };

  //TODO handle errors with geolocation
  function geoError(err){
    console.log(err.code);
    console.log(err.message);
  }

  const displayUserCoords = (position) => {
    setLat(position.coords.latitude);
    setLng(position.coords.longitude);
    setZoom(8);
    map.current.flyTo({
      center: [lng,lat],
      zoom: zoom
    });
  }

  navigator.geolocation.getCurrentPosition(displayUserCoords, geoError, geoOptions);

  //request river info from Flask
  function getRivers(bounds) {
    const maxLat = bounds._ne.lat;
    const maxLng = bounds._ne.lng;
    const minLat = bounds._sw.lat;
    const minLng = bounds._sw.lng;

    fetch(`/locate-rivers.json?maxLat=${maxLat}&minLat=${minLat}&maxLng=${maxLng}&minLng=${minLng}`)
    .then(response => response.json())
    .then(responseData => {
        console.log(responseData);
        displayRivers(responseData);
    });
  };

  let currentMarkers = [];

  function displayRivers(rivers){
    currentMarkers.forEach((marker) => marker.remove());
    
    for (let river in rivers){        
        const marker = new mapboxgl.Marker()
        .setLngLat([rivers[river]['longitude'], rivers[river]['latitude']])
        .setPopup(new mapboxgl.Popup(
            {closeButton: false})
            ///////*********change this to pass a usgs_id prop instead***********/
            .setHTML(`<a href="/river-detail/?id=${rivers[river]['usgs_id']}">${river}</a>`)) 
        .addTo(map.current)
        currentMarkers.push(marker);
    }
  }

  useEffect(() => {
    if (map.current) return; // initialize map only once
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/outdoors-v11',
        center: [lng, lat],
        zoom: zoom
      });
  });

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('moveend', () => {
      const bounds = map.current.getBounds();
      getRivers(bounds);
    });
  });

  return (
    <>
      <main>
        <h3>Home View</h3>
        <p>This is the home page</p>
        <div style={{width: 400}} ref={mapContainer} className="map-container" />
      </main>
    </>
  );
};

