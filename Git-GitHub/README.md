# Git & GitHub — Complete Beginner Notes

A step-by-step guide to understand, install, and use Git & GitHub from zero.

---

## 1. What is Git?

**Git** is a **Version Control System (VCS)** — a tool that tracks changes in your files over time.

Think of it like a "save game" system for your code:
- You can save snapshots of your project (called **commits**)
- You can go back to any previous snapshot anytime
- Multiple people can work on the same project without overwriting each other's work

### Why do we need Git?

Without Git:
```
project.html
project-final.html
project-final-2.html
project-FINAL-really.html   😵
```

With Git: one file, full history of every change, and you can jump to any version.

---

## 2. What is GitHub?

**GitHub** is a **website** (github.com) that stores your Git repositories **online (in the cloud)**.

| Git | GitHub |
|-----|--------|
| A tool installed on YOUR computer | A website on the internet |
| Tracks changes locally | Stores your code online |
| Works offline | Needs internet |
| Made by Linus Torvalds (2005) | Owned by Microsoft |

**Simple analogy:** Git = camera 📷, GitHub = Google Photos ☁️ (where you upload the pictures).

Alternatives to GitHub: GitLab, Bitbucket.

---

## 3. Installing Git

### Windows
1. Go to **https://git-scm.com/downloads**
2. Download the Windows installer
3. Run it — keep clicking **Next** (default options are fine)
4. This also installs **Git Bash** (a terminal to run git commands)

### Mac
```bash
brew install git
```
(or install Xcode Command Line Tools: `xcode-select --install`)

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install git
```

### Verify installation
Open a terminal (Git Bash / CMD / Terminal) and type:
```bash
git --version
```
You should see something like: `git version 2.45.0`

---

## 4. First-Time Git Setup (One time only)

Tell Git who you are (this name/email is attached to every commit you make):

```bash
git config --global user.name "Your Name"
git config --global user.email "youremail@example.com"
```

Set the default branch name to `main`:
```bash
git config --global init.defaultBranch main
```

Check your settings:
```bash
git config --list
```

---

## 5. Creating a GitHub Account

1. Go to **https://github.com**
2. Click **Sign Up**
3. Enter email → create password → choose a username
4. Verify your email — done ✅

---

## 6. The 3 Areas of Git (VERY IMPORTANT concept)

```
Working Directory  →  Staging Area  →  Repository (History)
   (your files)        (git add)         (git commit)
