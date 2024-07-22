import axios from 'axios';
import Gallery from 'react-photo-gallery';
import { useState, useEffect, useContext } from 'react';
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
            setLoadedImages([])
            const url = constructURL(loadedImages.length, 50);
            const newImages = await axios.get(url);
            setLoadedImages(newImages.data);
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
                setLoadedImages(loadedImages => [...loadedImages, ...newImages.data])
                setIsLoading(false);
            } catch (e) {
                console.log(e)
            }
        }
        if (inView)
            addImages()
    }, [inView]);

    function cleanImageData() {
        return loadedImages.map((img) => {
            return {
                key: img.id,
                src: img.s3_url,
                width: img.width,
                height: img.height
            }
        });
    }


    return (
        <div className="galleryContainer">
            {loadedImages.length > 0 ? (
                <Gallery photos={cleanImageData()} key={searchTerm + JSON.stringify(filters)} />
            ) : isLoading ? (
                <div></div>
            ) : (
                <img src={process.env.PUBLIC_URL + '/noImagesFound.png'} style={{ width: '20%', height: '20%' }} alt="No Images Found" />
            )}
            <div ref={ref} style={{ height: '20px' }}></div>
            <div className="spacer"></div> {/* Spacer div to create space at the bottom */}
            <Download></Download>
        </div>
    );
}

export default ImageGallery;
