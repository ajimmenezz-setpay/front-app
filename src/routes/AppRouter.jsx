import { lazy } from 'react'

import { Navigate, createBrowserRouter } from 'react-router-dom'

import {
  CardCloudRouter,
  CatalogsRouter,
  GeneralRouter,
  ManagementRouter,
  PublicRouter,
  SupportRouter,
  ViaboCardRouter,
  ViaboPayRouter,
  ViaboSpeiRouter
} from './routers'

import { LoadableRoute } from '@/routes/LoadableRoute'
import { AuthGuard, GuestGuard } from '@/shared/guards'
import { DashboardLayout } from '@/shared/layout/dashboard'

const Login = LoadableRoute(lazy(() => import('@/app/authentication/login/pages/Login')))

const NotFound = LoadableRoute(lazy(() => import('@/shared/pages/Page404')))

export const AppRouter = user =>
  createBrowserRouter([
    ...PublicRouter,
    {
      path: '/auth',
      children: [
        {
          path: 'login',
          Component: () => (
            <GuestGuard>
              <Login />
            </GuestGuard>
          )
        }
      ]
    },
    {
      path: '/',
      Component: () => (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={user?.urlInit} replace />, index: true },
        ManagementRouter,
        ViaboCardRouter,
        ViaboPayRouter,
        ...GeneralRouter,
        CatalogsRouter,
        ViaboSpeiRouter,
        SupportRouter,
        CardCloudRouter,
        { path: '*', element: <Navigate to="/404" /> }
      ]
    },

    {
      path: '*',
      children: [
        { path: '404', element: <NotFound /> },
        { path: '403', element: <NotFound /> }
      ]
    },
    { path: '*', element: <Navigate to="/404" /> }
  ])
