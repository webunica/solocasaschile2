-- Tabla de favoritos: relación entre usuario y proveedor
CREATE TABLE IF NOT EXISTS supplier_favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    supplier_id UUID NOT NULL REFERENCES material_suppliers(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, supplier_id)
);

ALTER TABLE supplier_favorites ENABLE ROW LEVEL SECURITY;

-- Solo el dueño puede ver/crear/eliminar sus favoritos
CREATE POLICY "Favoritos: lectura propia" ON supplier_favorites
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Favoritos: insertar propio" ON supplier_favorites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Favoritos: eliminar propio" ON supplier_favorites
    FOR DELETE USING (auth.uid() = user_id);
