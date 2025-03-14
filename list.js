class  StudentList {
  constructor() {
    this.students = JSON.parse(localStorage.getItem('students')) || [];
    this.setupEventListeners();
    this.renderStudents();
    this.updateSummary();
  }

  setupEventListeners() {
    document.getElementById('searchInput').addEventListener('input', (e) => {
      this.filterStudents();
    });

    document.getElementById('filterType').addEventListener('change', () => {
      this.filterStudents();
    });

    document.getElementById('paymentForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handlePaymentSubmit();
    });
  }

  updateSummary() {
    const totalStudents = this.students.length;
    const monthlyIncome = this.students.reduce((sum, student) => sum + student.price, 0);
    const pendingPayments = this.students.filter(student => this.isPaymentDueSoon(student.paymentDate)).length;

    document.getElementById('totalStudents').textContent = totalStudents;
    document.getElementById('monthlyIncome').textContent = `$${monthlyIncome.toFixed(2)}`;
    document.getElementById('pendingPayments').textContent = pendingPayments;
  }

  filterStudents() {
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
    const filterType = document.getElementById('filterType').value;
    
    let filteredStudents = this.students.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchQuery) ||
                          student.phone.includes(searchQuery);

      switch (filterType) {
        case 'pending':
          return matchesSearch && this.isPaymentDueSoon(student.paymentDate);
        case 'upcoming':
          return matchesSearch && this.isPaymentUpcoming(student.paymentDate);
        case 'overdue':
          return matchesSearch && this.isPaymentOverdue(student.paymentDate);
        default:
          return matchesSearch;
      }
    });

    this.renderStudents(filteredStudents);
  }

  isPaymentOverdue(paymentDate) {
    const today = new Date();
    const payment = new Date(paymentDate);
    return payment < today;
  }

  isPaymentDueSoon(paymentDate) {
    const today = new Date();
    const payment = new Date(paymentDate);
    const diffDays = Math.ceil((payment - today) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 5;
  }

  isPaymentUpcoming(paymentDate) {
    const today = new Date();
    const payment = new Date(paymentDate);
    const diffDays = Math.ceil((payment - today) / (1000 * 60 * 60 * 24));
    return diffDays > 5 && diffDays <= 15;
  }

  getPaymentStatus(paymentDate) {
    if (this.isPaymentOverdue(paymentDate)) {
      return { icon: '🔴', class: 'status-overdue', text: 'Vencido' };
    }
    if (this.isPaymentDueSoon(paymentDate)) {
      return { icon: '⚠️', class: 'status-due-soon', text: 'Próximo' };
    }
    if (this.isPaymentUpcoming(paymentDate)) {
      return { icon: '⚡', class: 'status-upcoming', text: 'Cercano' };
    }
    return { icon: '✅', class: 'status-ok', text: 'Al día' };
  }

  formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('es-ES');
  }

  showPaymentModal(studentId) {
    const student = this.students.find(s => s.id === studentId);
    if (!student) return;

    document.getElementById('studentId').value = studentId;
    document.getElementById('paymentAmount').value = student.price;
    
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('paymentDate').value = today;

    // Set next payment date to one month from today
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    document.getElementById('nextPaymentDate').value = nextMonth.toISOString().split('T')[0];

    document.getElementById('paymentModal').style.display = 'flex';
  }

  closePaymentModal() {
    document.getElementById('paymentModal').style.display = 'none';
  }

  handlePaymentSubmit() {
    const studentId = document.getElementById('studentId').value;
    const nextPaymentDate = document.getElementById('nextPaymentDate').value;

    this.students = this.students.map(student => {
      if (student.id === studentId) {
        return {
          ...student,
          paymentDate: nextPaymentDate
        };
      }
      return student;
    });

    localStorage.setItem('students', JSON.stringify(this.students));
    this.closePaymentModal();
    this.renderStudents();
    this.updateSummary();
  }

  renderStudents(studentsToRender = this.students) {
    const tbody = document.querySelector('#studentTable tbody');
    tbody.innerHTML = '';

    studentsToRender.forEach(student => {
      const status = this.getPaymentStatus(student.paymentDate);
      const row = document.createElement('tr');
      row.className = status.class;

      row.innerHTML = `
        <td class="status-cell">
          <span title="${status.text}">${status.icon}</span>
        </td>
        <td>${student.name}</td>
        <td>${student.phone}</td>
        <td>${student.supportType}${student.subject ? ` (${student.subject})` : ''}</td>
        <td>${this.formatDate(student.entryDate)}</td>
        <td>${this.formatDate(student.paymentDate)}</td>
        <td>$${student.price.toFixed(2)}</td>
        <td>
          <button class="btn-payment" onclick="studentList.showPaymentModal('${student.id}')">💰</button>
          <a href="index.html?edit=${student.id}" class="btn-edit">✏️</a>
        </td>
      `;

      tbody.appendChild(row);
    });
  }
}

// Initialize the list
const studentList = new StudentList();

// Global functions for modal
window.closePaymentModal = function() {
  studentList.closePaymentModal();
};
 
