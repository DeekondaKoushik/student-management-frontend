import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [student, setStudent] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    year: "",
  });

  const API_URL = "http://localhost:8080/students";

  // Get all students
  const getStudents = async () => {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Failed to load students");
    }

    const data = await response.json();
    setStudents(data);
  } catch (error) {
    setError("Unable to connect to the server.");
  }
};

  useEffect(() => {
    getStudents();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setStudent({
      ...student,
      [e.target.name]: e.target.value,
    });
  };

  // Add student
  // Add or Update student
const addStudent = async (e) => {
  e.preventDefault();
  setError("");
setMessage("");


  if (editingId) {
  const response = await fetch(`${API_URL}/${editingId}`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(student),
});

if (!response.ok) {
  setError("Failed to update student. Please try again.");
  return;
}
  setEditingId(null);
  setMessage("Student updated successfully!");
  setTimeout(() => {
  setMessage("");
}, 3000);
} else {
  const response = await fetch(API_URL, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(student),
});

if (!response.ok) {
  setError("Failed to add student. Please try again.");
  return;
}

  setMessage("Student added successfully!");
  setTimeout(() => {
  setMessage("");
}, 3000);
}

  setStudent({
    name: "",
    email: "",
    phone: "",
    course: "",
    year: "",
  });

  getStudents();
};
  // Edit student
   const editStudent = (s) => {
  setEditingId(s.id);

  setStudent({
    name: s.name,
    email: s.email,
    phone: s.phone,
    course: s.course,
    year: s.year,
  });
};
  // Delete student
  const deleteStudent = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this student?"
  );

  if (!confirmDelete) {
    return;
  }

  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    setError("Failed to delete student. Please try again.");
    return;
  }

  setMessage("Student deleted successfully!");

  setTimeout(() => {
    setMessage("");
  }, 3000);

  getStudents();
};

  return (
    <div className="container">
      <h1>Student Management System</h1>
      <p className="subtitle">
  Manage student information easily
</p>
<h2>{editingId ? "Edit Student" : "Add New Student"}</h2>
{message && <p className="message">{message}</p>}
{error && <p className="error-message">{error}</p>}
      <form onSubmit={addStudent} className="student-form">
        <input
          type="text"
          name="name"
          placeholder="Student Name"
          value={student.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={student.email}
          onChange={handleChange}
          required
        />
<input
  type="tel"
  name="phone"
  placeholder="Phone"
  value={student.phone}
  onChange={handleChange}
  pattern="[0-9]{10}"
  maxLength="10"
  required
/>

        <select
  name="course"
  value={student.course}
  onChange={handleChange}
  required
>
  <option value="">Select Course</option>
  <option value="Data Science">Data Science</option>
  <option value="Computer Science">Computer Science</option>
  <option value="Information Technology">Information Technology</option>
  <option value="Electronics">Electronics</option>
</select>

       <select
  name="year"
  value={student.year}
  onChange={handleChange}
  required
>
  <option value="">Select Year</option>
  <option value="1st Year">1st Year</option>
  <option value="2nd Year">2nd Year</option>
  <option value="3rd Year">3rd Year</option>
  <option value="4th Year">4th Year</option>
</select>
      <button type="submit">
  {editingId ? "Update Student" : "Add Student"}
</button>

{editingId && (
  <button
    type="button"
    onClick={() => {
      setEditingId(null);
      setStudent({
        name: "",
        email: "",
        phone: "",
        course: "",
        year: "",
      });
    }}
  >
  Cancel
  </button>
)}
      </form>
      <input
  type="text"
  placeholder="Search student by name or email"
  className="search-box"
  value={search}
onChange={(e) => setSearch(e.target.value)}
/>
{search && (
  <button
    className="clear-search"
    onClick={() => setSearch("")}
  >
    Clear Search
  </button>
)}
      <h2>Dashboard</h2>

<div className="dashboard">

  <div className="dashboard-card">
    <h3>Total Students</h3>
    <p>{students.length}</p>
  </div>

  <div className="dashboard-card">
    <h3>Departments</h3>

    <p>
      Data Science:{" "}
      {students.filter((s) => s.course === "Data Science").length}
    </p>

    <p>
      Computer Science:{" "}
      {students.filter((s) => s.course === "Computer Science").length}
    </p>

    <p>
      Information Technology:{" "}
      {students.filter((s) => s.course === "Information Technology").length}
    </p>

    <p>
      Electronics:{" "}
      {students.filter((s) => s.course === "Electronics").length}
    </p>
  </div>

  <div className="dashboard-card">
    <h3>Years</h3>

    <p>
      1st Year:{" "}
      {students.filter((s) => s.year === "1st Year").length}
    </p>

    <p>
      2nd Year:{" "}
      {students.filter((s) => s.year === "2nd Year").length}
    </p>

    <p>
      3rd Year:{" "}
      {students.filter((s) => s.year === "3rd Year").length}
    </p>

    <p>
      4th Year:{" "}
      {students.filter((s) => s.year === "4th Year").length}
    </p>
  </div>

</div>

<h2>Student List</h2>


      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Course</th>
            <th>Year</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {students
  .filter((s) =>
   s.name.toLowerCase().includes(search.toLowerCase()) ||
s.email.toLowerCase().includes(search.toLowerCase())
  )
  .map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.phone}</td>
              <td>{s.course}</td>
              <td>{s.year}</td>
              <td>
  <button onClick={() => editStudent(s)}>
    Edit
  </button>

  <button onClick={() => deleteStudent(s.id)}>
    Delete
  </button>
</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;