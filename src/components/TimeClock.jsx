import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';

export const TimeClock = () => {
    const [italianTime, setItalianTime] = useState(moment().tz('Europe/Rome'));

    useEffect(() => {
        const interval = setInterval(() => {
            const italianTime = moment().tz('Europe/Rome');
            setItalianTime(italianTime);
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    const formattedTime = italianTime.format('HH:mm:ss');
    const formattedDate = italianTime.format('DD/MM/YYYY'); // Current date

    return (
        // <div className=" w-52">
        //     <div className="text-right flex">
        //         <h1 className='me-4 ms-4 text-3xl text-rPrimary'>{formattedTime}</h1>
        //         <h2 className='text-3xl text-rPrimary'>{formattedDate}</h2> {/* Display the current date */}
        //     </div>
        // </div>
    <div className="w-full">
        <div className="text-center flex">
            <h1 className='me-4 text-3xl text-rPrimary'>{formattedTime}</h1>
            <h2 className='text-3xl text-rPrimary'>{formattedDate}</h2> {/* Display the current date */}
        </div>
    </div>
)
    ;
}