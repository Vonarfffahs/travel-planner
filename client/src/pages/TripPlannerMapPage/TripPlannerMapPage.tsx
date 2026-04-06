import { ChevronLeft, Luggage } from 'lucide-react';
import { Sidebar } from '../../components/layout/Sidebar';
import { TripMap } from '../../features/map/components';
import { PlannerForm } from '../../features/trips/components/PlannerForm';
import { TripStats } from '../../features/trips/components/TripStats';
import { Button } from '../../components/ui/Button';
import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router';
import { useDispatch } from 'react-redux';
import { clearTrip, setCalculatedTrip } from '../../store/tripSlice';
import { tripsAPI } from '../../api';
import { tripMapper } from '../../utils/tripMapper';
import { ProfileMenu } from '../../components/layout/ProfileMenu';

import styles from './TripPlannerMapPage.module.css';

export const TripPlannerMapPage = () => {
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);
  const location = useLocation();
  const { id } = useParams();
  const dispatch = useDispatch();

  const isCreateMode = location.pathname.includes('/new');
  const isViewMode = location.pathname.includes('/view');
  const isEditMode = location.pathname.includes('/edit');

  useEffect(() => {
    const loadTripData = async () => {
      if (isCreateMode) {
        dispatch(clearTrip());
      } else if ((isViewMode || isEditMode) && id) {
        try {
          const tripData = await tripsAPI.getTripById(id);
          const formattedTripForMap = tripMapper.toCalculateResponse(tripData);

          dispatch(
            setCalculatedTrip({
              trip: formattedTripForMap,
              maxCostLimit: tripData.maxCostLimit,
              maxTimeLimit: tripData.maxTimeLimit,
              tripName: tripData.name,
            }),
          );
        } catch (error) {
          console.error('Failed to load trip:', error);
        }
      }
    };

    loadTripData();
  }, [isCreateMode, isViewMode, isEditMode, id, dispatch]);

  const handleHideSidebar = () => {
    setIsSidebarHidden((prev) => !prev);
  };

  const hideSidebarBtnClasses = [
    styles.icon,
    isSidebarHidden ? styles.sidebarIsHiddenIcon : '',
  ]
    .filter(Boolean)
    .join(' ');

  const containerClasses = [
    styles.hideSidebarBtnContainer,
    isSidebarHidden ? styles.containerHidden : '',
  ]
    .filter(Boolean)
    .join(' ');

  const luggageIcon = <Luggage size={24} strokeWidth={2.5} />;
  const chevronLeftIcon = (
    <ChevronLeft size={24} strokeWidth={3} className={hideSidebarBtnClasses} />
  );

  return (
    <>
      <Sidebar
        sideBarTitle="Trip Planner"
        icon={luggageIcon}
        isHidden={isSidebarHidden}
      >
        <PlannerForm isViewMode={isViewMode} />
        <TripStats isViewMode={isViewMode} isEditMode={isEditMode} />
      </Sidebar>
      <div className={containerClasses}>
        <Button
          variant="custom"
          className={`${styles.hideSidebarBtn}`}
          onClick={handleHideSidebar}
        >
          {chevronLeftIcon}
        </Button>
      </div>

      <ProfileMenu />

      <TripMap />
    </>
  );
};
