from django.contrib.auth.models import AbstractUser, Group,Permission
from django.db import models

# Create your models here.

#creating abstract user for faculty aqnd student 

class User(AbstractUser):
    is_faculty=models.BooleanField(default=False)
    is_student=models.BooleanField(default=False)
    groups = models.ManyToManyField(
        Group,
        related_name="custom_user_set",  # Custom related_name to avoid conflict
        blank=True,
        help_text="The groups this user belongs to.",
        verbose_name="groups",
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name="custom_user_permissions_set",  # Custom related_name to avoid conflict
        blank=True,
        help_text="Specific permissions for this user.",
        verbose_name="user permissions",
    )

#creating the faculty model

class Faculty(models.Model):
    user=models.OneToOneField(User, on_delete=models.CASCADE, related_name='faculty_profile')
    subject=models.CharField(max_length=100)

    def __str__(self):
        return f'{self.user.username}-{self.subject}'
    
#creating the students model
    
class Student (models.Model):
    user=models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    gender=models.CharField(max_length=10)
    date_of_birth=models.DateField()
    blood_group=models.CharField(max_length=10)
    contact_number=models.CharField(max_length=10)
    address=models.TextField()
    faculty=models.ForeignKey(Faculty, on_delete=models.SET_NULL, null=True, related_name='student')
    subject=models.CharField(max_length=20, null=True, blank=True)

    def __str__(self):
        return f'{self.user.username}'
    

