import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import schema from "../schema";

interface Props {
    params: { id: string}
}

// Route GET pour récupérer une categorie ou ses produits associés
export async function GET(request: NextRequest, { params }: Props) {
    const url = new URL(request.url);
    const includeProducts = url.searchParams.get('includeProducts');

    if (includeProducts) {
        // Inclure les produits associés à la categorie
        const categoryWithProducts = await prisma.category.findUnique({
            where: { name: params.id },
            include: { products: true },
        });

        if (!categoryWithProducts) {
            return NextResponse.json({ error: 'category not found' }, { status: 404 });
        }

        return NextResponse.json(categoryWithProducts.products);
    } else {
        // Récupérer uniquement la categorie
        const category = await prisma.category.findUnique({
            where: { name: params.id },
        });

        if (!category) {
            return NextResponse.json({ error: 'category not found' }, { status: 404 });
        }

        return NextResponse.json(category);
    }
}

// Route DELETE pour supprimer une categorie
export async function DELETE(request: NextRequest, { params }: Props) {
    const category = await prisma.category.findUnique({
        where: { name: params.id }
    });

    if (!category) {
        return NextResponse.json({ error: "category not found" }, { status: 404 });
    }

    await prisma.category.delete({
        where: { name: category.name }
    });

    return NextResponse.json({ message: "The category has been deleted" }, { status: 200 });
}

// Route PUT pour modifier entièrement une categorie
export async function PUT(request: NextRequest, { params }: Props) {
    const body = await request.json();
    const validation = schema.safeParse(body);
    if (!validation.success) {
        return NextResponse.json(validation.error.errors, { status: 400 });
    }

    const category = await prisma.category.findUnique({
        where: { name: params.id }
    });

    if (!category) {
        return NextResponse.json({ error: "category not found" }, { status: 404 });
    }

    const updatedCategory = await prisma.category.update({
        where: { name: category.name },
        data: {
            name: body.name
        }
    });

    return NextResponse.json(updatedCategory);
}
