/* =====================================================
   SUPABASE
===================================================== */

const SUPABASE_URL =
    "https://dkvmnznkhoprdpqpcjlu.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable_UeDPQjcS4UoKkFaa2vPuhg_7DPsAQel";


const db =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );