import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, LoadingSpinner, Alert } from '../components/ui';
import { getMutualFundDetails, saveMutualFund } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function FundDetails() {
  const { schemeCode } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [fund, setFund] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchFundDetails = async () => {
      try {
        const data = await getMutualFundDetails(schemeCode);
        setFund(data);
      } catch (err) {
        setError('Failed to load fund details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFundDetails();
  }, [schemeCode]);

  const handleSave = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setIsSaving(true);
    try {
      await saveMutualFund({
        fundId: schemeCode,
        schemeName: fund.meta.scheme_name,
        schemeCode: fund.meta.scheme_code,
      });
      setSaveSuccess(true);
    } catch (err) {
      setError('Failed to save fund');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  if (error) return <Alert type="error" message={error} />;

  if (!fund) return <Alert type="error" message="Fund not found" />;

  const latestNav = fund.data?.[0] || {};

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-2xl font-bold leading-6 text-gray-900">
              {fund.meta.scheme_name}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Scheme Code: {fund.meta.scheme_code}
            </p>
          </div>

          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Latest NAV</h4>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  ₹{latestNav.nav}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  as of {latestNav.date}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">Scheme Type</h4>
                <p className="mt-1 text-lg text-gray-900">
                  {fund.meta.scheme_type}
                </p>
              </div>
            </div>

            {saveSuccess ? (
              <div className="mt-6">
                <Alert type="success" message="Fund saved successfully!" />
              </div>
            ) : (
              <div className="mt-6">
                <Button
                  onClick={handleSave}
                  isLoading={isSaving}
                  disabled={isSaving}
                >
                  Save Fund
                </Button>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">NAV History</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      NAV
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {fund.data.slice(0, 10).map((entry, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {entry.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{entry.nav}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
