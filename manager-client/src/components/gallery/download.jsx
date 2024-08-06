import React, { useState, useContext, useEffect } from "react";
import { Button } from "react-bootstrap";
import './styles/download.css';
import { FilterContext } from "../context/filterContext";
import { saveAs } from 'file-saver';
import axios from "axios";
import JSZip from 'jszip';

function Download(props) {
    const { searchTerm, filters, constructURL } = useContext(FilterContext);
    const [imageData, setImageData] = useState([]);
    const [showToolbar, setShowToolbar] = useState(false);
    const [displayCount, setDisplayCount] = useState(props.totalCount);
    const [deselectAll, setDeselectAll] = useState(false);
    const [selectAll, setSelectAll] = useState(false);

    useEffect(() => {
        setSelectAll(false);
        setDeselectAll(true);
        props.handleSelectAll(false);
    }, [searchTerm, filters])

    useEffect(() => {
        if(props.totalCount > 0) {
            setDeselectAll(false);
        }
        if (!deselectAll && !selectAll) {
            const selectedImages = props.images.filter((img) => {
                return img.isSelected == true
            });
            setDisplayCount(selectedImages.length);
        } else if (selectAll) {
            const deselectedImages = props.images.filter((img) => {
                return img.isSelected == false
            });
            setDisplayCount(props.totalCount - deselectedImages.length);
        } else if (deselectAll) {
            setDisplayCount(0);
        }
    }, [props.images, selectAll, deselectAll])

    const handleDeselect = () => {
        props.selectAll(false);
        setDeselectAll(true);
        setSelectAll(false);
    };

    const handleSelect = () => {
        props.selectAll(true);
        setSelectAll(true);
        props.handleSelectAll(true);
        setDeselectAll(false);
    };

    const getImageData = async () => {
        const url = constructURL();
        try {
            const response = await axios.get(url);
            console.log('ImageData:', response.data);
            // Assuming data.results might contain nested arrays of results
            const flatResults = response.data.results.flat(); // Flatten the array if nested
            console.log('flatResults', flatResults)
            if (selectAll) {
                return flatResults.filter((image) => {
                    const matchingImage = props.images.find((img) => img.id === image.id);
                    return !(matchingImage && !matchingImage.isSelected);
                });
            } else {
                return props.images.filter((image) => {
                    return image.isSelected;
                });
            }
        } catch (error) {
            console.log(`Failed to download image from ${url}`, error);
        }
    }

    const downloadImages = async () => {
        const imageData = await getImageData();
        const zip = new JSZip();
        const folder = zip.folder(searchTerm);
    
        // Sort the imageData based on the URL or any other desired attribute
        const sortedImageData = imageData.sort((a, b) => {
            return a.url.localeCompare(b.url); // Assuming 'url' is the attribute you want to sort by
        });
    
        const downloadPromises = sortedImageData.map(async (img, i) => {
            try {
                console.log(`Fetching image from ${img.url}`);
                const response = await fetch(img.url, { mode: 'cors' });
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const blob = await response.blob();
                const fileName = `${searchTerm}_${i}.jpeg`; // Optionally, adjust the naming to include sorting logic
                folder.file(fileName, blob);
                console.log(`Added ${fileName} to zip.`);
            } catch (error) {
                console.error(`Failed to download image from ${img.url}`, error);
            }
        });
    
        await Promise.all(downloadPromises);
    
        zip.generateAsync({ type: "blob" }).then((content) => {
            console.log("Zip file created, initiating download...");
            saveAs(content, `${searchTerm}_images.zip`);
        }).catch((error) => {
            console.error("Error generating zip file:", error);
        });
    };
    

    return (
        <div>
            {
                showToolbar ?
                    <div className="toolbar">
                        <Button
                            className="toolbar-button"
                            variant="light"
                            onClick={() => setShowToolbar(false)}>Close</Button>
                        <Button
                            className="toolbar-button"
                            variant="light"
                            onClick={() => handleDeselect()}
                        >Deselect all</Button>
                        <Button
                            className="toolbar-button"
                            variant="light"
                            onClick={() => handleSelect()}
                        >Select all</Button>
                        <Button
                            className={`toolbar-button ${displayCount ? "" : "download-block"}`}
                            variant="light"
                            onClick={displayCount ? downloadImages : null}
                        >Download {displayCount} Images
                        </Button>
                    </div>
                    :
                    <Button
                        onClick={() => setShowToolbar(true)}
                        className="startButton"
                        variant="light"
                    >Download Images</Button>
            }
        </div>
    );
}

export default Download;
