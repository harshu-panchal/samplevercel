import { FiDownload } from 'react-icons/fi';
import { generateCSV } from '../../utils/adminHelpers';

const ExportButton = ({ data, headers, filename, className = '' }) => {
  const handleExport = () => {
    if (!data || data.length === 0) {
      alert('No data to export');
      return;
    }
    generateCSV(data, headers, filename);
  };

  return (
    <button
      onClick={handleExport}
      className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-xs sm:text-sm flex-shrink-0 whitespace-nowrap ${className}`}
    >
      <FiDownload className="text-sm sm:text-base" />
      <span>Export CSV</span>
    </button>
  );
};

export default ExportButton;

