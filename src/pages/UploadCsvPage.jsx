import { useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, FileText, UploadCloud } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import { uploadHistory } from '../data/mockData';
import { useLiveData } from '../context/LiveDataContext';
import { api } from '../api/client';

const MAX_FILE_SIZE = 2 * 1024 * 1024;

function UploadCsvPage() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle');
  const [progress, setProgress] = useState(0);
  const { liveEnabled, branches, uploadHistory: liveUploadHistory, refreshLiveData } = useLiveData();

  const validateFile = (nextFile) => {
    if (!nextFile) return 'No file selected';
    if (!nextFile.name.endsWith('.csv')) return 'Only CSV files are allowed';
    if (nextFile.size > MAX_FILE_SIZE) return 'File exceeds 2MB size limit';
    return '';
  };

  const handleFile = (nextFile) => {
    const validationError = validateFile(nextFile);
    if (validationError) {
      setStatus(validationError);
      setFile(null);
      return;
    }

    setFile(nextFile);
    setStatus('valid');
    setProgress(0);
  };

  const onFileChange = (event) => handleFile(event.target.files?.[0]);

  const simulateUpload = async () => {
    if (!file) return;
    if (!liveEnabled || !branches.length) {
      setStatus('Backend unavailable. Start backend and try again.');
      return;
    }

    setStatus('uploading');
    let current = 0;
    const timer = setInterval(async () => {
      current += 20;
      setProgress(current);
      if (current >= 100) {
        clearInterval(timer);
        try {
          await api.uploadSalesCsv(file, branches[0].id);
          await refreshLiveData();
          setTimeout(() => refreshLiveData(), 4000);
          setStatus('success');
        } catch {
          setStatus('Upload failed. Please verify backend is running.');
        }
      }
    }, 250);
  };

  const alert = useMemo(() => {
    if (status === 'success') {
      return {
        className: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
        text: 'File uploaded successfully. AI model retraining started for selected branch.',
        icon: CheckCircle2,
      };
    }

    if (status !== 'idle' && status !== 'valid' && status !== 'uploading') {
      return {
        className: 'bg-red-50 text-red-700 ring-red-200',
        text: status,
        icon: AlertCircle,
      };
    }

    return null;
  }, [status]);

  const historyRows = liveEnabled
    ? liveUploadHistory.map((row) => ({
        fileName: row.fileName,
        branch: row.branch?.name || 'Unknown',
        status: row.status,
        uploadedAt: new Date(row.uploadedAt).toLocaleString(),
        size: `${(row.fileSize / 1024).toFixed(1)} KB`,
      }))
    : uploadHistory;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Upload Sales CSV"
        subtitle="Upload branch sales data for AI waste prediction and recommendations."
      />

      <section className="card-surface p-6">
        <label
          htmlFor="csv-upload"
          className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/50 px-6 py-12 text-center transition hover:border-emerald-500 hover:bg-emerald-50"
        >
          <UploadCloud className="mb-3 h-10 w-10 text-emerald-600" />
          <p className="text-lg font-semibold text-slate-800">Drag and drop your CSV file here</p>
          <p className="mt-1 text-sm text-slate-500">or click to browse. Max file size: 2MB.</p>
          <input id="csv-upload" type="file" accept=".csv" className="sr-only" onChange={onFileChange} />
        </label>

        <div className="mt-4 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
          <p className="text-sm text-slate-600">Accepted format: CSV with date, item, quantity sold, price, branch ID.</p>
          <p className="mt-1 text-xs text-slate-500">File size limit: 2MB</p>
        </div>

        {file ? (
          <div className="mt-4 flex items-center justify-between rounded-xl bg-white p-4 ring-1 ring-slate-200">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-sm font-semibold text-slate-800">{file.name}</p>
                <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <button
              type="button"
              onClick={simulateUpload}
              disabled={status === 'uploading'}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
            >
              {status === 'uploading' ? 'Uploading...' : 'Start Upload'}
            </button>
          </div>
        ) : null}

        {status === 'uploading' || status === 'success' ? (
          <div className="mt-4">
            <div className="mb-2 flex justify-between text-xs text-slate-600">
              <span>Upload progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-orange-400 transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        ) : null}

        {alert ? (
          <div className={`mt-4 flex items-start gap-2 rounded-xl p-3 text-sm ring-1 ${alert.className}`}>
            <alert.icon className="mt-0.5 h-4 w-4" />
            {alert.text}
          </div>
        ) : null}
      </section>

      <section className="card-surface overflow-hidden">
        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="font-semibold text-slate-900">Upload History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">File Name</th>
                <th className="px-4 py-3 font-medium">Branch</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Uploaded At</th>
                <th className="px-4 py-3 font-medium">Size</th>
              </tr>
            </thead>
            <tbody>
              {historyRows.map((row, idx) => (
                <tr key={`${row.fileName}-${idx}`} className="border-t border-slate-100">
                  <td className="px-4 py-3 text-slate-800">{row.fileName}</td>
                  <td className="px-4 py-3 text-slate-600">{row.branch}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        row.status === 'Processed' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{row.uploadedAt}</td>
                  <td className="px-4 py-3 text-slate-600">{row.size}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default UploadCsvPage;
