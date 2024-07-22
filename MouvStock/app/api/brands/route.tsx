import { NextRequest, NextResponse } from "next/server";
import schema from "./schema";
import prisma from "@/prisma/client";

// Route pour récupérer toutes les marques
export async function GET(request: NextRequest) {
    const brands = await prisma.brand.findMany();

    return NextResponse.json(
        brands
    );
}

// Route pour créer une marque
export async function POST(request: NextRequest) {
    const body = await request.json();
    const validation = schema.safeParse(body);

    if(!validation.success) {
        return NextResponse.json(validation.error.errors, {status: 400});
    }

    const brand = await prisma.brand.create({
        data: {
            name: body.name
        }
    });

    return NextResponse.json({
        brand
    }, {status: 201}
    );
}
