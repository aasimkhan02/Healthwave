# 🌊 HealthWave

**HealthWave** is a healthcare-focused web platform developed as a group project. It offers a suite of features including detailed medication information, disease prediction tools, and educational content. The machine learning models are hosted separately using Streamlit for a smooth and interactive experience.

---

## 🚀 Features

### 🧠 Disease Prediction Tools (Hosted via Streamlit)
- **Heart Disease**
- **Diabetes**
- **Parkinson's Disease**

Each model is trained using real-world medical datasets and implemented using proven research-backed methods.

Link to models :- https://multiplediseaseprediction-uc89fhqvet96epogcvotqv.streamlit.app/

### 💊 Medication Lookup
- Search medications
- View usage, dosage, and side effects
- Organized by categories and conditions

### 📚 Educational Content
- Learn about diseases, treatment options, and prevention
- Visuals and simple explanations for better understanding

---

## 🧑‍💻 Tech Stack

- **Frontend**: React (Vite)
- **Backend**: Django (Python)
- **ML Models**: Hosted on [Streamlit](https://streamlit.io/)
- **Database**: MySQL

---

## ⚙️ Getting Started

### 1️⃣ Clone the Repository

git clone https://github.com/aasimkhan02/HealthWave.git
cd HealthWave
2️⃣ Set Up Backend (Django)
cd healthcare_app
python -m venv venv
source venv/bin/activate     # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Set up database and run server
python manage.py migrate
python manage.py runserver
3️⃣ Set Up Frontend (React)
cd ../healthcare_react
npm install
npm run dev

🤝 Team Members
Developed as a collaborative project by:
Aasim Khan
kaif khan 
