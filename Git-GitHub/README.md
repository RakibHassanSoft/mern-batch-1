# Git & GitHub — Install, Connect Your Device & Verify (Beginner Guide)

This guide focuses on three things, in order:

1. **Install** Git (and set up a GitHub account).
2. **Connect** your device (computer) to GitHub so it can push/pull your code.
3. **Check** — after every step, how to verify it actually worked.

Follow it top to bottom. Every step has a "✅ Check" so you're never guessing.

---

## 0. Git vs GitHub (30-second recap)

- **Git** = a tool installed on **your computer** that tracks changes in your code.
- **GitHub** = a **website** (github.com) that stores your code online so you can back it up and share it.

Analogy: Git is the camera 📷, GitHub is the cloud photo album ☁️. You "connect your device to GitHub" so your computer is allowed to upload to your album.

---

## 1. Install Git

### Windows
1. Go to **https://git-scm.com/downloads** and download the Windows installer.
2. Run it and keep clicking **Next** (the default options are fine).
3. This also installs **Git Bash** — a terminal where you'll run git commands.

### Mac
Easiest with Homebrew:
```bash
brew install git
```
Or just run `git --version` once — macOS offers to install the developer tools that include Git.

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install git
```

### ✅ Check: is Git installed?
Open a terminal (Git Bash on Windows, Terminal on Mac/Linux) and run:
```bash
git --version
```
You should see something like `git version 2.45.0`. If you see a version number, Git is installed. ✅
If you see "command not found", close and reopen the terminal, or reinstall.

---

## 2. Create a GitHub Account

1. Go to **https://github.com** → click **Sign up**.
2. Enter your email, create a password, choose a username.
3. Verify your email address.

### ✅ Check: is the account working?
Log in at github.com. If you can see your dashboard (a mostly empty page with a "Create repository" button), your account is ready. ✅

> Optional easy tools (you don't need them for this guide, but they help):
> - **GitHub Desktop** (https://desktop.github.com) — a click-based app instead of typing commands.
> - **GitHub CLI / `gh`** (https://cli.github.com) — the fastest way to connect your device (used in Section 4).

---

## 3. Tell Git Who You Are (one-time setup)

Git stamps your name and email on every save (commit). Set them once:

```bash
git config --global user.name "Your Name"
git config --global user.email "your-github-email@example.com"
```

Use the **same email** you signed up to GitHub with. Also set the default branch name to `main`:
```bash
git config --global init.defaultBranch main
```

### ✅ Check: did the settings save?
```bash
git config --list
```
You should see your `user.name=...` and `user.email=...` in the list. ✅
(To check just one: `git config user.name`)

---

## 4. Connect Your Device to GitHub 🔌 (the easy way)

GitHub needs to know your computer is really *you* before it lets you upload code. GitHub **no longer accepts your account password** in the terminal, so we connect once using the official tool.

### The easy way — GitHub CLI (`gh`)

1. Install it from **https://cli.github.com** (Windows/Mac/Linux installers are there).
2. In your terminal, run:
```bash
gh auth login
```
3. Answer the prompts by pressing Enter on the highlighted choice:
   - **GitHub.com** (not Enterprise)
   - **HTTPS**
   - **Yes** — authenticate Git with your GitHub credentials
   - **Login with a web browser** → it shows a one-time code → press Enter → your browser opens → paste the code → click **Authorize**.

That's it — your device is now connected to GitHub. You won't need to type a password when you push.

### ✅ Check: is the device connected?
```bash
gh auth status
```
You should see `✓ Logged in to github.com as YOUR-USERNAME`. ✅

---

## 4b. Other Ways to Connect (only if you want them)

The easy way above is all you need. But there are two other common methods — good to know they exist:

### Alternative 1 — SSH key (set it up once, never asked again)

An SSH key is a pair: a **private** key stays on your computer, and you give GitHub the matching **public** key.

```bash
ssh-keygen -t ed25519 -C "your-github-email@example.com"   # press Enter at every prompt
cat ~/.ssh/id_ed25519.pub                                  # copy the whole line it prints
```
Then on GitHub: avatar → **Settings** → **SSH and GPG keys** → **New SSH key** → paste → **Add SSH key**.

**✅ Check:**
```bash
ssh -T git@github.com
```
Type `yes` the first time. Seeing `Hi YOUR-USERNAME! You've successfully authenticated...` means it works. ✅
(If you use SSH, connect projects with the SSH URL: `git@github.com:USERNAME/repo.git`.)

