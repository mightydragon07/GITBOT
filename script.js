// Data structure to hold students
let students = JSON.parse(localStorage.getItem('students')) || [];

// DOM elements
const studentForm = document.getElementById('student-form');
const editForm = document.getElementById('edit-form');
const studentList = document.getElementById('student-list');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const editModal = document.getElementById('edit-modal');
const closeModal = document.querySelector('.close');

// Initialize the application
function init() {
    renderStudents();
    updateStats();
    renderGradeChart();
    
    // Add event listeners
    studentForm.addEventListener('submit', addStudent);
    editForm.addEventListener('submit', updateStudent);
    searchBtn.addEventListener('click', searchStudents);
    closeModal.addEventListener('click', () => editModal.style.display = 'none');
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === editModal) {
            editModal.style.display = 'none';
        }
    });
    
    // Add animation to stat cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.classList.add('pulse');
        });
        card.addEventListener('mouseleave', () => {
            card.classList.remove('pulse');
        });
    });
}

// Add a new student
function addStudent(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const id = document.getElementById('id').value;
    const grade = parseInt(document.getElementById('grade').value);
    const course = document.getElementById('course').value;
    
    // Check if student ID already exists
    if (students.some(student => student.id === id)) {
        alert('Student ID already exists!');
        return;
    }
    
    const newStudent = {
        name,
        id,
        grade,
        course,
        status: grade >= 60 ? 'Passing' : 'Failing'
    };
    
    students.push(newStudent);
    saveStudents();
    renderStudents();
    updateStats();
    renderGradeChart();
    
    // Reset form
    studentForm.reset();
    
    // Add animation to new row
    const newRow = document.querySelector(`tr[data-id="${id}"]`);
    if (newRow) {
        newRow.style.animation = 'fadeIn 1s ease';
    }
}

// Edit student
function updateStudent(e) {
    e.preventDefault();
    
    const index = document.getElementById('edit-index').value;
    const name = document.getElementById('edit-name').value;
    const id = document.getElementById('edit-id').value;
    const grade = parseInt(document.getElementById('edit-grade').value);
    const course = document.getElementById('edit-course').value;
    
    students[index] = {
        name,
        id,
        grade,
        course,
        status: grade >= 60 ? 'Passing' : 'Failing'
    };
    
    saveStudents();
    renderStudents();
    updateStats();
    renderGradeChart();
    
    // Close modal
    editModal.style.display = 'none';
}

// Delete student
function deleteStudent(id) {
    if (confirm('Are you sure you want to delete this student?')) {
        students = students.filter(student => student.id !== id);
        saveStudents();
        renderStudents();
        updateStats();
        renderGradeChart();
    }
}

// Edit student modal
function editStudent(index) {
    const student = students[index];
    document.getElementById('edit-index').value = index;
    document.getElementById('edit-name').value = student.name;
    document.getElementById('edit-id').value = student.id;
    document.getElementById('edit-grade').value = student.grade;
    document.getElementById('edit-course').value = student.course;
    
    editModal.style.display = 'flex';
}

// Search functionality
function searchStudents() {
    const searchTerm = searchInput.value.toLowerCase();
    
    if (searchTerm === '') {
        renderStudents();
        return;
    }
    
    const filteredStudents = students.filter(student => 
        student.name.toLowerCase().includes(searchTerm) || 
        student.id.toLowerCase().includes(searchTerm) ||
        student.course.toLowerCase().includes(searchTerm)
    );
    
    renderStudents(filteredStudents);
}

// Render students table
function renderStudents(studentsArray = students) {
    studentList.innerHTML = '';
    
    if (studentsArray.length === 0) {
        studentList.innerHTML = '<tr><td colspan="6" style="text-align: center;">No students found</td></tr>';
        return;
    }
    
    studentsArray.forEach((student, index) => {
        const row = document.createElement('tr');
        row.setAttribute('data-id', student.id);
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.course}</td>
            <td>${student.grade}%</td>
            <td><span class="status ${student.status.toLowerCase()}">${student.status}</span></td>
            <td>
                <button class="action-btn edit-btn" onclick="editStudent(${index})"><i class="fas fa-edit"></i> Edit</button>
                <button class="action-btn delete-btn" onclick="deleteStudent('${student.id}')"><i class="fas fa-trash"></i> Delete</button>
            </td>
        `;
        studentList.appendChild(row);
    });
}

// Update statistics
function updateStats() {
    document.getElementById('total-students').textContent = students.length;
    
    if (students.length > 0) {
        const totalGrade = students.reduce((sum, student) => sum + student.grade, 0);
        const averageGrade = (totalGrade / students.length).toFixed(1);
        document.getElementById('avg-grade').textContent = averageGrade;
        
        const topPerformer = students.reduce((top, student) => 
            student.grade > top.grade ? student : top, students[0]);
        document.getElementById('top-performer').textContent = topPerformer.name;
    } else {
        document.getElementById('avg-grade').textContent = '0.0';
        document.getElementById('top-performer').textContent = 'None';
    }
}

// Render grade distribution chart
function renderGradeChart() {
    const gradeRanges = [
        { range: '90-100', count: 0, label: 'A' },
        { range: '80-89', count: 0, label: 'B' },
        { range: '70-79', count: 0, label: 'C' },
        { range: '60-69', count: 0, label: 'D' },
        { range: '0-59', count: 0, label: 'F' }
    ];
    
    students.forEach(student => {
        if (student.grade >= 90) gradeRanges[0].count++;
        else if (student.grade >= 80) gradeRanges[1].count++;
        else if (student.grade >= 70) gradeRanges[2].count++;
        else if (student.grade >= 60) gradeRanges[3].count++;
        else gradeRanges[4].count++;
    });
    
    const maxCount = Math.max(...gradeRanges.map(range => range.count));
    
    const chartHTML = gradeRanges.map(range => `
        <div class="grade-bar">
            <div class="grade-label">${range.label} (${range.range})</div>
            <div class="grade-chart" style="width: ${maxCount ? (range.count / maxCount) * 80 + 10 : 10}%">
                ${range.count > 0 ? range.count : ''}
            </div>
        </div>
    `).join('');
    
    document.getElementById('grade-chart').innerHTML = chartHTML;
}

// Save students to localStorage
function saveStudents() {
    localStorage.setItem('students', JSON.stringify(students));
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);