import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Términos y Condiciones | SolocasasChile.com",
  description: "Descubre y compara casas prefabricadas, SIP, modulares y llave en mano en Chile. Más de 200 modelos de las mejores constructoras del país.",
};

export default function TerminosPage() {
  return (
    <main className="min-h-screen pt-32 pb-20 bg-background">
      <div className="container max-w-4xl mx-auto px-6">
        
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-8">
           <ArrowLeft className="w-4 h-4" /> Volver al Inicio
        </Link>
        
        <div className="bg-card p-8 md:p-12 rounded-[2rem] border border-border/40 shadow-xl shadow-primary/5">
          <div className="space-y-4 border-b border-border/40 pb-10 mb-10">
            <h1 className="text-4xl md:text-5xl font-black font-heading tracking-tighter">Términos y Condiciones</h1>
            <p className="text-muted-foreground font-medium flex items-center gap-4">
               <span className="w-2 h-2 rounded-full bg-primary" />
               Última actualización: 2 de marzo de 2026
            </p>
          </div>

          <div className="space-y-6 text-muted-foreground text-foreground">
            
            <p className="text-lg leading-relaxed text-foreground">
              Bienvenido a SolocasasChile.com. Los presentes Términos y Condiciones regulan el acceso, navegación y uso del sitio web <a href="https://www.solocasaschile.com" className="text-primary font-bold hover:underline">www.solocasaschile.com</a>, así como de todos sus contenidos, herramientas, formularios, directorios, comparadores, perfiles empresariales, publicaciones premium, catálogos, servicios promocionales y funcionalidades relacionadas.
            </p>
            <p className="leading-relaxed">
              Al acceder, navegar o utilizar el sitio, el usuario declara haber leído, entendido y aceptado íntegramente estos Términos y Condiciones. Si no está de acuerdo con ellos, deberá abstenerse de utilizar el sitio.
            </p>

            <h2 className="text-2xl font-black font-heading tracking-tight text-foreground mt-12 mb-6">1. Naturaleza de la plataforma</h2>
            <p className="leading-relaxed">
              SolocasasChile.com es una plataforma digital de carácter informativo, comercial y publicitario, orientada a la exhibición, comparación, difusión y promoción de soluciones habitacionales, incluyendo, entre otras, casas prefabricadas, casas SIP, casas modulares, panelizadas, estructuras habitacionales, constructoras, fabricantes, distribuidores y servicios relacionados.
            </p>
            <p className="leading-relaxed">La plataforma tiene como objetivos principales:</p>
            <ul className="list-disc pl-6 space-y-2 leading-relaxed">
              <li>mostrar publicaciones de empresas del rubro;</li>
              <li>facilitar el contacto entre usuarios interesados y empresas anunciantes;</li>
              <li>generar y derivar oportunidades comerciales o leads;</li>
              <li>ofrecer espacios de visibilidad pagada, publicaciones premium y catálogos empresariales;</li>
              <li>permitir, en ciertos casos, la administración o edición parcial de contenidos por parte de empresas autorizadas.</li>
            </ul>
            <p className="leading-relaxed">
              SolocasasChile no actúa, por regla general, como vendedor directo, fabricante, constructor, inmobiliaria, mandataria, corredora, representante legal ni garante de las empresas publicadas, salvo que ello se indique expresamente en un documento separado o en una sección específica del sitio.
            </p>

            <h2 className="text-2xl font-black font-heading tracking-tight text-foreground mt-12 mb-6">2. Contacto</h2>
            <p className="leading-relaxed">
              Para efectos de contacto general, consultas, solicitudes comerciales, temas de contenido o aspectos relacionados con estos términos, se encuentra disponible el siguiente correo:<br/>
              <strong>Correo electrónico:</strong> <a href="mailto:solicitud@solocasaschile.com" className="text-primary font-bold hover:underline">solicitud@solocasaschile.com</a>
            </p>

            <h2 className="text-2xl font-black font-heading tracking-tight text-foreground mt-12 mb-6">3. Aceptación y capacidad</h2>
            <p className="leading-relaxed">
              El uso del sitio implica aceptación plena de estos términos. El usuario declara que:
            </p>
            <ul className="list-disc pl-6 space-y-2 leading-relaxed">
              <li>tiene capacidad legal suficiente para aceptar estas condiciones;</li>
              <li>utilizará el sitio de forma lícita y responsable;</li>
              <li>toda información entregada en formularios será veraz, actualizada y suficiente.</li>
            </ul>
            <p className="leading-relaxed">
              Si una persona utiliza el sitio en representación de una empresa, declara contar con facultades suficientes para obligarla en relación con las acciones que realice dentro del sitio.
            </p>

            <h2 className="text-2xl font-black font-heading tracking-tight text-foreground mt-12 mb-6">4. Usuarios del sitio</h2>
            <p className="leading-relaxed">Para efectos de estos términos, se entenderá que pueden existir, entre otros, los siguientes tipos de usuarios:</p>
            <ul className="list-disc pl-6 space-y-2 leading-relaxed">
              <li><strong>usuarios visitantes:</strong> personas que navegan o consultan contenidos del sitio;</li>
              <li><strong>usuarios interesados o leads:</strong> personas que solicitan información, cotizaciones o contacto;</li>
              <li><strong>empresas anunciantes:</strong> constructoras, fabricantes, distribuidores o prestadores que contratan visibilidad;</li>
              <li><strong>usuarios autorizados de edición:</strong> personas habilitadas por SolocasasChile para cargar, actualizar o modificar contenidos específicos.</li>
            </ul>
            <p className="leading-relaxed">Cada categoría podrá estar sujeta a reglas adicionales, incluso si no están publicadas de forma separada.</p>

            <h2 className="text-2xl font-black font-heading tracking-tight text-foreground mt-12 mb-6">5. Uso permitido del sitio</h2>
            <p className="leading-relaxed">El usuario se obliga a utilizar el sitio de buena fe, conforme a la ley, al order público y a estos términos.</p>
            <p className="leading-relaxed">Queda expresamente prohibido:</p>
            <ul className="list-disc pl-6 space-y-2 leading-relaxed">
              <li>utilizar el sitio con fines ilícitos, engañosos o fraudulentos;</li>
              <li>suplantar identidad o proporcionar antecedentes falsos;</li>
              <li>afectar la seguridad, estabilidad o funcionamiento del sitio;</li>
              <li>copiar, descargar, indexar, extraer o reutilizar masivamente contenidos, fichas o bases de datos sin autorización expresa;</li>
              <li>usar robots, scrapers, spiders, scripts automatizados o herramientas de extracción sistemática;</li>
              <li>intervenir espacios no autorizados del sitio;</li>
              <li>alterar publicaciones ajenas;</li>
              <li>enviar spam, mensajes masivos, publicidad no autorizada o solicitudes abusivas;</li>
              <li>cargar contenido falso, ofensivo, ilegal, difamatorio, engañoso o que infrinja derechos de terceros;</li>
              <li>usar la marca SolocasasChile o su contenido con fines comerciales no autorizados.</li>
            </ul>
            <p className="leading-relaxed">SolocasasChile podrá suspender, bloquear, restringir o eliminar accesos y contenidos cuando detecte incumplimientos, sin necesidad de aviso previo.</p>

            <h2 className="text-2xl font-black font-heading tracking-tight text-foreground mt-12 mb-6">6. Formularios y captación de leads</h2>
            <p className="leading-relaxed">El sitio puede incluir formularios de contacto, solicitud de información, cotización, comparación, interés por modelos, solicitud de catálogos y requerimientos comerciales.</p>
            <p className="leading-relaxed">Al completar y enviar un formulario, el usuario acepta expresamente que:</p>
            <ul className="list-disc pl-6 space-y-2 leading-relaxed">
              <li>sus datos serán procesados para atender su consulta;</li>
              <li>su solicitud podrá ser derivada a una o más empresas que contratan servicios dentro de la plataforma;</li>
              <li>SolocasasChile podrá actuar como canal de contacto y derivación comercial;</li>
              <li>el envío del formulario no garantiza contratación, disponibilidad, precio, stock, respuesta inmediata ni cierre de negocio;</li>
              <li>una misma consulta podrá ser evaluada, clasificada, redireccionada o compartida con empresas relacionadas al interés manifestado por el usuario.</li>
            </ul>
            <p className="leading-relaxed">El usuario acepta que la derivación de leads forma parte esencial del modelo de negocio de SolocasasChile.</p>

            <h2 className="text-2xl font-black font-heading tracking-tight text-foreground mt-12 mb-6">7. Derivación de leads a empresas anunciantes</h2>
            <p className="leading-relaxed">SolocasasChile podrá derivar los antecedentes del usuario a empresas constructoras, fabricantes, distribuidores u otros anunciantes que mantengan publicaciones activas o contratos comerciales vigentes con la plataforma.</p>
            <p className="leading-relaxed">La derivación podrá incluir, según el caso: nombre, teléfono, correo electrónico, comuna o región, tipo de vivienda buscada, presupuesto estimado, mensaje ingresado, y otros antecedentes voluntariamente proporcionados.</p>
            <p className="leading-relaxed">El usuario entiende y acepta que, una vez derivado el lead, la empresa receptora será responsable del tratamiento posterior de dichos antecedentes dentro del marco de su propia gestión comercial.</p>

            <h2 className="text-2xl font-black font-heading tracking-tight text-foreground mt-12 mb-6">8. Servicios para empresas anunciantes</h2>
            <p className="leading-relaxed">SolocasasChile podrá ofrecer servicios pagados a empresas del rubro, incluyendo, entre otros: publicación estándar de productos o modelos, publicaciones premium, espacios destacados, perfiles empresariales, publicación del catálogo completo, inclusión prioritaria en comparadores o resultados, servicios promocionales, acceso restringido para edición o administración de contenido, y campañas de visibilidad adicional.</p>
            <p className="leading-relaxed">La contratación de cualquiera de estos servicios no otorga a la empresa propiedad sobre el sitio, ni control sobre su estructura general, diseño, categorización, ranking, posicionamiento interno ni criterios editoriales.</p>
            <p className="leading-relaxed">SolocasasChile se reserva el derecho de definir el formato, ubicación, jerarquía visual, duración, diseño y modalidad de presentación de cada publicación.</p>

            <h2 className="text-2xl font-black font-heading tracking-tight text-foreground mt-12 mb-6">9. Acceso de edición para empresas o terceros</h2>
            <p className="leading-relaxed">En ciertos casos, SolocasasChile podrá conceder accesos limitados para que empresas anunciantes o terceros autorizados actualicen contenidos específicos.</p>
            <p className="leading-relaxed">Dichos accesos son personales, restringidos y revocables; no transfieren propiedad ni control sobre la plataforma; se limitan al ámbito expresamente autorizado; y podrán ser suspendidos o eliminados en cualquier momento.</p>
            <p className="leading-relaxed">La empresa o usuario autorizado será plenamente responsable por toda acción realizada con sus credenciales o accesos. SolocasasChile no será responsable por pérdidas, errores, daños o conflictos originados en el mal uso de accesos otorgados a terceros.</p>

            <h2 className="text-2xl font-black font-heading tracking-tight text-foreground mt-12 mb-6">10. Responsabilidad por contenido publicado por empresas</h2>
            <p className="leading-relaxed">Toda empresa anunciante, constructora, fabricante o tercero que publique, cargue, edite o actualice contenido en el sitio declara y garantiza que tiene derecho a utilizar los materiales que publique, que la información es veraz, y que no infringe derechos de propiedad intelectual ni normas aplicables.</p>
            <p className="leading-relaxed">La empresa será la única responsable frente a SolocasasChile, usuarios y terceros por cualquier reclamo derivado del contenido que publique, y se obliga a mantener indemne a SolocasasChile frente a cualquier reclamo relacionado.</p>

            <h2 className="text-2xl font-black font-heading tracking-tight text-foreground mt-12 mb-6">11. Facultad editorial, moderación y retiro de contenidos</h2>
            <p className="leading-relaxed">SolocasasChile podrá, en cualquier momento y a su sola discreción, revisar, corregir, ajustar, ocultar, rechazar, suspender, retirar o eliminar contenidos, perfiles o publicaciones, especialmente cuando existan errores evidentes, contenido engañoso, información incompleta, riesgos legales, infracción de estos términos, falta de pago o mal uso de accesos.</p>
            <p className="leading-relaxed">La moderación de contenidos por parte de SolocasasChile no implica asumir responsabilidad sobre el fondo del material publicado por terceros.</p>

            <h2 className="text-2xl font-black font-heading tracking-tight text-foreground mt-12 mb-6">12. Publicaciones, precios y carácter referencial</h2>
            <p className="leading-relaxed">Toda información publicada en el sitio respecto de modelos, viviendas, superficies, materiales, promociones, tiempos, costos, descuentos, montos "desde", especificaciones, plazos o beneficios tendrá carácter referencial, salvo que se indique expresamente lo contrario.</p>
            <p className="leading-relaxed">Los precios finales y condiciones efectivas deberán ser confirmados directamente con la empresa anunciante correspondiente.</p>

            <h2 className="text-2xl font-black font-heading tracking-tight text-foreground mt-12 mb-6">13. Relación entre usuarios y empresas</h2>
            <p className="leading-relaxed">Toda relación comercial que se produzca entre un usuario y una empresa publicada será de exclusiva responsabilidad de dichas partes. SolocasasChile no será responsable por incumplimientos contractuales de terceros, atrasos, diferencias de precio, fallas de producto o servicio, defectos constructivos, garantías, permisos, instalación, pérdidas económicas ni reclamos posteriores a la derivación del lead.</p>

            <h2 className="text-2xl font-black font-heading tracking-tight text-foreground mt-12 mb-6">14. Sin garantía de resultados comerciales</h2>
            <p className="leading-relaxed">SolocasasChile no garantiza a empresas anunciantes cantidad mínima de visitas, cantidad mínima de leads, ventas, conversiones, posicionamiento específico, retorno comercial, exclusividad territorial, ni resultados de negocio determinados.</p>
            <p className="leading-relaxed">Toda contratación de espacios publicitarios, publicaciones premium o catálogos se entiende como un servicio de visibilidad digital, no como una garantía de ventas o resultados concretos.</p>

            <h2 className="text-2xl font-black font-heading tracking-tight text-foreground mt-12 mb-6">15. Pagos, vigencia y suspensión de servicios comerciales</h2>
            <p className="leading-relaxed">Los servicios contratados por empresas podrán estar sujetos a tarifas, plazos, renovaciones, vencimientos, suspensiones o eliminaciones por mora o incumplimiento.</p>
            <p className="leading-relaxed">Los pagos efectuados por servicios publicitarios, publicaciones o visibilidad digital no serán reembolsables una vez iniciado el servicio, salvo acuerdo expreso en contrario.</p>

            <h2 className="text-2xl font-black font-heading tracking-tight text-foreground mt-12 mb-6">16. Propiedad intelectual</h2>
            <p className="leading-relaxed">Todos los elementos propios de SolocasasChile, incluyendo diseño, estructura, textos propios, comparadores, funcionalidades, programación, organización del contenido, gráficos, identidad visual, nombre comercial y demás componentes distintivos del sitio, son de propiedad de su titular o de sus respectivos licenciantes.</p>
            <p className="leading-relaxed">Queda prohibida su reproducción, copia, distribución, transformación, extracción o explotación sin autorización previa y escrita.</p>

            <h2 className="text-2xl font-black font-heading tracking-tight text-foreground mt-12 mb-6">17. Datos personales</h2>
            <p className="leading-relaxed">El usuario autoriza a SolocasasChile a recopilar y tratar los datos que entregue voluntariamente por medio del sitio, con finalidades como responder consultas, gestionar solicitudes, derivar leads, contactar usuarios, ofrecer información comercial, mejorar la operación del sitio, realizar seguimiento comercial y elaborar métricas internas.</p>
            <p className="leading-relaxed">Cuando el usuario solicite información sobre una empresa o publicación determinada, acepta que sus datos podrán ser compartidos con dicha empresa o con empresas relacionadas al requerimiento.</p>

            <h2 className="text-2xl font-black font-heading tracking-tight text-foreground mt-12 mb-6">18. Cookies y herramientas de seguimiento</h2>
            <p className="leading-relaxed">El sitio podrá utilizar cookies, píxeles, analítica, etiquetas de seguimiento y tecnologías similares para mejorar la navegación, recordar preferencias, medir tráfico, optimizar campañas y evaluar comportamiento de usuarios.</p>
            <p className="leading-relaxed">El uso continuado del sitio podrá entenderse como aceptación de estas herramientas, sin perjuicio de la configuración que cada usuario realice en su navegador.</p>

            <h2 className="text-2xl font-black font-heading tracking-tight text-foreground mt-12 mb-6">19. Sitios externos y enlaces de terceros</h2>
            <p className="leading-relaxed">SolocasasChile puede incluir enlaces a sitios web de empresas, catálogos externos, formularios externos, WhatsApp, redes sociales y plataformas de terceros. SolocasasChile no controla ni garantiza el contenido, seguridad, funcionamiento o políticas de dichos sitios, por lo que no responde por daños derivados del acceso o uso de plataformas externas.</p>

            <h2 className="text-2xl font-black font-heading tracking-tight text-foreground mt-12 mb-6">20. Exclusión de garantías</h2>
            <p className="leading-relaxed">El sitio se ofrece "tal cual" y "según disponibilidad". SolocasasChile no garantiza que funcionará sin interrupciones, estará libre de errores, el contenido estará siempre actualizado, ni que el sistema será compatible con todos los dispositivos. El usuario utiliza el sitio bajo su propio riesgo.</p>

            <h2 className="text-2xl font-black font-heading tracking-tight text-foreground mt-12 mb-6">21. Limitación de responsabilidad</h2>
            <p className="leading-relaxed">En la máxima medida permitida por la normativa aplicable, SolocasasChile no será responsable por daños directos, indirectos, incidentales, emergentes, reputacionales o patrimoniales derivados del uso del sitio, errores en publicaciones, contenido de terceros, fallas de sistema, pérdida de datos o decisiones de contratación basadas en información del sitio.</p>
            <p className="leading-relaxed">Si por resolución competente llegare a establecerse responsabilidad de SolocasasChile, dicha responsabilidad quedará limitada, como máximo, al monto efectivamente pagado por esa empresa por el servicio específico directamente vinculado al reclamo.</p>

            <h2 className="text-2xl font-black font-heading tracking-tight text-foreground mt-12 mb-6">22. Indemnidad</h2>
            <p className="leading-relaxed">Las empresas anunciantes, usuarios con acceso de edición y terceros que publiquen o administren contenido se obligan a defender, indemnizar y mantener indemne a SolocasasChile frente a cualquier demanda, acción, multa, perjuicio, sanción, gasto u honorario derivado de contenido publicado por ellos, uso indebido del sitio, infracción de estos términos o conflictos comerciales con usuarios finales.</p>

            <h2 className="text-2xl font-black font-heading tracking-tight text-foreground mt-12 mb-6">23. Suspensión o terminación</h2>
            <p className="leading-relaxed">SolocasasChile podrá suspender, limitar o terminar el acceso al sitio, a servicios específicos o a publicaciones concretas, en cualquier momento, sin necesidad de aviso previo, especialmente si detecta incumplimiento de estos términos, riesgo legal, mal uso del sistema, no pago, conflictos reiterados, información falsa o afectación reputacional del sitio.</p>

            <h2 className="text-2xl font-black font-heading tracking-tight text-foreground mt-12 mb-6">24. Modificaciones</h2>
            <p className="leading-relaxed">SolocasasChile podrá modificar, actualizar o reemplazar estos Términos y Condiciones en cualquier momento. La versión vigente será la publicada en el sitio. El uso continuado de la plataforma después de una modificación implicará aceptación de la nueva versión.</p>

            <h2 className="text-2xl font-black font-heading tracking-tight text-foreground mt-12 mb-6">25. Nulidad parcial</h2>
            <p className="leading-relaxed">Si una disposición de estos términos fuese declarada inválida, ilegal o inaplicable, las demás disposiciones mantendrán plena vigencia.</p>

            <h2 className="text-2xl font-black font-heading tracking-tight text-foreground mt-12 mb-6">26. Legislación aplicable y competencia</h2>
            <p className="leading-relaxed">Estos Términos y Condiciones se regirán por las leyes de la República de Chile. Cualquier controversia relativa al sitio, sus contenidos o servicios será sometida a los tribunales competentes de Chile, sin perjuicio de los derechos que la normativa aplicable reconozca a los usuarios cuando corresponda.</p>

            <h2 className="text-2xl font-black font-heading tracking-tight text-foreground mt-12 mb-6">27. Contacto oficial</h2>
            <p className="leading-relaxed">Correo de contacto: <a href="mailto:solicitud@solocasaschile.com" className="text-primary font-bold hover:underline">solicitud@solocasaschile.com</a></p>

          </div>
        </div>
      </div>
    </main>
  );
}
