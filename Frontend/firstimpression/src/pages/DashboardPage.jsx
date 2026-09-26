import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import DashboardLayout from "../components/dashboard/DashboardLayout";

import MyResumesTab from "./MyResumes";
import TemplatesTab from "./Templates";
import AtsScoreTab from "./ATSScore";

import { jobApi } from "../services/jobApi";
import { routes } from "../routes/routes";

const DashboardPage = ({ initialTab }) => {
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);

  const getInitialTab = () => {
    if (location.pathname === routes.TEMPLATES || initialTab === "Templates") {
      return "Templates";
    }

    return location.state?.activeTab || "My Resumes";
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [dailyJob, setDailyJob] = useState(null);

  useEffect(() => {
    setActiveTab(getInitialTab());
  }, [location.pathname, location.state, initialTab]);

  useEffect(() => {
    jobApi.getDailyJob().then((data) => {
      if (data) {
        setDailyJob(data);
      }
    });
  }, []);

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
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="space-y-10 pb-16 pt-6">
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
  );
};

export default DashboardPage;
