-- Permitir que las constructoras gestionen sus sellos automáticos mediante upsert

DROP POLICY IF EXISTS "Constructora can update automatic sellos" ON public.constructora_sellos;
CREATE POLICY "Constructora can update automatic sellos" ON public.constructora_sellos 
FOR UPDATE USING (
  auth.uid() = constructora_id AND 
  EXISTS (SELECT 1 FROM public.sellos_catalogo sc WHERE sc.id = sello_id AND sc.tipo = 'automatico')
);

DROP POLICY IF EXISTS "Constructora can insert automatic sellos" ON public.constructora_sellos;
CREATE POLICY "Constructora can insert automatic sellos" ON public.constructora_sellos 
FOR INSERT WITH CHECK (
  auth.uid() = constructora_id AND 
  estado = 'aprobado' AND 
  EXISTS (SELECT 1 FROM public.sellos_catalogo sc WHERE sc.id = sello_id AND sc.tipo = 'automatico')
);

DROP POLICY IF EXISTS "Constructora can delete automatic sellos" ON public.constructora_sellos;
CREATE POLICY "Constructora can delete automatic sellos" ON public.constructora_sellos 
FOR DELETE USING (
  auth.uid() = constructora_id AND 
  EXISTS (SELECT 1 FROM public.sellos_catalogo sc WHERE sc.id = sello_id AND sc.tipo = 'automatico')
);
