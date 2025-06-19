// Image Search App - Complete JavaScript Implementation
class ImageSearchApp {
    constructor() {
        // Configuration
        this.API_KEY = 'z9Dl9y9DlWc6rh-CCp9KEEdeh-XQHVF9qbcSoOl--h0'; // Replace with your Unsplash API key
        this.API_URL = 'https://api.unsplash.com/search/photos';
        this.IMAGES_PER_PAGE = 20;
        this.MAX_IMAGES = 1000;
        
        // State management
        this.currentQuery = '';
        this.currentPage = 1;
        this.totalImages = 0;
        this.loadedImages = new Set();
        this.favorites = new Set();
        this.isLoading = false;
        this.searchTimeout = null;
        
        // DOM elements
        this.initializeElements();
        
        // Event listeners
        this.initializeEventListeners();
        
        // Initialize app
        this.initializeApp();
    }
    
    initializeElements() {
        // Search elements
        this.searchInput = document.getElementById('searchInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.refreshBtn = document.getElementById('refreshBtn');
        this.clearBtn = document.getElementById('clearBtn');
        
        // Display elements
        this.imageGrid = document.getElementById('imageGrid');
        this.loading = document.getElementById('loading');
        this.errorMessage = document.getElementById('errorMessage');
        this.errorText = document.getElementById('errorText');
        this.noResults = document.getElementById('noResults');
        this.retryBtn = document.getElementById('retryBtn');
        
        // Info elements
        this.resultsInfo = document.getElementById('resultsInfo');
        this.resultsCount = document.getElementById('resultsCount');
        this.favoritesBtn = document.getElementById('favoritesBtn');
        this.favoritesCount = document.getElementById('favoritesCount');
        
        // Load more
        this.loadMoreContainer = document.getElementById('loadMoreContainer');
        this.loadMoreBtn = document.getElementById('loadMoreBtn');
        
        // Theme toggle
        this.themeSwitch = document.getElementById('theme-switch');
        
        // Modals
        this.favoritesModal = document.getElementById('favoritesModal');
        this.closeFavoritesModal = document.getElementById('closeFavoritesModal');
        this.favoritesGrid = document.getElementById('favoritesGrid');
        this.emptyFavorites = document.getElementById('emptyFavorites');
        
        this.imageModal = document.getElementById('imageModal');
        this.closeImageModal = document.getElementById('closeImageModal');
        this.imagePreview = document.getElementById('imagePreview');
    }
    
    initializeEventListeners() {
        // Search functionality
        this.searchBtn.addEventListener('click', () => this.handleSearch());
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSearch();
        });
        
