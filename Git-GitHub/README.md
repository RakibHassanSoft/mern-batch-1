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

# 🤝 Collaboration — Branches, Merge, Pull & Group Projects

Everything above was for working alone. This part is for working **with a team on one project** — the real reason Git exists. Read it in order.

---

## 11. Branches (work without breaking the main code)

A **branch** is a separate copy of your code where you can work safely. The default branch is `main` — it should always stay working. When you build a new feature, you make a **new branch**, work there, and only merge it back into `main` when it's done and tested.

Think of `main` as the clean published book, and a branch as your rough-draft notebook.

```bash
git branch                     # list all branches (current one has a *)
git branch feature-navbar      # create a new branch called feature-navbar
git switch feature-navbar      # move onto that branch
git switch -c feature-navbar   # shortcut: create AND switch in one command
```

Now any `commit` you make happens on `feature-navbar`, and `main` stays untouched.

```bash
git switch main                # go back to main
git branch -d feature-navbar   # delete a branch after it's merged (done with it)
```

**Naming tip:** use clear names like `feature-login`, `fix-navbar-bug`, `sara/homepage`.

### ✅ Check which branch you're on
```bash
git branch                     # the * shows your current branch
git status                     # also shows "On branch ..."
```

---

## 12. Merging (bring a branch's work into main)

When your branch is finished, you **merge** it into `main` so everyone gets your changes.

```bash
git switch main                # 1. go to the branch you want to merge INTO
git pull                       # 2. get the latest main first (important in a team!)
git merge feature-navbar       # 3. bring feature-navbar's changes into main
git push                       # 4. upload the updated main to GitHub
```

Read it as: "stand on `main`, then pull `feature-navbar` into me."

If the changes don't overlap, Git merges automatically. If two people changed the **same lines**, you get a **merge conflict** — see Section 16.

---

## 13. Pull & Push (staying in sync with the team)

