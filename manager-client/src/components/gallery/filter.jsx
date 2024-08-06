import React, { useState, useEffect, useContext } from "react";
import axios from 'axios';
import { Modal, Button, Dropdown, DropdownButton, Form } from "react-bootstrap";
import './styles/imageGallery.css';
import { FilterContext } from "../context/filterContext";
import { IoIosOptions } from 'react-icons/io'; // Example using Ionicons
import Parameters from "./parameters";

function Filter() {
    const [authorsList, setAuthorsList] = useState([]);
    const [qualitiesList, setQualitiesList] = useState([]);
    const [selectedAuthors, setSelectedAuthors] = useState([]);
    const [selectedQualities, setSelectedQualities] = useState([]);
    const [showModal, setShowModal] = useState(false); // State for modal visibility
    const { setFilters } = useContext(FilterContext);

    const handleAuthorSelect = (selectedValue) => {
        setSelectedAuthors(prevSelected => prevSelected.includes(selectedValue) ? prevSelected.filter(author => author !== selectedValue) : [...prevSelected, selectedValue]);
    };

    const handleQualitySelect = (selectedValue) => {
        setSelectedQualities(prevSelected => prevSelected.includes(selectedValue) ? prevSelected.filter(quality => quality !== selectedValue) : [...prevSelected, selectedValue]);
    };

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    useEffect(() => {
        const getAuthors = async () => {
            try {
                const auths = await axios.get(`http://${process.env.REACT_APP_SERVER_ADDRESS}:3001/listAuthors`);
                setAuthorsList(auths.data);
            } catch (e) {
                console.log('Internal servor error')
            }
        };
        getAuthors();
    }, []);

    useEffect(() => {
        const getQualities = async () => {
            try {
                const resp = await axios.get(`http://${process.env.REACT_APP_SERVER_ADDRESS}:3001/listQualities`);
                let qualities = resp.data.filter(quality => quality !== 'No matching element found');
                setQualitiesList(qualities);
            } catch (e) {
                console.log('Internal servor error')
            }
        };
        getQualities();
    }, []);

    useEffect(() => {
        setFilters(prevFilters => ({
            ...prevFilters,
            authors: selectedAuthors
        }));
    }, [selectedAuthors, setFilters]);

    useEffect(() => {
        setFilters(prevFilters => ({
            ...prevFilters,
            qualities: selectedQualities
        }));
    }, [selectedQualities, setFilters]);

    return (
        <React.Fragment>
            <DropdownButton variant="dark" className="filterDropdown" title='Author'>
                {authorsList.map((author) => (
                    <Dropdown.Item as="button" key={author} onClick={(e) => { e.stopPropagation(); handleAuthorSelect(author); }}>
                        <Form.Check type="checkbox" checked={selectedAuthors.includes(author)} label={author} />
                    </Dropdown.Item>
                ))}
            </DropdownButton>
            <DropdownButton variant="dark" className="filterDropdown" title='Quality'>
                {qualitiesList.map((quality) => (
                    <Dropdown.Item as="button" key={quality} onClick={(e) => { e.stopPropagation(); handleQualitySelect(quality); }}>
                        <Form.Check type="checkbox" checked={selectedQualities.includes(quality)} label={quality} />
                    </Dropdown.Item>
                ))}
            </DropdownButton>
            <Button variant="dark" className="filterDropdown" onClick={handleOpenModal}>
                <IoIosOptions />
                Parameters
            </Button>
            <Parameters
                showModal={showModal}
                handleCloseModal={handleCloseModal}
            ></Parameters>
        </React.Fragment>
    );
}

export default Filter;
