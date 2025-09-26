// Enhanced Data Structure with Animation Support
let students = JSON.parse(localStorage.getItem('nexus_students')) || [];
let isAnimating = false;

// DOM Elements
const studentForm = document.getElementById('student-form');
const editForm = document.getElementById('edit-form');
const studentList = document.getElementById('student-list');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const editModal = document.getElementById('edit-modal');
const closeModal = document.querySelector('.close-btn');

// Animation and Sound Effects
const playNotificationSound = () => {
    // Create audio context for futuristic sound effects
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.3);
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.3);
};

const showNotification = (message, type = 'success') => {
    // Create dynamic notification system
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add notification styles dynamically
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 71, 87, 0.1)'};
        border: 1px solid ${type === 'success' ? 'var(--accent-green)' : 'var(--accent-red)'};
        color: ${type === 'success' ? 'var(--accent-green)' : 'var(--accent-red)'};
        padding: 15px 20px;
        border-radius: 10px;
        backdrop-filter: blur(10px);
        z-index: 10000;
        animation: slideInRight 0.5s ease, fadeOut 0.5s ease 2.5s forwards;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
    
    // Add CSS animation keyframes if not already added
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; transform: translateX(100%); }
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
                font-family: 'Orbitron', monospace;
                font-weight: 600;
            }
        `;
        document.head.appendChild(style);
    }
};

// Enhanced Animation Functions
const animateStatCard = (element, delay = 0) => {
    setTimeout(() => {
        element.style.transform = 'scale(1.05)';
        element.style.boxShadow = '0 15px 40px rgba(0, 212, 255, 0.3)';
        setTimeout(() => {
            element.style.transform = 'scale(1)';
            element.style.boxShadow = '';
        }, 300);
    }, delay);
};

const animateTableRow = (row, index) => {
    row.style.opacity = '0';
    row.style.transform = 'translateX(-50px)';
    
    setTimeout(() => {
        row.style.transition = 'all 0.5s ease';
        row.style.opacity = '1';
        row.style.transform = 'translateX(0)';
    }, index * 100);
};

// Initialize Application with Enhanced Features
function init() {
    // Add loading animation
    showLoadingScreen();
    
    setTimeout(() => {
        renderStudents();
        updateStats();
        renderGradeChart();
        hideLoadingScreen();
        
        // Enhanced event listeners
        studentForm.addEventListener('submit', handleAddStudent);
        editForm.addEventListener('submit', handleUpdateStudent);
        searchBtn.addEventListener('click', handleSearch);
        searchInput.addEventListener('input', handleRealTimeSearch);
        closeModal.addEventListener('click', closeEditModal);
        
        // Enhanced modal handling
        window.addEventListener('click', (e) => {
            if (e.target === editModal) {
                closeEditModal();
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', handleKeyboardShortcuts);
        
        // Enhanced stat card interactions
        document.querySelectorAll('.stat-card').forEach((card, index) => {
            card.addEventListener('mouseenter', () => animateStatCard(card));
            card.addEventListener('click', () => {
                playNotificationSound();
                card.style.animation = 'pulse 0.6s ease';
                setTimeout(() => card.style.animation = '', 600);
            });
        });
        
        // Auto-save functionality
        setInterval(autoSave, 30000); // Auto-save every 30 seconds
        
    }, 1500);
}

const showLoadingScreen = () => {
    const loader = document.createElement('div');
    loader.id = 'nexus-loader';
    loader.innerHTML = `
        <div class="loader-content">
            <div class="loader-spinner"></div>
            <div class="loader-text">INITIALIZING NEXUS SYSTEM</div>
            <div class="loader-progress">
                <div class="loader-bar"></div>
            </div>
        </div>
    `;
    
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--primary-bg);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
    `;
    
    document.body.appendChild(loader);
    
    // Add loader styles
    const loaderStyle = document.createElement('style');
    loaderStyle.textContent = `
        .loader-content {
            text-align: center;
            color: var(--accent-blue);
        }
        
        .loader-spinner {
            width: 60px;
            height: 60px;
            border: 3px solid rgba(0, 212, 255, 0.3);
            border-top: 3px solid var(--accent-blue);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        
        .loader-text {
            font-family: 'Orbitron', monospace;
            font-size: 1.2rem;
            margin-bottom: 20px;
            letter-spacing: 2px;
        }
        
        .loader-progress {
            width: 300px;
            height: 4px;
            background: rgba(0, 212, 255, 0.2);
            border-radius: 2px;
            overflow: hidden;
            margin: 0 auto;
        }
        
        .loader-bar {
            height: 100%;
            background: linear-gradient(90deg, var(--accent-blue), var(--accent-purple));
            animation: loadProgress 1.5s ease-out forwards;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        @keyframes loadProgress {
            0% { width: 0%; }
            100% { width: 100%; }
        }
    `;
    
    document.head.appendChild(loaderStyle);
};

