import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LocationSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (place: any) => void;
  placeholder: string;
  label: string;
  icon: React.ReactNode;
  type: 'start' | 'end';
}

declare global {
  interface Window {
    google: any;
  }
}

export const LocationSearch: React.FC<LocationSearchProps> = ({
  value,
  onChange,
  onSelect,
  placeholder,
  label,
  icon,
  type,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const autocompleteServiceRef = useRef<any>(null);
  const placesServiceRef = useRef<any>(null);

  // Initialize Google Places Autocomplete Service
  useEffect(() => {
    const initializeServices = () => {
      if (window.google?.maps?.places) {
        autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
        placesServiceRef.current = new window.google.maps.places.PlacesService(
          document.createElement('div')
        );
      }
    };

    if (window.google?.maps?.places) {
      initializeServices();
    } else {
      // Wait for Google Maps to load
      const checkInterval = setInterval(() => {
        if (window.google?.maps?.places) {
          initializeServices();
          clearInterval(checkInterval);
        }
      }, 100);

      return () => clearInterval(checkInterval);
    }
  }, []);

  // Handle input change and fetch suggestions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange(inputValue);
    setSelectedIndex(-1);

    if (inputValue.length > 2 && autocompleteServiceRef.current) {
      // Fetch predictions - support both US and India
      autocompleteServiceRef.current.getPlacePredictions(
        {
          input: inputValue,
          // Don't restrict to specific countries - allow worldwide search
        },
        (predictions: any[], status: string) => {
          if (status === 'OK' && predictions) {
            setSuggestions(predictions);
            setShowSuggestions(true);
          } else {
            setSuggestions([]);
          }
        }
      );
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle suggestion selection
  const handleSelectSuggestion = (suggestion: any) => {
    onChange(suggestion.description);
    setShowSuggestions(false);
    setSuggestions([]);

    // Get place details
    if (placesServiceRef.current && suggestion.place_id) {
      placesServiceRef.current.getDetails(
        {
          placeId: suggestion.place_id,
          fields: ['geometry', 'formatted_address', 'name'],
        },
        (place: any, status: string) => {
          if (status === 'OK' && place.geometry) {
            onSelect({
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
              name: place.formatted_address || suggestion.description,
              placeId: suggestion.place_id,
            });
          }
        }
      );
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelectSuggestion(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowSuggestions(false);
        break;
      default:
        break;
    }
  };

  // Clear input
  const handleClear = () => {
    onChange('');
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div className="space-y-2 relative">
      <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono">
        {label}
      </Label>
      <div className="relative">
        <div className="absolute left-3 top-3 w-4 h-4 text-emerald-500 flex items-center justify-center">
          {icon}
        </div>
        <Input
          ref={inputRef}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => value.length > 2 && suggestions.length > 0 && setShowSuggestions(true)}
          className="bg-zinc-950 border-zinc-800 pl-10 pr-10 focus-visible:ring-emerald-500/50"
          placeholder={placeholder}
          autoComplete="off"
        />
        {value && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-3 text-zinc-500 hover:text-zinc-300 transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-zinc-900 border border-zinc-800 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.place_id}
              onClick={() => handleSelectSuggestion(suggestion)}
              className={`w-full text-left px-4 py-3 border-b border-zinc-800 last:border-b-0 transition ${
                index === selectedIndex
                  ? 'bg-zinc-800 text-emerald-400'
                  : 'hover:bg-zinc-800/50 text-zinc-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-zinc-500" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {suggestion.main_text}
                  </p>
                  <p className="text-xs text-zinc-500 truncate">
                    {suggestion.secondary_text}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No results message */}
      {showSuggestions && value.length > 2 && suggestions.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-zinc-900 border border-zinc-800 rounded-lg p-4 z-50">
          <p className="text-sm text-zinc-400 text-center">No locations found</p>
        </div>
      )}
    </div>
  );
};
