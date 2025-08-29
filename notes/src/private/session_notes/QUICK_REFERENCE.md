# Quick Reference - Crisis Companion Development

## **Essential Commands**

### **Start Development**
```bash
cd ~/projects/crisis-companion-enhanced
cargo check --lib --features "voice,monitoring,private,rodio"
```

### **Create Backup**
```bash
cd ~/projects
cp -r crisis-companion-enhanced crisis-companion-enhanced-backup-$(date +%Y%m%d-%H%M%S)
```

### **Test APK**
```bash
adb install WORKING_CRISIS_COMPANION.apk
adb shell am start -n com.solanasos.emergency/.MainActivity
```

## **Key File Locations**

### **Working Directories**
- **Enhanced (Development)**: `~/projects/crisis-companion-enhanced/`
- **Original (Production)**: `~/projects/crisis-companion-original/`
- **Latest Backup**: `~/projects/crisis-companion-enhanced-FINAL-BACKUP-20250828-234034/`

### **Working APK**
- **Desktop Copy**: `~/Desktop/CRISIS_COMPANION_HACKATHON_SUBMISSION.apk`
- **Repo Copy**: `~/projects/crisis-companion-enhanced/WORKING_CRISIS_COMPANION.apk`

### **Documentation**
- **Project Status**: `PROJECT_STATUS.md`
- **Backup Strategy**: `BACKUP_STRATEGY.md`
- **Quick Start**: `QUICK_START.md`
- **Session Summary**: `src/private/session_notes/DEVELOPMENT_SESSION_SUMMARY.md`

## **Repository URLs**

### **Public (Hackathon Submission)**
- **URL**: https://github.com/paragoner1/crisis-companion
- **Commits**: 308 total (287 original + 21 enhancements)
- **Status**: Live for judges

### **Private (Development)**
- **URL**: https://github.com/paragoner1/crisis-companion-enhanced
- **Commits**: 20 enhancement commits
- **Status**: Development workspace

## **Key Features Implemented**

### **Emergency Protocols (15 total)**
- Suicide Prevention (988 routing)
- Drug Overdose (harm reduction)
- Hypothermia (cold weather protocols)
- Plus 12 original protocols

### **Advanced Features**
- Emergency volume override
- Smart 911 handoff system
- Dispatcher context sharing
- RNNoise voice filtering
- Android speaker control

## **Next Session Workflow**

1. **Navigate to enhanced repo**
2. **Create backup first**
3. **Check compilation status**
4. **Review session summary**
5. **Make changes**
6. **Test thoroughly**
7. **Create final backup**
8. **Merge to original when ready**

## **Emergency Recovery**

### **If Work is Lost**
1. Check backup directories
2. Restore from timestamped backup
3. Verify compilation
4. Continue development

### **If Repository is Corrupted**
1. Use local backup
2. Reinitialize git if needed
3. Push to new repository

---

**Last Updated**: August 28, 2024  
**Status**: ✅ Complete - Ready for hackathon submission
