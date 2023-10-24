import { motion } from "framer-motion";
import styled from "styled-components";
import PropTypes from "prop-types";

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 1rem;
`;

const Img = styled(motion.img)`
    width: 100%;
    height: auto;
    border: 1px solid #c3c3c3;
`;

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
        <Container>
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
        </Container>
    );
}

Images.propTypes = {
    imageUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Images;
