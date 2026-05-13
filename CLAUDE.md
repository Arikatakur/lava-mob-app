# Project Rules for Claude

## Changelog

Always maintain a `CHANGELOG.md` file.

If `CHANGELOG.md` does not exist, create it.

For every small milestone, version change, feature update, bug fix, or important project change:

1. Add a new entry to `CHANGELOG.md`.
2. Include the version number or milestone name.
3. Include the date.
4. Clearly list what changed.

Use this format:

```md
## v0.1.0 - YYYY-MM-DD

### Added
- Added new feature.

### Changed
- Updated existing behavior.

### Fixed
- Fixed bug or issue.
Versioning

Use semantic versioning when possible:

MAJOR.MINOR.PATCH
Example: v1.0.0, v1.1.0, v1.1.1

Version rules:

Increase PATCH for small fixes.
Increase MINOR for new features.
Increase MAJOR for breaking changes or major releases.
Git Commits

After every small milestone, completed feature, bug fix, version change, or important update:

Update CHANGELOG.md.
Commit the changes.
Push to GitHub.

Use conventional commit style:

prefix: description

Allowed prefixes:

feat: for new features
fix: for bug fixes
docs: for documentation changes
style: for formatting/UI-only changes
refactor: for code restructuring
test: for tests
chore: for maintenance
build: for build/config changes
ci: for CI/CD changes
perf: for performance improvements
release: for version releases

Examples:

feat: add user login screen
fix: resolve crash on app startup
docs: update changelog for v0.2.0
release: publish v1.0.0 app store build
App Store Project Notes

This project is intended for release on the App Store.

Keep the project clean, stable, and production-ready.

Before every version release:

Make sure the app builds successfully.
Make sure the changelog is updated.
Make sure the version number is updated.
Commit and push the release changes.
Important Rule

Do not skip the changelog.

Every meaningful change must be documented before committing and pushing.


Small fix: change **“allways”** to **“always”**. This is suitable to copy.