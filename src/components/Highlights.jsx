import React from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { rightImg, watchImg } from '../utils'
import VideoCarousel from './VideoCarousel'

const Highlights = () => {

  useGSAP(() => {
    gsap.to("#title", {
      opacity: 1, 
      translateY: 0
    })

    gsap.to(".link", {
      opacity: 1, 
      translateY: 0, 
      delay: 1, 
      stagger: 0.25

    })
  }, [])

  return (
    <section className='w-screen overflow-hidden h-full common-padding bg-zinc' id='highlights'>
      <div className='screen-max-width'>
        <div className='mb-12 w-full items-end justify-between md:flex'>
          <h1 className='section-heading sm:pb-4 lg:pb-0' id='title'>Get the highlights.</h1>
          <div className='flex flex-wrap items-end gap-5 '>
            <p className='link'>Watch the film
              <img src={watchImg} alt="watch" className='ml-2' />
            </p>
            <p className='link'>Watch the event.
              <img src={rightImg} alt="right" />
            </p>
          </div>
        </div>
        
        <VideoCarousel/>
      </div>
    </section>
  )
}

export default Highlights