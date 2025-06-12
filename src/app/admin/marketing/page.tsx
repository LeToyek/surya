// src/app/admin/marketing/page.tsx
'use client';
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, XCircle, CheckCircle, Link2, Send } from 'lucide-react';

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

const MarketingPage = () => {
  const [templateFile, setTemplateFile] = useState<File | null>(null);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // We only want the first file, specifically a PPT or PPTX file.
    const file = acceptedFiles[0];
    if (file && (file.type === 'application/vnd.ms-powerpoint' || file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation')) {
      setTemplateFile(file);
      setStatus('idle');
      setErrorMessage('');
    } else {
      setErrorMessage('Invalid file type. Please upload a .ppt or .pptx file.');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, isFocused } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
    },
    maxFiles: 1,
  });

  const handleRemoveFile = () => {
    setTemplateFile(null);
    setStatus('idle');
  };

  const handleSubmit = async () => {
    if (!templateFile || !webhookUrl) {
      setErrorMessage('Please provide a template file and a webhook URL.');
      return;
    }
    if (!webhookUrl.startsWith('http://') && !webhookUrl.startsWith('https://')) {
        setErrorMessage('Please enter a valid webhook URL (must start with http:// or https://).');
        return;
    }

    setStatus('uploading');
    setErrorMessage('');

    // We use FormData to send the file to the webhook.
    // n8n can receive binary files this way.
    const formData = new FormData();
    formData.append('file', templateFile); // The key 'file' can be used in n8n to reference the uploaded data.

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        // Try to get error message from n8n if available
        const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred.' }));
        throw new Error(`Webhook failed with status ${response.status}: ${errorData.message}`);
      }
      
      setStatus('success');
    } catch (error) {
      console.error('Webhook submission error:', error);
      setStatus('error');
      setErrorMessage(error || 'Failed to send data to the webhook.');
    }
  };
  
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <header>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Email Marketing Campaign</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">Upload a base PPT portfolio to be used in your n8n email blasting workflow.</p>
      </header>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg space-y-6">
        {/* --- Step 1: Upload Template --- */}
        <div>
          <h2 className="text-xl font-semibold mb-3">1. Upload Base Portfolio Template</h2>
          <div
            {...getRootProps()}
            className={`p-10 border-2 border-dashed rounded-xl text-center cursor-pointer transition-colors duration-300 
            ${isDragActive || isFocused ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/50' : 'border-gray-300 dark:border-gray-600 hover:border-sky-400 dark:hover:border-sky-500'}`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
              <UploadCloud className="w-12 h-12 mb-3 text-gray-400 dark:text-gray-500" />
              {isDragActive ? (
                <p className="text-lg font-semibold text-sky-600">Drop the file here ...</p>
              ) : (
                <p>Drag & drop your .ppt or .pptx file here, or <span className="font-semibold text-sky-600">click to select</span></p>
              )}
              <p className="text-xs mt-2">Maximum file size: 50MB</p>
            </div>
          </div>
        </div>

        {templateFile && (
          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-between transition-all animate-in fade-in duration-300">
            <div className="flex items-center space-x-3">
              <FileText className="w-6 h-6 text-sky-600 dark:text-sky-400 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm truncate">{templateFile.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{(templateFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <button onClick={handleRemoveFile} className="p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-800 text-red-500 transition-colors">
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* --- Step 2: Configure Webhook --- */}
        <div>
          <h2 className="text-xl font-semibold mb-3">2. Set n8n Webhook URL</h2>
          <div className="relative">
            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://your-n8n-instance.com/webhook/your-id"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-gray-700"
            />
          </div>
        </div>

        {/* --- Step 3: Send to n8n --- */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleSubmit}
            disabled={!templateFile || !webhookUrl || status === 'uploading'}
            className="w-full flex items-center justify-center py-3 px-6 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-lg shadow-md hover:from-sky-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-102"
          >
            {status === 'uploading' ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending to n8n...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Send Template to Workflow
              </>
            )}
          </button>
        </div>
        
        {/* --- Status Messages --- */}
        {(errorMessage || status === 'success') && (
          <div className={`p-4 rounded-lg text-sm mt-4 text-center transition-all duration-300 animate-in fade-in
            ${status === 'success' ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300' : ''}
            ${status === 'error' ? 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300' : ''}
          `}>
             {status === 'success' && <div className="flex items-center justify-center"><CheckCircle className="w-5 h-5 mr-2"/>Successfully sent portfolio template to your n8n workflow!</div>}
             {status === 'error' && <div className="flex items-center justify-center"><XCircle className="w-5 h-5 mr-2"/>{errorMessage}</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketingPage;
