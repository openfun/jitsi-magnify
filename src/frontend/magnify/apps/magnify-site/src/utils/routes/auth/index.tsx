import { IntroductionLayout } from '@openfun/magnify-components';
import { Navigate, Outlet, RouteObject } from 'react-router-dom';
import { AuthLoginView } from '../../../views/auth/login';
import { AuthRegisterView } from '../../../views/auth/register';

export enum AuthPath {
  AUTH = '/auth',
  LOGIN = '/auth/login',
  REGISTER = '/auth/register',
}

export const getAuthRoute = (): RouteObject => {
  return {
    path: AuthPath.AUTH,
    element: (
      <IntroductionLayout
        background="linear-gradient(45deg, #ffbdc9 0%, #687fc9 100%)"
        urlCover="/cover.svg"
        urlLogo="/logo-fun.svg"
      >
        <Outlet />
      </IntroductionLayout>
    ),
    children: [
      {
        index: true,
        element: <Navigate to={AuthPath.LOGIN} />,
      },
      {
        index: true,
        path: AuthPath.LOGIN,
        element: <AuthLoginView />,
      },
      {
        path: AuthPath.REGISTER,
        element: <AuthRegisterView />,
      },
    ],
  };
};
