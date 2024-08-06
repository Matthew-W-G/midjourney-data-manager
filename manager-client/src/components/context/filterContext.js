import React, { createContext, useState } from 'react';

export const  FilterContext = createContext();

export const FilterProvider = ({ children }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        authors: [],
        qualities: [],
        parameters: {}
    });

    function constructURL(offset = 0, limit) {
        let url = `http://${process.env.REACT_APP_SERVER_ADDRESS}:3001/allImageData?offset=${offset}&prompt_text=${encodeURIComponent(searchTerm)}`;
        
        if(limit) {
            url += `&limit=${limit}`;
        }
        filters.authors.forEach(author => {
            url += `&author=${encodeURIComponent(author)}`;
        });

        filters.qualities.forEach(quality => {
            url += `&qualities=${encodeURIComponent(quality)}`;
        });

        Object.keys(filters.parameters).forEach(param => {
            url += `&param_${encodeURIComponent(param)}=${encodeURIComponent(filters.parameters[param])}`;
        });
        console.log(url)

        return url;
    }

    return (
        <FilterContext.Provider value={{ searchTerm, setSearchTerm, filters, setFilters, constructURL }}>
            {children}
        </FilterContext.Provider>
    )
}

