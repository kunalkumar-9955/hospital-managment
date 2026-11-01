// Realistic mock data for the Hospital Management System

export const mockPatients = [
  { id: 'PT-001', name: 'James Wilson', age: 45, gender: 'Male', bloodGroup: 'O+', phone: '+1-555-0101', email: 'james.wilson@email.com', address: '123 Oak Street, New York', status: 'Active', department: 'Cardiology', doctor: 'Dr. Sarah Chen', admissionDate: '2026-05-01', diagnosis: 'Hypertension', allergies: ['Penicillin'], emergencyContact: 'Mary Wilson (+1-555-0102)', riskScore: 72 },
  { id: 'PT-002', name: 'Emily Rodriguez', age: 32, gender: 'Female', bloodGroup: 'A+', phone: '+1-555-0103', email: 'emily.r@email.com', address: '456 Maple Ave, Los Angeles', status: 'Critical', department: 'ICU', doctor: 'Dr. Michael Park', admissionDate: '2026-05-08', diagnosis: 'Acute MI', allergies: ['Aspirin', 'Sulfa'], emergencyContact: 'Carlos Rodriguez (+1-555-0104)', riskScore: 95 },
  { id: 'PT-003', name: 'Robert Thompson', age: 67, gender: 'Male', bloodGroup: 'B-', phone: '+1-555-0105', email: 'r.thompson@email.com', address: '789 Pine Road, Chicago', status: 'Stable', department: 'Neurology', doctor: 'Dr. Lisa Kumar', admissionDate: '2026-04-28', diagnosis: 'Stroke Recovery', allergies: [], emergencyContact: 'Susan Thompson (+1-555-0106)', riskScore: 58 },
  { id: 'PT-004', name: 'Aisha Patel', age: 28, gender: 'Female', bloodGroup: 'AB+', phone: '+1-555-0107', email: 'aisha.p@email.com', address: '321 Elm Street, Houston', status: 'Recovering', department: 'Orthopedics', doctor: 'Dr. James Lee', admissionDate: '2026-05-05', diagnosis: 'Fractured Femur', allergies: ['Latex'], emergencyContact: 'Raj Patel (+1-555-0108)', riskScore: 35 },
  { id: 'PT-005', name: 'David Kim', age: 54, gender: 'Male', bloodGroup: 'A-', phone: '+1-555-0109', email: 'david.kim@email.com', address: '654 Birch Lane, Phoenix', status: 'Active', department: 'Oncology', doctor: 'Dr. Anna White', admissionDate: '2026-04-15', diagnosis: 'Lung Cancer Stage II', allergies: ['Morphine'], emergencyContact: 'Jenny Kim (+1-555-0110)', riskScore: 88 },
  { id: 'PT-006', name: 'Maria Santos', age: 41, gender: 'Female', bloodGroup: 'O-', phone: '+1-555-0111', email: 'maria.s@email.com', address: '987 Cedar Ave, Philadelphia', status: 'Discharged', department: 'General Ward', doctor: 'Dr. Tom Brown', admissionDate: '2026-04-20', diagnosis: 'Appendicitis', allergies: [], emergencyContact: 'Jose Santos (+1-555-0112)', riskScore: 20 },
]

export const mockDoctors = [
  { id: 'DR-001', name: 'Dr. Sarah Chen', specialization: 'Cardiology', department: 'Cardiology', phone: '+1-555-1001', email: 'sarah.chen@medicore.com', status: 'Online', patients: 12, rating: 4.9, experience: 15, availability: 'Mon-Fri 9AM-5PM', consultationFee: 250, avatar: null },
  { id: 'DR-002', name: 'Dr. Michael Park', specialization: 'Emergency Medicine', department: 'ICU', phone: '+1-555-1002', email: 'michael.park@medicore.com', status: 'Busy', patients: 8, rating: 4.8, experience: 12, availability: '24/7 On-call', consultationFee: 300, avatar: null },
  { id: 'DR-003', name: 'Dr. Lisa Kumar', specialization: 'Neurology', department: 'Neurology', phone: '+1-555-1003', email: 'lisa.kumar@medicore.com', status: 'Online', patients: 10, rating: 4.7, experience: 18, availability: 'Mon-Sat 8AM-4PM', consultationFee: 280, avatar: null },
  { id: 'DR-004', name: 'Dr. James Lee', specialization: 'Orthopedics', department: 'Orthopedics', phone: '+1-555-1004', email: 'james.lee@medicore.com', status: 'Offline', patients: 6, rating: 4.6, experience: 10, availability: 'Tue-Sat 10AM-6PM', consultationFee: 220, avatar: null },
  { id: 'DR-005', name: 'Dr. Anna White', specialization: 'Oncology', department: 'Oncology', phone: '+1-555-1005', email: 'anna.white@medicore.com', status: 'Online', patients: 15, rating: 4.9, experience: 20, availability: 'Mon-Fri 8AM-6PM', consultationFee: 350, avatar: null },
  { id: 'DR-006', name: 'Dr. Tom Brown', specialization: 'General Surgery', department: 'Surgery', phone: '+1-555-1006', email: 'tom.brown@medicore.com', status: 'Busy', patients: 9, rating: 4.5, experience: 8, availability: 'Mon-Fri 7AM-3PM', consultationFee: 200, avatar: null },
]

