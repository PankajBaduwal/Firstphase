# 🎯 Quick Demo Reference Card

## URLs
- **ATS Frontend:** http://localhost:5173
- **ATS Backend:** http://localhost:5000
- **Demo Website:** http://localhost:8000

## Test Accounts
Create these during demo or have them ready:
- **Recruiter:** recruiter@test.com
- **Candidate:** candidate@test.com

## Demo Flow (3 minutes)

### 1️⃣ Post Job (30s)
- Login as recruiter
- Dashboard → "Post Job"
- Title: "Senior React Developer"
- Add skills, description
- Submit

### 2️⃣ Show Demo Website (30s)
- Open: http://localhost:8000
- Refresh page
- Point out: "Job synced instantly!"
- Show job card with details

### 3️⃣ Apply Flow (1m)
- Click "Apply Now"
- Shows redirect URL with source param
- Login as candidate
- Upload resume (have PDF ready!)
- Submit
- Success message

### 4️⃣ View Application (1m)
- Switch to recruiter dashboard
- Click job → View applicants
- Show application received
- **Click AI Score** → Modal appears
- Show matched/missing skills
- **Point out source = "careerconnect-demo"**

## Key Talking Points
✅ "Single source of truth - all jobs in one ATS"
✅ "Real-time sync to external job boards"
✅ "AI-powered skill matching with explainable results"
✅ "Source tracking for ROI analytics"
✅ "Seamless candidate experience"

## Commands to Start

```bash
# Terminal 1 - Backend
cd C:\Users\Admin\Desktop\project\backend
npm run dev

# Terminal 2 - Frontend
cd C:\Users\Admin\Desktop\project\frontend
npm run dev

# Terminal 3 - Demo Website (Already Running!)
# http://localhost:8000
```

## Troubleshooting
- **Jobs not showing?** Check backend is running on port 5000
- **CORS error?** Verify server.js CORS config
- **Apply not working?** Check if logged in as candidate
- **Source not tracked?** Verify appController.js saves source

## Demo Tips
- Have resume PDF ready beforehand
- Keep all 3 terminals visible
- Practice the flow 2-3 times
- Emphasize the AI matching feature
- Show the source tracking clearly
- Be confident and enthusiastic!

Good luck! 🚀
