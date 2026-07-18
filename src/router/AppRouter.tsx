import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { GamePage } from '../pages/GamePage';
import { HomePage } from '../pages/HomePage';
import { LobbyPage } from '../pages/LobbyPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { Playground } from '../pages/Playground';
import { RoomPage } from '../pages/RoomPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'lobby',
        element: <LobbyPage />,
      },
      {
        path: 'rooms/:roomId',
        element: <RoomPage />,
      },
      {
        path: 'game/:matchId',
        element: <GamePage />,
      },
      {
        path: 'playground',
        element: <Playground />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
