
// Fetch Data for Patients, Rooms, and Populate Dropdowns
async function fetchPrescriptionData() {
    try {
        // Fetch data from both APIs concurrently
        const [prescriptionsRes] = await Promise.all([
            fetch('http://localhost:3000/api/prescriptions'),
            // fetch('http://localhost:3000/api/rooms'),
        ]);

        if (!prescriptionsRes.ok ) {
            throw new Error('Failed to fetch prescription');
        }

        // Parse JSON data
        const prescrip = await prescriptionsRes.json();
        // const rooms = await roomsResponse.json();

        // Populate Patient Dropdown
        const prescripSelect = document.getElementById('prescriptionID');
        prescrip.forEach(prescription => {
            const option = document.createElement('option');
            option.value = prescription.id;
            option.textContent = prescription.id;
            prescripSelect.appendChild(option);
        });

        // Populate Room Dropdown
  
        // // Populate Room Dropdown
        // const roomSelect = document.getElementById('admissionRoomNumber');
        // rooms.forEach(room => {
        //     const option = document.createElement('option');
        //     option.value = room.number; 
        //     option.textContent = room.number;
        //     roomSelect.appendChild(option);
        // });

    } catch (error) {
        console.error('Error fetching prescription Data:', error);
    }
}








async function addTreatment(event) {
    event.preventDefault();
    
    const prescriptionSelect = document.getElementById('prescriptionID');
    
    if (!prescriptionSelect || !prescriptionSelect.value) {
        alert("Please select a prescription ID.");
        return;
    }

    const treatmentData = {
        id: document.getElementById('treatmentID').value,
        date: document.getElementById('treatmentDate').value,
        name: document.getElementById('treatmentName').value,
        dosage: document.getElementById('treatmentDosage').value,
        prescriptionID: prescriptionSelect.value,
    };

    console.log("Sending data:", treatmentData);  // Debugging log

    try {
        const response = await fetch('http://localhost:3000/api/treatments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(treatmentData),
        });

        const responseBody = await response.json();
        console.log('Add Treatment Response:', responseBody);

        if (response.ok) {
            alert("treatment added succesfully")
            document.getElementById('treatmentForm').reset();
            fetchTreatments();
        } else {
            alert(`Failed to add treatment: ${responseBody.error || 'Unknown error'}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error adding treatment');
    }
}



document.addEventListener('DOMContentLoaded', () => {
    fetchPrescriptionData();
});

// Fetch all treatments
async function fetchTreatments() {
    try {
        const response = await fetch('http://localhost:3000/api/treatments');
        
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers));

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Fetch error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const treatments = await response.json();
        console.log('Fetched treatments:', treatments);

        if (treatments.length === 0) {
            document.getElementById('treatmentsList').innerHTML = '<p>No treatments found</p>';
            return;
        }

        renderTreatmentsTable(treatments);
    } catch (error) {
        console.error('Detailed fetch error:', error);
        document.getElementById('treatmentsList').innerHTML = `
            <p>Failed to fetch treatments: ${error.message}</p>
        `;
    }
}

// Render treatments table
function renderTreatmentsTable(treatments) {
    const table = `
        <table class="treatment">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Date</th>
                    <th>Name</th>
                    <th>Dosage</th>
                    <th>Prescription ID</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${treatments.map(treatment => `
                    <tr data-id="${treatment.id}">
                        <td><input type="text" value="${treatment.id}" class="editable" data-field="id"></td>
                        <td><input type="datetime-local" value="${new Date(treatment.date).toISOString().slice(0, 16)}" class="editable" data-field="date"></td>
                        <td><input type="text" value="${treatment.name}" class="editable" data-field="name"></td>
                        <td><input type="text" value="${treatment.dosage}" class="editable" data-field="dosage"></td>
                        <td><input type="text" value="${treatment.prescriptionID}" class="editable" data-field="prescriptionID"></td>
                        <td>
                            <button class="update10-btn">Update</button>
                            <button class="delete10-btn">Delete</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    document.getElementById('treatmentsList').innerHTML = table;
    attachTreatmentEventListeners();
}

// Attach event listeners for Update and Delete buttons
function attachTreatmentEventListeners() {
    // Update functionality
    document.querySelectorAll('.update10-btn').forEach(button => {
        button.addEventListener('click', async (event) => {
            const row = event.target.closest('tr');
            const id = row.dataset.id;
            const updatedTreatment = {
                id: row.querySelector('.editable[data-field="id"]').value,
                date: row.querySelector('.editable[data-field="date"]').value,
                name: row.querySelector('.editable[data-field="name"]').value,
                dosage: row.querySelector('.editable[data-field="dosage"]').value,
                prescriptionID: row.querySelector('.editable[data-field="prescriptionID"]').value,
            };

            try {
                const response = await fetch(`http://localhost:3000/api/treatments/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedTreatment),
                });

                const responseBody = await response.json();
                console.log(responseBody);

                if (response.ok) {
                    alert('Treatment updated successfully');
                    fetchTreatments();
                } else {
                    alert(`Failed to update treatment: ${responseBody.error}`);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error updating treatment');
            }
        });
    });

    // Delete functionality
    document.querySelectorAll('.delete10-btn').forEach(button => {
        button.addEventListener('click', async (event) => {
            const row = event.target.closest('tr');
            const id = row.dataset.id;

            try {
                const response = await fetch(`http://localhost:3000/api/treatments/${id}`, {
                    method: 'DELETE',
                });

                const responseBody = await response.json();
                console.log(responseBody);

                if (response.ok) {
                    row.remove();
                    alert('Treatment deleted successfully');
                    fetchTreatments(); // Refresh the list to ensure consistency
                } else {
                    alert(`Failed to delete treatment: ${responseBody.error}`);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error deleting treatment');
            }
        });
    });
}

// Add search event listener


// Search Treatments based on input
// Search Treatments based on input
// Search Treatments
async function searchTreatments() {
    const searchTerm = document.getElementById('treatmentSearch').value.toLowerCase().trim();

    if (!searchTerm) {
        fetchTreatments(); // If the search term is empty, fetch all treatments.
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/treatments');
        const allTreatments = await response.json();
        
        if (!Array.isArray(allTreatments)) {
            console.error("Error: Data is not in expected array format", allTreatments);
            alert("Unexpected data format from server.");
            return;
        }

        // Filter treatments based on the search term
        const filteredTreatments = allTreatments.filter(treatment =>
            treatment.name.toLowerCase().includes(searchTerm) || // Filter by name
            treatment.id.toString().includes(searchTerm) // Filter by ID
        );

        if (filteredTreatments.length === 0) {
            document.getElementById('treatmentsList').innerHTML = `
                <div class="no-results">No treatments found matching your search criteria.</div>
            `;
        } else {
            renderTreatmentsTable(filteredTreatments);
        }

    } catch (error) {
        console.error('Error searching treatments:', error);
        alert('Failed to search treatments');
    }
}

// Call search function on input change




document.getElementById('treatmentSearch').addEventListener('input', searchTreatments);

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchTreatments();
});
