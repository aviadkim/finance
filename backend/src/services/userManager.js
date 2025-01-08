const crypto = require('crypto');

class UserManager {
  constructor() {
    // במימוש אמיתי, זה יחובר למסד נתונים
    this.users = [];
  }

  // הצפנת סיסמה
  hashPassword(password) {
    return crypto
      .createHash('sha256')
      .update(password)
      .digest('hex');
  }

  // הרשמת משתמש חדש
  registerUser(userData) {
    const existingUser = this.users.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('משתמש עם דוא"ל זה כבר קיים');
    }

    const newUser = {
      id: this.generateUniqueId(),
      ...userData,
      password: this.hashPassword(userData.password),
      createdAt: new Date(),
      role: userData.role || 'יועץ'
    };

    this.users.push(newUser);
    return { 
      id: newUser.id, 
      name: newUser.name, 
      email: newUser.email, 
      role: newUser.role 
    };
  }

  // התחברות משתמש
  authenticateUser(email, password) {
    const user = this.users.find(u => u.email === email);
    if (!user) {
      throw new Error('משתמש לא נמצא');
    }

    const hashedPassword = this.hashPassword(password);
    if (user.password !== hashedPassword) {
      throw new Error('סיסמה שגויה');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };
  }

  // יצירת מזהה ייחודי
  generateUniqueId() {
    return crypto.randomBytes(16).toString('hex');
  }

  // עדכון פרטי משתמש
  updateUserProfile(userId, updateData) {
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('משתמש לא נמצא');
    }

    // עדכון פרטים תוך שמירה על פרטים רגישים
    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updateData
    };

    return {
      id: this.users[userIndex].id,
      name: this.users[userIndex].name,
      email: this.users[userIndex].email,
      role: this.users[userIndex].role
    };
  }

  // איפוס סיסמה
  resetPassword(email, newPassword) {
    const userIndex = this.users.findIndex(u => u.email === email);
    if (userIndex === -1) {
      throw new Error('משתמש לא נמצא');
    }

    this.users[userIndex].password = this.hashPassword(newPassword);
    return true;
  }
}

module.exports = new UserManager();