import { createClient } from "@supabase/supabase-js";

// Conexão com o banco. Usa a chave secreta, então só pode ser usada no servidor.
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { auth: { persistSession: false } }
);
