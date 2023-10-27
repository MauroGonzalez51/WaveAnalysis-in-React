import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";

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
                <AnimatePresence key={imageUrl}>
                    <motion.img
                        key={imageUrl}
                        src={imageUrl}
                        alt={`Image ${index}`}
                        onClick={() => handleDownload(imageUrl)}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.9 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="object-contain border-2 border-solid border-b-black"
                    />
                </AnimatePresence>
            ))}
        </div>
    );
}

Images.propTypes = {
    imageUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Images;
