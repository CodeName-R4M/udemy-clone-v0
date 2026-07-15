import { useEffect, useState } from "react";
import Button from "./button";

const LessonPlayer = ({ lesson, onClose }) => {
const [videoUrl, setVideoUrl] = useState(null);

const embedUrl = lesson?.youtubeUrl
  ?.replace("watch?v=", "embed/")
  ?.replace("youtu.be/", "https://www.youtube.com/embed/");

useEffect(() => {

    if (!lesson?.videoFileId) {
        setVideoUrl(null);
        return;
    }

  let objectUrl = null;

  const loadVideo = async () => {
    try {
      const token = localStorage.getItem("token"); // use however you're storing your JWT

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/lesson/${lesson.id}/video`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to load video");
      }

      const blob = await response.blob();

      objectUrl = URL.createObjectURL(blob);

      setVideoUrl(objectUrl);
    } catch (err) {
      console.error(err);
    }
  };

  loadVideo();

  return () => {
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
    }
  };
}, [lesson]);

if (!lesson) {
  return null;
}
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-5">
          <h2 className="text-2xl font-bold">{lesson.title}</h2>

          <Button onClick={onClose}>
            Close
          </Button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-5">
          <p className="mb-5">{lesson.description}</p>

          {lesson.videoFileId && (
<video
  controls
  className="max-h-[65vh] w-full rounded-lg bg-black"
  src={videoUrl}
/>
          )}
          {lesson.youtubeUrl && (
            <div className="max-h-[65vh] w-full rounded-lg bg-black">
<iframe
  src={embedUrl}
  title={lesson.title}
  className="w-full h-[65vh] rounded-lg"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
/>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonPlayer;