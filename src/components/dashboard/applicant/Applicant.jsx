'use client';

import React, { useState } from 'react';
import useAxiosSecure from '@/hooks/useAxiosSecure';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { IoArrowForward } from 'react-icons/io5';
import { BiCheckCircle, BiCloudUpload, BiFile, BiCheck } from 'react-icons/bi';
import { GoLaw } from 'react-icons/go';

const Applicant = ({ user }) => {
  const router = useRouter();
  const axiosSecure = useAxiosSecure();

  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || user?.displayName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    jobTitle: user?.jobTitle || '',
    registrationNumber: user?.registrationNumber || '',
    idCardUrl: '',
    licenseDocUrl: '',
  });

  const [fileNames, setFileNames] = useState({
    idCard: '',
    licenseDoc: '',
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Convert File object to Base64 String for reliable transfer/storage
  const handleFileUpload = (e, fieldKey, nameKey) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be under 5MB.');
      return;
    }

    setFileNames((prev) => ({ ...prev, [nameKey]: file.name }));

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        [fieldKey]: reader.result,
      }));
      toast.success(`${file.name} attached successfully.`);
    };
    reader.readAsDataURL(file);
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.fullName || !formData.email || !formData.phone) {
        toast.error('Please fill in all mandatory personal info fields.');
        return;
      }
    }
    if (currentStep === 2) {
      if (!formData.jobTitle || !formData.registrationNumber) {
        toast.error('Please complete all credential fields.');
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.idCardUrl || !formData.licenseDocUrl) {
      toast.error('Please upload both required verification documents.');
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading('Submitting application...');

    try {
      const payload = {
        uid: user?.uid,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        jobTitle: formData.jobTitle,
        registrationNumber: formData.registrationNumber,
        idCardUrl: formData.idCardUrl,
        licenseDocUrl: formData.licenseDocUrl,
      };

      const res = await axiosSecure.patch('/api/users/application', payload);

      if (res.data?.success || res.status === 200) {
        toast.success('Application submitted successfully! Pending Admin review.', { id: toastId });
        router.push('/dashboard');
      } else {
        throw new Error(res.data?.error || 'Failed to submit application.');
      }
    } catch (err) {
      console.error('Submission Error:', err);
      toast.error(err?.response?.data?.error || err?.message || 'Failed to submit.', { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-[#1b1b1d]">
      {/* LexFlow Platform App Navbar */}
      <header className="w-full bg-[#080B1A] border-b border-slate-800 py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <GoLaw className="text-2xl text-white" />
          <span className="text-xl font-serif font-bold text-white tracking-wide">LexFlow</span>
          <span className="hidden sm:inline-block ml-3 px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase bg-slate-800 text-slate-300 rounded-full border border-slate-700">
            Caseworker Portal
          </span>
        </div>

        {user && (
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-slate-200">{user.displayName || user.fullName}</p>
              <p className="text-[10px] text-slate-400">{user.email}</p>
            </div>
            {user.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border border-slate-700 object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-[1200px] mx-auto py-10 px-4 sm:px-8 flex-1 flex flex-col items-center">
        {/* Page Title */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-serif font-bold text-[#080B1A]">Caseworker Onboarding Application</h1>
          <p className="text-sm text-slate-500 mt-1">Complete the steps below to request operational access to LexFlow.</p>
        </div>

        {/* Stepper Progress Bar */}
        <div className="w-full max-w-3xl mb-10">
          <div className="flex justify-between items-center relative">
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-slate-200 -z-10" />
            <div
              className="absolute top-1/2 left-0 h-[2px] bg-blue-600 -z-10 transition-all duration-300"
              style={{
                width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%',
              }}
            />

            {/* Step 1 */}
            <div className="flex flex-col items-center bg-[#F8FAFC] px-3">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center mb-1.5 font-semibold text-sm transition-colors ${
                  currentStep > 1
                    ? 'bg-blue-600 text-white'
                    : currentStep === 1
                    ? 'bg-[#080B1A] text-white ring-4 ring-blue-100'
                    : 'bg-white border-2 border-slate-300 text-slate-400'
                }`}
              >
                {currentStep > 1 ? <BiCheck className="text-xl" /> : '1'}
              </div>
              <span className={`text-[11px] font-bold tracking-wider uppercase ${currentStep >= 1 ? 'text-blue-600' : 'text-slate-400'}`}>
                Personal Info
              </span>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center bg-[#F8FAFC] px-3">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center mb-1.5 font-semibold text-sm transition-colors ${
                  currentStep > 2
                    ? 'bg-blue-600 text-white'
                    : currentStep === 2
                    ? 'bg-[#080B1A] text-white ring-4 ring-blue-100'
                    : 'bg-white border-2 border-slate-300 text-slate-400'
                }`}
              >
                {currentStep > 2 ? <BiCheck className="text-xl" /> : '2'}
              </div>
              <span className={`text-[11px] font-bold tracking-wider uppercase ${currentStep >= 2 ? 'text-[#080B1A]' : 'text-slate-400'}`}>
                Credentials
              </span>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center bg-[#F8FAFC] px-3">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center mb-1.5 font-semibold text-sm transition-colors ${
                  currentStep === 3
                    ? 'bg-[#080B1A] text-white ring-4 ring-blue-100'
                    : 'bg-white border-2 border-slate-300 text-slate-400'
                }`}
              >
                3
              </div>
              <span className={`text-[11px] font-bold tracking-wider uppercase ${currentStep === 3 ? 'text-[#080B1A]' : 'text-slate-400'}`}>
                Documents
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Card Container */}
        <div className="w-full max-w-3xl bg-white border border-slate-200 p-6 sm:p-10 rounded-2xl shadow-sm">
          {/* STEP 1: PERSONAL INFO */}
          {currentStep === 1 && (
            <div>
              <div className="mb-6 pb-4 border-b border-slate-200">
                <h2 className="text-xl font-bold text-[#080B1A]">Personal Details</h2>
                <p className="text-xs text-slate-500 mt-1">Verify your identity and business contact information.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5" htmlFor="fullName">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full border border-slate-300 bg-white text-slate-900 rounded-lg h-11 px-3.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Jane Doe, Esq."
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5" htmlFor="email">
                    Work Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full border border-slate-200 bg-slate-100 text-slate-500 rounded-lg h-11 px-3.5 text-sm focus:outline-none cursor-not-allowed"
                    id="email"
                    type="email"
                    value={formData.email}
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5" htmlFor="phone">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full border border-slate-300 bg-white text-slate-900 rounded-lg h-11 px-3.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5" htmlFor="address">
                    Office / Firm Address
                  </label>
                  <input
                    className="w-full border border-slate-300 bg-white text-slate-900 rounded-lg h-11 px-3.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    id="address"
                    type="text"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="123 Legal Chambers St, Suite 400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PROFESSIONAL CREDENTIALS */}
          {currentStep === 2 && (
            <div>
              <div className="mb-6 pb-4 border-b border-slate-200">
                <h2 className="text-xl font-bold text-[#080B1A]">Professional Credentials</h2>
                <p className="text-xs text-slate-500 mt-1">Provide your active registration number and practice role.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5" htmlFor="jobTitle">
                    Primary Role / Title <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full border border-slate-300 bg-white text-slate-900 rounded-lg h-11 px-3.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    id="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleInputChange}
                  >
                    <option value="">Select practice role</option>
                    <option value="Senior Partner">Senior Partner</option>
                    <option value="Associate Solicitor">Associate Solicitor</option>
                    <option value="Paralegal">Paralegal</option>
                    <option value="Barrister">Barrister</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5" htmlFor="registrationNumber">
                    SRA Registration Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full border border-slate-300 bg-white text-slate-900 rounded-lg h-11 px-3.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    id="registrationNumber"
                    type="text"
                    value={formData.registrationNumber}
                    onChange={handleInputChange}
                    placeholder="e.g. SRA-109283"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: DIRECT FILE UPLOADS */}
          {currentStep === 3 && (
            <div>
              <div className="mb-6 pb-4 border-b border-slate-200">
                <h2 className="text-xl font-bold text-[#080B1A]">Verification Documents</h2>
                <p className="text-xs text-slate-500 mt-1">Upload valid proof of identity and professional qualification (Max 5MB per file).</p>
              </div>

              <div className="space-y-6">
                {/* ID Upload Slot */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Government Issued ID (Passport / License) <span className="text-red-500">*</span>
                  </label>
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50/50 rounded-xl p-6 cursor-pointer transition-colors">
                    <BiCloudUpload className="text-3xl text-slate-400 mb-2" />
                    <span className="text-xs font-semibold text-slate-700">
                      {fileNames.idCard ? fileNames.idCard : 'Click to select ID Document'}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1">PNG, JPG, or PDF up to 5MB</span>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'idCardUrl', 'idCard')}
                    />
                  </label>
                </div>

                {/* License Document Upload Slot */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Legal Practice License / SRA Certificate <span className="text-red-500">*</span>
                  </label>
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50/50 rounded-xl p-6 cursor-pointer transition-colors">
                    <BiCloudUpload className="text-3xl text-slate-400 mb-2" />
                    <span className="text-xs font-semibold text-slate-700">
                      {fileNames.licenseDoc ? fileNames.licenseDoc : 'Click to select Practice Certificate'}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1">PNG, JPG, or PDF up to 5MB</span>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'licenseDocUrl', 'licenseDoc')}
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Controls Footer */}
          <div className="flex justify-between items-center pt-6 mt-8 border-t border-slate-200">
            <button
              className={`px-5 py-2.5 bg-white border border-slate-300 text-slate-800 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors ${
                currentStep === 1 ? 'opacity-40 cursor-not-allowed' : ''
              }`}
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              Back
            </button>

            {currentStep < 3 ? (
              <button
                className="px-6 py-2.5 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 transition-colors flex items-center shadow-sm"
                type="button"
                onClick={handleNext}
              >
                Continue to {currentStep === 1 ? 'Credentials' : 'Documents'}
                <IoArrowForward className="ml-2 text-sm" />
              </button>
            ) : (
              <button
                className="px-6 py-2.5 bg-[#080B1A] hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors flex items-center shadow-md disabled:opacity-50"
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? 'Submitting Application...' : 'Submit Application'}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Applicant;