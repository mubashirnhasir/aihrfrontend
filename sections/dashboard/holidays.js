"use client";

import Calendar from '@/public/icons/calendar'
import React, { useState, useEffect } from 'react'

const Holidays = () => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  const [country, setCountry] = useState('IN'); // Default to India
  const [dataSource, setDataSource] = useState(''); // Track which API was used

  // Fetch holidays from API
  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        setLoading(true);
        
        // Use local fallback data to ensure accuracy
        console.log(`Fetching holidays for ${getCountryName(country)} - using local data`);
        const countryHolidays = getFallbackHolidays();
        setHolidays(countryHolidays);
        setDataSource('static');
        setError(null);
        
      } catch (err) {
        console.error('Error fetching holidays:', err);
        setError('Failed to load holidays');
        // Set fallback holidays if all APIs fail
        setHolidays(getFallbackHolidays());
        setDataSource('static');
        console.log('Using fallback holidays for country:', country);
      } finally {
        setLoading(false);
      }
    };

    fetchHolidays();
  }, [country]); // Dependency on country to refetch when changed

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  };

  // Fallback holidays if API fails
  const getFallbackHolidays = () => {
    const currentYear = new Date().getFullYear();
    const currentDate = new Date();
      const holidaysByCountry = {
      IN: [
        { title: "Republic Day", date: `26 January ${currentYear}`, type: "National Holiday" },
        { title: "Holi", date: `13 March ${currentYear}`, type: "Festival" },
        { title: "Good Friday", date: `29 March ${currentYear}`, type: "National Holiday" },
        { title: "Ram Navami", date: `17 April ${currentYear}`, type: "Festival" },
        { title: "Eid al-Fitr", date: `31 May ${currentYear}`, type: "Festival" },
        { title: "Rath Yatra", date: `7 July ${currentYear}`, type: "Festival" },
        { title: "Independence Day", date: `15 August ${currentYear}`, type: "National Holiday" },
        { title: "Janmashtami", date: `26 August ${currentYear}`, type: "Festival" },
        { title: "Ganesh Chaturthi", date: `17 September ${currentYear}`, type: "Festival" },
        { title: "Gandhi Jayanti", date: `2 October ${currentYear}`, type: "National Holiday" },
        { title: "Dussehra", date: `12 October ${currentYear}`, type: "Festival" },
        { title: "Diwali", date: `1 November ${currentYear}`, type: "Festival" },
        { title: "Guru Nanak Jayanti", date: `15 November ${currentYear}`, type: "Festival" },
        { title: "Christmas Day", date: `25 December ${currentYear}`, type: "National Holiday" }
      ],
      US: [
        { title: "New Year's Day", date: `1 January ${currentYear}`, type: "Federal Holiday" },
        { title: "Martin Luther King Jr. Day", date: `20 January ${currentYear}`, type: "Federal Holiday" },
        { title: "Presidents Day", date: `17 February ${currentYear}`, type: "Federal Holiday" },
        { title: "Memorial Day", date: `26 May ${currentYear}`, type: "Federal Holiday" },
        { title: "Juneteenth", date: `19 June ${currentYear}`, type: "Federal Holiday" },
        { title: "Independence Day", date: `4 July ${currentYear}`, type: "National Holiday" },
        { title: "Labor Day", date: `1 September ${currentYear}`, type: "Federal Holiday" },
        { title: "Columbus Day", date: `13 October ${currentYear}`, type: "Federal Holiday" },
        { title: "Veterans Day", date: `11 November ${currentYear}`, type: "Federal Holiday" },
        { title: "Thanksgiving", date: `27 November ${currentYear}`, type: "National Holiday" },
        { title: "Christmas Day", date: `25 December ${currentYear}`, type: "Federal Holiday" }
      ],
      GB: [
        { title: "New Year's Day", date: `1 January ${currentYear}`, type: "Bank Holiday" },
        { title: "Good Friday", date: `18 April ${currentYear}`, type: "Bank Holiday" },
        { title: "Easter Monday", date: `21 April ${currentYear}`, type: "Bank Holiday" },
        { title: "Early May Bank Holiday", date: `5 May ${currentYear}`, type: "Bank Holiday" },
        { title: "Spring Bank Holiday", date: `26 May ${currentYear}`, type: "Bank Holiday" },
        { title: "Summer Bank Holiday", date: `25 August ${currentYear}`, type: "Bank Holiday" },
        { title: "Christmas Day", date: `25 December ${currentYear}`, type: "Bank Holiday" },
        { title: "Boxing Day", date: `26 December ${currentYear}`, type: "Bank Holiday" }
      ],
      AE: [
        { title: "New Year's Day", date: `1 January ${currentYear}`, type: "Public Holiday" },
        { title: "Eid al-Fitr", date: `31 May ${currentYear}`, type: "Islamic Holiday" },
        { title: "Arafat Day", date: `6 June ${currentYear}`, type: "Islamic Holiday" },
        { title: "Eid al-Adha", date: `7 June ${currentYear}`, type: "Islamic Holiday" },
        { title: "Islamic New Year", date: `29 June ${currentYear}`, type: "Islamic Holiday" },
        { title: "Prophet Muhammad's Birthday", date: `5 September ${currentYear}`, type: "Islamic Holiday" },
        { title: "Commemoration Day", date: `1 December ${currentYear}`, type: "National Holiday" },
        { title: "UAE National Day", date: `2 December ${currentYear}`, type: "National Holiday" },
        { title: "UAE National Day Holiday", date: `3 December ${currentYear}`, type: "National Holiday" }
      ]
    };
    
    const countryHolidays = holidaysByCountry[country] || holidaysByCountry.IN;
    
    // Filter to show only upcoming holidays within next 3 months
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(currentDate.getMonth() + 3);
    
    return countryHolidays
      .filter(holiday => {
        // Convert holiday date string to Date object for comparison
        const holidayDate = new Date(holiday.date);
        return holidayDate >= currentDate && holidayDate <= threeMonthsFromNow;
      })
      .slice(0, 6)
      .map(holiday => ({
        ...holiday,
        description: `${holiday.type} in ${getCountryName(country)}`
      }));
  };
  // Get country name for display
  const getCountryName = (countryCode) => {
    const countryNames = {
      IN: 'India',
      US: 'United States',
      GB: 'United Kingdom',
      AE: 'UAE'
    };
    return countryNames[countryCode] || countryCode;
  };

  // Get time period description
  const getTimePeriodDescription = () => {
    if (holidays.length === 0) return "No upcoming holidays";
    
    const firstHoliday = new Date(holidays[0]?.date);
    const lastHoliday = new Date(holidays[holidays.length - 1]?.date);
    const currentMonth = new Date().getMonth();
    
    if (firstHoliday.getMonth() === currentMonth) {
      return "This Month";
    } else {
      return "Next 3 Months";
    }
  };

  return (
    <div>
      <div className="border border-gray-200 p-4 min-h-[450px] max-h-full rounded-lg">
        <div className="flex flex-col gap-1">
          <div className="text-lg font-medium">{getCountryName(country)} Holidays</div>
          <div className="supporting-text">
            {loading ? "Loading..." : getTimePeriodDescription()}
          </div>
        </div>

        <div className="h-[1px] bg-gray-300 w-full my-2"></div>

        <div className="flex flex-col gap-4">
          {loading ? (
            // Loading skeleton
            [...Array(3)].map((_, idx) => (
              <div
                key={idx}
                className="card p-4 flex items-start gap-2 bg-gradient-to-b from-gray-200 to-gray-300 w-full rounded-lg h-[100px] animate-pulse"
              >
                <div className="bg-gray-400 p-2 rounded-lg w-12 h-12"></div>
                <div className="flex-1">
                  <div className="bg-gray-400 h-4 rounded mb-2 w-3/4"></div>
                  <div className="bg-gray-400 h-3 rounded w-1/2"></div>
                </div>
              </div>
            ))
          ) : error ? (
            // Error state
            <div className="text-center py-8">
              <div className="text-red-500 mb-2">⚠️ {error}</div>
              <button 
                onClick={() => window.location.reload()}
                className="text-blue-600 text-sm hover:underline"
              >
                Retry
              </button>
            </div>
          ) : holidays.length === 0 ? (
            // No holidays
            <div className="text-center py-8 text-gray-500">
              <Calendar className="mx-auto mb-2 opacity-50" />
              <div>No upcoming holidays found</div>
            </div>
          ) : (
            // Display holidays
            holidays.map((holiday, idx) => (
              <div
                key={idx}
                className="card p-4 flex items-start gap-2 bg-gradient-to-b from-[#38D2F5] to-[#0BA5EC] w-full rounded-lg border border-white h-[100px] cursor-pointer transition-all hover:shadow-[0px_22px_18px_-12px_rgba(0,0,0,0.14)]"
                title={holiday.description}
              >
                <div className="bg-[#0BA5EC] p-2 rounded-lg border border-white">
                  <Calendar color="white" />
                </div>
                <div className="text-white flex-1">
                  <div className="text-lg font-semibold truncate">{holiday.title}</div>
                  <div className="font-medium text-sm">{holiday.date}</div>
                  {holiday.type && (
                    <div className="text-xs opacity-90 mt-1">{holiday.type}</div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>        {/* Country selector and data source info */}
        <div className="mt-4 pt-2 border-t border-gray-200 flex justify-between items-center">          <select 
            value={country} 
            onChange={(e) => setCountry(e.target.value)}
            className="text-xs bg-white border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-all cursor-pointer shadow-sm"
          >
            <option value="IN">🇮🇳 India</option>
            <option value="US">🇺🇸 United States</option>
            <option value="GB">🇬🇧 United Kingdom</option>
            <option value="AE">🇦🇪 UAE</option>
          </select>
          
          {/* Data source indicator */}
          {dataSource && !loading && (
            <div className="text-xs text-gray-500 flex items-center">
              <div className={`w-2 h-2 rounded-full mr-1 ${
                dataSource === 'calendarific' ? 'bg-green-500' : 
                dataSource === 'nager.at' ? 'bg-yellow-500' : 
                dataSource === 'api' ? 'bg-blue-500' : 'bg-gray-500'
              }`}></div>
              {dataSource === 'static' ? 'Local data' : 'Live data'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Holidays;
