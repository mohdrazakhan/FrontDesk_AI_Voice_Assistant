#!/bin/bash

# FrontDesk Voice Agent Restart Script
# This script safely restarts the voice agent by cleaning up ports and processes

echo "🔄 Restarting FrontDesk Voice Agent..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Step 1: Kill any process using port 8081
echo "🔍 Checking for processes on port 8081..."
lsof -ti:8081 | xargs kill -9 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ Port 8081 freed"
else
    echo "ℹ️  No process found on port 8081"
fi

# Step 2: Kill any running agent processes
echo "🔍 Stopping existing agent processes..."
pkill -9 -f "agent_voice.py" 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ Existing agent processes stopped"
else
    echo "ℹ️  No agent processes found"
fi

# Step 3: Wait for cleanup
echo "⏳ Waiting 3 seconds for cleanup..."
sleep 3

# Step 4: Activate virtual environment
echo "🐍 Activating virtual environment..."
cd "$(dirname "$0")"
source venv/bin/activate
if [ $? -eq 0 ]; then
    echo "✅ Virtual environment activated"
else
    echo "❌ Failed to activate virtual environment"
    exit 1
fi

# Step 5: Start the agent
echo "🚀 Starting voice agent..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
python agent_voice.py start

# If agent stops, show error
if [ $? -ne 0 ]; then
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "❌ Agent failed to start"
    echo "💡 Check the error messages above"
    exit 1
fi
