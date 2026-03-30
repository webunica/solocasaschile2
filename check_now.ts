import { createClient } from "@supabase/supabase-js";

async function verify() {
  const url = "https://pereskyvymsyiqbihydj.supabase.co";
  const key = "sb_publishable_DlGqRTtFRbRidTplcMbMmw_6XgeFuuI";
  const supabase = createClient(url, key);

  console.log("=== LISTADO DE ROLES ===");
  const { data: cons } = await supabase
    .from("constructoras")
    .select("nombre, email, role, id");
  
  if (!cons?.length) {
    console.log("No hay usuarios.");
    return;
  }

  cons.forEach((c: any) => {
    console.log(`USUARIO: ${c.nombre} <${c.email || c.id}> | ROL: ${c.role}`);
  });
}

verify();
