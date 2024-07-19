// Keep track of currently playing audio
var currentAudio = null;
var isLooping = false;
var audioElements = document.querySelectorAll('audio');
var currentPlaylist = []; // Array to store currently displayed songs

// Initialize the playlist from displayed songs
audioElements.forEach(function(audio) {
    var button = audio.nextElementSibling;
    var songTitle = button.previousElementSibling.previousElementSibling.previousElementSibling.innerText;
    var movieName = button.previousElementSibling.previousElementSibling.innerText;
    var songImg = button.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.src;
    currentPlaylist.push({ audio: audio, button: button, title: songTitle, movie: movieName, image: songImg });
});

function togglePlay(button) {
    var audio = button.previousElementSibling;
    var songTitle = button.previousElementSibling.previousElementSibling.previousElementSibling.innerText;
    var movieName = button.previousElementSibling.previousElementSibling.innerText;
    var songImg = button.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.src;

    if (audio !== currentAudio && currentAudio !== null) {
        currentAudio.pause(); // Pause currently playing audio
        var currentButton = currentAudio.nextElementSibling;
        currentButton.innerHTML = '<img src="play.png" alt="Play Button">'; // Change previous button back to play
    }

    if (audio.paused) {
        audio.play();
        button.innerHTML = '<img src="pause.png" alt="Pause Button">'; // Pause button when playing
        currentAudio = audio;

        // Update the music player bar
        document.querySelector('.music-player-bar .song-title').innerText = songTitle;
        document.querySelector('.music-player-bar .movie-name').innerText = movieName;
        document.querySelector('.music-player-bar .song-img-small').src = songImg;

        // Update displayed song button
        var displayedButton = currentPlaylist.find(item => item.audio === audio).button;
        displayedButton.innerHTML = '<img src="pause.png" alt="Pause Button">';

        // Automatically play next song when current song ends
        audio.addEventListener('ended', function() {
            playNext();
        });
    } else {
        audio.pause();
        button.innerHTML = '<img src="play.png" alt="Play Button">'; // Play button when paused
        currentAudio = null;

        // Reset the music player bar
        document.querySelector('.music-player-bar .song-title').innerText = '-';
        document.querySelector('.music-player-bar .movie-name').innerText = '-';
        document.querySelector('.music-player-bar .song-img-small').src = '-';

        // Update displayed song button
        var displayedButton = currentPlaylist.find(item => item.audio === audio).button;
        displayedButton.innerHTML = '<img src="play.png" alt="Play Button">';
    }
}

function toggleLoop() {
    isLooping = !isLooping;
    if (currentAudio) {
        currentAudio.loop = isLooping;
    }
}

function playPrevious() {
    var index = currentPlaylist.findIndex(item => item.audio === currentAudio);
    var prevIndex = index > 0 ? index - 1 : currentPlaylist.length - 1;
    var prevButton = currentPlaylist[prevIndex].button;
    togglePlay(prevButton);
}

function playNext() {
    var index = currentPlaylist.findIndex(item => item.audio === currentAudio);
    var nextIndex = (index + 1) % currentPlaylist.length;
    var nextButton = currentPlaylist[nextIndex].button;
    togglePlay(nextButton);
}

function play() {
    if (currentAudio) {
        currentAudio.play();
        document.querySelector('.control-button.play').style.display = 'none';
        document.querySelector('.control-button.pause').style.display = 'inline';
    }
}

function pause() {
    if (currentAudio) {
        currentAudio.pause();
        document.querySelector('.control-button.play').style.display = 'inline';
        document.querySelector('.control-button.pause').style.display = 'none';
    }
}

function playRandom() {
    var randomIndex = Math.floor(Math.random() * currentPlaylist.length);
    var randomButton = currentPlaylist[randomIndex].button;
    togglePlay(randomButton);
}

function updateProgressBar() {
    if (currentAudio) {
        var progressBar = document.querySelector('.progress-bar');
        var currentTime = currentAudio.currentTime;
        var duration = currentAudio.duration;
        var progressPercent = (currentTime / duration) * 100;
        progressBar.style.width = progressPercent + '%';

        document.querySelector('.current-time').innerText = formatTime(currentTime);
        document.querySelector('.total-time').innerText = formatTime(duration);
    }
}

function formatTime(seconds) {
    var minutes = Math.floor(seconds / 60);
    var seconds = Math.floor(seconds % 60);
    if (seconds < 10) {
        seconds = '0' + seconds;
    }
    return minutes + ':' + seconds;
}

function seek(event) {
    if (currentAudio) {
        var progressContainer = document.querySelector('.progress-container');
        var rect = progressContainer.getBoundingClientRect();
        var offsetX = event.clientX - rect.left;
        var totalWidth = rect.width;
        var seekTime = (offsetX / totalWidth) * currentAudio.duration;
        currentAudio.currentTime = seekTime;
    }
}

function playAll() {
    // Start playing the first song
    var firstButton = currentPlaylist[0].button;
    togglePlay(firstButton);

    // Play next song when current song ends
    currentAudio.addEventListener('ended', playNext);
}

setInterval(updateProgressBar, 1000);

// Search engine

