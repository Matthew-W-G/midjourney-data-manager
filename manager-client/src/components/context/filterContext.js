import React, { createContext, useState } from 'react';

export const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        authors: [],
        qualities: []
    });

    function constructURL(offset, limit) {
        let url = `http://${process.env.REACT_APP_SERVER_ADDRESS}:3001/allImageData?offset=${offset}&limit=${limit}&prompt_text=${searchTerm}`;
        for(const author of filters.authors) {
            url += `&author=${author}`;
        }
        console.log(filters.qualities)
        for(const quality of filters.qualities) {
            url += `&qualities=${quality}`;
        }
        return url;
    }

    return (
        <FilterContext.Provider value={{ searchTerm, setSearchTerm, filters, setFilters, constructURL }}>
            {children}
        </FilterContext.Provider>
    )
}

