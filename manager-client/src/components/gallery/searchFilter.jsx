import Search from './search.jsx'
import Filter from './filter.jsx'
import './styles/imageGallery.css'

function SearchFilter() {
    return (
        <div className='searchFilterContainer'>
            <Search></Search>
            <Filter></Filter>
        </div>
    )
}

export default SearchFilter;