// Simple task database
let tasks = [];
const recommendations = [
    "Take a 5-minute break",
    "Drink some water",
    "Prioritize your most important task",
    "Review your completed tasks"
];

// DOM elements
const micButton = document.getElementById('micButton');
const voiceStatus = document.getElementById('voiceStatus');
const taskList = document.getElementById('taskList');
const suggestions = document.getElementById('suggestions');

// Voice recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

// Voice command processing
function processVoiceCommand(transcript) {
    const command = transcript.toLowerCase();

    if (command.includes('add task')) {
        const taskText = command.replace('add task', '').trim();
        if (taskText) {
            tasks.push(taskText);
            updateTaskList();
            voiceStatus.textContent = `Added task: ${taskText}`;
        }
    } else if (command.includes('complete task')) {
        const taskNum = parseInt(command.replace('complete task', '').trim());
        if (!isNaN(taskNum) && taskNum > 0 && taskNum <= tasks.length) {
            const completed = tasks.splice(taskNum - 1, 1);
            updateTaskList();
            voiceStatus.textContent = `Completed task: ${completed[0]}`;
        }
    } else if (command.includes('recommendation')) {
        showRecommendation();
    } else {
        voiceStatus.textContent = "Sorry, I didn't understand that command. Try saying 'add task [your task]' or 'complete task [number]'";
    }
}

// Update task list display
function updateTaskList() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${task}`;
        taskList.appendChild(li);
    });

    // Show a recommendation when tasks change
    if (tasks.length > 0) {
        showRecommendation();
    }
}

// Show random recommendation
function showRecommendation() {
    const randomIndex = Math.floor(Math.random() * recommendations.length);
    suggestions.textContent = recommendations[randomIndex];
}

// Event listeners
micButton.addEventListener('click', () => {
    recognition.start();
    voiceStatus.textContent = "Listening...";
});

recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    voiceStatus.textContent = `You said: ${transcript}`;
    processVoiceCommand(transcript);
};

recognition.onerror = (event) => {
    voiceStatus.textContent = `Error: ${event.error}`;
};

// Initialize
updateTaskList();
showRecommendation();