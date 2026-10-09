import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/students";

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [age, setAge] = useState("");
  const [editingId, setEditingId] = useState(null);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(API_URL);
      setStudents(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    axios
      .get(API_URL)
      .then((response) => {
        setStudents(response.data);
      })
      .catch((error) => console.log(error));
  }, []);

  const resetForm = () => {
    setName("");
    setCourse("");
    setAge("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      const studentData = { name, course, age: Number(age) };

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, studentData);
      } else {
        await axios.post(API_URL, studentData);
      }
      resetForm();
      fetchStudents();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (student) => {
    setEditingId(student._id);
    setName(student.name);
    setCourse(student.course);
    setAge(student.age);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchStudents();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Student Management System</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        /><br/>
        <input
          placeholder="Course"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
        /><br/>
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        /><br/><br/>
        <button type="submit">
          {editingId ? "Update Student" : "Add Student"}
        </button><br/>
        {editingId && (
          <button type="button" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form><br/><hr/><br/>

      <h2>Students</h2>

      {students.map((student) => (
        <div key={student._id}><br/>
          <p>Name: {student.name}</p>
          <p>Course: {student.course}</p>
          <p>Age: {student.age}</p><br/>
          <button onClick={() => handleEdit(student)}>Edit</button><br/>
          <button onClick={() => handleDelete(student._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;