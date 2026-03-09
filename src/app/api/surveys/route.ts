import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import * as z from 'zod';

const createSurveySchema = z.object({
    title: z.string().min(1, 'Гарчиг оруулна уу'),
    description: z.string().optional(),
    questions: z.array(z.object({
        id: z.string(),
        type: z.enum(['short_text', 'long_text', 'single_choice', 'multiple_choice', 'rating']),
        text: z.string().min(1, 'Асуулт оруулна уу'),
        options: z.array(z.string()).optional(),
        required: z.boolean().default(false),
    })).min(1, 'Дор хаяж 1 асуулт нэмнэ үү'),
    is_active: z.boolean().optional().default(true),
});

export async function POST(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value
                    },
                },
            }
        );

        // Verify authentication
        const { data: { session }, error: authError } = await supabase.auth.getSession();
        if (authError || !session) {
            return NextResponse.json({ error: 'Нэвтрэх шаардлагатай' }, { status: 401 });
        }

        const body = await req.json();

        // Validate request body
        const validatedData = createSurveySchema.parse(body);

        // Insert into database
        const { data, error } = await supabase
            .from('surveys')
            .insert([{
                title: validatedData.title,
                description: validatedData.description,
                questions: validatedData.questions,
                is_active: validatedData.is_active,
            }])
            .select()
            .single();

        if (error) {
            console.error('Create survey error:', error);
            return NextResponse.json({ error: 'Судалгаа үүсгэхэд алдаа гарлаа' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Амжилттай үүсгэлээ', survey: data }, { status: 201 });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Буруу мэдээлэл', details: error.flatten().fieldErrors }, { status: 400 });
        }
        console.error('Survey API Error:', error);
        return NextResponse.json({ error: 'Дотоод алдаа гарлаа' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value
                    },
                },
            }
        );

        // Verify authentication
        const { data: { session }, error: authError } = await supabase.auth.getSession();
        if (authError || !session) {
            return NextResponse.json({ error: 'Нэвтрэх шаардлагатай' }, { status: 401 });
        }

        // Fetch user's business surveys or all surveys if admin mapping is simple
        const { data, error } = await supabase
            .from('surveys')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Fetch surveys error:', error);
            return NextResponse.json({ error: 'Судалгаа татахад алдаа гарлаа' }, { status: 500 });
        }

        return NextResponse.json({ surveys: data }, { status: 200 });

    } catch (error) {
        console.error('Survey API Error:', error);
        return NextResponse.json({ error: 'Дотоод алдаа гарлаа' }, { status: 500 });
    }
}
