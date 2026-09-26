# 🚀 24/7 Permanent Cloud Deployment Guide for Reading HUB

This guide explains how to deploy the **Multi-Grade Reading HUB (Grades 1, 2, and 3)** to **Render.com** (Free 24/7 Cloud Hosting) so students and parents can access it from any phone, tablet, or laptop anytime.

---

## 📋 What We Have Already Prepared For You
The project has been automatically prepared with:
1. ✅ **Initialized Git Repository** with all Grade 1, 2, and 3 competencies, lessons, and 4,224 interactive activities.
2. ✅ **Pre-built Production Client Bundle** (`client/dist`) for instant loading.
3. ✅ **SQLite Multi-Grade Database** (`reading_hub.sqlite`) with Teacher Tin, Zydnie, and Aishleen accounts preserved.
4. ✅ **Node 22 Engine Configuration** (`.nvmrc` and `package.json`).
5. ✅ **Automatic Port Detection** (`process.env.PORT`) to bind seamlessly in the cloud.

---

## 🛠 Step 1: Create a Free GitHub Repository (2 Minutes)
1. Go to [github.com](https://github.com) and log in (or sign up for free).
2. Click the **`+`** icon at the top right and select **New repository**.
3. Name it: `reading-hub`
4. Set it to **Public** (or Private).
5. **Do NOT** check "Add a README file" (we already have all files ready).
6. Click **Create repository**.
7. Copy your repository URL (e.g., `https://github.com/YOUR_USERNAME/reading-hub.git`).

---

## 💻 Step 2: Push the Code to GitHub
Open PowerShell or your command prompt in `C:\Users\Admin\Desktop\Reading HUB` and run:

```bash
& 'C:\Users\Admin\MinGit\cmd\git.exe' remote add origin https://github.com/YOUR_USERNAME/reading-hub.git
& 'C:\Users\Admin\MinGit\cmd\git.exe' push -u origin main
```
*(GitHub will ask you to sign in to confirm the push).*

---

## 🌐 Step 3: Deploy Free on Render.com (3 Minutes)
1. Go to [render.com](https://render.com) and click **Sign Up** (choose **Sign in with GitHub**).
2. On your Render Dashboard, click the blue button **New +** -> **Web Service**.
3. Select your `reading-hub` repository from the list and click **Connect**.
4. Fill in these settings:
   - **Name:** `reading-hub` (or any name you like, e.g. `reading-hub-masinadyahon`)
   - **Region:** Singapore or Oregon (Singapore is fastest for the Philippines)
   - **Branch:** `main`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free`
5. Click **Create Web Service**.

---

## 🎉 Step 4: Your Live 24/7 Link!
Render will build the application in ~1-2 minutes.
Once finished, you will see a green **Live** badge and your permanent URL:
```
https://reading-hub-xxxx.onrender.com
```
- Share this link with **Teacher Tin, learners, and parents**!
- Works 24 hours a day, 7 days a week.
- You can turn off or close your laptop — the site stays online!
