// src/app/admin/marketing/page.tsx
"use client";
import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  FormEvent,
} from "react";
import { useDropzone } from "react-dropzone";
import { Toaster, toast } from "sonner";
import {
  UploadCloud,
  FileText,
  XCircle,
  Mail,
  Building2,
  RefreshCw,
  Database,
  Search,
  PlusCircle,
  X,
  SendHorizonal, // New Icon for Blast
  Sheet, // New Icon for Spreadsheet
  Type,
  MessageSquare,
  FileUp,
} from "lucide-react";

type UploadStatus = "idle" | "uploading";
type FilterStatus = "pending" | "sent";

interface EmailData {
  row_number: number;
  Email: string;
  CompanyName: string;
  sent_status: number; // 0 for pending, 1 for sent
}

const MarketingPage = () => {
  // Component State
  const [templateFile, setTemplateFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");

  // Data Table State
  const [allEmailData, setAllEmailData] = useState<EmailData[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [dataError, setDataError] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterStatus>("pending");
  const [searchTerm, setSearchTerm] = useState("");

  // Add New Email Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newCompanyName, setNewCompanyName] = useState("");
  const [modalError, setModalError] = useState("");
  const [isBlastModalOpen, setIsBlastModalOpen] = useState(false);

  const [blastSubject, setBlastSubject] = useState("");
  const [blastMessage, setBlastMessage] = useState("");

  const fetchAllEmailData = useCallback(async () => {
    setIsLoadingData(true);
    setDataError("");
    try {
      const response = await fetch(
        "https://n8n.molana.my.id/webhook/6b2cf0b8-5de9-4866-8efe-157eccfbe2f1",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ context: "get-all-emails" }),
        }
      );
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      const result = await response.json();
      if (result.status_code === 200) setAllEmailData(result.data || []);
      else throw new Error(result.message || "Failed to parse email data");
    } catch (error) {
      console.error("Error fetching all email data:", error);
      setDataError("Failed to load email data.");
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    fetchAllEmailData();
  }, [fetchAllEmailData]);

  const filteredEmailData = useMemo(() => {
    return allEmailData
      .filter((item) =>
        activeFilter === "pending"
          ? item.sent_status === 0
          : item.sent_status === 1
      )
      .filter((item) => {
        const search = searchTerm.toLowerCase();
        return (
          (item.Email?.toLowerCase() || "").includes(search) ||
          (item.CompanyName?.toLowerCase() || "").includes(search)
        );
      });
  }, [allEmailData, activeFilter, searchTerm]);

  const pendingEmailCount = useMemo(
    () => allEmailData.filter((item) => item.sent_status === 0).length,
    [allEmailData]
  );

  const handleAddNewEmail = async (e: FormEvent) => {
    e.preventDefault();
    setModalError("");

    if (!newEmail || !newCompanyName) {
      setModalError("Both email and company name are required.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(newEmail)) {
      setModalError("Please enter a valid email address.");
      return;
    }

    const promise = new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(
          "https://n8n.molana.my.id/webhook/6b2cf0b8-5de9-4866-8efe-157eccfbe2f1",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              context: "add-company-list",
              data: {
                email: newEmail,
                company_name: newCompanyName,
              },
            }),
          }
        );

        const result = await response.json();
        if (!response.ok || result.status_code !== 200) {
          throw new Error(result.message || "An unknown error occurred.");
        }

        setIsAddModalOpen(false);
        setNewEmail("");
        setNewCompanyName("");
        await fetchAllEmailData();
        setActiveFilter("pending");
        resolve(result);
      } catch (error) {
        setModalError("Failed to add email.");
        reject(error);
      }
    });

    toast.promise(promise, {
      loading: "Adding to queue...",
      success: `Email for "${newCompanyName}" has been added.`,
      error: (err) => err.message || "Failed to add email.",
    });
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (
      file &&
      (file.type === "application/vnd.ms-powerpoint" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.presentationml.presentation")
    ) {
      setTemplateFile(file);
      toast.success(`File "${file.name}" selected.`);
    } else {
      toast.error("Invalid file type. Please upload a .ppt or .pptx file.");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, isFocused } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.ms-powerpoint": [".ppt"],
      "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        [".pptx"],
    },
    maxFiles: 1,
  });

  const handleRemoveFile = () => {
    if (templateFile) {
      toast.info(`File "${templateFile.name}" removed.`);
    }
    setTemplateFile(null);
  };

  const handleBlastEmails = async (e: FormEvent) => {
    e.preventDefault();
    if (!blastSubject || !blastMessage) {
      toast.error("Subject and message cannot be empty.");
      return;
    }
    const toastId = toast.loading("Initiating email blast...");
    try {
      const response = await fetch(
        "https://n8n.molana.my.id/webhook/6b2cf0b8-5de9-4866-8efe-157eccfbe2f1",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            context: "blast-email",
            subject: blastSubject,
            message: blastMessage,
          }),
        }
      );
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Webhook initiation failed." }));
        throw new Error(errorData.message);
      }
      toast.success("Email blast initiated!", {
        id: toastId,
        description: `Sending ${pendingEmailCount} emails. You can refresh the list in a minute.`,
      });
      setIsBlastModalOpen(false);
      setBlastSubject("");
      setBlastMessage("");
    } catch (error) {
      console.error("Error during email blast:", error);
      toast.error("Failed to start the email blast.", {
        id: toastId,
      });
    }
  };

  const handleUploadTemplate = async () => {
    if (!templateFile) {
      toast.error("Please select a portfolio template file first.");
      return;
    }

    setUploadStatus("uploading");

    // Construct the FormData payload as per the new requirement
    const formData = new FormData();
    formData.append("context", "upload-ppt-template");
    formData.append("file", templateFile);
    formData.append("name", "PPT_TEMPLATE_SURYA");

    const promise = new Promise(async (resolve, reject) => {
      try {
        // Use the hardcoded base webhook URL
        const response = await fetch(
          "https://n8n.molana.my.id/webhook/6b2cf0b8-5de9-4866-8efe-157eccfbe2f1",
          {
            method: "POST",
            body: formData,
          }
        );
        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ message: "An unknown error occurred." }));
          throw new Error(`Upload failed: ${errorData.message}`);
        }
        // Optionally clear the file on successful upload
        setTemplateFile(null);
        resolve(response);
      } catch (error) {
        reject(error);
      } finally {
        setUploadStatus("idle");
      }
    });

    toast.promise(promise, {
      loading: "Uploading new portfolio template...",
      success: "Portfolio template updated successfully!",
      error: (err) => err.message || "Failed to upload template.",
    });
  };

  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md animate-in fade-in-0 duration-300"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in-0 zoom-in-95 slide-in-from-top-4 duration-500 ease-out"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Add New Email to Queue
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleAddNewEmail}>
              <div className="p-6 space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="email"
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="e.g., contact@company.com"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-gray-700"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="companyName"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                  >
                    Company Name
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="companyName"
                      type="text"
                      value={newCompanyName}
                      onChange={(e) => setNewCompanyName(e.target.value)}
                      placeholder="e.g., PT Maju Mundur"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-gray-700"
                      required
                    />
                  </div>
                </div>
                {modalError && (
                  <div className="p-3 text-sm bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg flex items-center gap-2">
                    <XCircle className="w-5 h-5 flex-shrink-0" />
                    {modalError}
                  </div>
                )}
              </div>
              <div className="flex justify-end items-center gap-4 p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 rounded-b-2xl">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-wait flex items-center justify-center"
                >
                  Add to Queue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isBlastModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md animate-in fade-in-0 duration-300"
          onClick={() => setIsBlastModalOpen(false)}
        >
          <div
            className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg animate-in fade-in-0 zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
              <h2 className="text-xl font-semibold">Compose Email Blast</h2>
              <button
                onClick={() => setIsBlastModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleBlastEmails}>
              <div className="p-6 space-y-5">
                <p className="text-sm text-center p-3 bg-blue-50 dark:bg-blue-900/50 rounded-lg">
                  This email will be sent to all{" "}
                  <strong className="text-blue-600">{pendingEmailCount}</strong>{" "}
                  pending recipients.
                </p>
                <div>
                  <label
                    htmlFor="blastSubject"
                    className="block text-sm font-medium mb-1.5"
                  >
                    Subject
                  </label>
                  <div className="relative">
                    <Type className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="blastSubject"
                      type="text"
                      value={blastSubject}
                      onChange={(e) => setBlastSubject(e.target.value)}
                      placeholder="Your email subject"
                      className="w-full pl-10 pr-4 py-2.5 border rounded-lg dark:bg-gray-700"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="blastMessage"
                    className="block text-sm font-medium mb-1.5"
                  >
                    Message
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <textarea
                      id="blastMessage"
                      value={blastMessage}
                      onChange={(e) => setBlastMessage(e.target.value)}
                      placeholder="Hi, this is a testing email..."
                      className="w-full pl-10 pr-4 py-2.5 border rounded-lg dark:bg-gray-700 h-36"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-4 p-6 bg-gray-50 dark:bg-gray-800/50 border-t rounded-b-2xl">
                <button
                  type="button"
                  onClick={() => setIsBlastModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-medium bg-white dark:bg-gray-700 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 flex items-center gap-2"
                >
                  <SendHorizonal className="w-5 h-5" />
                  Confirm & Send Blast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="space-y-8 max-w-7xl mx-auto p-4 md:p-6 mb-24">
        <header>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Email Marketing Campaign
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Manage, prepare, and execute your n8n-powered email campaigns.
          </p>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg h-full">
              <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
                <div className="flex items-center space-x-3">
                  <Database className="w-7 h-7 text-blue-600" />
                  <h2 className="text-xl font-semibold">Email Queue</h2>
                </div>
                <div className="flex items-center flex-wrap gap-2">
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <PlusCircle className="w-5 h-5" />
                    <span>Add</span>
                  </button>
                  <button
                    onClick={fetchAllEmailData}
                    disabled={isLoadingData}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${
                        isLoadingData ? "animate-spin" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by email or company..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-gray-700"
                  />
                </div>
                <div className="flex-shrink-0 grid grid-cols-2 gap-2 p-1 bg-gray-100 dark:bg-gray-900 rounded-lg">
                  <button
                    onClick={() => setActiveFilter("pending")}
                    className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
                      activeFilter === "pending"
                        ? "bg-white dark:bg-gray-700 text-blue-600 shadow"
                        : "text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50"
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => setActiveFilter("sent")}
                    className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
                      activeFilter === "sent"
                        ? "bg-white dark:bg-gray-700 text-green-600 shadow"
                        : "text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50"
                    }`}
                  >
                    Sent
                  </button>
                </div>
              </div>
              {/* BLAST BUTTON ADDED HERE */}

              {isLoadingData ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                  <span className="ml-3 text-gray-600 dark:text-gray-300">
                    Loading all email data...
                  </span>
                </div>
              ) : dataError ? (
                <div className="p-4 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg text-center">
                  <XCircle className="w-5 h-5 inline mr-2" /> {dataError}
                </div>
              ) : filteredEmailData.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="font-semibold">
                    No {searchTerm ? "matching" : ""} {activeFilter} emails
                    found.
                  </p>
                  {searchTerm && (
                    <p className="text-sm mt-1">Try adjusting your search.</p>
                  )}
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-4 px-2">
                    Showing{" "}
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {filteredEmailData.length}
                    </span>{" "}
                    results.
                  </div>
                  <div className="grid gap-3 max-h-[calc(100vh-20rem)] overflow-y-auto p-1">
                    {filteredEmailData.map((item, index) => (
                      <div
                        key={item.row_number}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-transparent hover:border-blue-500/50 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex items-center space-x-4 flex-1 min-w-0">
                          <div className="flex-shrink-0 w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-gray-600 dark:text-gray-300">
                              {index + 1}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
                              <span
                                className="font-medium text-gray-900 dark:text-white truncate"
                                title={item.Email}
                              >
                                {item.Email}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Building2 className="w-4 h-4 text-gray-500 flex-shrink-0" />
                              <span
                                className="text-sm text-gray-600 dark:text-gray-300 truncate"
                                title={item.CompanyName}
                              >
                                {item.CompanyName}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0 ml-4">
                          {item.sent_status === 0 ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                              Pending
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              Sent
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg ">
              <button
                onClick={() => setIsBlastModalOpen(true)}
                disabled={pendingEmailCount === 0 || isLoadingData}
                className="w-full cursor-pointer flex items-center justify-center space-x-3 px-4 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <SendHorizonal />
                <span className="text-lg">
                  Blast{" "}
                  {pendingEmailCount > 0
                    ? `${pendingEmailCount} Pending Email(s)`
                    : "Pending Emails"}
                </span>
              </button>
            </div>
          </div>
          <div className="lg:col-span-2 lg:sticky lg:top-6 self-start space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg space-y-6">
              {/* SPREADSHEET LINK ADDED HERE */}
              <div>
                <h2 className="text-xl font-semibold mb-3">Resources</h2>
                <a
                  href="https://docs.google.com/spreadsheets/d/1uicNZomW7xPi3iAFFDu_bM5QhJ4Gwc7RovMXJKQdHgw/edit?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <Sheet className="w-5 h-5 text-green-600" />
                  <span>View Data Spreadsheet</span>
                </a>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-3">
                  1. Upload Base Portfolio
                </h2>
                <div
                  {...getRootProps()}
                  className={`p-8 border-2 border-dashed rounded-xl text-center cursor-pointer ${
                    isDragActive || isFocused
                      ? "border-sky-500 bg-sky-50"
                      : "border-gray-300 hover:border-sky-400"
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <UploadCloud className="w-10 h-10 mb-3 text-gray-400" />
                    {isDragActive ? (
                      <p>Drop the file here...</p>
                    ) : (
                      <p>
                        Drag & drop or{" "}
                        <span className="font-semibold text-sky-600">
                          click to upload
                        </span>
                      </p>
                    )}
                    <p className="text-xs mt-2">.PPT or .PPTX, Max 50MB</p>
                  </div>
                </div>
              </div>
              {templateFile && (
                <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-between">
                  <div className="flex items-center space-x-3 min-w-0">
                    <FileText className="w-6 h-6 text-sky-600" />
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">
                        {templateFile.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(templateFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveFile}
                    className="p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-800 text-red-500"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              )}

              <div className="pt-4">
                <button
                  onClick={handleUploadTemplate}
                  disabled={!templateFile || uploadStatus === "uploading"}
                  className="w-full flex items-center justify-center py-3 px-6 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-lg shadow-md hover:from-sky-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploadStatus === "uploading" ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <FileUp className="w-5 h-5 mr-2" />
                      Set as New Template
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MarketingPage;
