import React from 'react'
import Doctor from './../../assets/Doctor.png';
import bot from './../../assets/robot.png'
import healthcare from './../../assets/healthcare.png'
import Medicine from './../../assets/medicine.png'
import education from './../../assets/education.png'
import Doctor2 from './../../assets/Doctor2.png'
import team from './../../assets/Team.jpg'
import check from './../../assets/check.png'
import './Landing.css'

const Landing = () => {
    return (
        <div className='Landing'>
            <div className="Frame1">
                <div className="Headline">
                    <h1>Advanced Diagnosis for a Healthier Tomorrow</h1>
                    <h2>"Accurate, Reliable, and Comprehensive Health Assessments for Your Well-being"</h2>
                    <button className='button'>Services</button>
                </div>
                <div className="images">
                    <svg viewBox="47 25 120 140" xmlns="http://www.w3.org/2000/svg" className="Blob">
                        <path fill="#167bb9" d="M38.4,-58.7C51.4,-51.3,64.9,-43.6,73.6,-31.5C82.4,-19.5,86.5,-3.2,84.2,12.1C81.9,27.4,73.3,41.7,61.3,50C49.3,58.2,33.8,60.3,19.9,61.7C5.9,63,-6.5,63.6,-20.9,63.1C-35.4,62.6,-52,61,-61.2,52.1C-70.5,43.1,-72.5,26.9,-76.1,10.1C-79.8,-6.6,-85.1,-24,-78.8,-35.2C-72.5,-46.5,-54.5,-51.7,-39.5,-58.2C-24.4,-64.7,-12.2,-72.5,0.2,-72.8C12.7,-73.2,25.3,-66.2,38.4,-58.7Z" transform="translate(100 100)" />
                    </svg>
                    <img src={Doctor} alt="Doctor" />
                </div>
            </div>
            <div className="Services container">
                <li>
                    <img src={bot} alt="" />
                    <h1>Chatbot</h1>
                    <p>Your virtual health assistant, available 24/7.</p>
                </li>
                <li>
                    <img src={healthcare} alt="" />
                    <h1>Disease Prediction</h1>
                    <p>Predict and prevent health issues</p>
                </li>
                <li>
                    <img src={Medicine} alt="" />
                    <h1>Medicine System</h1>
                    <p>Access and manage medications easily.</p>
                </li>
                <li>
                    <img src={education} alt="" />
                    <h1>Interactive Healthcare</h1>
                    <p>Learn health topics interactively.</p>
                </li>
            </div>
            <div className="About-us container">
                <div className="images">
                    <img src={Doctor2} alt="" />
                </div>
                <div className="Headline">
                    <h1>About us</h1>
                    <p>At Healthwave, we're dedicated to empowering individuals with accurate, reliable, and accessible health information. Our innovative platform combines cutting-edge technology with expert insights to deliver personalized health assessments, helping you make informed decisions about your well-being.</p>
                </div>
            </div>
            <div className="Why-us container">
                <div className="Headline">
                    <h1>Why choose us ?</h1>
                    <ul>
                        <li>
                            <img src={check} alt="" />
                            <p>User-Friendly Interface</p>
                        </li>
                        <li>
                            <img src={check} alt="" />
                            <p>Reliable and Accurate Results</p>
                        </li>
                        <li>
                            <img src={check} alt="" />
                            <p>Comprehensive Support</p>
                        </li>
                        <li>
                            <img src={check} alt="" />
                            <p>Cutting-Edge Technology</p>
                        </li>
                    </ul>
                </div>
                <div className="images">
                    <img src={team} alt="" />
                </div>
            </div>
            <div className="Contact-us">
                <div className="Contact-section">
                    <h1>Contact Us</h1>
                    <h2>Feel free to drop anything below</h2>
                    <ul className="grid">
                        <li>
                            <p>Name</p>
                            <input type="text" placeholder="Enter your Full Name" className="input-item" />
                        </li>
                        <li>
                            <p>Gmail</p>
                            <input type="email" placeholder="Enter your Gmail" className="input-item" />
                        </li>
                        <li>
                            <p>Your Message</p>
                            <textarea placeholder="Enter your message" className="textarea-item"></textarea>
                        </li>
                    </ul>
                </div>
                <div className="background"></div>
            </div>
        </div>
    )
}

export default Landing
