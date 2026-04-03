-- ============================================================
-- SOLOCASASCHILE V2 — TABLA DE PAGOS Y HISTORIAL
-- ============================================================

-- Crear tabla de pagos
CREATE TABLE IF NOT EXISTS public.pagos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    constructora_id UUID NOT NULL REFERENCES public.constructoras(id) ON DELETE CASCADE,
    flow_order TEXT UNIQUE,
    token TEXT,
    amount NUMERIC NOT NULL,
    currency TEXT DEFAULT 'CLP',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'rejected', 'canceled')),
    plan TEXT NOT NULL,
    billing_cycle TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE public.pagos ENABLE ROW LEVEL SECURITY;

-- Políticas de Seguridad
-- 1. Los Super Admins pueden ver todos los pagos
CREATE POLICY "superadmin_read_all_payments" ON public.pagos
    FOR SELECT 
    USING (
        auth.uid() IN (
            SELECT id FROM public.constructoras WHERE role = 'superadmin'
        )
    );

-- 2. Las constructoras solo pueden ver sus propios pagos
CREATE POLICY "owner_read_own_payments" ON public.pagos
    FOR SELECT 
    USING (auth.uid() = constructora_id);

-- 3. El sistema (vía service role) puede insertar y actualizar
-- Nota: En Supabase, el webhook usará el cliente de servidor que tiene privilegios.

-- Comentarios explicativos
COMMENT ON TABLE public.pagos IS 'Historial de transacciones de Flow para cada constructora';
