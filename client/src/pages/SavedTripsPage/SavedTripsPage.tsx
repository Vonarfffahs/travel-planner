import {
  CalendarClock,
  CircleDollarSign,
  PencilLine,
  Route,
  SquareSigma,
  Trash,
  View,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useEffect, useState } from 'react';
import type { Trip } from '../../types';
import { tripsAPI } from '../../api';
import { Loader } from '../../components/ui/Loader';
import { useDispatch } from 'react-redux';
import { setCalculatedTrip } from '../../store/tripSlice';
import { tripMapper } from '../../utils/tripMapper';
import { useNavigate } from 'react-router';

import styles from './SavedTrips.module.css';

export const SavedTripsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 6;
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchTrips = async () => {
      setIsLoading(true);
      try {
        const response = await tripsAPI.getTrips({
          pageNumber,
          pageSize,
        });

        setTrips(response.data);
        setTotalCount(response.count);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrips();
  }, [pageNumber, refreshTrigger]);

  const totalPages = Math.ceil(totalCount / pageSize);

  const handlePrevPage = () => {
    if (pageNumber > 1) setPageNumber((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (pageNumber < totalPages) setPageNumber((prev) => prev + 1);
  };

  const handleViewTripDetails = (trip: Trip) => {
    const formattedTripForMap = tripMapper.toCalculateResponse(trip);

    dispatch(
      setCalculatedTrip({
        id: trip.id,
        trip: formattedTripForMap,
        maxCostLimit: trip.maxCostLimit,
        maxTimeLimit: trip.maxTimeLimit,
        tripName: trip.name,
      }),
    );

    navigate(`/trip/view/${trip.id}`);
  };

  const handleEditTrip = (trip: Trip) => {
    const formattedTripForMap = tripMapper.toCalculateResponse(trip);

    dispatch(
      setCalculatedTrip({
        id: trip.id,
        trip: formattedTripForMap,
        maxCostLimit: trip.maxCostLimit,
        maxTimeLimit: trip.maxTimeLimit,
        tripName: trip.name,
      }),
    );

    navigate(`/trip/edit/${trip.id}`);
  };

  const handleDeleteTrip = async (tripId: string) => {
    const isConfirmed = window.confirm(
      'Are you sure you want to delete this trip?',
    );
    if (!isConfirmed) return;

    try {
      await tripsAPI.deleteTrip(tripId);

      // Якщо ми видалили ОСТАННІЙ елемент на поточній сторінці (і це не перша сторінка),
      // то перекидаємо користувача на попередню сторінку.
      if (trips.length === 1 && pageNumber > 1) {
        setPageNumber((prev) => prev - 1);
      } else {
        // Інакше просто кажемо useEffect-у завантажити поточну сторінку заново
        setRefreshTrigger((prev) => prev + 1);
      }
    } catch (error) {
      console.error('Failed to delete trip:', error);
      alert('Failed to delete the trip.');
    }
  };

  const circleDollarSignIcon = <CircleDollarSign size={16} />;
  const calendarClockIcon = <CalendarClock size={16} />;
  const squareSigmaIcon = <SquareSigma size={16} />;
  const viewIcon = <View size={16} />;
  const pencilLineIcon = <PencilLine size={16} />;
  const trashIcon = <Trash size={16} />;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Saved Trips</h1>
        {isLoading ? <></> : <p>You have {totalCount} saved routes.</p>}
      </header>

      {isLoading ? (
        <div className={styles.loaderContainer}>
          <Loader size={40} /> Loading your trips...
        </div>
      ) : trips.length === 0 ? (
        <div className={styles.emptyStateContainer}>No saved trips found.</div>
      ) : (
        <>
          {/* Cards Grid */}
          <div className={styles.grid}>
            {trips.map((trip) => (
              <article key={trip.id} className={styles.card}>
                <h3 className={styles.cardTitle}>
                  <Route size={18} /> {trip.name || 'Unnamed Trip'}
                </h3>

                <div className={styles.cardStats}>
                  <div className={styles.stat}>
                    {circleDollarSignIcon} ${trip.totalCost.toFixed(2)}
                  </div>
                  <div className={styles.stat}>
                    {calendarClockIcon} {trip.totalTime} days
                  </div>
                  <div className={styles.stat}>
                    {squareSigmaIcon} {trip.totalValue} pts
                  </div>
                </div>

                <Button
                  variant="secondary"
                  className={styles.viewBtn}
                  onClick={() => handleViewTripDetails(trip)}
                >
                  {viewIcon}&nbsp;View Details
                </Button>

                <div className={styles.actionGroup}>
                  <Button
                    variant="secondary"
                    className={styles.actionGroupItem}
                    onClick={() => handleEditTrip(trip)}
                  >
                    {pencilLineIcon}&nbsp;Edit
                  </Button>

                  <Button
                    variant="secondary"
                    className={`${styles.actionGroupItem} ${styles.actionGroupItemDelete}`}
                    onClick={() => handleDeleteTrip(trip.id)}
                  >
                    {trashIcon}&nbsp;Delete
                  </Button>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <Button
                variant="secondary"
                onClick={handlePrevPage}
                disabled={pageNumber === 1 || isLoading}
              >
                Previous
              </Button>

              <span className={styles.pageInfo}>
                Page {pageNumber} of {totalPages}
              </span>

              <Button
                variant="secondary"
                onClick={handleNextPage}
                disabled={pageNumber === totalPages || isLoading}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
