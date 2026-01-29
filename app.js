// TMDb API Configuration
const API_KEY = 'f33afbb7fa651d56205f15cc81695e75'; // Users need to replace this with their own API key
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// State management
let currentMovies = [];
let currentSort = 'popularity';
let currentGenre = 'all';
let allGenres = [];

// DOM Elements
const movieGrid = document.getElementById('movie-grid');
const searchInput = document.getElementById('movie-search');
const searchButton = document.getElementById('search-button');

// Initialize the app
async function init() {
    // Check if API key is set
    if (API_KEY === 'f33afbb7fa651d56205f15cc81695e75') {
        showApiKeyMessage();
        return;
    }
    
    await loadGenres();
    createControlsUI();
    await loadPopularMovies();
    setupEventListeners();
}

// Show message when API key is not configured
function showApiKeyMessage() {
    movieGrid.innerHTML = `
        <div class="api-message">
            <h2>🎬 TMDb API Key Required</h2>
            <p>To use VibeFlix, you need a free API key from The Movie Database (TMDb).</p>
            <ol>
                <li>Visit <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noopener">themoviedb.org/settings/api</a></li>
                <li>Create a free account and request an API key</li>
                <li>Replace 'YOUR_TMDB_API_KEY_HERE' in app.js with your key</li>
            </ol>
        </div>
    `;
}

// Load genres from TMDb
async function loadGenres() {
    try {
        const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
        const data = await response.json();
        allGenres = data.genres || [];
    } catch (error) {
        console.error('Error loading genres:', error);
        allGenres = [];
    }
}

// Create sorting and filtering controls
function createControlsUI() {
    const controlsContainer = document.createElement('div');
    controlsContainer.id = 'controls-container';
    controlsContainer.className = 'controls-container';
    
    // Sort dropdown
    const sortContainer = document.createElement('div');
    sortContainer.className = 'control-group';
    sortContainer.innerHTML = `
        <label for="sort-select" class="control-label">
            <span class="control-icon">📊</span>
            Sort by:
        </label>
        <select id="sort-select" class="control-select" aria-label="Sort movies">
            <option value="popularity">Popularity</option>
            <option value="rating">Rating</option>
            <option value="release_date">Release Date</option>
            <option value="title">Title (A-Z)</option>
        </select>
    `;
    
    // Genre dropdown
    const genreContainer = document.createElement('div');
    genreContainer.className = 'control-group';
    genreContainer.innerHTML = `
        <label for="genre-select" class="control-label">
            <span class="control-icon">🎭</span>
            Genre:
        </label>
        <select id="genre-select" class="control-select" aria-label="Filter by genre">
            <option value="all">All Genres</option>
        </select>
    `;
    
    // Add genre options
    const genreSelect = genreContainer.querySelector('#genre-select');
    allGenres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre.id;
        option.textContent = genre.name;
        genreSelect.appendChild(option);
    });
    
    controlsContainer.appendChild(sortContainer);
    controlsContainer.appendChild(genreContainer);
    
    // Insert controls before movie grid
    const contentArea = document.getElementById('content-area');
    contentArea.insertBefore(controlsContainer, movieGrid);
    
    // Setup control event listeners
    document.getElementById('sort-select').addEventListener('change', handleSortChange);
    document.getElementById('genre-select').addEventListener('change', handleGenreChange);
}

// Setup event listeners
function setupEventListeners() {
    searchButton.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
}

// Handle search
async function handleSearch() {
    const query = searchInput.value.trim();
    
    if (!query) {
        await loadPopularMovies();
        return;
    }
    
    try {
        showLoading();
        const response = await fetch(
            `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&include_adult=false`
        );
        const data = await response.json();
        currentMovies = data.results || [];
        applySortAndFilter();
    } catch (error) {
        console.error('Error searching movies:', error);
        showError('Failed to search movies. Please try again.');
    }
}

// Load popular movies
async function loadPopularMovies() {
    try {
        showLoading();
        const response = await fetch(
            `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=1`
        );
        const data = await response.json();
        currentMovies = data.results || [];
        applySortAndFilter();
    } catch (error) {
        console.error('Error loading popular movies:', error);
        showError('Failed to load movies. Please check your API key.');
    }
}

