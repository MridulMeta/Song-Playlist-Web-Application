function getPlaylistFromLocalStorage(key) {
	const data = localStorage.getItem(key);
	return JSON.parse(data) || []; // Parse stored data or return an empty array if not found
}

function savePlaylistToLocalStorage(data, key) {
	localStorage.setItem(key, JSON.stringify(data));
}

function updatePlaylist(songData, key) {
	const playlist = getPlaylistFromLocalStorage('playlist');

	// Ensure songData is an array before attempting to spread it
	if (Array.isArray(songData)) {
		playlist.push(...songData);
	} else {
		playlist.push(songData);
	}

	savePlaylistToLocalStorage(playlist, key);
}

function loadPlaylist() {
	const playlist = getPlaylistFromLocalStorage('playlist');
	displayPlaylist(playlist); // Display the retrieved playlist
}

// Function to handle the response from the server
function handleResponse(songData) {
	updatePlaylist(songData, 'responses');
}

// Function to make a request to the server and handle the response
function getSong() {
	let songName = document.getElementById('song').value;

	if (songName === '') {
		return alert('Please enter a song');
	}

	let xhr = new XMLHttpRequest();
	xhr.onreadystatechange = () => {
		if (xhr.readyState == 4 && xhr.status == 200) {
			let response = JSON.parse(xhr.responseText);
			// Update the playlist and displaying search results
			handleResponse(response);
			clearSearchResults();
			displaySearchResults(response);
		}
		document.getElementById('search-results-heading').innerText = `\nSongs Matching: ${songName}`;
	};

	xhr.open('GET', `/songs?title=${songName}`, true);
	xhr.send();
}

// Function to clear the search results area
function clearSearchResults() {
	document.getElementById('search-results-heading').innerText = '';
	document.getElementById('search-results-table-body').innerHTML = '';
}

function displaySearchResults(songData) {
	// Check if songData is an object with a results array
	if (songData && songData.results && Array.isArray(songData.results)) {
		const tableBody = document.getElementById('search-results-table-body');

		tableBody.innerHTML = '';
		// Iterate over the results array and create table rows
		songData.results.forEach(song => {
			const title = song.trackName;
			const artist = song.artistName;
			const artwork = song.artworkUrl100;

			// Create a table row for the song
			const row = document.createElement('tr');
			row.innerHTML = `
				<td><button class="add-button" onclick="addToPlaylist('${title}', '${artist}', '${artwork}')">+</button></td>
				<td>${title}</td>
				<td>${artist}</td>
				<td><img src="${artwork}" alt="Artwork"></td>
			`;

			tableBody.appendChild(row);
		});
	} else {
		console.error("Invalid song data format:", songData);
	}
}

function addToPlaylist(title, artist, artwork) {
	const playlist = getPlaylistFromLocalStorage('playlist');

	playlist.push({ title, artist, artwork });

	savePlaylistToLocalStorage(playlist, 'playlist');

	const tableBody = document.querySelector(".playlist-table tbody");

	// Create a new table row for the added song
	const newRow = document.createElement("tr");

	// Create the remove button
	const removeButton = document.createElement("button");
	removeButton.textContent = "-";
	removeButton.classList.add("remove-button");

	// Create the up button
	const upButton = document.createElement("button");
	upButton.textContent = "↑";
	upButton.classList.add("up-button");

	// Create the down button
	const downButton = document.createElement("button");
	downButton.textContent = "↓";
	downButton.classList.add("down-button");

	// Create a cell for the action buttons
	const actionCell = document.createElement("td");
	actionCell.appendChild(removeButton);
	actionCell.appendChild(upButton);
	actionCell.appendChild(downButton);

	// Create a cell for the song title
	const titleCell = document.createElement("td");
	titleCell.textContent = title;

	// Create a cell for the artist
	const artistCell = document.createElement("td");
	artistCell.textContent = artist;

	// Create a cell for the artwork
	const artworkCell = document.createElement("td");
	const img = document.createElement("img");
	img.src = artwork;
	img.alt = "Artwork";
	artworkCell.appendChild(img);

	// Append cells to the new row
	newRow.appendChild(actionCell);
	newRow.appendChild(titleCell);
	newRow.appendChild(artistCell);
	newRow.appendChild(artworkCell);

	tableBody.appendChild(newRow);
}

