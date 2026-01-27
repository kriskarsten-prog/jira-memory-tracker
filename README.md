# Jira Memory Tracker (Chrome Extension)

A lightweight Chrome extension for Jira Cloud that helps operators, admins, and support teams
track ticket progress across queues without constantly reopening individual issues.

## Problem
Jira queues require opening tickets individually to remember:
- Current status
- Whether a reporter has replied
- What work was last done
- Where attention is needed next

This creates unnecessary context switching and cognitive load.

## Solution
Jira Memory Tracker automatically captures key ticket metadata when tickets are viewed and
provides a centralized dashboard with:
- Ticket status, assignee, reporter
- Last viewed timestamp
- Private workflow notes
- CSV export for reporting and retrospectives

## Features
- Works with Jira Cloud
- Tracks tickets opened from queues or direct links
- Local private notes per ticket
- One-click CSV export
- No backend required

## Tech Stack
- JavaScript
- Chrome Extensions (Manifest v3)
- Jira Cloud DOM integration
- Chrome local storage

## Use Cases
- Sales Operations
- Revenue Operations
- Support Operations
- Jira Admins
- Program Managers

## Installation (Developer Mode)
1. Clone the repo
2. Go to `chrome://extensions`
3. Enable Developer Mode
4. Click "Load unpacked"
5. Select the project folder

## Future Enhancements
- Reporter reply detection
- Stale ticket alerts
- Shared team notes
- Jira API integration

