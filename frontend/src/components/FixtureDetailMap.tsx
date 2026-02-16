import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { TFixture } from '@/types/types';
import { MAPBOX_CONFIG } from '@/config/mapbox';

interface FixtureDetailMapProps {
  fixture: TFixture;
}

export default function FixtureDetailMap({ fixture }: FixtureDetailMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (fixture.Location) {
      // If fixture already has coordinates, use them
      setCoordinates([fixture.Location.Longitude, fixture.Location.Latitude]);
    } else {
      // If no coordinates, show error or placeholder
      setError('No location data available for this fixture');
    }
  }, [fixture]);

  useEffect(() => {
    if (!MAPBOX_CONFIG.accessToken) {
      setError('Mapbox access token not configured');
      return;
    }

    if (!coordinates) {
      return;
    }

    const container = mapContainer.current;
    if (!container || map.current) return;

    mapboxgl.accessToken = MAPBOX_CONFIG.accessToken;

    map.current = new mapboxgl.Map({
      container,
      style: MAPBOX_CONFIG.style,
      center: coordinates,
      zoom: MAPBOX_CONFIG.defaultZoom
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add a marker
    new mapboxgl.Marker({
      color: '#1976d2',
      scale: 1.2
    })
      .setLngLat(coordinates)
      .addTo(map.current);

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [coordinates]);

  if (!MAPBOX_CONFIG.accessToken) {
    return (
      <div style={{ 
        width: '100%', 
        height: '300px', 
        backgroundColor: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #ddd',
        borderRadius: '8px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <p>Map not available</p>
          <p style={{ fontSize: '12px', color: '#666' }}>
            Please add your Mapbox access token to enable maps
          </p>
        </div>
      </div>
    );
  }

  if (error || !coordinates) {
    return (
      <div style={{ 
        width: '100%', 
        height: '300px', 
        backgroundColor: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #ddd',
        borderRadius: '8px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <p>{error || 'No location data available'}</p>
          <p style={{ fontSize: '12px', color: '#666' }}>
            Location: {fixture.HomeTeam} vs {fixture.AwayTeam}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '300px', borderRadius: '8px', overflow: 'hidden' }}>
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}


