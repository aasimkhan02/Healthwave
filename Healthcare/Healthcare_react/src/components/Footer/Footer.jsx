import React from 'react'
import './Footer.css'

const Footer = () => {
    return (
        <div className='Footer'>
            <p>At HealthWave, we prioritize your privacy and 
                are committed to safeguarding your personal information. 
                We collect and use personal data solely to provide, enhance, 
                and personalize our healthcare services. This includes 
                information you provide directly, such as when you register 
                for an account, use our services, or contact us. We use 
                advanced security measures to protect your data against 
                unauthorized access, alteration, or disclosure. Our team 
                adheres to strict confidentiality agreements and industry 
                standards to ensure your information remains secure.
                <br/><br/>
                We do not share your personal information with third parties 
                unless required by law or necessary to provide you with our 
                services. This may include sharing data with healthcare providers
                or legal authorities in compliance with applicable regulations. We 
                continually review and update our privacy practices to align with 
                legal requirements and technological advancements. For detailed 
                information on how we handle your data and your rights, please 
                review our Privacy Policy. If you have any questions or concerns, 
                please contact our support team.
            </p>
            <hr />
            <ul>
                <li>
                    <h3>Prediction</h3>
                    <p>Heart disease detection</p>
                    <p>Pneumonia detection</p>
                    <p>Parkinson detection</p>
                    <p>Diabetes detection</p>
                </li>
                <li>
                    <h3>Medication</h3>
                    <p>Symptom checker</p>
                    <p>Medication recommendation</p>
                    <p>Medication management</p>
                </li>
                <li>
                    <h3>Education</h3>
                    <p>Quiz</p>
                </li>
            </ul>
        </div>
    )
}

export default Footer
