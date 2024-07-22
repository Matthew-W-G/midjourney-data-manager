import { Dropdown, DropdownButton } from "react-bootstrap";
import './styles/imageGallery.css';
import React, { useState, useEffect, useContext } from "react";
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import { FilterContext } from "../context/filterContext";

function Filter() {
    const [authorsList, setAuthorsList] = useState([]);
    const [qualitiesList, setQualitiesList] = useState([]);
    const [selectedAuthors, setSelectedAuthors] = useState([]);
    const [selectedQualities, setSelectedQualities] = useState([]);
    const { setFilters } = useContext(FilterContext)

    const handleAuthorSelect = (selectedValue) => {
        setSelectedAuthors(prevSelected => {
            if (prevSelected.includes(selectedValue)) {
                return prevSelected.filter((author) => author !== selectedValue);
            } else {
                return [...prevSelected, selectedValue];
            }
        });
    };

    const handleQualitySelect = (selectedValue) => {
        setSelectedQualities(prevSelected => {
            if (prevSelected.includes(selectedValue)) {
                return prevSelected.filter((quality) => quality !== selectedValue);
            } else {
                return [...prevSelected, selectedValue];
            }
        });
    };

    useEffect(() => {
        const getAuthors = async () => {
            const auths = await axios.get(`http://${process.env.REACT_APP_SERVER_ADDRESS}:3001/listAuthors`);
            setAuthorsList(auths.data);
        };
        getAuthors();
    }, []);

    useEffect(() => {
        const getQualities = async () => {
            const resp = await axios.get(`http://${process.env.REACT_APP_SERVER_ADDRESS}:3001/listQualities`);
            let qualitiesList = resp.data;
            qualitiesList = qualitiesList.filter((quality) => quality !== 'No matching element found');
            setQualitiesList(qualitiesList);
        };
        getQualities();
    }, []);

    useEffect(() => {
        setFilters(prevFilters => {
            return {
                ...prevFilters,
                authors: selectedAuthors
            }
        })
    }, [selectedAuthors])

    useEffect(() => {
        setFilters(prevFilters => {
            return {
                ...prevFilters,
                qualities: selectedQualities
            }
        })
    }, [selectedQualities])

    console.log(selectedQualities)
    return (
        <React.Fragment>
            <DropdownButton variant="dark" className="filterDropdown" title='Author'>
                {authorsList.map((author) => (
                    <Dropdown.Item as="button" key={author} onClick={(e) => { e.stopPropagation(); handleAuthorSelect(author)}}>
                        <Form.Check
                            type="checkbox"
                            checked={selectedAuthors.includes(author)}
                            label={author}
                        />
                    </Dropdown.Item>
                ))}
            </DropdownButton>
            <DropdownButton variant="dark" className="filterDropdown" title='Quality'>
                {qualitiesList.map((quality) => (
                    <Dropdown.Item as="button" key={quality} onClick={(e) => { e.stopPropagation(); handleQualitySelect(quality)}}>
                        <Form.Check
                            type="checkbox"
                            checked={selectedQualities.includes(quality)}
                            label={quality}
                        />
                    </Dropdown.Item>
                ))}
            </DropdownButton>
        </React.Fragment>
    );
}

export default Filter;
