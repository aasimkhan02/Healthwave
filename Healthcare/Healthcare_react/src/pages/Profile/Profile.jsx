import React, { useState, useEffect } from 'react';
import './Profile.css';
import Profile_men from './../../assets/Profile picture men.png'
import target from './../../assets/target.png'
import pill from './../../assets/Pill.png'
import injection from './../../assets/injection.png'
import document from './../../assets/document.png'

const Icon = ({ name, width = 22, height = 22, color = 'currentColor', style = {} }) => {
    const icons = {
        chevronRight: (
            <polyline points="9 18 15 12 9 6"></polyline>
        ),
        grid: (
            <>
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
            </>
        ),
        user: (
            <>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
            </>
        ),
        fileText: (
            <>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"></path>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <line x1="10" y1="9" x2="8" y2="9"></line>
            </>
        ),
        archive: (
            <>
                <path d="M21 15v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6"></path>
                <path d="M21 15v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6"></path>
                <path d="M5 4V2H3v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V2h-2v2"></path>
            </>
        ),
        file: (
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"></path>
        ),
        phone: (
            <g>
                <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
                <circle cx="12" cy="18" r="1"></circle>
            </g>
        ),
        shield: (
            <path d="M12 2a9 9 0 0 0 9 9v6a9 9 0 0 1-9 9A9 9 0 0 1 3 17v-6a9 9 0 0 0 9-9z"></path>
        ),
        target: (
            <>
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="6"></circle>
                <circle cx="12" cy="12" r="2"></circle>
            </>
        ),
        activity: (
            <path d="M20 13.5l-3.5-2-3.5 2V5h-4v8.5L4 13.5V21h16v-7.5z"></path>
        ),
        drugs: (
            <>
                <path d="M17 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"></path>
                <path d="M7 9h10v2H7zm0 4h10v2H7zm0 4h10v2H7z"></path>
            </>
        )
    };
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width={width} 
            height={height} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke={color} 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={`feather feather-${name}`}
            style={style}
        >
            {icons[name]}
        </svg>
    );
};

