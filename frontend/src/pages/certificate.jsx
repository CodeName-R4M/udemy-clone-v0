import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Award, Download } from "lucide-react";
import { apiClient } from "../client";
import { useAuth } from "../contexts/AuthContext";

export default function CertificatePage() {
  const { courseId } = useParams();
const { user, refetchUser } = useAuth();
  const navigate = useNavigate();
  const [certificateData, setCertificateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  
const loadCertificate = async () => {
  try {
    setLoading(true);

    await refetchUser();

    const [progress, quiz] = await Promise.all([
      apiClient.getLessonProgress(courseId),
      apiClient.getQuiz(courseId),
    ]);

    // All lessons must be completed
    if (progress.completed !== progress.total) {
      throw new Error(
        "Complete all course lessons before accessing your certificate."
      );
    }

    // Quiz must be passed
    if (!quiz.passed) {
      throw new Error(
        "You must pass the final quiz before accessing your certificate."
      );
    }

    const data = await apiClient.getCertificate(courseId);

    setCertificateData(data);
  } catch (err) {
    setError(
      err?.message ||
        "You are not eligible to access this certificate."
    );
  } finally {
    setLoading(false);
  }
};

  loadCertificate();
}, [courseId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-red-500 text-center mb-4">
          <h2 className="text-2xl font-bold mb-2">Oops!</h2>
          <p>{error}</p>
        </div>
        <Link to="/my-learning" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
          <ArrowLeft size={18} />
          Back to My Learning
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link to="/my-learning" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft size={18} />
            Back to My Learning
          </Link>
        </div>

        {/* Printable Certificate Container */}
        <div id="certificate-container" className="bg-white shadow-2xl rounded-xl overflow-hidden border-4 border-yellow-500">
          {/* Certificate Header */}
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-8 text-center">
            <Award size={64} className="mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold tracking-wider mb-2">
              CERTIFICATE OF COMPLETION
            </h1>
            <p className="text-lg md:text-xl opacity-90">
              Congratulations on your achievement!
            </p>
          </div>

          {/* Certificate Body */}
          <div className="p-8 md:p-12 text-center">
            <p className="text-xl md:text-2xl text-gray-600 mb-2">This certificate is awarded to</p>
            
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 py-4">
              {user?.name || "Learner"}
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-2">for successfully completing the course</p>
            
            <h3 className="text-2xl md:text-4xl font-semibold text-gray-800 mb-8 py-2">
              "{certificateData?.course?.title}"
            </h3>

            {/* Date */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-gray-500">Date Issued</p>
              <p className="text-xl font-medium text-gray-800">
                {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Certificate Footer */}
          <div className="bg-gray-50 p-6 flex justify-between items-center border-t border-gray-200">
            <div className="text-sm text-gray-500">
              <p>Powered by LMS Platform</p>
            </div>
            <div className="text-right text-sm text-gray-500">
              <p>Certificate ID: {certificateData?.course?.id}-{Date.now().toString(36)}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons (not printable) */}
        <div className="mt-8 flex justify-center gap-4 no-print">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <Download size={20} />
            Download / Print Certificate
          </button>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          #certificate-container { box-shadow: none; border: none; }
        }
      `}</style>
    </div>
  );
}
