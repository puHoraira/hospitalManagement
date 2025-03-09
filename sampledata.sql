-- Doctor Table
INSERT INTO Doctor VALUES (1, 'Dr. John Smith', 'Cardiology', 15, '+1-555-123-4567', 'john.smith@hospital.com');
INSERT INTO Doctor VALUES (2, 'Dr. Emily Johnson', 'Neurology', 10, '+1-555-234-5678', 'emily.johnson@hospital.com');
INSERT INTO Doctor VALUES (3, 'Dr. Michael Brown', 'Orthopedics', 12, '+1-555-345-6789', 'michael.brown@hospital.com');
INSERT INTO Doctor VALUES (4, 'Dr. Sarah Wilson', 'Pediatrics', 8, '+1-555-456-7890', 'sarah.wilson@hospital.com');
INSERT INTO Doctor VALUES (5, 'Dr. David Lee', 'Oncology', 20, '+1-555-567-8901', 'david.lee@hospital.com');

-- Patient Table
INSERT INTO Patient VALUES (101, 'Alice Thompson', '123 Main St, Cityville', '+1-555-111-2222', 'alice.thompson@email.com');
INSERT INTO Patient VALUES (102, 'Bob Anderson', '456 Oak Ave, Townsburg', '+1-555-222-3333', 'bob.anderson@email.com');
INSERT INTO Patient VALUES (103, 'Carol Martinez', '789 Pine Rd, Villageton', '+1-555-333-4444', 'carol.martinez@email.com');
INSERT INTO Patient VALUES (104, 'Daniel Jackson', '101 Elm Blvd, Hamletville', '+1-555-444-5555', 'daniel.jackson@email.com');
INSERT INTO Patient VALUES (105, 'Eva Rodriguez', '202 Maple Ln, Boroughtown', '+1-555-555-6666', 'eva.rodriguez@email.com');
INSERT INTO Patient VALUES (106, 'Frank Miller', '303 Cedar Dr, Districtville', '+1-555-666-7777', 'frank.miller@email.com');
INSERT INTO Patient VALUES (107, 'Grace Kim', '404 Birch St, Regionville', '+1-555-777-8888', 'grace.kim@email.com');

-- Room Table
INSERT INTO Room VALUES (201, 'General Ward', 4);
INSERT INTO Room VALUES (202, 'Semi-Private', 2);
INSERT INTO Room VALUES (203, 'Private', 1);
INSERT INTO Room VALUES (204, 'ICU', 1);
INSERT INTO Room VALUES (205, 'Pediatric', 3);
INSERT INTO Room VALUES (206, 'Maternity', 2);
INSERT INTO Room VALUES (207, 'Emergency', 5);

-- Prescription Table
INSERT INTO Prescription VALUES (301);
INSERT INTO Prescription VALUES (302);
INSERT INTO Prescription VALUES (303);
INSERT INTO Prescription VALUES (304);
INSERT INTO Prescription VALUES (305);
INSERT INTO Prescription VALUES (306);
INSERT INTO Prescription VALUES (307);
INSERT INTO Prescription VALUES (308);

-- Treatment Table
INSERT INTO Treatment VALUES (401, TIMESTAMP '2024-03-01 10:30:00', 'Atenolol', '50mg daily', 301);
INSERT INTO Treatment VALUES (402, TIMESTAMP '2024-03-02 11:45:00', 'Amoxicillin', '500mg twice daily', 302);
INSERT INTO Treatment VALUES (403, TIMESTAMP '2024-03-03 09:15:00', 'Ibuprofen', '400mg as needed', 303);
INSERT INTO Treatment VALUES (404, TIMESTAMP '2024-03-04 14:20:00', 'Insulin', '10 units before meals', 304);
INSERT INTO Treatment VALUES (405, TIMESTAMP '2024-03-05 16:00:00', 'Albuterol', '2 puffs every 4 hours', 305);
INSERT INTO Treatment VALUES (406, TIMESTAMP '2024-03-06 13:10:00', 'Simvastatin', '20mg at bedtime', 301);
INSERT INTO Treatment VALUES (407, TIMESTAMP '2024-03-07 10:45:00', 'Metformin', '1000mg with meals', 304);

