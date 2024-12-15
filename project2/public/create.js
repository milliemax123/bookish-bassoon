//amelia maxwell
//ca2 web app
//23471092

document.addEventListener('DOMContentLoaded', () => {//runs after html i sparsed nd loaded
    const form = document.getElementById('add-creature-form');// select form elemnt for event lisenters and js interaction

    form.addEventListener('submit', async (event) => {//event lisenter
        event.preventDefault(); 

        const creatureData = {
            name: document.getElementById('name').value.trim(),
            description: document.getElementById('description').value.trim(),
            category: document.getElementById('category').value.trim(),
            powerLevel: parseInt(document.getElementById('powerLevel').value.trim(), 10),
            abilities: document.getElementById('abilities').value.trim().split(',').map(a => a.trim()),
        };// collect values from form fields

        console.log('Submitting creature data:', creatureData); // debugging log in console

        try {//submits new data to json
            const response = await fetch('/creatures', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(creatureData),//specifies http method=post, content type = json and converst object to json string
            });

            console.log('Server response:', response); 

            if (response.ok) {
                alert('Creature added successfully!');
                form.reset();//success message plus clears inputs
            } else {
                const errorData = await response.json();
                alert(`Failed to add creature: ${errorData.message}`);
                console.error('Error response data:', errorData); // shoes user error message, logs error in console
            }
        } catch (error) {
            alert('An error occurred while adding the creature.');//generic message for unexspected erros
            console.error('Error submitting creature:', error);
        }
    });
});
