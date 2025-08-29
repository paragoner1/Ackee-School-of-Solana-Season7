# Development Workflow Guide - Crisis Companion

## **Overview**

This guide outlines the recommended workflow for developing the Crisis Companion dApp, ensuring safe development while maintaining a professional public repository for hackathon submission.

## **Repository Structure**

### **Enhanced Repository (Private - Development)**
- **Location**: `~/projects/crisis-companion-enhanced/`
- **Purpose**: Development workspace, experimentation, testing
- **Status**: Private repository for safe development
- **Commits**: Development commits (currently 20)

### **Original Repository (Public - Production)**
- **Location**: `~/projects/crisis-companion-original/`
- **Purpose**: Hackathon submission, judges' review
- **Status**: Public repository for professional presentation
- **Commits**: Complete development history (308 total)
- **URL**: https://github.com/paragoner1/crisis-companion

## **Recommended Workflow**

### **1. Always Start in Enhanced Repo**

```bash
# Navigate to development workspace
cd ~/projects/crisis-companion-enhanced

# Verify current status
cargo check --lib --features "voice,monitoring,private,rodio"
git status
```

### **2. Create Backup Before Starting**

```bash
# Navigate to projects directory
cd ~/projects

# Create timestamped backup
cp -r crisis-companion-enhanced crisis-companion-enhanced-backup-$(date +%Y%m%d-%H%M%S)

# Return to development
cd crisis-companion-enhanced
```

### **3. Develop and Test**

```bash
# Make changes to code
# Test compilation frequently
cargo check --lib --features "voice,monitoring,private,rodio"

# Build and test APK
cd android-app
./gradlew assembleDebug
cd ..

# Test on emulator
adb install android-app/app/build/outputs/apk/debug/app-debug.apk
adb shell am start -n com.solanasos.emergency/.MainActivity
```

### **4. Document Changes**

```bash
# Update documentation
# - PROJECT_STATUS.md
# - README.md (if needed)
# - Any relevant documentation files

# Commit changes
git add .
git commit -m "Descriptive commit message"
git push origin master
```

### **5. Create Final Backup**

```bash
# Create final backup before merge
cd ~/projects
cp -r crisis-companion-enhanced crisis-companion-enhanced-backup-$(date +%Y%m%d-%H%M%S)
```

### **6. Merge to Public Repo**

```bash
# Navigate to original repo
cd ~/projects/crisis-companion-original

# Add enhanced repo as remote (if not already added)
git remote add enhanced ../crisis-companion-enhanced

# Fetch latest changes
git fetch enhanced

# Merge with full history
git merge enhanced/master --allow-unrelated-histories -m "Merge enhanced features and improvements"

# Resolve any conflicts (use enhanced version for key files)
git checkout --theirs README.md COMPLETE_APP_SUMMARY.md JUDGES_GUIDE.md Cargo.toml Cargo.lock src/lib.rs src/error.rs src/public/types.rs

# Add all resolved files
git add .

# Commit merge
git commit -m "Merge enhanced features and world-class improvements"

# Push to public repo
git push origin main
```

## **When to Use Each Repository**

### **Use Enhanced Repo For:**
- ✅ **New feature development**
- ✅ **Major code changes**
- ✅ **Experimental features**
- ✅ **Testing and iteration**
- ✅ **Bug fixes and improvements**
- ✅ **Documentation updates**
- ✅ **Any development work**

### **Use Original Repo For:**
- ✅ **Quick documentation fixes**
- ✅ **Minor README updates**
- ✅ **Small text changes**
- ✅ **Emergency fixes (if needed)**

### **Never Do In Original Repo:**
- ❌ **Major feature development**
- ❌ **Experimental changes**
- ❌ **Untested code changes**
- ❌ **Breaking changes**

## **Backup Strategy**

### **Before Each Session**
1. **Create timestamped backup**
2. **Verify current status**
3. **Review PROJECT_STATUS.md**

### **During Development**
1. **Test frequently** - `cargo check` after each change
2. **Commit often** - Small, descriptive commits
3. **Document changes** - Update relevant documentation

### **After Each Session**
1. **Create final backup**
2. **Commit and push** - Save to enhanced repo
3. **Update session notes** - Document what was accomplished

## **Emergency Procedures**

### **If Enhanced Repo Gets Corrupted**
```bash
# Restore from latest backup
cd ~/projects
cp -r crisis-companion-enhanced-backup-YYYYMMDD-HHMMSS/ crisis-companion-enhanced/

# Verify restoration
cd crisis-companion-enhanced
cargo check --lib --features "voice,monitoring,private,rodio"
```

### **If Public Repo Gets Corrupted**
```bash
# Restore from enhanced repo
cd ~/projects/crisis-companion-original
git fetch enhanced
git reset --hard enhanced/master
git push --force origin main
```

### **If Both Repos Get Corrupted**
```bash
# Use latest backup
cd ~/projects
cp -r crisis-companion-enhanced-backup-YYYYMMDD-HHMMSS/ crisis-companion-enhanced/

# Reinitialize git if needed
cd crisis-companion-enhanced
git init
git add .
git commit -m "Restored from backup"
git remote add origin https://github.com/paragoner1/crisis-companion-enhanced.git
git push --force origin master
```

## **Quality Assurance Checklist**

### **Before Merging to Public**
- [ ] **Code compiles** - `cargo check` passes
- [ ] **APK builds** - `./gradlew assembleDebug` succeeds
- [ ] **APK works** - Tested on emulator
- [ ] **Documentation updated** - All relevant files current
- [ ] **Backup created** - Timestamped backup exists
- [ ] **Commits clean** - Professional commit messages
- [ ] **Features tested** - All new features working

### **After Merging to Public**
- [ ] **Public repo updated** - Changes visible on GitHub
- [ ] **Documentation current** - README and guides updated
- [ ] **Backup verified** - All work safely preserved
- [ ] **Session documented** - Session notes updated

## **Best Practices**

### **Development**
- **Start small** - Make incremental changes
- **Test frequently** - Don't let errors accumulate
- **Document everything** - Keep session notes current
- **Backup aggressively** - Multiple backups prevent loss

### **Commits**
- **Descriptive messages** - Clear, professional language
- **Small commits** - One logical change per commit
- **No emojis** - Keep it professional
- **Consistent format** - Use present tense, imperative mood

### **Documentation**
- **Keep current** - Update as you develop
- **Be comprehensive** - Include all relevant details
- **Professional tone** - No emojis, clear language
- **Multiple formats** - Different docs for different purposes

## **Session Workflow Summary**

### **Start of Session**
1. Navigate to enhanced repo
2. Create backup
3. Check current status
4. Review session notes

### **During Session**
1. Develop and test
2. Document changes
3. Commit frequently
4. Create intermediate backups if needed

### **End of Session**
1. Create final backup
2. Update session notes
3. Commit and push to enhanced repo
4. Merge to public repo if ready

## **Key Commands Reference**

```bash
# Start development
cd ~/projects/crisis-companion-enhanced
cargo check --lib --features "voice,monitoring,private,rodio"

# Create backup
cd ~/projects
cp -r crisis-companion-enhanced crisis-companion-enhanced-backup-$(date +%Y%m%d-%H%M%S)

# Test APK
cd android-app && ./gradlew assembleDebug && cd ..
adb install android-app/app/build/outputs/apk/debug/app-debug.apk

# Merge to public
cd ~/projects/crisis-companion-original
git fetch enhanced
git merge enhanced/master --allow-unrelated-histories
git push origin main
```

---

**Last Updated**: August 28, 2024  
**Status**: ✅ Active workflow guide  
**Next Review**: Update as workflow evolves
