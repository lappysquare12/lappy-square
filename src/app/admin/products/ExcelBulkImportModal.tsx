'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';
import {
  FileSpreadsheet,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  Sparkles,
  Laptop,
  Check,
  FileUp,
  ArrowRight
} from 'lucide-react';

interface ExcelBulkImportModalProps {
  onSuccess?: () => void;
}

export default function ExcelBulkImportModal({ onSuccess }: ExcelBulkImportModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<{
    success: boolean;
    importedCount: number;
    totalRows: number;
    errors: Array<{ row: number; title?: string; error: string }>;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = () => {
    setFile(null);
    setParsedRows([]);
    setImportResult(null);
    setErrorMsg(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleOpen = () => {
    resetState();
    setIsOpen(true);
  };

  const handleClose = () => {
    if (isImporting) return;
    setIsOpen(false);
    resetState();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setErrorMsg(null);
    setImportResult(null);
    setFile(selectedFile);
    setIsParsing(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rows: any[] = XLSX.utils.sheet_to_json(worksheet);

        if (rows.length === 0) {
          setErrorMsg('The selected Excel file has no product rows.');
          setParsedRows([]);
        } else {
          setParsedRows(rows);
        }
      } catch (err: any) {
        setErrorMsg('Failed to parse Excel file. Please ensure it is a valid .xlsx or .xls file.');
        setParsedRows([]);
      } finally {
        setIsParsing(false);
      }
    };
    reader.onerror = () => {
      setErrorMsg('Error reading the file.');
      setIsParsing(false);
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  const handleImport = async () => {
    if (!file || parsedRows.length === 0) return;

    setIsImporting(true);
    setErrorMsg(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/products/bulk-import', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Bulk import failed');
      }

      setImportResult(data);
      if (onSuccess) onSuccess();
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong during import.');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={handleOpen}
        className="h-10 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition-all text-center cursor-pointer whitespace-nowrap shrink-0"
        title="Upload 50+ laptops at once using Excel"
      >
        <FileSpreadsheet className="w-4 h-4 shrink-0" />
        <span>Excel Bulk Upload</span>
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-7 space-y-6 my-8 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <span>Excel Bulk Laptop Import</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Fast &amp; 1-Click
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Upload dozens of laptops in seconds. Photos can be attached easily from inventory.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                disabled={isImporting}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Success State */}
            {importResult ? (
              <div className="space-y-4 py-4">
                <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-sm">
                    <Check className="w-6 h-6 stroke-[3]" />
                  </div>
                  <h4 className="text-base font-black text-emerald-950">
                    Import Successfully Completed!
                  </h4>
                  <p className="text-xs text-emerald-800 font-medium">
                    <strong className="text-emerald-950 text-sm font-bold">{importResult.importedCount}</strong> out of {importResult.totalRows} laptops were added to your inventory &amp; synced to Google Firebase Cloud.
                  </p>
                </div>

                {importResult.errors && importResult.errors.length > 0 && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1 text-xs text-amber-900">
                    <div className="font-bold flex items-center gap-1.5 text-amber-950">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <span>Some rows had issues:</span>
                    </div>
                    <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-800 max-h-28 overflow-y-auto pl-1">
                      {importResult.errors.map((e, idx) => (
                        <li key={idx}>Row {e.row}: {e.error} {e.title ? `(${e.title})` : ''}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-blue-600 shrink-0" />
                  <p className="text-xs text-blue-900 leading-relaxed font-medium">
                    All imported laptops are now live on the store with default placeholder images. You can now attach original photos for each laptop anytime from the Inventory list below!
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                  >
                    Done &amp; View Inventory
                  </button>
                </div>
              </div>
            ) : (
              /* Normal Step Flow */
              <div className="space-y-5">
                {/* Step 1: Download Sample Sheet */}
                <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-black flex items-center justify-center">1</span>
                      <h4 className="text-xs font-bold text-slate-900">Download Excel Template</h4>
                    </div>
                    <p className="text-[11px] text-slate-500 pl-7">
                      Pre-formatted columns (Title, Brand, Price, RAM, SSD, Processor) with sample rows.
                    </p>
                  </div>

                  <a
                    href="/api/admin/products/bulk-template"
                    download="Lappy_Square_Product_Import_Template.xlsx"
                    className="self-start sm:self-auto px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-2 shadow-2xs transition-all cursor-pointer whitespace-nowrap"
                  >
                    <Download className="w-4 h-4 text-emerald-600" />
                    <span>Download Template (.xlsx)</span>
                  </a>
                </div>

                {/* Step 2: Upload Excel File */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-black flex items-center justify-center">2</span>
                    <h4 className="text-xs font-bold text-slate-900">Upload Filled Excel File</h4>
                  </div>

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                      file
                        ? 'border-emerald-500 bg-emerald-50/40'
                        : 'border-slate-300 hover:border-blue-500 hover:bg-blue-50/20 bg-slate-50/50'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".xlsx, .xls, .csv"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {file ? (
                      <div className="space-y-1">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        </div>
                        <p className="text-xs font-bold text-slate-900 mt-2">{file.name}</p>
                        <p className="text-[11px] text-slate-500 font-medium">
                          {(file.size / 1024).toFixed(1)} KB • {parsedRows.length} product rows detected
                        </p>
                        <span className="inline-block text-[10px] font-bold text-blue-600 hover:underline mt-1">
                          Click to select different file
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center mx-auto">
                          <FileUp className="w-5 h-5 text-slate-500" />
                        </div>
                        <p className="text-xs font-bold text-slate-800">
                          Click to upload or drag &amp; drop Excel file
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Supports .xlsx, .xls and .csv formats
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Parsing Loader */}
                {isParsing && (
                  <div className="p-3 bg-slate-100 rounded-xl flex items-center justify-center gap-2 text-xs text-slate-600 font-medium">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    <span>Analyzing Excel rows...</span>
                  </div>
                )}

                {/* Error Banner */}
                {errorMsg && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700 font-medium">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Preview Table of Rows */}
                {parsedRows.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">
                        Preview ({parsedRows.length} Laptops Ready):
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Showing first {Math.min(parsedRows.length, 4)} rows
                      </span>
                    </div>

                    <div className="border border-slate-200 rounded-xl overflow-hidden max-h-44 overflow-y-auto text-[11px]">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold sticky top-0">
                          <tr>
                            <th className="py-2 px-3">#</th>
                            <th className="py-2 px-3">Title</th>
                            <th className="py-2 px-3">Brand</th>
                            <th className="py-2 px-3">Specs</th>
                            <th className="py-2 px-3">Price</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                          {parsedRows.slice(0, 4).map((r, i) => (
                            <tr key={i} className="hover:bg-slate-50/80">
                              <td className="py-2 px-3 text-slate-400 font-mono">{i + 1}</td>
                              <td className="py-2 px-3 font-semibold text-slate-900 truncate max-w-[180px]">
                                {r['Title'] || r['title'] || '—'}
                              </td>
                              <td className="py-2 px-3">{r['Brand'] || r['brand'] || '—'}</td>
                              <td className="py-2 px-3 text-slate-500">
                                {r['Processor'] || ''} • {r['RAM_GB'] || r['RAM'] || ''}GB • {r['Storage_GB'] || r['Storage'] || ''}GB
                              </td>
                              <td className="py-2 px-3 font-bold text-slate-900">
                                ₹{Number(r['Price'] || r['price'] || 0).toLocaleString('en-IN')}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Modal Footer Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isImporting}
                    className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleImport}
                    disabled={isImporting || parsedRows.length === 0}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all cursor-pointer disabled:cursor-not-allowed"
                  >
                    {isImporting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Importing {parsedRows.length} Laptops...</span>
                      </>
                    ) : (
                      <>
                        <span>Import {parsedRows.length > 0 ? `${parsedRows.length} Laptops` : 'Now'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
