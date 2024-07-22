import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

interface Props {
    params: { id: string };
}

// Route pour récupérer un produit en lot
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const batchProduct = await prisma.batchProduct.findUnique({
        where: { barecode: params.id },
    });

    if (!batchProduct) {
        return NextResponse.json({ error: 'BatchProduct not found' }, { status: 404 });
    }

    return NextResponse.json(batchProduct);
}

// Route pour supprimer un produit en lot
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const batchProduct = await prisma.batchProduct.findUnique({
        where: { barecode: params.id },
    });

    if (!batchProduct) {
        return NextResponse.json({ error: "BatchProduct not found" }, { status: 404 });
    }

    await prisma.batchProduct.delete({
        where: { barecode: batchProduct.barecode },
    });

    return NextResponse.json({ message: "The batchProduct has been deleted" }, { status: 200 });
}

// Route pour modifier partiellement un produit en lot
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    const body = await request.json();

    // Validation des données
    const updates: any = {};

    if (body.name !== undefined) {
        updates.name = body.name;
    }

    if (body.price !== undefined) {
        const price = parseFloat(body.price);
        if (isNaN(price) || price <= 0) {
            return NextResponse.json({ error: 'Invalid price value' }, { status: 400 });
        }
        updates.price = price;
    }

    if (body.quantity !== undefined) {
        const quantity = parseInt(body.quantity, 10);
        if (isNaN(quantity) || quantity < 0) {
            return NextResponse.json({ error: 'Invalid quantity value' }, { status: 400 });
        }
        updates.quantity = quantity;
    }

    if (body.image !== undefined) {
        updates.image = body.image;
    }

    const batchProduct = await prisma.batchProduct.findUnique({
        where: { barecode: params.id },
    });

    if (!batchProduct) {
        return NextResponse.json({ error: "BatchProduct not found" }, { status: 404 });
    }

    const updatedBatchProduct = await prisma.batchProduct.update({
        where: { barecode: batchProduct.barecode },
        data: updates,
    });

    return NextResponse.json(updatedBatchProduct);
}
