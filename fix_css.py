with open('c:/Users/admin/.gemini/antigravity-ide/scratch/PixlateWeb/app/globals.css', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_header = """@import "tailwindcss";

:root {
  --workspace-bg: #09090b;
  --sidebar-bg: #1E1E1E;
  --border-color: #27272a;
  --text-primary: #f4f4f5;
  --text-muted: #71717a;
  --accent-color: #ffffff;
  --accent-text: #09090b;
  
  font-family: var(--font-instrument-sans), system-ui, -apple-system, sans-serif;
}

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  user-select: none;
}

body {
  background-color: var(--workspace-bg);
  color: var(--text-primary);
"""

with open('c:/Users/admin/.gemini/antigravity-ide/scratch/PixlateWeb/app/globals.css', 'w', encoding='utf-8') as f:
    f.write(new_header)
    f.writelines(lines[2:])
