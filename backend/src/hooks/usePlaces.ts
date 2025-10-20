import { useEffect, type RefObject } from 'react';

// Minimal Google Places Autocomplete loader and binder
// Usage: usePlacesAutocomplete(inputRef, onPlace)
// onPlace receives { address, lat, lon }
export function usePlacesAutocomplete(
  inputRef: RefObject<HTMLInputElement | null>,
  onPlace: (p: { address: string; lat: number; lon: number }) => void
) {
  useEffect(() => {
    const apiKey = (import.meta as any)?.env?.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
    if (!apiKey || !inputRef.current) return;

    // If script already present, skip adding
    const existing = document.querySelector('script[data-google-maps]') as HTMLScriptElement | null;
    if (!existing) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.dataset.googleMaps = 'true';
      document.head.appendChild(script);
      script.onload = init;
      return () => {
        // do not remove script to avoid reloading repeatedly
      };
    }

    // If script exists and possibly loaded
    if ((window as any).google?.maps?.places) {
      init();
    } else {
      existing.addEventListener('load', init, { once: true });
      return () => existing.removeEventListener('load', init as any);
    }

    function init() {
      try {
        const google = (window as any).google;
        if (!google?.maps?.places || !inputRef.current) return;
        const ac = new google.maps.places.Autocomplete(inputRef.current, {
          fields: ['formatted_address', 'geometry'],
          types: ['geocode']
        });
        ac.addListener('place_changed', () => {
          const place = ac.getPlace();
          const address = place?.formatted_address || inputRef.current?.value || '';
          const loc = place?.geometry?.location;
          const lat = typeof loc?.lat === 'function' ? loc.lat() : undefined;
          const lon = typeof loc?.lng === 'function' ? loc.lng() : undefined;
          if (address && typeof lat === 'number' && typeof lon === 'number') {
            onPlace({ address, lat, lon });
          } else if (address) {
            onPlace({ address, lat: NaN, lon: NaN });
          }
        });
      } catch {
        // ignore
      }
    }
  }, [inputRef, onPlace]);
}
