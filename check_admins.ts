import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function checkAdmins() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = (process.env.SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!;
  const supabase = createClient(url, key);

  console.log("\n=== BUSCANDO ADMINISTRADORES EN LA BD ===");
  
  // 1. Check constructoras table for 'role' column
  try {
    const { data: profiles, error } = await supabase
      .from("constructoras")
      .select("id, nombre, email, role")
      .or('role.eq.admin,role.eq.superadmin');

    if (error) {
      console.log("⚠️ Error or 'role' column missing in 'constructoras' table.");
      // Check if table exists but role doesn't
      const { data: all } = await supabase.from('constructoras').select('id, nombre, email').limit(5);
      console.log("Usuarios en tabla 'constructoras' (primeros 5):");
      all?.forEach(u => console.log(`- ${u.nombre} (${u.email || u.id})`));
    } else {
      console.log("Administradores encontrados:");
      profiles?.forEach(u => console.log(`✅ ${u.nombre} (${u.email}) - ROL: ${u.role}`));
    }
  } catch (e) {
    console.log("No se pudo consultar la tabla 'constructoras'.");
  }

  // 2. We can't easily check auth.users app_metadata via client SDK without Service Role Key
  // but if the user has Service Role Key in .env.local, we can try.
  if (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY) {
     console.log("\n=== BUSCANDO EN AUTH.USERS (Requiere Service Role Key) ===");
     try {
       const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();
       if (authError) {
         console.log("Error al listar usuarios de auth:", authError.message);
       } else {
         const admins = users.filter(u => 
           u.app_metadata?.is_superadmin === true || 
           u.app_metadata?.role === 'admin' || 
           u.user_metadata?.role === 'admin'
         );
         console.log("Admins en Auth encontrados:");
         admins.forEach(u => console.log(`✅ ${u.email} - Metadata Admin: ${JSON.stringify(u.app_metadata)}`));
       }
     } catch (e) {
       console.log("No se pudo acceder a Auth Admin API.");
     }
  } else {
    console.log("\n⚠️ SERVICE_ROLE_KEY no encontrada en .env.local. No puedo verificar auth.users directamente.");
  }
}

checkAdmins();