function displayPlaylist(playlist) {
	const tableBody = document.getElementById("playlist-table-body");
	tableBody.innerHTML = "";

	// Loop through each song in the playlist
	playlist.forEach((song, index) => {
		const { title, artist, artwork } = song;
		const row = createPlaylistRow(title, artist, artwork, index);
		tableBody.appendChild(row);
	});
}

function createPlaylistRow(title, artist, artwork) {
	const newRow = document.createElement("tr");

	const playlist = getPlaylistFromLocalStorage('playlist');

	// Create the remove button
	const removeButton = document.createElement("button");
	removeButton.textContent = "-";
	removeButton.classList.add("remove-button");

	// Create the up button
	const upButton = document.createElement("button");
	upButton.textContent = "↑";
	upButton.classList.add("up-button");

	// Create the down button
	const downButton = document.createElement("button");
	downButton.textContent = "↓";
	downButton.classList.add("down-button");

	// Create a cell for the action buttons
	const actionCell = document.createElement("td");
	actionCell.appendChild(removeButton);
	actionCell.appendChild(upButton);
	actionCell.appendChild(downButton);

	// Create a cell for the song title
	const titleCell = document.createElement("td");
	titleCell.textContent = title;

	// Create a cell for the artist
	const artistCell = document.createElement("td");
	artistCell.textContent = artist;

	// Create a cell for the artwork
	const artworkCell = document.createElement("td");
	const img = document.createElement("img");
	img.src = artwork;
	img.alt = "Artwork";
	artworkCell.appendChild(img);

	// Append cells to the new row
	newRow.appendChild(actionCell);
	newRow.appendChild(titleCell);
	newRow.appendChild(artistCell);
	newRow.appendChild(artworkCell);

	return newRow;
}

function removeFromPlaylist(index) {
	const playlist = getPlaylistFromLocalStorage('playlist');

	// Remove the song at the specified index from the playlist
	playlist.splice(index, 1);
	savePlaylistToLocalStorage(playlist, 'playlist');
}

// Function to move a song up in the playlist
function moveUp(index) {
	const playlist = getPlaylistFromLocalStorage('playlist');

	// Check if the song is not already at the top of the playlist
	// then swap the song with the previous song in the playlist
	if (index > 0) {
		const temp = playlist[index];
		playlist[index] = playlist[index - 1];
		playlist[index - 1] = temp;

		savePlaylistToLocalStorage(playlist, 'playlist');

		const tableBody = document.querySelector('.playlist-table tbody');
		const rows = tableBody.querySelectorAll('tr');
		const currentRow = rows[index];
		const previousRow = rows[index - 1];

		// Make sure both rows are valid before moving
		if (currentRow && previousRow) {
			tableBody.insertBefore(currentRow, previousRow);
		}
	}
}

// Function to move a song down in the playlist
function moveDown(index) {
	const playlist = getPlaylistFromLocalStorage('playlist');
	const lastIndex = playlist.length - 1;

	// Check if the song is not already at the bottom of the playlist
	if (index < lastIndex) {
		// Swap the song with the next song in the playlist
		const temp = playlist[index];
		playlist[index] = playlist[index + 1];
		playlist[index + 1] = temp;

		savePlaylistToLocalStorage(playlist, 'playlist');

		const tableBody = document.querySelector('.playlist-table tbody');
		const rows = tableBody.querySelectorAll('tr');
		const currentRow = rows[index];
		const nextRow = rows[index + 1];

		if (currentRow && nextRow) {
			// If the next row is the last row, append the current row after it
			if (index === lastIndex - 1) {
				tableBody.appendChild(currentRow);
			} else {
				// Otherwise, insert the current row before the next row
				tableBody.insertBefore(currentRow, nextRow.nextElementSibling);
			}
		}
	}
}

// Function to handle key press events
function handleKeyUp(event) {
	event.preventDefault();
	if (event.keyCode === 13) {
		document.getElementById("submit_button").click();
	}
}
