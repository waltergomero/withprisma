import Search from '@/components/ui/search';
import Table from '@/components/categories/table';
import { CreateCategoryBtn } from '@/components/categories/buttons';
import { fetchCategoryPages } from '@/actions/category-actions';
import { Suspense } from 'react';
import { auth } from "@/auth";

export const metadata = {  title: 'Categories',};

export default async function CategoryPage({ searchParams,}) {
  const params = await searchParams;
  const query = params.query || '';
  const page = params.page || 1;

  const session = await auth();
  const isadmin = session.user.isadmin;

  const currentPage = Number(page);
  const totalPages = await fetchCategoryPages(query);
 
  return (
    <div className="w-full">
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-2">
        <Search placeholder="Search for categories..." />
        { isadmin ? <CreateCategoryBtn /> : "" }
      </div>
      <Suspense key={query + currentPage} >
        <Table query={query} currentPage={currentPage} />
      </Suspense>
        { page === 1 ? "" : 
            <div className="mt-5 flex w-full justify-center">
              <Pagination totalPages={totalPages} /> 
            </div>
        }
    </div>
  );
}