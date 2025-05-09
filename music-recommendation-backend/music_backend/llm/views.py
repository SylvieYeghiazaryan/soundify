import os

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
client = OpenAI()

client.api_key = os.getenv('OPENAI_API_KEY')

@csrf_exempt
def llm_recommendations(request):
    """
    This view handles generating music recommendations based on a user's listening history
    and time of day. It formats the user data into a prompt for GPT-4, processes the response,
    and returns a JSON object containing the music recommendations.

    Arguments:
    request (HttpRequest): The HTTP request object containing the user's listening history
                            and time of day for recommendation.

    Returns:
    JsonResponse: A JSON response containing an array of music recommendations or an error message.
    """
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            time_of_day = data.get("time_of_day", "")
            listening_history = data.get("listening_history", [])

            prompt = f"""
            You are a music recommendation expert. You specialize in creating personalized song suggestions based on a user's preferences, listening habits, and the context of the time of day. Here is some information about the user:

            Time of day: {time_of_day}
            Listening history: 
            """
            for track in listening_history:
                prompt += f"- {track['track_name']} by {track['artist_name']}\n"

            prompt += """
            Your task:
            1. Suggest 20 songs similar to the user’s listening history.
            2. Recommendations should be JSON formatted with the following keys:
                - "track_name": Name of the track
                - "artist_name": Name of the artist
                - "genre": Genre of the song

            Be creative, ensure that the suggestions are diverse and cater to the user's likely preferences based on the provided listening history. Here is the desired JSON output:
            [
                {"track_name": "Song 1", "artist_name": "Artist 1", "genre": "Genre 1"},
                {"track_name": "Song 2", "artist_name": "Artist 2", "genre": "Genre 2"},
                ...
                {"track_name": "Song 20", "artist_name": "Artist 20", "genre": "Genre 20"}
            ]
            """

            response = client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "system", "content": prompt}]
            )

            content = response.choices[0].message.content.strip()

            start_index = content.find("[")
            end_index = content.rfind("]") + 1
            recommendations_json = content[start_index:end_index]

            recommendations = json.loads(recommendations_json)
            return JsonResponse({"recommendations": recommendations}, status=200)

        except Exception as e:
            print("Error:", str(e))
            return JsonResponse({"error": str(e)}, status=400)

@csrf_exempt
def filtered_recommendations(request):
    """
    This view handles generating music recommendations based on a user's listening history,
    time of day, genre preference, and mood. It formats the user data into a prompt for GPT-4,
    processes the response, and returns a JSON object containing the music recommendations.

    Arguments:
    request (HttpRequest): The HTTP request object containing the user's listening history,
                            genre, mood, and time of day for recommendation.

    Returns:
    JsonResponse: A JSON response containing an array of music recommendations or an error message.
    """
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            time_of_day = data.get("time_of_day", "")
            listening_history = data.get("listening_history", [])
            genre = data.get("genre", "")
            mood = data.get("mood", "")

            prompt = f"""
            You are a music recommendation expert specializing in personalized suggestions. Your task is to curate a list of songs tailored to this user. Here is the information about the user:

            Time of day: {time_of_day}
            """
            if genre:
                prompt += f"Preferred genre: {genre}\n"
            if mood:
                prompt += f"Current mood: {mood}\n"

            prompt += "Listening history:\n"
            for track in listening_history:
                prompt += f"- {track['track_name']} by {track['artist_name']}\n"

            prompt += """
            Your task:
            1. Suggest 20 songs that align with the user's preferences, listening history, and the time of day.
            2. If the user's genre and mood preferences are provided, tailor the recommendations accordingly.
            3. Ensure the recommendations cover a diversity of songs while relating to the user's listening history.

            Output format:
            Return the recommendations in JSON format structured as follows:
            [
                {"track_name": "Song 1", "artist_name": "Artist 1", "genre": "Genre 1"},
                {"track_name": "Song 2", "artist_name": "Artist 2", "genre": "Genre 2"},
                ...
                {"track_name": "Song 20", "artist_name": "Artist 20", "genre": "Genre 20"}
            ]

            Generate recommendations creatively and ensure the response complies with the JSON format.

            Recommendations JSON:
            """

            response = client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "system", "content": prompt}]
            )

            content = response.choices[0].message.content.strip()

            start_index = content.find("[")
            end_index = content.rfind("]") + 1
            recommendations_json = content[start_index:end_index]

            recommendations = json.loads(recommendations_json)

            return JsonResponse({"recommendations": recommendations}, status=200)

        except Exception as e:
            print("Error:", str(e))
            return JsonResponse({"error": str(e)}, status=400)

@csrf_exempt
def search_recommendations(request):
    """
    This view handles generating music recommendations based on a user's natural language search query.
    It formats the query into a prompt for GPT-4, processes the response, and returns a JSON object containing
    the music recommendations.

    Arguments:
    request (HttpRequest): The HTTP request object containing the user's query for music recommendations.

    Returns:
    JsonResponse: A JSON response containing an array of music recommendations or an error message.
    """
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            query = data.get("query", "")

            if not query:
                return JsonResponse({"error": "No query provided"}, status=400)

            prompt = f"""
            You are a music recommendation expert specializing in search-based results. A user has provided the following query: '{query}'.

            Your task:
            1. Understand the user's request and provide 20 relevant song recommendations.
            2. Ensure recommendations align closely with the user's query (e.g., genre, mood, theme).
            3. Be creative and diversify the recommendations as appropriate for the query.

            Output format:
            Return the recommendations as a JSON array structured with the following keys:
            [
                {"track_name": "Song Title", "artist_name": "Artist Name", "genre": "Genre (optional)"},
                ...
                {"track_name": "Song Title 20", "artist_name": "Artist Name 20", "genre": "Genre (optional)"}
            ]

            Ensure the JSON output is valid and strictly follows the specified structure.

            Recommendations JSON:
            """

            response = client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "system", "content": prompt}]
            )

            content = response.choices[0].message.content.strip()

            start_index = content.find("[")
            end_index = content.rfind("]") + 1

            recommendations = content[start_index:end_index]

            recommendations = json.loads(recommendations)

            return JsonResponse({"recommendations": recommendations}, status=200)
        except Exception as e:
            print("Error:", str(e))
            return JsonResponse({"error": str(e)}, status=500)