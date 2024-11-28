from django.urls import path
from .views import (AddtoSelfView, CreatestudentView, FacultyUpdateStudentView, FacultyLoginView, TokenRefreshView, ViewAllStudents, StudentProfileView, UpdateStudentview, StudentLoginView
)

urlpatterns = [
    path('add-to-self/<int:student_id>/', AddtoSelfView.as_view(), name='add-to-self'),
    path('update-student/<int:student_id>/', FacultyUpdateStudentView.as_view(), name='update-student' ),
    path('update-student-self/<int:student_id>/', UpdateStudentview.as_view(), name='update-student-self'),
    path('create-student/', CreatestudentView.as_view(), name='create-student'),
    path('view-all-students/', ViewAllStudents.as_view(), name='view-all-students'),
    path('faculty-login/', FacultyLoginView.as_view(), name='faculty-login'),
    path('student-login/', StudentLoginView.as_view(), name='student-login'),
    path('token-refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('student-profile/', StudentProfileView.as_view(), name='student-profile'),
]
