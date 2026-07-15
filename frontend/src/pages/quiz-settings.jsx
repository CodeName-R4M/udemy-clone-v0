import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import Button from "../components/button";
import { apiClient } from "../client";
import {
  ArrowLeft,
  Settings2,
  ClipboardPaste,
  GripVertical,
  CircleCheckBig,
  ListChecks,
  Trophy,
  Clock3,
  Copy,
  Wand2,
  FilePlus2,
  HardDriveDownload,
  Loader2,
  Trash2,
} from "lucide-react";
import { toast } from "react-hot-toast";


const SortableQuestion = ({
  question,
  index,
  children,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: question.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
    >
      {children({
        attributes,
        listeners,
      })}
    </div>
  );
};
const QuizSettings = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [dirty, setDirty] = useState(false);

  const [quiz, setQuiz] = useState(null);

  const [questions, setQuestions] = useState([]);

  const [bulkText, setBulkText] = useState("");

  useEffect(() => {
    loadQuiz();
  }, []);

const loadQuiz = async () => {
  try {
    const data = await apiClient.getQuiz(courseId);

    setQuiz(data);
    setQuestions(data.questions ?? []);
  } catch (err) {
    setQuiz({
      passingScore: 70,
      attemptCooldown: 30,
      questions: [],
    });

    setQuestions([]);
  } finally {
    setLoading(false);
  }
};
const handleDragEnd = ({ active, over }) => {
  if (!over || active.id === over.id) return;

  setQuestions((items) => {
    const oldIndex = items.findIndex(
      (q) => q.id === active.id
    );

    const newIndex = items.findIndex(
      (q) => q.id === over.id
    );

    setDirty(true);

    return arrayMove(
      items,
      oldIndex,
      newIndex
    );
  });
};

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-lg font-semibold text-gray-600">
          Loading quiz...
        </div>
      </div>
    );
  }

const parseQuestions = () => {
  // Normalize: strip markdown bold/italic and carriage returns
  const text = bulkText
    .replace(/\r/g, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .trim();

  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const numberPrefixRegex = /^(?:Q(?:uestion)?\s*)?\d+[\.\)]\s*(.*)$/i;
  const optionRegex = /^\(?([A-Da-d])\)?[\.\):\-]\s*(.+)$/;
  const answerLetterRegex = /^(?:Correct\s*)?Answer[s]?\s*[:\-]?\s*\(?([A-Da-d])\)?\s*$/i;
  const answerTextRegex = /^(?:Correct\s*)?Answer[s]?\s*[:\-]?\s*(.+)$/i;

  const parsed = [];
  const warnings = [];

  let questionLines = [];
  let options = { A: "", B: "", C: "", D: "" };
  let correctAnswer = null;
  let sawOptions = false;

  const finalizeCurrent = () => {
    const question = questionLines.join(" ").trim();
    const hasAllOptions = options.A && options.B && options.C && options.D;

    if (question && hasAllOptions) {
      parsed.push({
        id: crypto.randomUUID(),
        question,
        optionA: options.A,
        optionB: options.B,
        optionC: options.C,
        optionD: options.D,
        correctAnswer: correctAnswer || "A",
      });
      if (!correctAnswer) {
        warnings.push(`"${question.slice(0, 40)}..." — no answer detected, defaulted to A`);
      }
    } else if (question || hasAllOptions) {
      warnings.push(`Skipped incomplete block near: "${(question || "?").slice(0, 40)}..."`);
    }

    // reset for next block
    questionLines = [];
    options = { A: "", B: "", C: "", D: "" };
    correctAnswer = null;
    sawOptions = false;
  };

  for (const rawLine of lines) {
    const numberedMatch = rawLine.match(numberPrefixRegex);
    const line = numberedMatch ? numberedMatch[1].trim() : rawLine;

    const optMatch = line.match(optionRegex);
    const ansLetterMatch = line.match(answerLetterRegex);

    if (optMatch) {
      sawOptions = true;
      const letter = optMatch[1].toUpperCase();
      options[letter] = optMatch[2].trim();
      continue;
    }

    if (ansLetterMatch) {
      correctAnswer = ansLetterMatch[1].toUpperCase();
      finalizeCurrent(); // Answer line = end of this question block
      continue;
    }

    const ansTextMatch = line.match(answerTextRegex);
    if (ansTextMatch && sawOptions) {
      const ansText = ansTextMatch[1].trim().toLowerCase();
      const foundLetter = Object.keys(options).find(
        (k) => options[k].trim().toLowerCase() === ansText
      );
      if (foundLetter) {
        correctAnswer = foundLetter;
        finalizeCurrent();
        continue;
      }
    }

    // Plain text line:
    // - if options already started, this is a stray line, ignore it
    // - otherwise it's part of the (multi-line) question
    if (!sawOptions) {
      questionLines.push(line);
    }
  }

  // Catch a trailing block with no explicit "Answer:" line
  if (questionLines.length > 0 || options.A || options.B || options.C || options.D) {
    finalizeCurrent();
  }

  if (parsed.length === 0) {
    toast.error("Couldn't parse any questions. Check the format and try again.");
    return;
  }

  setQuestions((prev) => [...prev, ...parsed]);
  setBulkText("");
  setDirty(true);

  if (warnings.length > 0) {
    toast.error(`${warnings.length} question(s) had issues — check answers/options.`, { duration: 5000 });
    console.warn("Parse warnings:", warnings);
  }

  toast.success(`${parsed.length} question(s) imported`);
};


  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