export const mockAppointments = [
  { id: 'APT-001', patient: 'James Wilson', doctor: 'Dr. Sarah Chen', department: 'Cardiology', date: '2026-05-11', time: '09:00 AM', type: 'Follow-up', status: 'Confirmed', notes: 'Blood pressure check' },
  { id: 'APT-002', patient: 'Emily Rodriguez', doctor: 'Dr. Michael Park', department: 'ICU', date: '2026-05-11', time: '10:30 AM', type: 'Emergency', status: 'Confirmed', notes: 'Post-surgery review' },
  { id: 'APT-003', patient: 'Robert Thompson', doctor: 'Dr. Lisa Kumar', department: 'Neurology', date: '2026-05-12', time: '02:00 PM', type: 'Consultation', status: 'Pending', notes: 'MRI results review' },
  { id: 'APT-004', patient: 'Aisha Patel', doctor: 'Dr. James Lee', department: 'Orthopedics', date: '2026-05-13', time: '11:00 AM', type: 'Follow-up', status: 'Confirmed', notes: 'X-ray follow-up' },
  { id: 'APT-005', patient: 'David Kim', doctor: 'Dr. Anna White', department: 'Oncology', date: '2026-05-14', time: '03:30 PM', type: 'Chemotherapy', status: 'Confirmed', notes: 'Cycle 3 treatment' },
  { id: 'APT-006', patient: 'New Patient', doctor: 'Dr. Tom Brown', department: 'Surgery', date: '2026-05-15', time: '08:00 AM', type: 'Pre-op', status: 'Pending', notes: 'Pre-surgical assessment' },
]

export const mockBeds = [
  { id: 'BED-101', room: '101', ward: 'General', floor: 1, status: 'Occupied', patient: 'James Wilson', admittedSince: '2026-05-01' },
  { id: 'BED-102', room: '102', ward: 'General', floor: 1, status: 'Available', patient: null, admittedSince: null },
  { id: 'BED-ICU-01', room: 'ICU-01', ward: 'ICU', floor: 2, status: 'Occupied', patient: 'Emily Rodriguez', admittedSince: '2026-05-08' },
  { id: 'BED-ICU-02', room: 'ICU-02', ward: 'ICU', floor: 2, status: 'Occupied', patient: 'Critical Patient', admittedSince: '2026-05-09' },
  { id: 'BED-ICU-03', room: 'ICU-03', ward: 'ICU', floor: 2, status: 'Available', patient: null, admittedSince: null },
  { id: 'BED-201', room: '201', ward: 'Cardiology', floor: 2, status: 'Occupied', patient: 'Robert Thompson', admittedSince: '2026-04-28' },
  { id: 'BED-202', room: '202', ward: 'Cardiology', floor: 2, status: 'Maintenance', patient: null, admittedSince: null },
  { id: 'BED-301', room: '301', ward: 'Oncology', floor: 3, status: 'Occupied', patient: 'David Kim', admittedSince: '2026-04-15' },
]

export const mockMedicines = [
  { id: 'MED-001', name: 'Metformin 500mg', category: 'Antidiabetic', stock: 450, minStock: 100, price: 12.50, supplier: 'PharmaCorp', expiry: '2027-06-30', status: 'In Stock' },
  { id: 'MED-002', name: 'Lisinopril 10mg', category: 'Antihypertensive', stock: 85, minStock: 100, price: 18.00, supplier: 'MediSupply', expiry: '2027-03-15', status: 'Low Stock' },
  { id: 'MED-003', name: 'Atorvastatin 20mg', category: 'Statin', stock: 320, minStock: 80, price: 25.00, supplier: 'PharmaCorp', expiry: '2026-12-31', status: 'In Stock' },
  { id: 'MED-004', name: 'Amoxicillin 250mg', category: 'Antibiotic', stock: 15, minStock: 50, price: 8.75, supplier: 'BioMed', expiry: '2026-08-20', status: 'Critical' },
  { id: 'MED-005', name: 'Omeprazole 20mg', category: 'PPI', stock: 200, minStock: 60, price: 15.00, supplier: 'MediSupply', expiry: '2027-09-10', status: 'In Stock' },
  { id: 'MED-006', name: 'Paracetamol 500mg', category: 'Analgesic', stock: 1200, minStock: 200, price: 5.00, supplier: 'GenericPharma', expiry: '2028-01-01', status: 'In Stock' },
]

