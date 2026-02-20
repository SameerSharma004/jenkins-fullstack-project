import React, { useState } from 'react';
import { Link , useNavigate} from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const SignUp = () => {
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    location: "",
    phone: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const response = await fetch(`http://65.0.185.151:5000/api/createUser?timeout=${Date.now()}`, {
        method: 'POST',
        body: JSON.stringify(credentials),
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        alert("Account created successfully!");
        navigate('/login');
      } else {
        const errorText = await response.text();
        console.error('Error response:', response.status, errorText);
        alert(`Failed to create user.
           ${errorText.toUpperCase()}`);
      }
    } catch (error) {
      console.error('Network error:', error);
      alert(`Network error: ${error.message}`);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card bg-dark text-white">
              <div className="card-body">
                <h2 className="text-center mb-4">Sign Up</h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={credentials.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={credentials.email}
                      onChange={handleChange}
                      title="Please enter a valid email address."
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={credentials.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="location" className="form-label">Location</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="location"
                      name="location" 
                      value={credentials.location} 
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label">Phone</label>
                    <input 
                      type="tel" 
                      className="form-control" 
                      id="phone"
                      name="phone" 
                      value={credentials.phone} 
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100">Sign Up</button>
                </form>
                <p className="mt-3 text-center">
                  Already have an account? <Link to="/login" className="text-primary">Login</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SignUp;
