import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

interface Props {
    params: { id: string };
}

// Route pour récupérer un produit
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const product = await prisma.product.findUnique({
        where: { barecode: params.id },
    });

    if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
}

// Route pour supprimer un produit
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const product = await prisma.product.findUnique({
        where: { barecode: params.id },
    });

    if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await prisma.product.delete({
        where: { barecode: product.barecode },
    });

    return NextResponse.json({ message: "The product has been deleted" }, { status: 200 });
}

// Route pour modifier entièrement un produit
export async function PUT(request: NextRequest, { params }: { params: { barecode: string } }) {
    const body = await request.json();

    // Assurez-vous que le corps de la requête contient uniquement les attributs valides
    const product = await prisma.product.findUnique({
        where: { barecode: params.barecode },
    });

    if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const updatedProduct = await prisma.product.update({
        where: { barecode: product.barecode },
        data: {
            name: body.name,
            price: parseFloat(body.price),
            stock: body.stock,
        },
    });

    return NextResponse.json(updatedProduct);
}

// Route pour modifier partiellement un produit (PATCH)
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    const body = await request.json();

    // Validation des données
    const updates: any = {};
    
    if (body.stock !== undefined) {
        const stock = parseInt(body.stock, 10);
        if (isNaN(stock) || stock < 0) {
            return NextResponse.json({ error: 'Invalid stock value' }, { status: 400 });
        }
        updates.stock = stock;
    }

    if (body.price !== undefined) {
        const price = parseFloat(body.price);
        if (isNaN(price) || price <= 0) {
            return NextResponse.json({ error: 'Invalid price value' }, { status: 400 });
        }
        updates.price = price;
    }

    if (body.stockLimit !== undefined) {
        const stockLimit = parseInt(body.stockLimit, 10);
        if (isNaN(stockLimit) || stockLimit < 0) {
            return NextResponse.json({ error: 'Invalid stockLimit value' }, { status: 400 });
        }
        updates.stockLimit = stockLimit;
    }

    // Vérifiez qu'aucun autre champ n'est présent
    const allowedFields = ['stock', 'price', 'stockLimit'];
    const bodyFields = Object.keys(body);

    for (const field of bodyFields) {
        if (!allowedFields.includes(field)) {
            return NextResponse.json({ error: `Field '${field}' is not allowed` }, { status: 400 });
        }
    }

    const product = await prisma.product.findUnique({
        where: { barecode: params.id },
    });

    if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const updatedProduct = await prisma.product.update({
        where: { barecode: product.barecode },
        data: updates,
    });

    return NextResponse.json(updatedProduct);
}
