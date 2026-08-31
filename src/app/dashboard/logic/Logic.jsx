"use client"

import Applicant from '@/components/dashboard/applicant/Applicant';
import useAuth from '@/hooks/useAuth';
import Loader from '@/templates/loader/Loader';
import React from 'react';

const Logic = () => {

    const { logOut, loading, role, user } = useAuth();

    if (loading) {
        return <Loader></Loader>
    }

    if (role == "caseworker") {
        return <Applicant user={user}></Applicant>
    }

    return (
        <button onClick={logOut} >LogOut</button>
    )

};

export default Logic;