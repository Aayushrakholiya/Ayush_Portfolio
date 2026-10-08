import './Home.css'
import { useState } from 'react'
import Video from '../components/home/Video'
import HomeHeroText from '../components/home/HomeHeroText'
import HomeBottomText from '../components/home/HomeBottomText'
import HomeContact from '../components/home/HomeContact'

const Home = () => {
  const [videoPaused] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  return (
    <main className='home-page'>
      <div className='home-page__background' aria-hidden='true'>
        <Video paused={videoPaused} />

      </div>
      <div className='home-page__layout'>
        <HomeHeroText videoPaused={videoPaused} />
        <HomeContact />
        <HomeBottomText />
      
      </div>
    </main>
  )
}

export default Home
