const { ipcRenderer } = require('electron');
const { shell } = require('electron');

const startAudio = new Audio('./lurch-start.mp3');
const endAudio = new Audio('./lurch-end.mp3');

let currentVolume = 0.5; // Starting volume level
let isTimerActive = false; // Flag to indicate if the timer is active

function playSounds() {
  if (!isTimerActive) {
    isTimerActive = true;
    startAudio.volume = currentVolume;
    endAudio.volume = currentVolume;

    startAudio.play();
    setTimeout(() => {
      endAudio.play();
      isTimerActive = false; // Reset the flag after playing the second sound
    }, 400);
  }
}
// Function to change the volume
function changeVolume(change) {
  currentVolume += change;
  currentVolume = Math.min(Math.max(currentVolume, 0), 1); // Keep volume between 0 and 1

  // Update the volume display
  const volumeDisplay = document.querySelector('.div'); // Assuming '.div' is your volume display element
  volumeDisplay.textContent = Math.round(currentVolume * 10); // Display volume as a number between 0 and 10

  startAudio.volume = currentVolume;
  endAudio.volume = currentVolume;
}

function minimizeApp() {
  ipcRenderer.send('minimize-app');
}

function closeApp() {
  ipcRenderer.send('close-app');
}

document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById('start-button');
  const stopButton = document.getElementById('stop-button');
  const inputSelect = document.getElementById('input-select');
  const descriptionStart = document.getElementById('description-start');
  const descriptionInput = document.getElementById('description-input');
  const descriptionStop = document.getElementById('description-stop');

  function openLinkExternally(event) {
    event.preventDefault();
    shell.openExternal(event.currentTarget.href);
  }

  // Attach event listeners to each link
  const links = document.querySelectorAll('a[href^="http"]');
  links.forEach(link => {
    link.addEventListener('click', openLinkExternally);
  });

  // Initialize the volume display
  const volumeDisplay = document.querySelector('.div');
  volumeDisplay.textContent = Math.round(currentVolume * 10);

  // Initially disable the start button and show the 'description-start' text
  startButton.disabled = true;
  descriptionInput.hidden = true;
  descriptionStop.hidden = true;
  descriptionStart.hidden = false;

  inputSelect.addEventListener('change', () => {
    startButton.disabled = !inputSelect.value;
    descriptionStart.hidden = !inputSelect.value;
    descriptionInput.hidden = !!inputSelect.value;
  });

  startButton.addEventListener('click', () => {
    if (inputSelect.value) {
      startButton.hidden = true;
      stopButton.hidden = false;
      descriptionStart.hidden = true;
      descriptionInput.hidden = true;
      descriptionStop.hidden = false;
      inputSelect.disabled = true; // Disable the dropdown menu
      ipcRenderer.send('set-input', inputSelect.value);
      ipcRenderer.send('start-logging');
    } else {
      descriptionInput.hidden = false;
      descriptionStart.hidden = true;
      descriptionStop.hidden = true;
    }
  });

  stopButton.addEventListener('click', () => {
    startButton.hidden = false;
    stopButton.hidden = true;
    descriptionStart.hidden = false;
    descriptionInput.hidden = true;
    descriptionStop.hidden = true;
    inputSelect.disabled = false; // Re-enable the dropdown menu
    ipcRenderer.send('stop-logging');
  });

  ipcRenderer.on('io-event', (event, data) => {
    console.log(`IO Event (${data.type}):`, data.event);
    playSounds();
  });
});
