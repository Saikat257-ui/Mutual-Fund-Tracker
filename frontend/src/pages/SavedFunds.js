import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner, Alert, Button } from '../components/ui';
import { getSavedFunds, removeSavedFund } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function SavedFunds() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [savedFunds, setSavedFunds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [removingFund, setRemovingFund] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchSavedFunds();
  }, [user, navigate]);

  const fetchSavedFunds = async () => {
    try {
      const data = await getSavedFunds();
      setSavedFunds(data);
    } catch (err) {
      setError('Failed to load saved funds');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (fundId) => {
    setRemovingFund(fundId);
    try {
      await removeSavedFund(fundId);
      setSavedFunds(savedFunds.filter(fund => fund.fundId !== fundId));
    } catch (err) {
      setError('Failed to remove fund');
    } finally {
      setRemovingFund(null);
    }
  };

  const handleFundClick = (schemeCode) => {
    navigate(`/fund/${schemeCode}`);
  };

  if (isLoading) return <LoadingSpinner />;

  if (error) return <Alert type="error" message={error} />;

  if (savedFunds.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Saved Funds</h1>
          <p className="text-gray-500">You haven't saved any funds yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Saved Funds</h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {savedFunds.map((fund) => (
            <div
              key={fund.fundId}
              className="bg-white shadow rounded-lg overflow-hidden flex flex-col"
            >
              <div 
                className="p-6 cursor-pointer flex-1 min-h-[120px]"
                onClick={() => handleFundClick(fund.schemeCode)}
              >
                <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2">
                  {fund.schemeName}
                </h3>
                <p className="text-sm text-gray-500">
                  Scheme Code: {fund.schemeCode}
                </p>
              </div>
              
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <Button
                  variant="danger"
                  onClick={() => handleRemove(fund.fundId)}
                  isLoading={removingFund === fund.fundId}
                  className="w-full"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
