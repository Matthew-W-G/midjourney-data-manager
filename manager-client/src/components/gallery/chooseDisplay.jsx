import { Button } from "react-bootstrap";
import './styles/imageGallery.css'
import { useState } from "react";

function ChooseDisplay(props) {
    const [display, setDisplay] = useState('Images')

    const toggleDisplay = (newType) => {
        if (newType == 'Data' && display == 'Images') {
            setDisplay('Data');
            props.changeDisplay()
        } else if (newType == 'Images' && display == 'Data') {
            setDisplay('Images');
            props.changeDisplay()
        }
    }

    const setColor = (type) => {
        if (display == type) {
            return 'light'
        } else {
            return 'dark'
        }
    }

    return (
        <div className="chooseDisplay">
            <Button
                variant={setColor('Images')}
                style={{ fontWeight: 'bold' }}
                onClick={() => toggleDisplay('Images')}
                className="leftButton">Images
            </Button>
            <Button
                variant={setColor('Data')}
                style={{ fontWeight: 'bold' }}
                onClick={() => toggleDisplay('Data')}
                className="rightButton">Data
            </Button>
        </div>
    )
}

export default ChooseDisplay;