# 🎬 VibeFlix - Movie Discovery App

A modern, feature-rich movie discovery application powered by The Movie Database (TMDb) API. Search, browse, sort, and explore thousands of movies with a sleek, Netflix-inspired interface.

## ✨ Features

### Core Functionality
- **🔍 Real-time Movie Search**: Search through TMDb's extensive movie database
- **🎭 Genre Filtering**: Filter movies by specific genres (Action, Comedy, Drama, etc.)
- **📊 Multiple Sorting Options**: Sort by popularity, rating, release date, or title
- **🎯 Detailed Movie Information**: Click any movie to view comprehensive details including:
  - Full synopsis
  - Genres and runtime
  - Release year and ratings
  - Movie posters and backdrops
  - Links to official websites

### User Experience
- **🎨 Smooth Animations**: 
  - Staggered card fade-in animations
  - Intersection Observer for scroll-triggered animations
  - Smooth hover effects with scale and glow
  - Progress bar during API calls
- **⚡ Advanced Loading States**: 
  - Skeleton loading cards with shimmer effect
  - Top progress bar with gradient animation
  - Smooth transitions between states
- **📱 Fully Responsive**: Works beautifully on desktop, tablet, and mobile
- **♿ Accessibility Focused**: 
  - Keyboard navigation support
  - ARIA labels and roles
  - Focus indicators
  - Screen reader friendly
  - Skip-to-main-content link
- **❌ Error Handling**: Graceful error messages with retry buttons

### Design Highlights
- Netflix-inspired dark theme with red accent colors
- Glassmorphism effects on controls
- Backdrop blur on modals
- Smooth transitions and micro-interactions
- Professional typography with Poppins font
- Skeleton loading with shimmer animations
- Top progress bar with gradient shimmer
- Enhanced hover effects with scale and glow
- Staggered fade-in animations
- Intersection Observer for performance optimization

## 🚀 Setup Instructions

### Prerequisites
- A free TMDb API key
- A web browser
- A local web server (optional, but recommended)

### Step 1: Get Your TMDb API Key

1. Visit [The Movie Database](https://www.themoviedb.org/)
2. Create a free account (if you don't have one)
3. Go to [Settings > API](https://www.themoviedb.org/settings/api)
4. Request an API key (choose "Developer" option)
5. Fill out the required form
6. Copy your API key

### Step 2: Configure the Application

1. Open `app.js` in your text editor
2. Find this line near the top:
   ```javascript
   const API_KEY = 'YOUR_TMDB_API_KEY_HERE';
   ```
3. Replace `'YOUR_TMDB_API_KEY_HERE'` with your actual API key:
   ```javascript
   const API_KEY = 'your_actual_api_key_here';
   ```
4. Save the file

### Step 3: Run the Application

#### Option A: Using a Local Server (Recommended)

**Using Python:**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Using Node.js:**
```bash
npx serve
```

**Using VS Code:**
- Install the "Live Server" extension
- Right-click on `index.html` and select "Open with Live Server"

Then open your browser and navigate to `http://localhost:8000` (or the port shown)

#### Option B: Direct File Opening
Simply double-click `index.html` to open it in your default browser. Note: Some features may not work due to CORS restrictions.

## 📖 How to Use

### Searching for Movies
1. Type a movie title in the search bar
2. Press Enter or click the "Search" button
3. Results will appear in the grid below

### Sorting Movies
Use the "Sort by" dropdown to organize movies by:
- **Popularity** (default)
- **Rating** (highest to lowest)
- **Release Date** (newest first)
- **Title** (A-Z alphabetically)

### Filtering by Genre
Use the "Genre" dropdown to filter movies by specific genres like Action, Comedy, Drama, Horror, etc.

### Viewing Movie Details
1. Hover over any movie card
2. Click the "Details" button that appears
3. A modal will open showing:
   - Full movie title and tagline
   - Rating, release year, and runtime
   - Genre tags
   - Complete overview/synopsis
   - Link to official website (if available)
4. Click the X button or press Escape to close

## 🛠️ Technical Details

### Technologies Used
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with animations
- **Vanilla JavaScript**: No frameworks required
- **TMDb API**: Movie data source

### Browser Compatibility
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

### File Structure
```
vibeflix/
├── index.html      # Main HTML file
├── styles.css      # All styling and animations
├── app.js          # JavaScript application logic
└── README.md       # This file
```

## 🔧 Customization

### Changing Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --bg-color: #0f0f0f;          /* Background color */
    --card-bg: #1a1a1a;           /* Card background */
    --text-color: #ffffff;        /* Text color */
    --accent-color: #e50914;      /* Accent/brand color */
    --glow-color: rgba(229, 9, 20, 0.6); /* Glow effects */
}
```

### Adjusting Movie Grid
Change the grid layout in `styles.css`:
```css
#movie-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 25px;
}
```

## 🐛 Troubleshooting

### Movies Not Loading
1. Check that you've correctly set your API key in `app.js`
2. Ensure you have an active internet connection
3. Check the browser console (F12) for error messages
4. Verify your API key is valid at themoviedb.org

### CORS Errors
If you see CORS errors:
- Use a local web server instead of opening the file directly
- Try the Python, Node.js, or Live Server options mentioned above

### Images Not Loading
- TMDb images should load automatically
- If not, check your internet connection
- Images use lazy loading for better performance

## 📝 Features Implemented

✅ TMDb API integration  
✅ Real-time search functionality  
✅ Genre-based filtering  
✅ Multiple sorting options (rating, popularity, date, title)  
✅ Detailed movie modal with comprehensive info  
✅ Responsive design (mobile, tablet, desktop)  
✅ Advanced loading animations:
  - Skeleton loading cards with shimmer effect
  - Top progress bar with gradient animation
  - Smooth fade-in effects with Intersection Observer
  - Staggered card animations
  - Enhanced hover effects with scale and glow
✅ Accessibility improvements (ARIA labels, keyboard navigation)  
✅ Professional UI/UX design  
✅ Bug-free implementation  

## 🎯 Future Enhancements

Potential features for future versions:
- User favorites/watchlist
- Movie trailers
- Similar movie recommendations
- Advanced filters (year range, rating range)
- Pagination for search results
- Dark/light theme toggle

## 📄 License

This project uses data from The Movie Database (TMDb) API. This product uses the TMDb API but is not endorsed or certified by TMDb.

## 🙏 Credits

- Movie data provided by [The Movie Database (TMDb)](https://www.themoviedb.org/)
- Font: [Poppins](https://fonts.google.com/specimen/Poppins) by Google Fonts
- Placeholder images from [Unsplash](https://unsplash.com/)

---

**Enjoy discovering movies with VibeFlix! 🍿**
