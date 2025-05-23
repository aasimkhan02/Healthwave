import React, { useState, useEffect } from 'react';
import './Medication.css';

const Medication = () => {
    const [selectedSection, setSelectedSection] = useState('Medication todo');
    const [expandTodo, setExpandTodo] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [medicationName, setMedicationName] = useState('');
    const [dosage, setDosage] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [frequency, setFrequency] = useState('');
    const [time, setTime] = useState('');
    const [notes, setNotes] = useState('');
    const [medicationTasks, setMedicationTasks] = useState([]);
    const [editingTask, setEditingTask] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [medicationDetails, setMedicationDetails] = useState(null); // Added state for medication details
    
    const getToken = () => localStorage.getItem('token');
    const getUsername = () => localStorage.getItem('username');

    const resetForm = () => {
        setMedicationName('');
        setDosage('');
        setStartDate('');
        setEndDate('');
        setFrequency('');
        setTime('');
        setNotes('');
        setEditingTask(null);
    };

    const handleSectionClick = (section) => {
        setSelectedSection(section);
    };

    const handleExpand = () => {
        setExpandTodo(true);
    };

    const loadMedicationTasks = () => {
        const tasks = localStorage.getItem('medicationTasks');
        return tasks ? JSON.parse(tasks) : [];
    };

    // Save medication tasks to localStorage
    const saveMedicationTasks = (tasks) => {
        localStorage.setItem('medicationTasks', JSON.stringify(tasks));
    };

    // Use useEffect to load tasks when the component mounts
    useEffect(() => {
        const tasks = loadMedicationTasks();
        setMedicationTasks(tasks);
        // Request notification permission when the component mounts
        if (Notification.permission !== "granted") {
            Notification.requestPermission();
        }
    }, []);

    const scheduleNotification = (task) => {
        const { time, medication } = task;
        const notificationTime = new Date();
        const [hours, minutes] = time.split(':');
        notificationTime.setHours(hours, minutes, 0, 0); // Set to selected time

        const delay = notificationTime.getTime() - Date.now();
        if (delay > 0) {
            const notificationId = setTimeout(() => {
                new Notification(`Time to take your medication: ${medication}`);
            }, delay);
            return notificationId; // Return the ID to clear if necessary
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setExpandTodo(false);

        const newTask = {
            id: new Date().getTime(), // Unique ID based on timestamp
            medication: medicationName,
            dosage,
            start_date: startDate,
            end_date: endDate,
            frequency,
            time,
            notes,
        };

        const updatedTasks = editingTask
            ? medicationTasks.map(task => (task.id === editingTask.id ? newTask : task))
            : [...medicationTasks, newTask];

        setMedicationTasks(updatedTasks);
        saveMedicationTasks(updatedTasks); // Save to localStorage

        const notificationId = scheduleNotification(newTask); // Schedule notification for the new task
        // You might want to store the notificationId in the task object if you want to clear it later

        resetForm();
    };

    const handleSearch = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);
    
        if (query.length > 2) {
            setShowSuggestions(true);
            try {
                const response = await fetch(`http://localhost:8000/api/medications/search/?q=${query}`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
    
                const data = await response.json();
                const top10Suggestions = data.length > 10 ? data.slice(0, 10) : data;
    
                if (top10Suggestions.length === 0) {
                    setSuggestions(["No results found"]);
                } else {
                    setSuggestions(top10Suggestions.map(med => med.medicine_name));
                }
            } catch (error) {
                console.error('Fetch error:', error);
            }
        } else {
            setShowSuggestions(false);
        }
    };
    
    const handleSearchSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        if (medicationName.length > 0) {
            try {
                const response = await fetch(`http://localhost:8000/api/medications/details/${medicationName}/`);
    
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
    
                const data = await response.json();
                if (data) {
                    setMedicationDetails(data); // Set medication details state with the fetched data
                } else {
                    setMedicationDetails(null); // Clear medication details if no data
                }
            } catch (error) {
                console.error('Error fetching medication details:', error);
            }
        }
    };
    
    const handleSuggestionClick = (suggestion) => {
        setMedicationName(suggestion); // Populate the form field with the selected suggestion
        setSearchQuery(suggestion); 
        setSuggestions([]); 
        setShowSuggestions(false); 
    };
    
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && suggestions.length > 0 && suggestions[0] !== "No results found") {
            setSearchQuery(suggestions[0]);
            setMedicationName(suggestions[0]); 
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    useEffect(() => {
        if (searchQuery.length === 0) {
            setShowSuggestions(false);
        }
    }, [searchQuery]);

    const handleEditTask = (task) => {
        setMedicationName(task.medication);
        setDosage(task.dosage);
        setStartDate(task.start_date);
        setEndDate(task.end_date);
        setFrequency(task.frequency);
        setTime(task.time);
        setNotes(task.notes);
        setEditingTask(task);
        setExpandTodo(true);
    };

    // Handle task deletion (if needed)
    const handleDeleteTask = (taskId) => {
        const updatedTasks = medicationTasks.filter(task => task.id !== taskId);
        setMedicationTasks(updatedTasks);
        saveMedicationTasks(updatedTasks); // Update localStorage
        // Here, clear the associated notification if needed using the stored notification ID
    };
    
    

    return (
        <div className='Medication'>
            {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Error message display */}
            <div className="Medication-search-bar">
                <div className="background"></div>
                <div className="search-bar">
                    <h1>Search Medication by Name</h1>
                    <p>Find detailed information on the medication you're looking for.</p>
                    <form className="search-form" onSubmit={handleSearchSubmit}>
                        <input 
                            type="text"
                            placeholder="Enter medicine name"
                            value={searchQuery}
                            onChange={handleSearch}
                            onKeyDown={handleKeyDown}
                        />
                        {showSuggestions && (
                            <ul className="suggestions">
                                {suggestions.length > 0 ? (
                                    suggestions.map((suggestion, index) => (
                                        <li
                                            key={index}
                                            onClick={() => handleSuggestionClick(suggestion)}
                                            className={suggestion === "No results found" ? "no-results" : ""}
                                        >
                                            {suggestion}
                                        </li>
                                    ))
                                ) : (
                                    <li className="no-results">No results found</li>
                                )}
                            </ul>
                        )}
                        <button className="submit-button" type="submit">Search</button>
                    </form>
                </div>
            </div>

            {medicationDetails && ( 
                <div className="medication-details">
                    <button className="close-btn" onClick={() => setMedicationDetails(null)}>Close</button>
                    <h2>Medication Details</h2>
                    <p><strong>Name:</strong> {medicationDetails.medicine_name || "Not available"}</p>
                    <p><strong>Price(India):</strong> {medicationDetails.product_price || "Not available"}</p>
                    <p><strong>Manufacturer Name:</strong> {medicationDetails.manufacturer_name || "Not available"}</p>
                    <p><strong>Side Effects:</strong> {medicationDetails.side_effects || "Not available"}</p>
                    <p><strong>Interactions:</strong> {medicationDetails.drug_interactions || "Not available"}</p>
                    <p><strong>Is it discontinued?:</strong> {medicationDetails.is_discontinued || "Not available"}</p>
                    <p><strong>Type:</strong> {medicationDetails.type || "Not available"}</p>
                    <p><strong>Pack Size:</strong> {medicationDetails.pack_size_label || "Not available"}</p>
                    <p><strong>Main composition: </strong> {medicationDetails.short_composition1 || "Not available"}</p>
                    <p><strong>Other composition: </strong> {medicationDetails.short_composition2 || "Not available"}</p>
                    <p><strong>Description: </strong> {medicationDetails.medicine_desc|| "Not available"}</p>
                </div>
            )}


            <div className="Medication-services">
                <li 
                    className={`Medication-todo ${selectedSection === 'Medication todo' ? 'active' : ''}`}
                    onClick={() => handleSectionClick('Medication todo')}
                >
                    Medication todo
                </li>
                <div className="vertical-line"></div>
                <li 
                    className={`Medication-history ${selectedSection === 'Medication History' ? 'active' : ''}`}
                    onClick={() => handleSectionClick('Medication History')}
                >
                    Medication History
                </li>
            </div>
            <div className="Medication-todo-container">
                <button 
                    className='to-do-entry' 
                    onClick={handleExpand}
                >
                    Enter medication
                </button>
                <div className={`todo ${expandTodo ? 'expanded' : ''}`}>
                {!expandTodo ? (
                    <div className="active-todo">
                        <table className="todo-table">
                        <thead>
                            <tr>
                                <th className='Name'>Name</th>
                                <th className='Dosage'>Dosage</th>
                                <th className='Start-time'>Start Time</th>
                                <th className='End-time'>End Time</th>
                                <th className='Frequency'>Frequency</th>
                                <th className='Time'>Time</th>
                                <th className='Notes'>Notes</th>
                                <th className='Actions'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {medicationTasks.map((task) => (
                                <tr key={task.id}>
                                    <td>{task.medication}</td>
                                    <td>{task.dosage}</td>
                                    <td>{task.start_date}</td>
                                    <td>{task.end_date}</td>
                                    <td>{task.frequency}</td>
                                    <td>{task.time}</td>
                                    <td>{task.notes}</td>
                                    <td>
                                        <button onClick={() => handleEditTask(task)}>Edit</button>
                                        <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                                                </div>
                                                ) : (
                                                    <form 
                    className={`medication-form ${expandTodo ? 'visible' : ''}`}
                    onSubmit={handleSubmit}
                >
                    <li>
                        <p>Medication Name</p>
                        <input
                            type="text"
                            placeholder="Enter medication name"
                            value={medicationName}
                            onChange={(e) => setMedicationName(e.target.value)}
                            onClick={() => setShowFormSuggestions(true)}
                            required
                        />
                    </li>
                    <li>
                        <p>Dosage</p>
                        <input 
                            type="text" 
                            placeholder="Enter dosage"
                            value={dosage}
                            onChange={(e) => setDosage(e.target.value)}
                            required
                        />
                    </li>
                    <li className='timeclass'>
                        <li>
                            <p>Start Time</p>
                            <input 
                                type="date" 
                                placeholder="Select start date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                required
                            />
                        </li>
                        <li>
                            <p>End Time</p>
                            <input 
                                type="date" 
                                placeholder="Select end date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                required
                            />
                        </li>
                    </li>
                    <li>
                        <p>Frequency</p>
                        <input 
                            type="number" 
                            placeholder="Enter frequency (times per day)"
                            value={frequency}
                            onChange={(e) => setFrequency(e.target.value)}
                            required
                        />
                    </li>
                    <li>
                        <p>Time</p>
                        <input 
                            type="time" 
                            placeholder="Select time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            required
                        />
                    </li>
                    <li>
                        <p>Notes</p>
                        <input 
                            type="text" 
                            placeholder="Additional notes (optional)"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </li>
                    <li className='btn'>
                        <button type="submit">Submit</button>
                    </li>
                </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Medication;
