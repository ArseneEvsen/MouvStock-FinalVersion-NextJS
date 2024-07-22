import { NextRequest, NextResponse } from "next/server";
import schema from "./schema";
import prisma from "@/prisma/client";

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const state = url.searchParams.get('state');
    const brand = url.searchParams.get('brand');

    let products;

    // Construire la condition de filtrage de base
    const filterCondition: any = {};

    if (state === 'Faible') {
        filterCondition.state = 'Faible';
    } else if (state === 'Normal') {
        filterCondition.state = 'Normal';
    }

    if (brand) {
        filterCondition.brandName = brand;
    }

    // Récupérer les produits en fonction des conditions de filtrage
    products = await prisma.product.findMany({
        where: filterCondition
    });

    // Vérifier si des produits ont été trouvés
    if (products.length === 0) {
        // Si aucun produit n'est trouvé pour les critères spécifiés, renvoyer une erreur 404
        let errorMessage = 'Aucun produit trouvé';
        if (state && brand) {
            errorMessage += ` pour l'état "${state}" et la marque "${brand}"`;
        } else if (state) {
            errorMessage += ` pour l'état "${state}"`;
        } else if (brand) {
            errorMessage += ` pour la marque "${brand}"`;
        }
        return NextResponse.json({ error: errorMessage }, { status: 404 });
    }

    return NextResponse.json(products);
}

// Route pour créer un produit
export async function POST(request: NextRequest) {
    const body = await request.json();
    const validation = schema.safeParse(body);

    if (!validation.success) {
        return NextResponse.json(validation.error.errors, { status: 400 });
    }

    // Vérifier si le `barecode` existe dans la table `BatchProduct`
    const batchProductExists = await prisma.batchProduct.findUnique({
        where: { barecode: body.barecode },
    });

    if (batchProductExists) {
        return NextResponse.json(
            { error: `Un produit en lot avec le barecode ${body.barecode} existe déjà.` },
            { status: 400 }
        );
    }

    // Créer le produit si le `barecode` n'existe pas dans `BatchProduct`
    const product = await prisma.product.create({
        data: {
            barecode: body.barecode,
            name: body.name,
            brandName: body.brandName,
            categoryName: body.categoryName,
            price: parseFloat(body.price),
            stock: body.stock,
            stockLimit: body.stockLimit,
            state: body.state,
            image: body.image
        }
    });

    return NextResponse.json({ product }, { status: 201 });
}
