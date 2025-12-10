import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { MapPin, Loader, Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface Gym {
  id: string;
  name: string;
  vicinity: string;
  location: google.maps.LatLng;
  rating?: number;
  openNow?: boolean;
}

const GymFinderPage: React.FC = () => {
  const [userLocation, setUserLocation] = useState<google.maps.LatLng | null>(null);
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [selectedGym, setSelectedGym] = useState<Gym | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ['places']
  });

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = new google.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          );
          setUserLocation(location);
          searchNearbyGyms(location);
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
        }
      );
    }
  };

  const searchNearbyGyms = async (location: google.maps.LatLng) => {
    setIsLoading(true);
    try {
      const service = new google.maps.places.PlacesService(
        document.createElement('div')
      );

      const request = {
        location: location,
        radius: 5000, // raio de 5km
        type: 'gym'
      };

      service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          const gymResults: Gym[] = results.map(place => ({
            id: place.place_id!,
            name: place.name!,
            vicinity: place.vicinity!,
            location: place.geometry!.location!,
            rating: place.rating,
            openNow: place.opening_hours?.isOpen()
          }));
          setGyms(gymResults);
        }
        setIsLoading(false);
      });
    } catch (error) {
      console.error('Erro ao buscar academias:', error);
      setIsLoading(false);
    }
  };

  const onMapClick = useCallback(() => {
    setSelectedGym(null);
  }, []);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        className="flex items-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <MapPin className="w-8 h-8 text-blue-600 mr-2" />
        <h1 className="text-3xl font-bold">Encontrar Academias Próximas</h1>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <button
              onClick={getUserLocation}
              className="btn-primary w-full flex items-center justify-center mb-4"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader className="w-5 h-5 animate-spin mr-2" />
              ) : (
                <MapPin className="w-5 h-5 mr-2" />
              )}
              Encontrar Academias Perto de Mim
            </button>

            <div className="space-y-4 mt-6">
              {gyms.map(gym => (
                <motion.div
                  key={gym.id}
                  className="p-4 border rounded-lg hover:border-blue-500 cursor-pointer transition-colors"
                  onClick={() => setSelectedGym(gym)}
                  whileHover={{ scale: 1.02 }}
                >
                  <h3 className="font-medium">{gym.name}</h3>
                  <p className="text-sm text-slate-600">{gym.vicinity}</p>
                  {gym.rating && (
                    <div className="flex items-center mt-1">
                      <span className="text-sm">Rating: {gym.rating}</span>
                    </div>
                  )}
                  {gym.openNow !== undefined && (
                    <span className={`text-xs ${gym.openNow ? 'text-green-600' : 'text-red-600'}`}>
                      {gym.openNow ? 'Aberto Agora' : 'Fechado'}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white p-4 rounded-lg shadow-md" style={{ height: '600px' }}>
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={userLocation || { lat: 0, lng: 0 }}
              zoom={13}
              onClick={onMapClick}
            >
              {userLocation && (
                <Marker
                  position={userLocation}
                  icon={{
                    url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                  }}
                />
              )}

              {gyms.map(gym => (
                <Marker
                  key={gym.id}
                  position={gym.location}
                  onClick={() => setSelectedGym(gym)}
                />
              ))}

              {selectedGym && (
                <InfoWindow
                  position={selectedGym.location}
                  onCloseClick={() => setSelectedGym(null)}
                >
                  <div>
                    <h3 className="font-medium">{selectedGym.name}</h3>
                    <p className="text-sm">{selectedGym.vicinity}</p>
                    {selectedGym.rating && (
                      <div className="flex items-center mt-1">
                        <span className="text-sm">Rating: {selectedGym.rating}</span>
                      </div>
                    )}
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GymFinderPage;