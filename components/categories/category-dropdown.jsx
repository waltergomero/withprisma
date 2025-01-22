import React from 'react';
import {fetchCategories, } from '@/actions/category-actions'

const CategoryDropdown = async () => {
  const categories = await fetchCategories();
  return (
    <div>
        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Category:<span className="text-meta-1">*</span>
            </label>
        <select
              name="category_id"
              onClick={handleClick}
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 px-5 py-1 text-sm outline-2 placeholder:text-gray-500">
              <option value=""></option>
              {categories.map((category) => (
                <option key={category._id.toString()} value={category._id.toString()}>
                  {category.category_name}
                </option>
              ))}
        </select>
    </div>
  )
}

export default CategoryDropdown