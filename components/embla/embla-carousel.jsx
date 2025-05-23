'use client';
import React from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import ClassNames from 'embla-carousel-class-names';
import '@/styles/embla/css/base.css';
import "@/styles/embla/css/embla.css"

import {
  NextButton,
  PrevButton,
  usePrevNextButtons
} from './embla-carousel-arrow-buttons'
import { DotButton, useDotButton } from './embla-carousel-dot-buttons'
import Image from 'next/image';



const EmblaCarousel = (props) => {
  const { slides, options } = props
  const [emblaRef, emblaApi] = useEmblaCarousel({loop:true}, [ClassNames()])

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi)

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)

  return (
    <div className="embla pt-18">
      <div className="embla__viewport " ref={emblaRef}>
        <div className="embla__container">
          {slides.map((s, index) => (
            <div className="embla__slide" key={index}>
              <Image
                className="embla__slide__img "
                src={s.src}
                alt="Your alt text"
                height="760"
                width="480"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="embla__controls">
        <div className="embla__buttons">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>

        <div className="embla__dots">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={'embla__dot'.concat(
                index === selectedIndex ? ' embla__dot--selected' : ''
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default EmblaCarousel
