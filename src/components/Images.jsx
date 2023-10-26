import { motion } from "framer-motion";
import styled from "styled-components";
import PropTypes from "prop-types";

const Img = styled(motion.img)`
    width: 100%;
    height: auto;
    border: 1px solid #c3c3c3;
`;

/**
 * A React functional component that implements a drag and drop file upload feature.
 *
 * @module DragDropFiles
 * @param {Object} props - The component props.
 * @param {Function} props.handleOnChange - A function that handles the file change event and takes the selected file as an argument.
 * @returns {JSX.Element} The rendered component.
 */

function Images({ imageUrls }) {
    const handleDownload = (imageUrl) => {
        const a = document.createElement("a");
        a.style.display = "none";
        document.body.appendChild(a);

        a.href = imageUrl;
        a.download = "image.png";

        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="flex justify-center items-center flex-col gap-4">
            {imageUrls.map((imageUrl, index) => (
                <Img
                    key={imageUrl}
                    src={imageUrl}
                    alt={`Image ${index}`}
                    onClick={() => handleDownload(imageUrl)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                />
            ))}
        </div>
    );
}

Images.propTypes = {
    imageUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Images;
