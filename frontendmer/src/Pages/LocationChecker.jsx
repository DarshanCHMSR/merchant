import { useState } from "react";
import react from "react";

const LocationChecker = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    setIsChecked(checked);

    if (checked) {
      // Get user location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
            setError(null);
          },
          (error) => {
            setError("Unable to retrieve location. Please allow location access.");
          }
        );
      } else {
        setError("Geolocation is not supported by this browser.");
      }
    } else {
      setLocation(null);
      setError(null);
    }
  };

  return (
    <div className="p-4">
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          className="w-5 h-5"
        />
        <span className="text-lg">Are you in the shop?</span>
      </label>

      {location && (
        <p className="mt-2 text-green-600">
          📍 Location: {location.latitude}, {location.longitude}
        </p>
      )}

      {error && <p className="mt-2 text-red-600">{error}</p>}
    </div>
  );
};

export default LocationChecker;