// Handle sort change
function handleSortChange(e) {
    currentSort = e.target.value;
    applySortAndFilter();
}

// Handle genre filter change
function handleGenreChange(e) {
    currentGenre = e.target.value;
    applySortAndFilter();
}

// Apply sorting and filtering
function applySortAndFilter() {
    let filteredMovies = [...currentMovies];
    
    // Apply genre filter
    if (currentGenre !== 'all') {
        const genreId = parseInt(currentGenre);
        filteredMovies = filteredMovies.filter(movie => 
            movie.genre_ids && movie.genre_ids.includes(genreId)
        );
    }
    
    // Apply sorting
    filteredMovies.sort((a, b) => {
        switch (currentSort) {
            case 'rating':
                return (b.vote_average || 0) - (a.vote_average || 0);
            case 'release_date':
                return new Date(b.release_date || 0) - new Date(a.release_date || 0);
            case 'title':
                return (a.title || '').localeCompare(b.title || '');
            case 'popularity':
            default:
                return (b.popularity || 0) - (a.popularity || 0);
        }
    });
    
    displayMovies(filteredMovies);
}

// Display movies in grid
function displayMovies(movies) {
    hideProgressBar();
    
    if (!movies || movies.length === 0) {
        movieGrid.innerHTML = `
            <div class="no-results">
                <p class="no-results-icon">🎬</p>
                <p class="no-results-text">No movies found</p>
            </div>
        `;
        return;
    }
    
    movieGrid.innerHTML = movies.map((movie, index) => createMovieCard(movie, index)).join('');
    
    // Add staggered animation with intersection observer for better performance
    const cards = movieGrid.querySelectorAll('.movie-card');
    
    // Use Intersection Observer for fade-in on scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    cards.forEach((card, index) => {
        // Add staggered delay for initial load
        card.style.animationDelay = `${index * 0.05}s`;
        
        // Observe for scroll-triggered animations
        observer.observe(card);
    });
}

// Create movie card HTML
function createMovieCard(movie, index) {
    const posterPath = movie.poster_path 
        ? `${IMAGE_BASE_URL}${movie.poster_path}` 
        : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=300&q=80';
    
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
    const title = movie.title || 'Unknown Title';
    const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : '';
    
    // Get genre names
    const genreNames = movie.genre_ids 
        ? movie.genre_ids
            .map(id => allGenres.find(g => g.id === id)?.name)
            .filter(Boolean)
            .slice(0, 2)
            .join(', ')
        : '';
    
    return `
        <article class="movie-card" 
                 id="movie-${index}" 
                 role="article" 
                 aria-label="${title}"
                 data-movie-id="${movie.id}">
            <div class="movie-poster-container">
                <img src="${posterPath}" 
                     alt="${title} poster" 
                     class="movie-poster" 
                     loading="lazy"
                     onerror="this.src='https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=300&q=80'">
                <div class="movie-overlay">
                    <button class="info-button" onclick="showMovieDetails(${movie.id})" aria-label="View details for ${title}">
                        <span class="info-icon">ℹ️</span>
                        <span class="info-text">Details</span>
                    </button>
                </div>
            </div>
            <div class="movie-info">
                <h3 class="movie-title" title="${title}">${title}</h3>
                ${releaseYear ? `<p class="movie-year">${releaseYear}</p>` : ''}
                ${genreNames ? `<p class="movie-genres">${genreNames}</p>` : ''}
                <div class="movie-rating-container">
                    <span class="movie-rating" aria-label="Rating ${rating} out of 10">
                        <span class="star-icon">⭐</span>
                        <span class="rating-value">${rating}</span>
                    </span>
                </div>
            </div>
        </article>
    `;
}

