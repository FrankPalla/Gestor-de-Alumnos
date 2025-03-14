//  Update the existing app.js with these improvements

class StudentManager {
  constructor() {
    this.students = JSON.parse(localStorage.getItem('students')) || [];
    this.editingId = null;
    this.setupEventListeners();
    this.renderStudents();
    this.updateSummary();
    
    // Check URL parameters for editing
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('edit');
    if (editId) {
      this.editStudent(editId);
    }
  }

  setupEventListeners() {
    // Existing event listeners...

    // Add error handling for form inputs
    document.querySelectorAll('input, select, textarea').forEach(element => {
      element.addEventListener('invalid', (e) => {
        e.target.classList.add('error');
      });
      
      element.addEventListener('input', (e) => {
        e.target.classList.remove('error');
      });
    });
  }

  handleFormSubmit() {
    // Existing form handling...

    // Add feedback animation
    const row = document.querySelector(`tr[data-id="${this.editingId || student.id}"]`);
    if (row) {
      row.classList.add('highlight');
      setTimeout(() => row.classList.remove('highlight'), 2000);
    }
  }

  // Add payment modal handling
  showPaymentModal(id) {
    const student = this.students.find(s => s.id === id);
    if (!student) return;

    document.getElementById('studentId').value = id;
    document.getElementById('paymentAmount').value = student.price;
    
    const modal = document.getElementById('paymentModal');
    modal.style.display = 'flex';
    
    // Set focus on the first input
    modal.querySelector('input:not([type="hidden"])').focus();
  }

  closePaymentModal() {
    document.getElementById('paymentModal').style.display = 'none';
  }

  // Improve date handling
  formatDate(date) {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  }

  // Add sorting functionality
  sortStudents(field) {
    this.students.sort((a, b) => {
      if (field === 'paymentDate') {
        return new Date(a[field]) - new Date(b[field]);
      }
      return a[field].localeCompare(b[field]);
    });
    this.renderStudents();
  }

  // Add export functionality
  exportData() {
    const data = JSON.stringify(this.students, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'alumnos.json';
    a.click();
    
    URL.revokeObjectURL(url);
  }

  // Add summary calculations
  updateSummary() {
    const totalStudents = this.students.length;
    const monthlyIncome = this.students.reduce((sum, student) => sum + student.price, 0);
    const pendingPayments = this.students.filter(s => this.isPaymentDueSoon(s.paymentDate)).length;

    document.getElementById('totalStudents').textContent = totalStudents;
    document.getElementById('monthlyIncome').textContent = `$${monthlyIncome.toFixed(2)}`;
    document.getElementById('pendingPayments').textContent = pendingPayments;
  }

  // Improve rendering with status indicators
  renderStudents() {
    // ... existing render code ...

    // Show only recent students on main page
    if (window.location.pathname.endsWith('index.html')) {
      studentsToRender = studentsToRender.slice(-5);
    }
  }
}

// Initialize
const studentManager = new StudentManager();
 
