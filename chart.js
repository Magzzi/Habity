import { Bar } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import { Chart as ChartJS } from 'chart.js';
import { ChartOptions, ChartData } from 'chart.js';

// Initialize habits from localStorage or set as an empty array if none exists
const getHabits = () => JSON.parse(localStorage.getItem('habits')) || [];

function getCompletedDays(habit, days) {
    const dateToday = new Date();
    const pastDate = new Date(dateToday.getTime() - (days * 24 * 60 * 60 * 1000)); // Calculate past date (e.g., 30 days ago)
    return habit.completed.filter(date => new Date(date) >= pastDate).length; // Filter completed dates within the last N days
}

function HabitProgressChart() {
    const [habits, setHabits] = useState(getHabits());

    const habitNames = habits.map(habit => habit.name);
    const progressData = habitNames.map(habitName => {
        const habit = habits.find(habit => habit.name === habitName);
        return getCompletedDays(habit, 30); // Get completed days in the last 30 days
    });

    const chartData = {
        labels: habitNames,
        datasets: [{
            label: 'Completed Days (Last 30 Days)',
            data: progressData, // Data to show on the chart
            backgroundColor: 'rgba(75, 192, 192, 0.2)', // Light blue color for bars
            borderColor: 'rgba(75, 192, 192, 1)', // Border color for bars
            borderWidth: 1
        }]
    };

    const chartOptions = {
        scales: {
            y: {
                beginAtZero: true, // Ensure the Y-axis starts at 0
                title: {
                    display: true,
                    text: 'Completed Days'
                }
            }
        },
        responsive: true, // Ensure the chart is responsive to screen size
        maintainAspectRatio: false
    };

    useEffect(() => {
        setHabits(getHabits()); // Re-fetch habits from localStorage when component mounts or updates
    }, []);

    return (
        div style={{ width: '80%', height: '400px' }}>
            <Bar data={chartData} options={chartOptions} />
        </div>
    );
}

export default HabitProgressChart;
