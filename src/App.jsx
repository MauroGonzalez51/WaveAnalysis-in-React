import { useState, useEffect } from "react";
import { Hourglass } from "react-loader-spinner";
import styled from "styled-components";
import JSZip from "jszip";
import Images from "./Images";
import UploadFiles from "./UploadFiles";

const NGROK_URL = "http://715d-35-185-138-88.ngrok.io";

const Container = styled.div`
    margin: 2rem 3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 1rem;
`;

const Text = styled.span`
    font-size: ${(props) => props.$fontSize || "1rem"};
    color: ${(props) => props.$color || "#000000"};
    font-style: ${(props) => props.$fontStyle || "normal"};
`;

/**
 * React functional component that manages the state of an audio file, a zip file, and an array of image URLs.
 * It includes two useEffect hooks that handle the logic for uploading the audio file, sending it to a server for analysis,
 * and processing the resulting zip file to extract and display the image URLs.
 *
 * @returns {JSX.Element} The rendered component.
 */
function App() {
    const [audioFile, setAudioFile] = useState(null);
    const [zipFile, setZipFile] = useState(null);
    const [imageUrls, setImageUrls] = useState([]);

    const [isLoading, setLoading] = useState(false);

    const handleOnChange = (file) => setAudioFile(file);

    useEffect(() => {
        if (audioFile) setLoading(true);

        const formData = new FormData();
        formData.append("audio", audioFile);

        const abortController = new AbortController();

        const timeoutID = setTimeout(() => {
            abortController.abort();
        }, 120000);

        fetch(`${NGROK_URL}/analyze`, {
            method: "POST",
            body: formData,
            signal: abortController.signal,
        })
            .then((response) => {
                clearTimeout(timeoutID);
                if (!response.ok) throw new Error(response.message);
                return response.blob();
            })
            .then((response) => setZipFile(response))
            .catch((error) => console.error(error));
    }, [audioFile]);

    useEffect(() => {
        if (zipFile) {
            const validateZipFile = () => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.addEventListener("load", () => {
                        JSZip.loadAsync(reader.result)
                            .then((zip) => {
                                console.log("[ ZIP ] Valid");

                                const imageFiles = Object.values(
                                    zip.files
                                ).filter((file) => file.name.endsWith(".png"));

                                const urls = [];

                                Promise.all(
                                    imageFiles.map((file) =>
                                        file.async("blob").then((imageBlob) => {
                                            const imageURL =
                                                URL.createObjectURL(imageBlob);
                                            urls.push(imageURL);
                                        })
                                    )
                                )
                                    .then(() => {
                                        setImageUrls(urls);
                                        setLoading(false);
                                        resolve();
                                    })
                                    .catch(() => {
                                        setZipFile(null);
                                        reject();
                                    });
                            })
                            .catch(() => {
                                setZipFile(null);
                                reject();
                            });
                    });

                    reader.readAsArrayBuffer(zipFile);
                });
            };

            validateZipFile().catch((error) => {
                console.log(error);
                setLoading(false);
            });
        }
    }, [zipFile]);

    return (
        <Container>
            {imageUrls && <Images imageUrls={imageUrls} />}
            {isLoading && (
                <Hourglass
                    visible={true}
                    height="60"
                    width="60"
                    ariaLabel="hourglass-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                    colors={["#214cc2", "#72a1ed"]}
                />
            )}
            <UploadFiles handleOnChange={handleOnChange} />
            {audioFile && (
                <Text $fontStyle="italic" $color="#e34f42">
                    Selected File: {audioFile.name}
                </Text>
            )}
        </Container>
    );
}

export default App;
