import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from "react";
import { apiClient } from "../client";

const Profile = () => {
const { user, refetchUser } = useAuth();
const [editingName, setEditingName] = useState(false);
const [name, setName] = useState(user?.name || "");
const [changingPassword, setChangingPassword] = useState(false);
const [recentCourses, setRecentCourses] = useState([]);
const [stats, setStats] = useState({
  enrolledCourses: 0,
  completedCourses: 0,
  completionRate: 0,
  certificates: 0,
  learningStreak: 0,
});
const [passwords, setPasswords] = useState({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

useEffect(() => {
  setName(user?.name || "");

  const loadCourses = async () => {
    try {
      const courses = await apiClient.getMyEnrolledCourses();
      setRecentCourses(courses);
      
const stats = await apiClient.getProfileStats();
setStats(stats);
    } catch (err) {
      console.error(err);
    }
  };

  if (user) {
    loadCourses();
  }
}, [user]);

const handleSaveName = async () => {
  try {
    await apiClient.updateProfile({
      name,
    });

await refetchUser();

    setEditingName(false);
  } catch (err) {
    console.error(err);
    alert("Failed to update profile.");
  }
};

const handleChangePassword = async () => {
  if (passwords.newPassword !== passwords.confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  try {
    await apiClient.changePassword({
      currentPassword: passwords.currentPassword,
      newPassword: passwords.newPassword,
    });

    alert("Password changed successfully.");

    setPasswords({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setChangingPassword(false);
  } catch (err) {
    console.error(err);
    alert("Failed to change password.");
  }
};

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="bg-gradient-to-r from-red-600 via-red-500 to-blue-700">
        <div className="max-w-6xl mx-auto px-8 py-12 flex items-center gap-8">

          <div className="w-28 h-28 rounded-full bg-white text-blue-700 text-5xl font-bold flex items-center justify-center shadow-lg">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <div className="text-white">

            <h1 className="text-4xl font-bold">
              {user?.name}
            </h1>

            <p className="text-red-100 mt-2 capitalize">
              {user?.role}
            </p>

            <p className="mt-4 text-blue-100">
              {user?.email}
            </p>

            <p className="text-sm text-red-100 mt-2">
              Member of ADS Learning
            </p>

          </div>

        </div>
      </div>

<div className="max-w-6xl mx-auto px-8 py-8">

    <div className="space-y-6">
    <div className="   bg-white rounded-2xl shadow border p-6">

      <h2 className="text-2xl font-bold mb-6">
        Personal Information
      </h2>

      <div className="space-y-6">

<div>

  <div className="flex items-center justify-between mb-2">

    <p className="text-sm text-gray-500">
      Full Name
    </p>

    {!editingName && (
      <button
        onClick={() => setEditingName(true)}
        className="text-blue-600 text-sm font-semibold hover:underline"
      >
        Edit
      </button>
    )}

  </div>

  {editingName ? (

    <div className="space-y-3">

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-xl border border-gray-300 px-4 py-3"
      />

      <div className="flex gap-3">
<button
  onClick={handleSaveName}
  className="rounded-xl bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
>
  Save
</button>

        <button
          onClick={() => {
            setEditingName(false);
            setName(user?.name || "");
          }}
          className="rounded-xl border px-5 py-2"
        >
          Cancel
        </button>

      </div>

    </div>

  ) : (

    <p className="text-lg font-semibold">
      {user?.name}
    </p>

  )}

</div>

        <div>
          <p className="text-sm text-gray-500">
            Email Address
          </p>

          <p className="text-lg font-semibold">
            {user?.email}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Role
          </p>

          <p className="text-lg font-semibold capitalize">
            {user?.role}
          </p>
        </div>

      </div>

    </div>

<div className="   bg-white rounded-2xl shadow border p-6  ">

  <h2 className="text-2xl font-bold mb-6">
    Learning Statistics
  </h2>

  <div className="grid sm:grid-cols-2 gap-5">

    <div className="rounded-xl bg-red-50 p-5 border border-red-100">
      <p className="text-sm text-gray-500">
        Courses Enrolled
      </p>
<p className="text-3xl font-bold text-red-600">
 {stats.enrolledCourses}
</p>
    </div>

    <div className="rounded-xl bg-blue-50 p-5 border border-blue-100">
      <p className="text-sm text-gray-500">
        Courses Completed
      </p>

<p className="text-3xl font-bold text-blue-600">
  {stats.completedCourses}
</p>
    </div>

    <div className="rounded-xl bg-green-50 p-5 border border-green-100">
      <p className="text-sm text-gray-500">
        Completion Rate
      </p>

      <p className="text-3xl font-bold text-green-600">
        {stats.completionRate}%
      </p>
    </div>

    <div className="rounded-xl bg-yellow-50 p-5 border border-yellow-100">
      <p className="text-sm text-gray-500">
        Certificates
      </p>

      <p className="text-3xl font-bold text-yellow-600">
       {stats.certificates}
      </p>
    </div>

  </div>

</div>

<div className="   bg-white rounded-2xl shadow border p-6  ">

  <h2 className="text-2xl font-bold mb-6">
    Recent Learning
  </h2>

  <div className="space-y-4">

    {recentCourses.length === 0 ? (

      <p className="text-gray-500">
        You haven't enrolled in any courses yet.
      </p>

    ) : (

      recentCourses.slice(0, 5).map((course) => (

        <div
          key={course.id}
          className="flex items-center justify-between border rounded-xl p-4"
        >

          <div>

            <h3 className="font-semibold">
              {course.title}
            </h3>

            <p className="text-sm text-gray-500">
              {course.category}
            </p>

          </div>

          <button
            onClick={() => window.location.href = `/course-learning/${course.id}`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
          >
            Continue
          </button>

        </div>

      ))

    )}

  </div>

</div>


<div className="   bg-white rounded-2xl shadow border p-6  ">

  <h2 className="text-2xl font-bold mb-6">
    Achievements
  </h2>

  <div className="grid md:grid-cols-2 gap-5">

    <div className="rounded-xl border bg-gradient-to-r from-yellow-50 to-yellow-100 p-5">

      <h3 className="font-bold text-lg">
        🏆 Certificates Earned
      </h3>

      <p className="text-4xl font-bold text-yellow-600 mt-3">
        {stats.certificates}
      </p>

      <p className="text-gray-600 mt-2">
        Complete courses to earn certificates.
      </p>

    </div>

    <div className="rounded-xl border bg-gradient-to-r from-blue-50 to-blue-100 p-5">

      <h3 className="font-bold text-lg">
        ⭐ Learning Streak
      </h3>

      <p className="text-4xl font-bold text-blue-600 mt-3">
        {stats.learningStreak}
      </p>

      <p className="text-gray-600 mt-2">
        Consecutive learning days.
      </p>

    </div>

  </div>

</div>


<div className="bg-white rounded-2xl shadow border p-6">

  <h2 className="text-xl font-bold mb-6">
    Security
  </h2>

  {!changingPassword ? (

    <button
      onClick={() => setChangingPassword(true)}
      className="w-full rounded-xl bg-red-600 hover:bg-red-700 text-white py-3 font-semibold transition"
    >
      Change Password
    </button>

  ) : (

    <div className="space-y-4">

      <input
        type="password"
        placeholder="Current Password"
        value={passwords.currentPassword}
        onChange={(e) =>
          setPasswords({
            ...passwords,
            currentPassword: e.target.value,
          })
        }
        className="w-full rounded-xl border px-4 py-3"
      />

      <input
        type="password"
        placeholder="New Password"
        value={passwords.newPassword}
        onChange={(e) =>
          setPasswords({
            ...passwords,
            newPassword: e.target.value,
          })
        }
        className="w-full rounded-xl border px-4 py-3"
      />

      <input
        type="password"
        placeholder="Confirm Password"
        value={passwords.confirmPassword}
        onChange={(e) =>
          setPasswords({
            ...passwords,
            confirmPassword: e.target.value,
          })
        }
        className="w-full rounded-xl border px-4 py-3"
      />

      <div className="flex gap-3">

        <button
          onClick={handleChangePassword}
          className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white py-3 font-semibold"
        >
          Save Password
        </button>

        <button
          onClick={() => {
            setChangingPassword(false);
            setPasswords({
              currentPassword: "",
              newPassword: "",
              confirmPassword: "",
            });
          }}
          className="flex-1 rounded-xl border py-3"
        >
          Cancel
        </button>

      </div>

    </div>

  )}

</div>

  </div>


</div>



    </div>

  );
};

export default Profile;