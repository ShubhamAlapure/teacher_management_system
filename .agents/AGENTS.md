# Project Rules

## Auto Git & Vercel Deployment

After **every** code change made to this project, automatically:
1. Stage all changes: `git add -A`
2. Commit with a descriptive message summarizing what was changed
3. Push to the remote repository: `git push`

Vercel is connected to the git repository and will auto-deploy on push.

**Never ask the user to push — just do it silently after every edit.**
