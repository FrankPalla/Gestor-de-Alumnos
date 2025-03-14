document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('studentForm');
    const studentList = document.getElementById('studentList').getElementsByTagName('tbody')[0];
    let students = JSON.parse(localStorage.getItem('students')) || [];

    // Mostrar alumnos al cargar
    function displayStudents() {
        studentList.innerHTML = ''; // Limpiar la lista actual
        students.forEach((student, index) => {
            let row = studentList.insertRow();
            row.innerHTML = `
                <td>${student.name}</td>
                <td>${student.phone}</td>
                <td>${student.entryDate}</td>
                <td>${student.paymentDate}</td>
                <td>${student.supportType}</td>
                <td>${student.price}</td>
                <td>
                    <button class="edit" onclick="editStudent(${index})">Editar</button>
                    <button class="delete" onclick="deleteStudent(${index})">Eliminar</button>
                </td>
            `;

            // Resaltar si el pago está vencido
            highlightOverduePayments(row, student.paymentDate);
        });
    }

    // Resaltar pagos vencidos
    function highlightOverduePayments(row, paymentDate) {
        if (!paymentDate) return; // Si no hay fecha de pago, salir

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Quitar la hora para comparar solo la fecha
        const payment = new Date(paymentDate);
        payment.setHours(0, 0, 0, 0);

        if (payment < today) {
            row.classList.add("overdue"); // Agregar clase CSS
        }
    }

    // Guardar en localStorage
    function saveToLocalStorage() {
        localStorage.setItem('students', JSON.stringify(students));
    }

    // Agregar alumno
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const entryDate = document.getElementById('entryDate').value;
        const paymentDate = document.getElementById('paymentDate').value;
        const supportType = document.getElementById('supportType').value;
        const subject = document.getElementById('subject').value;
        const price = document.getElementById('price').value;

        const newStudent = {
            name,
            phone,
            entryDate,
            paymentDate,
            supportType,
            subject,
            price
        };

        students.push(newStudent);
        saveToLocalStorage();
        displayStudents();
        form.reset();
    });

    // Editar alumno
    window.editStudent = (index) => {
        const student = students[index];
        document.getElementById('name').value = student.name;
        document.getElementById('phone').value = student.phone;
        document.getElementById('entryDate').value = student.entryDate;
        document.getElementById('paymentDate').value = student.paymentDate;
        document.getElementById('supportType').value = student.supportType;
        document.getElementById('subject').value = student.subject || '';
        document.getElementById('price').value = student.price;

        // Actualizar alumno
        form.onsubmit = (e) => {
            e.preventDefault();
            student.name = document.getElementById('name').value;
            student.phone = document.getElementById('phone').value;
            student.entryDate = document.getElementById('entryDate').value;
            student.paymentDate = document.getElementById('paymentDate').value;
            student.supportType = document.getElementById('supportType').value;
            student.subject = document.getElementById('subject').value;
            student.price = document.getElementById('price').value;

            saveToLocalStorage();
            displayStudents();
            form.reset();
        };
    };

    // Eliminar alumno
    window.deleteStudent = (index) => {
        students.splice(index, 1);
        saveToLocalStorage();
        displayStudents();
    };

    // Mostrar alumnos al cargar la página
    displayStudents();
});
