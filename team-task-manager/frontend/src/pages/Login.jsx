import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'Member' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isSignup ? '/api/auth/signup' : '/api/auth/login';
      const response = await API.post(endpoint, formData);
      
      if (isSignup) {
        alert("Signup successful! Please login.");
        setIsSignup(false);
      } else {
        localStorage.setItem('role', response.data.role);
        localStorage.setItem('username', response.data.username);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: "400px", margin: "100px auto", border: "1px solid #ddd", borderRadius: "8px" }}>
      <h2>{isSignup ? "Create Account" : "Login"}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        {isSignup && (
          <input 
            placeholder="Username" 
            style={inputStyle}
            onChange={(e) => setFormData({...formData, username: e.target.value})} 
          />
        )}
        <input 
          placeholder="Email" 
          style={inputStyle}
          onChange={(e) => setFormData({...formData, email: e.target.value})} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          style={inputStyle}
          onChange={(e) => setFormData({...formData, password: e.target.value})} 
        />
        {isSignup && (
          <select style={inputStyle} onChange={(e) => setFormData({...formData, role: e.target.value})}>
            <option value="Member">Member</option>
            <option value="Admin">Admin</option>
          </select>
        )}
        <button type="submit" style={{ width: "100%", padding: "10px", background: "#007bff", color: "white", border: "none", cursor: "pointer" }}>
          {isSignup ? "Sign Up" : "Login"}
        </button>
      </form>
      <p onClick={() => setIsSignup(!isSignup)} style={{ cursor: "pointer", color: "blue", textAlign: "center", marginTop: "10px" }}>
        {isSignup ? "Have an account? Login" : "No account? Sign Up"}
      </p>
    </div>
  );
};

const inputStyle = { display: "block", width: "95%", marginBottom: "10px", padding: "8px" };

export default Login;