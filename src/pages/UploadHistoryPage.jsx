import PageHeader from '../components/common/PageHeader';
import { uploadHistory } from '../data/mockData';

function UploadHistoryPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Upload History" subtitle="Review all previously uploaded sales CSV files." />
      <section className="card-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3">File Name</th>
                <th className="px-4 py-3">Branch</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Uploaded At</th>
                <th className="px-4 py-3">Size</th>
              </tr>
            </thead>
            <tbody>
              {uploadHistory.map((row) => (
                <tr key={row.fileName} className="border-t border-slate-100">
                  <td className="px-4 py-3">{row.fileName}</td>
                  <td className="px-4 py-3">{row.branch}</td>
                  <td className="px-4 py-3">{row.status}</td>
                  <td className="px-4 py-3">{row.uploadedAt}</td>
                  <td className="px-4 py-3">{row.size}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default UploadHistoryPage;
