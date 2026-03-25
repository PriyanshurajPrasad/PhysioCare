#!/bin/bash

# Resend Setup Script for PhysioCare
# This script helps configure Resend email service

echo "🚀 PhysioCare Resend Setup Script"
echo "================================="

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "📋 Please create a .env file in the backend directory"
    exit 1
fi

echo "📋 Checking current .env configuration..."

# Check current Resend configuration
API_KEY_EXISTS=$(grep -q "RESEND_API_KEY=" .env && echo "YES" || echo "NO")
FROM_EMAIL_EXISTS=$(grep -q "RESEND_FROM_EMAIL=" .env && echo "YES" || echo "NO")

echo "📧 RESEND_API_KEY exists: $API_KEY_EXISTS"
echo "📧 RESEND_FROM_EMAIL exists: $FROM_EMAIL_EXISTS"

# Check if API key is placeholder
if grep -q "re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" .env; then
    echo "❌ RESEND_API_KEY is still placeholder value"
    echo "📋 Please follow these steps:"
    echo ""
    echo "1. Go to https://resend.com/api-keys"
    echo "2. Click 'Create API Key'"
    echo "3. Give it a name like 'PhysioCare Production'"
    echo "4. Copy the API key"
    echo "5. Update your .env file with the real API key"
    echo ""
    echo "Example:"
    echo "RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
else
    echo "✅ RESEND_API_KEY appears to be configured"
fi

# Check if sender email is default
if grep -q "noreply@physiocare.com" .env; then
    echo "⚠️  Warning: Using default sender email"
    echo "📋 Please verify your sender domain in Resend:"
    echo ""
    echo "1. Go to https://resend.com/domains"
    echo "2. Add and verify your domain"
    echo "3. Update your .env file with verified email"
    echo ""
    echo "Example:"
    echo "RESEND_FROM_EMAIL=your-verified-email@yourdomain.com"
else
    echo "✅ RESEND_FROM_EMAIL appears to be configured"
fi

echo ""
echo "🧪 Testing Resend configuration..."
echo ""
echo "To test your Resend setup:"
echo "1. Start the backend server: npm start"
echo "2. Check startup logs for Resend initialization"
echo "3. Test email: curl -X POST http://localhost:4500/api/admin/test-email \\"
echo "   -H \"Content-Type: application/json\" \\"
echo "   -H \"Authorization: Bearer YOUR_ADMIN_TOKEN\" \\"
echo "   -d '{\"to\": \"your-email@example.com\"}'"
echo ""
echo "📋 Important Notes:"
echo "• Resend requires domain verification, not just email verification"
echo "• Your sender domain must be verified in Resend dashboard"
echo "• API keys start with 're_'"
echo "• Check spam folder if emails don't arrive"
echo ""
echo "✅ Setup script completed!"
