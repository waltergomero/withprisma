import { z } from 'zod';

export const userRegistrationSchema = z.object({
  first_name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
  last_name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
});

export const userUpdateSchema = z.object({
  first_name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
  last_name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
  email: z.string().email({ message: 'Invalid email address' }),
});

export const userSigninSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 8 characters long' }),
});

export const statusSchema = z.object({
  status_name: z.string().min(2, { message: 'Status name must be at least 2 characters long' }),

});

export const categorySchema = z.object({
  category_name: z.string().min(2, { message: 'Category name must be at least 2 characters long' }),

});

export const productSchema = z.object({
  product_name: z.string().min(2, { message: 'Product name must be at least 2 characters long' }),
  slug: z.string().min(2, { message: 'Code name must be at least 2 characters long' }),
  category_id: z.string().min(2, { message: 'Category name must be selected' }),
});

