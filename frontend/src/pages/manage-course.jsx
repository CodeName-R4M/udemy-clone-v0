import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../components/button";
import { apiClient } from "../client";
import LessonPlayer from "../components/lessonplayer";
import { useAuth } from "../contexts/AuthContext";
import { props } from "react";
import {
  Pencil,
  Trash2,
  BookOpen,
  Video,
  PlayCircle,
  FileQuestion,
  MessageSquare,
  Reply,
  Settings2,
  CircleCheckBig,
  CircleAlert,
  Trophy,
  RotateCcw,
  GripVertical,
  Eye,
} from "lucide-react";

const ManageCourse = () => {
  const [editMode, setEditMode] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
const [quizInfo, setQuizInfo] = useState(null);



  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    setIsEditing(true);

    try {
      await apiClient.updateCourse(course.id, {
        title: courseForm.title,
        description: courseForm.description,
        price: Number(courseForm.price),
      });

      if (newImage) {

        const formData = new FormData();
        formData.append("image", newImage);

        await apiClient.uploadCourseImage(course.id, formData);
      }

      setEditMode(false);
      fetchCourse();
    } finally {
      setIsEditing(false);
    }
  };

  const handleDeleteCourse = async () => {
    const ok = window.confirm(
      "Delete this course permanently?"
    );

    if (!ok) return;

await apiClient.deleteCourse(course.id);

navigate(
  currentUser?.role === "admin"
    ? "/admin"
    : "/instructor"
);
  };

  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
    price: "",
  });
  const { id } = useParams();
  const navigate = useNavigate();
  const { refetchUser, currentUser } = useAuth();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
