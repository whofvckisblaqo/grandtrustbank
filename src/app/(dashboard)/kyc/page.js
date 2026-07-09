'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, CheckCircle, AlertCircle, IdCard } from 'lucide-react';

const ID_TYPES = [
  { value: 'passport', label: 'Passport' },
  { value: 'drivers_license', label: "Driver's License" },
  { value: 'national_id', label: 'National ID' },
];

async function uploadToCloudinary(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Upload failed');
  return data.secure_url;
}

export default function KycPage() {
  const router = useRouter();
  const [idType, setIdType] = useState('');
  const [frontFile, setFrontFile] = useState(null);
  const [backFile, setBackFile] = useState(null);
  const [frontPreview, setFrontPreview] = useState('');
  const [backPreview, setBackPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  function handleFile(e, side) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (side === 'front') {
      setFrontFile(file);
      setFrontPreview(URL.createObjectURL(file));
    } else {
      setBackFile(file);
      setBackPreview(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!idType) return setError('Please select an ID type');
    if (!frontFile || !backFile) return setError('Please upload both front and back images');

    setUploading(true);
    try {
      const [frontImageUrl, backImageUrl] = await Promise.all([
        uploadToCloudinary(frontFile),
        uploadToCloudinary(backFile),
      ]);

      const res = await fetch('/api/user/kyc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idType, frontImageUrl, backImageUrl }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Submission failed');
        setUploading(false);
        return;
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setUploading(false);
    }
  }

  if (success) {
    return (
      <div className="glass-card rounded-3xl p-8 sm:p-10 text-center max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: 'rgba(0,224,184,0.12)', border: '1px solid rgba(0,224,184,0.3)' }}>
          <CheckCircle size={28} className="text-gtb-accent" />
        </div>
        <h2 className="text-xl font-black text-white mb-2">Submitted for Review</h2>
        <p className="text-gtb-subtle text-sm mb-6">
          Your identity documents have been received. This usually takes 1-2 business days to review.
        </p>
        <button onClick={() => router.push('/dashboard')} className="btn-primary w-full justify-center py-3">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-3xl p-8 sm:p-10 max-w-lg mx-auto">
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: 'rgba(0,224,184,0.12)', border: '1px solid rgba(0,224,184,0.3)' }}>
          <IdCard size={24} className="text-gtb-accent" />
        </div>
        <h1 className="text-2xl font-black text-white mb-1">Verify Your Identity</h1>
        <p className="text-gtb-subtle text-sm">Upload a valid ID to unlock full account access</p>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl mb-6 badge-danger">
          <AlertCircle size={16} className="shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gtb-muted text-xs mb-2 uppercase tracking-wider font-medium">ID Type</label>
          <select
            value={idType}
            onChange={(e) => setIdType(e.target.value)}
            className="input-dark w-full py-3"
            style={{ color: '#ffffff' }}
          >
            <option value="" style={{ color: '#000' }}>Select ID type</option>
            {ID_TYPES.map((t) => (
              <option key={t.value} value={t.value} style={{ color: '#000' }}>{t.label}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gtb-muted text-xs mb-2 uppercase tracking-wider font-medium">Front Side</label>
            <label className="flex flex-col items-center justify-center border border-dashed border-white/20 rounded-xl h-32 cursor-pointer hover:border-gtb-accent transition-colors overflow-hidden">
              {frontPreview ? (
                <img src={frontPreview} alt="Front preview" className="w-full h-full object-cover" />
              ) : (
                <>
                  <Upload size={20} className="text-gtb-muted mb-1" />
                  <span className="text-gtb-muted text-xs">Upload front</span>
                </>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e, 'front')} />
            </label>
          </div>
          <div>
            <label className="block text-gtb-muted text-xs mb-2 uppercase tracking-wider font-medium">Back Side</label>
            <label className="flex flex-col items-center justify-center border border-dashed border-white/20 rounded-xl h-32 cursor-pointer hover:border-gtb-accent transition-colors overflow-hidden">
              {backPreview ? (
                <img src={backPreview} alt="Back preview" className="w-full h-full object-cover" />
              ) : (
                <>
                  <Upload size={20} className="text-gtb-muted mb-1" />
                  <span className="text-gtb-muted text-xs">Upload back</span>
                </>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e, 'back')} />
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="btn-primary w-full justify-center py-3.5 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-gtb-dark/30 border-t-gtb-dark rounded-full animate-spin" />
              Uploading...
            </span>
          ) : (
            'Submit for Verification'
          )}
        </button>
      </form>
    </div>
  );
}