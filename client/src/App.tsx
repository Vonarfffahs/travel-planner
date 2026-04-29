import {
  createBrowserRouter,
  RouterProvider,
  type RouteObject,
} from 'react-router';
import {
  AuthPage,
  HomePage,
  NotFoundPage,
  SavedTripsPage,
  SettingsPage,
  TripPlannerMapPage,
  UserProfilePage,
} from './pages';

import './App.css';
import { ProtectedRoute } from './components/layout/ProtectedRoute/ProtectedRoute';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/auth',
    element: <AuthPage />,
  },
  {
    path: 'trip/new',
    element: <TripPlannerMapPage />,
  },

  {
    element: <ProtectedRoute />,
    children: [
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
