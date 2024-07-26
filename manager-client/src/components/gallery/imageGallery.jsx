import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { Gallery } from 'react-grid-gallery';
import { useInView } from 'react-intersection-observer';
import './styles/imageGallery.css';
import { FilterContext } from '../context/filterContext';
import Download from './download';

function ImageGallery() {
    const [loadedImages, setLoadedImages] = useState([]);
    const { searchTerm, filters, constructURL } = useContext(FilterContext);
    const { ref, inView } = useInView({
        triggerOnce: false,
        threshold: 0.01
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const handleImgData = async () => {
            setIsLoading(true);
            setLoadedImages([]);
            const url = constructURL(0, 50);
            const newImages = await axios.get(url);
            const sortedImages = newImages.data.sort((a, b) => (b.id - a.id));
            setLoadedImages(sortedImages);
            setIsLoading(false);
        };
        handleImgData();
    }, [filters, searchTerm]);

    useEffect(() => {
        const addImages = async () => {
            try {
                setIsLoading(true);
                const url = constructURL(loadedImages.length, 50);
                const newImages = await axios.get(url);
                const updatedImages = [...loadedImages, ...newImages.data];
                const sortedImages = updatedImages.sort((a, b) => (b.id - a.id));
                setLoadedImages(sortedImages);
                setIsLoading(false);
            } catch (e) {
                console.log(e);
            }
        };
        if (inView) addImages();
    }, [inView]);

    function cleanImageData() {
        return loadedImages.map((img) => ({
            src: img.s3_url,
            width: img.width,
            height: img.height,
            customOverlay: (
                <div className="custom-overlay">
                    {img.prompt_text}
                </div>
            )
        }));
    }

    const images = cleanImageData();

    return (
        <div className="galleryContainer">
            {loadedImages.length > 0 ? (
                <div style={{ width: '100%' }}>
                    <Gallery rowHeight={400} images={images} enableImageSelection={false} />
                </div>
            ) : isLoading ? (
                <div>Loading...</div>
            ) : (
                <img src={process.env.PUBLIC_URL + '/noImagesFound.png'} style={{ width: '20%', height: '20%' }} alt="No Images Found" />
            )}
            <div ref={ref} style={{ height: '20px' }}></div>
            <div className="spacer"></div>
            <Download />
        </div>
    );
}

export default ImageGallery;
