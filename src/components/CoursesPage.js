import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import CourseItem from './CourseItem';
import EnrollmentList from './EnrollmentList';

const CoursesPage = () => {
  const studentId = localStorage.getItem("student_id")
  const[courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState(() => {
    
    const saved = localStorage.getItem('enrollments');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('enrollments', JSON.stringify(enrolledCourses));
  }, [enrolledCourses]);

  useEffect(() => {
    fetch('http://localhost:5000/courses')
    .then(res => res.json())
    .then(data => setCourses(data));
  }, []);

  const handleEnroll = async (course) => {
    if (!studentId) {
      alert("You must be logged in to enroll.");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:5000/enroll/${studentId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(course)
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert("Enrolled successfully!");
  
        setEnrolledCourses(prev => [...prev, { 
          ...course,
          enrollmentId: Date.now()
        }]);
      } else {
        alert(`${data.message}`);
      }
    } catch (err) {
      console.error("Enrollment error:", err);
      alert("Failed to enroll. Please try again.");
    }
  };
  

  const handleRemove = (enrollmentId) => {
    setEnrolledCourses(prev => 
      prev.filter(course => course.enrollmentId !== enrollmentId)
    );
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      <Header />
      
      <div style={{ 
        flex: 1,
        display: 'flex',
        padding: '20px',
        gap: '30px'
      }}>
        <div style={{ flex: 3 }}>
          <h2 style={{ color: '#004080' }}>Available Courses</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {courses.map(course => (
              <CourseItem 
                key={course.id} 
                course={course} 
                onEnroll={handleEnroll}
              />
            ))}
          </div>
        </div>
        
        <EnrollmentList 
          enrolledCourses={enrolledCourses}
          onRemove={handleRemove}
        />
      </div>

      <Footer />
    </div>
  );
};

export default CoursesPage;
