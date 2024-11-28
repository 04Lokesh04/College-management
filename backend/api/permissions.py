from rest_framework.permissions import BasePermission


class IsFaculty(BasePermission):
    def has_permission(self, request, view):
        return hasattr(request.user, 'faculty_profile')
    

class IsStudent(BasePermission):
    def has_permission(self, request, view):
        return hasattr(request.user, 'student_profile')