-- 1. Crear tabla de categorías de materiales
CREATE TABLE IF NOT EXISTS material_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Crear tabla de proveedores de materiales
CREATE TABLE IF NOT EXISTS material_suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category_id UUID REFERENCES material_categories(id) ON DELETE CASCADE,
    region_slug TEXT NOT NULL, -- aysen, metropolitana, etc.
    address TEXT,
    phone TEXT,
    website TEXT,
    google_rating DECIMAL(2,1),
    google_place_id TEXT UNIQUE,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    raw_data JSONB, -- Guardamos toda la respuesta de SerpApi por si acaso
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Habilitar RLS
ALTER TABLE material_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_suppliers ENABLE ROW LEVEL SECURITY;

-- 4. Políticas (Lectura pública para ahora, pero el dashboard controlará quién lo ve en la UI)
CREATE POLICY "Lectura pública de categorías" ON material_categories FOR SELECT USING (true);
CREATE POLICY "Lectura pública de proveedores" ON material_suppliers FOR SELECT USING (true);

-- Permitir inserción/actualización a usuarios autenticados (el API route usa el server client)
CREATE POLICY "Inserción autenticada de proveedores" ON material_suppliers 
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Actualización autenticada de proveedores" ON material_suppliers 
  FOR UPDATE USING (auth.role() = 'authenticated');

-- 5. Insertar las 12 categorías SIP iniciales
INSERT INTO material_categories (name, slug, description) VALUES
('Paneles SIP (Muros, Tabiques, Techos)', 'paneles-sip', 'Sistemas de paneles aislantes estructurales'),
('Estructura Complementaria (Maderas/Uniones)', 'estructura-complementaria', 'Madera estructural, splines y refuerzos'),
('Sellos y Hermeticidad (Mastic/Espumas)', 'sellos-hermeticidad', 'Productos para estanqueidad térmica y de aire'),
('Control de Humedad (Membranas/WRB)', 'control-humedad', 'Barreras de humedad y membranas hidrófugas'),
('Fijaciones (Tornillos/Anclajes)', 'fijaciones-anclajes', 'Tornillos estructurales, conectores metálicos y pernos'),
('Revestimiento Exterior (Siding/EIFS)', 'revestimientos-exteriores', 'Soluciones de terminación exterior'),
('Revestimiento Interior (Yeso-Cartón/MGO)', 'revestimientos-interiores', 'Terminaciones de muros y cielos interiores'),
('Cubiertas y Techumbres', 'cubiertas-techos', 'Planchas, tejas y sistemas de evacuación de aguas'),
('Aberturas (Ventanas/Puertas)', 'ventanas-puertas', 'Sistemas de vanos térmicos y de acceso'),
('Instalaciones (Eléctrica/Sanitaria)', 'instalaciones', 'Canalizaciones y pasadas técnicas para SIP'),
('Fundaciones y Apoyo (Radier/Pilotes)', 'fundaciones', 'Estructuras de base y anclajes de arranque'),
('Materiales Premium (Alta Eficiencia)', 'materiales-premium', 'Soluciones de alto desempeño y terminaciones VIP')
ON CONFLICT (slug) DO NOTHING;
