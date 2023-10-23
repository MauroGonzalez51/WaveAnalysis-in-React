import styled from "styled-components";
import PropTypes from "prop-types";
// import RecordMedia from "./RecordMedia";

const Container = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
`;

const InputFile = styled.input`
    padding: 1rem;
`;

function Footer({ handleOnChange }) {
    return (
        <Container>
            <InputFile
                type="file"
                onChange={(event) => handleOnChange(event.target.files[0])}
            ></InputFile>
        </Container>
    );
}

Footer.propTypes = {
    handleOnChange: PropTypes.func.isRequired,
};

export default Footer;
