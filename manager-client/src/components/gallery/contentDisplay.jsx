import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { Gallery } from 'react-grid-gallery';
import './styles/imageGallery.css';
import { FilterContext } from '../context/filterContext';
import '@fortawesome/fontawesome-free/css/all.min.css';
import ImageDisplay from './imageDisplay';
import DataDisplay from './dataDisplay';

function ContentDisplay(props) {
    const [loadedImages, setLoadedImages] = useState([]);
    const { searchTerm, filters, constructURL } = useContext(FilterContext);
    const [isLoading, setIsLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0)

    useEffect(() => {
        const handleImgData = async () => {
            setIsLoading(true);
            setLoadedImages([]);
            const url = constructURL(0, 50);
            const newImages = await axios.get(url);
            setTotalCount(newImages.data.totalCount)
            if (newImages.data.totalCount > 0) {
                const sortedImages = newImages.data.results.sort((a, b) => (b.id - a.id));
                setLoadedImages(sortedImages);
            } 
            setIsLoading(false);
        };
        handleImgData();
    }, [filters, searchTerm]);

    const addImages = async () => {
        try {
            setIsLoading(true);
            const url = constructURL(loadedImages.length, 50);
            const newImages = await axios.get(url);
            const updatedImages = [...loadedImages, ...newImages.data.results];
            const sortedImages = updatedImages.sort((a, b) => (b.id - a.id));
            setLoadedImages(sortedImages);
            setIsLoading(false);
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div>
            {
                props.display == 'Images' ?
                    <ImageDisplay
                        totalCount={totalCount}
                        loadedImages={loadedImages}
                        isLoading={isLoading}
                        addImages={() => addImages()}>
                    </ImageDisplay> :
                    <DataDisplay
                        totalCount={totalCount}
                        loadedImages={loadedImages}
                        addImages={() => addImages()}>
                    </DataDisplay>
            }
        </div>
    );
}

export default ContentDisplay;
