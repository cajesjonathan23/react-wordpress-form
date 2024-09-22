import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import ContactForm from './ContactForm'; 
import NextForm from './NextForm';
import './index.css';
import MultiForm from './MultiForm';

function App() {
  return (
    <Router>
      <div className="App">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-4">
              <Link to="/contact" className="box contact">
                <h3>Normal Form</h3>
              </Link>
            </div>
            <div className="col-md-4">
              <Link to="/next" className="box next">
                <h3>Next Form</h3>
              </Link>
            </div>
            <div className="col-md-4">
              <Link to="/multi" className="box multi">
                <h3>Multi Pages Next Form</h3>
              </Link>
            </div>
          </div>

          <Routes>
            <Route path="/contact" element={<ContactForm />} />
            <Route path="/next" element={<NextForm />} />
            <Route path="/multi" element={<MultiForm />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
