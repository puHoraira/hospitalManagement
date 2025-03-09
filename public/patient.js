const API_URL = 'http://localhost:3000/api';
 



 // Add Patient
 async function addPatient(event) {
    event.preventDefault();
    const patientData = {
        name: document.getElementById('patientName').value,
        address: document.getElementById('patientAddress').value,
        contact: document.getElementById('patientContact').value,
        email: document.getElementById('patientEmail').value
    };

    try {
        const response = await fetch('http://localhost:3000/api/patients', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(patientData)
        });

        if (response.ok) {
            alert("patient added successfuly")
            document.getElementById('patientForm').reset();
            //fetchPatients();
        }
    } catch (error) {
        console.error('Error:', error);
    }
}


// Enhanced search functionality
async function searchPatients() {
    const searchTerm = document.getElementById('patientSearch').value.toLowerCase();
    const searchType = document.getElementById('searchType').value; // Add this dropdown to HTML
    
    try {
        // Get all patients first
        const response = await fetch(`${API_URL}/patients`);
        const allPatients = await response.json();
        
        // Filter patients based on search criteria
        const filteredPatients = allPatients.filter(patient => {
            if (searchTerm === '') return true; // Show all if search is empty
            
            switch(searchType) {
                case 'id':
                    return patient.id.toString() === searchTerm;
                case 'name':
                    return patient.name.toLowerCase().includes(searchTerm);
                case 'all':
                default:
                    // Search in all fields
                    return patient.id.toString() === searchTerm ||
                           patient.name.toLowerCase().includes(searchTerm) ||
                           patient.email.toLowerCase().includes(searchTerm) ||
                           patient.contact.toLowerCase().includes(searchTerm);
            }
        });
        
        displayPatients(filteredPatients);
        
        // Show message if no results found
        const patientsListDiv = document.getElementById('patientsList');
        if (filteredPatients.length === 0) {
            patientsListDiv.innerHTML += `
                <div class="no-results">
                    No patients found matching your search criteria.
                </div>`;
        }
    } catch (error) {
        console.error('Error searching patients:', error);
        alert('Failed to search patients');
    }
}

// Update display function to highlight search terms
function displayPatients(patients) {
    const searchTerm = document.getElementById('patientSearch').value.toLowerCase();
    const patientsListDiv = document.getElementById('patientsList');
    
    let html = `
        <div class="search-controls">
            <select id="searchType" onchange="searchPatients()">
                <option value="all">All Fields</option>
                <option value="id">ID</option>
                <option value="name">Name</option>
            </select>
            <input 
                type="text" 
                id="patientSearch" 
                placeholder="Search patients..." 
                onkeyup="searchPatients()"
            >
        </div>
        <table class="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Contact</th>
                    <th>Email</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;

    patients.forEach(patient => {
        // Highlight matching text if there's a search term
        const highlightText = (text, searchTerm) => {
            if (!searchTerm) return text;
            const regex = new RegExp(`(${searchTerm})`, 'gi');
            return text.toString().replace(regex, '<mark>$1</mark>');
        };

        html += `
            <tr>
                <td>${highlightText(patient.id, searchTerm)}</td>
                <td>
                    <input type="text" id="name-${patient.id}" 
                           value="${patient.name}">
                </td>
                <td>
                    <input type="text" id="address-${patient.id}" 
                           value="${patient.address}">
                </td>
                <td>
                    <input type="text" id="contact-${patient.id}" 
                           value="${patient.contact}">
                </td>
                <td>
                    <input type="text" id="email-${patient.id}" 
                           value="${patient.email}">
                </td>
                <td>
                    <button class="update-btn" onclick="updatePatient(${patient.id})">Update</button>
                    <button class="delete-btn" onclick="deletePatient(${patient.id})">Delete</button>
                </td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;
    patientsListDiv.innerHTML = html;
}



