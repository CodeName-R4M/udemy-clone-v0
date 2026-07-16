const API_URL = import.meta.env.VITE_API_URL;

class ApiClient {
  constructor() {
    this.baseURL = API_URL;
  }
async uploadCourseImage(id, formData) {
  return this.upload(`/courses/${id}/image`, formData, {
    method: "PATCH",
  });
}
async request(endpoint, options = {}) {
  const url = `${this.baseURL}${endpoint}`;
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const debug = false;

  if (debug) {
    console.group(`🌐 ${options.method || "GET"} ${endpoint}`);
    console.log("➡️ URL:", url);
    console.log("➡️ Headers:", headers);

    if (options.body) {
      console.log("➡️ Body:", options.body);
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (debug) {
    console.log("⬅️ Status:", response.status, response.statusText);
  }

  const responseText = await response.text();

  try {
    const json = JSON.parse(responseText);

    if (debug) {
      console.log("⬅️ Response:", json);
      console.groupEnd();
    }

    if (!response.ok) {
      throw new Error(JSON.stringify(json));
    }

    return json;
  } catch {
    if (debug) {
      console.log("⬅️ Response:", responseText);
      console.groupEnd();
    }

    if (!response.ok) {
      throw new Error(responseText || "API request failed");
    }

    return responseText;
  }
}

  async upload(endpoint, formData, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('token');
    const headers = { ...options.headers };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      method: options.method || 'POST',
      body: formData,
      headers,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Upload failed');
    }

    return response.json();
  }

  // Auth
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(name, email, password) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  // Courses
  async getCourses() {
    return this.request('/courses');
  }
async getCurrentUser() {
  return this.request("/auth/me");
}

async updateProfile(data) {
  return this.request("/users/me", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

async changePassword(data) {
  return this.request("/users/me/password", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

async getProfileStats() {
  return this.request("/users/me/stats");
}

async createStudent(data) {
  return this.request("/users/ads-student", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

  async getCourse(id) {
    return this.request(`/courses/${id}`);
  }

  async getMyEnrolledCourses() {
    
    return this.request('/courses/my-enrolled');
  }

  async getMyInstructedCourses() {
    return this.request('/courses/my-instructed');
  }
async updateCourseReview(courseId, reviewId, data) {
  return this.request(`/courses/${courseId}/reviews/${reviewId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

async deleteCourseReview(courseId, reviewId) {
  return this.request(`/courses/${courseId}/reviews/${reviewId}`, {
    method: "DELETE",
  });
}
  async getCourseReviews(courseId) {
    return this.request(`/courses/${courseId}/reviews`);
  }

  async createCourseReview(courseId, data) {
    return this.request(`/courses/${courseId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async createCourse(formData) {
    return this.upload('/courses', formData);
  }

  async updateCourse(id, data) {
    return this.request(`/courses/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteCourse(id) {
    return this.request(`/courses/${id}`, {
      method: 'DELETE',
    });
  }

  async enrollInCourse(id) {
    return this.request(`/courses/${id}/enroll`, {
      method: 'POST',
    });
  }

  async uploadCourseVideo(id, formData) {
    return this.upload(`/courses/${id}/video`, formData);
  }

// Lessons
async createLesson(formData) {
  return this.upload("/lesson", formData);
}

async updateLesson(lessonId, formData) {
  return this.upload(`/lesson/${lessonId}`, formData, {
    method: "PATCH",
  });
}

async getLessons(courseId) {
  return this.request(`/lesson/course/${courseId}`);
}

async getLessonQuestions(lessonId) {
  return this.request(`/lesson/${lessonId}/questions`);
  // return [];
}
async getCourseQuestions(courseId) {
  return this.request(`/lesson/course/${courseId}/questions`);
}
async startQuiz(courseId) {
  return this.request(`/lesson/course/${courseId}/quiz/start`, {
    method: "POST",
  });
}
async getQuiz(courseId) {
  return this.request(`/lesson/course/${courseId}/quiz`);
}

async updateQuiz(courseId, data) {
  return this.request(`/lesson/course/${courseId}/quiz`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
async submitQuiz(courseId, data) {
  return this.request(`/lesson/course/${courseId}/quiz/submit`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}


async createLessonQuestion(lessonId, data) {
  return this.request(`/lesson/${lessonId}/questions`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

async answerLessonQuestion(questionId, answer) {
  return this.request(`/lesson/questions/${questionId}/answer`, {
    method: 'POST',
    body: JSON.stringify({ answer }),
  });
}

async updateLessonQuestion(questionId, question) {
  return this.request(`/lesson/questions/${questionId}`, {
    method: "PATCH",
    body: JSON.stringify({ question }),
  });
}

async updateLessonAnswer(questionId, answer) {
  return this.request(`/lesson/questions/${questionId}/answer`, {
    method: 'PATCH',
    body: JSON.stringify({ answer }),
  });
}

async deleteLessonQuestion(questionId) {
  return this.request(`/lesson/questions/${questionId}`, {
    method: "DELETE",
  });
}

async reorderLessons(courseId, lessonIds) {
  return this.request('/lesson/reorder', {
    method: 'PATCH',
    body: JSON.stringify({ courseId, lessonIds }),
  });
}

async deleteLesson(lessonId) {
  return this.request(`/lesson/${lessonId}`, {
    method: "DELETE",
  });
}

// Lesson Progress
async getLessonProgress(lessonId) {
  return this.request(`/lesson/progress/${lessonId}`);
}

async updateLessonProgress(lessonId, progress, completed) {
  return this.request(`/lesson/progress/${lessonId}`, {
    method: "POST",
    body: JSON.stringify({ progress, completed }),
  });
}

async getLessonStatus(lessonId) {
  return this.request(`/lesson/${lessonId}/status`);
}

async getCompletedLessons(courseId) {
  return this.request(`/lesson/completed/course/${courseId}`);
}

async getCertificate(courseId) {
  return this.request(`/courses/${courseId}/certificate`);
}

  // Users
  async getUsers() {
    return this.request('/users');
  }

  async createInstructor(data) {
    return this.request('/users/instructor', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateUser(id, data) {
    return this.request(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteUser(id) {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }



  //cart
async createOrder(data) {
  return this.request("/payment/create-order", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
async freeCheckout(courses) {
  return this.request("/payment/free-checkout", {
    method: "POST",
    body: JSON.stringify({
      courses,
    }),
  });
}
async verifyPayment(data) {
  return this.request("/payment/verify", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
}

export const apiClient = new ApiClient();
