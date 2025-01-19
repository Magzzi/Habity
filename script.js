// DOM Elements
const habitForm = document.getElementById('habit-form');
const habitNameInput = document.getElementById('habit-name');
const habitList = document.getElementById('habits');
const themeToggle = document.getElementById('theme-toggle');
const clearHabitsButton = document.getElementById('clear-habits');

// store an array of habit objects initialized from localStorage
let habits = JSON.parse(localStorage.getItem('habits')) || [];


/** 
localStorage.clear();
updateHabits();
*/

habitForm.addEventListener('reset', (e) => {
    e.preventDefault();
    habits = [];
    localStorage.setItem('habits', JSON.stringify(habits));
    updateHabits();
    updateProgressData();
    console.log('Habits Cleared!');
})



// Theme Toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    // localStorage is used for persistent data storage across browser sessions.
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light'); 
    // if the dark class is present (light mode) -> dark is stored in the local storage
    // else if the dark class is not present (dark mode) -> the light string is stored in local storage
    // overall, the body will follow what is in localStorage
})

// Add Habit

habitForm.addEventListener('submit', (e) => {
    // Prevent default form submission
    e.preventDefault(); // prevents from reloading the page on submission

    const habitName=habitNameInput.value.trim(); // reads the value from the input field and trims it (removes any whitespace from both sides of a string)

    if (habitName) { // if valid
        // add a new habit object to the habits array
        habits.push({name:habitName, completed: []});
        console.log('Added');
        updateHabits(); // update the habit list
        updateProgressData();
        habitNameInput.value = ''; // reset the input field
    }
});

updateHabits = () => {
    habitList.innerHTML = ''; // clear first the habit list
    habits.forEach((habit, index) => { // for each habit
        const li = document.createElement('li'); // create a list element
        li.textContent = habit.name; // the list will contain the name of the habit
        
        
        const dateToday = new Date().toISOString().split('T')[0]; // Get current date

        // If habit is completed today, mark it as completed (change style)
        if (habit.completed.includes(dateToday)) {
            li.classList.add('completed'); // Add a class to mark it as completed (for styling)
        }
        updateProgressData();

        li.addEventListener('click', () => toggleCompletion(index)); // Toggle completion on click

        habitList.appendChild(li); // add the list to the habit list section in html
    })

    localStorage.setItem('habits', JSON.stringify(habits)); // saves the updated habits array to the localStorage
}

// mark a habit as completed or uncompleted for the current day

toggleCompletion = (index) => {
    
    const dateToday = new Date().toISOString().split('T')[0]; // get the date today (ISO date format)
    const habit = habits[index];

    if (habit.completed.includes(dateToday)){ // if the current date exists in the completed array for the selected habit
        habit.completed = habit.completed.filter((date) => date !== dateToday); // then remove it
    } else {
        habit.completed.push(dateToday); // else, add it
    }

    updateHabits();
}



// Initialize
function init() { // sets up the app when the page loads
    const savedTheme = localStorage.getItem('theme'); // retrieves the save theme from the localStorage
    if (savedTheme === 'dark') { // if the savedTheme is dark
        document.body.classList.add('dark'); // then set the body to dark mode, else do not
    }
    updateHabits(); // call uupdate habits to render the habit list from localStorage
}

updateProgressData = () => {

    let numOfTasks = habits.length;
    let completedCount = habits.filter(habit => Array.isArray(habit.completed) && habit.completed.length > 0).length;
    let progressStatus = document.getElementById('progress-status');
    console.log(completedCount);
    console.log(numOfTasks);

    let completionRate = (completedCount === 0) ? 0 : (completedCount / numOfTasks) * 100;  
    console.log(completionRate);
    progressStatus.innerHTML = completionRate.toFixed(2) + "%";
    
}

init();