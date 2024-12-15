document.addEventListener('DOMContentLoaded', () => { // makes code run after  html is loaded + parsed, ensure dom elemnts = available
    const searchInput = document.getElementById('search');// user input
    const searchButton = document.getElementById('search-button');//trigger for search
    const resultsContainer = document.getElementById('results-container');//results display
    const creatureNamesList = document.getElementById('creature-names-list');//name list



//amelia maxwell
//ca2 web app
//23471092




    // FETCH CREATURES FROM SERVER
    async function fetchCreatures() {// async function stops page from from freezing while server loads using operation await
        console.log('Fetching creatures...');
        try {
            const response = await fetch('/creatures'); // fetch data from api aka endpoints in my server by sending get request, uses wait to pause until response from server,
            if (!response.ok) throw new Error('Failed to fetch creatures.');// fail message is ok [server responded successful] other throws out a error message
            const creatures = await response.json();//turns servers json response in a javascript array
            populateCreatureNames(creatures); // adds the creature names to ul with the creature names list id, list=  populated after data is fetched
            displayCreatures([]); // the [] is empty so the results box is empty before anything is searched
        } catch (error) { // if error occurs send the user a fail message and shows the bugs in inspect>console so i can fix it
            console.error('Error fetching creatures:', error);
        }
    }

    // POPULATES AND REFRESHES THE NAMES LIST 
    function populateCreatureNames(creatures) {//this function resets the list everytime a function calls on fetch creatures, fetchcreatures adds the creature names
        console.log('Populating creature names list...');// message for console so i know its running
        creatureNamesList.innerHTML = ''; // makes inner html of list an empty string to prevent duplicatation

        creatures.forEach(creature => {//loops through each creature
            const listItem = document.createElement('li');//makes each creature a li elemnet, making a list
            listItem.textContent = creature.name;// only the name goes into the listt
            listItem.className = 'creature-name-item';// assigns the class so i can do my css
            creatureNamesList.appendChild(listItem);// takes the li just made to the ul in html so the list can be displayed
        });

        console.log('Creature names list populated successfully.');//console message-debugging
    }

    // DISPLAYS CREATURES IN RESULTS SECTION
    function displayCreatures(creaturesToDisplay) {
        console.log('Displaying creatures...');//coonsole
        resultsContainer.innerHTML = ''; // clear existing content

        const title = document.createElement('h2');//creates h2 element that says our creatures as a heading
        title.textContent = 'Our Creatures';
        resultsContainer.appendChild(title);

        if (creaturesToDisplay.length === 0) {//do nothing if theres nothing to display
            console.log('No search results to display.');
            return; // checks if display array was empty and if so shows a message and stops further exacution
        }

        creaturesToDisplay.forEach(creature => {//loop for each creature
            const resultCard = document.createElement('div');// makes a div to hold each creatures details
            resultCard.className = 'result-item';//assigns it too css class

            resultCard.innerHTML = `
                <h3>${creature.name}</h3>
                <p><strong>Category:</strong> ${creature.category}</p>
                <p><strong>Description:</strong> ${creature.description || 'N/A'}</p>
                <p><strong>Power Level:</strong> ${creature.powerLevel || 'Unknown'}</p>
                <p><strong>Abilities:</strong> ${creature.abilities ? creature.abilities.join(', ') : 'None'}</p>
                <button class="edit-button" data-id="${creature.id}">Edit</button>
                <button class="delete-button" data-id="${creature.id}">Delete</button>
            `;//card setup

            resultsContainer.appendChild(resultCard);//adds the card to html for display
        });

        // EVENT LISENERS FOR EDIT AND DELETE BUTTONS
        document.querySelectorAll('.edit-button').forEach(button => {
            button.addEventListener('click', handleEdit);//runs handle edit button when edit button is clicked
        });

        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', handleDelete);
        });

        console.log(`Displayed ${creaturesToDisplay.length} creatures.`);
    }

    // SEARCH FUNCTION
    async function searchCreatures() {//allows async function 
        console.log('Searching creatures...');
        try {// using try  so errors can be tackled nicely with catch blcok
            const query = searchInput.value.trim().toLowerCase();// takes the search input removes whitespace and turns it to lower case 
            const response = await fetch('/creatures'); // waits for fetchcraetures to complete then  send reqquest for list of creatutres
            const creatures = await response.json();//coverts json repsonse to js aray

            const filteredCreatures = creatures.filter(creature =>// filtures to find search match and makes array lowercase
                creature.name.toLowerCase().includes(query)//also checks search search for substring
            );

            displayCreatures(filteredCreatures); // displays using predefined function
        } catch (error) {//error handling
            console.error('Error searching creatures:', error);
        }
    }

    // EDITING CREATURES
    async function handleEdit(event) {//event = button click
    const creatureId = event.target.dataset.id;//identifies which craeture to be edited
    console.log('Edit button clicked for creature ID:', creatureId); // consoel debugging

    // Fetch the creature details
    try {
        const response = await fetch(`/creatures`);
        if (!response.ok) throw new Error('Failed to fetch creatures.');

        const creatures = await response.json();
        const creature = creatures.find(c => c.id == creatureId);// finds matching creature in array

        if (!creature) {
            alert('Creature not found.');
            return;// fail message
        }

        // prompt boxes to change details, cancel = defaults to old name and  current name = prefilled
        const newName = prompt('Enter new name:', creature.name) || creature.name;
        const newDescription = prompt('Enter new description:', creature.description) || creature.description;
        const newCategory = prompt('Enter new category:', creature.category) || creature.category;
        const newPowerLevel = parseInt(prompt('Enter new power level:', creature.powerLevel), 10) || creature.powerLevel;//parseint = coverts to integer
        const newAbilities = prompt('Enter new abilities (comma-separated):', creature.abilities.join(', ')) || creature.abilities;// makes string into array using commas

        const updatedCreature = {//creates new object with creatures updates
            name: newName.trim(),//removes whitespace-trim
            description: newDescription.trim(),
            category: newCategory.trim(),
            powerLevel: newPowerLevel,
            abilities: newAbilities.split(',').map(a => a.trim()),//.map(a => a.trim()),= abilities all trimmed of whitespce
        };

        // Send the updated creature to the server
        const updateResponse = await fetch(`/creatures/${creatureId}`, {// put request to update by id
            method: 'PUT',//specifies http method as put
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedCreature),//makes the updated into json string
        });
		//messages for fails and success
        if (updateResponse.ok) {
            alert('Creature updated successfully!');
            fetchCreatures(); // Refresh the list
        } else {
            const errorData = await updateResponse.json();
            alert(`Failed to update creature: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Error editing creature:', error);
    }
}


  async function handleDelete(event) {
    const creatureId = event.target.dataset.id;  //takes id from data id attribute and logs it
	console.log('Delete button clicked for creature ID:', creatureId); // Debug log

    if (!confirm('Are you sure you want to delete this creature?')) return;//comfirmation if user cancels the function exits (return)

    try {
        const response = await fetch(`/creatures/${creatureId}`, {// send delete request with id using http method as delete
            method: 'DELETE',
        });

        console.log('Delete response:', response);
		
		// messages for fail and succcess
        if (response.ok) {
            alert('Creature deleted successfully!');
            fetchCreatures(); // Refresh the list
        } else {
            const errorData = await response.json();
            alert(`Failed to delete creature: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Error deleting creature:', error);
    }
}



    searchButton.addEventListener('click', searchCreatures);// button clcik to trigger search

    fetchCreatures();//when page loads so does the fetch creatures function for the creature name list
});
