import styled from "styled-components";
import PropTypes from "prop-types";
import DragDropFiles from "./DragDropFiles";

const Container = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 450px;
    aspect-ratio: 16 / 9;
    border: 2px dashed #c3c3c3;
    font-size: 0.8rem;
`;

function UploadFiles({ handleOnChange }) {
    return (
        <Container>
            <DragDropFiles handleOnChange={handleOnChange} />
        </Container>
    );
}

UploadFiles.propTypes = {
    handleOnChange: PropTypes.func.isRequired,
};

export default UploadFiles;
