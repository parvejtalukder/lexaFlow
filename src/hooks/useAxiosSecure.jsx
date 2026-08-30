'use client';

import axios from 'axios';
import { useMemo } from 'react';
import useAuth from './useAuth';

const server_domain = process.env.NEXT_PUBLIC_SERVER_URL;

const useAxiosSecure = () => {

    const { user, logOut } = useAuth();

    const axiosSecure = useMemo(() => {
        const instance = axios.create({
            baseURL: server_domain,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        instance.interceptors.request.use(
            async (config) => {
                if (user) {
                    const token = await user.getIdToken();
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        instance.interceptors.response.use(
            (response) => response,
            async (error) => {
                const status = error.response ? error.response.status : null;
                if ((status === 401 || status === 403) && logOut) {
                    await logOut();
                }
                return Promise.reject(error);
            }
        );

        return instance;
    }, [user, logOut]);

    return axiosSecure;
};

export default useAxiosSecure;