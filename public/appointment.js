// Fetch Data for Patients, Doctors, Prescriptions, and Populate Dropdowns
async function fetchForeignData() {
    try {
        // Fetch data from all APIs concurrently
        const [patientsResponse, doctorsResponse, prescriptionsResponse] = await Promise.all([
            fetch('http://localhost:3000/api/patients'),
            fetch('http://localhost:3000/api/doctors'),
            fetch('http://localhost:3000/api/prescriptions'),
        ]);

        if (!patientsResponse.ok || !doctorsResponse.ok || !prescriptionsResponse.ok) {
            throw new Error('Failed to fetch foreign data');
        }

        // Parse JSON data
        const patients = await patientsResponse.json();
        const doctors = await doctorsResponse.json();
        const prescriptions = await prescriptionsResponse.json();

        // Populate Patient Dropdown
        const patientSelect = document.getElementById('patient_ID');
        patients.forEach(patient => {
            const option = document.createElement('option');
            option.value = patient.id; // Assuming `id` is the patient identifier
            option.textContent = patient.id; // Assuming patient has a name
            patientSelect.appendChild(option);
        });

        // Populate Doctor Dropdown
        const doctorSelect = document.getElementById('doctor_ID');
        doctors.forEach(doctor => {
            const option = document.createElement('option');
            option.value = doctor.id;
            option.textContent = doctor.id; // Assuming doctor has a name
            doctorSelect.appendChild(option);
        });

        // Populate Prescription Dropdown
        const prescriptionSelect = document.getElementById('prescription_ID');
        prescriptions.forEach(prescription => {
            const option = document.createElement('option');
            option.value = prescription.id;
            option.textContent = prescription.id; // Assuming prescription has an ID
            prescriptionSelect.appendChild(option);
        });

    } catch (error) {
        console.error('Error fetching foreign data:', error);
    }
}

// Add Appointment Data
async function addAppointment(event) {
    event.preventDefault();

    const appointmentData = {
        id: document.getElementById('appointmentID').value.trim(),
        prescriptionID: document.getElementById('prescription_ID').value,
        priority: document.getElementById('priority').value.trim(),
        patientID: document.getElementById('patient_ID').value,
        doctorID: document.getElementById('doctor_ID').value,
        date: document.getElementById('appointmentDate').value,
    };

    try {
        const response = await fetch('http://localhost:3000/api/appointments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(appointmentData),
        });

        if (response.ok) {
            alert('Appointment added successfully');
            document.getElementById('addAppointmentForm').reset();
            fetchAppointments();
        } else {
            const error = await response.json();
            alert(`Failed to add appointment: ${error.message}`);
        }
    } catch (error) {
        console.error('Error adding appointment:', error);
        alert('Error adding appointment');
    }
}

// Initialize the Page by Fetching Foreign Data and Binding Form Submission
document.addEventListener('DOMContentLoaded', () => {
    fetchForeignData();
    document.getElementById('addAppointmentForm').addEventListener('submit', addAppointment);
});



// Fetch all appointments
async function fetchAppointments() {
    try {
        const response = await fetch('http://localhost:3000/api/appointments');
        const appointments = await response.json();
        renderAppointmentsTable(appointments);
    } catch (error) {
        console.error('Error:', error);
    }
}


// Render appointments table
function renderAppointmentsTable(appointments) {
    const table = `
        <table class="appointment">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Prescription ID</th>
                    <th>Priority</th>
                    <th>Patient ID</th>
                    <th>Doctor ID</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${appointments.map(appointment => `
                    <tr data-id="${appointment.id}">
                        <td><input type="text" value="${appointment.id}" class="editable" data-field="id"></td>
                        <td><input type="text" value="${appointment.prescriptionID}" class="editable" data-field="prescriptionID"></td>
                        <td><input type="text" value="${appointment.priority}" class="editable" data-field="priority"></td>
                        <td><input type="text" value="${appointment.patientID}" class="editable" data-field="patientID"></td>
                        <td><input type="text" value="${appointment.doctorID}" class="editable" data-field="doctorID"></td>
                        <td><input type="datetime-local" value="${formatDateForInput(appointment.date)}" class="editable" data-field="date"></td>
                        <td>
                            <button class="update4-btn">Update</button>
                            <button class="delete4-btn">Delete</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    document.getElementById('appointmentsList').innerHTML = table;
    attachAppointmentEventListeners();
}

// Format date for input field
function formatDateForInput(dateString) {
    return dateString ? new Date(dateString).toISOString().slice(0, 16) : '';
}


// Attach event listeners for Update and Delete buttons
function attachAppointmentEventListeners() {
    // Update functionality
    document.querySelectorAll('.update4-btn').forEach(button => {
        button.addEventListener('click', async (event) => {
            const row = event.target.closest('tr');
            const id = row.dataset.id;

            const updatedData = {};
            row.querySelectorAll('.editable').forEach(input => {
                const field = input.dataset.field;
                updatedData[field] = input.value;
            });

            try {
                const response = await fetch(`http://localhost:3000/api/appointments/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedData),
                });

                if (response.ok) {
                    alert('Appointment updated successfully');
                    fetchAppointments(); // Refresh the appointments list after update
                } else {
                    alert('Failed to update appointment');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    });

    // Delete functionality
    document.querySelectorAll('.delete4-btn').forEach(button => {
       
        button.addEventListener('click', async (event) => {
            const row = event.target.closest('tr');
            const id = row.dataset.id;

            try {
                const response = await fetch(`http://localhost:3000/api/appointments/${id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    row.remove();
                    alert('Appointment deleted successfully');
                    fetchAppointments();
                } else {
                    alert('Failed to delete appointment');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    });
}


// Search functionality for appointments
async function searchAppointments() {
    const searchTerm = document.getElementById('appointmentSearch').value.toLowerCase();
    const searchType = document.getElementById('appointmentSearchType').value;

    try {
        const response = await fetch('http://localhost:3000/api/appointments');
        const allAppointments = await response.json();

        const filteredAppointments = allAppointments.filter(appointment => {
            if (searchTerm === '') return true;

            switch (searchType) {
                case 'id':
                    return appointment.id.toString() === searchTerm;
                case 'prescriptionID':
                    return appointment.prescriptionID.toString() === searchTerm;
                case 'patientID':
                    return appointment.patientID.toString() === searchTerm;
                case 'doctorID':
                    return appointment.doctorID.toString() === searchTerm;
                case 'all':
                default:
                    return appointment.id.toString().includes(searchTerm) ||
                           appointment.prescriptionID.toString().includes(searchTerm) ||
                           appointment.patientID.toString().includes(searchTerm) ||
                           appointment.doctorID.toString().includes(searchTerm);
            }
        });

        renderAppointmentsTable(filteredAppointments);

        // Show message if no results found
        const appointmentsListDiv = document.getElementById('appointmentsList');
        if (filteredAppointments.length === 0) {
            appointmentsListDiv.innerHTML += `
                <div class="no-results">
                    No appointments found matching your search criteria.
                </div>`;
        }
    } catch (error) {
        console.error('Error searching appointments:', error);
        alert('Failed to search appointments');
    }
}


// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchAppointments();
    document.getElementById('appointmentSearch').addEventListener('input', searchAppointments);
});
