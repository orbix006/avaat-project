import { createServerClient } from './supabase/server';
import { sendAdminNotification } from './email';
import { NewLeadEmail } from '@/components/emails/NewLeadEmail';
import { ThankYouEmail } from '@/components/emails/ThankYouEmail';
import { Resend } from 'resend';

// Only needed here to send email to the client directly
const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key');
const SYSTEM_FROM = process.env.SYSTEM_EMAIL_FROM || 'notifications@avaat.in';

export interface LeadData {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  budget: string;
  message?: string;
  source?: string;
}

export class LeadAutomation {
  /**
   * Orchestrates the entire workflow when a new lead is created.
   */
  static async handleNewLead(leadId: string, data: LeadData) {
    console.log(`[Automation] Triggering workflow for new lead: ${leadId}`);

    // 1. Log Activity
    await this.logActivity(
      leadId, 
      'pending', 
      'pending', 
      'Lead captured via Website form. Automation workflow triggered.'
    );

    // 2. Notify Admins
    await this.notifyAdmins(data);

    // 3. Send Thank You Email to Prospect
    await this.sendThankYouEmail(data);

    // 4. Future Architecture: Lead Assignment & Follow-Up
    await this.assignLead(leadId);
    await this.scheduleFollowUp(leadId);
  }

  /**
   * Logs an activity to the consultation_status_history table.
   */
  private static async logActivity(leadId: string, oldStatus: string, newStatus: string, notes: string) {
    const supabase = createServerClient();
    const { error } = await supabase
      .from('consultation_status_history')
      .insert({
        consultation_id: leadId,
        old_status: oldStatus,
        new_status: newStatus,
        notes: notes
      } as any);

    if (error) {
      console.error(`[Automation Error] Failed to log activity for lead ${leadId}:`, error.message);
    }
  }

  /**
   * Dispatches the internal admin notification.
   */
  private static async notifyAdmins(data: LeadData) {
    await sendAdminNotification(
      `New Lead: ${data.name} - ${data.projectType}`,
      NewLeadEmail({
        name: data.name,
        email: data.email,
        phone: data.phone,
        budget: data.budget,
        projectType: data.projectType,
        message: data.message || '',
      })
    );
  }

  /**
   * Sends a confirmation auto-responder to the prospect.
   */
  private static async sendThankYouEmail(data: LeadData) {
    if (!process.env.RESEND_API_KEY) {
      console.log(`[Automation Mock] Would send Thank You email to ${data.email}`);
      return;
    }

    try {
      const { error } = await resend.emails.send({
        from: `AVAAT Team <${SYSTEM_FROM}>`,
        to: [data.email],
        subject: 'Thank you for your inquiry',
        react: ThankYouEmail({ name: data.name }),
      });

      if (error) {
        console.error(`[Automation Error] Failed to send Thank You email to ${data.email}:`, error);
      }
    } catch (error) {
      console.error(`[Automation Error] Exception sending Thank You email:`, error);
    }
  }

  /**
   * Placeholder: Assigns the lead to a team member.
   */
  private static async assignLead(leadId: string) {
    console.log(`[Automation Architecture] Routing lead ${leadId} to default Admin...`);
    // Future implementation: Query admins, apply round-robin, update `assigned_to` field.
  }

  /**
   * Placeholder: Schedules a follow-up reminder.
   */
  private static async scheduleFollowUp(leadId: string) {
    console.log(`[Automation Architecture] Scheduling 24hr follow-up reminder for lead ${leadId}...`);
    // Future implementation: We log a future-dated task or reminder in the CRM.
    await this.logActivity(
      leadId,
      'pending',
      'pending',
      '[SYSTEM TASK] Automated Follow-up Reminder: Contact this lead within 24 hours.'
    );
  }
}
