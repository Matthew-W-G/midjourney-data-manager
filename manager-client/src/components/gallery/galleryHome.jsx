import ImageGallery from "./imageGallery";
import { FilterProvider } from "../context/filterContext";
import Header from "./header";

function GalleryHome() {
    return (
        <FilterProvider>
            <Header></Header>
            <div className="mainContent">
                <ImageGallery></ImageGallery>
                <div className="footerSpacer"></div>
            </div>
        </FilterProvider>
    )
}

export default GalleryHome;