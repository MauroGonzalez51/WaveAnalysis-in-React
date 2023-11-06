import { useState, useEffect } from "react";
import { Hourglass } from "react-loader-spinner";
import { motion, AnimatePresence } from "framer-motion";
import JSZip from "jszip";
import Images from "@components/Images";
import UploadFiles from "@components/UploadFiles";
import { NGROK_URL } from "./constants";

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

    useEffect(() => {
        if (audioFile) setLoading(true);

        const formData = new FormData();
        formData.append("audio", audioFile);

        const abortController = new AbortController();

        const timeoutID = setTimeout(() => {
            abortController.abort();
        }, 120000);

        setImageUrls([]);

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
            .catch((error) => {
                setLoading(false);
                console.log(error);
            });
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

            validateZipFile()
                .catch((error) => {
                    console.log(error);
                })
                .finally(() => setLoading(false));
        }
    }, [zipFile]);

    return (
        <div className="flex justify-center items-center flex-col m-12 gap-6">
            {isLoading && (
                <AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Hourglass
                            visible={true}
                            height="60"
                            width="60"
                            ariaLabel="hourglass-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                            colors={["#214cc2", "#72a1ed"]}
                        />
                    </motion.div>
                </AnimatePresence>
            )}
            <UploadFiles setAudioFile={setAudioFile} />
            {audioFile && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="italic text-red-500 text-base"
                >
                    Selected File: {audioFile.name}
                </motion.div>
            )}
            {imageUrls && <Images imageUrls={imageUrls} />}
        </div>
    );
}

export default App;
