import React from 'react';
import { Viewer, SpecialZoomLevel } from '@react-pdf-viewer/core';
import { pageNavigationPlugin, RenderCurrentPageLabelProps } from '@react-pdf-viewer/page-navigation';
import * as pdfjs from 'pdfjs-dist';
import { thumbnailPlugin } from '@react-pdf-viewer/thumbnail';
import {ZoomInIcon, ZoomOutIcon, zoomPlugin} from '@react-pdf-viewer/zoom';
// Set the workerSrc globally
// pdfjs.GlobalWorkerOptions.workerSrc = `/src/assets/pdf.worker.min.js`;
pdfjs.GlobalWorkerOptions.workerSrc = `/assets/pdf.worker.min.js`;

// Import necessary styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/page-navigation/lib/styles/index.css';
import '@react-pdf-viewer/thumbnail/lib/styles/index.css';
import '@react-pdf-viewer/page-navigation/lib/styles/index.css';
import '@react-pdf-viewer/zoom/lib/styles/index.css';

// Assuming you have these SVGs in your assets
import arrowleft from '../assets/left.svg';
import arrowright from '../assets/right.svg';

function PDFViewer({ pdfUrl }) {
    // Initialize the plugins
    const thumbnailPluginInstance = thumbnailPlugin();
    const { Thumbnails } = thumbnailPluginInstance;

    const pageNavigationPluginInstance = pageNavigationPlugin();
    const zoomPluginInstance = zoomPlugin();
    const { ZoomInButton, ZoomOutButton, ZoomPopover } = zoomPluginInstance;

    const { CurrentPageLabel } = pageNavigationPluginInstance;

    return (
        <div className="pdf-viewer-container h-[1600px] text-center m-auto flex">

                {/*<div className="flex flex-wrap w-1/6 bg-gray-100 p-4 overflow-y-auto overflow-hidden">*/}
                {/**/}
                {/*    <Thumbnails />*/}
                {/*</div>*/}
                <div className="pdf-content w-full  h-[1600px]">

                    <Viewer defaultScale={SpecialZoomLevel.PageFit} fileUrl={pdfUrl} plugins={[thumbnailPluginInstance, pageNavigationPluginInstance, zoomPluginInstance]} />

                    <div className={'flex justify-center items-center'}>
                        <div className="navigation-buttons">
                            <button className={'me-10 ms-10 bg-lGrayDark text-white p-4  bottom-10 right-10 z-10'} onClick={() => pageNavigationPluginInstance.jumpToPreviousPage()}>
                                <img src={arrowleft} alt="Previous" />
                            </button>
                            <CurrentPageLabel>
                                {props => (
                                    <>
                                        {`${props.currentPage + 1} di ${props.numberOfPages}`}
                                    </>
                                )}
                            </CurrentPageLabel>
                            <button className={'ms-10 bg-lGrayDark text-white p-4  bottom-10 right-10 z-10'} onClick={() => pageNavigationPluginInstance.jumpToNextPage()}>
                                <img src={arrowright} alt="Next" />
                            </button>
                        </div>
                        <div style={{ padding: '0px 2px' }}>
                            <ZoomOutButton />
                        </div>
                        <div style={{ padding: '0px 2px', pointerEvents: 'none' }}>
                            <ZoomPopover />
                        </div>
                        <div style={{ padding: '0px 2px' }}>
                            <ZoomInButton />
                        </div>
                    </div>



                </div>

        </div>
    );
}

export default PDFViewer;
