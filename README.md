Here's the updated **README.md** with the setup instructions added:

---

# Soundify 🎵

**Your Personal AI-Powered Music Recommendation System!**

Soundify is a full-stack web application that provides personalized music recommendations using your listening history, current mood, genre preferences, and natural language prompts. It uses real-time Spotify data and the reasoning power of GPT-4 to suggest music that adapts to your context—and lets you play full tracks right in the app.

---

## 🚀 Features

### Frontend:

* Built with **React.js**
* Real-time recommendations powered by **GPT-4**
* **Natural language search** for moods, genres, and contexts (e.g. *“I want something peaceful for the evening”*)
* **Filters** for genre and mood
* Embedded **Spotify Web Player** for full track playback
* Seamless integration with Spotify API for metadata and playback

### Backend:

* Built using **Django** + **Django REST Framework**
* Uses **OpenAI’s GPT-4 API** to generate recommendations
* Handles listening history, user filters, and search prompts
* Formats and sends prompts to the LLM, then parses and returns recommendations

---

## 🧰 Tech Stack

### Frontend:

* React.js
* Redux Toolkit (state management)
* Ant Design (UI components)
* Spotify API
* Spotify Web Playback SDK

### Backend:

* Django
* Django REST Framework
* Python 3.9+
* OpenAI GPT-4 API

---

## 🔐 Login with Spotify

* Authenticates users via Spotify OAuth
* Fetches real user listening history (last 50 tracks)
* Enables playback with the Spotify Web Player

---

## 🎯 Personalized Recommendations

* Uses **listening history** and **time of day** to generate song suggestions
* Allows **genre** and **mood** filtering
* Understands **free-form natural language** prompts

---

## 🔎 Song Search

* Enter prompts like *“Relaxing music for studying”* or *“Energetic pop for a workout”*
* Get creative recommendations beyond your usual listening habits

---

## 🎵 Spotify Web Player

* Play songs directly in the browser
* View album art and control playback without leaving the app

---

## 📡 API Endpoints

### `POST /recommendations`

Get 20 songs based on listening history and time of day.

**Request:**

```json
{
  "time_of_day": "Morning",
  "listening_history": [
    {"track_name": "Blinding Lights", "artist_name": "The Weeknd"},
    {"track_name": "Shape of You", "artist_name": "Ed Sheeran"}
  ]
}
```

**Response:**

```json
{
  "recommendations": [
    {"track_name": "Save Your Tears", "artist_name": "The Weeknd", "genre": "Pop"},
    {"track_name": "Perfect", "artist_name": "Ed Sheeran", "genre": "Pop"}
  ]
}
```

---

### `POST /filtered-recommendations`

Get recommendations filtered by genre and mood.

**Request:**

```json
{
  "time_of_day": "Afternoon",
  "listening_history": [...],
  "genre": "Pop",
  "mood": "Energetic"
}
```

**Response:**

```json
{
  "recommendations": [...]
}
```

---

### `POST /search-recommendations`

Search for music using natural language.

**Request:**

```json
{
  "query": "Relaxing songs for studying"
}
```

**Response:**

```json
{
  "recommendations": [...]
}
```

---

## 📈 Future Improvements

* Add like/save/skip feedback to enable learning over time
* Enable user-created playlists and sharing
* Expand to platforms beyond Spotify
* Visualize listening trends and recommendation patterns

---

## Setup Instructions

### Frontend Setup (React.js)

To set up the **frontend** and run the React.js application, follow these steps:

1. **Install Dependencies:**
   Navigate to the **music-recommendation-frontend** directory and run the following command to install the necessary node modules:

   ```bash
   npm install
   ```

2. **Start the Application:**
   Once the dependencies are installed, run the following command to start the React application:

   ```bash
   npm start
   ```

   This will start the React development server, and you can view the app in your browser at `http://localhost:3000`.

---

### Backend Setup (Django)

To set up the **music-recommendation-backend** and run the Django server, follow these steps:

1. **Navigate to the Backend Directory:**
   Go to the **music_backend** directory where the `manage.py` file is located.

2. **Configure Python Interpreter:**
   Ensure that your Python interpreter is configured to the correct version (Python 3.9+). If you're using an IDE like PyCharm, you can set the interpreter there.

3. **Create a Virtual Environment:**
   It's a good practice to use a virtual environment. Create one by running:

   ```bash
   python -m venv venv
   ```

   Then activate it:

   * On **Windows**:

     ```bash
     venv\Scripts\activate
     ```

   * On **MacOS/Linux**:

     ```bash
     source venv/bin/activate
     ```

4. **Install Dependencies:**
   Install the required libraries from `requirements.txt`:

   ```bash
   pip install -r requirements.txt
   ```

5. **Run the Backend:**
   To start the Django development server, run the following command:

   ```bash
   python manage.py runserver
   ```

   The backend server will now be running at `http://localhost:8000`.

---

Now, the frontend and backend should be running, and you can interact with the AI-powered music recommendation system using your Spotify data!