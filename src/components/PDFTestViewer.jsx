// import React, { useState } from "react";
// import { Document, Page, pdfjs } from "react-pdf";
// import arrowleft from "../assets/left.svg";
// import arrowright from "../assets/right.svg";
// import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
// import { Thumbnail } from '@react-pdf-viewer/thumbnail';
// // Set the URL for the PDF.js worker
// pdfjs.GlobalWorkerOptions.workerSrc = `/src/assets/pdf.worker.js`;
//
// function PDFViewer({ pdfUrl }) {
//     const [numPages, setNumPages] = useState(null);
//     const [pageNumber, setPageNumber] = useState(1);
//     const [scale, setScale] = useState(2);
//     const [thumbnails, setThumbnails] = useState([]);
//
//     function onDocumentLoadSuccess({ numPages }) {
//         setNumPages(numPages);
//         generateThumbnails(pdfUrl, numPages).then(setThumbnails);
//     }
//
//     // const renderPagePreviews = () => {
//     //   const previews = [];
//     //   for (let i = 1; i <= numPages; i++) {
//     //     previews.push(
//     //         <div
//     //             key={i}
//     //             className={`page-preview cursor-pointer mb-4 ${
//     //                 i === pageNumber ? "border-2 border-rPrimary rounded-[5px]" : " border border-lGrayDark rounded-[5px]"
//     //             }`}
//     //             onClick={() => setPageNumber(i)}
//     //         >
//     //           <div className="page-number">{i}</div>
//     //           <Document file={pdfUrl}>
//     //             <Page
//     //                 key={`page-${i}`}
//     //                 pageNumber={i}
//     //                 renderAnnotationLayer={false}
//     //             />
//     //           </Document>
//     //         </div>
//     //     );
//     //   }
//     //   return previews;
//     // };
//
//     const handleZoomIn = () => {
//         if(scale < 20){
//             setScale(scale + 0.1);
//         }
//     };
//
//     const handleZoomOut = () => {
//         if(scale > 1){
//             setScale(scale - 0.1);
//         }
//     };
//
//     const zoomPercentage = Math.round(scale * 100);
//
//
//     const generateThumbnails = async (file, numPages) => {
//         const pdf = await pdfjs.getDocument(file).promise;
//         let thumbnails = [];
//
//         for (let pageNum = 1; pageNum <= numPages; pageNum++) {
//             const page = await pdf.getPage(pageNum);
//             const viewport = page.getViewport({ scale: 0.2 });
//             const canvas = document.createElement('canvas');
//             const context = canvas.getContext('2d');
//             canvas.height = viewport.height;
//             canvas.width = viewport.width;
//
//             await page.render({ canvasContext: context, viewport: viewport }).promise;
//             thumbnails.push(canvas.toDataURL());
//         }
//
//         return thumbnails;
//     };
//     return (
//         <div className="pdf-viewer-container h-[865px] text-center m-auto flex">
//             {numPages > 1 && (
//                 <div className="flex flex-wrap w-1/6 bg-gray-100 p-4 overflow-y-auto overflow-hidden">
//                     {thumbnails.length > 0 && thumbnails.map((thumbnail, index) => (
//                         <img
//                             key={index}
//                             src={thumbnail}
//                             onClick={() => setPageNumber(index + 1)}
//                             alt={`Thumbnail ${index + 1}`}
//                             style={{ width: '100%', height: 'auto', margin: 5, cursor: 'pointer' }}
//
//                         />
//                     ))}
//                 </div>
//             )}
//             <div className="pdf-content w-5/6 ">
//                 <div className="mb-4 flex items-center w-full justify-center">
//                     <button onClick={handleZoomIn} className="p-2 bg-gray-200 mr-2">
//                         Zoom In
//                     </button>
//                     <button onClick={handleZoomOut} className="p-2 bg-gray-200">
//                         Zoom Out
//                     </button>
//                     <p className="mx-4">Zoom Level: {zoomPercentage}%</p>
//                 </div>
//                 <Document
//                     className="border-2 border-rPrimary mt-5 border-solid overflow-auto h-[865px] "
//                     file={pdfUrl}
//                     onLoadSuccess={onDocumentLoadSuccess}
//                 >
//                     <Page pageNumber={pageNumber} width={600} scale={scale} />
//                 </Document>
//                 {numPages > 1 && (
//                     <div
//                         className={
//                             " mt-3 m-auto bottom-0 z-10 flex justify-center items-center"
//                         }
//                     >
//                         <button
//                             disabled={pageNumber <= 1}
//                             onClick={() => setPageNumber(pageNumber - 1)}
//                             className={
//                                 "me-10 bg-lGrayDark text-white p-4  bottom-10 left-10 z-10"
//                             }
//                         >
//                             <img src={arrowleft} alt="Previous" />
//                         </button>
//                         <p className={"mb-0"}>
//                             Pagina {pageNumber} di {numPages}
//                         </p>
//                         <button
//                             disabled={pageNumber >= numPages}
//                             onClick={() => setPageNumber(pageNumber + 1)}
//                             className={
//                                 "ms-10 bg-lGrayDark text-white p-4  bottom-10 right-10 z-10"
//                             }
//                         >
//                             <img src={arrowright} alt="Next" />
//                         </button>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }
// export default PDFViewer;