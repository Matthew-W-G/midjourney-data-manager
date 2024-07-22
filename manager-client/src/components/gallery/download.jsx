import React, { useState, useContext } from "react";
import { Button, Modal } from "react-bootstrap";
import './styles/imageGallery.css';
import { FilterContext } from "../context/filterContext";
import { saveAs } from 'file-saver';
import axios from "axios";
import JSZip from 'jszip';

function Download() {
    const { searchTerm, constructURL } = useContext(FilterContext);
    const [showModal, setShowModal] = useState(false);
    const [imageData, setImageData] = useState([]);

    const handleShow = async () => {
        const newImageData = await getImageData();
        setImageData(newImageData.data);
        setShowModal(true);
    }
    const handleClose = () => setShowModal(false);

    const getImageData = async () => {
        const url = constructURL(0, 1000);
        try {
            const imageData = await axios.get(url);
            return imageData;
        } catch (error) {
            console.log(`Failed to download image from ${url}`, error);
        }
    }

    const downloadImages = async () => {
        console.log("Starting downloadImages process...");
        const zip = new JSZip();
        const folder = zip.folder(searchTerm);
        const downloadUrls = imageData.map(img => img.url);

        const downloadPromises = downloadUrls.map(async (url, i) => {
            try {
                console.log(`Fetching image from ${url}`);
                const response = await fetch(url, { mode: 'cors' });
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const blob = await response.blob();
                const fileName = `${searchTerm}_${i}.jpg`;
                folder.file(fileName, blob);
                console.log(`Added ${fileName} to zip.`);
            } catch (error) {
                console.error(`Failed to download image from ${url}`, error);
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
            <Modal show={showModal} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Download {imageData.length} Images?</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                    <Button variant="dark" onClick={downloadImages}>Yes</Button>
                </Modal.Footer>
            </Modal>
            <Button className="floatingButton" variant="light" onClick={handleShow}>Download Images</Button>
        </div>
    );
}

export default Download;
