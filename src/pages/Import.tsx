import React, { useState } from 'react';
import { Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle, X } from 'lucide-react';
import { ImportPreviewRow } from '../types';
import { parseExcelFile, validateAssetRow, validateConsumableRow, generateAssetTemplate, generateConsumableTemplate } from '../utils/excelUtils';
import { assets } from '../data/mockData';

type ImportMode = 'assets' | 'consumables';

const Import: React.FC = () => {
  const [importMode, setImportMode] = useState<ImportMode>('assets');
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<ImportPreviewRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.xlsx')) {
      alert('Please upload an Excel file (.xlsx)');
      return;
    }

    setFile(selectedFile);
    setIsProcessing(true);

    try {
      const data = await parseExcelFile(selectedFile);
      const existingBarcodes = assets.map(a => a.barcode);
      
      const preview = data.map((row, index) => {
        if (importMode === 'assets') {
          return validateAssetRow(row, index + 2, existingBarcodes);
        } else {
          return validateConsumableRow(row, index + 2);
        }
      });

      setPreviewData(preview);
    } catch (error) {
      alert('Error reading file. Please check the format.');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = () => {
    const validRows = previewData.filter(row => row.isValid);
    if (validRows.length === 0) {
      alert('No valid rows to import');
      return;
    }

    // Simulate import
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setFile(null);
      setPreviewData([]);
    }, 2000);
  };

  const validCount = previewData.filter(row => row.isValid).length;
  const errorCount = previewData.filter(row => !row.isValid).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Upload className="w-7 h-7 mr-3 text-indigo-600" />
          Excel Import
        </h1>
        <p className="text-sm text-gray-600 mt-1">Bulk import assets or consumables from Excel</p>
      </div>

      {/* Import Mode Selection */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Select Import Mode</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => {
              setImportMode('assets');
              setFile(null);
              setPreviewData([]);
            }}
            className={`p-6 rounded-xl border-2 transition-all ${
              importMode === 'assets'
                ? 'border-indigo-600 bg-indigo-50'
                : 'border-gray-200 hover:border-indigo-300'
            }`}
          >
            <FileSpreadsheet className={`w-8 h-8 mb-3 ${importMode === 'assets' ? 'text-indigo-600' : 'text-gray-400'}`} />
            <h3 className="font-bold text-gray-900 mb-2">Assets Import</h3>
            <p className="text-sm text-gray-600">Import unique items with serial numbers and barcodes</p>
          </button>

          <button
            onClick={() => {
              setImportMode('consumables');
              setFile(null);
              setPreviewData([]);
            }}
            className={`p-6 rounded-xl border-2 transition-all ${
              importMode === 'consumables'
                ? 'border-green-600 bg-green-50'
                : 'border-gray-200 hover:border-green-300'
            }`}
          >
            <FileSpreadsheet className={`w-8 h-8 mb-3 ${importMode === 'consumables' ? 'text-green-600' : 'text-gray-400'}`} />
            <h3 className="font-bold text-gray-900 mb-2">Consumables Import</h3>
            <p className="text-sm text-gray-600">Import quantity-based items like cables and connectors</p>
          </button>
        </div>
      </div>

      {/* Template Download */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-2 flex items-center">
              <Download className="w-5 h-5 mr-2 text-blue-600" />
              Download Template
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Download the Excel template for {importMode === 'assets' ? 'assets' : 'consumables'} to ensure correct format
            </p>
            <button
              onClick={() => importMode === 'assets' ? generateAssetTemplate() : generateConsumableTemplate()}
              className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Download {importMode === 'assets' ? 'Asset' : 'Consumable'} Template
            </button>
          </div>
        </div>
      </div>

      {/* File Upload */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Upload Excel File</h2>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-indigo-400 transition-colors">
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 mb-4">
            {file ? file.name : 'Drag and drop your Excel file here, or click to browse'}
          </p>
          <input
            type="file"
            accept=".xlsx"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="inline-block bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            Select File
          </label>
        </div>
      </div>

      {/* Preview */}
      {previewData.length > 0 && (
        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Import Preview</h2>
              <p className="text-sm text-gray-600 mt-1">
                Review the data before importing
              </p>
            </div>
            <div className="flex gap-4">
              <div className="text-center">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-2xl font-bold text-green-600">{validCount}</span>
                </div>
                <p className="text-xs text-gray-600">Valid</p>
              </div>
              <div className="text-center">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="text-2xl font-bold text-red-600">{errorCount}</span>
                </div>
                <p className="text-xs text-gray-600">Errors</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Row</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                  {importMode === 'assets' ? (
                    <>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Brand</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Model</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Barcode</th>
                    </>
                  ) : (
                    <>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Quantity</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Min Threshold</th>
                    </>
                  )}
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Errors</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {previewData.map((row) => (
                  <tr key={row.rowNumber} className={row.isValid ? '' : 'bg-red-50'}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.rowNumber}</td>
                    <td className="px-4 py-3">
                      {row.isValid ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      )}
                    </td>
                    {importMode === 'assets' ? (
                      <>
                        <td className="px-4 py-3 text-sm text-gray-900">{row.data.Category}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{row.data.Brand}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{row.data.Model}</td>
                        <td className="px-4 py-3 text-sm font-mono text-gray-900">{row.data.Barcode}</td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3 text-sm text-gray-900">{row.data.Name}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{row.data.Quantity}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{row.data.MinThreshold}</td>
                      </>
                    )}
                    <td className="px-4 py-3 text-sm text-red-600">
                      {row.errors.join(', ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex gap-4">
            <button
              onClick={handleImport}
              disabled={validCount === 0}
              className="flex-1 gradient-success text-white font-semibold px-6 py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Import {validCount} Valid {validCount === 1 ? 'Row' : 'Rows'}
            </button>
            <button
              onClick={() => {
                setFile(null);
                setPreviewData([]);
              }}
              className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-2xl card-shadow-hover transform scale-110">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 text-center">Import Successful!</p>
            <p className="text-gray-600 text-center mt-2">{validCount} items imported</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Import;
