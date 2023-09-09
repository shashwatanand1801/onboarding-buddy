// src/AdminPage.js
import React, { useState } from 'react';
import axios from 'axios';
import './AdminPage.css'; // Import the CSS for styling

function AdminPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    skills: [''],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'skills') {
      const skills = [...formData.skills];
      const index = parseInt(e.target.getAttribute('data-index'));
      skills[index] = value;
      setFormData({ ...formData, skills });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addSkillInput = () => {
    setFormData({ ...formData, skills: [...formData.skills, ''] });
  };

  const removeSkillInput = (index) => {
    const skills = [...formData.skills];
    skills.splice(index, 1);
    setFormData({ ...formData, skills });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/server/db/add-candidate-info', formData);
      alert('Candidate Info added successfully!');
      setFormData({
        name: '',
        email: '',
        role: '',
        skills: [''],
      });
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  return (
    <div className="admin-container">
      <h2>Welcome Admin</h2>
      <form className="admin-form" onSubmit={handleSubmit}>
        <label>Name:</label>
        <input type="text" name="name" onChange={handleChange} value={formData.name} />
        <br />
        <label>Email</label>
        <input type="email" name="email" onChange={handleChange} value={formData.email} />
        <br />
        <label>Role</label>
        <input type="role" name="role" onChange={handleChange} value={formData.role} />
        <br />
        <label>Skills:</label>
        {formData.skills.map((skill, index) => (
          <div key={index}>
            <input
              type="text"
              name="skills"
              data-index={index}
              onChange={handleChange}
              value={skill}
              className="skill-input"
            />
            <button type="button" onClick={() => removeSkillInput(index)}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={addSkillInput} className="add-skill-button">
          Add Skill
        </button>
        <br />
        <button type="submit" className="submit-button">
          Add Candidate Info
        </button>
      </form>
    </div>
  );
}

export default AdminPage;
