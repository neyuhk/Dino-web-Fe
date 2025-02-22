import React from 'react'
import Profile from '../../components/Profile/Profile.tsx'
import { useSelector } from 'react-redux'
import RequireAuth from '../../components/RequireAuth/RequireAuth.tsx'

const ProfilePage: React.FC = () => {
    const { user } = useSelector((state: any) => state.auth);

    if(!user){
        return (
            <RequireAuth></RequireAuth>
        );
    }
    return (
        <main>
            <Profile></Profile>
        </main>
    )
}

export default ProfilePage
