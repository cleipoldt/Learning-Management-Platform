#Carl Leipoldt: 30232595
#Aaron Kim: 30212741

from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import random
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = Flask(__name__)
CORS(app)


try:
    with open("students.json", "r") as f:
        students = json.load(f)
except FileNotFoundError:
    students = []

#change back to just courses.json
with open(os.path.join(BASE_DIR, "courses.json"), "r") as f:
    courses = json.load(f)

#change back to just testimonials.json
with open(os.path.join(BASE_DIR, "testimonials.json"), "r") as f:
    testimonials = json.load(f)

@app.route("/")
def home():
    return "LMS Flask Backend is running!"

@app.route("/courses")
def get_courses():
    return jsonify(courses)

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    for student in students:
        if student["username"] == username and student["password"] == password:
            return jsonify({
                "message": "Login successful",
                "student_id": student["id"]
            }), 200

    return jsonify({"message": "Invalid username or password"}), 401


@app.route("/testimonials")
def get_testimonials():
    return jsonify(random.sample(testimonials, 2))

@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    email = data.get("email")

    for student in students:
        if student["username"] == username:
            return jsonify({"message": "Username already taken"}), 400

    new_student = {
        "id": len(students) + 1,
        "username": username,
        "password": password,
        "email": email,
        "enrolled_courses": []
    }

    students.append(new_student)

    with open("students.json", "w") as f:
        json.dump(students, f, indent=2)

    return jsonify({
        "message": "Registration is a success",
        "student_id": new_student["id"]
    }), 201

@app.route("/enroll/<int:student_id>", methods=["POST"])
def enroll_course(student_id):
    data = request.get_json()
    course_id = data.get("id")

    for student in students:
        if student["id"] == student_id:
            if any(c["id"] == course_id for c in student["enrolled_courses"]):
                return jsonify({"message": "Already enrolled in this course"}), 400
            
            student["enrolled_courses"].append(data)

            with open("students.json", "w") as f:
                json.dump(students, f, indent=2)

            return jsonify({"message": "Course enroll success"}), 200

    return jsonify({"message": "student not found"}), 404

@app.route("/drop/<int:student_id>", methods=["DELETE"])
def drop_course(student_id):
    data = request.get_json()
    course_id = data.get("id")

    for student in students:
        if student["id"] == student_id:
            original_len = len(student["enrolled_courses"])
            student["enrolled_courses"] = [
                c for c in student["enrolled_courses"] if c["id"] != course_id
            ]

            if len(student["enrolled_courses"]) == original_len:
                return jsonify({"message": "Course not found"}), 404

            with open("students.json", "w") as f:
                json.dump(students, f, indent=2)

            return jsonify({"message": "Course dropped successfully"}), 200

    return jsonify({"message": "Student not found"}), 404

@app.route("/student_courses/<int:student_id>", methods=["GET"])
def get_student_courses(student_id):
    for student in students:
        if student["id"] == student_id:
            return jsonify(student["enrolled_courses"]), 200
    
    return jsonify([]), 404

if __name__ == "__main__":
    app.run(debug=True)
