//amelia maxwell
//ca2 web app
//23471092


document.addEventListener('DOMContentLoaded', async () => {//waits for dom to load before running
    const ctx = document.getElementById('powerLevelChart').getContext('2d');// gets canvas eleemnt with id

    try {
        const response = await fetch('/creatures'); // fetch creatures data with get request
        if (!response.ok) throw new Error('Failed to fetch creatures.');// checks for success
        const creatures = await response.json();//coverts json to js array

        // Prepare data for bar chart
        const labels = creatures.map(c => c.name); // gets creature names for charts x axis
        const powerLevels = creatures.map(c => c.powerLevel); // gets power levels for bar data

        // Create bar chart
        new Chart(ctx, {
    type: 'bar',//defines chart as a bar chart
    data: {
        labels, // names forx axis
        datasets: [{// data and styling
            label: 'Power Levels',
            data: powerLevels,
            backgroundColor: '#333', 
            borderColor: '#000',       
            borderWidth: 1,
            hoverBackgroundColor: '#DBBACB', 
            hoverBorderColor: '#555',     
            hoverBorderWidth: 2             
			
        }]
    },
    options: {
        responsive: true,//chart adapts to screen size
        plugins: {
            legend: { display: true },
            title: { display: true, text: 'Creature Power Levels' }
        },
        scales: {
            y: {
                beginAtZero: true//makes y axis start at 0
            }
        }
    }
});



        console.log('Power Level Chart generated successfully.');
    } catch (error) {
        console.error('Error loading chart data:', error);
    }
});
