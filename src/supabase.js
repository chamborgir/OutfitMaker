// src/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://aqpojvbscdselvartvkd.supabase.co";
const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxcG9qdmJzY2RzZWx2YXJ0dmtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMzEyODYsImV4cCI6MjA2NjcwNzI4Nn0.RClk-vBoSWWteKCm7zlCNKsaO6biGpJzinmLKUhhOSI";
export const supabase = createClient(supabaseUrl, supabaseKey);
