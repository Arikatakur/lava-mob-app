# Push Guide

This guide explains how to contribute to this private repository safely.

The protected branch is:

```text
master
```

Do **not** push directly to `master`.  
All changes must be pushed to a separate branch and submitted through a Pull Request.

---

## 1. Clone the repository

```bash
git clone <repo-url>
cd <repo-folder>
```

Replace `<repo-url>` with the GitHub repository URL.

---

## 2. Make sure `master` is up to date

```bash
git checkout master
git pull origin master
```

This makes sure you start from the latest version of the project.

---

## 3. Create a new branch

Create a branch for your change:

```bash
git checkout -b feature/my-change
```

Example:

```bash
git checkout -b feature/admin-dashboard
```

Use clear branch names, for example:

```text
feature/login-page
fix/navbar-layout
update/readme
```

---

## 4. Make your changes

Edit the files you need, then check what changed:

```bash
git status
```

---

## 5. Add and commit your changes

Add all changed files:

```bash
git add .
```

Commit with a clear message:

```bash
git commit -m "feat: add admin dashboard"
```

Good commit message examples:

```text
feat: add order status update
fix: correct dashboard layout
docs: update setup instructions
style: improve button spacing
```

---

## 6. Push your branch

Push your branch to GitHub:

```bash
git push origin feature/my-change
```

Example:

```bash
git push origin feature/admin-dashboard
```

---

## 7. Open a Pull Request

After pushing, GitHub should show a **Compare & pull request** button.

Create a Pull Request with:

```text
base: master
compare: your-branch-name
```

Example:

```text
base: master
compare: feature/admin-dashboard
```

Add a short description of what you changed, then create the Pull Request.

---

## 8. Wait for review

Do not merge the Pull Request yourself.

The repository owner will review the code and either:

- approve it,
- request changes,
- or merge it into `master`.

---

## Important Rules

Never push directly to `master`:

```bash
git push origin master
```

Always create a separate branch and push that branch:

```bash
git push origin feature/my-change
```

---

## Quick Command Summary

```bash
git clone <repo-url>
cd <repo-folder>

git checkout master
git pull origin master

git checkout -b feature/my-change

# make changes

git status
git add .
git commit -m "feat: describe the change"

git push origin feature/my-change
```

Then open a Pull Request on GitHub into `master`.
