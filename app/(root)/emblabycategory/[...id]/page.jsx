import {fetchVisibleImagesByCategory} from "@/actions/gallery-actions";
//import EmblaCarousel from '@/components/embla/embla-carousel';
import EmblaCarousel from '@/components/embla/embla-carousel-opacity';


const OPTIONS = { loop: true }
const SLIDE_COUNT = 5
const SLIDES = Array.from(Array(SLIDE_COUNT).keys())

const EmblaByCategory= async ({params}) => {
 const {id} = await params;
 const [images] = await Promise.all([fetchVisibleImagesByCategory(id[0])]);

  return (
    <EmblaCarousel slides={images} options={OPTIONS} />
  )
}

export default EmblaByCategory