import styled from "styled-components";
import PropTypes from "prop-types";

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 1rem;
`;

const Img = styled.img`
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
                    key={index}
                    src={imageUrl}
                    alt={`Image ${index}`}
                    onClick={() => handleDownload(imageUrl)}
                />
            ))}
        </Container>
    );
}

Images.propTypes = {
    imageUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Images;
