import ProductEditForm from "@/components/products/edit-form";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import {fetchProductById, fetchImageByProductId} from '@/actions/product-actions'
import {fetchCategories} from '@/actions/category-actions'
import notFound from "./not-found";


export default async function ProductEditPage({params}) {
  const _params = await params;
  const id =_params.slug[0];
  const index = parseInt(_params.slug[1]);

  const [product] = await Promise.all([fetchProductById(id)]);
  const categories = await fetchCategories();
  const images = await fetchImageByProductId(id)
 
  if (!product) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Products", href: "/dashboard/products" },
          {
            label: "Update Product Information",
            href: `/dashboard/products/${id}/edit`,
            active: true,
          },
        ]}
      />
      <ProductEditForm product={product} categories={categories} images={images} tabindex={index}/>
    </main>
  );
}
