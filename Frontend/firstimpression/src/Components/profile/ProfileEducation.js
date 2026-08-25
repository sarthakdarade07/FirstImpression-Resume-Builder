import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Loader2, Plus, Trash2, Check, GraduationCap } from 'lucide-react';

const ProfileEducation = ({
  education = [],
  educationTypes: propEduTypes,
  scoreTypes: propScoreTypes,
  onSave,
  onDeleteModal,
}) => {
  // Read from Redux store with prop fallback
  const reduxEduTypes = useSelector((state) => state.metadata?.educationTypes) || [];
  const reduxScoreTypes = useSelector((state) => state.metadata?.scoreTypes) || [];

  const educationTypes = (propEduTypes && propEduTypes.length > 0) ? propEduTypes : reduxEduTypes;
  const scoreTypes = (propScoreTypes && propScoreTypes.length > 0) ? propScoreTypes : reduxScoreTypes;

  const [items, setItems] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (education && education.length > 0) {
      setItems(
        education.map((e) => {
          let matchedEduId = e.educationTypeId;
          if (!matchedEduId && e.educationType) {
            const found = educationTypes.find(
              (t) => t.title.toLowerCase() === e.educationType.toLowerCase()
            );
            if (found) matchedEduId = found.id;
          }
          if (!matchedEduId && educationTypes.length > 0) {
            matchedEduId = educationTypes[0].id;
          }

          let matchedScoreId = e.scoreTypeId;
          if (!matchedScoreId && e.scoreType) {
            const found = scoreTypes.find(
              (s) => s.title.toLowerCase() === e.scoreType.toLowerCase()
            );
            if (found) matchedScoreId = found.id;
          }
          if (!matchedScoreId && scoreTypes.length > 0) {
            matchedScoreId = scoreTypes[0].id;
          }

          return {
            id: e.id || null,
            educationTypeId: matchedEduId || 1,
            educationType: e.educationType || '',
            instituteName: e.instituteName || '',
            scoreTypeId: matchedScoreId || 1,
            scoreType: e.scoreType || '',
            score: e.score !== null && e.score !== undefined ? e.score : '',
            startYear: e.startYear || '',
            endYear: e.endYear || '',
            boardOrUniversity: e.boardOrUniversity || '',
            specialization: e.specialization || '',
          };
        })
      );
    } else {
      setItems([]);
    }
  }, [education, educationTypes, scoreTypes]);

  const handleChange = (index, field, value) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleEducationTypeSelect = (index, selectedId) => {
    const matchedType = educationTypes.find((t) => t.id === parseInt(selectedId));
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        educationTypeId: parseInt(selectedId),
        educationType: matchedType ? matchedType.title : '',
      };
      return updated;
    });
  };

  const handleScoreTypeSelect = (index, selectedId) => {
    const matchedScore = scoreTypes.find((s) => s.id === parseInt(selectedId));
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        scoreTypeId: parseInt(selectedId),
        scoreType: matchedScore ? matchedScore.title : '',
      };
      return updated;
    });
  };

  const handleAddNew = () => {
    const defaultEduType = educationTypes.length > 0 ? educationTypes[0] : { id: 1, title: "Bachelor's Degree" };
    const defaultScoreType = scoreTypes.length > 0 ? scoreTypes[0] : { id: 1, title: 'CGPA' };

    setItems((prev) => [
      ...prev,
      {
        id: null,
        educationTypeId: defaultEduType.id,
        educationType: defaultEduType.title,
        instituteName: '',
        scoreTypeId: defaultScoreType.id,
        scoreType: defaultScoreType.title,
        score: '',
        startYear: '',
        endYear: '',
        boardOrUniversity: '',
        specialization: '',
      },
    ]);
  };

  const handleRemove = (index) => {
    const item = items[index];
    onDeleteModal({
      title: 'Delete Education Entry',
      message: `Are you sure you want to remove ${item.instituteName || 'this education record'}?`,
      onConfirm: async () => {
        setItems((prev) => prev.filter((_, i) => i !== index));
      },
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const payload = items.map((item) => ({
      educationId: item.id || 0,
      educationTypeId: parseInt(item.educationTypeId) || 1,
      instituteName: item.instituteName,
      scoreTypeId: parseInt(item.scoreTypeId) || 1,
      score: item.score ? parseFloat(item.score) : 0,
      startYear: item.startYear ? parseInt(item.startYear) : 0,
      endYear: item.endYear ? parseInt(item.endYear) : 0,
      boardOrUniversity: item.boardOrUniversity || '',
      specialization: item.specialization || '',
    }));

    await onSave(payload);
    setIsSaving(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8 max-w-3xl">
        <div>
          <h2 className="text-[1.7rem] font-bold text-gray-900 tracking-tight">Education</h2>
          <p className="text-sm text-gray-500 mt-1">Add your academic background, degrees, and institutions.</p>
        </div>
        <button
          type="button"
          onClick={handleAddNew}
          className="px-5 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-full hover:bg-gray-800 transition-colors shadow-sm flex items-center gap-1.5 shrink-0"
        >
          <Plus size={16} />
          Add Education
        </button>
      </div>

      {items.length === 0 ? (
        <div className="max-w-3xl p-10 bg-gray-50/80 border border-gray-200/80 rounded-3xl text-center flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-white border border-gray-200/80 flex items-center justify-center text-gray-400 mb-4 shadow-sm">
            <GraduationCap size={28} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">No education added yet</h3>
          <p className="text-gray-500 text-sm mb-6 max-w-sm">
            Add your degrees, schools, and academic achievements to showcase on your resumes.
          </p>
          <button
            type="button"
            onClick={handleAddNew}
            className="px-6 py-2.5 bg-white border border-gray-200 text-gray-800 text-sm font-bold rounded-full hover:bg-gray-50 transition-colors shadow-sm"
          >
            Add Your First Education
          </button>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-8 max-w-3xl">
          {items.map((edu, index) => (
            <div key={index} className="space-y-6 bg-white p-6 sm:p-7 rounded-3xl border border-gray-200/80 shadow-sm relative">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-xl bg-[var(--theme-red)]/10 text-[var(--theme-red)] flex items-center justify-center font-bold text-xs">
                    {index + 1}
                  </span>
                  <h3 className="text-base font-bold text-gray-900 truncate">
                    {edu.instituteName || `Education #${index + 1}`}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="inline-flex items-center gap-1.5 text-red-500 hover:text-red-700 text-sm font-semibold px-3 py-1.5 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <Trash2 size={15} />
                  Delete
                </button>
              </div>

              {/* Education Type Dropdown & Specialization */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Education Level / Degree</label>
                  <select
                    value={edu.educationTypeId || ''}
                    onChange={(e) => handleEducationTypeSelect(index, e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--theme-red-start)] transition-all font-medium text-sm cursor-pointer"
                  >
                    {educationTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Field of Study / Specialization</label>
                  <input
                    type="text"
                    value={edu.specialization}
                    onChange={(e) => handleChange(index, 'specialization', e.target.value)}
                    placeholder="e.g. Computer Science & Engineering"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--theme-red-start)] transition-all font-medium text-sm"
                  />
                </div>
              </div>

              {/* Institute Name & Board/University */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Institute / College / School Name</label>
                  <input
                    type="text"
                    value={edu.instituteName}
                    onChange={(e) => handleChange(index, 'instituteName', e.target.value)}
                    placeholder="e.g. Stanford University"
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--theme-red-start)] transition-all font-medium text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Board / Affiliated University</label>
                  <input
                    type="text"
                    value={edu.boardOrUniversity}
                    onChange={(e) => handleChange(index, 'boardOrUniversity', e.target.value)}
                    placeholder="e.g. State Board or University"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--theme-red-start)] transition-all font-medium text-sm"
                  />
                </div>
              </div>

              {/* Start Year & End Year */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Start Year</label>
                  <input
                    type="number"
                    value={edu.startYear}
                    onChange={(e) => handleChange(index, 'startYear', e.target.value)}
                    placeholder="e.g. 2020"
                    min="1950"
                    max="2099"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--theme-red-start)] transition-all font-medium text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">End Year (or Expected)</label>
                  <input
                    type="number"
                    value={edu.endYear}
                    onChange={(e) => handleChange(index, 'endYear', e.target.value)}
                    placeholder="e.g. 2024"
                    min="1950"
                    max="2099"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--theme-red-start)] transition-all font-medium text-sm"
                  />
                </div>
              </div>

              {/* Score Type Dropdown & Score Value */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Grading / Score Type</label>
                  <select
                    value={edu.scoreTypeId || ''}
                    onChange={(e) => handleScoreTypeSelect(index, e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--theme-red-start)] transition-all font-medium text-sm cursor-pointer"
                  >
                    {scoreTypes.map((score) => (
                      <option key={score.id} value={score.id}>
                        {score.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Score / Result Value</label>
                  <input
                    type="number"
                    step="0.01"
                    value={edu.score}
                    onChange={(e) => handleChange(index, 'score', e.target.value)}
                    placeholder={
                      edu.scoreTypeId === 1
                        ? 'e.g. 9.15 (CGPA)'
                        : edu.scoreTypeId === 2
                        ? 'e.g. 88.5 (%)'
                        : 'e.g. 3.85'
                    }
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--theme-red-start)] transition-all font-medium text-sm"
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="px-8 py-3.5 bg-gradient-to-r from-[var(--theme-red-start)] to-[var(--theme-red-end)] text-white text-sm font-bold rounded-full hover:shadow-lg hover:shadow-red-500/25 transition-all flex items-center gap-2 disabled:opacity-70"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {isSaving ? 'Saving...' : 'Save Education Details'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProfileEducation;