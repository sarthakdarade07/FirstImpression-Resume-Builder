import React, { useState, useEffect } from 'react';
import { Loader2, Plus, Trash2, Check } from 'lucide-react';

const ProfileCertifications = ({ certifications = [], onSave, onDeleteModal }) => {
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
    if (certifications && certifications.length > 0) {
      setItems(certifications.map(cert => ({
        id: cert.id || null,
        title: cert.title || '',
        issuedBy: cert.issuedBy || '',
        issueDate: formatDateForInput(cert.issueDate),
        expiryDate: formatDateForInput(cert.expiryDate),
        url: cert.url || '',
      })));
    } else {
      setItems([]);
    }
  }, [certifications]);

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
        title: '',
        issuedBy: '',
        issueDate: '',
        expiryDate: '',
        url: '',
      },
    ]);
  };

  const handleRemove = (index) => {
    const item = items[index];
    onDeleteModal({
      title: 'Delete Certification',
      message: `Are you sure you want to remove ${item.title || 'this certification'}?`,
      onConfirm: async () => {
        setItems((prev) => prev.filter((_, i) => i !== index));
      },
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const payload = items.map((item) => ({
      certificationId: item.id || 0,
      title: item.title,
      issuedBy: item.issuedBy,
      issueDate: item.issueDate || null,
      expiryDate: item.expiryDate || null,
      url: item.url,
    }));

    await onSave(payload);
    setIsSaving(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8 max-w-3xl">
        <h2 className="text-[1.7rem] font-bold text-gray-900 tracking-tight">Certifications</h2>
        <button
          type="button"
          onClick={handleAddNew}
          className="px-5 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-full hover:bg-gray-800 transition-colors shadow-sm flex items-center gap-1.5"
        >
          <Plus size={16} />
          Add Certification
        </button>
      </div>

      {items.length === 0 ? (
        <div className="max-w-3xl p-8 bg-gray-50 border border-gray-200/80 rounded-2xl text-center">
          <p className="text-gray-500 font-medium mb-4">No certifications added yet.</p>
          <button
            type="button"
            onClick={handleAddNew}
            className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-full hover:bg-gray-50 transition-colors shadow-sm"
          >
            Add Your First Certification
          </button>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-10 max-w-3xl">
          {items.map((cert, index) => (
            <div key={index} className="space-y-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-gray-900">
                  Certification #{index + 1} {cert.title && `• ${cert.title}`}
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
                  <label className="block text-sm font-bold text-gray-900 mb-2">Certification Title</label>
                  <input
                    type="text"
                    value={cert.title}
                    onChange={(e) => handleChange(index, 'title', e.target.value)}
                    placeholder="e.g. AWS Certified Solutions Architect"
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--theme-red-start)] transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Issued By</label>
                  <input
                    type="text"
                    value={cert.issuedBy}
                    onChange={(e) => handleChange(index, 'issuedBy', e.target.value)}
                    placeholder="e.g. Amazon Web Services"
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--theme-red-start)] transition-all font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Issue Date</label>
                  <input
                    type="date"
                    value={cert.issueDate}
                    onChange={(e) => handleChange(index, 'issueDate', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--theme-red-start)] transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Expiry Date (Optional)</label>
                  <input
                    type="date"
                    value={cert.expiryDate}
                    onChange={(e) => handleChange(index, 'expiryDate', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--theme-red-start)] transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Credential URL / Verification Link</label>
                <input
                  type="url"
                  value={cert.url}
                  onChange={(e) => handleChange(index, 'url', e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--theme-red-start)] transition-all font-medium"
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
              {isSaving ? 'Saving...' : 'Save Certifications'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProfileCertifications;
