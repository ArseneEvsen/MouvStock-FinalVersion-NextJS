import { NextRequest, NextResponse } from "next/server";
import schema from "./schema";
import prisma from "@/prisma/client";

// Route pour récupérer tous les produits en lot
export async function GET(request: NextRequest) {
    const batchProducts = await prisma.batchProduct.findMany();

    return NextResponse.json(batchProducts);
}

// Route pour créer un produit en lot
export async function POST(request: NextRequest) {
    const body = await request.json();
    const validation = schema.safeParse(body);

    if (!validation.success) {
        return NextResponse.json(validation.error.errors, { status: 400 });
    }

    // Vérifier si le `barecode` existe dans la table `Product`
    const productExists = await prisma.product.findUnique({
        where: { barecode: body.barecode },
    });

    if (productExists) {
        return NextResponse.json(
            { error: `Un produit avec le barecode ${body.barecode} existe déjà.` },
            { status: 400 }
        );
    }

    // Créer le `BatchProduct` si le `barecode` n'existe pas dans `Product`
    const batchProduct = await prisma.batchProduct.create({
        data: {
            productId: body.productId,
            barecode: body.barecode,
            name: body.name,
            price: parseFloat(body.price),
            quantity: body.quantity,
            image: body.image
        }
    });

    return NextResponse.json({ batchProduct }, { status: 201 });
}
