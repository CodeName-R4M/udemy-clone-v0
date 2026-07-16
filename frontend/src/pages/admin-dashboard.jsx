
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../components/button';
import { apiClient } from '../client';
import { Edit, Trash2 } from "lucide-react";

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
const [users, setUsers] = useState([]);
const [courses, setCourses] = useState([]);
const [search, setSearch] = useState("");
const [newInstructor, setNewInstructor] = useState({
  name: "",
  email: "",
  password: "",
});
const [accountType, setAccountType] = useState("instructor");
const totalUsers = users.length;
const totalStudents = users.filter(
  (u) => u.role === "user"
).length;
const totalInstructors = users.filter(
  (u) => u.role === "instructor"
).length;
const totalAdmins = users.filter(
  (u) => u.role === "admin"
).length;

const totalCourses = courses.length;

const freeCourses = courses.filter(
  (c) => Number(c.price) === 0
).length;

const paidCourses =
  totalCourses - freeCourses;

const averageCoursePrice =
  totalCourses === 0
    ? 0
    : Math.round(
        courses.reduce(
          (sum, c) => sum + Number(c.price || 0),
          0
        ) / totalCourses
      );
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchUsers();
    fetchCourses();
  }, [user, navigate]);

  const fetchUsers = async () => {
    const data = await apiClient.getUsers();
    setUsers(data);
  };

  const fetchCourses = async () => {
    const data = await apiClient.getCourses();
    setCourses(data);
  };

  const handleCreateInstructor = async (e) => {
    e.preventDefault();
    if (accountType === "instructor") {
  await apiClient.createInstructor(newInstructor);
} else {
  await apiClient.createStudent(newInstructor);
}
    setNewInstructor({ name: '', email: '', password: '' });
    fetchUsers();
  };

  const handleDeleteCourse = async (id) => {
    await apiClient.deleteCourse(id);
    fetchCourses();
  };

