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
