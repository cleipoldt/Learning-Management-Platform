import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegForm.css';

function RegForm() {
    const [formData, setFormData] = useState({
      username: '',
      password: '',
      confirmPassword: '',
      email: ''
    });
  
    const [error, setError] = useState('');
    const navigate = useNavigate();
  
    const validate = () => {
      const { username, password, confirmPassword, email } = formData;
  
      const usernameRegex = /^[A-Za-z][A-Za-z0-9_-]{2,19}$/;
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+\[\]{}|;:'\",.<>?/`~])[A-Za-z\d!@#$%^&*()\-_=+\[\]{}|;:'\",.<>?/`~]{8,}$/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.(com|net|io)$/;
  
      if (!usernameRegex.test(username)) return 'Invalid username format';
      if (!passwordRegex.test(password)) return 'Invalid password format';
      if (password !== confirmPassword) return 'Passwords do not match';
      if (!emailRegex.test(email)) return 'Invalid email address';
      return '';
    };
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const validationError = validate();
      if (validationError) {
        setError(validationError);
        return;
      }
  
      try {
        const res = await fetch('http://localhost:5000/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
  
        const data = await res.json();
  
        if (res.ok) {
          localStorage.setItem("student_id", data.student_id);
          navigate('/login');
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Signup failed. Try again later.');
      }
    };
  
    return (
      <div className="form-flex">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          Username:
          <input type="text" id="name" name="username" placeholder="Username" className="userpass" onChange={handleChange} />
          Password:
          <input type="password" id="password" name="password" placeholder="Password" className="userpass" onChange={handleChange} />
          Confirm Password:
          <input type="password" name="confirmPassword" placeholder="Confirm Password" className="userpass" onChange={handleChange} />
          Email:
          <input type="text" name="email" placeholder="Email" className="userpass" onChange={handleChange} />
          <button type="submit" className="loginbutton">Sign Up</button>
        </form>
        {error && <div className="form-flex">{error}</div>}
      </div>
    );
};

export default RegForm;