import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import { apiGet, apiPost } from '../api';

const ApplyForAssistant = () => {
  const navigate = useNavigate();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applyingId, setApplyingId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const loadListings = async () => {
      try {
        setLoading(true);
        setError('');

        const data = await apiGet('/student/listings/open');

        if (!cancelled) {
          setListings(data?.listings || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load available positions.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadListings();

    return () => {
      cancelled = true;
    };
  }, []);

  const formatDate = (date) => {
    if (!date) return '—';

    return new Date(date).toLocaleDateString('en-ZA', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleApply = async (listing) => {
    try {
      setApplyingId(listing.ListingID);
      setError('');

      await apiPost('/student/applications/apply-for-assistant', {
        listingId: listing.ListingID,
      });

      navigate('/applications');
    } catch (err) {
      setError(err.message || 'Failed to submit application.');
      setApplyingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-off-white">
      <Navbar />

      <div className="flex">
        <Sidebar userRole="student" />

        <main className="flex-1">
          {/* ===== PAGE TITLE BAR ===== */}
          <div className="bg-primary h-16 flex items-center px-8">
            <h1 className="text-3xl font-poppins font-bold text-white">
              Assistant Applications
            </h1>
          </div>

          <div className="p-8">
            {/* ===== PAGE INTRO ===== */}
            <div className="mb-8">
              <h2 className="text-3xl font-poppins font-semibold text-primary">
                Available Assistant Positions
              </h2>

              <p className="text-neutral mt-2">
                View available modules and apply for an Assistant position if
                you meet the eligibility requirements.
              </p>
            </div>

            {/* ===== ERROR STATE ===== */}
            {error && (
              <Card>
                <div className="py-6 text-center">
                  <p className="font-semibold text-error font-inter">
                    Something went wrong
                  </p>

                  <p className="mt-1 text-sm text-neutral font-inter">
                    {error}
                  </p>
                </div>
              </Card>
            )}

            {/* ===== LOADING STATE ===== */}
            {loading && !error && (
              <Card>
                <p className="py-8 text-center text-neutral font-inter">
                  Loading available positions...
                </p>
              </Card>
            )}

            {/* ===== EMPTY STATE ===== */}
            {!loading && !error && listings.length === 0 && (
              <Card>
                <div className="py-10 text-center">
                  <p className="font-medium text-dark font-inter">
                    No assistant positions available
                  </p>

                  <p className="mt-1 text-sm text-neutral font-inter">
                    There are currently no Assistant positions that you are
                    eligible to apply for.
                  </p>
                </div>
              </Card>
            )}

            {/* ===== AVAILABLE POSITIONS ===== */}
            {!loading && !error && listings.length > 0 && (
              <div className="space-y-6">
                {listings.map((listing) => (
                  <Card key={listing.ListingID}>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                      {/* ===== POSITION INFORMATION ===== */}
                      <div>
                        <h3 className="text-2xl font-poppins font-semibold text-dark">
                          {listing.ModuleCode}
                        </h3>

                        <p className="text-lg text-dark mt-1">
                          {listing.ModuleName}
                        </p>

                        <p className="text-sm text-neutral mt-2">
                          Minimum grade: {listing.MinimumGrade}%
                        </p>

                        <p className="text-sm text-neutral mt-1">
                          Application deadline:{' '}
                          {formatDate(listing.Deadline)}
                        </p>
                      </div>

                      {/* ===== ELIGIBILITY + APPLY ===== */}
                      <div className="flex flex-col items-start md:items-end gap-3">
                        <span className="px-4 py-2 rounded-full text-sm font-semibold bg-primary-lightest text-primary">
                          Eligible
                        </span>

                        <button
                          onClick={() => handleApply(listing)}
                          disabled={applyingId === listing.ListingID}
                          className="px-6 py-3 rounded-xl font-semibold bg-primary text-white hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {applyingId === listing.ListingID
                            ? 'Applying...'
                            : 'Apply'}
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* ===== BACK BUTTON ===== */}
            <div className="mt-8">
              <button
                onClick={() => navigate('/applications')}
                className="text-primary font-semibold hover:underline"
              >
                ← Back to Applications
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ApplyForAssistant;