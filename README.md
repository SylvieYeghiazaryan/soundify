## **Soundify** 🎵  
Your Personal AI-Powered Music Recommendation System!  
Soundify is a full-stack web application that recommends personalized music tracks based on user listening history, moods, and genres. It also allows users to dynamically search for songs and play tracks right from the app using Spotify's Web Playback SDK.

---

### **Features**
- **Frontend**:
  - Built using **React.js**.
  - Dynamic song recommendations powered by **LLM (GPT-4)**.
  - Search functionality for specific moods, genres, and personalized contexts.
  - Spotify Web Player integration, allowing users to play tracks directly in the app.
  - Filters for genres and moods to fine-tune recommendations.
    - Integrates with Spotify's API for fetching metadata and connecting to playback services.

- **Backend**:
  - Built using **Django**.
  - Uses OpenAI’s GPT-4 API for generating song recommendations.
  - Handles personalized recommendations, filtered recommendations, and search-based recommendations.

---

### **Tech Stack**
#### Frontend:
- React.js
- Redux Toolkit (for state management)
- Ant Design (for UI components)
- Spotify Web Playback SDK (for player integration)

#### Backend:
- Django (as the backend framework)
- Django REST Framework (for API layering)
- OpenAI GPT-4 (for LLM recommendations)
- Python 3.9+ (as backend programming language)

---

### **Usage**

#### **Features**
1. **Login with Spotify**:
   - Allows the app to fetch your listening history and use it for personalized song recommendations.

2. **Personalized Recommendations**:
   - Fetches recommendations based on your listening history and time of day.
   - Customizable by genre and mood.

3. **Search Songs**:
   - Allows you to search *exactly* the type of music you're looking for. For example: `"Calm songs for studying"`.

4. **Spotify Web Player**:
   - Play tracks directly from the app using Spotify Web Playback SDK.

---

### **API Endpoints**

#### Recommendations Endpoints:
1. **`POST /recommendations`**:
   - Fetches 20 songs based on listening history and time of day.

   **Request Payload**:
   ```json
   {
       "time_of_day": "Morning",
       "listening_history": [
           {"track_name": "Blinding Lights", "artist_name": "The Weeknd"},
           {"track_name": "Shape of You", "artist_name": "Ed Sheeran"}
       ]
   }
   ```

   **Response**:
   ```json
   {
       "recommendations": [
           {"track_name": "Save Your Tears", "artist_name": "The Weeknd", "genre": "Pop"},
           {"track_name": "Perfect", "artist_name": "Ed Sheeran", "genre": "Pop"}
       ]
   }
   ```

2. **`POST /filtered-recommendations`**:
   - Fetches recommendations filtered by genre and mood.

   **Request Payload**:
   ```json
   {
       "time_of_day": "Afternoon",
       "listening_history": [...],
       "genre": "Pop",
       "mood": "Energetic"
   }
   ```

   **Response**:
   ```json
   {
       "recommendations": [...]
   }
   ```

3. **`POST /search-recommendations`**:
   - Returns songs based on a search query.

   **Request Payload**:
   ```json
   {
       "query": "Relaxing songs for studying"
   }
   ```

   **Response**:
   ```json
   {
       "recommendations": [...]
   }
   ```

---

### **Future Improvements**

1. Add liking, saving, playlist creating functionalities.
2. Add playlists sharing functionality.
3. Include advanced visualization for listening patterns.
