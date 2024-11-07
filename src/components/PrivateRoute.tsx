import React from 'react';
import {  Navigate, Outlet } from 'react-router-dom';
import { useGetProfileQuery } from '../features/user/backendApi';
import { getJWT } from '../utils/helper';
import Loader from './ui/Loader';

interface PrivateRouteProps {
  allowedRoles?: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles  }) => {
    const jwt: string = getJWT();
    const {data, isLoading, isError} = useGetProfileQuery(jwt);
    const userRole = data?.role;

    if(isLoading) return <div className='h-screen flex items-center justify-center'><Loader/></div>
    if(isError) return <Navigate to="/login"/>

  return allowedRoles && userRole && allowedRoles.includes(userRole) ? (<Outlet/>) : <Navigate to="/not-found"/>
};

export default PrivateRoute;
