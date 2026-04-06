import {
  createBrowserRouter,
  RouterProvider,
  type RouteObject,
} from 'react-router';
import {
  HomePage,
  NotFoundPage,
  SavedTripsPage,
  SettingsPage,
  TripPlannerMapPage,
  UserProfilePage,
} from './pages';

import './App.css';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: 'trip/new',
    element: <TripPlannerMapPage />,
  },
  {
    path: 'trip/edit/:id',
    element: <TripPlannerMapPage />,
  },
  {
    path: 'trip/view/:id',
    element: <TripPlannerMapPage />,
  },
  {
    path: 'user-profile',
    element: <UserProfilePage />,
    children: [
      {
        path: 'saved-trips',
        element: <SavedTripsPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

export default function App() {
  return <RouterProvider router={createBrowserRouter(routes)} />;
}
