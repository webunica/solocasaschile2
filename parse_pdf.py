import PyPDF2
import json

def extract_text():
    with open('constructoras_chile_organizadas (1).pdf', 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = ''
        for page in reader.pages:
            text += page.extract_text() + '\n'
            
    with open('parsed_pdf.txt', 'w', encoding='utf-8') as f:
        f.write(text)
        
    print("Done")

if __name__ == '__main__':
    extract_text()
