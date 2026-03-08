const api = "http://localhost:8080/students";
let editingId = null;

function addOrUpdateStudent() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const course = document.getElementById("course").value.trim();

    if (!name || !email || !course) {
        alert("All fields are required!");
        return;
    }

    if (editingId) { // Update mode
        fetch(`${api}/${editingId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, course })
        })
        .then(res => res.json())
        .then(() => {
            resetForm();
            loadStudents();
        })
        .catch(err => console.error("Error updating student:", err));
    } else { // Add mode
        fetch(api, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, course })
        })
        .then(res => res.json())
        .then(() => {
            resetForm();
            loadStudents();
        })
        .catch(err => console.error("Error adding student:", err));
    }
}

function editStudent(id) {
    fetch(`${api}/${id}`)
        .then(res => res.json())
        .then(student => {
            document.getElementById("name").value = student.name;
            document.getElementById("email").value = student.email;
            document.getElementById("course").value = student.course;
            editingId = student.id;
            document.getElementById("form-title").innerText = "Update Student";
            document.getElementById("addBtn").innerText = "Update Student";
        });
}

function deleteStudent(id) {
    if (confirm("Are you sure you want to delete this student?")) {
        fetch(`${api}/${id}`, { method: "DELETE" })
            .then(() => loadStudents());
    }
}

function loadStudents() {
    fetch(api)
        .then(res => res.json())
        .then(data => {
            let table = "";
            data.forEach(student => {
                table += `
                    <tr>
                        <td>${student.id}</td>
                        <td>${student.name}</td>
                        <td>${student.email}</td>
                        <td>${student.course}</td>
                        <td>
                            <button class="edit-btn" onclick="editStudent(${student.id})">Edit</button>
                            <button class="delete-btn" onclick="deleteStudent(${student.id})">Delete</button>
                        </td>
                    </tr>
                `;
            });
            document.getElementById("studentTable").innerHTML = table;
        })
        .catch(err => console.error("Error loading students:", err));
}

function resetForm() {
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("course").value = "";
    editingId = null;
    document.getElementById("form-title").innerText = "Add Student";
    document.getElementById("addBtn").innerText = "Add Student";
}

// Search by ID, Name, or Course
function searchStudent() {
    const term = document.getElementById("searchInput").value.toLowerCase().trim();
    const table = document.getElementById("studentTable");
    const rows = table.getElementsByTagName("tr");

    for (let i = 0; i < rows.length; i++) {
        const idCell = rows[i].getElementsByTagName("td")[0];
        const nameCell = rows[i].getElementsByTagName("td")[1];
        const courseCell = rows[i].getElementsByTagName("td")[3];

        if (idCell && nameCell && courseCell) {
            const idText = idCell.textContent || idCell.innerText;
            const nameText = nameCell.textContent || nameCell.innerText;
            const courseText = courseCell.textContent || courseCell.innerText;

            if (
                idText.toLowerCase().includes(term) ||
                nameText.toLowerCase().includes(term) ||
                courseText.toLowerCase().includes(term)
            ) {
                rows[i].style.display = "";
            } else {
                rows[i].style.display = "none";
            }
        }
    }
}

// Load students on page load
window.onload = loadStudents;