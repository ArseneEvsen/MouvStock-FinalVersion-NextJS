import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import schema from "../schema";

interface Props {
    params: { id: string}
}

// Route GET pour récupérer une marque ou ses produits associés
export async function GET(request: NextRequest, { params }: Props) {
    const url = new URL(request.url);
    const includeProducts = url.searchParams.get('includeProducts');

    if (includeProducts) {
        // Inclure les produits associés à la marque
        const brandWithProducts = await prisma.brand.findUnique({
            where: { name: params.id },
            include: { products: true },
        });

        if (!brandWithProducts) {
            return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
        }

        return NextResponse.json(brandWithProducts.products);
    } else {
        // Récupérer uniquement la marque
        const brand = await prisma.brand.findUnique({
            where: { name: params.id },
        });

        if (!brand) {
            return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
        }

        return NextResponse.json(brand);
    }
}

// Route DELETE pour supprimer une marque
export async function DELETE(request: NextRequest, { params }: Props) {
    const brand = await prisma.brand.findUnique({
        where: { name: params.id }
    });

    if (!brand) {
        return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    await prisma.brand.delete({
        where: { name: brand.name }
    });

    return NextResponse.json({ message: "The brand has been deleted" }, { status: 200 });
}

// Route PUT pour modifier entièrement une marque
export async function PUT(request: NextRequest, { params }: Props) {
    const body = await request.json();
    const validation = schema.safeParse(body);
    if (!validation.success) {
        return NextResponse.json(validation.error.errors, { status: 400 });
    }

    const brand = await prisma.brand.findUnique({
        where: { name: params.id }
    });

    if (!brand) {
        return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    const updatedBrand = await prisma.brand.update({
        where: { name: brand.name },
        data: {
            name: body.name
        }
    });

    return NextResponse.json(updatedBrand);
}