<div className="bg-gradient-to-r from-primary-red via-red-600 to-primary-blue text-white shadow-lg">
  <div className="max-w-7xl mx-auto px-6 py-10">

    <Button
      variant="outline"
      onClick={() => navigate(-1)}
      className="mb-8 bg-white/10 border-white/20 text-white hover:bg-white hover:text-gray-900"
    >
      <ArrowLeft size={18} className="mr-2" />
      Back to Course
    </Button>

    <div className="flex flex-col lg:flex-row justify-between items-start gap-12">

      {/* Left */}

      <div className="max-w-2xl">

        <div className="flex items-center gap-3">
          <Settings2 size={34} />
          <h1 className="text-4xl font-black">
            Quiz Settings
          </h1>
        </div>

        <p className="mt-5 text-white/80 leading-8 text-lg">
          Create and manage the final assessment for this course.
          Paste dozens of questions at once, edit them easily,
          then save everything in a single click.
        </p>

      </div>

      {/* Right Stats */}

      <div className="grid grid-cols-2 gap-5 w-[360px] shrink-0">

        {/* Questions */}

        <div className="rounded-2xl bg-white/10 backdrop-blur border border-white/20 p-5 h-40 flex flex-col justify-between">

          <div>
            <ListChecks className="w-6 h-6 text-white/80 mb-3" />

            <p className="text-sm text-white/70">
              Questions
            </p>
          </div>

          <h2 className="text-4xl font-black">
            {questions.length}
          </h2>

        </div>

        {/* Passing */}

        <div className="rounded-2xl bg-white/10 backdrop-blur border border-white/20 p-5 h-40 flex flex-col justify-between">

          <div>
            <Trophy className="w-6 h-6 text-white/80 mb-3" />

            <p className="text-sm text-white/70">
              Passing Score
            </p>
          </div>

          <input
            type="number"
            min={0}
            max={100}
            value={quiz?.passingScore ?? 70}
            onChange={(e) => {
              setQuiz({
                ...quiz,
                passingScore: Number(e.target.value),
              });
              setDirty(true);
            }}
            className="w-24 rounded-lg bg-white/20 border border-white/30 px-3 py-2 text-3xl font-bold text-white outline-none"
          />

        </div>

        {/* Cooldown */}

        <div className="rounded-2xl bg-white/10 backdrop-blur border border-white/20 p-5 h-40 flex flex-col justify-between">

          <div>
            <Clock3 className="w-6 h-6 text-white/80 mb-3" />

            <p className="text-sm text-white/70">
              Attempt Cooldown
            </p>
          </div>

          <div>
            <input
              type="number"
              min={1}
              value={quiz?.attemptCooldown ?? 30}
              onChange={(e) => {
                setQuiz({
                  ...quiz,
                  attemptCooldown: Number(e.target.value),
                });
                setDirty(true);
              }}
              className="w-24 rounded-lg bg-white/20 border border-white/30 px-3 py-2 text-3xl font-bold text-white outline-none"
            />

            <p className="mt-2 text-sm text-white/70">
              minutes
            </p>
          </div>

        </div>

        {/* Status */}

        <div className="rounded-2xl bg-white/10 backdrop-blur border border-white/20 p-5 h-40 flex flex-col justify-between">

          <div>
            <CircleCheckBig className="w-6 h-6 text-green-300 mb-3" />

            <p className="text-sm text-white/70">
              Status
            </p>
          </div>

          <div className="inline-flex w-fit items-center rounded-full bg-green-500/20 px-4 py-2 text-green-200 font-semibold">
            Ready
          </div>

        </div>

      </div>

    </div>

  </div>
