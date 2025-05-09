from django.urls import path
from . import views

"""
This module defines the URL routing for the Soundify music recommendation application.

It includes paths to the following views:
1. **/recommendations**: Handles generating music recommendations based on user listening history and time of day.
2. **/filtered-recommendations**: Generates music recommendations based on user preferences such as time of day, listening history, genre, and mood.
3. **/search-recommendations**: Allows users to search for music recommendations using natural language queries.

Each URL is associated with a view in the `views.py` file that processes the requests and returns appropriate recommendations.

URL Patterns:
- **/recommendations**: Linked to `llm_recommendations` view
- **/filtered-recommendations**: Linked to `filtered_recommendations` view
- **/search-recommendations**: Linked to `search_recommendations` view
"""
urlpatterns = [
    path("recommendations", views.llm_recommendations, name="llm_recommendations"),
    path("filtered-recommendations", views.filtered_recommendations, name="filtered_recommendations"),
    path("search-recommendations", views.search_recommendations, name="search_recommendations"),
]