import styled from "styled-components";
import PropTypes from "prop-types";
import DragDropFiles from "./DragDropFiles";
// import RecordMedia from "./RecordMedia";

const Container = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 450px;
    aspect-ratio: 16 / 9;
    border: 2px dashed #c3c3c3;
    font-size: .8rem;
`;

function UploadFiles({ handleOnChange }) {
    return (
        <Container>
            <div>
                <DragDropFiles handleOnChange={handleOnChange}/>
                {/* <RecordMedia /> */}
            </div>
        </Container>
    );
}

UploadFiles.propTypes = {
    handleOnChange: PropTypes.func.isRequired,
};

export default UploadFiles;
