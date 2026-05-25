import React, { useState, useRef } from 'react';
import { Trip, TravelDocument } from '../types';
import { 
  FileText, 
  Trash2, 
  Plus, 
  Download, 
  Tag, 
  Eye, 
  Key, 
  FileCheck, 
  ExternalLink,
  ClipboardCheck,
  UploadCloud,
  X
} from 'lucide-react';

interface DocumentManagerProps {
  trip: Trip;
  onUpdateTrip: (updated: Trip) => void;
}

export default function DocumentManager({ trip, onUpdateTrip }: DocumentManagerProps) {
  const [filterType, setFilterType] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewDoc, setViewDoc] = useState<TravelDocument | null>(null);

  // New Doc Form
  const [title, setTitle] = useState('');
  const [type, setType] = useState<TravelDocument['type']>('boarding_pass');
  const [confCode, setConfCode] = useState('');
  const [notes, setNotes] = useState('');
  const [fileData, setFileData] = useState<string>('');
  const [fileName, setFileName] = useState('');
  const [fileError, setFileError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Convert uploaded file to base64
  const processFile = (file: File) => {
    if (file.size > 600 * 1024) { // 600KB max to avoid Firestore limits
      setFileError('File size triggers limits! Keep attachments under 600KB for offline usage.');
      return;
    }
    setFileError('');
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setFileData(e.target.result as string);
        setFileName(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const newDoc: TravelDocument = {
      id: 'doc_' + Date.now(),
      title,
      type,
      confCode: confCode || undefined,
      notes: notes || undefined,
      fileData: fileData || undefined,
      fileName: fileName || undefined,
      createdAt: new Date().toISOString()
    };

    const updatedTrip: Trip = {
      ...trip,
      documents: [newDoc, ...(trip.documents || [])],
      updatedAt: new Date().toISOString()
    };

    onUpdateTrip(updatedTrip);
    
    // reset form
    setTitle('');
    setType('boarding_pass');
    setConfCode('');
    setNotes('');
    setFileData('');
    setFileName('');
    setShowAddModal(false);
  };

  const handleDeleteDoc = (docId: string) => {
    if (!window.confirm('Delete this travel document?')) return;
    const updatedDocs = (trip.documents || []).filter(d => d.id !== docId);
    onUpdateTrip({
      ...trip,
      documents: updatedDocs,
      updatedAt: new Date().toISOString()
    });
    if (viewDoc && viewDoc.id === docId) {
      setViewDoc(null);
    }
  };

  const filteredDocs = (trip.documents || []).filter(d => filterType === 'all' || d.type === filterType);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-sans text-xl font-bold text-slate-800">Stored Travel Documents</h2>
          <p className="text-slate-500 text-xs">Essential passes, visas, and receipts backed up offline.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white transition rounded-xl text-xs font-semibold h-11 cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Document
        </button>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
        {['all', 'boarding_pass', 'hotel', 'ticket', 'visa', 'other'].map((t) => {
          const isActive = filterType === t;
          let label = t.replace('_', ' ');
          if (t === 'all') label = 'All Stored';
          if (t === 'hotel') label = 'Lodging';
          return (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize whitespace-nowrap transition cursor-pointer ${
                isActive 
                  ? 'bg-indigo-600 text-white animate-fade-in' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Documents Grid / Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {filteredDocs.length === 0 ? (
            <div className="border border-dashed border-slate-200 p-12 text-center rounded-2xl bg-slate-50/50">
              <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600 font-medium text-xs">No documents listed under this filter.</p>
              <p className="text-slate-400 text-[11px] mt-1">Upload files under 600KB for offline availability.</p>
            </div>
          ) : (
            filteredDocs.map((docItem) => (
              <div 
                key={docItem.id}
                className="p-4 bg-white border border-slate-200 rounded-2xl hover:border-slate-400 hover:shadow-sm transition flex items-start justify-between gap-4"
              >
                <div className="flex gap-3">
                  <div className="p-3 bg-slate-100 text-slate-600 rounded-xl flex-shrink-0">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded tracking-wide">
                      {docItem.type.replace('_', ' ')}
                    </span>
                    <h4 className="font-sans text-xs font-bold text-slate-800">{docItem.title}</h4>
                    {docItem.confCode && (
                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-600">
                        <Key className="w-3 h-3 text-slate-400" />
                        <span>Conf Code:</span>
                        <span className="font-bold text-slate-800">{docItem.confCode}</span>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(docItem.confCode || '');
                          }}
                          className="hover:text-slate-900 p-0.5 cursor-pointer"
                          title="Copy code"
                        >
                          <ClipboardCheck className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                    {docItem.notes && <p className="text-slate-500 text-[11px]">{docItem.notes}</p>}
                    {docItem.fileName && (
                      <span className="text-[10px] text-emerald-600 flex items-center gap-1 font-mono">
                        📎 {docItem.fileName}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {docItem.fileData && (
                    <button
                      onClick={() => setViewDoc(docItem)}
                      className="p-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl transition cursor-pointer min-w-11 min-h-11 flex items-center justify-center"
                      title="View file offline"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteDoc(docItem.id)}
                    className="p-2 border border-rose-100 text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer min-w-11 min-h-11 flex items-center justify-center"
                    title="Delete document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Dynamic preview details sidebar */}
        <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl h-fit space-y-4">
          <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 pb-2 border-b border-slate-200">
            <Eye className="w-4 h-4 text-slate-650" /> Document Viewer
          </h3>
          {viewDoc ? (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-sans text-xs font-bold text-slate-800">{viewDoc.title}</h4>
                  <span className="text-[10px] text-slate-400 font-medium">Type: {viewDoc.type.replace('_', ' ')}</span>
                </div>
                <button 
                  onClick={() => setViewDoc(null)} 
                  className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-500 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {viewDoc.fileData ? (
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white flex justify-center items-center shadow-sm p-2">
                  {viewDoc.fileData.startsWith('data:image/') ? (
                    <img 
                      src={viewDoc.fileData} 
                      alt={viewDoc.title} 
                      className="max-h-64 object-contain w-full rounded" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="p-8 text-center space-y-2">
                      <FileText className="w-12 h-12 text-slate-400 mx-auto" />
                      <p className="text-[11px] text-slate-600 font-mono">{viewDoc.fileName}</p>
                      <a 
                        href={viewDoc.fileData} 
                        download={viewDoc.fileName || 'document'} 
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold rounded-xl shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5" /> Download File (PDF/Document)
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-center text-[11px] text-slate-400 py-6">No file attachment available. View information inside the left list.</p>
              )}
            </div>
          ) : (
            <div className="text-center py-12 space-y-2">
              <Eye className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-slate-400 text-xs font-semibold">Select a document's eye icon to view attachments.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Document Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg p-6 relative z-10 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-sans text-sm font-semibold text-slate-800 uppercase tracking-widest">Store Document</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDocument} className="space-y-4">
              <div className="space-y-1">
                <label className="text-slate-700 text-xs font-semibold">Document Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Swiss Air Boarding Pass"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-indigo-500 bg-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-700 text-xs font-semibold">Document Category</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as TravelDocument['type'])}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-indigo-500"
                  >
                    <option value="boarding_pass">Boarding Pass</option>
                    <option value="hotel">Hotel Reservation</option>
                    <option value="ticket">Activity Ticket</option>
                    <option value="visa">Visa Copy</option>
                    <option value="other">Other / Receipt</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 text-xs font-semibold">Confirmation Code</label>
                  <input
                    type="text"
                    placeholder="e.g., LH-848491"
                    value={confCode}
                    onChange={(e) => setConfCode(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-indigo-500 bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 text-xs font-semibold">Notes / Instructions</label>
                <textarea
                  placeholder="e.g., Gate closes 30 mins before. Terminal 2B."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs resize-none focus:outline-indigo-500 bg-white"
                ></textarea>
              </div>

              {/* Drag n Drop Upload Area */}
              <div className="space-y-1">
                <label className="text-slate-700 text-xs font-semibold">Document Attachment (Optional)</label>
                <div 
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition ${
                    dragActive ? 'border-indigo-600 bg-slate-50' : 'border-slate-200 hover:border-slate-400 bg-slate-50/50'
                  }`}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden" 
                    accept="image/*,application/pdf"
                  />
                  <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-600 font-semibold">
                    {fileName ? `File chosen: ${fileName}` : 'Drag & drop image/PDF or click to browse'}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">Accepts images & PDFs up to 600KB</p>
                </div>
                {fileError && <p className="text-rose-500 text-[10px] mt-1 font-semibold">{fileError}</p>}
                {fileData && (
                  <div className="flex items-center justify-between p-2 bg-emerald-50 text-emerald-800 rounded-lg text-[11px] font-mono mt-2 animate-fade-in">
                    <span>📎 Attachment Loaded Successfully!</span>
                    <button 
                      type="button" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setFileData('');
                        setFileName('');
                      }} 
                      className="text-slate-500 hover:text-rose-600 font-bold"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-semibold cursor-pointer h-10 bg-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold cursor-pointer h-10 shadow-sm"
                >
                  Save Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
