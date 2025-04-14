import React from 'react'

const User = ({color}) => {
    return (
        <div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.1655 15.2048C16.8702 15.2048 18.272 15.1101 18.7276 14.8055C18.9408 14.663 19.1451 14.2787 19.1234 14.0069C19.1234 12.2478 16.1797 12.2478 16.1797 12.2478C16.1797 12.2478 16.1797 12.2478 16.1797 12.2478H15.1937C15.1749 12.2478 15.1564 12.2481 15.1377 12.2487C14.8586 12.2586 12.5742 12.3625 12.513 13.1297M17.5403 8.41662C17.5403 9.29875 16.8315 10.0139 15.9571 10.0139C15.0827 10.0139 14.3739 9.29875 14.3739 8.41662C14.3739 7.5345 15.0827 6.8194 15.9571 6.8194C16.8315 6.8194 17.5403 7.5345 17.5403 8.41662ZM12.3384 8.5203C12.3384 9.91222 11.22 11.0406 9.84035 11.0406C8.46069 11.0406 7.34225 9.91222 7.34225 8.5203C7.34225 7.12838 8.46069 6 9.84035 6C11.22 6 12.3384 7.12838 12.3384 8.5203ZM14.4328 16.871C13.7715 17.3131 12.3458 18 9.87119 18C7.39663 18 5.97094 17.3131 5.30958 16.871C5.00011 16.6641 4.84758 16.2832 4.87905 15.8886C4.91358 15.4557 5.03329 15.0232 5.1714 14.6485C5.44058 13.9181 6.18114 13.5195 6.95949 13.5195H12.7829C13.5612 13.5195 14.3018 13.9181 14.571 14.6485C14.7091 15.0232 14.8288 15.4557 14.8633 15.8886C14.8948 16.2832 14.7423 16.6641 14.4328 16.871Z" stroke={ color || "black"} strokeLinecap="round" strokeLinejoin="round" />
            </svg>

        </div>
    )
}

export default User