# 🔧 Emergency Doctor - Development Setup

## 📋 Quick Start

### 1. Clone and Install
```bash
git clone https://github.com/Yine-Eng/emergency-doctor-.git
cd emergency-doctor-fixed
npm install
```

### 2. Environment Setup
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your local settings
# Replace localhost with your actual IP address for mobile testing
API_BASE_URL=http://YOUR_IP_ADDRESS:5000
```

### 3. Backend Setup
```bash
cd backend
npm install
# Set up your MongoDB connection in backend/.env
npm start
```

### 4. Frontend Setup
```bash
# From the root directory
npm start
```

## 🔐 Environment Variables

The app now uses environment variables for API configuration:

- **Development**: Set `API_BASE_URL` to your local IP (e.g., `http://192.168.1.100:5000`)
- **Production**: Set `API_BASE_URL` to your production API URL

## ✅ What's Been Completed

- ✅ **Security**: No sensitive data (IP addresses) committed to GitHub
- ✅ **Authentication**: Clean token-based auth with "Remember Me"
- ✅ **Testing**: All tests passing (Frontend: 11/11, Backend: 4/4)
- ✅ **Biometric Removal**: All LocalAuthentication code removed
- ✅ **Environment Config**: Proper API endpoint management
- ✅ **Error Handling**: Network/backend error distinction
- ✅ **Validation**: Form validation with proper error display

## 🚀 Ready for Development

The app is now clean and ready for custom "Remember Me" token logic implementation!
