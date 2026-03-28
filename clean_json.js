const fs = require('fs');

const companies = JSON.parse(fs.readFileSync('companies.json', 'utf8'));

const REGIONES_CHILE = [
  "Arica y Parinacota", "Tarapacá", "Antofagasta", "Atacama", "Coquimbo", "Valparaíso", 
  "Metropolitana", "O'Higgins", "Maule", "Ñuble", "Biobío", "La Araucanía", "Los Ríos", 
  "Los Lagos", "Aysén", "Magallanes"
];

function cleanRecord(c) {
  // Ignorar registros basura (cabeceras/notas extraídas del PDF)
  if (!c.nombre || c.nombre === "-" || c.nombre.length < 3 || c.nombre.includes("ORGANIZADAS POR REGION")) {
    return null;
  }

  let cleaned = { ...c };

  // Detectar si la región está en el lugar equivocado (ej: en el teléfono)
  const allFields = [c.region, c.telefono, c.email, c.sitio_web];
  
  // Buscar región en cualquier campo
  let foundRegion = null;
  for (const field of allFields) {
    if (typeof field === 'string') {
      const match = REGIONES_CHILE.find(r => field.toLowerCase().includes(r.toLowerCase()));
      if (match) {
        foundRegion = match;
        break;
      }
    }
  }
  if (foundRegion) cleaned.region = foundRegion;

  // Detectar teléfonos (+56) en campos equivocados
  const phonePattern = /\+56\s?\d+/;
  for (let key of ['region', 'email', 'sitio_web']) {
    if (typeof cleaned[key] === 'string' && phonePattern.test(cleaned[key])) {
       if (!cleaned.telefono || cleaned.telefono === "-" || !phonePattern.test(cleaned.telefono)) {
         cleaned.telefono = cleaned[key].match(phonePattern)[0];
       }
    }
  }

  // Detectar emails en el sitio web o región
  const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  for (let key of ['region', 'sitio_web', 'telefono']) {
    if (typeof cleaned[key] === 'string' && emailPattern.test(cleaned[key])) {
       cleaned.email = cleaned[key].match(emailPattern)[0];
    }
  }

  // Limpiar campos si duplicaron datos de otros patrones
  if (cleaned.region && (phonePattern.test(cleaned.region) || emailPattern.test(cleaned.region))) {
    cleaned.region = foundRegion || null;
  }
  
  if (cleaned.email && cleaned.email.includes("http")) {
    cleaned.email = null;
  }

  // Si el sitio web parece una id o un número random, limpiar
  if (cleaned.sitio_web && /^\d+$/.test(cleaned.sitio_web)) {
    cleaned.sitio_web = null;
  }

  return cleaned;
}

const cleanedCompanies = companies
  .map(cleanRecord)
  .filter(c => c !== null);

fs.writeFileSync('companies.json', JSON.stringify(cleanedCompanies, null, 2));
console.log(`Cleaned. Records remaining: ${cleanedCompanies.length} (from ${companies.length})`);