// Update patient
async function updatePatient(id) {
    const patientData = {
        name: document.getElementById(`name-${id}`).value,
        address: document.getElementById(`address-${id}`).value,
        contact: document.getElementById(`contact-${id}`).value,
        email: document.getElementById(`email-${id}`).value
    };

    try {
        const response = await fetch(`${API_URL}/patients/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(patientData)
        });

        if (response.ok) {
            alert('Patient updated successfully');
            loadPatients();
        } else {
            throw new Error('Failed to update patient');
        }
    } catch (error) {
        console.error('Error updating patient:', error);
        alert('Failed to update patient');
    }
}

// Delete patient
async function deletePatient(id) {
    if (!confirm('Are you sure you want to delete this patient?')) {
        return;
    }

    try {
        

        const response = await fetch(`${API_URL}/patients/${id}`, {
            
            method: 'DELETE'
        });
       

        if (response.ok) {
            alert('Patient deleted successfully');
            loadPatients();
          
            //loadPatients();
        } else {
            throw new Error('Failed to delete patient');
        }
    } catch (error) {
        console.error('Error deleting patient:', error);
        alert('Failed to delete patient');
    }
}

// Load all patients
async function loadPatients() {
    try {
        const response = await fetch(`${API_URL}/patients`);
        const patients = await response.json();
        displayPatients(patients);
    } catch (error) {
        console.error('Error loading patients:', error);
        // alert('Failed to load patients');
    }
}

// Display patients in table format
// function displayPatients(patients) {
//     const patientsListDiv = document.getElementById('patientsList');
//     let html = `
//         <table class="table">
//             <thead>
//                 <tr>
//                     <th>ID</th>
//                     <th>Name</th>
//                     <th>Address</th>
//                     <th>Contact</th>
//                     <th>Email</th>
//                     <th>Actions</th>
//                 </tr>
//             </thead>
//             <tbody>
//     `;

//     patients.forEach(patient => {
//         html += `
//             <tr>
//                 <td>${patient.id}</td>
//                 <td>
//                     <input type="text" id="name-${patient.id}" value="${patient.name}">
//                 </td>
//                 <td>
//                     <input type="text" id="address-${patient.id}" value="${patient.address}">
//                 </td>
//                 <td>
//                     <input type="text" id="contact-${patient.id}" value="${patient.contact}">
//                 </td>
//                 <td>
//                     <input type="text" id="email-${patient.id}" value="${patient.email}">
//                 </td>
//                 <td>
//                     <button onclick="updatePatient(${patient.id})">Update</button>
//                     <button onclick="deletePatient(${patient.id})">Delete</button>
//                 </td>
//             </tr>
//         `;
//     });

//     html += `
//             </tbody>
//         </table>
//     `;
//     patientsListDiv.innerHTML = html;
// }
function displayPatients(patients) {
    const patientsListDiv = document.getElementById('patientsList');
    let html = `
        
        <table class="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Contact</th>
                    <th>Email</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;

    patients.forEach(patient => {
        html += `
            <tr>
                <td>${patient.id}</td>
                <td>
                    <input type="text" id="name-${patient.id}" value="${patient.name}">
                </td>
                <td>
                    <input type="text" id="address-${patient.id}" value="${patient.address}">
                </td>
                <td>
                    <input type="text" id="contact-${patient.id}" value="${patient.contact}">
                </td>
                <td>
                    <input type="text" id="email-${patient.id}" value="${patient.email}">
                </td>
                <td>
                    <button class="update-btn" onclick="updatePatient(${patient.id})">Update</button>
                    <button class="delete-btn" onclick="deletePatient(${patient.id})">Delete</button>
                </td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;

    patientsListDiv.innerHTML = html;
}






// Load patients when the page loads
document.addEventListener('DOMContentLoaded', loadPatients);




// const API_URL = 'http://localhost:3000/api';
//         let currentPatientId = null;



//          // Add Patient
//  async function addPatient(event) {
//     event.preventDefault();
//     const patientData = {
//         name: document.getElementById('patientName').value,
//         address: document.getElementById('patientAddress').value,
//         contact: document.getElementById('patientContact').value,
//         email: document.getElementById('patientEmail').value
//     };

//     try {
//         const response = await fetch('http://localhost:3000/api/patients', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(patientData)
//         });

//         if (response.ok) {
//             document.getElementById('patientForm').reset();
//             //fetchPatients();
//         }
//     } catch (error) {
//         console.error('Error:', error);
//     }
// }



// // Enhanced search functionality
// async function searchPatients() {
//     const searchTerm = document.getElementById('patientSearch').value.toLowerCase();
//     const searchType = document.getElementById('searchType').value; // Add this dropdown to HTML
    
//     try {
//         // Get all patients first
//         const response = await fetch(`${API_URL}/patients`);
//         const allPatients = await response.json();
        
//         // Filter patients based on search criteria
//         const filteredPatients = allPatients.filter(patient => {
//             if (searchTerm === '') return true; // Show all if search is empty
            
//             switch(searchType) {
//                 case 'id':
//                     return patient.id.toString() === searchTerm;
//                 case 'name':
//                     return patient.name.toLowerCase().includes(searchTerm);
//                 case 'all':
//                 default:
//                     // Search in all fields
//                     return patient.id.toString() === searchTerm ||
//                            patient.name.toLowerCase().includes(searchTerm) ||
//                            patient.email.toLowerCase().includes(searchTerm) ||
//                            patient.contact.toLowerCase().includes(searchTerm);
//             }
//         });
        
//         displayPatients(filteredPatients);
        
//         // Show message if no results found
//         const patientsListDiv = document.getElementById('patientsList');
//         if (filteredPatients.length === 0) {
//             patientsListDiv.innerHTML += `
//                 <div class="no-results">
//                     No patients found matching your search criteria.
//                 </div>`;
//         }
//     } catch (error) {
//         console.error('Error searching patients:', error);
//         alert('Failed to search patients');
//     }
// }






//         // Load all patients
//         async function loadPatients() {
//             try {
//                 const response = await fetch(`${API_URL}/patients`);
//                 const patients = await response.json();
//                 displayPatients(patients);
//             } catch (error) {
//                 console.error('Error loading patients:', error);
//                 alert('Failed to load patients');
//             }
//         }

//         // Display patients
//         function displayPatients(patients) {
//             const patientsListDiv = document.getElementById('patientsList');
//             let html = `
//                 <table class="table">
//                     <thead>
//                         <tr>
//                             <th>ID</th>
//                             <th>Name</th>
//                             <th>Address</th>
//                             <th>Contact</th>
//                             <th>Email</th>
//                             <th>Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//             `;

//             patients.forEach(patient => {
//                 html += `
//                     <tr>
//                         <td>${patient.id}</td>
//                         <td>${patient.name}</td>
//                         <td>${patient.address}</td>
//                         <td>${patient.contact}</td>
//                         <td>${patient.email}</td>
//                         <td>
//                             <button class="update-btn" onclick="openUpdateModal(${patient.id}, '${patient.name}', '${patient.address}', '${patient.contact}', '${patient.email}')">Update</button>
//                             <button class="delete-btn" onclick="deletePatient(${patient.id})">Delete</button>
//                         </td>
//                     </tr>
//                 `;
//             });

//             html += `
//                     </tbody>
//                 </table>
//             `;
//             patientsListDiv.innerHTML = html;
//         }

//         // Open modal with patient details
//         function openUpdateModal(id, name, address, contact, email) {
//             currentPatientId = id;
//             document.getElementById('updateName').value = name;
//             document.getElementById('updateAddress').value = address;
//             document.getElementById('updateContact').value = contact;
//             document.getElementById('updateEmail').value = email;
//             document.getElementById('updateModal').style.display = 'flex';
//         }

//         // Close modal
//         function closeModal() {
//             document.getElementById('updateModal').style.display = 'none';
//             currentPatientId = null;
//         }

//         // Save updated patient
//         async function savePatient() {
//             if (!currentPatientId) return;

//             const patientData = {
//                 name: document.getElementById('updateName').value,
//                 address: document.getElementById('updateAddress').value,
//                 contact: document.getElementById('updateContact').value,
//                 email: document.getElementById('updateEmail').value,
//             };

//             try {
//                 const response = await fetch(`${API_URL}/patients/${currentPatientId}`, {
//                     method: 'PUT',
//                     headers: {
//                         'Content-Type': 'application/json'
//                     },
//                     body: JSON.stringify(patientData)
//                 });

//                 if (response.ok) {
//                     alert('Patient updated successfully');
//                     closeModal();
//                     loadPatients();
//                 } else {
//                     throw new Error('Failed to update patient');
//                 }
//             } catch (error) {
//                 console.error('Error updating patient:', error);
//                 alert('Failed to update patient');
//             }
//         }

//         // Delete patient
//         async function deletePatient(id) {
//             if (!confirm('Are you sure you want to delete this patient?')) return;

//             try {
//                 const response = await fetch(`${API_URL}/patients/${id}`, { method: 'DELETE' });

//                 if (response.ok) {
//                     alert('Patient deleted successfully');
//                     loadPatients();
//                 } else {
//                     throw new Error('Failed to delete patient');
//                 }
//             } catch (error) {
//                 console.error('Error deleting patient:', error);
//                 alert('Failed to delete patient');
//             }
//         }

//         // Load patients on page load
//         document.addEventListener('DOMContentLoaded', loadPatients);
