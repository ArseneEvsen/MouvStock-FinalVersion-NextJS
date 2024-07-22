import { z } from 'zod';

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

const BatchProductSchema = z.object({
    productId: z.string(),
    barecode: z.string(),
    quantity: z.number().min(0),
    name: z.string(),
    price: integerOrFloatWithTwoDecimalsSchema,
    image: z.string().optional()
    
  });

export default BatchProductSchema;
