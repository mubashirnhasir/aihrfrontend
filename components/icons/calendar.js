import React from 'react'

const Calendar = ({color}) => {
  return (
    <div>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M19.125 9.80769H4.875M8.71154 7.06731V4.875M15.2885 7.06731L15.2885 4.875M4.875 8.16347L4.875 16.9327C4.875 18.1435 5.85653 19.125 7.06731 19.125L16.9327 19.125C18.1435 19.125 19.125 18.1435 19.125 16.9327V8.16349C19.125 6.95271 18.1435 5.97118 16.9327 5.97118L7.06731 5.97116C5.85653 5.97116 4.875 6.95269 4.875 8.16347Z" stroke={ color || "black"} strokeLinecap="round" strokeLinejoin="round"/>
</svg>

    </div>
  )
}

export default Calendar