        // Debounced search on input
        this.searchInput.addEventListener('input', () => {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => {
                if (this.searchInput.value.trim()) {
                    this.handleSearch();
                }
            }, 500);
        });
        
        // Action buttons
        this.refreshBtn.addEventListener('click', () => this.refreshResults());
        this.clearBtn.addEventListener('click', () => this.clearResults());
        this.retryBtn.addEventListener('click', () => this.handleSearch());
        
        // Load more
        this.loadMoreBtn.addEventListener('click', () => this.loadMoreImages());
        
        // Theme toggle
        this.themeSwitch.addEventListener('change', () => this.toggleTheme());
        
        // Favorites
        this.favoritesBtn.addEventListener('click', () => this.showFavorites());
        this.closeFavoritesModal.addEventListener('click', () => this.closeFavoritesModalHandler());
        
        // Image modal
        this.closeImageModal.addEventListener('click', () => this.closeImageModalHandler());
        
        // Modal background clicks
        this.favoritesModal.addEventListener('click', (e) => {
            if (e.target === this.favoritesModal) this.closeFavoritesModalHandler();
        });
        
        this.imageModal.addEventListener('click', (e) => {
            if (e.target === this.imageModal) this.closeImageModalHandler();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeFavoritesModalHandler();
                this.closeImageModalHandler();
            }
        });
        
        // Infinite scroll
        window.addEventListener('scroll', () => this.handleScroll());
    }
    
    initializeApp() {
        // Load theme preference
        this.loadTheme();
        
        // Load favorites from localStorage (using memory storage instead)
        this.loadFavorites();
        
        // Update favorites count
        this.updateFavoritesCount();
        
        // Focus on search input
        this.searchInput.focus();
        
        // Show sample search on load
        this.showSampleSearches();
    }
    
    showSampleSearches() {
        const samples = ['nature', 'dogs', 'space', 'architecture', 'food', 'travel'];
        const randomSample = samples[Math.floor(Math.random() * samples.length)];
        this.searchInput.placeholder = `Search for images... (e.g., ${randomSample})`;
    }
    
    async handleSearch() {
        const query = this.searchInput.value.trim();
        if (!query) {
            this.showError('Please enter a search term');
            return;
        }
        
        // Reset for new search
        if (query !== this.currentQuery) {
            this.currentQuery = query;
            this.currentPage = 1;
            this.loadedImages.clear();
            this.clearGrid();
        }
        
        await this.searchImages(query);
    }
    
    async searchImages(query, page = 1) {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.showLoading();
        this.hideError();
        this.hideNoResults();
        
        try {
            const response = await fetch(
                `${this.API_URL}?query=${encodeURIComponent(query)}&page=${page}&per_page=${this.IMAGES_PER_PAGE}&client_id=${this.API_KEY}`
            );
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status} - ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (data.results.length === 0 && page === 1) {
                this.showNoResults();
                return;
            }
            
            // Filter out duplicates
            const newImages = data.results.filter(img => !this.loadedImages.has(img.id));
            
            // Add to loaded set
            newImages.forEach(img => this.loadedImages.add(img.id));
            
            if (page === 1) {
                this.totalImages = Math.min(data.total, this.MAX_IMAGES);
                this.displayImages(newImages, true);
            } else {
                this.displayImages(newImages, false);
            }
            
            this.updateResultsInfo();
            this.updateLoadMoreButton();
            
        } catch (error) {
            console.error('Search error:', error);
            this.showError(error.message || 'Failed to fetch images. Please try again.');
        } finally {
            this.isLoading = false;
            this.hideLoading();
        }
    }
    
    displayImages(images, clearGrid = false) {
        if (clearGrid) {
            this.imageGrid.innerHTML = '';
        }
        
        images.forEach(image => {
            const imageCard = this.createImageCard(image);
            this.imageGrid.appendChild(imageCard);
        });
        
        // Lazy load images
        this.lazyLoadImages();
    }
    
    createImageCard(image) {
        const card = document.createElement('div');
        card.className = 'image-card';
        card.innerHTML = `
            <div class="image-container">
                <img 
                    data-src="${image.urls.regular}" 
                    alt="${image.alt_description || 'Unsplash image'}"
                    class="lazy-image"
                    loading="lazy"
                />
                <div class="image-overlay">
                    <button class="overlay-btn favorite-btn ${this.favorites.has(image.id) ? 'active' : ''}" 
                            data-id="${image.id}" title="Add to favorites">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="overlay-btn download-btn" data-url="${image.links.download}" title="Download">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="overlay-btn view-btn" data-image='${JSON.stringify(image)}' title="View full size">
                        <i class="fas fa-expand"></i>
                    </button>
                </div>
            </div>
            <div class="image-info">
                <h3 class="image-title">${image.alt_description || 'Untitled'}</h3>
                <p class="image-description">${image.description || 'No description available'}</p>
                <div class="image-meta">
                    <div class="photographer">
                        <img src="${image.user.profile_image.small}" alt="${image.user.name}" class="photographer-avatar">
                        <span>${image.user.name}</span>
                    </div>
                    <div class="image-stats">
                        <span class="stat">
                            <i class="fas fa-heart"></i>
                            ${this.formatNumber(image.likes)}
                        </span>
                        <span class="stat">
                            <i class="fas fa-download"></i>
                            ${this.formatNumber(image.downloads || 0)}
                        </span>
                    </div>
                </div>
            </div>
        `;
        
        // Add event listeners
        this.addCardEventListeners(card, image);
        
        return card;
    }
    
    addCardEventListeners(card, image) {
        // Favorite button
        const favoriteBtn = card.querySelector('.favorite-btn');
        favoriteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleFavorite(image, favoriteBtn);
        });
        
        // Download button
        const downloadBtn = card.querySelector('.download-btn');
        downloadBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.downloadImage(image);
        });
        
        // View button
        const viewBtn = card.querySelector('.view-btn');
        viewBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.viewImage(image);
        });
        
        // Card click for preview
        card.addEventListener('click', () => {
            this.viewImage(image);
        });
    }
    
    lazyLoadImages() {
        const lazyImages = document.querySelectorAll('.lazy-image:not(.loaded)');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                    
                    img.onload = () => {
                        img.style.opacity = '1';
                    };
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    toggleFavorite(image, button) {
        if (this.favorites.has(image.id)) {
            this.favorites.delete(image.id);
            button.classList.remove('active');
        } else {
            this.favorites.add(image.id);
            // Store full image data for favorites
            this.favoriteImages = this.favoriteImages || new Map();
            this.favoriteImages.set(image.id, image);
            button.classList.add('active');
        }
        
        this.updateFavoritesCount();
        this.saveFavorites();
        
        // Animation feedback
        button.style.animation = 'pulse 0.3s ease';
        setTimeout(() => {
            button.style.animation = '';
        }, 300);
    }
    
    downloadImage(image) {
        // Create download link
        const link = document.createElement('a');
        link.href = image.urls.full;
        link.download = `unsplash-${image.id}.jpg`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Track download
        if (image.links.download_location) {
            fetch(`${image.links.download_location}?client_id=${this.API_KEY}`);
        }
    }
    
    viewImage(image) {
        this.imagePreview.innerHTML = `
            <img src="${image.urls.regular}" alt="${image.alt_description}" class="preview-image">
            <div class="preview-info">
                <h2>${image.alt_description || 'Untitled'}</h2>
                <p>${image.description || 'No description available'}</p>
                <div class="preview-meta">
                    <p><strong>Photographer:</strong> ${image.user.name}</p>
                    <p><strong>Likes:</strong> ${this.formatNumber(image.likes)}</p>
                    <p><strong>Downloads:</strong> ${this.formatNumber(image.downloads || 0)}</p>
                    <p><strong>Size:</strong> ${image.width} × ${image.height}</p>
                </div>
                <div class="preview-actions">
                    <a href="${image.links.html}" target="_blank" class="action-btn">
                        <i class="fas fa-external-link-alt"></i> View on Unsplash
                    </a>
                    <button class="action-btn download-btn" onclick="app.downloadImage(${JSON.stringify(image).replace(/"/g, '&quot;')})">
                        <i class="fas fa-download"></i> Download
                    </button>
                </div>
            </div>
        `;
        
        this.imageModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    async refreshResults() {
        if (!this.currentQuery) {
            this.showError('No search query to refresh');
            return;
        }
        
        this.currentPage = 1;
        this.loadedImages.clear();
        await this.searchImages(this.currentQuery);
    }
    
    clearResults() {
        this.currentQuery = '';
        this.currentPage = 1;
        this.totalImages = 0;
        this.loadedImages.clear();
        this.clearGrid();
        this.hideResultsInfo();
        this.hideLoadMore();
        this.hideError();
        this.hideNoResults();
        this.searchInput.value = '';
        this.searchInput.focus();
    }
    
    async loadMoreImages() {
        if (this.loadedImages.size >= this.totalImages) return;
        
        this.currentPage++;
        await this.searchImages(this.currentQuery, this.currentPage);
    }
    
    handleScroll() {
        if (this.isLoading || this.loadedImages.size >= this.totalImages) return;
        
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        
        if (scrollTop + clientHeight >= scrollHeight - 1000) {
            this.loadMoreImages();
        }
    }
    
    showFavorites() {
        if (this.favorites.size === 0) {
            this.emptyFavorites.style.display = 'block';
            this.favoritesGrid.style.display = 'none';
        } else {
            this.emptyFavorites.style.display = 'none';
            this.favoritesGrid.style.display = 'grid';
            this.displayFavorites();
        }
        
        this.favoritesModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    displayFavorites() {
        this.favoritesGrid.innerHTML = '';
        
        if (this.favoriteImages) {
            this.favorites.forEach(id => {
                const image = this.favoriteImages.get(id);
                if (image) {
                    const card = this.createImageCard(image);
                    this.favoritesGrid.appendChild(card);
                }
            });
        }
    }
    
    closeFavoritesModalHandler() {
        this.favoritesModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    closeImageModalHandler() {
        this.imageModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    toggleTheme() {
        const isDark = this.themeSwitch.checked;
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        this.saveTheme(isDark);
    }
    
    loadTheme() {
        // Using in-memory storage instead of localStorage
        this.themePreference = this.themePreference || 'light';
        const isDark = this.themePreference === 'dark';
        this.themeSwitch.checked = isDark;
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    }
    
    saveTheme(isDark) {
        this.themePreference = isDark ? 'dark' : 'light';
    }
    
    loadFavorites() {
        // Using in-memory storage instead of localStorage
        this.favorites = new Set();
        this.favoriteImages = new Map();
    }
    
    saveFavorites() {
        // In a real app, this would save to localStorage
        // For demo purposes, we'll just keep in memory
    }
    
    updateFavoritesCount() {
        this.favoritesCount.textContent = this.favorites.size;
    }
    
    updateResultsInfo() {
        this.resultsCount.textContent = `Found ${this.formatNumber(this.totalImages)} images for "${this.currentQuery}"`;
        this.showResultsInfo();
    }
    
    updateLoadMoreButton() {
        if (this.loadedImages.size >= this.totalImages) {
            this.hideLoadMore();
        } else {
            this.showLoadMore();
            const remaining = this.totalImages - this.loadedImages.size;
            this.loadMoreBtn.innerHTML = `
                <i class="fas fa-plus"></i>
                Load More Images (${this.formatNumber(remaining)} remaining)
            `;
        }
    }
    
    // Utility methods
    formatNumber(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    }
    
    // Show/Hide methods
    showLoading() {
        this.loading.style.display = 'block';
    }
    
    hideLoading() {
        this.loading.style.display = 'none';
    }
    
    showError(message) {
        this.errorText.textContent = message;
        this.errorMessage.style.display = 'block';
    }
    
    hideError() {
        this.errorMessage.style.display = 'none';
    }
    
    showNoResults() {
        this.noResults.style.display = 'block';
    }
    
    hideNoResults() {
        this.noResults.style.display = 'none';
    }
    
    showResultsInfo() {
        this.resultsInfo.style.display = 'flex';
    }
    
    hideResultsInfo() {
        this.resultsInfo.style.display = 'none';
    }
    
    showLoadMore() {
        this.loadMoreContainer.style.display = 'block';
    }
    
    hideLoadMore() {
        this.loadMoreContainer.style.display = 'none';
    }
    
    clearGrid() {
        this.imageGrid.innerHTML = '';
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ImageSearchApp();
});

// Service Worker for caching (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(error => console.log('SW registration failed'));
    });
}