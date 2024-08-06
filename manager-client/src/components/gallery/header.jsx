import SearchFilter from './searchFilter';
import './styles/imageGallery.css';
import React from 'react';
import ChooseDisplay from './chooseDisplay';

function Header(props) {
    return (
        <div className='header'>
            <img
                src={process.env.PUBLIC_URL + '/conformistLogo.jpg'}
                className='logo'
            />
            <SearchFilter />
            <ChooseDisplay changeDisplay={() => props.changeDisplay()}></ChooseDisplay>
        </div>
    )
}

export default Header;