const hideLoadingScreen = () => {
    const loader = document.getElementById('nexus-loader');
    if (loader) {
        loader.style.animation = 'fadeOut 0.5s ease forwards';
        setTimeout(() => loader.remove(), 500);
    }
};

// Enhanced Student Management Functions
function handleAddStudent(e) {
    e.preventDefault();
    
    if (isAnimating) return;
    isAnimating = true;
    
    const formData = {
        name: document.getElementById('name').value.trim(),
        id: document.getElementById('id').value.trim(),
        grade: parseInt(document.getElementById('grade').value),
        course: document.getElementById('course').value
    };
    
    // Enhanced validation
    if (!validateStudentData(formData)) {
        isAnimating = false;
        return;
    }
    
    // Check for duplicate ID
    if (students.some(student => student.id === formData.id)) {
        showNotification('Student ID already exists in database!', 'error');
        isAnimating = false;
        return;
    }
    
    const newStudent = {
        ...formData,
        status: formData.grade >= 60 ? 'Passing' : 'Failing',
        dateAdded: new Date().toISOString(),
        lastModified: new Date().toISOString()
    };
    
    students.push(newStudent);
    saveStudents();
    
    // Animate form submission
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.innerHTML = '<span>PROCESSING...</span><div class="btn-glow"></div>';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        renderStudents();
        updateStats();
        renderGradeChart();
        
        studentForm.reset();
        submitBtn.innerHTML = '<span>INITIALIZE STUDENT</span><div class="btn-glow"></div>';
        submitBtn.disabled = false;
        
        showNotification(`Student ${formData.name} successfully added to database!`);
        playNotificationSound();
        
        isAnimating = false;
    }, 1000);
}

function handleUpdateStudent(e) {
    e.preventDefault();
    
    const index = document.getElementById('edit-index').value;
    const formData = {
        name: document.getElementById('edit-name').value.trim(),
        id: document.getElementById('edit-id').value.trim(),
        grade: parseInt(document.getElementById('edit-grade').value),
        course: document.getElementById('edit-course').value
    };
    
    if (!validateStudentData(formData)) return;
    
    students[index] = {
        ...students[index],
        ...formData,
        status: formData.grade >= 60 ? 'Passing' : 'Failing',
        lastModified: new Date().toISOString()
    };
    
    saveStudents();
    renderStudents();
    updateStats();
    renderGradeChart();
    
    closeEditModal();
    showNotification(`Student ${formData.name} data successfully updated!`);
    playNotificationSound();
}

function validateStudentData(data) {
    if (!data.name || data.name.length < 2) {
        showNotification('Student name must be at least 2 characters long!', 'error');
        return false;
    }
    
    if (!data.id || data.id.length < 3) {
        showNotification('Student ID must be at least 3 characters long!', 'error');
        return false;
    }
    
    if (isNaN(data.grade) || data.grade < 0 || data.grade > 100) {
        showNotification('Grade must be a number between 0 and 100!', 'error');
        return false;
    }
    
    if (!data.course) {
        showNotification('Please select a course module!', 'error');
        return false;
    }
    
    return true;
}

