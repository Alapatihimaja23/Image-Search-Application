# Image Search App

A modern, feature-rich image search application built with vanilla HTML, CSS, and JavaScript that allows users to search and discover high-quality images using the Unsplash API.

## 🌟 Features

- **Real-time Image Search**: Search through millions of high-quality images from Unsplash
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Infinite Scroll**: Automatically loads more images as you scroll
- **Favorites System**: Save your favorite images for quick access
- **Image Preview Modal**: Click on any image to view it in full size with details
- **Download Images**: Direct download functionality for original images
- **Dark/Light Theme**: Toggle between dark and light modes
- **Lazy Loading**: Images load only when needed for better performance
- **Debounced Search**: Smart search with input debouncing to reduce API calls
- **Error Handling**: Graceful error handling with user-friendly messages
- **Loading States**: Smooth loading animations and visual feedback
- **Photographer Attribution**: Display photographer information and stats
- **Keyboard Shortcuts**: ESC key to close modals
- **Sample Search Suggestions**: Random placeholder suggestions for inspiration



## 🛠️ Technologies Used

- **HTML5** - Semantic markup and structure
- **CSS3** - Modern styling with CSS Grid, Flexbox, and custom properties
- **Vanilla JavaScript (ES6+)** - Complete functionality without frameworks
- **Unsplash API** - High-quality image data source
- **Intersection Observer API** - Lazy loading implementation
- **CSS Animations** - Smooth transitions and micro-interactions

## 📋 Prerequisites

Before running this project, make sure you have:

- A modern web browser (Chrome, Firefox, Safari, Edge)
- An Unsplash API key (free)
- A local web server (optional but recommended)

## 🚀 Installation & Setup

1. **Clone or Download the repository**
   ```bash
   git clone https://github.com/yourusername/image-search-app.git
   cd image-search-app
   ```

2. **Get your Unsplash API key**
   - Go to [Unsplash Developers](https://unsplash.com/developers)
   - Create an account or log in
   - Click "New Application"
   - Fill in the application details
   - Accept the terms and conditions
   - Copy your "Access Key"

3. **Configure the API key**
   - Open `script.js` file
   - Replace the API_KEY value with your Unsplash access key:
   ```javascript
   this.API_KEY = 'your_unsplash_access_key_here';
   ```

4. **Run the application**
   - **Option 1**: Simply open `index.html` in your browser
   - **Option 2**: Use a local server (recommended):
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js (if you have http-server installed)
     npx http-server
     
     # Using PHP
     php -S localhost:8000
     ```
   - Navigate to `http://localhost:8000` in your browser

## 📁 Project Structure

```
image-search-app/
├── index.html          # Main HTML file
├── style.css           # Complete CSS styling
├── script.js           # Main JavaScript application
├── README.md           # Project documentation



## 🎯 Usage

1. **Search Images**: 
   - Enter keywords in the search bar
   - Press Enter or click the search button
   - Auto-search triggers after 500ms of typing

2. **Browse Results**: 
   - Scroll through the responsive image grid
   - Images load automatically as you scroll (infinite scroll)

3. **Image Actions**:
   - **View**: Click on any image to open full-size preview
   - **Favorite**: Click the heart icon to add/remove favorites
   - **Download**: Click the download icon to save the image

4. **Theme Toggle**: 
   - Use the theme switch in the header to toggle dark/light mode

5. **Favorites**: 
   - Click the favorites button to view saved images
   - Access your favorites anytime from the modal

6. **Additional Features**:
   - **Refresh**: Reload current search results
   - **Clear**: Clear all results and start fresh
   - **Load More**: Manual load more button (also auto-loads on scroll)

## ⚙️ Configuration

### API Settings
You can modify these settings in `script.js`:

```javascript
this.API_KEY = 'your_api_key_here';        // Your Unsplash API key
this.IMAGES_PER_PAGE = 20;                 // Images per API request
this.MAX_IMAGES = 1000;                    // Maximum images to load per search
```

### Search Behavior
```javascript
this.searchTimeout = setTimeout(() => {
    // Auto-search delay (500ms)
}, 500);
```

## 🎨 Customization

### Styling
- Modify `style.css` to change colors, fonts, and layout
- The app uses CSS custom properties for easy theming
- Responsive breakpoints can be adjusted in the media queries

### Functionality
- Add new features by extending the `ImageSearchApp` class
- Modify search parameters in the API calls
- Customize image card layout and information display

## 🔧 Key Features Implementation

### Class-Based Architecture
The app uses a single `ImageSearchApp` class that manages:
- API interactions
- DOM manipulation
- State management
- Event handling

### Smart Loading
- **Lazy Loading**: Images load only when visible using Intersection Observer
- **Infinite Scroll**: Automatic loading on scroll
- **Debounced Search**: Prevents excessive API calls

### Modern JavaScript Features
- ES6+ classes and methods
- Async/await for API calls
- Template literals for dynamic HTML
- Set and Map data structures for efficient data management

### Responsive Design
- CSS Grid for image layout
- Flexbox for component alignment
- Mobile-first responsive design
- Touch-friendly interface

## 🌐 API Integration

The app integrates with Unsplash API using these endpoints:

- **Search Photos**: `/search/photos` - Main search functionality
- **Download Tracking**: `/photos/{id}/download` - Track downloads

### API Response Handling
- Error handling for network issues
- Rate limiting awareness
- Response validation and filtering

## 🎭 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

### Required Browser Features
- ES6+ JavaScript support
- Intersection Observer API
- CSS Grid and Flexbox
- Fetch API

## 🐛 Troubleshooting

### Common Issues

**Images not loading**
- Check your API key is valid and properly set
- Verify internet connection
- Check browser console for error messages

**Search not working**
- Ensure API key is correctly configured
- Check for JavaScript errors in console
- Verify Unsplash API is accessible

**Layout issues**
- Clear browser cache
- Check CSS is loading properly
- Verify viewport meta tag is present

**Performance issues**
- Reduce `IMAGES_PER_PAGE` value
- Check for memory leaks in browser dev tools
- Ensure lazy loading is working

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request



## 🙏 Acknowledgments

- [Unsplash](https://unsplash.com) for providing the amazing free image API
- [FontAwesome](https://fontawesome.com) for the beautiful icons
- All the talented photographers on Unsplash who make their work freely available

## 📞 Contact

Your Name - Himaja Alapati

Project Link: [https://github.com/yourusername/image-search-app](https://github.com/Alapatihimaja23/image-search-app)

## 🔮 Future Enhancements

- [ ] User authentication and personal collections
- [ ] Advanced search filters (color, orientation, category)
- [ ] Image editing capabilities
- [ ] Offline support with PWA features
- [ ] Social sharing functionality
- [ ] Image comparison tool
- [ ] Bulk download feature
- [ ] Search history
- [ ] Auto-generated image tags
- [ ] Integration with cloud storage services

## 📊 Performance Features

- **Lazy Loading**: Reduces initial load time
- **Image Optimization**: Multiple image sizes from Unsplash
- **Debounced Search**: Reduces API calls
- **Memory Management**: Efficient data structures
- **CSS Animations**: Hardware-accelerated transitions
- **Intersection Observer**: Efficient scroll detection

---

Made with ❤️ By Himaja Alapati 