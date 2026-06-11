# PixlateWeb Docker Deployment Guide

## 🚀 Quick Start Options

### Option 1: Local Development (Testing)
```bash
npm install
npm run dev
```
Visit: http://localhost:3000

### Option 2: Docker Locally
```bash
docker build -t pixlate-app .
docker run -p 3000:3000 pixlate-app
```
Or with Docker Compose:
```bash
docker-compose up --build
```

---

## 🚂 Deployment to Production

### **Railway** (Recommended - Easiest)

1. Install Railway CLI:
```bash
npm install -g @railway/cli
```

2. Login and deploy:
```bash
railway login
railway up
```

Railway automatically:
- Reads `railway.toml`
- Builds Docker image
- Includes `pix` binary
- Deploys to production
- Provides public URL

### **Render**

1. Push code to GitHub
2. Go to render.com and create new Web Service
3. Connect your GitHub repo
4. Set build method: Docker
5. Render automatically detects `Dockerfile` and deploys

### **Fly.io**

1. Install Flyctl:
```bash
curl -L https://fly.io/install.sh | sh
```

2. Launch and deploy:
```bash
fly auth login
fly launch
fly deploy
```

---

## ⚠️ Important Requirements

### The `pix` binary must be in your root directory:

**Linux/macOS:**
```bash
ls -la pix
# Should output something like: -rwxr-xr-x pix
chmod +x pix  # Make it executable
```

**Windows:**
```bash
ls -la pix.exe
```

### Where to get the pix binary:
1. Compile from Go source code
2. Or download pre-built binary from releases
3. Place in root: `./pix` or `./pix.exe`

---

## 🧪 Testing

### Test Docker build locally:
```bash
docker build -t pixlate-app .
docker run -it -p 3000:3000 pixlate-app
```

### Check logs:
```bash
# Railway
railway logs

# Render
# Check in dashboard

# Fly.io
fly logs
```

---

## 📋 Environment Variables

No special env vars needed, but if you want custom ports:

```bash
export PORT=3000
npm start
```

---

## 🔧 Troubleshooting

### "pix: command not found"
- Verify `pix` exists in root: `ls pix`
- Make executable: `chmod +x pix`
- Check Dockerfile copies it: `COPY pix /app/pix`

### "Processing failed" on deployment
- Check production logs
- Verify pix binary is executable
- Test locally first with `docker-compose up`

### Docker build fails
- Clean old images: `docker system prune`
- Rebuild: `docker build --no-cache -t pixlate-app .`

---

## 📊 What Each File Does

- **Dockerfile** - Defines Docker image (Node + pix binary)
- **docker-compose.yml** - Local Docker testing setup
- **railway.toml** - Railway deployment config
- **.dockerignore** - Excludes files from Docker image
- **app/api/pixlate/route.js** - Uses Go pix binary (same as before)

---

## ✅ Verification

After deployment, test it:

1. Upload an image
2. Apply filters (color sort, sweep, etc.)
3. Should get pixelated output (same as local!)
4. Check logs if there are issues

**Exact same visualization as local development** ✓
