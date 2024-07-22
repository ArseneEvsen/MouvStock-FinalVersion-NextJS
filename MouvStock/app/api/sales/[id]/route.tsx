import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

interface Props {
    params: { id: string };
}

// Route pour récupérer une vente
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const sale = await prisma.sale.findUnique({
        where: { id: parseInt(params.id) },
    });

    if (!sale) {
        return NextResponse.json({ error: 'Sale not found' }, { status: 404 });
    }

    return NextResponse.json(sale);
}

// Route pour supprimer une vente
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const sale = await prisma.sale.findUnique({
        where: { id: parseInt(params.id) },
    });

    if (!sale) {
        return NextResponse.json({ error: "Sale not found" }, { status: 404 });
    }

    await prisma.sale.delete({
        where: { id: parseInt(params.id) },
    });

    return NextResponse.json({ message: "The sale has been deleted" }, { status: 200 });
}