```

1. **Working Directory** — the folder where you edit files
2. **Staging Area** — a "waiting room" where you put files ready to be saved (`git add`)
3. **Repository** — permanent history of snapshots (`git commit`)

---

## 7. Basic Git Commands (with explanation)

### Start a new repository
```bash
git init
```
Turns the current folder into a Git repository (creates a hidden `.git` folder).

### Check status
```bash
git status
```
Shows which files are changed, staged, or untracked. **Use this constantly!**

### Add files to staging
```bash
git add file.txt        # add one file
git add .               # add ALL changed files
```

### Commit (save a snapshot)
```bash
git commit -m "Add homepage"
```
`-m` = message. Always write a short, meaningful message describing what you did.

### View history
```bash
git log                 # full history
git log --oneline       # short one-line history
```

### See what changed
```bash
git diff                # changes not yet staged
```

### Undo things
```bash
git restore file.txt            # discard changes in a file
git restore --staged file.txt   # unstage a file (undo git add)
git reset --soft HEAD~1         # undo last commit, keep changes
```

---

## 8. Complete Beginner Workflow (Local)

```bash
mkdir my-project          # 1. create a folder
cd my-project             # 2. go into it
git init                  # 3. start git
# ... create/edit files ...
git status                # 4. see what changed
git add .                 # 5. stage everything
git commit -m "First commit"   # 6. save snapshot
```

Repeat steps 4–6 every time you make changes. That's the core loop!

---

## 9. Connecting Git to GitHub

### Step 1: Create a repository on GitHub
1. Log in to GitHub → click the **+** (top-right) → **New repository**
2. Give it a name (e.g., `my-project`)
3. Choose **Public** or **Private**
4. **Don't** tick "Add README" (if you already have a local project)
5. Click **Create repository**

### Step 2: Link your local repo to GitHub
Copy the URL GitHub shows you, then:
```bash
git remote add origin https://github.com/YOUR-USERNAME/my-project.git
git branch -M main
git push -u origin main
```

- `remote add origin` → saves the GitHub URL under the nickname "origin"
- `push` → uploads your commits to GitHub
- `-u` → remembers this so next time you can just type `git push`

### Step 3: Authentication (first push)
GitHub no longer accepts your account password in the terminal. Use one of:

**Option A — Personal Access Token (PAT):**
1. GitHub → Settings → Developer settings → **Personal access tokens** → Generate new token (classic)
2. Tick the `repo` scope → Generate → **copy the token**
3. When Git asks for a password, **paste the token** instead

**Option B — GitHub CLI (easiest):**
```bash
gh auth login
```
(install from https://cli.github.com, then follow the prompts in the browser)

**Option C — SSH keys** (advanced, no password ever again):
```bash
ssh-keygen -t ed25519 -C "youremail@example.com"
cat ~/.ssh/id_ed25519.pub
```
Copy the output → GitHub → Settings → **SSH and GPG keys** → New SSH key → paste.
Then use the SSH URL: `git@github.com:USERNAME/repo.git`

---

## 10. Everyday GitHub Commands

```bash
git push                  # upload commits to GitHub
git pull                  # download latest changes from GitHub
git clone <url>           # copy an existing GitHub repo to your computer
```

Example clone:
```bash
git clone https://github.com/username/some-project.git
```

---

## 11. Branches (working on features safely)

A **branch** is a separate line of development. `main` is the default branch.

```bash
git branch                    # list branches
git branch feature-login      # create a branch
git switch feature-login      # move to that branch
git switch -c feature-login   # create AND switch (shortcut)
```

Work, commit on the branch, then merge it back:
```bash
git switch main
git merge feature-login       # bring branch changes into main
git branch -d feature-login   # delete the branch (done with it)
```

**Why branches?** You can experiment without breaking `main`. If it fails, just delete the branch.

---

## 12. Pull Requests (PR) — the GitHub way of merging

Used in teams / open source:

1. Push your branch: `git push -u origin feature-login`
2. On GitHub, click **"Compare & pull request"**
3. Describe your changes → **Create pull request**
4. Teammates review your code → click **Merge**

---

## 13. .gitignore — files Git should ignore

Create a file named `.gitignore` in your project root:

```
node_modules/
.env
*.log
.DS_Store
```

Anything listed here will never be tracked (passwords, huge folders, temp files).

---

## 14. Common Errors & Fixes

| Error | Fix |
|-------|-----|
| `fatal: not a git repository` | You're not inside a git folder — run `git init` or `cd` into the right folder |
| `remote origin already exists` | `git remote remove origin` then add again |
| `failed to push (rejected)` | Run `git pull` first, then `git push` |
| `Please tell me who you are` | Run the `git config` name/email commands (Section 4) |

---

## 15. Quick Reference Cheat Sheet

```bash
git init                     # start a repo
git status                   # check state
git add .                    # stage all
git commit -m "message"      # save snapshot
git log --oneline            # history
git branch                   # list branches
git switch -c new-branch     # new branch
git merge branch-name        # merge
git remote add origin <url>  # link to GitHub
git push -u origin main      # first push
git push / git pull          # sync with GitHub
git clone <url>              # download a repo
```

---

## 16. Practice Task 🏋️

1. Create a folder `practice-repo`, run `git init`
2. Create `index.html`, commit it
3. Edit the file, commit again
4. Run `git log --oneline` — you should see 2 commits
5. Create a GitHub repo and push your project
6. Refresh GitHub — your code is online! 🎉

---

**Golden rule:** commit early, commit often, write clear messages.
