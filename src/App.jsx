import { useState, useEffect } from "react";
import { Hourglass } from "react-loader-spinner";
import JSZip from "jszip";
import Images from "@components/Images";
import UploadFiles from "@components/UploadFiles";

const NGROK_URL = "http://d4bc-34-134-173-95.ngrok.io";

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
        <div className="flex justify-center items-center flex-col m-12 gap-6">
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
                <span className="italic text-red-500 text-base">
                    Selected File: {audioFile.name}
                </span>
            )}
        </div>
    );
}

export default App;
