import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/imageGallery.css';
import { FilterContext } from '../context/filterContext';
import { useContext, useCallback, useState } from 'react';
import debounce from 'lodash/debounce';

function Search() {
    const { searchTerm, setSearchTerm } = useContext(FilterContext);
    const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

    const debouncedSetSearchTerm = useCallback(
        debounce((value) => {
            setSearchTerm(value);
        }, 300),
        []
    );

    const handleSearchChange = (event) => {
        const value = event.target.value;
        setLocalSearchTerm(value);
        debouncedSetSearchTerm(value);
    };

    return (
        <div className="searchBox">
            <Form.Control
                onChange={handleSearchChange}
                className='formControlCustom'
                variant="secondary"
                size="text"
                type="text"
                value={localSearchTerm}
                placeholder='Search images'
            />
        </div>
    );
}

export default Search;