const Profile = () => {
    const [isMoved, setIsMoved] = useState(false);
    const [hoveredIcon, setHoveredIcon] = useState(null);
    const [activeSection, setActiveSection] = useState('overview');
    const [labRecords, setLabRecords] = useState([]);

    const handleChevronClick = () => {
        setIsMoved(!isMoved);
    };

    const handleSectionChange = (section) => {
        setActiveSection(section);
    };

    const handleNewRecord = () => {
        setLabRecords([...labRecords, { testType: '', description: '', results: null, date: '', doctor: '' }]);
    };

    const handleDeleteRecord = (index) => {
        const updatedRecords = labRecords.filter((_, i) => i !== index);
        setLabRecords(updatedRecords);
    };

    const handleSaveRecord = async (index) => {
        const token = localStorage.getItem('access_token');
        if (!token) return console.error("Access token is missing.");
    
        const formData = new FormData();
        const record = labRecords[index];
    
        formData.append('testType', record.testType);
        formData.append('description', record.description);
        formData.append('results', record.results); // This should be a file
        formData.append('date', record.date);
        formData.append('doctor', record.doctor);
    
        try {
            const response = await fetch(`/api/lab-records/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
            });
    
            if (response.ok) {
                console.log('Lab record saved successfully');
                // Optionally fetch updated records here if needed
            } else {
                console.error('Error saving lab record:', response.status);
            }
        } catch (error) {
            console.error('Error during fetch:', error);
        }
    };

    const [personalInfo, setPersonalInfo] = useState({
        user: null,
        first_name: '',
        last_name: '',
        gender: '',
        email: '',
        phone_number: '',
        address: '',
        city: '',
        state: '',
        date_of_birth: '',
        age: ''
    });

    const [userMedicalInformation, setUserMedicalInformation] = useState({
        user: null,
        bloodGroup: '',
        weight: '',
        height: '',
        allergies: '',
        medicalConditions: '',
        bloodPressure: '',
        bloodSugarFasting: '',
        bloodSugarPostprandial: '',
        cholesterolLDL: '',
        cholesterolHDL: '',
        bmi: '',
        disabilities: ''
    });

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            fetchUserDetails(); // Only call if token exists
            fetchUserMedicalInformation(); // Fetch medical information as well
        } else {
            console.error("Access token is missing.");
        }
    }, []);

    const fetchUserDetails = async () => {
        const token = localStorage.getItem('access_token');
        if (!token) return console.error("Access token is missing.");
    
        try {
            const response = await fetch('http://localhost:8000/api/personal-info/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (response.ok) {
                const data = await response.json();
                // Assuming data is an array of personal information, take the first one
                if (data.length > 0) {
                    setPersonalInfo(data[0]); // Set the first entry, modify as needed
                } else {
                    console.error("No personal information found.");
                }
            } else {
                const errorData = await response.json();
                console.error('Error fetching personal information:', errorData);
            }
        } catch (error) {
            console.error('Error during fetch:', error);
        }
    };
    

    const fetchUserMedicalInformation = async () => {
        const token = localStorage.getItem('access_token');
        if (!token) return console.error("Access token is missing.");
    
        try {
            const response = await fetch('http://localhost:8000/api/medical-info/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (response.ok) {
                const data = await response.json();
                if (data.length > 0) {
                    setUserMedicalInformation(data[0]); // Assuming you want the first entry
                } else {
                    console.error("No medical information found.");
                }
            } else {
                const errorData = await response.json();
                console.error('Error fetching user medical information:', errorData);
            }
        } catch (error) {
            console.error('Error during fetch:', error);
        }
    };
    
    
    
    const handleFileChange = (index, event) => {
        const file = event.target.files[0];
        setLabRecords((prevRecords) => {
            const newRecords = [...prevRecords];
            newRecords[index].results = file; // Store the file
            return newRecords;
        });
    };

    const handleMedicalChange = (e) => {
        const { name, value } = e.target;
        setUserMedicalInformation((prevInfo) => ({ ...prevInfo, [name]: value }));
    };

    const handleSave = async () => {
        const token = localStorage.getItem('access_token');
        if (!token) return console.error("Access token is missing.");
    
        try {
            const response = await fetch(`http://localhost:8000/api/personal-info/${personalInfo.id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    username: personalInfo.user,  // Send username here
                    first_name: personalInfo.first_name,
                    last_name: personalInfo.last_name,
                    gender: personalInfo.gender,
                    email: personalInfo.email,
                    phone_number: personalInfo.phone_number,
                    address: personalInfo.address,
                    city: personalInfo.city,
                    state: personalInfo.state,
                    date_of_birth: personalInfo.date_of_birth,
                    age: personalInfo.age,
                }),
            });
    
            if (response.ok) {
                console.log('Personal information saved');
                fetchUserDetails(); // Refresh user details to see updated data
            } else {
                const errorData = await response.json();
                console.error('Error saving personal information:', errorData);
            }
        } catch (error) {
            console.error('Error during fetch:', error);
        }
    };
    
    const handleSaveMedicalInfo = async () => {
        const token = localStorage.getItem('access_token');
        if (!token) return console.error("Access token is missing.");
    
        // Assuming you want to use the userMedicalInformation ID for the update
        const medicalInfoId = userMedicalInformation.id; // Ensure this ID is set correctly
    
        try {
            const response = await fetch(`http://localhost:8000/api/medical-info/${medicalInfoId}/`, {
                method: 'PUT', // Change from POST to PUT
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    user: personalInfo.user, // This can be included if required
                    blood_group: userMedicalInformation.bloodGroup,
                    weight: userMedicalInformation.weight,
                    height: userMedicalInformation.height,
                    allergies: userMedicalInformation.allergies,
                    medical_conditions: userMedicalInformation.medicalConditions,
                    blood_pressure: userMedicalInformation.bloodPressure,
                    blood_sugar_fasting: userMedicalInformation.bloodSugarFasting,
                    blood_sugar_postprandial: userMedicalInformation.bloodSugarPostprandial,
                    cholesterol_ldl: userMedicalInformation.cholesterolLDL,
                    cholesterol_hdl: userMedicalInformation.cholesterolHDL,
                    bmi: userMedicalInformation.bmi,
                    disabilities: userMedicalInformation.disabilities,
                }),
            });
    
            if (response.ok) {
                console.log('Medical information saved');
                fetchUserMedicalInformation(); // Refresh medical information to see updated data
            } else {
                const errorData = await response.json();
                console.error('Error saving medical information:', errorData);
            }
        } catch (error) {
            console.error('Error during fetch:', error);
        }
    };
    
    
    
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPersonalInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
    };

        

    const iconData = [
        { name: 'chevronRight', width: 34, height: 34, color: 'White', noHover: true },
        { name: 'grid' },
        { name: 'user' },
        { name: 'file' },
        { name: 'phone' },
        { name: 'shield' },
    ];

    return (
        <div className='Profile-page'>
            <div className={`Sidebar ${isMoved ? 'move-right' : ''}`}>
                <div className="Sidebar-button-details">
                    <h1 className='Logo'>HealthWave</h1>
                    <p className='Overview' onClick={() => handleSectionChange('overview')} style={{ backgroundColor: hoveredIcon === 'grid' ? 'rgb(200, 200, 200)' : 'transparent'}}>Overview</p>
                    <p className='Profile' onClick={() => handleSectionChange('profile')} style={{ backgroundColor: hoveredIcon === 'user' ? 'rgb(200, 200, 200)' : 'transparent' }}>Profile</p>
                    <p className='Lab' onClick={() => handleSectionChange('lab')} style={{ backgroundColor: hoveredIcon === 'file' ? 'rgb(200, 200, 200)' : 'transparent' }}>Lab</p>
                    <p className='Contacts' onClick={() => handleSectionChange('Contacts')} style={{ backgroundColor: hoveredIcon === 'phone' ? 'rgb(200, 200, 200)' : 'transparent' }}>Contacts</p>
                    <p className='Vaccination' onClick={() => handleSectionChange('vaccination')} style={{ backgroundColor: hoveredIcon === 'shield' ? 'rgb(200, 200, 200)' : 'transparent' }}>Vaccination</p>
                </div>
                <div className="Sidebar-button">
                    {iconData.map((icon, index) => (
                        <h1 
                            key={index} 
                            className={icon.noHover ? 'no-hover' : ''} 
                            onClick={icon.name === 'chevronRight' ? handleChevronClick : null}
                            onMouseEnter={() => setHoveredIcon(icon.name)}
                            onMouseLeave={() => setHoveredIcon(null)}
                        >
                            <Icon 
                                name={icon.name} 
                                width={icon.width} 
                                height={icon.height} 
                                color={icon.color} 
                                style={icon.style} 
                            />
                        </h1>
                    ))}
                </div>
            </div>
            <div className={`Overview-section ${isMoved ? 'expanded' : ''} ${activeSection === 'overview' ? 'flex' : 'none'}`}>
                <h1 className='title'>Overview</h1>
                <div className="Overview-container">
                        <div className="grid1">
                            <div className={`Profile-overview ${isMoved ? 'expanded' : ''}`}>
                                <div className="Profile-overview-basics">
                                    <div className="Profile-image">
                                        <img src={Profile_men} alt="" />
                                        <p style={{fontWeight: 700, fontSize: 20, color: '#007bff'}} >John_Doe221</p>
                                        <p style={{fontWeight: 300, fontSize: 18, color: '#007bff', textTransform: 'uppercase', letterSpacing: 1}}>Patient</p>
                                    </div>
                                    <div className={`Profile-other-details ${isMoved ? 'expanded' : ''}`}>
                                        <p>Height: <br /><span>5' 9''</span></p>
                                        <p>Weight: <br /><span>70kg</span></p>
                                        <p>DOB: <br /><span>1/1/2000</span></p>
                                        <p>Age: <br /><span>24y 8m</span></p>
                                    </div>
                                </div>
                                <div className="Vertical-line"></div>
                                <div className={`Profile-overview-others ${isMoved ? 'expanded' : ''}`}>
                                    <p>Contact: <br /><span>9809726390</span></p>
                                    <p>Address: <br /><span>123 Arden building, Navi Mumbai</span></p>
                                    <p>Email: <br /><span>akrcs232@gmail.com</span></p>
                                    <p>Blood Group: <br /><span>A+</span></p>
                                </div>
                            </div>
                            <div className="Setup-goals">
                                <h2 style={{color: '#007bff'}}>SET-UP GOALS</h2>
                                <hr className='horizontal-line'/>
                                <div className={`weight ${isMoved ? 'expanded' : ''}`}>
                                    <img src={target} alt="" className='target' />
                                    <div className="weight-content">
                                        <h3>Weight Goal</h3>
                                        <h1 className='weight-goal'>23kg</h1>
                                    </div>
                                </div>
                                <div className={`Hydration ${isMoved ? 'expanded' : ''}`}>
                                    <img src={target} alt="" className='target' />
                                    <div className="Hydration-content">
                                        <h3>Hydration Goal</h3>
                                        <h1 className='hydration-goal'>5 litres</h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="grid2">
                            <div className='Current-medications'>
                                <h2 style={{color: '#007bff', fontSize: 20}}>CURRENT MEDICATIONS</h2>
                                <hr className='horizontal-line'/>
                                <ul style={{listStyle: 'none'}}>
                                    <li>
                                        <img src={pill} alt="" style={{width: '12%'}}/>
                                        <h2 style={{fontSize: '22px'}}>Aspirin</h2>
                                    </li>
                                    <li>
                                        <img src={pill} alt="" style={{width: '12%'}}/>
                                        <h2 style={{fontSize: '22px'}}>Ibuprofen</h2>
                                    </li>
                                    <li>
                                        <img src={pill} alt="" style={{width: '12%'}}/>
                                        <h2 style={{fontSize: '22px'}}>Metformin</h2>
                                    </li>
                                    <li>
                                        <img src={pill} alt="" style={{width: '12%'}}/>
                                        <h2 style={{fontSize: '22px'}}>Amoxicillin</h2>
                                    </li>
                                </ul>
                            </div>
                            <div className="vaccination-records">
                                <h2 style={{color: '#007bff', fontSize: 20, textTransform: 'uppercase'}}>Vaccination Records</h2>
                                <hr className='horizontal-line'/>
                                <ul style={{listStyle: 'none'}}>
                                    <li>
                                        <img src={injection} alt="" style={{width: '12%'}}/>
                                        <h2 style={{fontSize: '22px'}}>Covid-19 Vaccine</h2>
                                    </li>
                                    <li>
                                        <img src={injection} alt="" style={{width: '12%'}}/>
                                        <h2 style={{fontSize: '22px'}}>MMR Vaccine</h2>
                                    </li>
                                    <li>
                                        <img src={injection} alt="" style={{width: '12%'}}/>
                                        <h2 style={{fontSize: '22px'}}>Hepatitis B Vaccine</h2>
                                    </li>
                                </ul>
                            </div>
                            <div className="Emergency-contacts">
                                <h2 style={{color: '#007bff', fontSize: 20, textTransform: 'uppercase'}}>Emergency Records</h2>
                                <hr className='horizontal-line'/>
                                <ul>
                                    <li>
                                        <h3>Primary Contact</h3>
                                        <h2>8787238742</h2>
                                    </li>
                                    <li>
                                        <h3>Secondary Contact</h3>
                                        <h2>8787245442</h2>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="grid3">
                            <div className="Patient-notes">
                                <h2 style={{color: '#007bff', fontSize: 20, textTransform: 'uppercase'}}>Patient Notes</h2>
                                <hr className='horizontal-line'/>
                                <div className="content">
                                    <h3 style={{fontWeight: 500, color: '#007bff'}}>19/2/2024</h3>
                                    <h3 style={{fontWeight: 500, color: '#007bff'}}>- Dr Albert</h3>
                                    <p style={{fontSize: '17px'}}>Patient has a confirmed peanut allergy, with a history of mild to severe reactions. The most recent exposure led to hives, swelling, and difficulty breathing, treated with epinephrine and antihistamines. The patient is advised to avoid peanuts and carry an epinephrine auto-injector at all times. Follow-up with an allergist for further management is recommended.</p>
                                </div>
                            </div>
                            <div className="lab-results">
                                <h2 style={{color: '#007bff', fontSize: 20, textTransform: 'uppercase'}}>Lab Records</h2>
                                <hr className='horizontal-line'/>
                                <ul style={{listStyle: 'none'}}>
                                    <li>
                                        <img src={document} alt="" style={{width: '10%'}}/>
                                        <h2 style={{fontSize: '22px'}}>Blood Test (12/04/2024)</h2>
                                    </li>
                                    <li>
                                        <img src={document} alt="" style={{width: '10%'}}/>
                                        <h2 style={{fontSize: '22px'}}>X-RAY (20/05/2024)</h2>
                                    </li>
                                    <li>
                                        <img src={document} alt="" style={{width: '10%'}}/>
                                        <h2 style={{fontSize: '22px'}}>CT Scan (25/05/2024)</h2>
                                    </li>
                                    <li>
                                        <img src={document} alt="" style={{width: '10%'}}/>
                                        <h2 style={{fontSize: '22px'}}>CT Scan (06/07/2024)</h2>
                                    </li>
                                </ul>
                            </div>
                    </div>
                </div>
            </div>
            <div className={`Profile-section ${isMoved ? 'expanded' : ''} ${activeSection === 'profile' ? 'flex' : 'none'}`}>
                    <h1 className='title'>User Profile</h1>
                    <div className="Profile-container">
                    <div className="main-identification">
                        <img src={Profile_men} alt="Profile" style={{ width: '30vh' }} />
                        <h2 style={{ fontSize: 35 }} className='page-username'>{personalInfo.first_name || 'User'}</h2>
                    </div>
                    <div className="personal-information">
                        <h2 style={{ textTransform: 'uppercase', color: '#007bff', letterSpacing: 2 }}>Personal Information</h2>
                        <div className="Username">
                            <div className="Firstname">
                                <h3>First Name</h3>
                                <input
                                    type="text"
                                    name="first_name"
                                    placeholder='Enter your First Name'
                                    value={personalInfo.first_name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="Lastname">
                                <h3>Last Name</h3>
                                <input
                                    type="text"
                                    name="last_name"
                                    placeholder='Enter your Last Name'
                                    value={personalInfo.last_name}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="Gender">
                            <h3>Gender</h3>
                            <input
                                type="text"
                                name="gender"
                                placeholder='Enter your Gender'
                                value={personalInfo.gender}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="Email">
                            <h3>Email</h3>
                            <input
                                type="email"
                                name="email"
                                placeholder='Enter valid Email address'
                                value={personalInfo.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="PhoneNumber">
                            <h3>Phone Number</h3>
                            <input
                                type="tel"
                                name="phone_number"
                                placeholder='Enter Phone Number'
                                value={personalInfo.phone_number}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="Address">
                            <h3>Address</h3>
                            <input
                                type="text"
                                name="address"
                                placeholder='Enter your Home address'
                                value={personalInfo.address}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="Location">
                            <div className="City">
                                <h3>City</h3>
                                <input
                                    type="text"
                                    name="city"
                                    placeholder='Enter your City name'
                                    value={personalInfo.city}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="State">
                                <h3>State</h3>
                                <input
                                    type="text"
                                    name="state"
                                    placeholder='Enter your State name'
                                    value={personalInfo.state}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="Age-container">
                            <div className="DOB">
                                <h3>Date of Birth</h3>
                                <input
                                    type="date"
                                    name="date_of_birth"
                                    value={personalInfo.date_of_birth}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="Age">
                                <h3>Age</h3>
                                <input
                                    type="number"
                                    name="age"
                                    placeholder='Enter your Age'
                                    value={personalInfo.age}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="Save">
                            <button className='Save button' style={{ marginTop: 10 }} onClick={handleSave}>Save</button>
                        </div>

                        </div>
                        <div className="Medical-information">
                            <h2 style={{ textTransform: 'uppercase', color: '#007bff', letterSpacing: 2 }}>
                                Medical Information
                            </h2>

                            <div className="Blood-group">
                                <h3>Blood Group</h3>
                                <input
                                    type="text"
                                    name="bloodGroup"
                                    placeholder='Enter your Blood group'
                                    value={userMedicalInformation.bloodGroup || ''} // Ensure value is a string
                                    onChange={handleMedicalChange}
                                />
                            </div>

                            <div className="Weight-Height">
                                <div className="Weight">
                                    <h3>Weight (kg)</h3>
                                    <input
                                        type="number"
                                        name="weight"
                                        placeholder='Enter your Weight'
                                        value={userMedicalInformation.weight || ''} // Ensure value is a string
                                        onChange={handleMedicalChange}
                                    />
                                </div>
                                <div className="Height">
                                    <h3>Height (ft)</h3>
                                    <input
                                        type="number"
                                        name="height"
                                        placeholder='Enter your Height'
                                        value={userMedicalInformation.height || ''} // Ensure value is a string
                                        onChange={handleMedicalChange}
                                    />
                                </div>
                            </div>

                            <div className="Allergies">
                                <h3>Allergies</h3>
                                <input
                                    type="text"
                                    name="allergies"
                                    placeholder='Enter all your allergies'
                                    value={userMedicalInformation.allergies || ''} // Ensure value is a string
                                    onChange={handleMedicalChange}
                                />
                            </div>

                            <div className="Medical-conditions">
                                <h3>Medical Conditions</h3>
                                <input
                                    type="text"
                                    name="medicalConditions"
                                    placeholder='Enter your Medical Conditions'
                                    value={userMedicalInformation.medicalConditions || ''} // Ensure value is a string
                                    onChange={handleMedicalChange}
                                />
                            </div>

                            <div className="Blood-pressure">
                                <h3>Blood Pressure</h3>
                                <input
                                    type="text"
                                    name="bloodPressure"
                                    placeholder='Enter your current blood pressure'
                                    value={userMedicalInformation.bloodPressure || ''} // Ensure value is a string
                                    onChange={handleMedicalChange}
                                />
                            </div>

                            <div className="Blood-sugar-level">
                                <div className="Blood-sugar-level-fasting">
                                    <h3>Blood Sugar level (fasting)</h3>
                                    <input
                                        type="number"
                                        name="bloodSugarFasting"
                                        placeholder='Enter your fasting blood sugar level'
                                        value={userMedicalInformation.bloodSugarFasting || ''} // Ensure value is a string
                                        onChange={handleMedicalChange}
                                    />
                                </div>
                                <div className="Blood-sugar-level-postprandial">
                                    <h3>Blood Sugar level (postprandial)</h3>
                                    <input
                                        type="number"
                                        name="bloodSugarPostprandial"
                                        placeholder='Enter your postprandial blood sugar level'
                                        value={userMedicalInformation.bloodSugarPostprandial || ''} // Ensure value is a string
                                        onChange={handleMedicalChange}
                                    />
                                </div>
                            </div>

                            <div className="Cholesterol-level">
                                <div className="Cholesterol-level-ldl">
                                    <h3>Cholesterol level (LDL)</h3>
                                    <input
                                        type="number"
                                        name="cholesterolLDL"
                                        placeholder='Enter your LDL Cholesterol'
                                        value={userMedicalInformation.cholesterolLDL || ''} // Ensure value is a string
                                        onChange={handleMedicalChange}
                                    />
                                </div>
                                <div className="Cholesterol-level-hdl">
                                    <h3>Cholesterol level (HDL)</h3>
                                    <input
                                        type="number"
                                        name="cholesterolHDL"
                                        placeholder='Enter your HDL Cholesterol'
                                        value={userMedicalInformation.cholesterolHDL || ''} // Ensure value is a string
                                        onChange={handleMedicalChange}
                                    />
                                </div>
                            </div>
                            <div className="BMI">
                                <h3>BMI</h3>
                                <input
                                    type="number"
                                    name="bmi"
                                    placeholder='Enter your current BMI'
                                    value={userMedicalInformation.bmi || ''} // Ensure value is a string
                                    onChange={handleMedicalChange}
                                />
                            </div>

                            <div className="Disabilities">
                                <h3>Disabilities (if applicable)</h3>
                                <input
                                    type="text"
                                    name="disabilities"
                                    placeholder='Enter your Disabilities'
                                    value={userMedicalInformation.disabilities || ''} // Ensure value is a string
                                    onChange={handleMedicalChange}
                                />
                            </div>

                            <div className="Save">
                                <button className='save button' onClick={handleSaveMedicalInfo}>Save</button>
                            </div>
                        </div>
                </div>
            </div>
            <div className={`Lab-section ${isMoved ? 'expanded' : ''} ${activeSection === 'lab' ? 'flex' : 'none'}`}>
                <h1 className='title'>Lab Records</h1>
                <div className="Lab-container">
                {labRecords.map((record, index) => (
                    <div key={index} className="Add-new-entry">
                        <div className="Test-type">
                            <h3>Test Type</h3>
                            <input 
                                type="text" 
                                placeholder='Enter type of test' 
                                name="testType"
                                value={record.testType}                                 
                                onChange={(e) => handleChange(e, index)} // Call the single handleChange function
                            />
                        </div>
                        <div className="Test-description">
                            <h3>Test Description</h3>
                            <input 
                                type="text" 
                                placeholder='Enter Description' 
                                name="description"
                                value={record.description}                                 
                                onChange={(e) => handleChange(e, index)} // Call the single handleChange function
                            />
                        </div>
                        <div className="Test-results">
                            <h3>Test Results</h3>
                            <input 
                                type="file" 
                                onChange={(e) => handleFileChange(index, e)} // Keep this for file handling
                            />
                        </div>
                        <div className="Test-date">
                            <h3>Test Date</h3>
                            <input 
                                type="date" 
                                value={record.date}                                    
                                onChange={(e) => handleChange(e, index)} // Call the single handleChange function
                            />
                        </div>
                        <div className="Doctor-provider-name">
                            <h3>Doctor/ Provider</h3>
                            <input 
                                type="text" 
                                placeholder='Enter doctor/ Provider name' 
                                name="doctor"
                                value={record.doctor}
                                onChange={(e) => handleChange(e, index)} // Call the single handleChange function
                            />
                        </div>
                        <div className="Save-Delete">
                            <button className="Save button" onClick={() => handleSaveRecord(index)}>Save</button>
                            <button className='Delete button' onClick={() => handleDeleteRecord(index)}>Delete</button>
                        </div>
                    </div>
                ))}
                </div>
                <button className='New-record button' onClick={handleNewRecord}>New Record</button>
            </div>
            <div className={`Vaccination-section ${isMoved ? 'expanded' : ''} ${activeSection === 'vaccination' ? 'flex' : 'none'}`}>
                <h1 className='title'>Vaccination Records</h1>
                <div className="Vaccination-container">
                    {labRecords.map((record, index) => (
                        <div key={index} className="Add-new-entry">
                            <div className="Vaccine-name">
                                <h3>Vaccine Name</h3>
                                <input 
                                    type="text" 
                                    placeholder='Enter name of Vaccine' 
                                    value={record.VaccineName} 
                                />
                            </div>
                            <div className="Vaccine-manufacturer">
                                <h3>Vaccine Manufacturer</h3>
                                <input 
                                    type="text" 
                                    placeholder='Enter name of Vaccine manufacturer' 
                                    value={record.description}
                                />
                            </div>
                            <div className="Dose-Number">
                                <h3>Dose Number</h3>
                                <input 
                                    type="number" 
                                    
                                    placeholder='Enter no of dosage'
                                />
                            </div>
                            <div className="Vaccine-date">
                                <h3>Vaccination Date</h3>
                                <input 
                                    type="date" 
                                    placeholder='Enter date of the vaccination' 
                                    value={record.date} 
                                    
                                />
                            </div>
                            <div className="Next-dose-date">
                                <h3>Next dose Date</h3>
                                <input 
                                    type="date" 
                                    placeholder='Enter next dose date' 
                                    value={record.doctor}
                                    
                                />
                            </div>
                            <div className="Administering-Facility">
                                <h3>Administering Facility</h3>
                                <input 
                                    type="text" 
                                    placeholder='Enter name of Administering facility' 
                                    value={record.doctor}
                                    
                                />
                            </div>
                            <div className="Administering-provider">
                                <h3>Administering Provider</h3>
                                <input 
                                    type="text" 
                                    placeholder='Enter name of Administering Provider' 
                                    value={record.doctor}
                                    
                                />
                            </div>
                            <div className="Expiration-Date">
                                <h3>Expiration Date</h3>
                                <input 
                                    type="date" 
                                    placeholder='Enter Expiration date for vaccine' 
                                    value={record.doctor}
                                    
                                />
                            </div>
                            <div className="Side-effects">
                                <h3>Side Effects</h3>
                                <input 
                                    type="text" 
                                    placeholder='Enter Side effects' 
                                    value={record.doctor}
                                    
                                />
                            </div>
                            <div className="vaccine-notes">
                                <h3>Notes</h3>
                                <input 
                                    type="text" 
                                    placeholder='Enter notes' 
                                    value={record.doctor}
                                    
                                />
                            </div>
                            <div className="Save-Delete">
                                <button className="Save button" onClick={() => handleSaveRecord(index)}>Save</button>
                                <button className='Delete button' onClick={() => handleDeleteRecord(index)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
                <button className='New-record button' onClick={handleNewRecord}>New Record</button>
            </div>
            <div className={`Contacts-section ${isMoved ? 'expanded' : ''} ${activeSection === 'Contacts' ? 'flex' : 'none'}`}>
                <h1 className='title'>Emergency Contacts</h1>
                <div className="Primary-contact">
                    <h2 style={{fontSize: 25, marginBottom: 10, color: '#007bff'}}>PRIMARY CONTACT</h2>
                    <div className="Contact-name">
                        <h3>Contact Name</h3>
                        <input type="text" placeholder='Enter contact name'/>
                    </div>
                    <div className="Contact-relation">
                        <h3>Contact relation</h3>
                        <input type="text" placeholder='Enter contact relation '/>
                    </div>
                    <div className="Phone-number">
                        <h3>Phone number</h3>
                        <input type="number" placeholder='Enter valid Phone number'/>
                    </div>
                    <div className="Alternative-phone-number">
                        <h3>Alternative Phone number</h3>
                        <input type="number" placeholder='Enter valid Phone number'/>
                    </div>
                    <div className="Contact-email">
                        <h3>Contact Email address</h3>
                        <input type="email" placeholder='Enter valid email address'/>
                    </div>
                </div>
                <div className="Secondary-contact">
                    <h2 style={{fontSize: 25, marginBottom: 10, color: '#007bff'}}>SECONDARY CONTACT</h2>
                    <div className="Secondary-contact-name">
                        <h3>Contact Name</h3>
                        <input type="text" placeholder='Enter contact name'/>
                    </div>
                    <div className="Secondary-contact-relation">
                        <h3>Contact relation</h3>
                        <input type="text" placeholder='Enter contact relation '/>
                    </div>
                    <div className="Secondary-phone-number">
                        <h3>Phone number</h3>
                        <input type="number" placeholder='Enter valid Phone number'/>
                    </div>
                    <div className="Secondary-alternative-phone-number">
                        <h3>Alternative Phone number</h3>
                        <input type="number" placeholder='Enter valid Phone number'/>
                    </div>
                    <div className="Secondary-contact-email">
                        <h3>Contact Email address</h3>
                        <input type="email" placeholder='Enter valid email address'/>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default Profile;
