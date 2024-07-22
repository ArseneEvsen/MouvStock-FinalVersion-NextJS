import { z } from 'zod';

// Définir l'énumération State
const State = {
  Faible: "Faible",
  Normal: "Normal"
};

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

const ProductSchema = z.object({
    barecode: z.string(),
    name: z.string(),
    brandName: z.string(),
    categoryName: z.string(),
    price: integerOrFloatWithTwoDecimalsSchema,
    stock: z.number().min(0).optional(),
    stockLimit: z.number().min(0).optional(),
    state: z.nativeEnum(State).nullable().optional(),
    image: z.string().optional()
});

export default ProductSchema;
