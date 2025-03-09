// API URL - change this to match your server
const API_URL = 'http://localhost:3000/api';

// Global variables
let currentPage = 1;
let editMode = false;

// Get DOM elements
function getElements() {
    return {
        labTestForm: document.getElementById('labTestForm'),
        formTitle: document.getElementById('formTitle'),
        testIdInput: document.getElementById('testId'),
        testNameInput: document.getElementById('testName'),
        testDescriptionInput: document.getElementById('testDescription'),
        testDateInput: document.getElementById('testDate'),
        testResultInput: document.getElementById('testResult'),
        prescriptionIdSelect: document.getElementById('prescriptionId'),
        submitBtn: document.getElementById('submitBtn'),
        cancelBtn: document.getElementById('cancelBtn'),
        labTestsTableBody: document.getElementById('labTestsTableBody'),
        statusMessage: document.getElementById('statusMessage')
    };
}

// Display status message
function showStatus(message, isError = false) {
    const elements = getElements();
    if (!elements.statusMessage) return;
    
    elements.statusMessage.textContent = message;
    elements.statusMessage.className = isError ? 'status status-error' : 'status status-success';
    elements.statusMessage.style.display = 'block';
    
    // Hide after 3 seconds
    setTimeout(() => {
        elements.statusMessage.style.display = 'none';
    }, 3000);
}

// Load all lab tests
async function loadLabTests() {
    const elements = getElements();
    if (!elements.labTestsTableBody) return;
    
    try {
        const response = await fetch(`${API_URL}/lab-tests`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch lab tests');
        }
        
        const data = await response.json();
        
        elements.labTestsTableBody.innerHTML = '';
        
        if (data.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="7" class="text-center">No lab tests found</td>`;
            elements.labTestsTableBody.appendChild(row);
            return;
        }
        
        data.forEach(test => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${test.ID}</td>
                <td>${test.TEST_NAME}</td>
                <td>${test.TEST_DESCRIPTION || '-'}</td>
                <td>${new Date(test.TEST_DATE).toLocaleDateString()}</td>
                <td>${test.TEST_RESULT || '-'}</td>
                <td>${test.PRESCRIPTION_ID || '-'}</td>
                <td>
                    <a href="lab-tests-form.html?id=${test.ID}" class="btn btn-sm btn-primary">Edit</a>
                    <button class="btn btn-sm btn-danger delete-btn" data-id="${test.ID}">Delete</button>
                </td>
            `;
            elements.labTestsTableBody.appendChild(row);
        });
        
        // Add event listeners to delete buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => deleteLabTest(e.target.dataset.id));
        });
    } catch (error) {
        console.error('Error loading lab tests:', error);
        showStatus('Failed to load lab tests.', true);
    }
}

// Load available prescriptions for dropdown
async function loadPrescriptions() {
    const elements = getElements();
    if (!elements.prescriptionIdSelect) return;
    
    try {
        const response = await fetch(`${API_URL}/prescriptions`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch prescriptions');
        }
        
        const data = await response.json();
        
        // Keep the "None" option
        elements.prescriptionIdSelect.innerHTML = '<option value="">None</option>';
        
        data.forEach(prescription => {
            const option = document.createElement('option');
            option.value = prescription.ID;
            option.textContent = `Prescription ID: ${prescription.ID}`;
            elements.prescriptionIdSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading prescriptions:', error);
        showStatus('Failed to load prescriptions.', true);
    }
}

// Load lab test by ID for editing
async function loadLabTestById(id) {
    const elements = getElements();
    if (!elements.labTestForm) return;
    
    try {
        const response = await fetch(`${API_URL}/lab-tests/${id}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch lab test details');
        }
        
        const test = await response.json();
        
        // Populate form
        elements.testIdInput.value = test.ID;
        elements.testNameInput.value = test.TEST_NAME;
        elements.testDescriptionInput.value = test.TEST_DESCRIPTION || '';
        if (elements.testDateInput) {
            // Format date to YYYY-MM-DD for the date input
            const date = new Date(test.TEST_DATE);
            const formattedDate = date.toISOString().split('T')[0];
            elements.testDateInput.value = formattedDate;
        }
        elements.testResultInput.value = test.TEST_RESULT || '';
        elements.prescriptionIdSelect.value = test.PRESCRIPTION_ID || '';
        
        // Change button text and form title
        elements.formTitle.textContent = 'Edit Lab Test';
        elements.submitBtn.textContent = 'Update Lab Test';
        
        editMode = true;
    } catch (error) {
        console.error('Error fetching lab test details:', error);
        showStatus('Failed to load lab test details.', true);
    }
}

// Submit form handler
function setupFormSubmission() {
    const elements = getElements();
    if (!elements.labTestForm) return;
    
    elements.labTestForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const labTest = {
            test_name: elements.testNameInput.value,
            test_description: elements.testDescriptionInput.value,
            test_date: elements.testDateInput ? elements.testDateInput.value : new Date().toISOString().split('T')[0],
            test_result: elements.testResultInput.value,
            prescription_id: elements.prescriptionIdSelect.value ? parseInt(elements.prescriptionIdSelect.value) : null
        };
        
        try {
            let url = `${API_URL}/lab-tests`;
            let method = 'POST';
            
            // If testId has a value, we're updating
            if (elements.testIdInput.value) {
                url = `${API_URL}/lab-tests/${elements.testIdInput.value}`;
                method = 'PUT';
            }
            
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(labTest)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save lab test');
            }
            
            showStatus(elements.testIdInput.value ? 'Lab test updated successfully!' : 'Lab test added successfully!');
            
            // Redirect to display page after successful submission
            setTimeout(() => {
                window.location.href = 'lab-tests-display.html';
            }, 1500);
        } catch (error) {
            console.error('Error saving lab test:', error);
            showStatus(error.message || 'Failed to save lab test.', true);
        }
    });
}

// Delete lab test
async function deleteLabTest(id) {
    if (confirm('Are you sure you want to delete this lab test?')) {
        try {
            const response = await fetch(`${API_URL}/lab-tests/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete lab test');
            }
            
            showStatus('Lab test deleted successfully!');
            loadLabTests(); // Refresh the table
        } catch (error) {
            console.error('Error deleting lab test:', error);
            showStatus(error.message || 'Failed to delete lab test.', true);
        }
    }
}

// Setup cancel button
function setupCancelButton() {
    const elements = getElements();
    if (!elements.cancelBtn) return;
    
    elements.cancelBtn.addEventListener('click', function() {
        if (editMode) {
            // If we're in edit mode, go back to display page
            window.location.href = 'lab-tests-display.html';
        } else {
            // Otherwise just reset the form
            elements.labTestForm.reset();
            elements.testIdInput.value = '';
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the display page or form page
    const isDisplayPage = document.getElementById('labTestsTableBody') !== null;
    const isFormPage = document.getElementById('labTestForm') !== null;
    
    // Initialize based on the current page
    if (isDisplayPage) {
        loadLabTests();
    }
    
    if (isFormPage) {
        loadPrescriptions();
        setupFormSubmission();
        setupCancelButton();
        
        // Check if we're editing an existing record (URL has id parameter)
        const urlParams = new URLSearchParams(window.location.search);
        const labTestId = urlParams.get('id');
        
        if (labTestId) {
            loadLabTestById(labTestId);
        }
    }
});