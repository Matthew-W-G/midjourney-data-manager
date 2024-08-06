import { Gallery } from 'react-grid-gallery';
import './styles/imageGallery.css';
import Download from './download';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState, useContext } from 'react';
import { FilterContext } from '../context/filterContext';

function ImageDisplay(props) {
    const { ref, inView } = useInView({
        triggerOnce: false,
        threshold: 0.01
    });
    const [images, setImages] = useState([]);
    const [allSelected, setAllSelected] = useState(false);
    const [bottomReached, setBottomReached] = useState(false);
    const { searchTerm, filters } = useContext(FilterContext);


    const handleSelectAll = (c) => {
        setAllSelected(c);
    }

    useEffect(() => {
        setBottomReached(false);
    }, [searchTerm, filters])

    useEffect(() => {
        if(allSelected) {
            const updatedImages = props.loadedImages.map((img) => {
                return {
                    ...img,
                    isSelected: true
                }
            })
            setImages(updatedImages);
        } else {
            const restoredImages = props.loadedImages.map((img) => {
                let resp = img;
                images.map((exImg) => {
                    if(img.image_id == exImg.image_id) {
                        resp = exImg;
                    }
                })
                return resp;
            });
            setImages(restoredImages);
        }
    }, [props.loadedImages])

    console.log(bottomReached)

    useEffect(() => {
        if (!bottomReached && inView && props.totalCount > 0) {
            props.addImages();
            if (images.length >= props.totalCount) {
                setBottomReached(true);
            }
        }
    }, [inView, images.length, props.totalCount]);

    const copyText = async (text) => {
        try {
            console.log("Attempting to copy text:", text);
            await navigator.clipboard.writeText(text);
            console.log("Text copied to clipboard successfully:", text);
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    function cleanImageData() {
        return images.map((img) => ({
          src: img.s3_url,
          width: img.width,
          height: img.height,
          customOverlay: (
            <div className="custom-overlay" onClick={() => copyText(img.prompt_text)}>
              <i className="fas fa-copy copy-icon"></i>
              <div className="overlay-text">{img.prompt_text}</div>
            </div>
          ),
          tags: Object.entries(img.parameters).map(([key, value]) => ({
            value: `${key}: ${value}`,
            title: `${key}: ${value}`,
            className: 'custom-tag'
          })),
          description: img.prompt_text,
          isSelected: img.isSelected || false
        }));
      }


    const handleSelect = (idx, imgs) => {
        const updatedImages = images.map((image, i) => {
            if (i === idx) {
                return {
                    ...image,
                    isSelected: !image.isSelected
                };
            }
            return image;
        });
        setImages(updatedImages);
        console.log(images)
    };

    const selectAll = (select) => {
        const updatedImages = images.map((img) => {
            return {
                ...img,
                isSelected: select
            }
        })
        setImages(updatedImages)
    }

    return (
        <div className="galleryContainer">
            {images.length > 0 ? (
                <div style={{ width: '100%' }}>
                    <Gallery
                        rowHeight={400}
                        images={cleanImageData()}
                        onSelect={(index, image) => handleSelect(index, image)}
                        onClick={(index, image) => handleSelect(index, image)}
                        tagStyle={() => ({
                            display: 'inline-block',
                            fontSize: '75%',
                            fontWeight: '600',
                            lineHeight: '1',
                            color: 'inherit',
                            textAlign: 'center',
                            whiteSpace: 'nowrap',
                            verticalAlign: 'baseline',
                            margin: '2px',
                        })}
                    />
                </div>
            ) : props.isLoading ? (
                <div>Loading...</div>
            ) : (
                <img src={process.env.PUBLIC_URL + '/noImagesFound.png'} style={{ width: '20%', height: '20%' }} alt="No Images Found" />
            )}
            <div ref={ref} style={{ height: '20px' }}></div>
            <div className="spacer"></div>
            <Download
                totalCount={props.totalCount}
                images={images}
                selectAll={(choice) => selectAll(choice)}
                handleSelectAll={(c) => handleSelectAll(c)}
            />
        </div>
    );
}

export default ImageDisplay;