export const mockBillings = [
  { id: 'BILL-001', patient: 'James Wilson', date: '2026-05-01', services: ['Consultation', 'ECG', 'Blood Test'], amount: 850, paid: 850, status: 'Paid', insurance: 'BlueCross' },
  { id: 'BILL-002', patient: 'Emily Rodriguez', date: '2026-05-08', services: ['Emergency', 'ICU', 'Surgery'], amount: 15200, paid: 5000, status: 'Partial', insurance: 'Aetna' },
  { id: 'BILL-003', patient: 'Robert Thompson', date: '2026-04-28', services: ['Consultation', 'MRI', 'Medication'], amount: 3200, paid: 0, status: 'Pending', insurance: 'Medicare' },
  { id: 'BILL-004', patient: 'Aisha Patel', date: '2026-05-05', services: ['Surgery', 'X-Ray', 'Physiotherapy'], amount: 8500, paid: 8500, status: 'Paid', insurance: 'UnitedHealth' },
  { id: 'BILL-005', patient: 'David Kim', date: '2026-04-15', services: ['Chemotherapy', 'Consultation', 'Lab Tests'], amount: 22000, paid: 10000, status: 'Partial', insurance: 'Cigna' },
]

export const mockLabTests = [
  { id: 'LAB-001', patient: 'James Wilson', test: 'Complete Blood Count', doctor: 'Dr. Sarah Chen', date: '2026-05-10', status: 'Completed', result: 'Normal', urgent: false },
  { id: 'LAB-002', patient: 'Emily Rodriguez', test: 'Cardiac Enzymes', doctor: 'Dr. Michael Park', date: '2026-05-10', status: 'Processing', result: null, urgent: true },
  { id: 'LAB-003', patient: 'Robert Thompson', test: 'MRI Brain', doctor: 'Dr. Lisa Kumar', date: '2026-05-09', status: 'Completed', result: 'Abnormal - Review Required', urgent: true },
  { id: 'LAB-004', patient: 'David Kim', test: 'Tumor Markers', doctor: 'Dr. Anna White', date: '2026-05-08', status: 'Completed', result: 'Elevated', urgent: true },
  { id: 'LAB-005', patient: 'Aisha Patel', test: 'X-Ray Femur', doctor: 'Dr. James Lee', date: '2026-05-07', status: 'Completed', result: 'Healing Progress Good', urgent: false },
]

export const revenueData = [
  { month: 'Jan', revenue: 285000, expenses: 180000, profit: 105000 },
  { month: 'Feb', revenue: 310000, expenses: 195000, profit: 115000 },
  { month: 'Mar', revenue: 298000, expenses: 188000, profit: 110000 },
  { month: 'Apr', revenue: 342000, expenses: 210000, profit: 132000 },
  { month: 'May', revenue: 378000, expenses: 225000, profit: 153000 },
  { month: 'Jun', revenue: 365000, expenses: 218000, profit: 147000 },
  { month: 'Jul', revenue: 390000, expenses: 235000, profit: 155000 },
  { month: 'Aug', revenue: 415000, expenses: 248000, profit: 167000 },
  { month: 'Sep', revenue: 402000, expenses: 240000, profit: 162000 },
  { month: 'Oct', revenue: 438000, expenses: 260000, profit: 178000 },
  { month: 'Nov', revenue: 425000, expenses: 255000, profit: 170000 },
  { month: 'Dec', revenue: 460000, expenses: 275000, profit: 185000 },
]

export const patientGrowthData = [
  { month: 'Jan', inpatients: 145, outpatients: 520, emergency: 38 },
  { month: 'Feb', inpatients: 158, outpatients: 548, emergency: 42 },
  { month: 'Mar', inpatients: 162, outpatients: 590, emergency: 35 },
  { month: 'Apr', inpatients: 175, outpatients: 612, emergency: 48 },
  { month: 'May', inpatients: 188, outpatients: 645, emergency: 52 },
  { month: 'Jun', inpatients: 172, outpatients: 628, emergency: 44 },
]

export const departmentData = [
  { name: 'Cardiology', value: 28, color: '#3b82f6' },
  { name: 'Neurology', value: 18, color: '#8b5cf6' },
  { name: 'Orthopedics', value: 15, color: '#06b6d4' },
  { name: 'Oncology', value: 12, color: '#f59e0b' },
  { name: 'Emergency', value: 20, color: '#ef4444' },
  { name: 'Others', value: 7, color: '#10b981' },
]

export const activityFeed = [
  { id: 1, type: 'admission', message: 'New patient Emily Rodriguez admitted to ICU', time: '2 min ago', icon: 'user-plus', color: 'blue' },
  { id: 2, type: 'emergency', message: 'Emergency alert: Ambulance dispatched to 5th Ave', time: '5 min ago', icon: 'alert-triangle', color: 'red' },
  { id: 3, type: 'lab', message: 'Lab results ready for Robert Thompson - MRI Brain', time: '12 min ago', icon: 'flask', color: 'purple' },
  { id: 4, type: 'billing', message: 'Payment received from Aisha Patel - $8,500', time: '18 min ago', icon: 'dollar-sign', color: 'green' },
  { id: 5, type: 'appointment', message: 'Appointment confirmed: James Wilson with Dr. Chen', time: '25 min ago', icon: 'calendar', color: 'cyan' },
  { id: 6, type: 'medicine', message: 'Low stock alert: Amoxicillin 250mg - 15 units remaining', time: '32 min ago', icon: 'pill', color: 'orange' },
  { id: 7, type: 'discharge', message: 'Patient Maria Santos discharged successfully', time: '45 min ago', icon: 'log-out', color: 'green' },
]
