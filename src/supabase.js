import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://dczipqaufdxrxyejlgna.supabase.co",        // URL kamu
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjemlwcWF1ZmR4cnh5ZWpsZ25hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5NzExNTYsImV4cCI6MjA4MzU0NzE1Nn0.8wNXdnDooniiEl2rC8BDS8PdWDuzMFapon4gP-1hLsA"             // anon key
);
