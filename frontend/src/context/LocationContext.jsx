import React, { createContext, useContext, useState, useEffect } from 'react';

const defaultSavedAddresses = [
  {
    id: 'addr_home',
    type: 'Home',
    tag: 'Home',
    title: 'Home (Priya)',
    address: 'Flat 402, Sunshine Apartments, 12th Main, Indiranagar, Bengaluru 560038',
    landmark: 'Near Indiranagar Metro Station',
    phone: '+91 98765 43210'
  },
  {
    id: 'addr_work',
    type: 'Work',
    tag: 'Office',
    title: 'Work / Tech Park',
    address: 'Tower B, 5th Floor, Embassy Golf Links Business Park, Domlur, Bengaluru 560071',
    landmark: 'Behind Dell Campus',
    phone: '+91 98765 43210'
  },
  {
    id: 'addr_other',
    type: 'Other',
    tag: 'Friend',
    title: 'Koramangala Flat',
    address: 'Villa 14, 5th Block, Koramangala, Bengaluru 560095',
    landmark: 'Opposite Jyoti Nivas College',
    phone: '+91 98765 43210'
  }
];

const LocationContext = createContext(null);

export const LocationProvider = ({ children }) => {
  const [selectedAddress, setSelectedAddress] = useState(() => {
    const saved = localStorage.getItem('foodie_selected_address');
    return saved ? JSON.parse(saved) : defaultSavedAddresses[0];
  });

  const [savedAddresses, setSavedAddresses] = useState(() => {
    const saved = localStorage.getItem('foodie_saved_addresses');
    return saved ? JSON.parse(saved) : defaultSavedAddresses;
  });

  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    localStorage.setItem('foodie_selected_address', JSON.stringify(selectedAddress));
  }, [selectedAddress]);

  useEffect(() => {
    localStorage.setItem('foodie_saved_addresses', JSON.stringify(savedAddresses));
  }, [savedAddresses]);

  const selectAddress = (addr) => {
    setSelectedAddress(addr);
    setIsPickerOpen(false);
  };

  const addAddress = (newAddr) => {
    const item = {
      ...newAddr,
      id: `addr_${Date.now()}`
    };
    const updated = [item, ...savedAddresses];
    setSavedAddresses(updated);
    setSelectedAddress(item);
    setIsPickerOpen(false);
  };

  const detectLocation = () => {
    setIsDetecting(true);
    // Simulate real GPS location fetch with realistic delivery zone
    setTimeout(() => {
      const detected = {
        id: `addr_gps_${Date.now()}`,
        type: 'Current GPS',
        tag: 'GPS',
        title: 'Current Location',
        address: '100ft Road, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038',
        landmark: 'Near Toit Brewpub',
        phone: '+91 98765 43210'
      };
      setSelectedAddress(detected);
      setIsDetecting(false);
      setIsPickerOpen(false);
    }, 900);
  };

  return (
    <LocationContext.Provider
      value={{
        selectedAddress,
        savedAddresses,
        isPickerOpen,
        isDetecting,
        setIsPickerOpen,
        selectAddress,
        addAddress,
        detectLocation
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
