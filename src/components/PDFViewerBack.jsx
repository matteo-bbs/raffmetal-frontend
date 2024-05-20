import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import arrowleft from "../assets/left.svg";
import arrowright from "../assets/right.svg";

pdfjs.GlobalWorkerOptions.workerSrc = `/src/assets/pdf.worker.js`;

function PDFViewer({ pdfUrl }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const renderPagePreviews = () => {
    const previews = [];
    for (let i = 1; i <= numPages; i++) {
      previews.push(
          <div
              key={i}
              className={`page-preview cursor-pointer mb-4 ${
                  i === pageNumber ? "border-2 border-rPrimary" : ""
              }`}
              onClick={() => setPageNumber(i)}
          >
            <Document file={pdfUrl}>
              <Page
                  key={`page-${i}`}
                  pageNumber={i}
                  width={50}
                  renderAnnotationLayer={false}
              />
            </Document>
          </div>
      );
    }
    return previews;
  };

  const handleZoomIn = () => {
    setScale(scale + 0.1);
  };

  const handleZoomOut = () => {
    setScale(scale - 0.1);
  };

  return (
      <div className="flex h-96">
        <div className="flex-1 border-2 border-rPrimary mt-5 border-solid">
          <div className="mb-4 flex items-center">
            <button onClick={handleZoomIn} className="p-2 bg-gray-200 mr-2">
              Zoom In
            </button>
            <button onClick={handleZoomOut} className="p-2 bg-gray-200">
              Zoom Out
            </button>
          </div>
          <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
            <Page
                pageNumber={pageNumber}
                width={600}
                scale={scale}
            />
          </Document>
          {numPages > 1 && (
              <div className="flex justify-between items-center mt-3">
                <button
                    disabled={pageNumber <= 1}
                    onClick={() => setPageNumber(pageNumber - 1)}
                    className="p-2 bg-gray-200 text-white rounded"
                >
                  <img src={arrowleft} alt="Previous" />
                </button>
                <p className="mb-0">
                  Page {pageNumber} of {numPages}
                </p>
                <button
                    disabled={pageNumber >= numPages}
                    onClick={() => setPageNumber(pageNumber + 1)}
                    className="p-2 bg-gray-200 text-white rounded"
                >
                  <img src={arrowright} alt="Next" />
                </button>
              </div>
          )}
        </div>
        {numPages > 1 && (
            <div className="w-1/6 bg-gray-100 p-4 overflow-y-auto">
              {renderPagePreviews()}
            </div>
        )}
      </div>
  );
}

export default PDFViewer;
