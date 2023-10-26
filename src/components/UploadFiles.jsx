import PropTypes from "prop-types";
import DragDropFiles from "@components/DragDropFiles";

function UploadFiles({ handleOnChange }) {
    return (
        <div className="flex justify-around items-center w-[30rem] border-slate-600 border-2 border-dashed text-sm aspect-video">
            <DragDropFiles handleOnChange={handleOnChange} />
        </div>
    );
}

UploadFiles.propTypes = {
    handleOnChange: PropTypes.func.isRequired,
};

export default UploadFiles;
