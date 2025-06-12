/**
 * API Route: Fetch National Holidays
 * Fetches holidays from multiple sources with fallbacks
 */

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country') || 'IN'; // Default to India
    const year = searchParams.get('year') || new Date().getFullYear();

    // Try primary API first (Calendarific - requires API key)
    const apiKey = process.env.NEXT_PUBLIC_HOLIDAYS_API_KEY;
    
    if (apiKey) {
      try {
        const response = await fetch(
          `https://calendarific.com/api/v2/holidays?api_key=${apiKey}&country=${country}&year=${year}&type=national`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const holidays = processCalendarificHolidays(data.response?.holidays || []);
          
          return Response.json({
            success: true,
            holidays,
            source: 'calendarific',
            country,
            year
          });
        }
      } catch (error) {
        console.log('Calendarific API failed, trying fallback...');
      }
    }

    // Fallback to free public holidays API
    try {
      const fallbackResponse = await fetch(
        `https://date.nager.at/api/v3/PublicHolidays/${year}/${country}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        const holidays = processFallbackHolidays(fallbackData);
        
        return Response.json({
          success: true,
          holidays,
          source: 'nager.at',
          country,
          year
        });
      }
    } catch (error) {
      console.log('Fallback API also failed, using static holidays...');
    }

    // Final fallback to static holidays
    const staticHolidays = getStaticHolidays(country, year);
    
    return Response.json({
      success: true,
      holidays: staticHolidays,
      source: 'static',
      country,
      year
    });

  } catch (error) {
    console.error('Holidays API error:', error);
    
    return Response.json(
      { 
        success: false, 
        error: 'Failed to fetch holidays',
        holidays: []
      }, 
      { status: 500 }
    );
  }
}

// Process Calendarific API response
function processCalendarificHolidays(holidaysData) {
  const currentDate = new Date();
  const threeMonthsFromNow = new Date();
  threeMonthsFromNow.setMonth(currentDate.getMonth() + 3);

  return holidaysData
    .filter(holiday => {
      const holidayDate = new Date(holiday.date.iso);
      return holidayDate >= currentDate && holidayDate <= threeMonthsFromNow;
    })
    .map(holiday => ({
      name: holiday.name,
      date: holiday.date.iso,
      description: holiday.description || '',
      type: holiday.type?.join(', ') || 'National Holiday',
      country: holiday.country?.name || ''
    }))
    .slice(0, 8);
}

// Process fallback API response
function processFallbackHolidays(holidaysData) {
  const currentDate = new Date();
  const threeMonthsFromNow = new Date();
  threeMonthsFromNow.setMonth(currentDate.getMonth() + 3);

  return holidaysData
    .filter(holiday => {
      const holidayDate = new Date(holiday.date);
      return holidayDate >= currentDate && holidayDate <= threeMonthsFromNow;
    })
    .map(holiday => ({
      name: holiday.name || holiday.localName,
      date: holiday.date,
      description: holiday.name !== holiday.localName ? holiday.localName : '',
      type: 'National Holiday',
      country: ''
    }))
    .slice(0, 8);
}

// Static holidays as final fallback
function getStaticHolidays(country, year) {
  const staticHolidays = {
    US: [
      { name: "New Year's Day", date: `${year}-01-01`, type: "National Holiday" },
      { name: "Martin Luther King Jr. Day", date: `${year}-01-20`, type: "Federal Holiday" },
      { name: "Presidents Day", date: `${year}-02-17`, type: "Federal Holiday" },
      { name: "Memorial Day", date: `${year}-05-26`, type: "Federal Holiday" },
      { name: "Independence Day", date: `${year}-07-04`, type: "National Holiday" },
      { name: "Labor Day", date: `${year}-09-01`, type: "Federal Holiday" },
      { name: "Columbus Day", date: `${year}-10-13`, type: "Federal Holiday" },
      { name: "Veterans Day", date: `${year}-11-11`, type: "Federal Holiday" },
      { name: "Thanksgiving", date: `${year}-11-27`, type: "National Holiday" },
      { name: "Christmas Day", date: `${year}-12-25`, type: "National Holiday" }
    ],
    GB: [
      { name: "New Year's Day", date: `${year}-01-01`, type: "Bank Holiday" },
      { name: "Good Friday", date: `${year}-04-18`, type: "Bank Holiday" },
      { name: "Easter Monday", date: `${year}-04-21`, type: "Bank Holiday" },
      { name: "Early May Bank Holiday", date: `${year}-05-05`, type: "Bank Holiday" },
      { name: "Spring Bank Holiday", date: `${year}-05-26`, type: "Bank Holiday" },
      { name: "Summer Bank Holiday", date: `${year}-08-25`, type: "Bank Holiday" },
      { name: "Christmas Day", date: `${year}-12-25`, type: "Bank Holiday" },
      { name: "Boxing Day", date: `${year}-12-26`, type: "Bank Holiday" }
    ],
    CA: [
      { name: "New Year's Day", date: `${year}-01-01`, type: "Statutory Holiday" },
      { name: "Good Friday", date: `${year}-04-18`, type: "Statutory Holiday" },
      { name: "Victoria Day", date: `${year}-05-19`, type: "Statutory Holiday" },
      { name: "Canada Day", date: `${year}-07-01`, type: "National Holiday" },
      { name: "Labour Day", date: `${year}-09-01`, type: "Statutory Holiday" },
      { name: "Thanksgiving", date: `${year}-10-13`, type: "Statutory Holiday" },
      { name: "Christmas Day", date: `${year}-12-25`, type: "Statutory Holiday" },
      { name: "Boxing Day", date: `${year}-12-26`, type: "Statutory Holiday" }
    ]
  };

  const countryHolidays = staticHolidays[country] || staticHolidays.US;
  const currentDate = new Date();
  const threeMonthsFromNow = new Date();
  threeMonthsFromNow.setMonth(currentDate.getMonth() + 3);

  return countryHolidays
    .filter(holiday => {
      const holidayDate = new Date(holiday.date);
      return holidayDate >= currentDate && holidayDate <= threeMonthsFromNow;
    })
    .map(holiday => ({
      name: holiday.name,
      date: holiday.date,
      description: '',
      type: holiday.type,
      country: ''
    }))
    .slice(0, 8);
}