const [quizExists, setQuizExists] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingLessonId, setEditingLessonId] = useState(null);
  const [draggedLessonId, setDraggedLessonId] = useState(null);
  const [newLesson, setNewLesson] = useState({
    title: "",
    description: "",
    video: null,
    youtubeUrl: "",
    type: "video",
  });

  useEffect(() => {
    fetchCourse();
  }, []);

  useEffect(() => {
    refetchUser();
  }, []);

  const fetchCourse = async () => {
    try {
      const data = await apiClient.getCourse(id);
      const c = data.course || data;

      setCourse(c);

      setCourseForm({
        title: c.title,
        description: c.description,
        price: c.price,
      });
const lessons = await apiClient.getLessons(id);
setLessons(lessons);

let quizData = null;

try {
    quizData = await apiClient.getQuiz(id);
    setQuizExists(true);
} catch {
    setQuizExists(false);
}

setQuizInfo(quizData);

    } catch (err) {
      console.error(err);
    }
  };

  const resetLessonForm = () => {
    setEditingLessonId(null);
setNewLesson({
  title: "",
  description: "",
  video: null,
  youtubeUrl: "",
  type: "video",
});
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();

    const isDuplicate = lessons.some(
      (lesson) => lesson.title.toLowerCase() === newLesson.title.toLowerCase()
    );

    if (isDuplicate) {
      alert("A lesson with this title already exists. Please choose a different title.");
      return;
    }

    setIsUploading(true);
      // Add lesson type to form data
      

    try {
      const formData = new FormData();
      
      formData.append("type", newLesson.type || "video");
      formData.append("courseId", id);
      formData.append("title", newLesson.title);
      formData.append("description", newLesson.description);

      if (newLesson.video) {
        formData.append("video", newLesson.video);
      }

      if (newLesson.youtubeUrl.trim()) {
        formData.append("youtubeUrl", newLesson.youtubeUrl);
      }

      await apiClient.createLesson(formData);
      resetLessonForm();
      fetchCourse();
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditLesson = (lesson) => {
    setEditingLessonId(lesson.id);
    setNewLesson({
      title: lesson.title,
      description: lesson.description,
      video: null,
      youtubeUrl: lesson.youtubeUrl || "",
      type: lesson.type || "video",
    });
  };

  const handleUpdateLesson = async (e) => {
    e.preventDefault();

    const isDuplicate = lessons.some(
      (lesson) =>
        lesson.id !== editingLessonId &&
        lesson.title.toLowerCase() === newLesson.title.toLowerCase()
    );

    if (isDuplicate) {
      alert("A lesson with this title already exists. Please choose a different title.");
      return;
    }

    setIsUploading(true);

    try {
      // Add lesson type to form data
      
      const formData = new FormData();
      
      formData.append("type", newLesson.type || "video");
      formData.append("title", newLesson.title);
      formData.append("description", newLesson.description);

      if (newLesson.video) {
        formData.append("video", newLesson.video);
      }

      formData.append("youtubeUrl", newLesson.youtubeUrl || "");

      await apiClient.updateLesson(editingLessonId, formData);
      resetLessonForm();
      fetchCourse();
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm("Delete this lesson?")) return;

    await apiClient.deleteLesson(lessonId);

    fetchCourse();
  };
  const handleLessonDragStart = (lessonId) => {
    setDraggedLessonId(lessonId);
  };

  const handleLessonDragEnd = () => {
    setDraggedLessonId(null);
  };

  const handleLessonDrop = async (targetLessonId) => {
    if (!draggedLessonId || draggedLessonId === targetLessonId) {
      setDraggedLessonId(null);
      return;
    }

    const reorderedLessons = [...lessons];
    const draggedIndex = reorderedLessons.findIndex(
      (lesson) => lesson.id === draggedLessonId,
    );
    const targetIndex = reorderedLessons.findIndex(
      (lesson) => lesson.id === targetLessonId,
    );

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedLessonId(null);
      return;
    }

    const [movedLesson] = reorderedLessons.splice(draggedIndex, 1);
    reorderedLessons.splice(targetIndex, 0, movedLesson);

    try {
      await apiClient.reorderLessons(
        id,
        reorderedLessons.map((lesson) => lesson.id),
      );

      setLessons(reorderedLessons);
    } catch (error) {
      console.error(error);
      alert("Unable to save lesson order right now.");
    } finally {
      setDraggedLessonId(null);
    }
  };

  if (!course) {
    return (
      <div className="max-w-6xl mx-auto p-6 sm:p-8">
        Loading...
      </div>
    );
  }

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
<Button
  variant="outline"
  onClick={() =>
    navigate(
      currentUser?.role === "admin"
        ? "/admin"
        : "/instructor"
    )
  }
>
  ← Back
</Button>
        <div className="mb-6 rounded-2xl border bg-white p-5 shadow-sm">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-500">Course Category</p>

      <span className="mt-2 inline-flex rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
        🎵 Music
      </span>
    </div>

    <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
      Temporary
    </span>
  </div>
</div>
        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4 sm:mt-6">
          <Button
            variant="outline"
            onClick={() => setEditMode(!editMode)}
            className="w-full sm:w-auto"
          >
            {editMode ? "Cancel" : "Edit Course"}
          </Button>

          <Button
            variant="outline"
            onClick={handleDeleteCourse}
            className="w-full sm:w-auto"
          >
            Delete Course
          </Button>
        </div>

        {/* Hero Section */}
        <div className="mt-6 sm:mt-8 rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-r from-gray-900 via-slate-900 to-black text-white">
          <div className="grid lg:grid-cols-5 gap-0">
            {/* Left Side */}
            <div className="lg:col-span-3 p-6 sm:p-10 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-blue-600 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                  Instructor Dashboard
                </span>
                <span className="bg-green-500/20 text-green-300 border border-green-400/30 px-3 py-1 rounded-full text-xs">
                  Published
                </span>
              </div>

              {editMode ? (
                <form
                  onSubmit={handleUpdateCourse}
                  className="space-y-4 sm:space-y-5"
                >
                  <input
                    value={courseForm.title}
                    onChange={(e) =>
                      setCourseForm({
                        ...courseForm,
                        title: e.target.value,
                      })
                    }
                    className="w-full rounded-xl bg-white/10 border border-white/20 p-3 sm:p-4 outline-none focus:border-blue-400 text-sm sm:text-base"
                    placeholder="Course title"
                    disabled={isEditing}
                  />

                  <textarea
                    rows={4}
                    value={courseForm.description}
                    onChange={(e) =>
                      setCourseForm({
                        ...courseForm,
                        description: e.target.value,
                      })
                    }
                    className="w-full rounded-xl bg-white/10 border border-white/20 p-3 sm:p-4 outline-none focus:border-blue-400 text-sm sm:text-base"
                    placeholder="Course description"
                    disabled={isEditing}
                  />

                  <input
                    type="number"
                    value={courseForm.price}
                    onChange={(e) =>
                      setCourseForm({
                        ...courseForm,
                        price: e.target.value,
                      })
                    }
                    className="w-full sm:w-48 rounded-xl bg-white/10 border border-white/20 p-3 sm:p-4 outline-none focus:border-blue-400 text-sm sm:text-base"
                    placeholder="Price"
                    disabled={isEditing}
                  />

                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">
                      Change Thumbnail
                    </label>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setNewImage(e.target.files[0])
                      }
                      className="block w-full text-sm"
                      disabled={isEditing}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button type="submit" className="w-full sm:w-auto" disabled={isEditing}>
                      {isEditing ? "Saving..." : "Save Changes"}
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => setEditMode(false)}
                      className="w-full sm:w-auto"
                      disabled={isEditing}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight">
                    {course.title}
                  </h1>

                  <p className="text-gray-300 mt-3 sm:mt-5 text-sm sm:text-lg leading-7 sm:leading-8 max-w-3xl">
                    {course.description}
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-start sm:gap-4 sm:gap-8 mt-6 sm:mt-8">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-400">
                        Course Price
                      </p>

                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-400">
                        ₹{course.price}
                      </h2>
                    </div>

                    <div className="hidden sm:block h-14 w-px bg-white/20"></div>

                    <div>
                      <p className="text-xs sm:text-sm text-gray-400">
                        Lessons
                      </p>

                      <h2 className="text-2xl sm:text-3xl font-bold">
                        {lessons.length}
                      </h2>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-10">
                    <Button {...props}>
  <Pencil size={16} className="mr-2" />
  Edit Course
</Button>

                   <Button {...props}>
  <Trash2 size={16} className="mr-2" />
  Delete Course
</Button>
                  </div>
                </>
              )}
            </div>

            {/* Right Side */}
            <div className="lg:col-span-2 relative min-h-[250px] sm:min-h-[300px] lg:min-h-[420px]">
              {course.imageFileId ? (
                <img
                  src={`${import.meta.env.VITE_API_URL}/courses/${course.id}/image?file=${course.imageFileId}`}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-700 to-indigo-900 text-4xl sm:text-6xl font-black">
                  ADS
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6">
                <div className="bg-black/60 backdrop-blur-md px-3 sm:px-4 py-2 sm:py-3 rounded-xl">
                  <p className="text-xs sm:text-sm text-gray-300">
                    Course Thumbnail
                  </p>

                  <p className="font-semibold text-sm sm:text-base">
                    Ready for students
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Lesson Form */}
        <div className="mt-8 sm:mt-12 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-5 sm:px-8 py-4 sm:py-6 border-b bg-gray-50 gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                {editingLessonId ? "Edit Lecture" : "Add New Lecture"}
              </h2>

              <p className="text-gray-500 mt-1 text-sm">
                {editingLessonId
                  ? "Update this lesson for your students."
                  : "Create a new lesson for your students."}
              </p>
            </div>

            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-indigo-100 flex items-center justify-center text-2xl sm:text-3xl">
              <Video className="w-7 h-7 text-indigo-600" />
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={editingLessonId ? handleUpdateLesson : handleAddLesson}
            className="p-5 sm:p-8 space-y-5 sm:space-y-7"
          >
            {/* Lesson Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
              Lecture Title
            </label>

            <input
              type="text"
              placeholder="Example: Introduction to React"
              value={newLesson.title}
              onChange={(e) =>
                setNewLesson({
                  ...newLesson,
                  title: e.target.value,
                })
              }
              className="w-full rounded-xl border border-gray-300 px-4 sm:px-5 py-3 sm:py-4 text-base sm:text-lg focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none transition"
              required
              disabled={isUploading}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Lecture Description
            </label>

            <textarea
              rows={4}
              placeholder="Describe what students will learn in this lecture..."
              value={newLesson.description}
              onChange={(e) =>
                setNewLesson({
                  ...newLesson,
                  description: e.target.value,
                })
              }
              className="w-full rounded-xl border border-gray-300 px-4 sm:px-5 py-3 sm:py-4 resize-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none transition text-sm sm:text-base"
              required
              disabled={isUploading}
            />
          </div>

          <div className="space-y-5 sm:space-y-6">
            {/* Upload Video */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                Upload Video
              </label>

              <label
                className={`flex flex-col items-center justify-center w-full h-36 sm:h-44 border-2 border-dashed rounded-2xl transition ${
                  isUploading || newLesson.youtubeUrl
                    ? "border-gray-200 bg-gray-100 cursor-not-allowed opacity-60"
                    : "border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 cursor-pointer"
                }`}
              >
                <div className="text-4xl sm:text-5xl mb-2 sm:mb-3"><PlayCircle className="w-12 h-12 text-indigo-500 mb-3" /></div>

                <p className="font-semibold text-gray-700 text-sm sm:text-base">
                  Click to upload a lecture
                </p>

                <p className="text-xs sm:text-sm text-gray-500">
                  MP4, MOV, AVI...
                </p>

                {newLesson.video && (
                  <div className="mt-3 sm:mt-4 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-green-100 text-green-700 text-xs sm:text-sm">
                    <div className="mt-4 flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm">
  <CircleCheckBig size={16} />
  <span>{newLesson.video.name}</span>
</div>
                  </div>
                )}

                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  disabled={isUploading || !!newLesson.youtubeUrl}
                  onChange={(e) =>
                    setNewLesson({
                      ...newLesson,
                      video: e.target.files[0],
                    })
                  }
                />
              </label>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex-1 border-t"></div>
              <span className="text-gray-400 font-medium text-sm">
                OR
              </span>
              <div className="flex-1 border-t"></div>
            </div>

            {/* Youtube */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                YouTube Video
              </label>

              <input
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                disabled={isUploading || !!newLesson.video}
                value={newLesson.youtubeUrl}
                onChange={(e) =>
                  setNewLesson({
                    ...newLesson,
                    youtubeUrl: e.target.value,
                  })
                }
                className={`w-full rounded-xl border px-4 sm:px-5 py-3 sm:py-4 outline-none transition text-sm sm:text-base ${
                  isUploading || newLesson.video
                    ? "bg-gray-100 border-gray-200 cursor-not-allowed"
                    : "border-gray-300 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                }`}
              />

              <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
                Paste a YouTube link instead of uploading a video.
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-3 sm:pt-4 border-t mt-3 sm:mt-4">
            <Button
              variant="outline"
              type="button"
              onClick={resetLessonForm}
              className="w-full sm:w-auto"
              disabled={isUploading}
            >
              {editingLessonId ? "Cancel" : "Clear"}
            </Button>

            <Button type="submit" className="w-full sm:w-auto" disabled={isUploading}>
              {isUploading
                ? editingLessonId
                  ? "Saving..."
                  : "Uploading..."
                : editingLessonId
                  ? "Save Changes"
                  : "Upload Lecture"}
            </Button>
          </div>
        </form>
      </div>

      {/* Curriculum List */}
      <div className="mt-8 sm:mt-12 bg-white rounded-xl shadow border overflow-hidden">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b bg-gray-50">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              Curriculum
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {lessons.length} lesson{lessons.length !== 1 && "s"}
            </p>
          </div>

          <div className="text-xs sm:text-sm text-gray-500">
            Drag lessons to reorder
          </div>
        </div>

        {lessons.length === 0 ? (
          <div className="py-12 sm:py-16 text-center text-gray-500">
            <div className="text-4xl sm:text-5xl mb-3"><BookOpen size={48} /></div>
            <p className="text-base sm:text-lg font-medium">
              No lessons added yet
            </p>
            <p className="text-xs sm:text-sm">
              Upload your first lesson above.
            </p>
          </div>
        ) : (
            <div>
              {lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  draggable
                  onDragStart={() => handleLessonDragStart(lesson.id)}
                  onDragEnd={handleLessonDragEnd}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleLessonDrop(lesson.id)}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b last:border-b-0 hover:bg-gray-50 transition gap-3 sm:gap-4 cursor-grab"
                >
                  <div className="flex items-start gap-4 sm:gap-5 flex-1">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm sm:text-base">
                      {index + 1}
                    </div>
                    <div className="text-gray-400 text-lg leading-none"><GripVertical className="text-gray-400" size={20} /></div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-base sm:text-lg text-gray-800">
                        {lesson.title}
                      </h3>

                      <p className="text-gray-500 text-xs sm:text-sm mt-1">
                        {lesson.description}
                      </p>
                      {lesson.type === "video" && (
                        <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
  <Video size={16} />
  <span>Video Lesson</span>
</div>
                      )}
                      {lesson.type === "quiz" && (
                        <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
  <FileQuestion size={16} />
  <span>Quiz Assessment</span>
</div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      onClick={() => handleEditLesson(lesson)}
                      className="flex-1 sm:flex-none"
                    >
                      Edit
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => setSelectedLesson(lesson)}
                      className="flex-1 sm:flex-none"
                    >
                      Preview
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => handleDeleteLesson(lesson.id)}
                      className="flex-1 sm:flex-none"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
        )}
      </div>
    </div>

    <LessonPlayer
      lesson={selectedLesson}
      onClose={() => setSelectedLesson(null)}
    />
    <div className="mt-12 bg-white rounded-2xl shadow border overflow-hidden">

  <div className="px-8 py-6 border-b bg-gray-50 flex items-center justify-between">

    <div>
      <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-800">
  <Settings2 size={26} />
  Quiz Settings
</h2>

      <p className="text-sm text-gray-500 mt-1">
        Manage the final assessment for this course.
      </p>
    </div>

<Button
  onClick={() => navigate(`/quiz-settings/${course.id}`)}
>
{quizExists ? "Manage Quiz" : "Create Quiz"}
</Button>

  </div>

  <div className="p-8">

    <div className="grid md:grid-cols-3 gap-6">

      <div className="rounded-xl border p-6">
       <p className="flex items-center gap-2 text-sm text-gray-500">
  <CircleCheckBig size={16} />
  Quiz Status
</p>

<span
  className={`inline-flex mt-3 rounded-full px-3 py-1 text-sm font-semibold ${
    quizExists
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700"
  }`}
>
  {quizExists ? "Active" : "Not Created"}
</span>
      </div>

      <div className="rounded-xl border p-6">
       <p className="flex items-center gap-2 text-sm text-gray-500">
  <FileQuestion size={16} />
  Questions
</p>

        <h3 className="mt-2 text-lg font-semibold">
{quizExists ? quizInfo?.questions?.length || 0 : 0}
        </h3>
      </div>

      <div className="rounded-xl border p-6">
       <p className="flex items-center gap-2 text-sm text-gray-500">
  <Trophy size={16} />
  Passing Score
</p>

        <h3 className="mt-2 text-lg font-semibold">
{quizExists
    ? `${quizInfo?.passingScore ?? 0}%`
    : "N/A"}
        </h3>
      </div>
<div className="rounded-xl border p-6">
   <p className="flex items-center gap-2 text-sm text-gray-500">
  <RotateCcw size={16} />
  Attempt Cooldown
</p>

    <h3 className="mt-2 text-lg font-semibold">
        {quizExists ? `${quizInfo?.attemptCooldown ?? "Unlimited"} minutes` : "Unlimited"}
    </h3>
</div>
    </div>

  </div>

</div>
  </>
  );
};

export default ManageCourse;
