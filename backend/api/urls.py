from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GoalViewSet, TodoViewSet, JournalEntryViewSet, RegisterView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = DefaultRouter()
router.register(r'goals', GoalViewSet, basename='goal')
router.register(r'todos', TodoViewSet, basename='todo')
router.register(r'journal', JournalEntryViewSet, basename='journal')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
