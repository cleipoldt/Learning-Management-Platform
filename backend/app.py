from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import random

app = Flask(__name__)
CORS(app)

students = []

with open("courses.json", "r") as f:
    courses = json.load(f)

with open("testimonials.json", "r") as f:
    testimonials = json.load(f)

@app.route("/")

def home():
    return "LMS Flask Backens is running!"


@app.route("/courses")
def get_courses():
    return jsonify(courses)

@app.route("/testimonials")
def get_testimonials():
    return jsonify(random.sample(testimonials, 2))

@app.route("/register", methods = ["POST"])
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
    return jsonify({
        "messeage": "Registration is a success",
        "student_id": new_student["id"]
    }), 200



if __name__ == "__main__":
    app.run(debug=True)