// Fetch Data for Patients, Rooms, and Populate Dropdowns
async function fetchPatientAndRoomData() {
    try {
        // Fetch data from both APIs concurrently
        const [patientsResponse, roomsResponse] = await Promise.all([
            fetch('http://localhost:3000/api/patients'),
            fetch('http://localhost:3000/api/rooms'),
        ]);

        if (!patientsResponse.ok && !roomsResponse.ok) {
            throw new Error('Failed to fetch patient or room data');
        }

        // Parse JSON data
        const patients = await patientsResponse.json();
        const rooms = await roomsResponse.json();

        // Populate Patient Dropdown
        const patientSelect = document.getElementById('patientID');
        patients.forEach(patient => {
            const option = document.createElement('option');
            option.value = patient.id; // Assuming `id` is the patient identifier
            option.textContent = patient.id; // Optionally include patient name
            patientSelect.appendChild(option);
        });

        // Populate Room Dropdown
  
        // Populate Room Dropdown
        const roomSelect = document.getElementById('admissionRoomNumber');
        rooms.forEach(room => {
            const option = document.createElement('option');
            option.value = room.number; 
            option.textContent = room.number;
            roomSelect.appendChild(option);
        });

    } catch (error) {
        console.error('Error fetching patient or room data:', error);
    }
}

async function addAdmission(event) {
    event.preventDefault();

    const admissionData = {
        id: document.getElementById('admissionID').value.trim(),
        patientID: document.getElementById('patientID').value.trim(),
        roomNumber: document.getElementById('admissionRoomNumber').value.trim(),
        admitDate: document.getElementById('admitDate').value,
        dischargeDate: document.getElementById('dischargeDate').value.trim() || null,
    };

    try {
        const response = await fetch('http://localhost:3000/api/admissions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(admissionData),
        });

        if (response.ok) {
            alert('Admission added successfully');
            document.getElementById('admissionForm').reset();
        } else {
            const error = await response.json();
            alert(`Failed to add admission: ${error.message}`);
        }
    } catch (error) {
        console.error('Error adding admission:', error);
        alert('Error adding admission');
    }
}

// Initialize the Page by Fetching Dropdown Data
document.addEventListener('DOMContentLoaded', () => {
    fetchPatientAndRoomData();
});


// Fetch all admissions
async function fetchAdmissions() {
    try {
        const response = await fetch('http://localhost:3000/api/admissions');
        const admissions = await response.json();
        renderAdmissionsTable(admissions);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Render admissions table
function renderAdmissionsTable(admissions) {
    const table = `
        <table class="admission">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Patient ID</th>
                    <th>Room Number</th>
                    <th>Admit Date</th>
                    <th>Discharge Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${admissions.map(admission => `
                    <tr data-id="${admission.id}">
                        <td><input type="text" value="${admission.id}" class="editable" data-field="id"></td>
                        <td><input type="text" value="${admission.patientID}" class="editable" data-field="patientID"></td>
                        <td><input type="text" value="${admission.roomNumber}" class="editable" data-field="roomNumber"></td>
                        <td><input type="datetime-local" value="${formatDateForInput(admission.admitDate)}" class="editable" data-field="admitDate"></td>
                        <td><input type="datetime-local" value="${admission.dischargeDate ? formatDateForInput(admission.dischargeDate) : ''}" class="editable" data-field="dischargeDate"></td>
                        <td>
                            <button class="update3-btn">Update</button>
                            <button class="delete3-btn">Delete</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    document.getElementById('admissionsList').innerHTML = table;
    attachAdmissionEventListeners();
}

// Format date for input field
function formatDateForInput(dateString) {
    return dateString ? new Date(dateString).toISOString().slice(0, 16) : '';
}

// Attach event listeners for Update and Delete buttons
function attachAdmissionEventListeners() {
    // Update functionality
    document.querySelectorAll('.update3-btn').forEach(button => {
        button.addEventListener('click', async (event) => {
            const row = event.target.closest('tr');
            const id = row.dataset.id;

            const updatedData = {};
            row.querySelectorAll('.editable').forEach(input => {
                const field = input.dataset.field;
                updatedData[field] = input.value;
            });

            try {
                const response = await fetch(`http://localhost:3000/api/admissions/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedData),
                });

                if (response.ok) {
                    alert('Admission updated successfully');
                    fetchAdmissions(); // Refresh the admissions list after update
                } else {
                    alert('Failed to update admission');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    });

    // Delete functionality
    document.querySelectorAll('.delete3-btn').forEach(button => {
        button.addEventListener('click', async (event) => {
            const row = event.target.closest('tr');
            const id = row.dataset.id;

            try {
                const response = await fetch(`http://localhost:3000/api/admissions/${id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    row.remove();
                    alert('Admission deleted successfully');
                } else {
                    alert('Failed to delete admission');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    });
}

// Search functionality for admissions
async function searchAdmissions() {
    const searchTerm = document.getElementById('admissionSearch').value.toLowerCase();
    const searchType = document.getElementById('searchType').value;

    try {
        const response = await fetch('http://localhost:3000/api/admissions');
        const allAdmissions = await response.json();

        const filteredAdmissions = allAdmissions.filter(admission => {
            if (searchTerm === '') return true;

            switch (searchType) {
                case 'id':
                    return admission.id.toString() === searchTerm;
                case 'patientID':
                    return admission.patientID.toString() === searchTerm;
                case 'roomNumber':
                    return admission.roomNumber.toString() === searchTerm;
                case 'all':
                default:
                    return admission.id.toString().includes(searchTerm) ||
                           admission.patientID.toString().includes(searchTerm) ||
                           admission.roomNumber.toString().includes(searchTerm);
            }
        });

        renderAdmissionsTable(filteredAdmissions);

        // Show message if no results found
        const admissionsListDiv = document.getElementById('admissionsList');
        if (filteredAdmissions.length === 0) {
            admissionsListDiv.innerHTML += `
                <div class="no-results">
                    No admissions found matching your search criteria.
                </div>`;
        }
    } catch (error) {
        console.error('Error searching admissions:', error);
        alert('Failed to search admissions');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchAdmissions();
    document.getElementById('admissionSearch').addEventListener('input', searchAdmissions);
});
