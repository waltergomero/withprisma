
import CategoryLigthbox from '@/components/rootgallery/category-lightbox';
import {fetchVisibleImagesByCategory} from "@/actions/gallery-actions";


const GalleryByCategory = async ({params}) => {

       const {id} = await params;
       const [images] = await Promise.all([fetchVisibleImagesByCategory(id[0])]);

  return (
          <CategoryLigthbox images={images}/>
       
  )
}

export default GalleryByCategory