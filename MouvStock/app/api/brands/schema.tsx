import { z } from 'zod';
import ProductSchema from "../products/schema";

const BrandSchema = z.object({
    name: z.string(), // Champ 'name' comme clé primaire
    products: z.array(ProductSchema).optional(), // Relation avec 'Products'
  });

export default BrandSchema;
