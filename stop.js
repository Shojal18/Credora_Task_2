const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const millisecondsDisplay = document.getElementById('milliseconds');
const startStopButton = document.getElementById('startStop');
const resetButton = document.getElementById('reset');
const outerCircles = document.querySelectorAll('.outer-circle');
const videos = document.querySelectorAll('.outer-circle video');
const watchContainer = document.querySelector('.watch-container'); // To append background video

let interval;
let minutes = 0;
let seconds = 0;
let milliseconds = 0;
let isRunning = false;
let activeModeCircle = null; // To track which circle was double-clicked
let backgroundVideoContainer = null;

function formatTime(min, sec, ms) {
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
}

function updateDisplay() {
    minutesDisplay.textContent = String(minutes).padStart(2, '0');
    secondsDisplay.textContent = String(seconds).padStart(2, '0');
    millisecondsDisplay.textContent = String(milliseconds).padStart(2, '0');
}

function showOuterCircles() {
    outerCircles.forEach(circle => circle.classList.add('visible'));
}

function hideOuterCircles() {
    outerCircles.forEach(circle => circle.classList.remove('visible'));
    videos.forEach(video => {
        video.pause();
        video.currentTime = 0;
    });
    if (backgroundVideoContainer) {
        backgroundVideoContainer.classList.remove('active');
        const bgVideo = backgroundVideoContainer.querySelector('video');
        if (bgVideo) {
            bgVideo.pause();
            bgVideo.currentTime = 0;
        }
    }
    activeModeCircle = null;
}

function startStop() {
    if (!isRunning) {
        console.log("Starting the timer..."); // Debugging log
        interval = setInterval(() => {
            milliseconds += 10;
            if (milliseconds === 1000) {
                seconds++;
                milliseconds = 0;
            }
            if (seconds === 60) {
                minutes++;
                seconds = 0;
            }
            console.log(`Timer: ${minutes}:${seconds}:${milliseconds}`); // Debugging log
            updateDisplay();
        }, 10);
        startStopButton.textContent = 'Stop';
        startStopButton.classList.add('running');
        isRunning = true;

        // Show the outer circles when the timer starts
        showOuterCircles();
    } else {
        console.log("Stopping the timer..."); // Debugging log
        clearInterval(interval);
        startStopButton.textContent = 'Start';
        startStopButton.classList.remove('running');
        isRunning = false;

        // Hide the outer circles when the timer stops
        hideOuterCircles();
    }
}

function showOuterCircles() {
    outerCircles.forEach(circle => circle.classList.add('visible'));
    console.log("Outer circles are now visible."); // Debugging log
}

function hideOuterCircles() {
    outerCircles.forEach(circle => circle.classList.remove('visible'));
    videos.forEach(video => {
        video.pause();
        video.currentTime = 0;
    });
    if (backgroundVideoContainer) {
        backgroundVideoContainer.classList.remove('active');
        const bgVideo = backgroundVideoContainer.querySelector('video');
        if (bgVideo) {
            bgVideo.pause();
            bgVideo.currentTime = 0;
        }
    }
    activeModeCircle = null;
    console.log("Outer circles are now hidden."); // Debugging log
}
startStopButton.addEventListener('click', () => {
    console.log("Start/Stop button clicked."); // Debugging log
    startStop();
});

function handleOuterCircleDoubleClick(event) {
    const clickedCircle = event.currentTarget;

    // If the clicked circle is already active, do nothing
    if (clickedCircle === activeModeCircle) {
        console.log("Clicked circle is already active."); // Debugging log
        return;
    }

    // If another circle was active, reset it
    if (activeModeCircle) {
        activeModeCircle.classList.remove('blash');
        if (backgroundVideoContainer) {
            backgroundVideoContainer.classList.remove('active');
            const bgVideo = backgroundVideoContainer.querySelector('video');
            if (bgVideo) {
                bgVideo.pause();
                bgVideo.currentTime = 0;
            }
        }
    }

    // Set the new active circle
    activeModeCircle = clickedCircle;
    clickedCircle.classList.add('blash');
    console.log("New active circle set:", clickedCircle.id); // Debugging log

    // Update the background video
    const videoElement = clickedCircle.querySelector('video').cloneNode(true); // Clone to avoid interfering with hover
    if (videoElement) {
        if (!backgroundVideoContainer) {
            backgroundVideoContainer = document.createElement('div');
            backgroundVideoContainer.classList.add('video-background');
            watchContainer.appendChild(backgroundVideoContainer);
        } else {
            backgroundVideoContainer.innerHTML = ''; // Clear previous video
        }
        backgroundVideoContainer.appendChild(videoElement);
        backgroundVideoContainer.classList.add('active');
        videoElement.play();
    }

    // Start the timer if it is not already running
    if (!isRunning) {
        startStop();
    }
}

// Add the resetStopwatch function here
function resetStopwatch() {
    console.log("Resetting the stopwatch..."); // Debugging log

    // Stop the timer if it's running
    clearInterval(interval);
    isRunning = false;

    // Reset timer values
    minutes = 0;
    seconds = 0;
    milliseconds = 0;

    // Update the display
    updateDisplay();

    // Reset the Start/Stop button
    startStopButton.textContent = 'Start';
    startStopButton.classList.remove('running');

    // Hide the outer circles
    hideOuterCircles();

    // Reset the active mode circle
    if (activeModeCircle) {
        activeModeCircle.classList.remove('blash');
        activeModeCircle = null;
    }

    // Reset the background video
    if (backgroundVideoContainer) {
        backgroundVideoContainer.classList.remove('active');
        backgroundVideoContainer.innerHTML = ''; // Clear the video content
    }

    console.log("Stopwatch has been reset."); // Debugging log
}

// Attach the reset button event listener
resetButton.addEventListener('click', resetStopwatch);

outerCircles.forEach(circle => {
    circle.addEventListener('mouseenter', () => {
        const video = circle.querySelector('video');
        if (video) {
            console.log("Mouse entered, playing video:", video.src); // Debugging log
            setTimeout(() => {
                video.play();
            }, 1000); // 1-second delay after flip
        }
    });

    circle.addEventListener('mouseleave', () => {
        const video = circle.querySelector('video');
        if (video) {
            console.log("Mouse left, pausing video:", video.src); // Debugging log
            video.pause();
            video.currentTime = 0; // Reset video to start
        }
    });
});