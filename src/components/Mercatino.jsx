import React, { useState } from "react";

export const Mercatino = (props) => {
    const [selectedImage, setSelectedImage] = useState(props.content?.galleria_di_immagini?.[0]?.media_image);

    const handleThumbnailClick = (image, index) => {
        // Update the selected image
        setSelectedImage(image);

        // Replace the thumbnail image with the selected image
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails[index].src = image;
    };

    return (
        <div className={'flex flex-wrap p-10 overflow-hidden h-full'}>
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
            <div className={'w-2/3'}>
                <h1 className={'text-lg font-lTekneLDO capitalize'}>{props.content.bundle}</h1>
                <h1 className={'text-lg mb-5 font-lTekneLDO capitalize'}>Annuncio | {new Date(props.content.data).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: '2-digit' })}</h1>
                <h1 className={'text-2xl font-bold font-lTekneLDO'} dangerouslySetInnerHTML={{ __html: props.content.title }}></h1>
                <h1 className={'text-2xl font-thin mb-5 font-lTekneLDO'}>{props.content.sottotitolo}</h1>
                <h1 className={'text-xl font-normal mb-5 font-lPublicSans'}>{props.content.prezzo}</h1>
                <p className={'text-black mt-2 relative z-10 w-2/3 font-lPublicSans text-xl font-normal h-[60vh] overflow-scroll w-full'} dangerouslySetInnerHTML={{ __html: props.content.body}} />
            </div>
        </div>
    )
}