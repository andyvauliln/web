
import React, { useState } from "react";

const defaultPlaceHolder = "Search, Ask, or Leave Feedback"

export default function SubHeader() {
    const [placeHolder, setPlaceHolder] = useState(defaultPlaceHolder)

    const handleChange = (newValue: string) => {
        console.log(newValue);
    }
    return (
        <form className="flex w-full max-w-[50%] gap-2 items-center">
            <label htmlFor="voice-search" className="sr-only">Search</label>
            <div className="relative flex flex-grow">
                <input type="text" id="voice-search" className="bg-gray-50 border flex-grow border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={placeHolder} />
                <div className="absolute inset-y-0 right-0 flex items-center mr-1 border-l border-gray-300">
                    <button type="button" className="bg-gray-50 my-1 flex items-center pl-2" onClick={() => handleChange('speak')} onMouseEnter={() => setPlaceHolder("Input your message with Voice")} onMouseLeave={() => setPlaceHolder(defaultPlaceHolder)}>
                        <svg className="w-5 h-5 hover:text-green-700 text-gray-800 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7v3a5.006 5.006 0 0 1-5 5H6a5.006 5.006 0 0 1-5-5V7m7 9v3m-3 0h6M7 1h2a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V4a3 3 0 0 1 3-3Z" />
                        </svg>
                    </button>
                    <button type="button" className="bg-gray-50 my-1 flex items-center" onClick={() => handleChange('ai_message')} onMouseEnter={() => setPlaceHolder("Ask AI System about anything you would love to know")} onMouseLeave={() => setPlaceHolder(defaultPlaceHolder)}>
                        <svg className="w-6 h-6 hover:text-green-700 text-gray-800 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18.5A2.493 2.493 0 0 1 7.51 20H7.5a2.468 2.468 0 0 1-2.4-3.154 2.98 2.98 0 0 1-.85-5.274 2.468 2.468 0 0 1 .92-3.182 2.477 2.477 0 0 1 1.876-3.344 2.5 2.5 0 0 1 3.41-1.856A2.5 2.5 0 0 1 12 5.5m0 13v-13m0 13a2.493 2.493 0 0 0 4.49 1.5h.01a2.468 2.468 0 0 0 2.403-3.154 2.98 2.98 0 0 0 .847-5.274 2.468 2.468 0 0 0-.921-3.182 2.477 2.477 0 0 0-1.875-3.344A2.5 2.5 0 0 0 14.5 3 2.5 2.5 0 0 0 12 5.5m-8 5a2.5 2.5 0 0 1 3.48-2.3m-.28 8.551a3 3 0 0 1-2.953-5.185M20 10.5a2.5 2.5 0 0 0-3.481-2.3m.28 8.551a3 3 0 0 0 2.954-5.185" />
                        </svg>
                    </button>
                    <button type="button" className="bg-gray-50 my-1 flex items-center" onClick={() => handleChange('feedback')} onMouseEnter={() => setPlaceHolder("Send us your feedback, report Issue, propose Feature or Whatever")} onMouseLeave={() => setPlaceHolder(defaultPlaceHolder)}>
                        <svg className="w-6 h-6  hover:text-green-700 text-gray-800 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M3 5.983C3 4.888 3.895 4 5 4h14c1.105 0 2 .888 2 1.983v8.923a1.992 1.992 0 0 1-2 1.983h-6.6l-2.867 2.7c-.955.899-2.533.228-2.533-1.08v-1.62H5c-1.105 0-2-.888-2-1.983V5.983Zm5.706 3.809a1 1 0 1 0-1.412 1.417 1 1 0 1 0 1.412-1.417Zm2.585.002a1 1 0 1 1 .003 1.414 1 1 0 0 1-.003-1.414Zm5.415-.002a1 1 0 1 0-1.412 1.417 1 1 0 1 0 1.412-1.417Z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <button type="button" className="bg-gray-50  my-1 flex items-center" onClick={() => handleChange('search')} onMouseEnter={() => setPlaceHolder("Search anything about Land")} onMouseLeave={() => setPlaceHolder(defaultPlaceHolder)}>
                        <svg className="w-6 h-6  hover:text-green-700 text-gray-800 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
                        </svg>
                    </button>
                </div>
            </div>
        </form>
    )

}