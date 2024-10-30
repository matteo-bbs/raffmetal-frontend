import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = "/src/assets/pdf.worker.min.js";
// pdfjs.GlobalWorkerOptions.workerSrc = "/assets/pdf.worker.min.js";

function PDFViewerHome({ pdfUrl, anteprimepagine }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfData, setPdfData] = useState(null);

  useEffect(() => {
    fetch(pdfUrl)
      .then((response) => response.blob())
      .then((blob) => {
        setPdfData(new File([blob], "document.pdf"));
      });
  }, [pdfUrl]);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div className="pdf-viewer-container w-full home">
      <div className="pdf-content w-full">
        <Document file={pdfData} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} width={600} />
        </Document>
      </div>
    </div>
  );
}

export default PDFViewerHome;
