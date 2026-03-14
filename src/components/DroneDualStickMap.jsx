import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const DroneRouteMap = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  const routeRef = useRef(null); 
  const pointRef = useRef(null); 
  const animationFrameRef = useRef(null);
  const counterRef = useRef(0);
  const steps = 500; 

  const [startInput, setStartInput] = useState('138.7189,35.1691'); t
  const [endInput, setEndInput] = useState('138.7265,35.3397');
  const [routeReady, setRouteReady] = useState(false);
  const [animating, setAnimating] = useState(false);

  
  const deltaDistance = 100;
  const deltaDegrees = 10;

  function easing(t) {
    return t * (2 - t);
  }

  function handleKeyDown(e) {
    if (!mapRef.current) return;
    
    if (!['w', 'a', 's', 'd', 'W', 'A', 'S', 'D'].includes(e.key)) return;

    e.preventDefault();
    const map = mapRef.current;

    if (e.key === 'w' || e.key === 'W') {
      map.panBy([0, -deltaDistance], { easing });
    } else if (e.key === 's' || e.key === 'S') {
      map.panBy([0, deltaDistance], { easing });
    } else if (e.key === 'a' || e.key === 'A') {
      map.easeTo({
        bearing: map.getBearing() - deltaDegrees,
        easing
      });
    } else if (e.key === 'd' || e.key === 'D') {
      map.easeTo({
        bearing: map.getBearing() + deltaDegrees,
        easing
      });
    }
  }

 
  function parseLngLat(str) {
    const parts = str.split(',').map((v) => parseFloat(v.trim()));
    if (parts.length !== 2 || parts.some((v) => Number.isNaN(v))) return null;
    return parts;
  }

  
  function setRoute() {
    if (!mapRef.current) return;

    const start = parseLngLat(startInput);
    const end = parseLngLat(endInput);
    if (!start || !end) {
      alert('Invalid coordinates. Use "lng,lat" format.');
      return;
    }

    
    const route = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [start, end]
          }
        }
      ]
    };

  
    const point = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: start
          }
        }
      ]
    };

    routeRef.current = route;
    pointRef.current = point;
    counterRef.current = 0;

    const map = mapRef.current;

   
    if (map.getSource('route')) {
      map.getSource('route').setData(route);
    } else {
      map.addSource('route', {
        type: 'geojson',
        data: route
      });

      map.addLayer({
        id: 'route',
        source: 'route',
        type: 'line',
        paint: {
          'line-width': 2,
          'line-color': '#007cbf',
          'line-emissive-strength': 1
        }
      });
    }

  
    if (map.getSource('point')) {
      map.getSource('point').setData(point);
    } else {
      map.addSource('point', {
        type: 'geojson',
        data: point
      });

      map.addLayer({
        id: 'point',
        source: 'point',
        type: 'circle',
        paint: {
          'circle-radius': 6,
          'circle-color': '#ff0000',
          'circle-emissive-strength': 1,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff'
        }
      });
    }

    map.easeTo({
      center: start,
      zoom: 14,
      pitch: 70,
      duration: 1000
    });

    setRouteReady(true);
  }

 
  function animateRoute() {
    if (!mapRef.current || !routeRef.current || !pointRef.current) return;

    const map = mapRef.current;
    const coords = routeRef.current.features[0].geometry.coordinates;

  
    const [start, end] = coords;
    const arc = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const lng = start[0] * (1 - t) + end[0] * t;
      const lat = start[1] * (1 - t) + end[1] * t;
      arc.push([lng, lat]);
    }
    routeRef.current.features[0].geometry.coordinates = arc;
    map.getSource('route').setData(routeRef.current);

    setAnimating(true);
    counterRef.current = 0;

    const animate = () => {
      const idx = counterRef.current;
      if (idx >= steps) {
        setAnimating(false);
        return;
      }

      const current = arc[idx];
      const next = arc[Math.min(idx + 1, steps)];

      pointRef.current.features[0].geometry.coordinates = current;
      map.getSource('point').setData(pointRef.current);

      map.easeTo({
        center: current,
        zoom: 14,
        pitch: 70,
        bearing: map.getBearing(), 
        duration: 50,
        easing
      });

      counterRef.current += 1;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(animate);
  }

  useEffect(() => {
 mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/standard-satellite',
      center: [138.7189, 35.1691],
      zoom: 14,
      bearing: -20,
      pitch: 70,
      boxZoom: false,
      doubleClickZoom: false,
      dragPan: false,
      dragRotate: false,
      keyboard: false,
      scrollZoom: false,
      touchPitch: false,
      touchZoomRotate: false
    });

    mapRef.current.on('load', () => {
      const canvas = mapRef.current.getCanvas();
      canvas.tabIndex = 0; 
      canvas.focus();
      canvas.parentNode.classList.remove('mapboxgl-interactive');
      canvas.addEventListener('keydown', handleKeyDown, true);
    });

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (mapRef.current) {
        const canvas = mapRef.current.getCanvas();
        canvas.removeEventListener('keydown', handleKeyDown, true);
        mapRef.current.remove();
      }
    };
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <div
        ref={mapContainerRef}
        style={{ width: '100%', height: '100%' }}
      />
      <div
        style={{
          position: 'absolute',
          top: 10,
          left: 10,
          background: 'rgba(255,255,255,0.9)',
          padding: '8px',
          borderRadius: '4px',
          fontSize: '12px',
          maxWidth: '260px'
        }}
      >
        <div style={{ marginBottom: '4px' }}>
          <div>Start (lng,lat):</div>
          <input
            type="text"
            value={startInput}
            onChange={(e) => setStartInput(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: '4px' }}>
          <div>End (lng,lat):</div>
          <input
            type="text"
            value={endInput}
            onChange={(e) => setEndInput(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>
        <button onClick={setRoute} style={{ marginRight: '4px' }}>
          Set Route
        </button>
        <button
          onClick={animateRoute}
          disabled={!routeReady || animating}
        >
          {animating ? 'Playing…' : 'Play Route'}
        </button>
        <div style={{ marginTop: '6px' }}>
          Controls: W/S = forward/back, A/D = rotate
        </div>
      </div>
    </div>

  );
};

export default DroneRouteMap;