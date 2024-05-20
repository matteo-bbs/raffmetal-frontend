import React, {useEffect, useState} from "react";
import videotest from "./video.mp4";

export const Notizia = (props) => {
    function extractTextFromHtml(htmlString) {
        try {
            const parser = new DOMParser();
            const parsedHtml = parser.parseFromString(htmlString, "text/html");
            return parsedHtml.querySelector(".field__item").textContent;
        } catch (error) {
            console.error("Errore nell'estrazione del testo HTML:", error);
            return "Errore nell'estrazione del testo HTML";
        }
    }
    //console.log(props.content.immagine)
    const [selectedImage, setSelectedImage] = useState(props.content?.galleria_di_immagini?.[0]?.media_image);

    const handleThumbnailClick = (image, index) => {
        // Update the selected image
        setSelectedImage(image);

        // Replace the thumbnail image with the selected image
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails[index].src = image;
    };

// console.log(props)
    return(
        <div className={'flex flex-wrap h-full p-10'}>
            {props.content?.galleria_di_immagini?.length > 0 && (
            <div className={'w-1/3 relative h-full pe-12'}>
                    <>
                        <img
                            className="left-0 top-0 w-full h-auto  z-9"
                            src={selectedImage}
                            alt=""
                        />
                        <div className="thumbnails flex flex-wrap w-full">
                            {props.content.galleria_di_immagini.map((image, index) => (
                                <img
                                    key={index}
                                    src={image.media_image}
                                    alt=""
                                    onClick={() => handleThumbnailClick(image.media_image, index)}
                                    className="thumbnail w-40 h-auto object-cover me-3 mt-10"
                                />
                            ))}
                        </div>
                    </>
            </div>
            )}
            <div className={' w-2/3 h-full'}>
                <p className={'text-black font-semibold relative z-10 w-2/3 uppercase font-lTekneLDO mb-5'} dangerouslySetInnerHTML={{ __html: `${props.content.tipo_della_notizia} | ${props.content.data_della_notizia}`}} />
                <h1 className={'text-2xl font-bold mb-2 font-lTekneLDO'} dangerouslySetInnerHTML={{ __html: props.content.title }}></h1>
                <h1 className={'text-xl font-normal mb-5 font-lPublicSans'} dangerouslySetInnerHTML={{ __html: props.content.sottotitolo }}></h1>
                <p className={'text-black mt-2 relative z-10 w-2/3 font-lPublicSans text-xl font-normal'} dangerouslySetInnerHTML={{ __html: props.content.body}} />
            </div>
        </div>
    )
}
