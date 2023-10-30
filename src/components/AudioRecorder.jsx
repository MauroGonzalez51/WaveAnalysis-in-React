import PropTypes from "prop-types";
import { useToggle } from "@hooks/useToggle";
import { useState, useEffect } from "react";
import RecordRTC from "recordrtc";

function AudioRecorder({ setAudioFile }) {
    const [recorder, setRecorder] = useState(null);
    const [isRecording, toggleIsRecording] = useToggle(false);

    const startRecording = () => {
        if (recorder) {
            recorder.stopRecording(() => {
                const blob = recorder.getBlob();
                const audioBlob = new Blob([blob], { type: "audio/webm" });
                const audioFile = new File([audioBlob], "audio.webm", {
                    type: "audio/webm",
                });
                setAudioFile(audioFile);
                setRecorder(null);
                toggleIsRecording();
            });
        } else {
            navigator.mediaDevices
                .getUserMedia({ audio: true })
                .then((stream) => {
                    const newRecorder = new RecordRTC(stream, {
                        type: "audio",
                    });
                    newRecorder.startRecording();
                    setRecorder(newRecorder);
                    toggleIsRecording();
                })
                .catch((error) => console.error(error));
        }
    };

    useEffect(() => {
        return () => {
            if (recorder) {
                recorder.stopRecording();
            }
        };
    }, [recorder]);

    return (
        <div className="flex justify-center items-center absolute bottom-[-8rem]">
            <button className="p-4 rounded-md bg-blue-700 text-slate-50" onClick={startRecording}>
                {isRecording
                    ? "Press to stop recording"
                    : "Press to start recording"}
            </button>
        </div>
    );
}

AudioRecorder.propTypes = {
    setAudioFile: PropTypes.func.isRequired,
};

export default AudioRecorder;
