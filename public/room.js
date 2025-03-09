




// Add new room
async function addRoom(event) {
    event.preventDefault();
    const roomData = {
        number: document.getElementById('roomNumber').value,
        type: document.getElementById('roomType').value,
        bedsAvail: document.getElementById('bedsAvail').value
    };

    // Simple form validation
    if (!roomData.number || !roomData.type || !roomData.bedsAvail) {
        alert('Please fill all the fields');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/rooms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(roomData)
        });

        if (response.ok) {
            alert('Room added successfully')
            document.getElementById('roomForm').reset();
            fetchRooms();
        } else {
            
            alert('Failed to add room');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error adding room');
    }
}

// Fetch all rooms
async function fetchRooms() {
    try {
        const response = await fetch('http://localhost:3000/api/rooms');
        const rooms = await response.json();
        renderRoomsTable(rooms);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Render rooms table
function renderRoomsTable(rooms) {
    const table = `
        <table class="room">
            <thead>
                <tr>
                    <th>Room Number</th>
                    <th>Room Type</th>
                    <th>Beds Available</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${rooms.map(room => `
                    <tr data-number="${room.number}">
                        <td>${room.number}</td>
                        <td><input type="text" value="${room.type}" class="editable" data-field="type"></td>
                        <td><input type="number" value="${room.bedsAvail}" class="editable" data-field="bedsAvail"></td>
                        <td>
                            <button class="update100-btn">Update</button>
                            <button class="delete100-btn">Delete</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    document.getElementById('roomsList').innerHTML = table;
    attachRoomEventListeners();
}

// Attach event listeners for Update and Delete buttons
function attachRoomEventListeners() {
    // Update functionality
    document.querySelectorAll('.update100-btn').forEach(button => {
        // alert("ekhanegu")

        button.addEventListener('click', async (event) => {
            const row = event.target.closest('tr');
            const number = row.dataset.number;

            const updatedData = {};
            row.querySelectorAll('.editable').forEach(input => {
                const field = input.dataset.field;
                updatedData[field] = input.value;
            });

            try {
                const response = await fetch(`http://localhost:3000/api/rooms/${number}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedData),
                });

                if (response.ok) {
                    alert('Room updated successfully');
                    fetchRooms();
                } else {
                    alert('Failed to update room');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    });

    // Delete functionality
    document.querySelectorAll('.delete100-btn').forEach(button => {
        // alert("ekhane")
        button.addEventListener('click', async (event) => {
            if (!confirm('Are you sure you want to delete this room?')) {
                return;
            }

            const row = event.target.closest('tr');
            const number = row.dataset.number;

            try {
                const response = await fetch(`http://localhost:3000/api/rooms/${number}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    row.remove();
                    alert('Room deleted successfully');
                } else {
                    alert('Failed to delete room');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    });
}

// Enhanced search functionality for rooms
async function searchRooms() {
    const searchTerm = document.getElementById('roomSearch').value.toLowerCase();
    const searchType = document.getElementById('roomSearchType').value;

    try {
        const response = await fetch('http://localhost:3000/api/rooms');
        const allRooms = await response.json();

        const filteredRooms = allRooms.filter(room => {
            if (searchTerm === '') return true;

            switch (searchType) {
                case 'number':
                    return room.number.toString() === searchTerm;
                case 'type':
                    return room.type.toLowerCase().includes(searchTerm);
                case 'all':
                default:
                    return room.number.toString() === searchTerm ||
                           room.type.toLowerCase().includes(searchTerm) ||
                           room.bedsAvail.toString() === searchTerm;
            }
        });

        renderRoomsTable(filteredRooms);

        if (filteredRooms.length === 0) {
            document.getElementById('roomsList').innerHTML += `
                <div class="no-results">
                    No rooms found matching your search criteria.
                </div>`;
        }
    } catch (error) {
        console.error('Error searching rooms:', error);
        alert('Failed to search rooms');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchRooms();
    document.getElementById('roomSearch')?.addEventListener('input', searchRooms);
});