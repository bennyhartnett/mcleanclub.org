(() => {
  const storageKey = "mcleanClubVisitorLocation";

  const savePosition = (position) => {
    const location = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      timestamp: position.timestamp,
    };

    sessionStorage.setItem(storageKey, JSON.stringify(location));
  };

  const requestLocation = () => {
    if (!window.isSecureContext || !("geolocation" in navigator)) {
      return;
    }

    navigator.geolocation.getCurrentPosition(savePosition, () => {}, {
      enableHighAccuracy: false,
      maximumAge: 300000,
      timeout: 10000,
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", requestLocation, { once: true });
  } else {
    requestLocation();
  }
})();
