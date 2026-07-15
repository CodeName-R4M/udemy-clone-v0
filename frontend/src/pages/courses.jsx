import { useState, useEffect } from 'react';
import CourseCard from '../components/course-card';
import { apiClient } from '../client';

const Courses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    apiClient.getCourses().then(setCourses);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 text-primary-red">All Courses</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default Courses;
