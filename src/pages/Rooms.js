import React from 'react'
import Hero from '../components/Hero'
import Banner from '../components/Banner'
import { Link } from 'react-router-dom'
import RoomsContainer from '../components/RoomsContainer'

export default function Rooms() {
    return (
        <>
            <Hero hero="roomsHero">
                <Banner title="Our Rooms">
                    <Link to="/"><button className="btn-primary">return home</button></Link>
                </Banner>
            </Hero>
            <RoomsContainer />
        </>
    )
}