</div>

      <div className="max-w-7xl mx-auto px-6 py-10"></div>
{/* Bulk Import */}
<div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">

  <div className="px-8 py-6 border-b bg-gradient-to-r from-blue-50 to-red-50 flex items-center justify-between">

    <div className="flex items-center gap-4">
      <div className="w-14 h-14 rounded-2xl bg-primary-blue/10 flex items-center justify-center">
        <ClipboardPaste className="w-7 h-7 text-primary-blue" />
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          Bulk Import Questions
        </h2>

        <p className="text-gray-500 mt-1">
          Paste questions generated by ChatGPT, Gemini, Word, PDFs or other sources.
        </p>
      </div>
    </div>
    
<Button
onClick={parseQuestions}
disabled={!bulkText.trim()}
>
    <Wand2 size={18} className="mr-2"/>
    Parse Questions
</Button>

  </div>

  <div className="p-8">

    <div className="grid lg:grid-cols-3 gap-8">

      {/* LEFT */}

      <div className="lg:col-span-2">

        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Paste Questions
        </label>

        <textarea
          rows={24}
          value={bulkText}
          onChange={(e) => setBulkText(e.target.value)}
          placeholder="Paste your questions here..."
          className="w-full rounded-2xl border border-gray-300 bg-gray-50 p-6 text-sm leading-7 resize-y outline-none focus:border-primary-blue focus:ring-4 focus:ring-primary-blue/20"
        />

      </div>

      {/* RIGHT */}

      <div>

        <div className="sticky top-6 rounded-2xl border border-blue-200 bg-blue-50 overflow-hidden">

          <div className="px-5 py-4 bg-white border-b flex justify-between items-center">

            <h3 className="font-bold text-primary-blue">
              Paste Template
            </h3>

            <Button
              size="sm"
              onClick={async () => {
                const template = `1. What is React?

A. Library

B. Framework

C. Database

D. Operating System

Answer: A


2. Which hook stores state?

A. useState

B. useEffect

C. useMemo

D. useRef

Answer: A`;

                await navigator.clipboard.writeText(template);
                toast.success("Template copied");
              }}
            >
    <Copy size={16} className="mr-2" />
    Copy Format
</Button>

          </div>

          <div className="p-5">

            <p className="text-sm text-gray-600 mb-4">
              Copy this format and replace it with your own questions.
            </p>

            <pre className="text-xs bg-white rounded-xl border p-4 overflow-auto leading-6">
{`1. What is React?

A. Library

B. Framework

C. Database

D. Operating System

Answer: A


2. Which hook stores state?

A. useState

B. useEffect

C. useMemo

D. useRef

Answer: A`}
            </pre>

          </div>

        </div>

      </div>

    </div>

  </div>

