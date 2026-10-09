import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import DashboardLayout from "../components/dashboard/DashboardLayout";

import MyResumesTab from "./MyResumes";
import TemplatesTab from "./Templates";
import AtsScoreTab from "./ATSScore";

import { jobApi } from "../services/jobApi";
import { routes } from "../routes/routes";
import { fetchUserProfile } from "../redux/thunks/profileThunks";
import { AlertCircle, ArrowRight, X } from "lucide-react";
import { setProfile } from "../redux/slices/profileSlice";

const DashboardPage = ({ initialTab }) => {
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  const profile = useSelector((state) => state.profile.profile);
  const dispatch = useDispatch();

  const getInitialTab = () => {
    if (location.pathname === routes.TEMPLATES || initialTab === "Templates") {
      return "Templates";
    }

    return location.state?.activeTab || "My Resumes";
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [dailyJob, setDailyJob] = useState(null);
 
  const isProfile = Boolean(
    profile?.personalInformation || profile?.projects?.length > 0,
  );

  useEffect(() => {
    setActiveTab(getInitialTab());
  }, [location.pathname, location.state, initialTab]);

  // useEffect(() => {
  //   jobApi.getDailyJob().then((data) => {
  //     if (data) {
  //       setDailyJob(data);
  //     }
  //   });
  // }, []);



useEffect(() => {
dispatch(fetchUserProfile());
}, [dispatch]); 

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const greeting =
    new Date().getHours() < 12
      ? "morning"
      : new Date().getHours() < 18
        ? "afternoon"
        : "evening";

  return (
    <>
      <title>Dashboard | FirstImpression</title>

      <meta
        name="description"
        content="Manage your resumes, customize professional templates, check ATS scores, tailor resumes with AI, and create job-ready resumes with FirstImpression."
      />

      <meta name="robots" content="noindex, nofollow" />

      <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
        <div className="space-y-10 pb-16 pt-6">
          {isProfile === false && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl p-4 sm:p-5 mb-8 shadow-sm transition-all duration-300">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Icon + Message */}
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 bg-amber-100 text-amber-700 rounded-xl mt-0.5 sm:mt-0 flex-shrink-0">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">
                      Complete your profile details
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                      You haven't added your details yet. Fill in your
                      information so your resumes can be auto-generated in one
                      click!
                    </p>
                  </div>
                </div>
                {/* Action Buttons */}
                <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                  <Link
                    to={routes.PROFILE}
                    className="flex items-center gap-1.5 px-4 py-2 bg-theme-red hover:bg-theme-red/90 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-colors">
                    <span>Complete Profile</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-8">
            <div>
              <p className="text-theme-red font-semibold text-sm mb-2 tracking-wide uppercase">
                {currentDate}
              </p>

              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                Good {greeting},{" "}
                {user?.name ? user.name.split(" ")[0] : "Creator"}.
              </h1>

              <p className="text-gray-500 mt-2 text-lg">
                Here is what's happening with your job applications today.
              </p>
            </div>
          </div>

          {/* TAB CONTENT */}
          {activeTab === "My Resumes" && <MyResumesTab />}

          {activeTab === "Templates" && <TemplatesTab dailyJob={dailyJob} />}

          {activeTab === "ATS Score" && <AtsScoreTab />}
        </div>
      </DashboardLayout>
    </>
  );
};

export default DashboardPage;
