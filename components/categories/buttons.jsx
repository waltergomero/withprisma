import {
  PencilIcon,
  PlusIcon,
  TrashIcon,
  XCircleIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { deleteCategory } from "@/actions/category-actions";
import { Button } from "@/components/ui/button";

export function CreateCategoryBtn() {
  return (
    <Link
      href="/admin/categories/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Add New Category</span>{" "}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateCategoryBtn({ id }) {
  return (
    <Link
      href={`/admin/categories/${id}/edit`}  >
      <PencilIcon className="w-5 text-blue-500" />
    </Link>
  );
}

export function DeleteCategoryBtn({ id }) {
  const deleteCategoryWithId = deleteCategory.bind(null, id);
  return (
    <form action={deleteCategoryWithId}>
      <button >
        <TrashIcon className="w-4 text-rose-500" />
      </button>
    </form>
  );
}

export function CancelCategoryBtn() {
  return (
    <Link
      href="/admin/categories"
      className="flex h-10 items-center rounded-lg bg-gray-400 px-4 text-sm font-medium text-white transition-colors hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
    >
      <span className="hidden md:block">Cancel</span>{" "}
      <XCircleIcon className="h-6 md:ml-4" />
    </Link>
  );
}

export function SaveCategoryBtn() {
  return (
    <Button type="submit" 
    className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
      <span className="hidden md:block">Save Category</span>
      <PlusIcon className="h-6 md:ml-4" />
    </Button>
  );
}
