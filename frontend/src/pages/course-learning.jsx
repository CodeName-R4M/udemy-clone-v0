import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { apiClient } from "../client";
import Button from "../components/button";
import YouTube from "react-youtube";
import { useRef } from "react";
import { CheckCircle, Play, BookOpen, ArrowLeft, ArrowRight } from "lucide-react";
import { Trophy } from "lucide-react";
import {
  CircularProgressbarWithChildren,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const CourseLearning = () => {
const playerRef = useRef(null);
const [questionsEnabled, setQuestionsEnabled] = useState(true);
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
const [videoUrl, setVideoUrl] = useState(null);
const [quiz, setQuiz] = useState(null);
const [quizQuestions, setQuizQuestions] = useState([]);
const [showQuiz, setShowQuiz] = useState(false);
const [quizStage, setQuizStage] = useState("idle");
const [answers, setAnswers] = useState({});
const [quizResult, setQuizResult] = useState(null);
const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
const [submittingQuiz, setSubmittingQuiz] = useState(false);
const [quizError, setQuizError] = useState("");
const [openQuestionMenu, setOpenQuestionMenu] = useState(null);
const [replyingTo, setReplyingTo] = useState(null);
const [replyText, setReplyText] = useState("");
const [savingReply, setSavingReply] = useState(false);
const [editingQuestion, setEditingQuestion] = useState(null);
const [editedQuestion, setEditedQuestion] = useState("");
const [savingQuestion, setSavingQuestion] = useState(false);
const [courseQuestions, setCourseQuestions] = useState([]);
const [expandedLesson, setExpandedLesson] = useState(null);

  const loadCourseData = async () => {
    try {
const [courseData, enrolledCourses, user] = await Promise.all([
  apiClient.getCourse(courseId),
  apiClient.getMyEnrolledCourses().catch(() => []),
  apiClient.getCurrentUser(),
]);

      const isEnrolled = Boolean(
        courseData?.isEnrolled ||
          enrolledCourses.some((course) => course.id === courseId),
      );

      if (!isEnrolled) {
        navigate(`/courses/${courseId}`, { replace: true });
        return;
      }

 const [lessonsData, completedData, courseQuestionsData] =
  await Promise.all([
    apiClient.getLessons(courseId),
    apiClient.getCompletedLessons(courseId),
    apiClient.getCourseQuestions(courseId).catch(() => []),
  ]);

      setCourse(courseData);
      setCourseQuestions(courseQuestionsData);
      setCurrentUser(user);
      setLessons(lessonsData);
      setCompletedLessonIds(completedData);

      // Find the initial lesson: use the one from location state if available, otherwise first lesson
      const initialLessonId = location.state?.lessonId;
      const initialLesson = initialLessonId 
        ? lessonsData.find(l => l.id === initialLessonId) 
        : lessonsData[0];

      setCurrentLesson(initialLesson || null);

      if (initialLesson) {
        const lessonQuestions = await apiClient.getLessonQuestions(initialLesson.id).catch(() => []);
        setQuestions(lessonQuestions);
      }
    } catch (err) {
      console.error(err);
      navigate(`/courses/${courseId}`, { replace: true });
    }
    try {
const quizData = await apiClient.getQuiz(courseId);

setQuiz(quizData);
setQuizQuestions(quizData.questions || []);
} catch {
  setQuiz(null);
  setQuizQuestions([]);
}
  };

const getYoutubeVideoId = (url) => {
  try {
    const u = new URL(url);

    if (u.hostname.includes("youtu.be")) {
      return u.pathname.slice(1);
    }

    return u.searchParams.get("v");
  } catch {
    return null;
  }
};
useEffect(() => {
setCurrentQuestionIndex(0);
setQuizResult(null);
setAnswers({});
  loadCourseData();
}, [courseId, navigate]);
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [completedLessonIds, setCompletedLessonIds] = useState([]);
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState('');
  const [questionError, setQuestionError] = useState('');
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false);
const [currentUser, setCurrentUser] = useState(null);

const handleTimeUpdate = (e) => {
  const video = e.target;
  if (!video.duration || !currentLesson || isUpdatingProgress) return;

  const percent = (video.currentTime / video.duration) * 100;
  
  if (percent >= 80 && !completedLessonIds.includes(currentLesson.id)) {
    markLessonComplete(currentLesson.id);
  }
};
const markLessonComplete = async (lessonId) => {
  if (completedLessonIds.includes(lessonId)) return;

  setIsUpdatingProgress(true);

  try {
    await apiClient.updateLessonProgress(lessonId, 100, true);
    await loadCourseData();
  } catch (err) {
    console.error(err);
  } finally {
    setIsUpdatingProgress(false);
  }
};

const completedLessons = completedLessonIds.length;
const progress = lessons.length > 0 ? Math.round((completedLessons / lessons.length) * 100) : 0;
useEffect(() => {
  if (!currentLesson?.youtubeUrl) return;

  const interval = setInterval(() => {
    if (!playerRef.current || !currentLesson || isUpdatingProgress) return;

    const current = playerRef.current.getCurrentTime();
    const duration = playerRef.current.getDuration();

    if (!duration) return;

    const percent = (current / duration) * 100;

    if (
      percent >= 80 &&
      !completedLessonIds.includes(currentLesson.id)
    ) {
      markLessonComplete(currentLesson.id);
    }
  }, 1000);

  return () => clearInterval(interval);
}, [currentLesson, completedLessonIds, isUpdatingProgress]);

const currentIndex = lessons.findIndex(
  (lesson) => lesson.id === currentLesson?.id
);


const handleQuestionSubmit = async (e) => {
  e.preventDefault();

  if (!currentLesson || !questionText.trim()) {
    setQuestionError('Type a question before sending it.');
    return;
  }

  setIsSubmittingQuestion(true);
  setQuestionError('');

  try {
    await apiClient.createLessonQuestion(currentLesson.id, {
      question: questionText.trim(),
    });

    const nextQuestions = await apiClient.getLessonQuestions(currentLesson.id).catch(() => []);
    setQuestions(nextQuestions);
    setQuestionText('');
  } catch (error) {
    setQuestionError(error?.message || 'Unable to submit your question right now.');
  } finally {
    setIsSubmittingQuestion(false);
  }
};

const handleReplySave = async (questionId) => {
  if (!replyText.trim()) return;

  const question = questions.find(q => q.id === questionId);
  const hasExistingAnswer = !!question?.answer;

  try {
    setSavingReply(true);

    if (hasExistingAnswer) {
      await apiClient.updateLessonAnswer(
        questionId,
        replyText.trim(),
      );
    } else {
      await apiClient.answerLessonQuestion(
        questionId,
        replyText.trim(),
      );
    }

    const updatedQuestions =
      await apiClient.getLessonQuestions(
        currentLesson.id,
      );

    setQuestions(updatedQuestions);
console.log(updatedQuestions);
    setReplyingTo(null);
    setReplyText("");
  } catch (err) {
    console.error(err);
    alert("Unable to save reply.");
  } finally {
    setSavingReply(false);
  }
};

const handleQuestionEdit = async (questionId) => {
  if (!editedQuestion.trim()) return;

  try {
    setSavingQuestion(true);

    await apiClient.updateLessonQuestion(
      questionId,
      editedQuestion.trim(),
    );

    const updatedQuestions =
      await apiClient.getLessonQuestions(
        currentLesson.id,
      );

    setQuestions(updatedQuestions);

    setEditingQuestion(null);
    setEditedQuestion("");
  } finally {
    setSavingQuestion(false);
  }
};

const handleDeleteQuestion = async (questionId) => {
  if (!window.confirm("Delete this question?")) {
    return;
  }

  try {
    await apiClient.deleteLessonQuestion(questionId);

    const updatedQuestions =
      await apiClient.getLessonQuestions(
        currentLesson.id,
      );

    setQuestions(updatedQuestions);
    setOpenQuestionMenu(null);
  } catch (err) {
    console.error(err);
    alert("Unable to delete question.");
  }
};

const submitQuiz = async () => {
  try {
    setSubmittingQuiz(true);
    const result = await apiClient.submitQuiz(courseId, {
      answers,
    });

    setQuizResult(result);
    setSubmittingQuiz(false);

    if (result.passed) {
      await loadCourseData();
    }
  } catch (err) {
    console.error(err);
    setSubmittingQuiz(false);
  }
};

useEffect(() => {
  const loadQuestionsForLesson = async () => {
    if (!currentLesson?.id) {
      setQuestions([]);
      setQuestionsEnabled(false);
      return;
    }

    try {
      const lessonQuestions = await apiClient.getLessonQuestions(currentLesson.id);
      setQuestions(lessonQuestions);
      setQuestionsEnabled(true);
    } catch (err) {
      if (err.message.includes("404")) {
        setQuestions([]);
        setQuestionsEnabled(false);
      } else {
        console.error(err);
      }
    }
  };

  loadQuestionsForLesson();
}, [currentLesson?.id]);


useEffect(() => {
  if (!currentLesson?.videoFileId) {
    setVideoUrl(null);
    return;
  }

  let objectUrl;

  const loadVideo = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/lesson/${currentLesson.id}/video`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        console.error(await response.text());
        return;
      }

      const blob = await response.blob();

      objectUrl = URL.createObjectURL(blob);

      setVideoUrl(objectUrl);
    } catch (e) {
      console.error(e);
    }
  };

  loadVideo();

  return () => {
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
    }
  };
}, [currentLesson]);

const question = quizQuestions[currentQuestionIndex] ?? null;

const review =
  question && quizResult?.results
    ? quizResult.results.find(
        r => r.questionId === question.id
      )
    : null;
  const quizRunning = quizStage === "taking" && !quizResult;
  useEffect(() => {
  if (!quizRunning) return;

  const handler = (e) => {
    e.preventDefault();
    e.returnValue = "";
  };

  window.addEventListener("beforeunload", handler);

  return () =>
    window.removeEventListener("beforeunload", handler);
}, [quizRunning]);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }
const getLessonQuestionCount = (lessonId) =>
  
  courseQuestions.filter(
    (q) => q.lessonId === lessonId
  ).length;
const getQuestionsForLesson = (lessonId) =>
  courseQuestions.filter(
    (q) => q.lessonId === lessonId
  );
  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}

      <div className="bg-gradient-to-r
from-red-700
via-red-600
to-blue-700 text-white shadow-lg">

        <div className="max-w-7xl mx-auto px-6 py-10">

          <Button
            variant="outline"
onClick={() => {
  if (quizRunning) {
    alert("Finish the quiz before leaving.");
    return;
  }

  navigate("/my-learning");
}}
            className="bg-white text-primary-red border-none"
          >
            <div className="flex items-center gap-2">
              <ArrowLeft size={18} />
              Back to My Learning
            </div>
          </Button>


<div className="flex items-start justify-between gap-8">
  <div>
    <h1
  onClick={() => navigate(`/courses/${courseId}`)}
  className="text-4xl font-black text-white cursor-pointer hover:underline transition"
>
  {course.title}
</h1>

    <p className="mt-2 text-white/90 text-lg">
      Continue learning at your own pace.
    </p>
  </div>

  <div className="flex items-center gap-4 shrink-0">
    <div className="text-right">
      <p className="text-white font-semibold text-lg">
        Progress
      </p>

      <p className="text-white/80 text-sm">
        {completedLessonIds.length} of {lessons.length} lessons
      </p>
    </div>

    <div className="w-20 h-20">
      <CircularProgressbarWithChildren
        value={progress}
        strokeWidth={10}
      >
        <span className="text-white font-bold text-lg">
          {progress}%
        </span>
      </CircularProgressbarWithChildren>
    </div>
  </div>
</div>


        </div>

      </div>

      {/* Main */}

      <div className="max-w-7xl mx-auto py-8 grid lg:grid-cols-4 gap-8">
        {/* Video Section (full width on mobile) */}
        <div className="lg:col-span-3 lg:px-6">
          {/* Full width video container on mobile */}
<div
  className={`overflow-hidden lg:rounded-t-2xl ${
    quizStage === "prep" || quizStage === "taking"
      ? "bg-white min-h-[750px]"
      : "bg-black aspect-video"
  }`}
>

{quizStage === "prep" ? (

  <div className="bg-white lg:rounded-t-2xl p-10 min-h-[500px] flex flex-col justify-center">

    <h1 className="text-4xl font-bold mb-4">
      Final Assessment
    </h1>

    <p className="text-gray-600 mb-8">
      You are about to begin the final assessment for this course.
      Once you press <strong>Start Quiz</strong>, your attempt will begin.
    </p>

    <div className="space-y-3 rounded-xl border bg-gray-50 p-6 mb-8">
      <p>
        <strong>Questions:</strong> {quizQuestions.length}
      </p>

      <p>
        <strong>Passing Score:</strong> {quiz?.passingScore ?? 70}%
      </p>

      <p>
        • Make sure you have a stable internet connection.
      </p>

      <p>
        • Read every question carefully.
      </p>

      <p>
        • Your timer will start once the quiz begins.
      </p>

      <p>
        • Do not refresh or leave the page.
      </p>
    </div>

    <div className="flex gap-4">

      <Button
        variant="outline"
        onClick={() => setQuizStage("idle")}
      >
        Back
      </Button>

      <Button
onClick={async () => {
  try {
    setQuizError("");

    await apiClient.startQuiz(courseId);

    setCurrentQuestionIndex(0);
    setAnswers({});
    setQuizResult(null);

    setQuizStage("taking");
  } catch (err) {
    setQuizError(err.message || "Unable to start quiz.");
  }
}}
      >
        Start Quiz
      </Button>
{quizError && (
  <p className="mt-4 text-red-600 font-medium">
    {quizError}
  </p>
)}
    </div>

  </div>

) : quizStage === "taking" ? (

<div className="bg-white lg:rounded-t-2xl p-8 min-h-[500px]">

  <h2 className="text-3xl font-bold mb-2">
    Final Quiz
  </h2>

  <p className="text-gray-500 mb-8">
    Answer all questions before submitting.
  </p>

  {quizQuestions.length === 0 ? (

    <div className="text-gray-500">
      No quiz available.
    </div>

  ) : (

    <div className="space-y-8">

<div
key={question.id}
className="rounded-xl border bg-white shadow-sm p-5"
>

          <h3 className="font-semibold text-lg mb-4">
            {currentQuestionIndex + 1}. {question.question}
          </h3>

          {["A", "B", "C", "D"].map((letter) => (

<label
  key={letter}
  className={`flex items-center gap-3 py-3 px-4 rounded-lg border transition ${
    quizResult
      ? review?.correctAnswer === letter
        ? "border-green-500 bg-green-50"
        : review?.selectedAnswer === letter
        ? "border-red-500 bg-red-50"
        : "border-gray-200"
      : "border-gray-200 hover:bg-gray-50 cursor-pointer"
  }`}
>

              <input
  disabled={!!quizResult}
                type="radio"
                name={question.id}
                checked={answers[question.id] === letter}
                onChange={() =>
                  setAnswers({
                    ...answers,
                    [question.id]: letter,
                  })
                }
              />

              {question[`option${letter}`]}

            </label>

          ))}
{quizResult && review && (

  <div className="mt-5 space-y-2">

    <p>
      <strong>Your Answer:</strong>{" "}
      {review.selectedAnswer ?? "Not Answered"}
    </p>

    <p>
      <strong>Correct Answer:</strong>{" "}
      {review.correctAnswer}
    </p>

    <p
      className={
        review.correct
          ? "text-green-600 font-semibold"
          : "text-red-600 font-semibold"
      }
    >
      {review.correct ? "Correct" : "Incorrect"}
    </p>

  </div>

)}
        </div>

<div className="flex justify-between items-center mt-8">

  <Button
    variant="outline"
    disabled={currentQuestionIndex === 0}
    onClick={() =>
      setCurrentQuestionIndex((i) => i - 1)
    }
  >
    Previous Question
  </Button>

  <span className="text-gray-500">
    Question {currentQuestionIndex + 1} of {quizQuestions.length}
  </span>

{quizResult ? (

  <Button
    disabled={currentQuestionIndex === quizQuestions.length - 1}
    onClick={() =>
      setCurrentQuestionIndex(i => i + 1)
    }
  >
    Next Question
  </Button>

) : currentQuestionIndex === quizQuestions.length - 1 ? (

  <Button
    onClick={submitQuiz}
    disabled={submittingQuiz}
  >
    {submittingQuiz ? "Submitting..." : "Submit Quiz"}
  </Button>

) : (

  <Button
    onClick={() =>
      setCurrentQuestionIndex(i => i + 1)
    }
  >
    Next Question
  </Button>

)}

</div>

      {quizResult && (

        <div
          className={`rounded-xl p-5 mt-6 ${
            quizResult.passed
              ? "bg-green-100 border border-green-300"
              : "bg-red-100 border border-red-300"
          }`}
        >

          <h3 className="font-bold text-lg">
            {quizResult.passed ? "Quiz Passed" : "Quiz Failed"}
          </h3>

          <p className="mt-2">
            Score: {quizResult.score}%
          </p>

          <p>
            Correct: {quizResult.correct}/{quizResult.total}
          </p>

        </div>

      )}

    </div>

  )}

</div>

) : (

<div className="bg-black aspect-video overflow-hidden lg:rounded-t-2xl">

  {currentLesson?.videoFileId ? (

    <video
      key={currentLesson.id}
      controls
      className="w-full h-full"
      src={videoUrl}
      onTimeUpdate={handleTimeUpdate}
    />

  ) : currentLesson?.youtubeUrl ? (

    <YouTube
      key={currentLesson.id}
      videoId={getYoutubeVideoId(currentLesson.youtubeUrl)}
      className="w-full h-full"
      iframeClassName="w-full h-full"
      onReady={(e) => {
        playerRef.current = e.target;
      }}
      opts={{
        width: "100%",
        height: "100%",
        playerVars: {
          autoplay: 1,
          rel: 0,
          modestbranding: 1,
          iv_load_policy: 3,
          playsinline: 1,
        },
      }}
    />

  ) : (

    <div className="text-white flex h-full items-center justify-center">
      No Video Available
    </div>

  )}

</div>

)}

</div>

          {/* Content below video (with padding) */}
          <div className="bg-white lg:rounded-b-2xl shadow overflow-hidden">
            <div className="p-6 lg:p-8">
              <h2 className="text-2xl lg:text-3xl font-bold">
                {currentLesson?.title}
              </h2>

              <p className="mt-4 text-gray-600 leading-7">
                {currentLesson?.description}
              </p>

              {/* Buttons */}
              <div className="flex justify-between mt-10">
                <Button
                  variant="outline"
                  disabled={currentIndex === 0}
                  onClick={() => {
                    if (currentIndex > 0) {
                      setCurrentLesson(lessons[currentIndex - 1]);
                    }
                  }}
                >
                  <div className="flex items-center gap-2">
                    <ArrowLeft size={18} />
                    Previous Lesson
                  </div>
                </Button>

                <Button
                  variant="outline"
                  disabled={currentIndex === lessons.length - 1}
                  onClick={() => {
                    if (currentIndex < lessons.length - 1) {
                      setCurrentLesson(lessons[currentIndex + 1]);
                    }
                  }}
                >
                  <div className="flex items-center gap-2">
                    Next Lesson
                    <ArrowRight size={18} />
                  </div>
                </Button>
              </div>

              <div className="mt-10 border-t pt-8">
<div className="flex items-center justify-between">
  <h3 className="text-xl font-bold text-gray-900">
    Lesson Q&A
  </h3>

  <span className="rounded-full bg-red-100 text-red-700 px-3 py-1 text-sm font-medium">
    {questions.length} Questions
  </span>
</div>
                <p className="text-sm text-gray-500 mt-1">Ask a question about this lesson and the instructor can answer it here.</p>



                <div className="mt-6 space-y-4">
                                    {questionError && <p className="text-sm text-red-600">{questionError}</p>}
                  {questions.length === 0 ? (
                    <div className="rounded-xl border border-dashed p-5 text-sm text-gray-500">
No questions have been asked for this lesson yet.

Be the first to ask one!
                    </div>
                  ) : (
                    questions.map((question) => {
  const isOwner =
    currentUser?.id === question.userId;

  const isInstructor =
    currentUser?.role === "admin" ||
    currentUser?.id === course.instructorId;

  return (
<div key={question.id} className="rounded-xl border bg-gray-50 p-4">

<div className="flex items-start justify-between mb-3">

<div>
  <p className="font-semibold text-gray-900">
    {question.userName}
  </p>

  <p className="text-xs text-gray-500">
    Student
  </p>
</div>

<div className="flex items-center gap-2">

  <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-semibold">
    QUESTION
  </span>

{(isOwner || isInstructor) && (

<div className="relative">
<button
  type="button"
  onClick={() =>
    setOpenQuestionMenu(
      openQuestionMenu === question.id
        ? null
        : question.id
    )
  }
  className="w-8 h-8 rounded-full hover:bg-gray-100 text-gray-500 text-lg"
>
  ⋮
</button>

{openQuestionMenu === question.id && (

<div className="absolute right-0 mt-2 w-48 rounded-lg border bg-white shadow-lg z-20">

{isInstructor ? (
  <>
<button
  className="w-full px-4 py-2 text-left hover:bg-gray-100"
  onClick={() => {
    setReplyingTo(question.id);
    setReplyText(question.answer ?? "");
    setOpenQuestionMenu(null);
  }}
>
  {question.answer ? "Edit Reply" : "Reply"}
</button>
<button
  className="w-full px-4 py-2 text-left hover:bg-gray-100"
  onClick={() => {
    setEditingQuestion(question.id);
    setEditedQuestion(question.question);
    setOpenQuestionMenu(null);
  }}
>
  Edit Question
</button>

<button
  className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50"
  onClick={() =>
    handleDeleteQuestion(question.id)
  }
>
  Delete Question
</button>
  </>
) : (
  <>
    <button className="w-full px-4 py-2 text-left hover:bg-gray-100" onClick={() => {
    setEditingQuestion(question.id);
    setEditedQuestion(question.question);
    setOpenQuestionMenu(null);
  }}>
      Edit Question
    </button>

    <button className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50" onClick={() => handleDeleteQuestion(question.id)}>
      Delete Question
    </button>
  </>
)}

</div>

)}

</div>
)}
</div>

</div>

{editingQuestion === question.id ? (

<div className="space-y-3">

<textarea
value={editedQuestion}
onChange={(e) =>
  setEditedQuestion(e.target.value)
}
rows={3}
className="w-full rounded-lg border border-gray-300 p-3"
/>

<div className="flex justify-end gap-2">

<Button
variant="outline"
onClick={() => {
  setEditingQuestion(null);
  setEditedQuestion("");
}}
>
Cancel
</Button>

<Button
onClick={() =>
  handleQuestionEdit(question.id)
}
disabled={savingQuestion}
>
{savingQuestion
  ? "Saving..."
  : "Save"}
</Button>

</div>

</div>

) : (
<>
<p className="font-semibold text-gray-900">
  {question.question}
</p>
{replyingTo === question.id ? (

<div className="mt-4 space-y-3">

<textarea
value={replyText}
onChange={(e) => setReplyText(e.target.value)}
rows={4}
className="w-full rounded-lg border border-gray-300 p-3"
/>

<div className="flex justify-end gap-2">

<Button
variant="outline"
onClick={() => {
setReplyingTo(null);
setReplyText("");
}}
>
Cancel
</Button>

<Button
onClick={() =>
  handleReplySave(question.id)
}
disabled={savingReply}
>
{savingReply
  ? "Saving..."
  : "Save Reply"}
</Button>

</div>

</div>

) : (

<div className="mt-4 rounded-lg bg-green-50 border border-green-200 p-4">

{question.answer ? (

<p className="text-sm text-gray-700">
{question.answer}
</p>

) : (

<span className="text-orange-600 font-medium">
Waiting for instructor reply...
</span>

)}

</div>
)}
</>
)}
</div>
  );
})
)}
      <div className="mt-8 rounded-xl border bg-white p-5 shadow-sm">

<h4 className="text-lg font-semibold mb-4">
Ask a Question
</h4>
                <form onSubmit={handleQuestionSubmit} className="mt-4 space-y-3">
                  <textarea
                    rows={3}
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    placeholder="Type your question about this lesson..."
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-red-500 focus:ring-4 focus:ring-red-100 outline-none"
                  />
                  <div className="flex justify-end">
                    <Button type="submit" className="w-full sm:w-auto" disabled={isSubmittingQuestion}>
                      {isSubmittingQuestion ? 'Posting...' : 'Ask Question'}
                    </Button>
                  </div>
                </form>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="px-6 lg:px-0">
          <div className="bg-white rounded-2xl shadow sticky top-24">

            <div className="border-b p-6">

              <h2 className="text-2xl font-bold">
                Course Content
              </h2>

              <p className="text-gray-500 mt-2">
                {lessons.length} Lessons
              </p>

            </div>

            <div className="divide-y">

              {lessons.map((lesson, index) => (

                <button
                  key={lesson.id}
onClick={() => {
  if (quizRunning) {
    alert("You cannot switch lessons during the quiz.");
    return;
  }

  setCurrentLesson(lesson);
}}
                  className={`w-full text-left p-5 transition
                    ${
                      currentLesson?.id === lesson.id
                        ? "bg-primary-blue text-white"
                        : "hover:bg-gray-50"
                    }`}
                >

                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {completedLessonIds.includes(lesson.id) ? (
                        <CheckCircle size={20} className="text-green-500" />
                      ) : currentLesson?.id === lesson.id ? (
                        <Play size={20} className="fill-current" />
                      ) : (
                        <BookOpen size={20} className="text-gray-400" />
                      )}
                    </div>

<div className="flex-1">

                      <h3 className="font-semibold">
                        Lesson {index + 1}
                      </h3>

                    </div>

                  </div>

                </button>

              ))}
<button
  disabled={completedLessonIds.length !== lessons.length || quizRunning}
  onClick={() => {
setQuizStage("prep");
  }}
  className={`w-full text-left p-5 border-t ${
    completedLessonIds.length === lessons.length
      ? "hover:bg-gray-50"
      : "bg-gray-100 opacity-60 cursor-not-allowed"
  }`}
>
  <div className="flex gap-3">
    <Trophy className="text-yellow-500" />
    <div>
      <h3 className="font-semibold">
        Final Quiz
      </h3>

      <p className="text-sm text-gray-500">
        Pass to unlock certificate
      </p>
    </div>
  </div>
</button>
{/* Certificate Section */}
{!quizRunning && lessons.length > 0 && (quizResult?.passed || course.quizPassed) ? (
  <button
    onClick={() => navigate(`/certificate/${courseId}`)}
    className="w-full text-left p-5 transition border-t hover:bg-gray-50"
  >
    <div className="flex items-start gap-3">
      <div className="mt-0.5">
        <Trophy
          size={20}
          className="text-yellow-500"
        />
      </div>

      <div>
        <h3 className="font-semibold">
          Course Certificate
        </h3>

        <p className="text-sm text-gray-500">
          Claim your certificate
        </p>
      </div>
    </div>
  </button>
) : (
  <button
    disabled
    className="w-full text-left p-5 transition border-t bg-gray-100 cursor-not-allowed opacity-70"
  >
    <div className="flex items-start gap-3">
      <div className="mt-0.5">
        <Trophy
          size={20}
          className="text-gray-400"
        />
      </div>

      <div>
        <h3 className="font-semibold">
          Course Certificate
        </h3>

        <p className="text-sm text-gray-500">
          Complete all lessons to unlock
        </p>
      </div>
    </div>
  </button>
)}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default CourseLearning;