from rest_framework import serializers

from .models import User, Faculty, Student

#serializing user model

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=['id', 'username', 'first_name', 'last_name','email', 'is_faculty', 'is_student']

#serilaizing faculty model

class FacultySerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    class Meta:
        model=Faculty
        fields=['id','user_id' 'username', 'subject']

#serializing Student model

class StudentSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    faculty_name = serializers.CharField(source='faculty.user.username', read_only=True)  # Add faculty name

    class Meta:
        model = Student
        fields = [
            'id',
            'user_id',
            'username',
            'first_name',
            'last_name',
            'gender',
            'date_of_birth',
            'contact_number',
            'address',
            'faculty',
            'faculty_name',
            'subject',
        ]
#serializing the create/update of students

class CreateUpdateStudentSerializer(serializers.ModelSerializer):
    # Fields related to the User model
    username = serializers.CharField(max_length=150, write_only=True)
    password = serializers.CharField(write_only=True)
    first_name = serializers.CharField(max_length=30, write_only=True)
    last_name = serializers.CharField(max_length=30, write_only=True)

    # Additional fields specific to Student model
    faculty = serializers.PrimaryKeyRelatedField(queryset=Faculty.objects.all())
    subject = serializers.CharField(max_length=50)

    class Meta:
        model = Student
        fields = [
            'id',
            'user',
            'username',
            'password',
            'first_name',
            'last_name',
            'gender',
            'date_of_birth',
            'contact_number',
            'address',
            'faculty',
            'subject',
        ]
        read_only_fields = ['id', 'user']

    def create(self, validated_data):
        # Extract user-related data
        user_data = {
            'username': validated_data.pop('username'),
            'password': validated_data.pop('password'),
            'first_name': validated_data.pop('first_name'),
            'last_name': validated_data.pop('last_name'),
        }

        # Check for duplicate username
        if User.objects.filter(username=user_data['username']).exists():
            raise serializers.ValidationError({'username': 'A user with this username already exists.'})

        # Create User instance
        user = User.objects.create(
            username=user_data['username'],
            first_name=user_data['first_name'],
            last_name=user_data['last_name'],
        )
        user.set_password(user_data['password'])  # Hash the password
        user.save()

        # Create Student instance
        student = Student.objects.create(user=user, **validated_data)
        return student

    def update(self, instance, validated_data):
        # Update the related User model fields
        if 'username' in validated_data:
            raise serializers.ValidationError({'username': 'Cannot update username.'})

        user = instance.user
        user.first_name = validated_data.get('first_name', user.first_name)
        user.last_name = validated_data.get('last_name', user.last_name)
        if 'password' in validated_data:
            user.set_password(validated_data['password'])  # Hash the new password
        user.save()

        # Update the Student model fields
        instance.gender = validated_data.get('gender', instance.gender)
        instance.date_of_birth = validated_data.get('date_of_birth', instance.date_of_birth)
        instance.contact_number = validated_data.get('contact_number', instance.contact_number)
        instance.address = validated_data.get('address', instance.address)
        instance.faculty = validated_data.get('faculty', instance.faculty)
        instance.subject = validated_data.get('subject', instance.subject)
        instance.save()

        return instance

# Create Faculty serializer (handles user and faculty creation)
class CreateFacultySerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'first_name', 'last_name', 'email']

    def create(self, validated_data):
        # Create User instance for faculty
        user = User.objects.create(**validated_data)
        user.set_password(validated_data['password'])  # Hash the password
        user.is_faculty = True  # Set as faculty
        user.is_student = False  # Ensure this is not a student
        user.save()

        # Create Faculty instance with default subject or provided subject
        faculty = Faculty.objects.create(user=user, subject="Default Subject")
        return faculty