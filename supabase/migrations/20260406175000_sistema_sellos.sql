-- 1. Create Enums
CREATE TYPE sello_tipo AS ENUM ('automatico', 'manual');
CREATE TYPE sello_estado AS ENUM ('pendiente', 'aprobado', 'rechazado');

-- 2. Create sellos_catalogo
CREATE TABLE public.sellos_catalogo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    tipo sello_tipo NOT NULL,
    icono_url VARCHAR(255),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create constructora_sellos
CREATE TABLE public.constructora_sellos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    constructora_id UUID NOT NULL REFERENCES public.constructoras(id) ON DELETE CASCADE,
    sello_id UUID NOT NULL REFERENCES public.sellos_catalogo(id) ON DELETE CASCADE,
    estado sello_estado NOT NULL DEFAULT 'pendiente',
    comentario_admin TEXT,
    evidencia_url VARCHAR(255),
    otorgado_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(constructora_id, sello_id)
);

-- 4. Alter constructoras
ALTER TABLE public.constructoras 
ADD COLUMN IF NOT EXISTS anio_inicio INTEGER,
ADD COLUMN IF NOT EXISTS especialidad_principal VARCHAR(100),
ADD COLUMN IF NOT EXISTS porcentaje_completitud INTEGER DEFAULT 0;

-- 5. RLS Rules
ALTER TABLE public.sellos_catalogo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.constructora_sellos ENABLE ROW LEVEL SECURITY;

-- sellos_catalogo: Readable by everyone
CREATE POLICY "Sellos catalogo is readable by everyone" ON public.sellos_catalogo FOR SELECT USING (true);

-- constructora_sellos: Readable by everyone
CREATE POLICY "Constructora sellos read access" ON public.constructora_sellos FOR SELECT USING (true);

-- constructora_sellos: Constructoras can request (insert) their own manual seals
CREATE POLICY "Constructora can insert own sellos" ON public.constructora_sellos FOR INSERT WITH CHECK (auth.uid() = constructora_id AND estado = 'pendiente');

-- constructora_sellos: Admins can update stamps (approve/reject)
CREATE POLICY "Admins can update sellos" ON public.constructora_sellos
  FOR UPDATE
  USING (
    ((auth.jwt() -> 'app_metadata' ->> 'is_superadmin')::boolean = true) OR
    EXISTS (
      SELECT 1 FROM public.constructoras
      WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
    )
  );

-- constructora_sellos: Admins can delete if needed
CREATE POLICY "Admins can delete sellos" ON public.constructora_sellos
  FOR DELETE
  USING (
    ((auth.jwt() -> 'app_metadata' ->> 'is_superadmin')::boolean = true) OR
    EXISTS (
      SELECT 1 FROM public.constructoras
      WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
    )
  );

-- constructora_sellos: Constructoras can view their own pending/rejected
-- Note: the "read access" above already allows reading all, so this is fine.

-- 6. Insert Initial Catalog
INSERT INTO public.sellos_catalogo (slug, nombre, descripcion, tipo) VALUES
('perfil-completo', 'Perfil Completo', 'La empresa ha completado toda su información básica de presencia.', 'automatico'),
('empresa-activa', 'Empresa Activa', 'La empresa mantiene publicaciones o catálogos activos de forma regular.', 'automatico'),
('especialidad-definida', 'Especialidad Definida', 'La constructora ha definido claramente su área principal de trabajo.', 'automatico'),
('fotos-reales', 'Fotos Reales', 'Evidencia su trabajo tangible mediante galerías fotográficas directas de sus obras.', 'automatico'),
('experiencia-10-anos', '10+ Años de Experiencia', 'Más de una década de presencia y trayectoria sostenida en el rubro de la construcción.', 'automatico'),
('fechas-obra', 'Fechas Transparentes', 'Mantiene proyecciones claras publicando estimaciones de entrega, inicio y fin de obras.', 'automatico'),
('empresa-verificada', 'Empresa Verificada', 'Identidad y representatividad legal de la empresa comprobadas oficialmente por SolocasasChile.', 'manual'),
('info-comercial-validada', 'Info Comercial Validada', 'Datos de contacto, dirección física y canales de operación auditados.', 'manual');