const filteredCourses = courses.filter((course) =>
  course.title
    .toLowerCase()
    .includes(search.toLowerCase())
);
  return (
<div className="min-h-screen bg-gray-50">

  {/* Hero */}
  <div className="bg-gradient-to-r from-primary-red via-red-700 to-primary-blue text-white shadow-lg">
    <div className="max-w-7xl mx-auto px-6 py-12">

      <h1 className="text-5xl font-black tracking-tight">
        Admin Dashboard
      </h1>

      <p className="mt-3 text-red-100 text-lg">
        Manage instructors, students, courses and platform analytics.
      </p>

      <div className="mt-8 flex flex-wrap gap-4">

        <div className="bg-white/15 backdrop-blur px-5 py-3 rounded-xl">
          <p className="text-red-100 text-sm">
            Total Users
          </p>

          <h2 className="text-3xl font-bold">
            {totalUsers}
          </h2>
        </div>

        <div className="bg-white/15 backdrop-blur px-5 py-3 rounded-xl">
          <p className="text-red-100 text-sm">
            Courses
          </p>

          <h2 className="text-3xl font-bold">
            {totalCourses}
          </h2>
        </div>

        <div className="bg-white/15 backdrop-blur px-5 py-3 rounded-xl">
          <p className="text-red-100 text-sm">
            Instructors
          </p>

          <h2 className="text-3xl font-bold">
            {totalInstructors}
          </h2>
        </div>

        <div className="bg-white/15 backdrop-blur px-5 py-3 rounded-xl">
          <p className="text-red-100 text-sm">
            Students
          </p>

          <h2 className="text-3xl font-bold">
            {totalStudents}
          </h2>
        </div>

      </div>

    </div>
  </div>

  <div className="max-w-7xl mx-auto px-6 py-10">
    {/* Analytics */}
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition">
    <p className="text-gray-500 text-sm">
      Total Users
    </p>

    <h2 className="mt-2 text-4xl font-black text-primary-red">
      {totalUsers}
    </h2>

    <p className="mt-3 text-sm text-gray-500">
      Registered accounts
    </p>
  </div>

  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition">
    <p className="text-gray-500 text-sm">
      Total Courses
    </p>

    <h2 className="mt-2 text-4xl font-black text-primary-blue">
      {totalCourses}
    </h2>

    <p className="mt-3 text-sm text-gray-500">
      Published on platform
    </p>
  </div>

  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition">
    <p className="text-gray-500 text-sm">
      Paid Courses
    </p>

    <h2 className="mt-2 text-4xl font-black text-primary-red">
      {paidCourses}
    </h2>

    <p className="mt-3 text-sm text-gray-500">
      Free: {freeCourses}
    </p>
  </div>

  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition">
    <p className="text-gray-500 text-sm">
      Avg. Course Price
    </p>

    <h2 className="mt-2 text-4xl font-black text-primary-blue">
      ₹{averageCoursePrice}
    </h2>

    <p className="mt-3 text-sm text-gray-500">
      Across all courses
    </p>
  </div>

</div>
<section
  id="create-instructor"
  className="mb-12"
>

  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

    <div className="bg-gradient-to-r from-primary-blue to-primary-red px-6 py-5">

      <h2 className="text-2xl font-bold text-white">
        Create Instructor
      </h2>

      <p className="text-blue-100 mt-1">
        {accountType === "instructor"
  ? "Add new instructors who can publish and manage courses."
  : "Create a student account with the ADS role."}
      </p>

    </div>

    <div className="p-6">
<div className="mb-6">
  <label className="block text-sm font-medium mb-2">
    Account Type
  </label>

  <select
    value={accountType}
    onChange={(e) => setAccountType(e.target.value)}
    className="w-full lg:w-72 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-blue outline-none"
  >
    <option value="instructor">
      Instructor
    </option>

    <option value="user">
      ADS Student
    </option>
  </select>
</div>
      <form
        onSubmit={handleCreateInstructor}
        className="grid lg:grid-cols-4 gap-5"
      >

        <input
          type="text"
          placeholder={
  accountType === "instructor"
    ? "Instructor Name"
    : "Student Name"
}
          value={newInstructor.name}
          onChange={(e) =>
            setNewInstructor({
              ...newInstructor,
              name: e.target.value,
            })
          }
          className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-blue outline-none"
          required
        />

        <input
          type="email"
          placeholder="Email Address"
          value={newInstructor.email}
          onChange={(e) =>
            setNewInstructor({
              ...newInstructor,
              email: e.target.value,
            })
          }
          className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-blue outline-none"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={newInstructor.password}
          onChange={(e) =>
            setNewInstructor({
              ...newInstructor,
              password: e.target.value,
            })
          }
          className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-blue outline-none"
          required
        />

        <Button
          type="submit"
          className="rounded-xl"
        >
         {accountType === "instructor"
  ? "Create Instructor"
  : "Create ADS Student"}
        </Button>

      </form>

    </div>

  </div>

</section>
<section className="mb-12">

  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

    <div className="flex justify-between items-center px-6 py-5 border-b">

      <div>
        <h2 className="text-2xl font-bold text-primary-blue">
          Platform Users
        </h2>

        <p className="text-gray-500 text-sm mt-1">
          Manage administrators, instructors and students.
        </p>
      </div>

      <div className="text-sm text-gray-500">
        {users.length} Users
      </div>

    </div>

    <div className="overflow-x-auto">

      <table className="min-w-full">

        <thead className="bg-gray-50">

          <tr>

            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
              User
            </th>

            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
              Email
            </th>

            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
              Role
            </th>

          </tr>

        </thead>

        <tbody>

          {users.map((u) => (

            <tr
              key={u.id}
              className="border-t hover:bg-gray-50 transition"
            >

              <td className="px-6 py-5">

                <div className="flex items-center gap-4">

                  <div className="h-11 w-11 rounded-full bg-gradient-to-r from-primary-red to-primary-blue text-white flex items-center justify-center font-bold">

                    {u.name.charAt(0).toUpperCase()}

                  </div>

                  <div>

                    <div className="font-semibold text-gray-900">
                      {u.name}
                    </div>

                    <div className="text-xs text-gray-400">
                      {u.id}
                    </div>

                  </div>

                </div>

              </td>

              <td className="px-6 py-5 text-gray-600">
                {u.email}
              </td>

              <td className="px-6 py-5">

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    u.role === "admin"
                      ? "bg-red-100 text-red-700"
                      : u.role === "instructor"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {u.role === "user" ? "ADS Student" : u.role}
                </span>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  </div>

</section>
<section>

  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

    <div className="flex justify-between items-center px-6 py-5 border-b">

      <div>

        <h2 className="text-2xl font-bold text-primary-blue">
          Course Management
        </h2>

        <p className="text-gray-500 text-sm mt-1">
          Edit or remove courses from the platform.
        </p>

      </div>

      <div className="text-sm text-gray-500">
        {courses.length} Courses
      </div>

    </div>

    <div className="overflow-x-auto">

      <table className="min-w-full">

        <thead className="bg-gray-50">

          <tr>

            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
              Course
            </th>

            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
              Price
            </th>

            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
              Status
            </th>

            <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>


          {filteredCourses.map((c) => (

            <tr
              key={c.id}
              className="border-t hover:bg-gray-50 transition"
            >

              <td className="px-6 py-5">

                <div className="flex items-center gap-4">

                  <div className="h-14 w-14 rounded-xl bg-gradient-to-r from-primary-red to-primary-blue text-white flex items-center justify-center font-bold text-xl">

                    {c.title.charAt(0)}

                  </div>

                  <div>

                    <div className="font-semibold text-gray-900">

                      {c.title}

                    </div>

                    <div className="text-xs text-gray-400">

                      {c.id}

                    </div>

                  </div>

                </div>

              </td>

              <td className="px-6 py-5">

                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-semibold">

                  ₹{c.price}

                </span>

              </td>

              <td className="px-6 py-5">

                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">

                  Published

                </span>

              </td>

              <td className="px-6 py-5">

                <div className="flex justify-end gap-3">

                  <button
                    onClick={() =>
                      navigate(`/instructor/courses/${c.id}`)
                    }
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
                  >
                    <Edit size={18} />
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDeleteCourse(c.id)
                    }
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition"
                  >
                    <Trash2 size={18} />
                    Delete
                  </button>

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  </div>

</section>
{/* Platform Insights */}
<div className="grid lg:grid-cols-3 gap-6 mb-12">

  {/* User Distribution */}
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

    <h3 className="text-xl font-bold text-primary-blue mb-6">
      User Distribution
    </h3>

    <div className="space-y-6">

      <div>
        <div className="flex justify-between text-sm mb-2">
          <span>Students</span>
          <span>{totalStudents}</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-green-500 h-3 rounded-full"
            style={{
              width: `${
                totalUsers
                  ? (totalStudents / totalUsers) * 100
                  : 0
              }%`,
            }}
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between text-sm mb-2">
          <span>Instructors</span>
          <span>{totalInstructors}</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-primary-blue h-3 rounded-full"
            style={{
              width: `${
                totalUsers
                  ? (totalInstructors / totalUsers) * 100
                  : 0
              }%`,
            }}
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between text-sm mb-2">
          <span>Admins</span>
          <span>{totalAdmins}</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-primary-red h-3 rounded-full"
            style={{
              width: `${
                totalUsers
                  ? (totalAdmins / totalUsers) * 100
                  : 0
              }%`,
            }}
          />
        </div>
      </div>

    </div>

  </div>

  {/* Course Summary */}
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

    <h3 className="text-xl font-bold text-primary-blue mb-6">
      Course Summary
    </h3>

    <div className="space-y-5">

      <div className="flex justify-between">
        <span>Total Courses</span>
        <span className="font-bold">
          {totalCourses}
        </span>
      </div>

      <div className="flex justify-between">
        <span>Paid Courses</span>
        <span className="font-bold text-primary-red">
          {paidCourses}
        </span>
      </div>

      <div className="flex justify-between">
        <span>Free Courses</span>
        <span className="font-bold text-green-600">
          {freeCourses}
        </span>
      </div>

      <div className="flex justify-between">
        <span>Average Price</span>
        <span className="font-bold">
          ₹{averageCoursePrice}
        </span>
      </div>

    </div>

  </div>

  {/* Quick Actions */}
  <div className="bg-gradient-to-br from-primary-red to-primary-blue rounded-2xl text-white p-6">

    <h3 className="text-2xl font-bold">
      Quick Actions
    </h3>

    <p className="mt-2 text-white/80">
      Manage your LMS platform faster.
    </p>

    <div className="mt-8 space-y-3">

<Button
  type="submit"
  className="rounded-xl"
>
  {accountType === "instructor"
    ? "Create Instructor"
    : "Create Student"}
</Button>

      <button
        onClick={() =>
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth",
          })
        }
        className="w-full bg-white/20 hover:bg-white/30 rounded-xl py-3 transition"
      >
        📚 Manage Courses
      </button>

    </div>

  </div>
<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 px-6 py-5 border-b">

  <div>

    <h2 className="text-2xl font-bold text-primary-blue">
      Course Management
    </h2>

    <p className="text-gray-500 text-sm mt-1">
      Edit, review and manage platform courses.
    </p>

  </div>

  <div className="flex gap-3">

<input
    value={search}
    onChange={(e) =>
        setSearch(e.target.value)
    }
    placeholder="Search courses..."
    className="..."
/>

    <button
      className="px-5 py-2 rounded-xl bg-primary-blue text-white"
    >
      Filter
    </button>

  </div>

</div>
</div>

    </div>
    </div>
  );
};

export default AdminDashboard;
