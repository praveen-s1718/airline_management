import React, { useEffect, useState, useRef } from 'react';

const CustomSelect = ({ label, selected, setSelected, showOptions, setShowOptions, search, setSearch, filteredCities }) => {
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const containerRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setShowOptions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [setShowOptions]);

    // When dropdown closes, clear the search and show selected value
    useEffect(() => {
        if (!showOptions && search === '') {
            setHighlightedIndex(-1);
        }
    }, [showOptions, search]);

    const handleCitySelect = (city) => {
        setSelected(city);
        setSearch('');
        setShowOptions(false);
        setHighlightedIndex(-1);
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearch(value);
        setShowOptions(true); // Always keep dropdown open when typing
        
        // Clear selection when user types anything or clears the field
        if (selected !== 'Select a City') {
            setSelected('Select a City');
        }
    };

    const handleKeyDown = (e) => {
        if (!showOptions) {
            if (e.key === 'ArrowDown' || e.key === 'Enter') {
                e.preventDefault();
                setShowOptions(true);
            }
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex(prev => 
                    prev < filteredCities.length - 1 ? prev + 1 : 0
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex(prev => 
                    prev > 0 ? prev - 1 : filteredCities.length - 1
                );
                break;
            case 'Enter':
                e.preventDefault();
                if (highlightedIndex >= 0 && filteredCities[highlightedIndex]) {
                    handleCitySelect(filteredCities[highlightedIndex]);
                }
                break;
            case 'Escape':
                e.preventDefault();
                setShowOptions(false);
                break;
            default:
                break;
        }
    };

    const displayValue = search || (selected !== 'Select a City' ? selected : '');

    return (
        <div className="custom-select-container" ref={containerRef}>
            <div className="custom-select">
                <p id="from-to">{label}</p>
                <input
                    type="text"
                    className="select-selected-input"
                    placeholder="Select a City"
                    value={displayValue}
                    onChange={handleInputChange}
                    onClick={() => setShowOptions(true)}
                    onFocus={() => setShowOptions(true)}
                    onKeyDown={handleKeyDown}
                />
                {showOptions && (
                    <div className="select-items">
                        {filteredCities && filteredCities.length > 0 ? (
                            filteredCities.map((city, index) => (
                                <div
                                    key={city}
                                    className={`select-item ${highlightedIndex === index ? 'highlighted' : ''}`}
                                    onClick={() => handleCitySelect(city)}
                                    onMouseEnter={() => setHighlightedIndex(index)}
                                >
                                    {city}
                                </div>
                            ))
                        ) : (
                            <div className="select-item-no-results">No cities found</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomSelect;

