# GitHub Repository Setup & Verification Guide

## ✅ Repository Verification Checklist

Use this checklist to verify your GitHub repository is properly set up:

### 1. Repository Files Verification
- [ ] All source files are uploaded (`src/` directory)
- [ ] Configuration files present:
  - [ ] `package.json` ✅
  - [ ] `vite.config.ts` ✅
  - [ ] `tsconfig.json` ✅
  - [ ] `tailwind.config.js` ✅
  - [ ] `eslint.config.js` ✅
- [ ] Documentation files:
  - [ ] `README.md` ✅
  - [ ] `LICENSE` ✅
  - [ ] `.env.example` ✅
- [ ] Database migrations (`supabase/migrations/`) ✅
- [ ] `.gitignore` properly configured ✅

### 2. Security Verification
- [ ] `.env` file is **NOT** committed (check it's in `.gitignore`)
- [ ] No hardcoded API keys or secrets in code
- [ ] `.env.example` exists with placeholder values
- [ ] `node_modules/` is ignored
- [ ] `dist/` folder is ignored

### 3. Repository Settings (GitHub Web Interface)

#### Repository Settings:
1. Go to your repository on GitHub
2. Click **Settings** tab
3. Verify:
   - [ ] Repository name is correct
   - [ ] Description is set
   - [ ] Visibility (Public/Private) is correct
   - [ ] Default branch is `main` or `master`

#### Secrets & Variables (for CI/CD):
1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add repository secrets (if using GitHub Actions):
   - [ ] `VITE_SUPABASE_URL` (for CI builds)
   - [ ] `VITE_SUPABASE_ANON_KEY` (for CI builds)

### 4. Branch Protection (Optional but Recommended)
1. Go to **Settings** → **Branches**
2. Add rule for `main` branch:
   - [ ] Require pull request reviews
   - [ ] Require status checks to pass
   - [ ] Require branches to be up to date

### 5. GitHub Pages / Deployment (Optional)
If deploying via GitHub Pages:
- [ ] Go to **Settings** → **Pages**
- [ ] Select source branch (`main`) and folder (`/root` or `/dist`)
- [ ] Configure custom domain if needed

## 📋 Files That Should Be in Repository

### ✅ Should Be Committed:
- All source code (`src/`)
- Configuration files (`package.json`, `vite.config.ts`, etc.)
- Documentation (`README.md`, `LICENSE`)
- Database migrations (`supabase/migrations/`)
- `.gitignore`
- `.env.example`
- Deployment configs (`vercel.json`, `netlify.toml`)
- CI/CD workflows (`.github/workflows/`)

### ❌ Should NOT Be Committed:
- `.env` (contains secrets)
- `node_modules/` (dependencies)
- `dist/` (build output)
- `.bolt/` (removed)
- IDE files (`.vscode/`, `.idea/`)
- OS files (`.DS_Store`)

## 🚀 Quick Verification Commands

If you have Git installed, run these commands:

```bash
# Check repository status
git status

# Verify remote URL
git remote -v

# Check what files are tracked
git ls-files

# Verify .env is ignored
git check-ignore .env
```

## 🔍 Manual Verification Steps

1. **Visit your GitHub repository URL**
2. **Check the file structure** matches your local project
3. **Verify README.md** displays correctly
4. **Check that `.env` is NOT visible** in the file list
5. **Verify `.env.example` IS visible** and has placeholder values
6. **Check commit history** shows your initial commit

## 📝 Next Steps After Verification

1. **Clone and Test:**
   ```bash
   git clone <your-repo-url>
   cd "Sree Janani Transmillers"
   npm install
   cp .env.example .env
   # Edit .env with your actual values
   npm run dev
   ```

2. **Set up deployment:**
   - Vercel: Connect repository, add env variables
   - Netlify: Connect repository, add env variables
   - GitHub Pages: Configure in repository settings

3. **Add collaborators** (if needed):
   - Go to **Settings** → **Collaborators**
   - Add team members

## ⚠️ Common Issues

### Issue: `.env` file is visible on GitHub
**Solution:** 
1. Remove it from Git: `git rm --cached .env`
2. Commit the change
3. Verify `.env` is in `.gitignore`

### Issue: `node_modules` is committed
**Solution:**
1. Remove: `git rm -r --cached node_modules`
2. Commit the change
3. Verify `node_modules` is in `.gitignore`

### Issue: Files missing on GitHub
**Solution:**
1. Check if files are in `.gitignore`
2. Force add if needed: `git add -f <file>`
3. Commit and push

## 📞 Need Help?

If you encounter any issues:
1. Check the `.gitignore` file
2. Verify file permissions
3. Check GitHub repository settings
4. Review commit history

---

**Last Updated:** $(Get-Date -Format "yyyy-MM-dd")

