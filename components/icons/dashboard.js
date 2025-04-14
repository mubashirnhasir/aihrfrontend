import React from 'react'

const Dashboard = ({color}) => {
    return (
        <div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.375 17.098C6.375 14.9606 6.375 13.7623 6.375 11.625M17.25 17.0981C17.25 13.9356 17.25 12.1625 17.25 9M11.7318 17.0981L11.7318 6" stroke={color || "black"} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </div>
    )
}

export default Dashboard