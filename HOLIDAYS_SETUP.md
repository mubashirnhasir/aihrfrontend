# Dynamic Holidays Component Setup

The Holidays component now fetches real national holidays from multiple API sources with automatic fallbacks.

## Features

✅ **Multiple API Sources**: Primary, fallback, and static data sources  
✅ **Country Support**: 8+ countries with localized holidays  
✅ **Real-time Data**: Shows upcoming holidays for the next 3 months  
✅ **Graceful Fallbacks**: Never fails to show holidays  
✅ **Loading States**: Smooth user experience with loading indicators  
✅ **Error Handling**: User-friendly error messages with retry options  

## API Sources (in order of preference)

1. **Local API Route** (`/api/holidays`) - Handles multiple sources server-side
2. **Calendarific API** (Premium, requires API key) - Most comprehensive
3. **Nager.Date API** (Free) - Good coverage for major countries  
4. **Static Fallback** - Hardcoded holidays as final backup

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in your project root:

```bash
# Optional - Get free API key from https://calendarific.com/
NEXT_PUBLIC_HOLIDAYS_API_KEY=your_calendarific_api_key_here
```

### 2. No API Key Required

The component works without any API keys! It will automatically fall back to:
- Free Nager.Date API
- Static holiday data

### 3. With API Key (Recommended)

Get a free API key from [Calendarific](https://calendarific.com/):
- Sign up for free account
- Get your API key  
- Add it to `.env.local`
- Enjoy more accurate and comprehensive holiday data

## Supported Countries

- 🇺🇸 United States (US)
- 🇬🇧 United Kingdom (GB)  
- 🇨🇦 Canada (CA)
- 🇦🇺 Australia (AU)
- 🇮🇳 India (IN)
- 🇩🇪 Germany (DE)
- 🇫🇷 France (FR)
- 🇯🇵 Japan (JP)

## Component Features

### Data Source Indicator
- 🟢 Green dot: Premium API (Calendarific)
- 🟡 Yellow dot: Free API (Nager.Date)  
- 🔵 Blue dot: Local API
- ⚫ Gray dot: Static/Fallback data

### Loading States
- Skeleton loading animation
- "Loading..." text
- Smooth transitions

### Error Handling  
- Automatic fallbacks between APIs
- User-friendly error messages
- Retry functionality

### Responsive Design
- Mobile-friendly layout
- Consistent with existing dashboard design
- Hover effects and animations

## Usage

The component is automatically included in the dashboard. No additional setup required - just add your API key for best results!

```jsx
import Holidays from '@/sections/dashboard/holidays'

// Component automatically handles:
// - API calls
// - Error handling  
// - Loading states
// - Country selection
<Holidays />
```

## Customization

### Change Default Country
Edit the component's initial state:
```javascript
const [country, setCountry] = useState('GB'); // Change to your country
```

### Add More Countries
Update the country selector options and add corresponding static fallback data.

### Modify Display Count
Change the `.slice(0, 6)` to show more/fewer holidays.

## Troubleshooting

### No holidays showing?
1. Check internet connection
2. Verify country code is supported
3. Check browser console for API errors

### API errors?
The component gracefully falls back through multiple data sources, so you should always see some holidays even if external APIs fail.

### Need different holidays?
You can customize the static fallback holidays in the `getFallbackHolidays()` function for your specific needs.
