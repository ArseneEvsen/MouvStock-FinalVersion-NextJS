import { NextRequest, NextResponse } from "next/server";
import schema from "./schema";
import prisma from "@/prisma/client";

// Route pour récupérer toutes les marques
export async function GET(request: NextRequest) {
    const categories = await prisma.category.findMany();

    return NextResponse.json(
        categories
    );
}

// Route pour créer une marque
export async function POST(request: NextRequest) {
    const body = await request.json();
    const validation = schema.safeParse(body);

    if(!validation.success) {
        return NextResponse.json(validation.error.errors, {status: 400});
    }

    const category = await prisma.category.create({
        data: {
            name: body.name
        }
    });

    return NextResponse.json({
        category
    }, {status: 201}
    );
}
