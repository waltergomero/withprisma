'use client';

import React, { useCallback, useEffect, useRef } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import {NextButton, PrevButton, usePrevNextButtons} from './embla-carousel-arrow-buttons'
import { DotButton, useDotButton } from './embla-carousel-dot-buttons';
import '@/styles/embla/css/base-opacity.css';
import "@/styles/embla/css/embla-opacity.css"

const TWEEN_FACTOR_BASE = 0.84

const numberWithinRange = (number, min, max) =>
  Math.min(Math.max(number, min), max)

const EmblaCarousel = (props) => {
  const { slides, options } = props
  const [emblaRef, emblaApi] = useEmblaCarousel(options)
  const tweenFactor = useRef(0)

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi)

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)

  const setTweenFactor = useCallback((emblaApi) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length
  }, [])

  const tweenOpacity = useCallback((emblaApi, eventName) => {
    const engine = emblaApi.internalEngine()
    const scrollProgress = emblaApi.scrollProgress()
    const slidesInView = emblaApi.slidesInView()
    const isScrollEvent = eventName === 'scroll'

    emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
      let diffToTarget = scrollSnap - scrollProgress
      const slidesInSnap = engine.slideRegistry[snapIndex]

      slidesInSnap.forEach((slideIndex) => {
        if (isScrollEvent && !slidesInView.includes(slideIndex)) return

        if (engine.options.loop) {
          engine.slideLooper.loopPoints.forEach((loopItem) => {
            const target = loopItem.target()

            if (slideIndex === loopItem.index && target !== 0) {
              const sign = Math.sign(target)

              if (sign === -1) {
                diffToTarget = scrollSnap - (1 + scrollProgress)
              }
              if (sign === 1) {
                diffToTarget = scrollSnap + (1 - scrollProgress)
              }
            }
          })
        }

        const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor.current)
        const opacity = numberWithinRange(tweenValue, 0, 1).toString()
        emblaApi.slideNodes()[slideIndex].style.opacity = opacity
      })
    })
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    setTweenFactor(emblaApi)
    tweenOpacity(emblaApi)
    emblaApi
      .on('reInit', setTweenFactor)
      .on('reInit', tweenOpacity)
      .on('scroll', tweenOpacity)
      .on('slideFocus', tweenOpacity)
  }, [emblaApi, tweenOpacity])

  return (
    <div className="embla pt-18">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((s, index) => (
            <div className="embla__slide " key={index}>
              <img
                className="embla__slide__img"
                src={s.path}
                alt="Your alt text"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="embla__buttons">
          <PrevButton className="absolute top-30 left-0 bg-gray-600 hover:bg-gray-400 text-gray-200 font-bold py-2 px-4 rounded-l" onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton className="absolute top-30 right-0 bg-gray-600 hover:bg-gray-400 text-gray-200 font-bold py-2 px-4 rounded-r" onClick={onNextButtonClick} disabled={nextBtnDisabled} />
      </div>
      
    </div>
  )
}

export default EmblaCarousel
