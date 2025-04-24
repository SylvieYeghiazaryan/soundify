from django.urls import path
from . import views

urlpatterns = [
    path("recommendations", views.llm_recommendations, name="llm_recommendations"),
    path("filtered-recommendations", views.filtered_recommendations, name="filtered_recommendations"),
    path("search-recommendations", views.search_recommendations, name="search_recommendations"),
]