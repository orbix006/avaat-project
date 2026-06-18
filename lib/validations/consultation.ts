import { z } from 'zod';

export const consultationSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  email: z.string().min(1, 'Email is required.').email('Email is invalid.'),
  phone: z.string()
    .min(1, 'Phone number is required.')
    .regex(/^[+0-9\s-()]{10,}$/, 'Phone number is invalid.'),
  projectType: z.enum(['Residential Interior', 'Commercial Interior', 'Architecture', 'Renovation', 'Turnkey Project', 'Other'], {
    required_error: 'Please select a project type',
  }),
  budget: z.enum(['Under ₹5L', '₹5L–₹15L', '₹15L–₹30L', '₹30L–₹50L', '₹50L+'], {
    required_error: 'Please select a budget range',
  }),
  message: z.string().min(10, 'Message is too short (minimum 10 characters).'),
});

export type ConsultationFormData = z.infer<typeof consultationSchema>;