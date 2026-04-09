import { createClient } from "@/lib/supabase/server";

export async function searchSuppliersInGoogle(query: string) {
  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) {
    console.error("SERPAPI_KEY is not defined in environment variables");
    return [];
  }

  try {
    const response = await fetch(
      `https://serpapi.com/search.json?engine=google_maps&q=${encodeURIComponent(query)}&type=search&api_key=${apiKey}&hl=es&gl=cl`
    );
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`SerpApi failed: ${JSON.stringify(error)}`);
    }
    
    const data = await response.json();
    return data.local_results || [];
  } catch (error) {
    console.error("Error fetching from SerpApi:", error);
    return [];
  }
}

export async function syncSuppliersForCategory(categoryId: string, categoryName: string, regionName: string, regionSlug: string) {
  const supabase = await createClient();
  const query = `${categoryName} en ${regionName}, Chile`;
  
  const results = await searchSuppliersInGoogle(query);
  
  if (!results.length) return { count: 0 };

  const suppliersToInsert = results.map((res: any) => ({
    name: res.title,
    category_id: categoryId,
    region_slug: regionSlug,
    address: res.address,
    phone: res.phone,
    website: res.website,
    google_rating: res.rating || 0,
    google_place_id: res.place_id,
    latitude: res.gps_coordinates?.latitude,
    longitude: res.gps_coordinates?.longitude,
    raw_data: res
  }));

  const { data, error } = await supabase
    .from('material_suppliers')
    .upsert(suppliersToInsert, { onConflict: 'google_place_id' });

  if (error) {
    console.error("Error upserting suppliers:", error);
    throw error;
  }

  return { count: suppliersToInsert.length };
}
