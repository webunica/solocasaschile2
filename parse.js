const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('constructoras_chile_organizadas (1).pdf');

pdf(dataBuffer).then(function(data) {
    fs.writeFileSync('parsed_pdf.txt', data.text);
    console.log("PDF parsed and saved to parsed_pdf.txt");
}).catch(function(error){
    console.error(error);
});
