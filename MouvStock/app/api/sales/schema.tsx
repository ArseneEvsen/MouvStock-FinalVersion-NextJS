import { z } from 'zod';
import ProductSchema from "../products/schema";

// Schéma de validation personnalisé pour prendre en compte un type float avec maximum 2 valeurs après la virgule
const integerOrFloatWithTwoDecimalsSchema = z
  .string()
  .regex(/^\d+(\.\d{1,2})?$/)
  .refine(value => {
    const floatValue = parseFloat(value);
    return !isNaN(floatValue);
  }, {
    message: 'La valeur doit être un nombre entier ou un nombre float avec au maximum 2 décimales.'
  })
  .transform(value => parseFloat(value)); // Convertir la chaîne en float

const SaleSchema = z.object({
    productId: z.string(),
    quantity: z.number().min(0),
    price: integerOrFloatWithTwoDecimalsSchema,
    products: z.array(ProductSchema).optional(), // Relation avec 'Products'
  });

export default SaleSchema;
