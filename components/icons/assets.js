import React from 'react'

const Assets = ({color}) => {
    return (
        <div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.125 13.0962L4.875 13.0962M15.2885 19.125H8.71154M9.80769 19.125V15.8365M14.1923 19.125V15.8365M17.625 15.8365L6.375 15.8365C5.54657 15.8365 4.875 15.165 4.875 14.3365L4.875 6.37501C4.875 5.54658 5.54657 4.87501 6.375 4.87501L17.625 4.875C18.4534 4.875 19.125 5.54657 19.125 6.375V14.3365C19.125 15.165 18.4534 15.8365 17.625 15.8365Z" stroke={ color || "black"} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </div>
    )
}

export default Assets