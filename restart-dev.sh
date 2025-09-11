#!/bin/bash

# Quick restart script for when your IP changes
echo "🔄 Restarting development servers..."

# Kill existing processes
echo "🛑 Stopping existing servers..."
pkill -f "npm run dev" || true
pkill -f "expo start" || true

# Wait a moment
sleep 2

echo "🚀 Starting API server..."
cd "apps/api"
npm run dev &
API_PID=$!

echo "📱 Starting mobile app..."
cd "../mobile"
npx expo start --clear &
MOBILE_PID=$!

echo "✅ Servers started!"
echo "📡 API Server PID: $API_PID"
echo "📱 Mobile App PID: $MOBILE_PID"
echo ""
echo "💡 To stop both servers, run:"
echo "   kill $API_PID $MOBILE_PID"
echo ""
echo "📋 Or use: pkill -f 'npm run dev' && pkill -f 'expo start'"
