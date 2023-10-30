import PropTypes from "prop-types";
import DragDropFiles from "@components/DragDropFiles";
import AudioRecorder from "@components/AudioRecorder";

function UploadFiles({ setAudioFile }) {
    return (
        <div className="flex justify-around items-center w-[30rem] border-slate-600 border-2 border-dashed text-sm aspect-video relative">
            <DragDropFiles setAudioFile={setAudioFile} />
            <AudioRecorder setAudioFile={setAudioFile} />
        </div>
    );
}

UploadFiles.propTypes = {
    setAudioFile: PropTypes.func.isRequired,
};

export default UploadFiles;
