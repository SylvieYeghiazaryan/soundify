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

