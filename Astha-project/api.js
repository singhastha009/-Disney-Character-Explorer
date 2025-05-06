// Function to look up characters by their name, film, or TV show
async function searchCharacters(query, criterion) {
    try {
        let url;

        // Create the URL based on the given search criterion
        switch (criterion) {
            case 'name':
                // Search by character's name
                url = `https://api.disneyapi.dev/character?name=${encodeURIComponent(query)}`;
                break;
            case 'film':
                // Search by the title of a film
                url = `https://api.disneyapi.dev/character?films=${encodeURIComponent(query)}`;
                break;
            case 'tvShow':
                // Search by the title of a TV show
                url = `https://api.disneyapi.dev/character?tvShows=${encodeURIComponent(query)}`;
                break;
            default:
                // Throw an error if the criterion is invalid
                throw new Error('Invalid search criterion.');
        }

        // Make a request to the constructed URL
        const response = await fetch(url);

        // Check if the request was successful (status code 200-299)
        if (!response.ok) {
            throw new Error("Network response was not ok!");
        }

        // Parse the response as JSON
        const data = await response.json();

        // Verify if the response contains character data
        if (data && data.data) {
            // Make sure data.data is an array; if not, convert it to an array
            return Array.isArray(data.data) ? data.data : [data.data];
        } else {
            // Throw an error if no characters are found or the response format is unexpected
            throw new Error('No characters found or API response format is incorrect.');
        }
    } catch (error) {
        // Log any errors that occur during the request
        console.log("Error searching characters!", error);
        throw error;  // Re-throw the error for handling by the calling function
    }
}

// Function to retrieve character details by ID
async function getCharacterDetails(id) {
    try {
        // Request data for a specific character by their ID
        const response = await fetch(`https://api.disneyapi.dev/character/${id}`);

        // Check if the request was successful (status code 200-299)
        if (!response.ok) {
            throw new Error("Network response was not ok!");
        }

        // Parse the response as JSON
        const data = await response.json();
        return data;  // Return the details of the character
    } catch (error) {
        // Log any errors that occur during the request
        console.log("Error fetching character details!", error);
        throw error;  // Re-throw the error for handling by the calling function
    }
}

// Function to retrieve all films and TV shows
async function getFilmsAndTvShows() {
    try {
        // Request a list of all characters to extract films and TV shows
        const response = await fetch(`https://api.disneyapi.dev/character`);

        // Check if the request was successful (status code 200-299)
        if (!response.ok) {
            throw new Error("Network response was not ok!");
        }

        // Parse the response as JSON
        const data = await response.json();
        const films = new Set();  // Use a Set to ensure film titles are unique
        const tvShows = new Set();  // Use a Set to ensure TV show titles are unique

        // Loop through each character to extract films and TV shows
        data.data.forEach(character => {
            if (character.films) {
                // Add each film to the films Set
                character.films.forEach(film => films.add(film));
            }
            if (character.tvShows) {
                // Add each TV show to the tvShows Set
                character.tvShows.forEach(show => tvShows.add(show));
            }
        });

        // Convert Sets to arrays and return them as an object
        return { films: Array.from(films), tvShows: Array.from(tvShows) };
    } catch (error) {
        // Log any errors that occur during the request
        console.log("Error fetching films and TV shows!", error);
        throw error;  // Re-throw the error for handling by the calling function
    }
}

// Export functions to be used in other modules
export {
    searchCharacters,
    getCharacterDetails,
    getFilmsAndTvShows
};
