import { useState, useEffect } from "react";
import JSZip from "jszip";
import Footer from "./Footer";

const NGROK_URL = "http://c740-34-139-31-84.ngrok.io";

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
        <>
            <div>
                {imageUrls.map((imageUrl, index) => (
                    <img key={index} src={imageUrl} alt={`Image ${index}`} />
                ))}
            </div>

            <Footer onChange={onChange} />
        </>
    );
}

export default App;
