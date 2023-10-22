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
    border: 1px solid #000;
`;

function Images({ imageUrls }) {
    return (
        <Container>
            {imageUrls.map((imageUrl, index) => (
                <Img key={index} src={imageUrl} alt={`Image ${index}`} />
            ))}
        </Container>
    );
}

Images.propTypes = {
    imageUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Images;