</div>
      <div className="mt-10"></div>

            {/* Questions */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">

        <div className="px-8 py-6 border-b flex items-center justify-between">

          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Questions
            </h2>

            <p className="text-gray-500 mt-1">
              Edit questions before saving them.
            </p>
          </div>

          <Button>
<FilePlus2 size={18}/>
            Add Question
          </Button>

        </div>

        <div className="p-8 space-y-8">

          {questions.length === 0 ? (

            <div className="rounded-2xl border-2 border-dashed border-gray-300 py-16 text-center">

              <ClipboardPaste
                size={54}
                className="mx-auto text-gray-400"
              />

              <h3 className="mt-5 text-xl font-semibold text-gray-700">
                No Questions Yet
              </h3>

              <p className="mt-2 text-gray-500">
                Paste questions above or create them manually.
              </p>

            </div>

          ) : (
<DndContext
  collisionDetection={closestCenter}
  onDragEnd={handleDragEnd}
>

<SortableContext
  items={questions.map((q) => q.id)}
  strategy={verticalListSortingStrategy}
>

{questions.map((question, index) => (

<SortableQuestion
  key={question.id}
  question={question}
  index={index}
>

{({attributes,listeners})=>(

<div className="rounded-3xl border bg-gray-50 p-7 shadow-sm">

                {/* Card Header */}

                <div className="flex justify-between items-center mb-6">

                  <div className="flex items-center gap-4">
                    
<GripVertical
  {...attributes}
  {...listeners}
  style={{
    touchAction: "none",
  }}
  className="text-gray-400 cursor-grab active:cursor-grabbing hover:text-primary-blue transition"
  size={22}
/>

                    <h3 className="text-xl font-bold">
                      Question {index + 1}
                    </h3>

                  </div>

                  <Button
  variant="outline"
  className="text-red-600 border-red-200 hover:bg-red-50"
  onClick={() => {
    setQuestions((prev) =>
      prev.filter((q) => q.id !== question.id)
    );
    setDirty(true);
  }}
>
  <Trash2 className="text-red-500 mr-2" />
  Delete
</Button>

                </div>

                {/* Question */}

                <div>

                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Question
                  </label>

                  <textarea
                    rows={3}
                    value={question.question}
                    onChange={(e) => {
                      const updated = [...questions];

                      updated[index].question =
                        e.target.value;

                      setQuestions(updated);
                      setDirty(true);
                    }}
                    className="w-full rounded-xl border border-gray-300 bg-white p-4 resize-none outline-none focus:ring-4 focus:ring-primary-blue/20 focus:border-primary-blue"
                  />

                </div>

                {/* Options */}

                <div className="grid md:grid-cols-2 gap-5 mt-8">

                  {["A", "B", "C", "D"].map((letter) => (

                    <div key={letter}>

                      <label className="block text-sm font-semibold mb-2 text-gray-700">
                        Option {letter}
                      </label>

                      <input
                        value={
                          question[
                            `option${letter}`
                          ]
                        }
                        onChange={(e) => {
                          const updated = [...questions];

                          updated[index][
                            `option${letter}`
                          ] = e.target.value;

                          setQuestions(updated);
                          setDirty(true);
                        }}
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-primary-blue/20 focus:border-primary-blue"
                      />

                    </div>

                  ))}

                </div>

                {/* Correct Answer */}

                <div className="mt-8">

                  <label className="block font-semibold text-gray-700 mb-3">
                    Correct Answer
                  </label>

                  <div className="flex gap-6">

                    {["A", "B", "C", "D"].map((letter) => (

                      <label
                        key={letter}
                        className="flex items-center gap-2 cursor-pointer"
                      >

                        <input
                          type="radio"
                          checked={
                            question.correctAnswer ===
                            letter
                          }
                          onChange={() => {
                            const updated = [...questions];

                            updated[index].correctAnswer =
                              letter;

                            setQuestions(updated);
                            setDirty(true);
                          }}
                        />

                        <span className="font-medium">
                          {letter}
                        </span>

                      </label>

                    ))}

                  </div>

                </div>

              </div>

)}

</SortableQuestion>

))
}
</SortableContext>

</DndContext>
          )}

        </div>

      </div>
            {/* Floating Save Bar */}
      {dirty && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">

          <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-5">

            <div>
              <h3 className="font-bold text-lg text-gray-800">
                Unsaved Changes
              </h3>

              <p className="text-sm text-gray-500">
                Your quiz has been modified. Save your changes before leaving.
              </p>
            </div>

            <div className="flex gap-3">

              <Button
                variant="outline"
                onClick={() => {
                  loadQuiz();
                  setDirty(false);
                }}
              >
                Discard Changes
              </Button>

<Button
  disabled={saving}
  onClick={async () => {
    setSaving(true);

    try {
await apiClient.updateQuiz(courseId, {
  passingScore: quiz?.passingScore ?? 70,
  attemptCooldown: quiz?.attemptCooldown ?? 30,
  questions: questions.map((q, index) => ({
    ...q,
    order: index,
  })),
});

      toast.success("Quiz saved successfully");

      setDirty(false);
      await loadQuiz();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save quiz");
    } finally {
      setSaving(false);
    }
  }}
>
  <HardDriveDownload size={18} />
  {saving ? "Saving..." : "Save All Changes"}
              </Button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default QuizSettings;