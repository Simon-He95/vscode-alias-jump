# Release Checklist

Use this checklist before publishing to VS Code Marketplace.

## 📋 Pre-Release Checklist

### Code Quality
- [x] All tests passing (`pnpm test`)
- [x] No TypeScript errors (`pnpm typecheck`)
- [x] No lint errors (`pnpm lint`)
- [x] Build successful (`pnpm build`)
- [ ] Manual testing completed
  - [ ] Test in TypeScript project
  - [ ] Test in JavaScript project
  - [ ] Test in Vue project
  - [ ] Test in React project
  - [ ] Test in monorepo setup
  - [ ] Test hot reload (edit tsconfig)
  - [ ] Test multiple imports per line
  - [ ] Test CSS url() paths
  - [ ] Test HTML src attributes

### Documentation
- [x] README.md updated with new features
- [x] README_zh.md updated (Chinese version)
- [x] CHANGELOG.md updated with version details
- [x] RELEASE_NOTES.md created
- [x] package.json description updated
- [x] package.json keywords added
- [ ] Add release date to CHANGELOG.md

### Version Management
- [ ] Update version in package.json
  ```bash
  # Use bumpp for automated version bumping
  pnpm bumpp
  ```
- [ ] Version follows semantic versioning
  - Patch (0.0.x): Bug fixes
  - Minor (0.x.0): New features (backward compatible)
  - Major (x.0.0): Breaking changes
- [ ] Git tag created
  ```bash
  git tag v0.1.0
  git push origin v0.1.0
  ```

### Package Files
- [ ] Check dist/ is built and up-to-date
- [ ] Verify icon.png exists and looks good
- [ ] Check LICENSE file exists
- [ ] Review .vscodeignore (exclude dev files)
  ```
  # Common files to exclude:
  .github/
  src/
  test/
  node_modules/
  .gitignore
  .eslintrc
  tsconfig.json
  *.ts (except .d.ts)
  ```

### Marketplace Assets
- [ ] Extension icon (128x128px, PNG)
- [ ] Screenshots prepared (optional but recommended)
- [ ] GIF/Video demo prepared (highly recommended)
- [ ] Repository URL correct in package.json
- [ ] Issues URL correct in package.json
- [ ] Homepage URL correct in package.json

## 🚀 Release Process

### 1. Build Package
```bash
# Install vsce if not already installed
npm install -g @vscode/vsce

# Package the extension
pnpm pack

# This creates: vscode-alias-jump-X.X.X.vsix
```

### 2. Test Package Locally
```bash
# Install in VS Code
code --install-extension vscode-alias-jump-X.X.X.vsix

# Test all features
# Uninstall after testing
code --uninstall-extension simonhe.vscode-alias-jump
```

### 3. Publish to Marketplace
```bash
# Login (first time only)
vsce login simonhe

# Publish
pnpm publish

# Or manually:
vsce publish
```

### 4. Verify Marketplace Listing
- [ ] Visit [marketplace page](https://marketplace.visualstudio.com/items?itemName=simonhe.vscode-alias-jump)
- [ ] Check version number is correct
- [ ] Verify description displays properly
- [ ] Test "Install" button
- [ ] Check README renders correctly
- [ ] Verify badges show up

## 📣 Post-Release Checklist

### GitHub
- [ ] Create GitHub Release
  - [ ] Use tag version (e.g., v0.1.0)
  - [ ] Copy content from RELEASE_NOTES.md
  - [ ] Attach .vsix file
  - [ ] Mark as latest release
- [ ] Update repository topics/tags
  - vscode, vscode-extension, typescript, javascript
  - path-alias, monorepo, developer-tools

### Documentation
- [ ] Update README badges (if any auto-update)
- [ ] Add migration guide (if breaking changes)
- [ ] Update demo GIFs/videos if UI changed

### Community Outreach
- [ ] Tweet announcement (use MARKETING.md templates)
- [ ] Post to Reddit (r/vscode, r/typescript, r/javascript)
- [ ] Write Dev.to article (optional)
- [ ] Post in GitHub Discussions
- [ ] Share in Discord communities
- [ ] LinkedIn post (professional audience)

### Monitoring
- [ ] Watch GitHub Issues for bug reports
- [ ] Monitor marketplace reviews
- [ ] Check download stats
- [ ] Respond to user feedback promptly

### Analytics (Optional)
- [ ] Set up marketplace analytics tracking
- [ ] Track download trends
- [ ] Monitor user ratings/reviews
- [ ] Collect user testimonials

## 🐛 Hotfix Process

If critical bugs are found after release:

1. **Assess Severity**
   - Critical: Breaks extension completely
   - High: Major feature broken
   - Medium: Minor issues
   - Low: Cosmetic or edge cases

2. **Quick Fix Flow** (for Critical/High)
   ```bash
   # Create hotfix branch
   git checkout -b hotfix/critical-bug
   
   # Fix the bug
   # ... make changes ...
   
   # Test thoroughly
   pnpm test
   pnpm typecheck
   pnpm build
   
   # Bump patch version
   pnpm bumpp --patch
   
   # Commit and merge
   git commit -m "fix: critical bug description"
   git checkout main
   git merge hotfix/critical-bug
   
   # Publish hotfix
   pnpm publish
   
   # Tag
   git tag v0.1.1
   git push --tags
   ```

3. **Communicate**
   - Update CHANGELOG.md
   - Post update notice
   - Thank reporters

## 📊 Success Metrics

Track these after release:

- [ ] Downloads (target: 1000+ in first month)
- [ ] Active users (target: 500+ daily)
- [ ] Rating (target: 4.5+ stars)
- [ ] GitHub stars (track growth)
- [ ] Issues closed vs opened ratio
- [ ] Community engagement (comments, questions)

## 🎯 Next Version Planning

After release, start planning next version:

- [ ] Review user feedback
- [ ] Prioritize feature requests
- [ ] Identify pain points
- [ ] Create roadmap
- [ ] Update GitHub project board
- [ ] Set milestone for next release

---

## 🔗 Quick Links

- [VS Code Publishing Guide](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [Marketplace Management](https://marketplace.visualstudio.com/manage/publishers/simonhe)
- [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)
- [Marketplace Insights](https://marketplace.visualstudio.com/items?itemName=simonhe.vscode-alias-jump#analytics)

---

**Remember**: Quality > Speed. Better to delay release than ship bugs! 🚀
