'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/generate-insights-dashboard.ts';
import '@/ai/flows/send-stk-push.ts';
import '@/ai/flows/get-device-advice.ts';
import '@/ai/flows/submit-ticket.ts';
