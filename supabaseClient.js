// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sejgmmeirmvpkiehsyuk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlamdtbWVpcm12cGtpZWhzeXVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxMzE5MDIsImV4cCI6MjA1OTcwNzkwMn0.NsvDa9PBCdNhic9p_6uYVK8CdKyPpnT5KqbrMe49AK0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
