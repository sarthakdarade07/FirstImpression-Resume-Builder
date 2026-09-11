import React, { useState, useEffect } from 'react';
import { Loader2, Plus, Trash2, Check } from 'lucide-react';

const ProfileLanguages = ({ languages = [], onSave, onDeleteModal }) => {
  const [items, setItems] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (languages && languages.length > 0) {
      setItems(languages.map(l => ({
        id: l.id || null,
        language: l.language || '',
        level: l.level || 'Fluent',
      })));
    } else {
      setItems([]);
    }
  }, [languages]);

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
        language: '',
        level: 'Fluent',
      },
    ]);
  };

  const handleRemove = (index) => {
    const item = items[index];
    onDeleteModal({
      title: 'Delete Language',
      message: `Are you sure you want to remove ${item.language || 'this language'}?`,
      onConfirm: async () => {
        setItems((prev) => prev.filter((_, i) => i !== index));
      },
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const payload = items
      .filter((l) => l.language.trim().length > 0)
      .map((item) => ({
        languageId: item.id || 0,
        language: item.language.trim(),
        level: item.level || 'Fluent',
      }));

    await onSave(payload);
    setIsSaving(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8 max-w-3xl">
        <h2 className="text-[1.7rem] font-bold text-gray-900 tracking-tight">Languages</h2>
        <button
          type="button"
          onClick={handleAddNew}
          className="px-5 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-full hover:bg-gray-800 transition-colors shadow-sm flex items-center gap-1.5"
        >
          <Plus size={16} />
          Add Language
        </button>
      </div>

      {items.length === 0 ? (
        <div className="max-w-3xl p-8 bg-gray-50 border border-gray-200/80 rounded-2xl text-center">
          <p className="text-gray-500 font-medium mb-4">No languages added yet.</p>
          <button
            type="button"
            onClick={handleAddNew}
            className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-full hover:bg-gray-50 transition-colors shadow-sm"
          >
            Add Your First Language
          </button>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map((lang, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-white p-2.5 rounded-2xl border border-gray-100 shadow-sm"
              >
                <input
                  type="text"
                  value={lang.language}
                  onChange={(e) => handleChange(index, 'language', e.target.value)}
                  placeholder="e.g. English, Spanish"
                  required
                  className="flex-1 px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--theme-red-start)] transition-all font-medium text-sm"
                />
                <select
                  value={lang.level}
                  onChange={(e) => handleChange(index, 'level', e.target.value)}
                  className="w-36 px-3 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--theme-red-start)] transition-all font-medium text-sm"
                >
                  <option value="Native / Bilingual">Native / Bilingual</option>
                  <option value="Fluent">Fluent</option>
                  <option value="Professional">Professional</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Elementary">Elementary</option>
                </select>
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="p-2.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors shrink-0"
                  title="Remove Language"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-gray-100">
            <button
              type="submit"
              disabled={isSaving}
              className="px-8 py-3 bg-gradient-to-r from-[var(--theme-red-start)] to-[var(--theme-red-end)] text-white text-sm font-bold rounded-full hover:shadow-lg hover:shadow-red-500/25 transition-all flex items-center gap-2 disabled:opacity-70"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {isSaving ? 'Saving...' : 'Save Languages'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProfileLanguages;
