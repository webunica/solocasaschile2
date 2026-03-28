const fs = require('fs');

const companies = JSON.parse(fs.readFileSync('companies.json', 'utf8'));

// Omitimos el campo 'id' para que la BD genere uno automático con uuid_generate_v4()
let sql = `INSERT INTO public.constructoras (nombre, slug, regiones, email, sitio_web, telefono, plan, verificada, score_confianza) VALUES\n`;

const values = companies.map(c => {
    const slug = c.nombre.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + '-' + Math.floor(Math.random() * 1000);
    
    const nombre = c.nombre.replace(/'/g, "''");
    const region = c.region ? `'{${c.region.replace(/'/g, "''")}}'` : "'{}'";
    const email = c.email ? `'${c.email.replace(/'/g, "''")}'` : "NULL";
    const sitio_web = c.sitio_web ? `'${c.sitio_web.replace(/'/g, "''")}'` : "NULL";
    const telefono = c.telefono ? `'${c.telefono.replace(/'/g, "''")}'` : "NULL";
    
    return `  ('${nombre}', '${slug}', ${region}, ${email}, ${sitio_web}, ${telefono}, 'informativo', false, 0)`;
});

sql += values.join(',\n') + ';\n';

fs.writeFileSync('final_insert_constructoras.sql', sql);
console.log('Generado final_insert_constructoras.sql');
