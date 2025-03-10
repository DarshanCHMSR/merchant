import React, { useState } from 'react';

function Location() {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    error: null,
  });

  const handleCheckboxChange = (event) => {
    if (event.target.checked) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              error: null,
            });
          },
          (error) => {
            setLocation({
              latitude: null,
              longitude: null,
              error: error.message,
            });
          }
        );
      } else {
        setLocation({
          latitude: null,
          longitude: null,
          error: 'Geolocation is not supported by your browser.',
        });
      }
    } else {
      // Reset location if checkbox is unchecked
      setLocation({
        latitude: null,
        longitude: null,
        error: null,
      });
    }
  };

  return (
    <div>
      <label>
        <input 
          type="checkbox" 
          onChange={handleCheckboxChange} 
        />
        Are you in the shop?
      </label>
      {location.latitude && location.longitude && (
        <div>
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
        </div>
      )}
      {location.error && <p>Error: {location.error}</p>}
    </div>
  );
}

export default Location;
