import React from 'react'
import Profile from '../../components/Profile/Profile.tsx'
import { useSelector } from 'react-redux'
import RequireAuth from '../../components/commons/RequireAuth/RequireAuth.tsx'
import AboutUs from '../../components/AboutUs/AboutUs.tsx'

const AboutUsPage: React.FC = () => {
    return (
        <main>
            <AboutUs></AboutUs>
        </main>
    )
}

export default AboutUsPage
