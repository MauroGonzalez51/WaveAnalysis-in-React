import { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Button = styled.button``;

function RecordMedia({ onChange }) {
    const [audio, setAudio] = useState(null);
    const [audioPermissionGranted, setAudioPermission] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioChunks, setAudioChunks] = useState([]);

    const requestAudioPermision = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });

            setMediaRecorder(new MediaRecorder(stream));

            setAudioPermission(true);
        } catch (error) {
            console.error(error);
        }
    };

    const startRecording = () => {
        if (!audioPermissionGranted) {
            requestAudioPermision().then(() => {
                if (mediaRecorder) mediaRecorder.start();
            });
        } else {
            if (mediaRecorder) mediaRecorder.start();
        }
    };

    const stopRecording = () => {
        return new Promise((resolve) => {
            if (mediaRecorder) {
                const onStop = () => {
                    mediaRecorder.removeEventListener(
                        "dataavailable",
                        onDataAvailable
                    );
                    mediaRecorder.removeEventListener("stop", onStop);

                    const audioBlob = new Blob(audioChunks, {
                        type: "audio/webm;codecs=opus",
                    });

                    const audioURL = URL.createObjectURL(audioBlob);
                    const audio = new Audio(audioURL);

                    audioChunks.length = 0;

                    setAudio(audio);
                    resolve();
                };

                const onDataAvailable = (event) => {
                    setAudioChunks((array) => [...array, event.data]);
                };

                mediaRecorder.addEventListener("stop", onStop);
                mediaRecorder.addEventListener(
                    "dataavailable",
                    onDataAvailable
                );

                mediaRecorder.stop();
            } else {
                console.error("mediaRecorder is not defined.");
                resolve();
            }
        });
    };

    const audioToFile = (audio) => {
        return new Promise((resolve, reject) => {
            fetch(audio.src)
                .then((response) => response.blob())
                .then((blob) => {
                    const file = new File([blob], "audio.webm", {
                        type: "audio/webm",
                    });
                    resolve(file);
                })
                .catch((error) => reject(error));
        });
    };

    const handleClick = () => {
        if (isRecording) {
            stopRecording().then(() => {
                if (audio) {
                    audioToFile(audio).then((file) => onChange(file));
                }
            });
        } else startRecording();

        setIsRecording((value) => !value);
    };

    return (
        <Container>
            <Button onClick={handleClick}>
                {isRecording
                    ? "Press to stop recording"
                    : "Press to start recording"}
            </Button>
        </Container>
    );
}

RecordMedia.propTypes = {
    onChange: PropTypes.func.isRequired,
};

export default RecordMedia;
