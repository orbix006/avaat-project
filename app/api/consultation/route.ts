import { NextRequest, NextResponse } from 'next/server';
import { consultationSchema } from '@/lib/validations/consultation';
import { createServerClient } from '@/lib/supabase/server';
import { LeadAutomation } from '@/lib/automation';
import { getFriendlyErrorMessage } from '@/lib/error-handler';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Validate the form payload
    const result = consultationSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = result.data;

    // 2. Obtain Supabase server client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    console.log(`[BOOK CONSULTATION CONNECTION CHECK] URL: ${supabaseUrl ? 'Configured' : 'Missing'}, Anon Key: ${supabaseAnonKey ? 'Configured' : 'Missing'}`);

    const supabase = createServerClient();
    if (!supabase) {
      console.warn('Supabase URL or Key is missing. Skipping database write and returning mock success.');
      return NextResponse.json({ success: true, mocked: true });
    }

    // Map user-friendly dropdown options to database enums
    const projectTypeMapping: Record<string, string> = {
      'Residential Interior': 'interior_design',
      'Commercial Interior': 'commercial_fit_out',
      'Architecture': 'new_construction',
      'Renovation': 'renovation',
      'Turnkey Project': 'landscape',
      'Other': 'consultation_only',
    };

    const budgetMapping: Record<string, string> = {
      'Under ₹5L': 'under_5L',
      '₹5L–₹15L': '5L_to_15L',
      '₹15L–₹30L': '15L_to_30L',
      '₹30L–₹50L': '30L_to_60L',
      '₹50L+': 'above_1Cr',
    };

    const project_type = projectTypeMapping[data.projectType] || 'consultation_only';
    const budget_range = budgetMapping[data.budget] || 'to_be_discussed';

    // 3. Perform database insert into consultation_requests
    const { data: insertedLead, error } = await supabase
      .from('consultation_requests')
      .insert({
        name: data.name,
        email: data.email,
        phone: data.phone,
        budget_range: budget_range,
        project_type: project_type,
        message: data.message,
        source: 'website'
      } as any)
      .select('id')
      .single();

    const newLead = insertedLead as { id: string } | null;

    if (error || !newLead) {
      const friendlyMessage = getFriendlyErrorMessage(error || new Error('Lead ID is missing after insertion.'));
      console.error('[BOOK CONSULTATION DB WRITE ERROR] Insertion failed:', error);
      return NextResponse.json(
        { success: false, message: friendlyMessage },
        { status: 500 }
      );
    }

    // 4. Trigger Lead Automation System
    // This handles history logging, admin emails, and client auto-responders.
    await LeadAutomation.handleNewLead(newLead.id, {
      name: data.name,
      email: data.email,
      phone: data.phone,
      budget: data.budget,
      projectType: data.projectType,
      message: data.message,
      source: 'website'
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    const friendlyMessage = getFriendlyErrorMessage(err);
    console.error('Server error in consultation route:', err);
    return NextResponse.json(
      { success: false, message: friendlyMessage },
      { status: 500 }
    );
  }
}