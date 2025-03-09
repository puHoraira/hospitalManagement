


// Add new doctor
async function addDoctor(event) {
    event.preventDefault();
    const doctorData = {
        name: document.getElementById('doctorName').value,
        specialization: document.getElementById('specialization').value,
        experience: document.getElementById('experience').value,
        contact: document.getElementById('doctorContact').value,
        email: document.getElementById('doctorEmail').value
    };

    // Simple form validation
    if (!doctorData.name || !doctorData.specialization || !doctorData.contact || !doctorData.email) {
        alert('Please fill all the fields');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/doctors', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(doctorData)
        });

        if (response.ok) {
            alert("doctor added successfully");
            document.getElementById('doctorForm').reset();
            fetchDoctors();
        } else {
            alert('Failed to add doctor');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error adding doctor');
    }
}

// Fetch all doctors
async function fetchDoctors() {
    try {
        const response = await fetch('http://localhost:3000/api/doctors');
        const doctors = await response.json();
        renderDoctorsTable(doctors);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Render doctors table
function renderDoctorsTable(doctors) {
    const table = `
        <table class="doctor">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Specialization</th>
                    <th>Experience</th>
                    <th>Contact</th>
                    <th>Email</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${doctors.map(doctor => `
                    <tr data-id="${doctor.id}">
                        <td>${doctor.id}</td>
                        <td><input type="text" value="${doctor.name}" class="editable" data-field="name"></td>
                        <td><input type="text" value="${doctor.specialization}" class="editable" data-field="specialization"></td>
                        <td><input type="text" value="${doctor.experience}" class="editable" data-field="experience"></td>
                        <td><input type="text" value="${doctor.contact}" class="editable" data-field="contact"></td>
                        <td><input type="text" value="${doctor.email}" class="editable" data-field="email"></td>
                        <td>
                            <button class="upde20-btn">Update</button>
                            <button class="delete20-btn">Delete</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    document.getElementById('doctorsList').innerHTML = table;
    attachEventListeners1();
}

function attachEventListeners1() {
    // Update functionality
    document.querySelectorAll('.upde20-btn').forEach(button => {
        button.addEventListener('click', async (event) => {
            const row = event.target.closest('tr');
            const id = row.dataset.id;

            const updatedData = {};
            row.querySelectorAll('.editable').forEach(input => {
                const field = input.dataset.field;
                updatedData[field] = input.value;
            });

            try {
                const response = await fetch(`http://localhost:3000/api/doctors/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedData),
                });

                if (response.ok) {
                    alert('Doctor updated successfully');
                    fetchDoctors(); // Refresh the doctors list after update
                } else {
                    alert('Failed to update doctor');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    });

    // Delete functionality
    document.querySelectorAll('.delete20-btn').forEach(button => {
        button.addEventListener('click', async (event) => {
            const row = event.target.closest('tr');
            const id = row.dataset.id;

            try {
                const response = await fetch(`http://localhost:3000/api/doctors/${id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    row.remove();
                    alert('Doctor deleted successfully');
                    fetchDoctors();
                } else {
                    alert('Failed to delete doctor');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    });
}
// Enhanced search functionality for doctors
async function searchDoctors1() {
    const searchTerm = document.getElementById('doctorSearch').value.toLowerCase();
    const searchType = document.getElementById('searchType').value; // Dropdown for search type

    try {
        // Get all doctors
        const response = await fetch('http://localhost:3000/api/doctors');
        const allDoctors = await response.json();

        // Filter doctors based on search criteria
        const filteredDoctors = allDoctors.filter(doctor => {
            if (searchTerm === '') return true; // Show all if search is empty

            switch (searchType) {
                case 'id':
                    return doctor.id.toString() === searchTerm;
                case 'name':
                    return doctor.name.toLowerCase().includes(searchTerm);
                case 'specialization':
                    return doctor.specialization.toLowerCase().includes(searchTerm);
                case 'all':
                default:
                    // Search in all fields
                    return doctor.id.toString() === searchTerm ||
                        doctor.name.toLowerCase().includes(searchTerm) ||
                        doctor.specialization.toLowerCase().includes(searchTerm) ||
                        doctor.email.toLowerCase().includes(searchTerm) ||
                        doctor.contact.toLowerCase().includes(searchTerm);
            }
        });

        renderDoctorsTable(filteredDoctors);

        // Show message if no results found
        const doctorsListDiv = document.getElementById('doctorsList');
        if (filteredDoctors.length === 0) {
            doctorsListDiv.innerHTML += `
                <div class="no-results">
                    No doctors found matching your search criteria.
                </div>`;
        }
    } catch (error) {
        console.error('Error searching doctors:', error);
        alert('Failed to search doctors');
    }
}

// Add search event listener
document.getElementById('doctorSearch').addEventListener('input', searchDoctors1);

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchDoctors();
});





