// ================================
// DATE
// ================================

const dateElement = document.getElementById("date");

const today = new Date();

dateElement.textContent = today.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric"
});


// ================================
// TASK SYSTEM
// ================================

let tasks = JSON.parse(localStorage.getItem("studyflowTasks")) || [];

const taskList = document.getElementById("taskList");
const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const progress = document.getElementById("progress");


function saveTasks() {
    localStorage.setItem(
        "studyflowTasks",
        JSON.stringify(tasks)
    );
}


function renderTasks() {

    taskList.innerHTML = "";

    tasks.forEach((task, index) => {

        const taskElement = document.createElement("div");

        taskElement.className =
            "task " + (task.completed ? "completed" : "");

        taskElement.innerHTML = `

            <div class="task-left">

                <input
                    type="checkbox"
                    ${task.completed ? "checked" : ""}
                    onchange="toggleTask(${index})"
                >

                <span class="task-name">
                    ${task.name}
                </span>

                <span class="subject">
                    ${task.subject}
                </span>

            </div>

            <button
                class="delete-btn"
                onclick="deleteTask(${index})"
            >
                🗑️
            </button>

        `;

        taskList.appendChild(taskElement);
    });

    updateStatistics();
}


function updateStatistics() {

    const completed =
        tasks.filter(task => task.completed).length;

    const total = tasks.length;

    totalTasks.textContent = total;

    completedTasks.textContent = completed;

    const percentage =
        total === 0
            ? 0
            : Math.round((completed / total) * 100);

    progress.textContent = percentage + "%";
}


function toggleTask(index) {

    tasks[index].completed =
        !tasks[index].completed;

    saveTasks();

    renderTasks();
}


function deleteTask(index) {

    tasks.splice(index, 1);

    saveTasks();

    renderTasks();
}


// ================================
// ADD TASK MODAL
// ================================

const modal =
    document.getElementById("taskModal");

const addTaskBtn =
    document.getElementById("addTaskBtn");

const closeModal =
    document.getElementById("closeModal");

const saveTask =
    document.getElementById("saveTask");

const taskInput =
    document.getElementById("taskInput");

const subjectInput =
    document.getElementById("subjectInput");


addTaskBtn.onclick = () => {

    modal.style.display = "flex";

    taskInput.focus();
};


closeModal.onclick = () => {

    modal.style.display = "none";
};


saveTask.onclick = () => {

    const name =
        taskInput.value.trim();

    const subject =
        subjectInput.value;

    if (name === "") {

        alert("Please enter a task.");

        return;
    }

    tasks.push({
        name: name,
        subject: subject,
        completed: false
    });

    saveTasks();

    renderTasks();

    taskInput.value = "";

    modal.style.display = "none";
};


// ================================
// POMODORO TIMER
// ================================

let time = 25 * 60;

let timerInterval = null;

const timerElement =
    document.getElementById("timer");

const startBtn =
    document.getElementById("startBtn");

const resetBtn =
    document.getElementById("resetBtn");


function updateTimer() {

    const minutes =
        Math.floor(time / 60);

    const seconds =
        time % 60;

    timerElement.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}


startBtn.onclick = () => {

    if (timerInterval) return;

    timerInterval = setInterval(() => {

        if (time <= 0) {

            clearInterval(timerInterval);

            timerInterval = null;

            alert("🎉 Focus session completed!");

            return;
        }

        time--;

        updateTimer();

    }, 1000);
};


resetBtn.onclick = () => {

    clearInterval(timerInterval);

    timerInterval = null;

    time = 25 * 60;

    updateTimer();
};


// ================================
// NOTES
// ================================

const notes =
    document.getElementById("notes");

notes.value =
    localStorage.getItem("studyflowNotes") || "";


notes.addEventListener("input", () => {

    localStorage.setItem(
        "studyflowNotes",
        notes.value
    );
});


// ================================
// STUDY GOAL
// ================================

const goalInput =
    document.getElementById("goalInput");

const saveGoal =
    document.getElementById("saveGoal");

const studyHours =
    document.getElementById("studyHours");

const goalText =
    document.getElementById("goalText");

const goalBar =
    document.getElementById("goalBar");


let studyGoal =
    Number(localStorage.getItem("studyflowGoal")) || 0;


function updateGoal() {

    studyHours.textContent = studyGoal;

    goalText.textContent =
        `Goal: ${studyGoal} hours`;

    goalBar.style.width =
        Math.min(studyGoal * 10, 100) + "%";
}


saveGoal.onclick = () => {

    const value =
        Number(goalInput.value);

    if (value < 0 || value > 24) {

        alert("Enter a value between 0 and 24.");

        return;
    }

    studyGoal = value;

    localStorage.setItem(
        "studyflowGoal",
        studyGoal
    );

    updateGoal();

    goalInput.value = "";
};


// ================================
// DARK MODE
// ================================

const themeBtn =
    document.getElementById("themeBtn");


if (localStorage.getItem("studyflowTheme") === "dark") {

    document.body.classList.add("dark");

    themeBtn.textContent = "☀️";
}


themeBtn.onclick = () => {

    document.body.classList.toggle("dark");

    const darkMode =
        document.body.classList.contains("dark");

    themeBtn.textContent =
        darkMode ? "☀️" : "🌙";

    localStorage.setItem(
        "studyflowTheme",
        darkMode ? "dark" : "light"
    );
};


// ================================
// INITIALIZE
// ================================

renderTasks();

updateTimer();

updateGoal();