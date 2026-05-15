import { useState, useEffect } from 'react';
import API from '../services/api';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const role = localStorage.getItem('role');

  // Fetch tasks from MongoDB
  const fetchTasks = async () => {
    try {
      const res = await API.get('/api/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch tasks");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      await API.post('/api/tasks', { title, description, assignedTo });
      setTitle(''); setDescription(''); setAssignedTo('');
      fetchTasks(); // Refresh the list
    } catch (err) {
      alert("Error creating task");
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Team Dashboard</h1>
      
      {/* ONLY ADMIN CAN SEE THIS FORM */}
      {role === 'Admin' && (
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '30px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <h3>Create New Task</h3>
          <form onSubmit={handleAddTask}>
            <input style={inputStyle} placeholder="Task Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <input style={inputStyle} placeholder="Assign To (Name)" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} required />
            <textarea style={inputStyle} placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <button style={{ padding: '10px 20px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Add Task</button>
          </form>
        </div>
      )}

      <h3>Active Tasks</h3>
      {tasks.length === 0 ? <p>No tasks found. Create one above!</p> : (
        <div style={{ display: 'grid', gap: '15px' }}>
          {tasks.map(task => (
            <div key={task._id} style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px', background: '#f9f9f9' }}>
              <strong>{task.title}</strong> - <span style={{ color: '#007bff' }}>{task.assignedTo}</span>
              <p>{task.description}</p>
              <small>Status: {task.status}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const inputStyle = { width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc' };

export default Dashboard;