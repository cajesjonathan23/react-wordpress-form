import React, { useState,useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import classNames from 'classnames';
import ReCAPTCHA from 'react-google-recaptcha'; // Import reCAPTCHA
import { FaInfoCircle, FaMoon, FaSun } from 'react-icons/fa';
import 'animate.css';
import './ContactForm.css'; // For custom CSS

const ContactForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    email: '',
    phone: '',
    comment: '',
    terms: false,
    captchaValid: false,
  });

  const [errors, setErrors] = useState({});
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);


  const [visitCount, setVisitCount] = useState(() => {
    // Retrieve the visit count from localStorage
    const savedCount = localStorage.getItem('visitCount');
    return savedCount ? parseInt(savedCount, 10) : 0; // Parse to integer or default to 0
  });

  useEffect(() => {
    // Increment visit count and save it to localStorage
    const newCount = visitCount + 1;
    setVisitCount(newCount);
    localStorage.setItem('visitCount', newCount); // Save updated count
  }, []); // Runs only on mount

  //close the success message

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 5000); // Close after 5 seconds
  
      return () => clearTimeout(timer); // Clear the timeout if component unmounts
    }
  }, [successMessage]);
  

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newFormData = {
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    };
  
    // Validate the form whenever an input changes
    const newErrors = validateForm(newFormData);
    setErrors(newErrors);
    setFormData(newFormData);
  };
  

  const handlePhoneChange = (value) => {
    setFormData({
      ...formData,
      phone: value,
    });
  };

  const handleCaptcha = (value) => {
    if (value) {
      setFormData({ ...formData, captchaValid: true });
      setErrors({ ...errors, captcha: '' });
    } else {
      setFormData({ ...formData, captchaValid: false });
      setErrors({ ...errors, captcha: 'Please verify you are not a robot' });
    }
  };

  const validateForm = (data) => {
    const newErrors = {};
    if (!data.fullName) newErrors.fullName = 'This field is required';
    if (!data.address) newErrors.address = 'This field is required';
    if (!data.email) newErrors.email = 'This field is required';
    if (!data.phone) newErrors.phone = 'This field is required';
    if (!data.comment) newErrors.comment = 'This field is required';
    if (!data.terms) newErrors.terms = 'You must agree to the terms';
    if (!data.captchaValid) newErrors.captcha = 'Please verify you are not a robot';
  
    return newErrors;
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      setSuccessMessage('');
      setTimeout(() => {
        setLoading(false);
        setSuccessMessage('Your form has been submitted successfully!');
        setFormData({
          fullName: '',
          address: '',
          email: '',
          phone: '',
          comment: '',
          terms: false,
          captchaValid: false,
        });
        setErrors({}); // Clear errors on successful submission
      }, 2000);
    } else {
      setErrors(validationErrors);
    }
  };
  

  return (
    <div className={`container mt-5 my-6 p-4 ${isDarkMode ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
      <button onClick={toggleTheme} className="btn btn-outline-secondary mb-3">
        {isDarkMode ? <FaSun /> : <FaMoon />} {isDarkMode ? 'Light Mode' : 'Dark Mode'}
      </button>

      <div className="row">
        {/* First column: Image */}
        <div className="col-md-4 d-flex justify-content-center align-items-center">
          <img
            src="https://www.hybridanalytica.com.sg/wp-content/uploads/2022/07/contact-right.png" // Replace with the actual image URL
            alt="Contact Us"
            className="img-fluid"
          />
        </div>

        {/* Second and third columns: Form */}
        <div className="col-md-8 position-relative" style={{ minHeight: '300px' }}>
          <form onSubmit={handleSubmit}>
            <div className="row">
              {/* Full Name */}
              <div className="col-md-6 mb-3">
                <label htmlFor="fullName" className="form-label">Full Name <span style={{ color: 'red' }}>*</span></label>
                <input
                  type="text"
                  className={classNames("form-control custom-input", { "is-invalid": errors.fullName })}
                  id="fullName"
                  name="fullName"
                  placeholder="Enter full name here"
                  value={formData.fullName}
                  onChange={handleChange}
                />
                {errors.fullName && <div className="text-danger">{errors.fullName}</div>}
              </div>

              {/* Phone Number */}
              <div className="col-md-6 mb-3">
                <label htmlFor="phone" className="form-label">Phone Number <span style={{ color: 'red' }}>*</span></label>
                <PhoneInput
                  country={'us'}
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  inputClass={classNames("form-control custom-input phoneNumber", { "is-invalid": errors.phone })}
                  containerClass="w-100 mb-3"
                />
                {errors.phone && <div className="text-danger">{errors.phone}</div>}
              </div>
            </div>

            <div className="row">
              {/* Address */}
              <div className="col-md-6 mb-3">
                <label htmlFor="address" className="form-label">Address <span style={{ color: 'red' }}>*</span></label>
                <input
                  type="text"
                  className={classNames("form-control custom-input", { "is-invalid": errors.address })}
                  id="address"
                  name="address"
                  placeholder="Enter address here"
                  value={formData.address}
                  onChange={handleChange}
                />
                {errors.address && <div className="text-danger">{errors.address}</div>}
              </div>

              {/* Email Address */}
              <div className="col-md-6 mb-3">
                <label htmlFor="email" className="form-label">Email Address <span style={{ color: 'red' }}>*</span></label>
                <input
                  type="email"
                  className={classNames("form-control custom-input", { "is-invalid": errors.email })}
                  id="email"
                  name="email"
                  placeholder="example@domain.com"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <div className="text-danger">{errors.email}</div>}
              </div>
            </div>

            <div className="row">
              {/* Question/Comment */}
              <div className="col-md-12 mb-3">
                <label htmlFor="comment" className="form-label">Question / Comment <span style={{ color: 'red' }}>*</span></label>
                <textarea
                  className={classNames("form-control", { "is-invalid": errors.comment })}
                  id="comment"
                  name="comment"
                  rows="4"
                  placeholder="Enter your question or comment here"
                  value={formData.comment}
                  onChange={handleChange}
                />
                {errors.comment && <div className="text-danger">{errors.comment}</div>}
              </div>
            </div>

            <div className="row">
              {/* Terms Checkbox */}
              <div className="col-md-12 mb-3 form-check">
                <input
                  type="checkbox"
                  className={classNames("form-check-input custom-checkbox", { "is-invalid": errors.terms })}
                  id="terms"
                  name="terms"
                  checked={formData.terms}
                  onChange={handleChange}
                />
                <label className="form-check-label mt-1" htmlFor="terms">
                  By submitting this form you agree to the terms of the Privacy Policy.
                </label>
                {errors.terms && <div className="text-danger">{errors.terms}</div>}
              </div>
            </div>

            <div className="row">
              {/* reCAPTCHA */}
              <div className="col-md-12 mb-3">
                <ReCAPTCHA
                  sitekey="6Lf5IEsqAAAAAGTB9UPLVHWt5eZ54ZdP2jUn7Df9" // Replace with your actual reCAPTCHA site key
                  onChange={handleCaptcha}
                />
                {errors.captcha && <div className="text-danger">{errors.captcha}</div>}
              </div>
            </div>

                {loading && (
                  <div className="loading-overlay d-flex justify-content-center align-items-center position-absolute w-100 h-100" style={{ background: 'rgba(0, 0, 0, 0.5)', top: 0, left: 0 }}>
                    <div className="text-center">
                      <div className="spinner-grow text-light" role="status" style={{ width: '5rem', height: '5rem' }}>
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="text-light mt-3" style={{ fontSize: '1.5rem' }}>Submitting...</p>
                    </div>
                  </div>
                )}

                    <div className="row d-flex justify-content-between align-items-center">
                    {/* Submit Button */}
                    <div className="col-md-12 text-end">
                        <button type="submit" className="btn custom-submit-btn w-100 py-2">Submit</button>
                    </div>
                    </div>

                    {successMessage && (
                      <div
                        className="d-flex justify-content-center align-items-center"
                        style={{
                          position: 'fixed',
                          top: '0',
                          left: '0',
                          right: '0',
                          bottom: '0',
                          zIndex: '1050',
                          background: 'rgba(0, 0, 0, 0.6)',
                        }}
                      >
                        <div
                          className="card p-5 text-center animate__animated animate__fadeInDown animate__faster"
                          style={{
                            borderRadius: '15px',
                            width: '400px',
                            height: '400px',
                            backgroundColor: 'white',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                          }}
                        >
                          {/* Card Icon with Checkmark */}
                          <div
                            className="card-icon-container"
                            style={{
                              width: '100px',
                              height: '100px',
                              borderRadius: '15px',
                              backgroundColor: '#f0f0f0',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              marginBottom: '20px',
                            }}
                          >
                            {/* Checkmark inside card */}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="60"
                              height="60"
                              fill="green"
                              className="bi bi-check-circle-fill animate__animated animate__zoomIn"
                              viewBox="0 0 16 16"
                            >
                              <path
                                d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.146-2.646a.5.5 0 0 0-.708-.708L7 9.293 4.854 7.146a.5.5 0 1 0-.708.708l2.5 2.5a.5.5 0 0 0 .708 0l5-5z"
                              />
                            </svg>
                          </div>

                          {/* Success Text */}
                          <h4 className="text-success mb-3">Form Submitted!</h4>
                          <p>Your form has been submitted successfully.</p>

                        
                        </div>
                      </div>
                    )}


                                
                {/* Icon with tooltip for visit count */}
                <div className="row mt-3 d-flex justify-content-center">
                    <div className="col-md-12 text-end">
                    <FaInfoCircle
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title={`This form has been visited ${visitCount} times.`}
                        style={{ fontSize: '24px', cursor: 'pointer', color: 'violet' }}
                    />
                    </div>
                </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
