import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/button';
import { apiClient } from '../client';

const InstructorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({ title: '', description: '', price: '', image: null });
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  useEffect(() => {
    if (!user || (user.role !== 'instructor' && user.role !== 'admin')) {
      navigate('/');
      return;
    }
    fetchCourses();
  }, [user, navigate]);

  const fetchCourses = async () => {
    const data = await apiClient.getMyInstructedCourses();
    setCourses(data);
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', newCourse.title);
    formData.append('description', newCourse.description);
    formData.append('price', newCourse.price);
    if (newCourse.image) formData.append('image', newCourse.image);

    await apiClient.createCourse(formData);
    setNewCourse({ title: '', description: '', price: '', image: null });
    fetchCourses();
  };

  const handleUploadVideo = async (e) => {
    e.preventDefault();
    if (!selectedCourse || !videoFile) return;
    const formData = new FormData();
    formData.append('video', videoFile);

    await apiClient.uploadCourseVideo(selectedCourse.id, formData);
    setSelectedCourse(null);
    setVideoFile(null);
    fetchCourses();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-primary-red">Instructor Dashboard</h1>

      <section className="mb-8 sm:mb-12">
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-primary-blue">Create New Course</h2>
        <form onSubmit={handleCreateCourse} className="space-y-3 sm:space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={newCourse.title}
            onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded focus:border-primary-red focus:outline-none text-sm sm:text-base"
            required
          />
          <textarea
            placeholder="Description"
            value={newCourse.description}
            onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded focus:border-primary-red focus:outline-none text-sm sm:text-base"
            rows={3}
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={newCourse.price}
            onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded focus:border-primary-red focus:outline-none text-sm sm:text-base"
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewCourse({ ...newCourse, image: e.target.files[0] })}
            className="w-full text-sm"
          />
          <Button type="submit" className="w-full sm:w-auto">Create Course</Button>
        </form>
      </section>

      <section className="mb-8 sm:mb-12">
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-primary-blue">My Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {courses.map((c) => (
            <div key={c.id} className="border border-gray-300 rounded-lg overflow-hidden shadow-md">
              {c.imageFileId && (
                <img
                  src={`${import.meta.env.VITE_API_URL}/courses/${c.id}/image`}
                  alt={c.title}
                  className="w-full h-32 sm:h-40 object-cover"
                />
              )}
              <div className="p-3 sm:p-4">
                <h3 className="font-bold text-base sm:text-lg mb-2">{c.title}</h3>
                <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">₹{c.price}</p>
                <Link to={`/instructor/courses/${c.id}`} className="block">
                  <Button variant="outline" className="w-full">
                    Manage Lessons
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {selectedCourse && (
        <section>
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-primary-blue">Upload Video for {selectedCourse.title}</h2>
          <form onSubmit={handleUploadVideo} className="space-y-3 sm:space-y-4">
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files[0])}
              className="w-full text-sm"
            />
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button type="submit" className="w-full sm:w-auto">Upload Video</Button>
              <Button variant="outline" onClick={() => setSelectedCourse(null)} className="w-full sm:w-auto">Cancel</Button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
};

export default InstructorDashboard;
