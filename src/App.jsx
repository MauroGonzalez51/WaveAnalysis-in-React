import { useState, useEffect } from "react";
import styled from "styled-components";
import JSZip from "jszip";
import Footer from "./Footer";
import Images from "./Images";

const NGROK_URL = "http://c740-34-139-31-84.ngrok.io";

const Container = styled.div`
    margin: 2rem 3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

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

    const onChange = (file) => setAudioFile(file);

    useEffect(() => {
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

            validateZipFile().catch((error) => console.log(error));
        }
    }, [zipFile]);

    return (
        <Container>
            <Images imageUrls={imageUrls} />
            <Footer onChange={onChange} />
        </Container>
    );
}

export default App;