-- Lab_tests Table
INSERT INTO lab_tests VALUES (501, 'Complete Blood Count', 'Measures different components of blood', TO_DATE('2024-03-01', 'YYYY-MM-DD'), 'Normal', 301);
INSERT INTO lab_tests VALUES (502, 'Lipid Panel', 'Measures cholesterol levels', TO_DATE('2024-03-02', 'YYYY-MM-DD'), 'High LDL', 301);
INSERT INTO lab_tests VALUES (503, 'Blood Glucose', 'Measures blood sugar levels', TO_DATE('2024-03-03', 'YYYY-MM-DD'), 'Above normal', 304);
INSERT INTO lab_tests VALUES (504, 'Liver Function', 'Assesses liver health', TO_DATE('2024-03-04', 'YYYY-MM-DD'), 'Normal', 302);
INSERT INTO lab_tests VALUES (505, 'Urinalysis', 'Analyzes urine composition', TO_DATE('2024-03-05', 'YYYY-MM-DD'), 'Normal', 303);
INSERT INTO lab_tests VALUES (506, 'Thyroid Panel', 'Measures thyroid hormone levels', TO_DATE('2024-03-06', 'YYYY-MM-DD'), 'Low T4', 305);
INSERT INTO lab_tests VALUES (507, 'Chest X-ray', 'Imaging of chest cavity', TO_DATE('2024-03-07', 'YYYY-MM-DD'), 'Clear', 306);

-- Admission Table
INSERT INTO Admission VALUES (601, 101, 203, TIMESTAMP '2024-03-01 08:00:00', TIMESTAMP '2024-03-05 14:00:00');
INSERT INTO Admission VALUES (602, 102, 204, TIMESTAMP '2024-03-02 09:30:00', TIMESTAMP '2024-03-10 11:00:00');
INSERT INTO Admission VALUES (603, 103, 201, TIMESTAMP '2024-03-03 12:15:00', TIMESTAMP '2024-03-07 10:00:00');
INSERT INTO Admission VALUES (604, 104, 202, TIMESTAMP '2024-03-04 16:45:00', TIMESTAMP '2024-03-08 13:30:00');
INSERT INTO Admission VALUES (605, 105, 205, TIMESTAMP '2024-03-05 14:30:00', NULL);
INSERT INTO Admission VALUES (606, 106, 201, TIMESTAMP '2024-03-06 10:00:00', NULL);
INSERT INTO Admission VALUES (607, 107, 204, TIMESTAMP '2024-03-07 11:20:00', NULL);

-- Appointment Table
INSERT INTO Appointment VALUES (701, 301, 2, 101, 1, TO_DATE('2024-03-01', 'YYYY-MM-DD'));
INSERT INTO Appointment VALUES (702, 302, 1, 102, 2, TO_DATE('2024-03-02', 'YYYY-MM-DD'));
INSERT INTO Appointment VALUES (703, 303, 3, 103, 3, TO_DATE('2024-03-03', 'YYYY-MM-DD'));
INSERT INTO Appointment VALUES (704, 304, 1, 104, 4, TO_DATE('2024-03-04', 'YYYY-MM-DD'));
INSERT INTO Appointment VALUES (705, 305, 2, 105, 5, TO_DATE('2024-03-05', 'YYYY-MM-DD'));
INSERT INTO Appointment VALUES (706, 306, 3, 106, 1, TO_DATE('2024-03-06', 'YYYY-MM-DD'));
INSERT INTO Appointment VALUES (707, 307, 2, 107, 2, TO_DATE('2024-03-07', 'YYYY-MM-DD'));
INSERT INTO Appointment VALUES (708, 308, 1, 101, 3, TO_DATE('2024-03-08', 'YYYY-MM-DD'));