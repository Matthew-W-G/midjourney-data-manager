import { Modal, Button, Form, DropdownButton, Dropdown } from "react-bootstrap";
import './styles/parameters.css';
import { useContext, useState } from 'react';
import { FilterContext } from "../context/filterContext";

function Parameters(props) {
    const [chaosValue, setChaosValue] = useState(0);
    const [imageWeightValue, setImageWeightValue] = useState(0);
    const [stylizeValue, setStylizeValue] = useState(0);
    const [weirdValue, setWeirdValue] = useState(0);

    const aspectOptions = ['All', '1:1', '16:9', '4:3', '3:2'];
    const qualityOptions = ['All', 0.25, 0.5, 1];
    const styleOptions = ['All', 'Raw', '4a', '4b', 'Cute', 'Expressive', 'Original', 'Scenic'];

    const [selectedAspect, setSelectedAspect] = useState('All');
    const [selectedQuality, setSelectedQuality] = useState('All');
    const [selectedStyle, setSelectedStyle] = useState('All');

    const { filters, setFilters } = useContext(FilterContext);

    // Ensure parameters are updated correctly
    const applyChanges = () => {
        const newParameters = {};

        if (selectedAspect !== 'All') {
            newParameters.aspect = selectedAspect;
        }
        if (selectedStyle !== 'All') {
            newParameters.style = selectedStyle;
        }
        if (selectedQuality !== 'All') {
            newParameters.quality = selectedQuality; // Correct the key here
        }
        if (chaosValue > 0) {
            newParameters.chaos = parseFloat(chaosValue);
        }
        if (imageWeightValue > 0) {
            newParameters.image_weight = parseFloat(imageWeightValue);
        }
        if (stylizeValue > 0) {
            newParameters.stylize = parseFloat(stylizeValue);
        }
        if (weirdValue > 0) {
            newParameters.weird = parseFloat(weirdValue);
        }

        setFilters({
            ...filters,
            parameters: newParameters
        });

        console.log('Updated parameters:', newParameters);
    };

    return (
        <div>
            <Modal show={props.showModal} onHide={props.handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title style={{ color: '#ccc' }}>Image Generation Parameters</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div className="parameter-item">
                            <Form.Label>Aspect Ratios</Form.Label>
                            <DropdownButton variant="dark" className="dropdown-custom" title={selectedAspect}>
                                {aspectOptions.map((option) => (
                                    <Dropdown.Item key={option} onClick={() => setSelectedAspect(option)}>
                                        {option}
                                    </Dropdown.Item>
                                ))}
                            </DropdownButton>
                        </div>
                        <hr className="divider" />
                        <div className="parameter-item">
                            <Form.Label>Chaos</Form.Label>
                            <div className="slider-container">
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    className="slider"
                                    value={chaosValue}
                                    onChange={(e) => setChaosValue(e.target.value)}
                                />
                                <div className="current-value">{chaosValue}+</div>
                                <div className="slider-values">
                                    <span>0</span>
                                    <span>100</span>
                                </div>
                            </div>
                        </div>
                        <hr className="divider" />
                        <div className="parameter-item">
                            <Form.Label>Image Weight</Form.Label>
                            <div className="slider-container">
                                <input
                                    type="range"
                                    min="0"
                                    max="3"
                                    step="0.1"
                                    className="slider"
                                    value={imageWeightValue}
                                    onChange={(e) => setImageWeightValue(e.target.value)}
                                />
                                <div className="current-value">{imageWeightValue}+</div>
                                <div className="slider-values">
                                    <span>0</span>
                                    <span>3</span>
                                </div>
                            </div>
                        </div>
                        <hr className="divider" />
                        <div className="parameter-item">
                            <Form.Label>Quality</Form.Label>
                            <DropdownButton variant="dark" className="dropdown-custom" title={selectedQuality}>
                                {qualityOptions.map((option) => (
                                    <Dropdown.Item key={option} onClick={() => setSelectedQuality(option)}>
                                        {option}
                                    </Dropdown.Item>
                                ))}
                            </DropdownButton>
                        </div>
                        <hr className="divider" />
                        <div className="parameter-item">
                            <Form.Label>Style</Form.Label>
                            <DropdownButton variant="dark" className="dropdown-custom" title={selectedStyle}>
                                {styleOptions.map((option) => (
                                    <Dropdown.Item key={option} onClick={() => setSelectedStyle(option)}>
                                        {option}
                                    </Dropdown.Item>
                                ))}
                            </DropdownButton>
                        </div>
                        <hr className="divider" />
                        <div className="parameter-item">
                            <Form.Label>Stylize</Form.Label>
                            <div className="slider-container">
                                <input
                                    type="range"
                                    min="0"
                                    max="1000"
                                    className="slider"
                                    value={stylizeValue}
                                    onChange={(e) => setStylizeValue(e.target.value)}
                                />
                                <div className="current-value">{stylizeValue}+</div>
                                <div className="slider-values">
                                    <span>0</span>
                                    <span>1000</span>
                                </div>
                            </div>
                        </div>
                        <hr className="divider" />
                        <div className="parameter-item">
                            <Form.Label>Weird</Form.Label>
                            <div className="slider-container">
                                <input
                                    type="range"
                                    min="0"
                                    max="3000"
                                    className="slider"
                                    value={weirdValue}
                                    onChange={(e) => setWeirdValue(e.target.value)}
                                />
                                <div className="current-value">{weirdValue}+</div>
                                <div className="slider-values">
                                    <span>0</span>
                                    <span>3000</span>
                                </div>
                            </div>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.handleCloseModal}>Close</Button>
                    <Button variant="dark" onClick={() => {
                        applyChanges();
                        props.handleCloseModal();
                    }}>Apply Changes</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Parameters;
