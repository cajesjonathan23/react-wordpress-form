import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import classNames from 'classnames';
import ReCAPTCHA from 'react-google-recaptcha';
import { FaInfoCircle, FaMoon, FaSun } from 'react-icons/fa';
import 'animate.css';
import './NextForm.css';

const NextForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    sampleField:'',
    sampleField2:'',
    sampleField3:'',
    sampleField4:'',
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
    const savedCount = localStorage.getItem('visitCount');
    return savedCount ? parseInt(savedCount, 10) : 0;
  });
  const [currentStep, setCurrentStep] = useState(1); // Track the current step

  useEffect(() => {
    const newCount = visitCount + 1;
    setVisitCount(newCount);
    localStorage.setItem('visitCount', newCount);
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      return () => clearTimeout(timer);
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
    if (currentStep === 1) {
      if (!data.fullName) newErrors.fullName = 'This field is required';
      if (!data.address) newErrors.address = 'This field is required';
    } else if (currentStep === 2) {
      if (!data.email) newErrors.email = 'This field is required';
      if (!data.phone) newErrors.phone = 'This field is required';
      if (!data.comment) newErrors.comment = 'This field is required';
      if (!data.terms) newErrors.terms = 'You must agree to the terms';
      if (!data.captchaValid) newErrors.captcha = 'Please verify you are not a robot';
    }
    return newErrors;
  };

  const handleNext = (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length === 0) {
      setCurrentStep(currentStep + 1);
    } else {
      setErrors(validationErrors);
    }
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
        setErrors({});
        setCurrentStep(1); // Reset to the first step
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

      <div className="step-tracker mb-4">
  <ul className="step-indicator d-flex align-items-center justify-content-center">
    <li className={`step-item ${currentStep >= 1 ? 'completed' : ''}`}>1</li>
    <div className={`step-line ${currentStep >= 2 ? 'completed' : ''}`}></div>
    <li className={`step-item ${currentStep >= 2 ? 'completed' : ''}`}>2</li>
  </ul>
  <p className="text-center mt-2">
    Step {currentStep} of 2
  </p>
</div>



      <form onSubmit={currentStep === 2 ? handleSubmit : handleNext}>
        {currentStep === 1 && (
          <div className="row">

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

            {/* Gender */}
            <div className="col-md-6 mb-3">
              <label htmlFor="gender" className="form-label">Gender</label>
              <select
                className="form-select"
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>



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

           
             {/* Optional Field: Sample Field */}
            <div className="col-md-6 mb-3">
                <label htmlFor="sampleField" className="form-label">
                Sample Field 
                </label>
                <input
                type="text"
                className="form-control custom-input"
                id="sampleField"
                name="sampleField"
                placeholder="Enter sample data"
                value={formData.sampleField || ''}
                onChange={handleChange}
                />
            </div>

             {/* Optional Field: Second Sample Field */}
            <div className="col-md-6 mb-3">
                <label htmlFor="sampleField2" className="form-label">
                Sample Field 2
                </label>
                <input
                type="text"
                className="form-control custom-input"
                id="sampleField2"
                name="sampleField2"
                placeholder="Enter sample data 2"
                value={formData.sampleField2 || ''}
                onChange={handleChange}
                />
            </div>

             {/* Optional Field: Second Sample Field */}
            <div className="col-md-6 mb-3">
                <label htmlFor="sampleField3" className="form-label">
                Sample Field 3
                </label>
                <input
                type="text"
                className="form-control custom-input"
                id="sampleField3"
                name="sampleField3"
                placeholder="Enter sample data 3"
                value={formData.sampleField3 || ''}
                onChange={handleChange}
                />
            </div>


            {/* Optional Field: Second Sample Field */}
            <div className="col-md-6 mb-3">
                <label htmlFor="sampleField4" className="form-label">
                Sample Field 4
                </label>
                <input
                type="text"
                className="form-control custom-input"
                id="sampleField4"
                name="sampleField4"
                placeholder="Enter sample data 4"
                value={formData.sampleField4 || ''}
                onChange={handleChange}
                />
            </div>

             {/* Optional Field: Second Sample Field */}
             <div className="col-md-6 mb-3">
                <label htmlFor="sampleField5" className="form-label">
                Sample Field 5 
                </label>
                <input
                type="text"
                className="form-control custom-input"
                id="sampleField5"
                name="sampleField5"
                placeholder="Enter sample data 5"
                value={formData.sampleField5 || ''}
                onChange={handleChange}
                />
            </div>

          </div>
        )}

        {currentStep === 2 && (
          <div className="row">
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

            <div className="col-md-12 mb-3">
              <ReCAPTCHA
                sitekey="6Ld2mUsqAAAAABiOx-PanuqPhAaUIcH4JixMohpG" // Replace with your actual reCAPTCHA site key
                onChange={handleCaptcha}
              />
              {errors.captcha && <div className="text-danger">{errors.captcha}</div>}
            </div>
          </div>
        )}

        <div className="row d-flex justify-content-between align-items-center">
          <div className="col-md-12 text-end">
            {currentStep > 1 && (
              <button type="button" className="btn btn-outline-secondary me-2" onClick={() => setCurrentStep(currentStep - 1)}>
                Previous
              </button>
            )}
            {currentStep < 2 ? (
              <button type="submit" className="btn custom-submit-btn w-100 py-2 mt-5">Next</button>
            ) : (
              <button type="submit" className="btn custom-submit-btn">Submit</button>
            )}
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

      </form>

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
    </div>
  );
};

export default NextForm;
