// Add new prescription
async function addPrescription(event) {
    event.preventDefault();
    const prescriptionData = {
        id: document.getElementById('prescriptionID').value,
    };

    // Simple form validation
    if (!prescriptionData.id) {
        alert('Please provide a valid ID');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/prescriptions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(prescriptionData),
        });

        if (response.ok) {
            document.getElementById('prescriptionForm').reset();
            fetchPrescriptions();
        } else {
            alert('Failed to add prescription');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error adding prescription');
    }
}

// Fetch all prescriptions
async function fetchPrescriptions() {
    try {
        const response = await fetch('http://localhost:3000/api/prescriptions');
        const prescriptions = await response.json();
        renderPrescriptionsTable(prescriptions);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Render prescriptions table
function renderPrescriptionsTable(prescriptions) {
    const table = `
        <table class = "tena">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${prescriptions.map(prescription => `
                    <tr data-id="${prescription.id}">
                        <td><input type="text" value="${prescription.id}" class="editable" data-field="id"></td>
                        <td>
                            <button class="update8-btn">Update</button>
                            <button class="delete8-btn">Delete</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    document.getElementById('prescriptionsList').innerHTML = table;
    attachEventListeners2();
}

// Attach event listeners for Update and Delete buttons
function attachEventListeners2() {
   
    // Update functionality
    document.querySelectorAll('.update8-btn').forEach(button => {

        button.addEventListener('click', async (event) => {

            const row = event.target.closest('tr');
            const id = row.dataset.id;
            const updatedID = row.querySelector('.editable').value;

            try {
                const response = await fetch(`http://localhost:3000/api/prescriptions/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: updatedID }),
                });

                if (response.ok) {
                    alert('Prescription updated successfully');
                    fetchPrescriptions();
                } else {
                    alert('Failed to update prescription');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    });

    // Delete functionality
    document.querySelectorAll('.delete8-btn').forEach(button => {
        // alert("hello")
        button.addEventListener('click', async (event) => {
            const row = event.target.closest('tr');
            const id = row.dataset.id;

            try {
                const response = await fetch(`http://localhost:3000/api/prescriptions/${id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    row.remove();
                    alert('Prescription deleted successfully');
                    fetchPrescriptions();
                } else {
                    alert('Failed to delete prescription');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    });
}

// Search prescriptions
async function searchPrescriptions() {
    const searchTerm = document.getElementById('prescriptionSearch').value.toLowerCase();

    try {
        const response = await fetch('http://localhost:3000/api/prescriptions');
        const allPrescriptions = await response.json();

        const filteredPrescriptions = allPrescriptions.filter(prescription =>
            prescription.id.toString().includes(searchTerm)
        );

        renderPrescriptionsTable(filteredPrescriptions);

        if (filteredPrescriptions.length === 0) {
            document.getElementById('prescriptionsList').innerHTML += `
                <div class="no-results">No prescriptions found matching your search criteria.</div>
            `;
        }
    } catch (error) {
        console.error('Error searching prescriptions:', error);
        alert('Failed to search prescriptions');
    }
}

// Add search event listener
document.getElementById('prescriptionSearch').addEventListener('input', searchPrescriptions);

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchPrescriptions();
});
