#!/bin/bash

# Text Formatter - Push to GitHub Script
# This script helps you push your text formatter to GitHub

echo "🚀 Text Formatter - GitHub Push Helper"
echo "======================================"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not initialized. Please run 'git init' first."
    exit 1
fi

# Check if there are uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Adding all changes..."
    git add .
    echo "💾 Committing changes..."
    git commit -m "Update text formatter component"
fi

echo ""
echo "🔗 Available options to push to GitHub:"
echo ""
echo "1. Create new repository on GitHub:"
echo "   - Go to: https://github.com/new"
echo "   - Repository name: textformatter-girish"
echo "   - Make it public"
echo "   - Don't initialize with README"
echo "   - Then run:"
echo "     git remote add origin https://github.com/YOUR_USERNAME/textformatter-girish.git"
echo "     git push -u origin main"
echo ""
echo "2. Contribute to existing repository:"
echo "   - Fork the technicalresearchersclub repository"
echo "   - Clone your fork"
echo "   - Copy these files to your fork"
echo "   - Push and create pull request"
echo ""
echo "3. Create organization repository:"
echo "   - Go to: https://github.com/technicalresearchersclub"
echo "   - Click 'New repository'"
echo "   - Name: textformatter-girish"
echo "   - Then run:"
echo "     git remote add origin https://github.com/technicalresearchersclub/textformatter-girish.git"
echo "     git push -u origin main"
echo ""

# Show current git status
echo "📊 Current Git Status:"
echo "====================="
git status --short
echo ""

# Show commit history
echo "📜 Recent Commits:"
echo "=================="
git log --oneline -5
echo ""

echo "✅ Your text formatter is ready to be pushed to GitHub!"
echo "📖 Check CONTRIBUTING.md for detailed instructions"
echo "🎉 Good luck with your contribution!"