function deleteStudent(id) {
    // Enhanced confirmation dialog
    const confirmDialog = document.createElement('div');
    confirmDialog.className = 'confirm-modal';
    confirmDialog.innerHTML = `
        <div class="confirm-content">
            <div class="confirm-header">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>CONFIRM DELETION</h3>
            </div>
            <p>Are you sure you want to permanently delete this student record?</p>
            <div class="confirm-actions">
                <button class="confirm-btn danger" onclick="confirmDelete('${id}')">DELETE</button>
                <button class="confirm-btn cancel" onclick="cancelDelete()">CANCEL</button>
            </div>
        </div>
    `;
    
    confirmDialog.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(10px);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        animation: modalFadeIn 0.3s ease;
    `;
    
    document.body.appendChild(confirmDialog);
    
    // Add confirm dialog styles
    if (!document.getElementById('confirm-styles')) {
        const style = document.createElement('style');
        style.id = 'confirm-styles';
        style.textContent = `
            .confirm-content {
                background: var(--panel-bg);
                border: 1px solid var(--border-color);
                border-radius: 15px;
                padding: 30px;
                text-align: center;
                max-width: 400px;
                backdrop-filter: blur(20px);
            }
            
            .confirm-header {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                margin-bottom: 20px;
                color: var(--accent-red);
            }
            
            .confirm-header h3 {
                font-family: 'Orbitron', monospace;
                font-size: 1.2rem;
            }
            
            .confirm-content p {
                color: var(--text-secondary);
                margin-bottom: 25px;
                line-height: 1.6;
            }
            
            .confirm-actions {
                display: flex;
                gap: 15px;
                justify-content: center;
            }
            
            .confirm-btn {
                padding: 10px 20px;
                border: none;
                border-radius: 8px;
                font-family: 'Orbitron', monospace;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .confirm-btn.danger {
                background: var(--accent-red);
                color: white;
            }
            
            .confirm-btn.danger:hover {
                box-shadow: 0 0 20px rgba(255, 71, 87, 0.5);
                transform: translateY(-2px);
            }
            
            .confirm-btn.cancel {
                background: transparent;
                border: 1px solid var(--text-secondary);
                color: var(--text-secondary);
            }
            
            .confirm-btn.cancel:hover {
                background: var(--text-secondary);
                color: var(--primary-bg);
            }
        `;
        document.head.appendChild(style);
    }
}

window.confirmDelete = (id) => {
    students = students.filter(student => student.id !== id);
    saveStudents();
    renderStudents();
    updateStats();
    renderGradeChart();
    
    document.querySelector('.confirm-modal').remove();
    showNotification('Student record permanently deleted from database!');
    playNotificationSound();
};

window.cancelDelete = () => {
    document.querySelector('.confirm-modal').remove();
};

function editStudent(index) {
    const student = students[index];
    
    document.getElementById('edit-index').value = index;
    document.getElementById('edit-name').value = student.name;
    document.getElementById('edit-id').value = student.id;
    document.getElementById('edit-grade').value = student.grade;
    document.getElementById('edit-course').value = student.course;
    
    editModal.style.display = 'flex';
    
    // Add modal opening animation
    const modalContent = editModal.querySelector('.modal-content');
    modalContent.style.animation = 'modalSlideIn 0.4s ease';
}

function closeEditModal() {
    const modalContent = editModal.querySelector('.modal-content');
    modalContent.style.animation = 'modalSlideOut 0.3s ease';
    
    setTimeout(() => {
        editModal.style.display = 'none';
        modalContent.style.animation = '';
    }, 300);
}

// Enhanced Search Functions
function handleSearch() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    performSearch(searchTerm);
}

function handleRealTimeSearch() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    // Debounce search for better performance
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
        performSearch(searchTerm);
    }, 300);
}

function performSearch(searchTerm) {
    if (searchTerm === '') {
        renderStudents();
        return;
    }
    
    const filteredStudents = students.filter(student => 
        student.name.toLowerCase().includes(searchTerm) || 
        student.id.toLowerCase().includes(searchTerm) ||
        student.course.toLowerCase().includes(searchTerm) ||
        student.status.toLowerCase().includes(searchTerm)
    );
    
    renderStudents(filteredStudents);
    
    if (filteredStudents.length === 0) {
        showNotification(`No results found for "${searchTerm}"`, 'error');
    }
}

// Enhanced Rendering Functions
function renderStudents(studentsArray = students) {
    studentList.innerHTML = '';
    
    if (studentsArray.length === 0) {
        studentList.innerHTML = `
            <tr class="empty-state">
                <td colspan="6">
                    <div class="empty-content">
                        <i class="fas fa-database"></i>
                        <h3>NO STUDENT DATA FOUND</h3>
                        <p>Database is currently empty or no matches found</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    studentsArray.forEach((student, index) => {
        const row = document.createElement('tr');
        row.setAttribute('data-id', student.id);
        row.innerHTML = `
            <td data-label="ID">${student.id}</td>
            <td data-label="Name">${student.name}</td>
            <td data-label="Course">${student.course}</td>
            <td data-label="Grade">${student.grade}%</td>
            <td data-label="Status">
                <span class="status ${student.status.toLowerCase()}">
                    <i class="fas fa-${student.status === 'Passing' ? 'check' : 'times'}"></i>
                    ${student.status}
                </span>
            </td>
            <td data-label="Actions">
                <button class="action-btn edit-btn" onclick="editStudent(${students.indexOf(student)})" title="Edit Student">
                    <i class="fas fa-edit"></i> EDIT
                </button>
                <button class="action-btn delete-btn" onclick="deleteStudent('${student.id}')" title="Delete Student">
                    <i class="fas fa-trash"></i> DELETE
                </button>
            </td>
        `;
        
        studentList.appendChild(row);
        animateTableRow(row, index);
    });
    
    // Add empty state styles if not already added
    if (!document.getElementById('empty-state-styles')) {
        const style = document.createElement('style');
        style.id = 'empty-state-styles';
        style.textContent = `
            .empty-state td {
                border: none !important;
                padding: 40px !important;
            }
            
            .empty-content {
                text-align: center;
                color: var(--text-secondary);
            }
            
            .empty-content i {
                font-size: 3rem;
                margin-bottom: 15px;
                color: var(--accent-blue);
                opacity: 0.5;
            }
            
            .empty-content h3 {
                font-family: 'Orbitron', monospace;
                font-size: 1.2rem;
                margin-bottom: 10px;
                color: var(--text-primary);
            }
        `;
        document.head.appendChild(style);
    }
}

function updateStats() {
    const totalStudents = students.length;
    document.getElementById('total-students').textContent = totalStudents;
    
    // Animate stat cards
    document.querySelectorAll('.stat-card').forEach((card, index) => {
        setTimeout(() => animateStatCard(card), index * 200);
    });
    
    if (totalStudents > 0) {
        // Calculate average grade with animation
        const totalGrade = students.reduce((sum, student) => sum + student.grade, 0);
        const averageGrade = (totalGrade / totalStudents).toFixed(1);
        
        animateNumber(document.getElementById('avg-grade'), 0, averageGrade, 1500);
        
        // Find top performer
        const topPerformer = students.reduce((top, student) => 
            student.grade > top.grade ? student : top, students[0]);
        
        const topPerformerElement = document.getElementById('top-performer');
        topPerformerElement.style.opacity = '0';
        setTimeout(() => {
            topPerformerElement.textContent = topPerformer.name.toUpperCase();
            topPerformerElement.style.opacity = '1';
            topPerformerElement.style.transition = 'opacity 0.5s ease';
        }, 500);
        
        // Update passing rate
        const passingStudents = students.filter(student => student.status === 'Passing').length;
        const passingRate = ((passingStudents / totalStudents) * 100).toFixed(1);
        
        // Update stat bars with animation
        document.querySelectorAll('.stat-fill').forEach((fill, index) => {
            const percentage = index === 0 ? 75 : index === 1 ? passingRate : 85;
            fill.style.width = '0%';
            setTimeout(() => {
                fill.style.transition = 'width 1.5s ease';
                fill.style.width = `${percentage}%`;
            }, index * 300);
        });
        
    } else {
        document.getElementById('avg-grade').textContent = '0.0';
        document.getElementById('top-performer').textContent = 'NONE';
        
        document.querySelectorAll('.stat-fill').forEach(fill => {
            fill.style.width = '0%';
        });
    }
}

function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    const startNumber = parseFloat(start);
    const endNumber = parseFloat(end);
    const difference = endNumber - startNumber;
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const currentNumber = startNumber + (difference * easedProgress);
        
        element.textContent = currentNumber.toFixed(1);
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

function renderGradeChart() {
    const gradeRanges = [
        { range: '90-100', count: 0, label: 'A+', color: 'var(--accent-green)' },
        { range: '80-89', count: 0, label: 'A', color: 'var(--accent-blue)' },
        { range: '70-79', count: 0, label: 'B', color: 'var(--accent-purple)' },
        { range: '60-69', count: 0, label: 'C', color: 'var(--warning-color)' },
        { range: '0-59', count: 0, label: 'F', color: 'var(--accent-red)' }
    ];
    
    students.forEach(student => {
        if (student.grade >= 90) gradeRanges[0].count++;
        else if (student.grade >= 80) gradeRanges[1].count++;
        else if (student.grade >= 70) gradeRanges[2].count++;
        else if (student.grade >= 60) gradeRanges[3].count++;
        else gradeRanges[4].count++;
    });
    
    const maxCount = Math.max(...gradeRanges.map(range => range.count), 1);
    
    const chartHTML = gradeRanges.map((range, index) => {
        const percentage = students.length > 0 ? (range.count / maxCount) * 80 + 10 : 10;
        
        return `
            <div class="grade-bar" style="animation-delay: ${index * 0.2}s">
                <div class="grade-label">
                    <span class="grade-letter" style="color: ${range.color}">${range.label}</span>
                    <span class="grade-range">(${range.range})</span>
                </div>
                <div class="grade-chart" style="width: ${percentage}%; background: linear-gradient(90deg, ${range.color}, ${range.color}aa);">
                    <span class="grade-count">${range.count > 0 ? range.count : ''}</span>
                </div>
                <div class="grade-percentage">${students.length > 0 ? ((range.count / students.length) * 100).toFixed(1) : 0}%</div>
            </div>
        `;
    }).join('');
    
    document.getElementById('grade-chart').innerHTML = chartHTML;
    
    // Add enhanced chart styles if not already added
    if (!document.getElementById('enhanced-chart-styles')) {
        const style = document.createElement('style');
        style.id = 'enhanced-chart-styles';
        style.textContent = `
            .grade-bar {
                display: grid;
                grid-template-columns: 120px 1fr 60px;
                gap: 15px;
                align-items: center;
                background: rgba(0, 212, 255, 0.05);
                border-radius: 8px;
                padding: 12px;
                margin-bottom: 12px;
                transition: all 0.3s ease;
                animation: slideInUp 0.6s ease both;
            }
            
            .grade-bar:hover {
                background: rgba(0, 212, 255, 0.1);
                transform: translateX(10px);
                box-shadow: 0 5px 20px rgba(0, 212, 255, 0.2);
            }
            
            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .grade-label {
                display: flex;
                flex-direction: column;
                gap: 2px;
            }
            
            .grade-letter {
                font-family: 'Orbitron', monospace;
                font-weight: 700;
                font-size: 1.1rem;
            }
            
            .grade-range {
                font-size: 0.8rem;
                color: var(--text-secondary);
            }
            
            .grade-chart {
                height: 25px;
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                padding: 0 10px;
                min-width: 30px;
                position: relative;
                overflow: hidden;
                transition: width 1.5s ease;
                box-shadow: 0 0 15px rgba(0, 212, 255, 0.2);
            }
            
            .grade-count {
                color: white;
                font-weight: 700;
                font-size: 0.9rem;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
                z-index: 2;
                position: relative;
            }
            
            .grade-percentage {
                font-family: 'Orbitron', monospace;
                font-weight: 600;
                color: var(--accent-blue);
                text-align: right;
            }
        `;
        document.head.appendChild(style);
    }
}

// Enhanced Utility Functions
function saveStudents() {
    try {
        localStorage.setItem('nexus_students', JSON.stringify(students));
        
        // Auto-backup to a secondary key
        const backup = {
            data: students,
            timestamp: new Date().toISOString(),
            version: '2.0'
        };
        localStorage.setItem('nexus_backup', JSON.stringify(backup));
        
    } catch (error) {
        showNotification('Failed to save data to local storage!', 'error');
        console.error('Storage error:', error);
    }
}

function autoSave() {
    if (students.length > 0) {
        saveStudents();
        showNotification('Auto-save completed', 'success');
    }
}

function handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + F for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
    }
    
    // Escape to close modal
    if (e.key === 'Escape') {
        if (editModal.style.display === 'flex') {
            closeEditModal();
        }
        
        // Close confirmation dialogs
        const confirmModal = document.querySelector('.confirm-modal');
        if (confirmModal) {
            confirmModal.remove();
        }
    }
    
    // Ctrl/Cmd + N for new student (focus on name field)
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        document.getElementById('name').focus();
    }
}

