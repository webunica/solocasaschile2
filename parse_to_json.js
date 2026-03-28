const fs = require('fs');

const lines = fs.readFileSync('parsed_pdf.txt', 'utf8').split('\n').map(l => l.trim());

let companies = [];
let buffer = [];

const skipWords = ["Página", "N°", "Constructora", "Región", "Teléfono", "Correo", "Sitio web", "Listado organizado", "Base revisada"];

let i = 0;
while (i < lines.length) {
    const line = lines[i];
    
    // Skip empty lines or header lines
    if (!line || skipWords.some(w => line.startsWith(w)) || line === "211" || line === "90" || line === "143" || line === "136" || line === "26" || line === "Constructoras" || line === "Con región" || line === "Con teléfono" || line === "Con correo" || line === "Excluidas") {
        i++;
        continue;
    }
    
    // Is it a number? If so, start of a record
    if (/^\d+$/.test(line)) {
        // Collect next 5 lines
        let record = [line];
        let j = i + 1;
        while (record.length < 6 && j < lines.length) {
            const nextLine = lines[j];
            if (!nextLine || skipWords.some(w => nextLine.startsWith(w))) {
                j++;
                continue;
            }
            record.push(nextLine);
            j++;
        }
        
        if (record.length === 6) {
           companies.push({
               id: record[0],
               nombre: record[1],
               region: record[2] === '-' ? null : record[2],
               telefono: record[3] === '-' ? null : record[3],
               email: record[4] === '-' ? null : record[4],
               sitio_web: record[5] === '-' ? null : record[5]
           });
        } else {
           console.log("Incomplete record at " + line, record);
        }
        i = j;
    } else {
        i++;
    }
}

console.log(`Parsed ${companies.length} companies.`);
console.dir(companies.slice(0, 5));

fs.writeFileSync('companies.json', JSON.stringify(companies, null, 2));

