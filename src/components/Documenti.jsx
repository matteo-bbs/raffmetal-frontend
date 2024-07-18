import PDFViewer from "./PDFViewer.jsx";
import React from "react";
import { BASE_URL } from './general/baseUrl.jsx';

export const Documenti = (props) => {
    //console.log(props.content)
    function extractTextFromHtml(htmlString) {
        try {
            const parser = new DOMParser();
            const parsedHtml = parser.parseFromString(htmlString, "text/html");
            return parsedHtml.querySelector("a").getAttribute('href');
        } catch (error) {
            console.error("Errore nell'estrazione del testo HTML:", error);
            return "Errore nell'estrazione del testo HTML";
        }
    }

    // console.log(props)

    const url = `${BASE_URL}${extractTextFromHtml(props.content.allegato)}`
    console.log(url)
    return(
        <div>
            <p className={'text-black font-semibold relative z-10 w-2/3 uppercase font-lTekneLDO mb-2'} dangerouslySetInnerHTML={{ __html: `${props.content.tipologia} `}} />
            <h1 className={'text-2xl font-bold font-lTekneLDO'} dangerouslySetInnerHTML={{ __html: props.content.title }}></h1>
            <h1 className={'text-2xl font-thin mb-5 font-lTekneLDO'} dangerouslySetInnerHTML={{ __html: props.content.sottotitolo}}></h1>
            <p className={'text-black mt-2 relative z-10 w-2/3 font-lPublicSans text-xl font-normal'} dangerouslySetInnerHTML={{ __html: props.content.body}} />

            <PDFViewer pdfUrl={url}/>
        </div>
    )

}