// Sample playlist data
var playlist = [
    {
        title: 'Tumhi ho',
        movie: 'Aashiqui2',
        audio: 'audio/tumhiho.mp3',
        image: 'https://rukminim2.flixcart.com/image/850/1000/kxtaxzk0/poster/m/b/4/medium-aashiqui-2-hindi-movie-shraddha-kapoor-matte-finish-original-imaga6jknxddxbg2.jpeg?q=90&crop=false'
    },
    {
        title: 'Phir bhi tumko Chahunga',
        movie: 'Half Girlfriend',
        audio: 'audio/pbtc.mp3',
        image: 'img/hgf.jpg'
    },
    {
        title: 'Chahun mein ya na',
        movie: 'Aashiqui2',
        audio: 'audio/cmna.mp3',
        image: 'https://rukminim2.flixcart.com/image/850/1000/ktrk13k0/music/9/b/k/audio-cd-standard-edition-t-series-aashiqui-2-original-imag7ffxjguujm23.jpeg?q=90&crop=false'
    },
    {
        title: 'Nadaniya',
        movie: 'Youtube',
        audio: 'audio/nadaniya.mp3',
        image: 'img/nadaniya.jpg'
    },
    {
        title: 'Husn',
        movie: 'Anuv Jain',
        audio: 'https://www.pagalworld.com.sb/files/download/type/320/id/68768',
        image: 'https://c.saavncdn.com/436/Husn-Hindi-2023-20231129054140-500x500.jpg'
    },
    {
        title: 'Ye tune kya kiya',
        movie: 'oup mumbai',
        audio: 'https://pagalfree.com/download/320-Ye%20Tune%20Kya%20Kiya%20-%20Once%20Upon%20A%20Time%20In%20Mumbaai%20Dobara%20320%20Kbps.mp3',
        image: 'https://c.saavncdn.com/243/Once-Upon-A-Time-In-Mumbaai-Dobara-2013-500x500.jpg'
    },
    {
        title: 'Dagabaaz re',
        movie: 'Dabaang 2',
        audio: 'https://ghantalele.com/uploads/files/data-10/4647/Dagabaaz%20Re_320(Ghantalele.com).mp3',
        image: 'https://a10.gaanacdn.com/gn_img/albums/XzVWRyL3dq/zVWRz0yWdq/size_m.jpg'
    },
    {
        title: 'Main Rahoon',
        movie: 'Youtube',
        audio: 'https://pagalworlld.com/files/download/id/3596',
        image: 'https://c.saavncdn.com/395/Main-Rahoon-Ya-Na-Rahoon-Hindi-2015-500x500.jpg'
    },
    {
        title: 'Dekha Hazaron Dafa',
        movie: 'Rustom',
        audio: 'audio/dekha.mp3',
        image: 'https://c.saavncdn.com/221/Rustom-Hindi-2018-20191029174008-500x500.jpg'
    },
    {
        title: 'Kahani suno 2.0',
        movie: 'Youtube',
        audio: 'audio/kahani.mp3',
        image: 'https://source.boomplaymusic.com/group10/M00/02/15/b21e296a7ed74970a4d7b446f03e2eb1_464_464.jpg'
    },
    {
        title: 'Pehle bhi mein',
        movie: 'Animal',
        audio: 'https://www.pagalworld.com.sb/files/download/type/320/id/68446',
        image: 'https://c.saavncdn.com/413/Marham-Pehle-Bhi-Main-From-ANIMAL-Hindi-2023-20231223151003-500x500.jpg'
    },
    {
        title: "Choo lo",
        movie: "Local Train",
        audio: "https://pagalfree.com/download/320-Choo%20Lo%20-%20Aalas%20Ka%20Pedh%20320%20Kbps.mp3",
        image: "https://i1.sndcdn.com/artworks-u8xI3kXVRY7lo6TC-P0AKiw-t500x500.jpg"
    }
];

function searchSongs() {
    var query = document.getElementById('search-input').value.toLowerCase();
    var suggestions = [];

    if (query.length > 1) { // Minimum length for search
        playlist.forEach(function(song) {
            var title = song.title.toLowerCase();
            var movie = song.movie.toLowerCase();
            var relevance = 0;

            // Calculate relevance score
            if (title.includes(query)) relevance += 2;
            if (movie.includes(query)) relevance += 1;

            if (relevance > 0) {
                suggestions.push({
                    title: song.title,
                    movie: song.movie,
                    image: song.image,
                    relevance: relevance
                });
            }
        });

        // Sort suggestions based on relevance
        suggestions.sort((a, b) => b.relevance - a.relevance);

        // Display suggestions
        var suggestionsContainer = document.getElementById('suggestions');
        suggestionsContainer.innerHTML = '';
        suggestionsContainer.style.display = 'block';

        suggestions.forEach(function(suggestion) {
            var suggestionItem = document.createElement('div');
            suggestionItem.className = 'suggestion-item';
            suggestionItem.innerHTML = `
                <img src="${suggestion.image}" alt="Song Image">
                ${highlightText(suggestion.title + ' - ' + suggestion.movie, query)}
            `;
            suggestionItem.onclick = function() {
                var matchingItem = playlist.find(item => item.title === suggestion.title && item.movie === suggestion.movie);
                if (matchingItem) {
                    var matchingButton = currentPlaylist.find(item => item.title === matchingItem.title && item.movie === matchingItem.movie).button;
                    searchSongs(); // Hide suggestions
                    togglePlay(matchingButton);
                }
            };
            suggestionsContainer.appendChild(suggestionItem);
        });
    } else {
        document.getElementById('suggestions').style.display = 'none';
    }
}

function highlightText(text, query) {
    var regex = new RegExp('(' + query.split(' ').join('|') + ')', 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
}

// Optionally, trigger search on input change for smoother experience
document.getElementById('search-input').addEventListener('input', searchSongs);

document.addEventListener('click', function(event) {
    var searchInput = document.getElementById('search-input');
    var suggestionsContainer = document.getElementById('suggestions');

    if (!searchInput.contains(event.target) && !suggestionsContainer.contains(event.target)) {
        suggestionsContainer.style.display = 'none';
    }
});
