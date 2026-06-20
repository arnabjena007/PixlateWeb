import re

with open('c:/Users/admin/.gemini/antigravity-ide/scratch/PixlateWeb/app/privacy/page.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Make subheadline smaller
content = content.replace("fontSize: '18px'", "fontSize: '16px'")
# Make date smaller
content = content.replace("fontSize: '13px'", "fontSize: '12px'")
# Make TL;DR heading smaller
content = content.replace("fontSize: '14px', fontWeight: 'bold'", "fontSize: '12px', fontWeight: 'bold'")
# Make TL;DR text smaller
content = content.replace("fontSize: '16px', lineHeight: '1.6'", "fontSize: '14px', lineHeight: '1.7'")
# Make content wrapper smaller
content = content.replace("<div style={{ fontSize: '16px', color: '#d4d4d8' }}>", "<div style={{ fontSize: '14px', color: '#d4d4d8', lineHeight: '1.7' }}>")
# Make all h2 tags smaller
content = content.replace("fontSize: '24px'", "fontSize: '20px'")

with open('c:/Users/admin/.gemini/antigravity-ide/scratch/PixlateWeb/app/privacy/page.js', 'w', encoding='utf-8') as f:
    f.write(content)
