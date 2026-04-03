import os

file_path = r'c:\Users\studioo\Desktop\000000000000000_SOLOCASASCHILE-V2\src\app\(public)\modelo\[slug]\page.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace mobile one
content = content.replace(
    '<span>Alta Demanda: 12 cotizaciones hoy</span>',
    '<DynamicUrgency variant="compact" />'
)

# Replace desktop one (the one I just broke with {count})
content = content.replace(
    '<p className="text-base font-bold text-muted-foreground">{count} personas cotizaron hoy</p>',
    '<DynamicUrgency />'
)

# Cleanup the messed up divs if needed (checking if I left artifacts)
content = content.replace(
    '<DynamicUrgency variant="compact" />\n\n                   </div>',
    '<DynamicUrgency variant="compact" />\n                   </div>'
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Replacement complete.")
