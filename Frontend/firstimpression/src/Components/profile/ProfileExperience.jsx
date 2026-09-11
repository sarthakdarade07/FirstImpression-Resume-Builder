import React, { useState, useEffect } from 'react';
import { Loader2, Plus, Trash2, Check } from 'lucide-react';

const ProfileExperience = ({ experience = [], onSave, onDeleteModal }) => {
  const [items, setItems] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch (e) {
      return '';
    }
  };

  useEffect(() => {
    if (experience && experience.length > 0) {
      setItems(experience.map(exp => ({
        id: exp.id || null,
        jobTitle: exp.jobTitle || '',
        companyName: exp.companyName || '',
        location: exp.location || '',
        joinDate: formatDateForInput(exp.joinDate),
        endDate: formatDateForInput(exp.endDate),
        description: exp.description || '',
        technologies: exp.technologies ? exp.technologies.join(', ') : '',
      })));
    } else {
      setItems([]);
    }
  }, [experience]);

  const handleChange = (index, field, value) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAddNew = () => {
    setItems((prev) => [
      ...prev,
      {
        id: null,
        jobTitle: '',
        companyName: '',
        location: '',
        joinDate: '',
        endDate: '',
        description: '',
        technologies: '',
      },
    ]);
  };

  const handleRemove = (index) => {
    const item = items[index];
    onDeleteModal({
      title: 'Delete Experience Entry',
      message: `Are you sure you want to remove ${item.jobTitle || 'this position'} at ${item.companyName || 'this company'}?`,
      onConfirm: async () => {
        setItems((prev) => prev.filter((_, i) => i !== index));
      },
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const payload = items.map((item) => ({
      workExperienceId: item.id || 0,
      jobTitle: item.jobTitle,
      companyName: item.companyName,
      location: item.location,
      joinDate: item.joinDate || null,
      endDate: item.endDate || null,
      description: item.description,
      technologies: item.technologies
        ? item.technologies.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
    }));

    await onSave(payload);
    setIsSaving(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8 max-w-3xl">
        <h2 className="text-[1.7rem] font-bold text-gray-900 tracking-tight">Experience</h2>
        <button
          type="button"
          onClick={handleAddNew}
          className="px-5 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-full hover:bg-gray-800 transition-colors shadow-sm flex items-center gap-1.5"
        >
          <Plus size={16} />
          Add Experience
        </button>
      </div>

      {items.length === 0 ? (
        <div className="max-w-3xl p-8 bg-gray-50 border border-gray-200/80 rounded-2xl text-center">
          <p className="text-gray-500 font-medium mb-4">No work experience records added yet.</p>
          <button
            type="button"
            onClick={handleAddNew}
            className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-full hover:bg-gray-50 transition-colors shadow-sm"
          >
            Add Your First Experience
          </button>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-10 max-w-3xl">
          {items.map((exp, index) => (
            <div key={index} className="space-y-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-gray-900">
                  Position #{index + 1} {exp.jobTitle && `• ${exp.jobTitle}`}
                </h3>
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="inline-flex items-center gap-1 text-red-500 hover:text-red-700 text-sm font-semibold p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Job Title</label>
                  <input
                    type="text"
                    value={exp.jobTitle}
                    onChange={(e) => handleChange(index, 'jobTitle', e.target.value)}
                    placeholder="e.g. Senior Frontend Engineer"
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--theme-red-start)] transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Company Name</label>
                  <input
                    type="text"
                    value={exp.companyName}
                    onChange={(e) => handleChange(index, 'companyName', e.target.value)}
                    placeholder="e.g. Google"
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--theme-red-start)] transition-all font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={exp.joinDate}
                    onChange={(e) => handleChange(index, 'joinDate', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--theme-red-start)] transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">End Date</label>
                  <input
                    type="date"
                    value={exp.endDate}
                    onChange={(e) => handleChange(index, 'endDate', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--theme-red-start)] transition-all font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Location</label>
                  <input
                    type="text"
                    value={exp.location}
                    onChange={(e) => handleChange(index, 'location', e.target.value)}
                    placeholder="e.g. San Francisco, CA / Remote"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--theme-red-start)] transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Technologies (comma separated)</label>
                  <input
                    type="text"
                    value={exp.technologies}
                    onChange={(e) => handleChange(index, 'technologies', e.target.value)}
                    placeholder="React, TypeScript, Redux, Node.js"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--theme-red-start)] transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Description / Achievements</label>
                <textarea
                  value={exp.description}
                  onChange={(e) => handleChange(index, 'description', e.target.value)}
                  rows={4}
                  placeholder="Describe your key responsibilities and accomplishments..."
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--theme-red-start)] transition-all font-medium resize-none"
                />
              </div>
            </div>
          ))}

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="px-8 py-3 bg-gradient-to-r from-[var(--theme-red-start)] to-[var(--theme-red-end)] text-white text-sm font-bold rounded-full hover:shadow-lg hover:shadow-red-500/25 transition-all flex items-center gap-2 disabled:opacity-70"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {isSaving ? 'Saving...' : 'Save Experience'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProfileExperience;
