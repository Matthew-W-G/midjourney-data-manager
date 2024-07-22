import SearchFilter from './searchFilter';
import './styles/imageGallery.css';
import React from 'react';
import Download from './download';

function Header(props) {
    return (
        <div className='header'>
            <img
                src={process.env.PUBLIC_URL + '/conformistLogo.jpg'}
                className='logo'
            />
            <SearchFilter />
        </div>
    )
}

export default Header;