// Show movie details modal
async function showMovieDetails(movieId) {
    // Show loading modal first
    const loadingModal = document.createElement('div');
    loadingModal.className = 'modal active';
    loadingModal.innerHTML = `
        <div class="modal-content modal-loading">
            <div class="loading-spinner"></div>
            <p class="loading-text">Loading movie details...</p>
        </div>
    `;
    document.body.appendChild(loadingModal);
    
    try {
        const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`);
        const movie = await response.json();
        
        // Remove loading modal
        loadingModal.remove();
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-labelledby', 'modal-title');
        modal.setAttribute('aria-modal', 'true');
        
        const posterPath = movie.poster_path 
            ? `${IMAGE_BASE_URL}${movie.poster_path}` 
            : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=500&q=80';
        
        const backdropPath = movie.backdrop_path 
            ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` 
            : '';
        
        modal.innerHTML = `
            <div class="modal-content" style="${backdropPath ? `background-image: linear-gradient(to bottom, rgba(15, 15, 15, 0.95), rgba(15, 15, 15, 0.98)), url(${backdropPath});` : ''}">
                <button class="modal-close" onclick="closeModal()" aria-label="Close modal">&times;</button>
                <div class="modal-body">
                    <div class="modal-poster">
                        <img src="${posterPath}" alt="${movie.title} poster">
                    </div>
                    <div class="modal-details">
                        <h2 id="modal-title" class="modal-title">${movie.title}</h2>
                        ${movie.tagline ? `<p class="modal-tagline">"${movie.tagline}"</p>` : ''}
                        <div class="modal-meta">
                            <span class="modal-rating">⭐ ${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
                            ${movie.release_date ? `<span class="modal-year">${new Date(movie.release_date).getFullYear()}</span>` : ''}
                            ${movie.runtime ? `<span class="modal-runtime">${movie.runtime} min</span>` : ''}
                        </div>
                        ${movie.genres && movie.genres.length > 0 ? `
                            <div class="modal-genres">
                                ${movie.genres.map(g => `<span class="genre-tag">${g.name}</span>`).join('')}
                            </div>
                        ` : ''}
                        ${movie.overview ? `
                            <div class="modal-overview">
                                <h3>Overview</h3>
                                <p>${movie.overview}</p>
                            </div>
                        ` : ''}
                        ${movie.homepage ? `
                            <a href="${movie.homepage}" target="_blank" rel="noopener" class="modal-link">
                                Visit Official Website →
                            </a>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Trap focus in modal
        const focusableElements = modal.querySelectorAll('button, a');
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        firstFocusable.focus();
        
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
            
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            }
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        setTimeout(() => modal.classList.add('active'), 10);
        
    } catch (error) {
        // Remove any loading modals
        document.querySelectorAll('.modal').forEach(m => m.remove());
        
        console.error('Error loading movie details:', error);
        
        // Show error modal
        const errorModal = document.createElement('div');
        errorModal.className = 'modal active';
        errorModal.innerHTML = `
            <div class="modal-content modal-error">
                <button class="modal-close" onclick="closeModal()" aria-label="Close modal">&times;</button>
                <div class="error-container">
                    <p class="error-icon">⚠️</p>
                    <p class="error-text">Failed to load movie details. Please try again.</p>
                    <button class="retry-button" onclick="closeModal(); showMovieDetails(${movieId})">
                        Retry
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(errorModal);
    }
}

// Close modal
function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}

// Show loading state
function showLoading() {
    showProgressBar();
    const skeletonCount = 12; // Show 12 skeleton cards
    const skeletonCards = Array(skeletonCount).fill(0).map((_, i) => `
        <div class="skeleton-card" style="animation-delay: ${i * 0.05}s">
            <div class="skeleton-poster"></div>
            <div class="skeleton-info">
                <div class="skeleton-title"></div>
                <div class="skeleton-rating"></div>
            </div>
        </div>
    `).join('');
    
    movieGrid.innerHTML = `
        <div class="skeleton-grid" style="grid-column: 1 / -1; display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 25px;">
            ${skeletonCards}
        </div>
    `;
}

// Show progress bar
function showProgressBar() {
    let progressBar = document.getElementById('progress-bar');
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.id = 'progress-bar';
        progressBar.className = 'progress-bar';
        document.body.appendChild(progressBar);
    }
    progressBar.classList.add('active');
}

// Hide progress bar
function hideProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        progressBar.classList.remove('active');
    }
}

// Show error message
function showError(message) {
    hideProgressBar();
    movieGrid.innerHTML = `
        <div class="error-container">
            <p class="error-icon">⚠️</p>
            <p class="error-text">${message}</p>
        </div>
    `;
}

// Make functions globally accessible
window.showMovieDetails = showMovieDetails;
window.closeModal = closeModal;

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
