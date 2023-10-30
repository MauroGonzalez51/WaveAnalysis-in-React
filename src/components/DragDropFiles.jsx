import { useRef } from "react";
import PropTypes from "prop-types";

function DragDropFiles({ setAudioFile }) {
    const inputRef = useRef();

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setAudioFile(event.dataTransfer.files[0]);
    };

    return (
        <div
            className="flex justify-center items-center flex-col p-4 gap-2 w-full h-full"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <span className="text-gray-800 text-2xl">
                Drag and Drop a file to upload
            </span>
            <span className="text-slate-700 text-base">or</span>
            <input
                type="file"
                onChange={(event) => {
                    setAudioFile(event.target.files[0]);
                }}
                hidden
                ref={inputRef}
            />
            <button
                className="p-3 rounded-lg border-none text-slate-50 bg-blue-700"
                onClick={() => inputRef.current.click()}
            >
                Select a file
            </button>
        </div>
    );
}

DragDropFiles.propTypes = {
    setAudioFile: PropTypes.func.isRequired,
};

export default DragDropFiles;