// Data Export/Import Functions
function exportData() {
    if (students.length === 0) {
        showNotification('No data to export!', 'error');
        return;
    }
    
    const exportData = {
        students: students,
        exportDate: new Date().toISOString(),
        version: '2.0',
        totalStudents: students.length,
        averageGrade: students.reduce((sum, s) => sum + s.grade, 0) / students.length
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `nexus_students_${new Date().toISOString().split('T')[0]}.json`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Student data exported successfully!');
    playNotificationSound();
}

// Performance Monitoring
function trackPerformance() {
    const performanceData = {
        totalStudents: students.length,
        averageGrade: students.length > 0 ? students.reduce((sum, s) => sum + s.grade, 0) / students.length : 0,
        passingRate: students.length > 0 ? (students.filter(s => s.status === 'Passing').length / students.length) * 100 : 0,
        courseDistribution: {},
        lastUpdated: new Date().toISOString()
    };
    
    students.forEach(student => {
        performanceData.courseDistribution[student.course] = 
            (performanceData.courseDistribution[student.course] || 0) + 1;
    });
    
    localStorage.setItem('nexus_analytics', JSON.stringify(performanceData));
}

// Add modal slide-out animation styles
if (!document.getElementById('modal-animations')) {
    const style = document.createElement('style');
    style.id = 'modal-animations';
    style.textContent = `
        @keyframes modalSlideOut {
            from {
                transform: scale(1) translateY(0);
                opacity: 1;
            }
            to {
                transform: scale(0.8) translateY(-50px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Global function exports for HTML onclick handlers
window.editStudent = editStudent;
window.deleteStudent = deleteStudent;

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Handle page visibility changes for better performance
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        // Refresh data when page becomes visible
        updateStats();
        renderGradeChart();
    }
});

// Handle online/offline status
window.addEventListener('online', () => {
    showNotification('Connection restored - System online!');
    document.querySelector('.status-indicator span').textContent = 'SYSTEM ONLINE';
});

window.addEventListener('offline', () => {
    showNotification('Connection lost - Working offline', 'error');
    document.querySelector('.status-indicator span').textContent = 'OFFLINE MODE';
});

// Periodic performance tracking
setInterval(trackPerformance, 60000); // Track every minute