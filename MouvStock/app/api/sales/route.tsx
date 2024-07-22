import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

// Fonction pour obtenir les dates de début et de fin de la période spécifiée
const getDateRange = (period: string) => {
  const now = new Date();
  let startDate: Date;
  let endDate: Date;

  switch (period) {
    case 'weekly':
      // Début de la semaine (lundi)
      startDate = new Date(now);
      startDate.setDate(now.getDate() - ((now.getDay() + 6) % 7)); // Calculer le lundi de la semaine
      startDate.setHours(0, 0, 0, 0);
      // Fin de la semaine (dimanche)
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
      break;
    case 'annual':
      // Début de l'année
      startDate = new Date(now.getFullYear(), 0, 1);
      // Fin de l'année
      endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
      break;
    default:
      throw new Error('Invalid period');
  }

  return { startDate, endDate };
};

// Route pour récupérer toutes les ventes ou celles dans une période donnée
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period');
  const productId = searchParams.get('productId');

  try {
    const queryConditions: any = {};

    if (period) {
      const { startDate, endDate } = getDateRange(period);
      queryConditions.date = {
        gte: startDate.toISOString(), // Assurez-vous que startDate est une chaîne ISO
        lte: endDate.toISOString(),   // Assurez-vous que endDate est une chaîne ISO
      };
    }

    if (productId) {
      queryConditions.productId = productId;
    }

    const sales = await prisma.sale.findMany({
      where: queryConditions,
    });

    return NextResponse.json(sales);
  } catch (error) {
    // Vérifier si l'erreur est une instance de Error
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      // Erreur inconnue
      return NextResponse.json({ error: 'Une erreur inconnue est survenue' }, { status: 500 });
    }
  }
}

// Route pour créer une vente
export async function POST(request: NextRequest) {
  const body = await request.json();
  // Supposons que vous ayez une validation de schéma ici
  // const validation = schema.safeParse(body);

  // if (!validation.success) {
  //   return NextResponse.json(validation.error.errors, { status: 400 });
  // }

  try {
    const sale = await prisma.sale.create({
      data: {
        productId: body.productId,
        quantity: body.quantity,
        date: new Date().toISOString(), // Enregistrez la date actuelle en format ISO
        price: parseFloat(body.price),
      },
    });

    return NextResponse.json({ sale }, { status: 201 });
  } catch (error) {
    // Vérifier si l'erreur est une instance de Error
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      // Erreur inconnue
      return NextResponse.json({ error: 'Une erreur inconnue est survenue' }, { status: 500 });
    }
  }
}
