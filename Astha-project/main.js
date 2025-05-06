import { searchCharacters, getFilmsAndTvShows } from './api.js';

// This event listener executes after the DOM content has been fully loaded
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Retrieve the lists of movies and TV shows from the API
        const { films, tvShows } = await getFilmsAndTvShows();
        
        // Fill the dropdown menus for movies and TV shows with the retrieved data
        populateDropdown('film', films);
        populateDropdown('tvShow', tvShows);
    } catch (error) {
        // Log any issues that occur while fetching movies and TV shows
        console.error('Failed to load movies and TV shows:', error);
    }
});

// Function that handles the search functionality
async function performSearch() {
    // Get the search query and selected criterion from the input fields
    const query = document.getElementById('search-input').value;
    const criterion = document.getElementById('search-criterion').value;

    try {
        // Request the API to search for characters using the provided query and criterion
        const characters = await searchCharacters(query, criterion);

        // Check if characters are found and show them, or display an error message if none are found
        if (characters && characters.length > 0) {
            displayResults(characters);  // Pass the list of characters to the displayResults function
        } else {
            // Show an error message if no characters are found or the API response is not as expected
            displayError('No characters found or the API response is incorrect.');
        }
    } catch (error) {
        // Show an error message if the search process encounters issues
        displayError(error.message);
    }
}

// Attach an event handler to the search button
document.getElementById('search-btn').addEventListener('click', performSearch);

// Attach an event handler to the search input field to handle Enter key presses
document.getElementById('search-input').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();  // Prevent the default form submission behavior on Enter key press
        performSearch();  // Execute the search function
    }
});

// Function to populate dropdown menus with provided options
function populateDropdown(type, items) {
    // Select the dropdown element based on the type (e.g., 'film-dropdown' or 'tvShow-dropdown')
    const dropdown = document.getElementById(`${type}-dropdown`);
    
    // Clear existing options and add a default placeholder
    dropdown.innerHTML = '<option value="">Select an Option</option>';
    
    // Create and add an option element for each item
    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item;
        option.textContent = item;
        dropdown.appendChild(option);  // Add the option to the dropdown menu
    });
}

// Function to render search results
function displayResults(characters) {
    // Select the container where results will be shown
    const resultDiv = document.getElementById('result');
    
    // Remove any previous results
    resultDiv.innerHTML = '';

    // Create and append a div for each character
    characters.forEach(character => {
        const characterDiv = document.createElement('div');
        characterDiv.classList.add(
            'character', 
            'bg-white', 
            'p-4', 
            'rounded-lg', 
            'shadow-md', 
            'transition-transform', 
            'transform', 
            'hover:scale-105', 
            'flex', 
            'flex-col', 
            'items-center', 
            'text-center'
        );
        
        // Provide fallback values if character details are missing
        const imageUrl = character.imageUrl || 'https://via.placeholder.com/150?text=No+Image';  // Placeholder image
        const name = character.name || 'No Name';  // Default name
        const films = character.films ? character.films.join(', ') : 'No Films';  // Default films list
        const tvShows = character.tvShows ? character.tvShows.join(', ') : 'No TV Shows';  // Default TV shows list
        const sourceUrl = character.sourceUrl || '#';  // Default link

        // Set the HTML content for the character container
        characterDiv.innerHTML = `
            <img src="${imageUrl}" alt="${name}" class="w-32 h-32 object-cover rounded-full mb-4 shadow-lg" />
            <h2 class="text-2xl font-bold text-gray-800 mb-2">${name}</h2>
            <p class="text-gray-600 mb-2">Films: ${films}</p>
            <p class="text-gray-600 mb-4">TV Shows: ${tvShows}</p>
            <a href="${sourceUrl}" target="_blank" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50">More Info</a>
        `;
        resultDiv.appendChild(characterDiv);  // Add the character container to the results section
    });
}

// Function to show an error message
function displayError(errorMessage) {
    // Select the container where the error message will be shown
    const resultDiv = document.getElementById('result');
    
    // Set the HTML content to display the error message
    resultDiv.innerHTML = `<p class="text-red-500 font-semibold">${errorMessage}</p>`;
}