### Alternative 2 — Personal Access Token (PAT)

If you push over HTTPS without `gh`, Git asks for a "password" — you paste a **token** instead of your real password.

GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)** → **Generate new token (classic)** → tick **`repo`** → **Generate** → **copy the token**. Paste it when Git asks for a password during a push.

**✅ Check:** if your first push (Section 6) succeeds without rejecting your credentials, the token works. ✅

---

## 5. Make a Repository on GitHub

1. On GitHub, click the **+** (top-right) → **New repository**.
2. Give it a name (e.g. `my-first-repo`), choose **Public** or **Private**.
3. Leave "Add a README" **unchecked** if you'll push an existing folder.
4. Click **Create repository**. GitHub shows you a URL — keep that page open.

---

## 6. Connect a Project & Push It to GitHub

Now link a folder on your computer to that GitHub repo and upload it.

```bash
cd my-project            # go into your project folder
git init                 # start tracking with Git
git add .                # stage all files
git commit -m "First commit"   # save a snapshot

git branch -M main       # name the branch "main"
git remote add origin https://github.com/YOUR-USERNAME/my-first-repo.git
git push -u origin main  # upload to GitHub
```

- `git remote add origin <url>` = save GitHub's address under the nickname "origin".
- `git push` = upload. The first push uses your connection from Section 4.
- If you connected with **SSH** (Section 4b), use the SSH URL instead: `git@github.com:YOUR-USERNAME/my-first-repo.git`.

### ✅ Check: did it upload?
Two ways:
1. In the terminal:
```bash
git remote -v
```
This lists your connected GitHub URL (confirms the link). ✅
2. **Refresh the repository page on GitHub** — your files should now appear there. That's the real proof it's connected and uploaded. 🎉

---

## 7. Everyday Commands (after you're connected)

```bash
git status               # what has changed?
git add .                # stage changes
git commit -m "message"  # save a snapshot
git push                 # upload commits to GitHub
git pull                 # download the latest from GitHub
git clone <url>          # copy an existing GitHub repo to your computer
```

Typical loop while working: `git status` → `git add .` → `git commit -m "..."` → `git push`.

### ✅ Check: is this folder linked to GitHub?
```bash
git remote -v            # shows the GitHub URL, or nothing if not linked
git branch               # shows your current branch (usually main)
```

---

## 8. Quick "Am I Connected?" Checklist

Run these anytime to confirm everything is set up:

| Check | Command | Good result |
|-------|---------|-------------|
| Git installed | `git --version` | shows a version number |
| Identity set | `git config --list` | shows your name & email |
| Device connected (gh) | `gh auth status` | "Logged in to github.com as ..." |
| Device connected (SSH) | `ssh -T git@github.com` | "Hi USERNAME! You've successfully authenticated" |
| Project linked | `git remote -v` | shows your repo's GitHub URL |
| Upload works | refresh the repo on github.com | your files are there |

---

## 9. Common Problems & Fixes

| Problem | Fix |
|---------|-----|
| `git: command not found` | Git isn't installed / terminal not reopened — reinstall (Section 1), reopen terminal. |
| `Authentication failed` on push | You typed your account password — use `gh auth login`, an SSH key, or a token instead (Section 4). |
| `Permission denied (publickey)` | SSH key not added to GitHub, or you used the SSH URL without setting up a key — redo the SSH steps in Section 4b. |
| `remote origin already exists` | `git remote remove origin`, then add it again. |
| `failed to push ... rejected` | Someone/you changed GitHub — run `git pull` first, then `git push`. |
| `Please tell me who you are` | Run the `git config` name/email commands (Section 3). |

---

## 10. Practice 🏋️

1. Install Git and run `git --version` (✅ Check).
2. Create a GitHub account.
3. Connect your device with `gh auth login` and confirm with `gh auth status` (✅ Check).
4. Create a folder, put one file in it, and do `git init → add → commit`.
5. Make a repo on GitHub and `git push` your folder.
6. Refresh GitHub — see your file online. 🎉
7. Change the file, then `git add → commit → push` again and watch it update on GitHub.

---

**Summary:** Install Git (`git --version`), create a GitHub account, tell Git who you are (`git config`), connect your device (`gh auth login` is easiest), then link a project and `git push`. Use the checklist in Section 8 anytime to confirm you're connected.
