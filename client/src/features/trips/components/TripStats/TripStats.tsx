import { useDispatch, useSelector } from 'react-redux';
import { clearTrip, setCalculatedTrip } from '../../../../store/tripSlice';
import type { StoreState } from '../../../../store';
import { Button } from '../../../../components/ui/Button';
import { useEffect, useState } from 'react';
import { Input } from '../../../../components/ui/Input';
import {
  Bookmark,
  CalendarClock,
  CircleDollarSign,
  PencilLine,
  Route,
  SquareSigma,
  Timer,
  Trash,
  X,
} from 'lucide-react';
import { tripsAPI } from '../../../../api';
import { tripMapper } from '../../../../utils/tripMapper';

import styles from './TripStats.module.css';
import { useNavigate, useParams } from 'react-router';

interface TripStatsProps {
  isViewMode?: boolean;
  isEditMode?: boolean;
}

export const TripStats = ({
  isViewMode = false,
  isEditMode = false,
}: TripStatsProps) => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    calculatedTrip,
    maxCostLimit,
    maxTimeLimit,
    tripName: savedName,
  } = useSelector((state: StoreState) => state.trip);

  const [tripName, setTripName] = useState(savedName || '');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setTripName(savedName || '');
  }, [savedName]);

  if (!calculatedTrip) return null;

  const handleClearRoute = () => {
    dispatch(setCalculatedTrip(null));
  };

  const handleSaveRoute = async () => {
    if (!calculatedTrip || maxCostLimit === null || maxTimeLimit === null) {
      console.error('Missing required trip data');
      return;
    }

    const payload = tripMapper.toCreateRequest(
      calculatedTrip,
      tripName,
      maxCostLimit!,
      maxTimeLimit!,
      'cc98cacc-e166-4cfd-8bd9-f51797808c79',
    );

    try {
      if (isEditMode && id) {
        const response = await tripsAPI.updateTrip(id, payload);
        console.log('Updated:', response);
        alert('Trip updated successfully!');
      } else {
        const response = await tripsAPI.postTrip(payload);
        console.log('Saved:', response);
        alert('Trip saved successfully!');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    if (id) {
      navigate(`/trip/edit/${id}`);
    }
  };

  const handleCancel = () => {
    if (id) {
      dispatch(clearTrip());
      navigate(`/trip/view/${id}`);
    }
  };

  const routeIcon = <Route size={16} />;
  const bookmarkIcon = <Bookmark size={16} strokeWidth={3} />;
  const trashIcon = <Trash size={16} strokeWidth={3} />;
  const circleDollarSign = <CircleDollarSign size={15} />;
  const calendarClockIcon = <CalendarClock size={15} />;
  const squareSigmaIcon = <SquareSigma size={15} />;
  const timerIcon = <Timer size={15} />;
  const pencilLineIcon = <PencilLine size={15} />;
  const xIcon = <X size={15} />;

  return (
    <div className={styles.statsContainer}>
      <Input
        label="Trip's Name"
        type="text"
        icon={routeIcon}
        placeholder="E.g., Weekend in the Carpathians"
        value={tripName}
        disabled={isViewMode}
        onChange={(e) => {
          setTripName(e.target.value);
        }}
      />

      <div className={styles.statsGrid}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>
            {circleDollarSign}&nbsp;Total Cost
          </span>
          <span className={styles.statValue}>
            ${calculatedTrip.totalCost.toFixed(2)}
          </span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>
            {calendarClockIcon}&nbsp;Total Time
          </span>
          <span className={styles.statValue}>
            {calculatedTrip.totalTime} days
          </span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>
            {squareSigmaIcon}&nbsp;Total Value
          </span>
          <span className={styles.statValue}>{calculatedTrip.totalValue}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>
            {timerIcon}&nbsp;Calculation Time
          </span>
          <span className={styles.statValue}>
            {calculatedTrip.calculationTime.toFixed(3)}ms
          </span>
        </div>
      </div>

      {!isViewMode && (
        <div className={styles.actions}>
          {isEditMode ? (
            <Button type="button" variant="secondary" onClick={handleCancel}>
              {xIcon}&nbsp;Cancel
            </Button>
          ) : (
            <Button
              type="button"
              variant="secondary"
              onClick={handleClearRoute}
            >
              {trashIcon}&nbsp;Clear Route
            </Button>
          )}

          <Button type="button" onClick={handleSaveRoute} isLoading={isLoading}>
            {bookmarkIcon}&nbsp;{isEditMode ? 'Update Route' : 'Save Route'}
          </Button>
        </div>
      )}

      {isViewMode && (
        <div className={styles.actions}>
          <Button type="button" onClick={handleEdit}>
            {pencilLineIcon}&nbsp;Edit Route
          </Button>
        </div>
      )}
    </div>
  );
};
