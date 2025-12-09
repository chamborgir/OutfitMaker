// src/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://rccrdpkmoaderlhayggu.supabase.co";
const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjY3JkcGttb2FkZXJsaGF5Z2d1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyODYyMjQsImV4cCI6MjA4MDg2MjIyNH0.iMD26yhYmmtOm2Bp7brdc3hX5j96pXftIXfFeebblh0";
export const supabase = createClient(supabaseUrl, supabaseKey);
