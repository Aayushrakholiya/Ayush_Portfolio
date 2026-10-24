import { useContext, useEffect, useRef, useState } from 'react'
import { NavbarContext } from '../../context/NavbarContext'

const Video = ({ paused = false }) => {
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [source] = useState(() => `${import.meta.env.BASE_URL}media/home-${window.matchMedia('(max-width: 767px)').matches ? '360' : '720'}-v1.mp4`)
  const poster = `${import.meta.env.BASE_URL}media/home-poster-v1.jpg`
  const { isIntroComplete } = useContext(NavbarContext)

  useEffect(() => {
    const video = videoRef.current

    if (!video) return

    if (!isIntroComplete || paused) {
      video.pause()
      return
    }

    video.play().catch(() => undefined)
    return () => video.pause()
  }, [isIntroComplete, paused])

  return (
    <span className='home-video'>
      <img className='home-video__poster' src={poster} alt='' aria-hidden='true' fetchPriority='high' />
      {!paused && <video
        ref={videoRef}
        className={`home-video__player${isPlaying ? ' home-video__player--ready' : ''}`}
        autoPlay={isIntroComplete && !paused}
        preload='auto'
        poster={poster}
        src={source}
        onPlaying={() => setIsPlaying(true)}
        onError={() => setIsPlaying(false)}
        onEmptied={() => setIsPlaying(false)}
        aria-hidden='true'
        tabIndex={-1}
        loop
        muted
        playsInline
      />}
    </span>
  )
}

export default Video