In a team, GitHub is the "single source of truth." You constantly **pull** (download others' work) and **push** (upload yours).

```bash
git pull        # download + merge the latest changes from GitHub into your branch
git push        # upload your commits to GitHub
```

**Golden rule:** **`git pull` before you start working, and before you push.** This keeps you up to date and avoids most conflicts.

Typical daily loop in a team:
```bash
git switch main
git pull                       # get everyone's latest work
git switch -c feature-x        # start your feature on a fresh branch
# ...code, then...
git add .
git commit -m "Add feature x"
git push -u origin feature-x   # upload YOUR branch to GitHub
```

`-u origin feature-x` the first time tells Git to remember this branch, so later you can just type `git push`.

---

## 14. Working as a Team (how everyone gets the project)

There are two common ways to set up a team.

### Option A — Everyone is a "collaborator" on one repo (simplest for small groups)
1. The repo **owner** goes to the repo on GitHub → **Settings** → **Collaborators** → **Add people** → type each teammate's GitHub username → invite.
2. Each teammate accepts the email/GitHub invite.
3. Each teammate **clones** the project to their computer:
```bash
git clone https://github.com/OWNER/project.git
cd project
```
4. Now everyone can create branches, push them, and open pull requests.

### Option B — Fork + Pull Request (for open source / bigger groups)
Each person **forks** (makes their own copy of) the repo on GitHub, works in their fork, and opens a pull request back to the original. (Option A is enough for class group projects.)

### ✅ Check you have the project
```bash
git remote -v                  # shows the GitHub URL you cloned from
git log --oneline | head       # shows the recent history
```

---

## 15. Pull Requests (PR) — the safe way to merge in a team

Instead of merging straight into `main` yourself, teams use a **Pull Request** so others can **review** the code first.

1. Push your branch: `git push -u origin feature-navbar`.
2. On GitHub, a green **"Compare & pull request"** button appears → click it.
3. Write a short title + description of what you did → **Create pull request**.
4. Teammates review, comment, maybe request changes.
5. When approved, click **Merge pull request** → the branch goes into `main`.
6. Everyone runs `git switch main && git pull` to get the merged code.

**Why PRs?** Nobody breaks `main` alone, code gets a second pair of eyes, and there's a clear history of who added what.

---

## 16. Merge Conflicts (when two people edit the same lines)

A **conflict** happens when you and a teammate changed the **same lines** of the same file. Git can't guess which to keep, so it asks you. **This is normal — don't panic.**

When it happens, Git marks the file like this:
```
<<<<<<< HEAD
your version of the line
=======
your teammate's version of the line
>>>>>>> feature-navbar
```

**How to fix:**
1. Open the file. Decide what the final line should be (keep yours, keep theirs, or combine).
2. **Delete the `<<<<<<<`, `=======`, `>>>>>>>` marker lines** and leave only the correct final code.
3. Save, then:
```bash
git add .
git commit -m "Resolve merge conflict"
git push
```

**Avoid conflicts:** pull often, keep branches small, and let each person work on **different files** when possible.

---

## 17. 👥 Group Project Task Handling (step-by-step workflow)

Here's a clean workflow a student team can follow for a project.

**Setup (once):**
1. **One person** creates the GitHub repo and pushes the starter code.
2. That person adds everyone as **collaborators** (Section 14).
3. Everyone **clones** the repo.

**Divide the work:**
4. Split the project into tasks — ideally so each person touches **different files/folders** (e.g. one does the navbar, one does the login page, one does the backend route). This prevents conflicts.

**Each person, for each task:**
```bash
git switch main
git pull                          # 1. always start from the latest main
git switch -c sara/login-page     # 2. make your own branch (yourname/task)
# ...do your work...
git add .
git commit -m "Build login page"  # 3. commit with a clear message
git pull origin main              # 4. pull latest main again before pushing (safety)
git push -u origin sara/login-page # 5. push YOUR branch
```
6. Open a **Pull Request** on GitHub → teammates review → **merge** into `main` (Section 15).
7. Everyone runs `git switch main && git pull` to stay updated.

**Team rules to avoid chaos:**
- ❌ Never commit directly to `main` — always use a branch + PR.
- 🔄 `git pull` before you start and before you push.
- ✂️ Keep branches small and focused (one feature each).
- ✍️ Write clear commit messages ("Fix navbar spacing", not "update").
- 🗂️ Agree who owns which files, so two people don't edit the same lines.
- 🗑️ Delete a branch after it's merged.

### ✅ Team health checks
```bash
git status              # anything uncommitted?
git branch              # which branch am I on?
git log --oneline -5    # recent commits
git pull                # am I up to date with the team?
```

---

## 18. Team Cheat Sheet

```bash
# start of the day / new task
git switch main
git pull
git switch -c yourname/feature

# while working
git status
git add .
git commit -m "clear message"

# share your work
git pull origin main            # get latest first
git push -u origin yourname/feature
# then open a Pull Request on GitHub

# after your PR is merged
git switch main
git pull
git branch -d yourname/feature  # clean up

# branches & merging
git branch                      # list
git switch branch-name          # move
git merge branch-name           # merge into current branch

# fixing a conflict
# 1) edit the file, remove <<<<<<< ======= >>>>>>> markers
git add .
git commit -m "Resolve merge conflict"
git push
```

---

## 19. Team Practice 🏋️ (do this with a partner)

1. Person A creates a repo, pushes a `README.md`, and adds Person B as a collaborator.
2. Both **clone** the repo.
3. Person A: `git switch -c a/add-title`, edit the README's title, commit, push, open a PR, merge.
4. Person B: `git switch main && git pull` — see A's change appear. ✅
5. Person B: `git switch -c b/add-line`, add a new line, push, open a PR, merge.
6. Both pull `main` again — now you both have each other's work. 🎉
7. Bonus: both edit the **same line** on different branches to create a **merge conflict**, then resolve it together (Section 16).

---

**Summary:** Install Git (`git --version`), create a GitHub account, tell Git who you are (`git config`), connect your device (`gh auth login` is easiest), then link a project and `git push`. For **teamwork**: everyone clones the repo, each person works on their **own branch**, pulls often, pushes their branch, and merges via **Pull Requests** — never straight into `main`. Use the checklists to stay in sync and the conflict steps when two people edit the same lines.
