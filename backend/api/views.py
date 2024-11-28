from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .models import User, Faculty, Student
from .serializers import UserSerializer, StudentSerializer, CreateUpdateStudentSerializer
from .permissions import IsFaculty, IsStudent

# Create your views here.

class FacultyLoginView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        #custom logic before returning the token
        response = super().post(request, *args, **kwargs)
        print(request)
        # additional data to the response (e.g., user details)
        if response.status_code == status.HTTP_200_OK:

            user = User.objects.get(username=request.data['username'])
            print(f"Authenticated user: {user}")
            user_data = UserSerializer(user).data
            response.data['user']=user_data

        return response
    
class StudentLoginView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == status.HTTP_200_OK:
            user = User.objects.get(username=request.data['username']) # Authenticated user
            user_data = UserSerializer(user).data
            response.data['user'] = user_data
        return response


class TokenRefreshview(TokenRefreshView):
    #customize refresh token
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        return response

#view all students for faculty

class ViewAllStudents(APIView):
    permission_classes=[IsAuthenticated,IsFaculty]

    def get(self, request,):
        students=Student.objects.all()
        serializer=StudentSerializer(students, many=True)
        return Response(serializer.data)

#create students by faculty

class CreatestudentView(APIView):
    permission_classes=[IsAuthenticated, IsFaculty]

    def post(self, request):
        serializer=CreateUpdateStudentSerializer(data=request.data)

        if serializer.is_valid():
            #extract faculty and subject
            faculty=serializer.validated_data.get('faculty')
            subject=serializer.validated_data.get('subject')

            #creating student

            student=serializer.save()
            student.faculty=faculty
            student.subject=subject
            student.save()

            return Response({'message':'student created successfully'},status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class StudentProfileView(APIView):
    permission_classes=[IsAuthenticated, IsStudent]

    def get(self, request):
        student=request.user.student_profile
        serializer=StudentSerializer(student)
        return Response(serializer.data)
    
    def put(self, request):
        student=request.user.student_profile
        serialize=CreateUpdateStudentSerializer(student, data=request.data)
        if (request.is_vaild()):
            serialize.save()
            return Response(serialize.data, status=status.HTTP_200_OK)
        return Response(serialize.error, status=status.HTTP_400_BAD_REQUEST)


class AddtoSelfView(APIView):
    permission_classes=[IsAuthenticated, IsFaculty]

    def post(self, request, student_id):

        try:
            faculty=request.user.faculty_profile
            student=Student.objects.get(id=student_id)

            student.faculty=faculty
            student.subject=faculty.subject
            student.save()
            return Response({"message": "Student added successfully with subject!"}, status=status.HTTP_200_OK)
        except Student.DoesNotExist:
            return Response({"error": "Student not found!"}, status=status.HTTP_404_NOT_FOUND)

class FacultyUpdateStudentView(APIView):
    permission_classes=[IsAuthenticated, IsFaculty]

    def put(self, request,student_id):
        try:
            student=Student.objects.get(id=student_id)
            serializer=CreateUpdateStudentSerializer(student,data=request.data, partial=True)
            if (serializer.is_valid()):
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.data, status=status.HTTP_400_BAD_REQUEST)
        except Student.DoesNotExist:
            return Response({'error':'student not found'}, status=status.HTTP_404_NOT_FOUND)
        
class UpdateStudentview(APIView):
    permission_classes=[IsAuthenticated]

    def put(self, request, student_id):
        try:
            student=Student.objects.get(id=student_id)
            serializer=CreateUpdateStudentSerializer(student, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Student.DoesNotExist:
            return Response({'error':'studient profile not found'}, status=status.HTTP_404_NOT_FOUND)