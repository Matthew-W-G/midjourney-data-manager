import ContentDisplay from "./contentDisplay";
import { FilterProvider } from "../context/filterContext";
import Header from "./header";
import { useState } from "react";

function GalleryHome() {
    const [display, setDisplay] = useState('Images');

    const switchDisplay = () => {
        if(display == 'Images') {
            setDisplay('Data');
        } else {
            setDisplay('Images');
        }
    }

    return (
        <FilterProvider>
            <Header changeDisplay={() => switchDisplay()}></Header>
            <div className="mainContent">
                <ContentDisplay display={display}></ContentDisplay>
                <div className="footerSpacer"></div>
            </div>
        </FilterProvider>
    )
}

export default GalleryHome;