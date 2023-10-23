import { useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const DropZone = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 1rem;
    gap: 0.5rem;
`;

const Text = styled.span`
    font-size: ${(props) => props.$fontSize || "1rem"};
    color: ${(props) => props.$color || "#000000"};
`;

const Button = styled.button`
    padding: 0.8rem;
    border-radius: 0.4rem;
    background: #2d70cf;
    border: transparent;
    color: #fff;
`;

function DragDropFiles({ handleOnChange }) {
    const inputRef = useRef();

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        handleOnChange(event.dataTransfer.files[0]);
    };

    return (
        <DropZone onDragOver={handleDragOver} onDrop={handleDrop}>
            <Text $color="#5a585c" $fontSize="1.6rem">
                Drag and Drop a file to upload
            </Text>
            <Text $color="#2da7cf" $fontSize="1.2rem">
                or
            </Text>
            <input
                type="file"
                onChange={(event) => {
                    handleOnChange(event.target.files[0]);
                }}
                hidden
                ref={inputRef}
            />
            <Button onClick={() => inputRef.current.click()}>
                Select a file
            </Button>
        </DropZone>
    );
}

DragDropFiles.propTypes = {
    handleOnChange: PropTypes.func.isRequired,
};

export default DragDropFiles;
