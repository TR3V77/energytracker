# Energy Tracker

## Team Members
[Bruce Ngere]
[Daniel Delgado]
[Tobi O'jori]
[Trevor Strother]
[Davos D]

## What are we creating?
- We are creating a web-based dashboard application that tracks and 
  visualizes neighborhood-level energy consumption, renewable energy adoption, and sustainability trends.
- The system will allow users to: 
- Upload energy usage datasets 
- Analyze time-based consumption trends 
- Compare neighborhoods 
- Identify areas that require sustainability intervention 
- The application will transform raw energy data into meaningful visual insights.


## Who are we doing this for?
Our primary audience is:
- City planners
- Municipal sustainability departments
- Urban policy makers

Secondarily, this platform could also benefit:
- Environmental researchers
- Community advocacy groups
- Educational institutions studying sustainability
- Local inhabitants 


## Why are we doing this?
Cities are increasingly focused on sustainability and reducing environmental impact, but decision-makers often lack clear, accessible tools to analyze localized energy data.

Our goal is to:
- Make neighborhood energy trends easier to understand
- Support data-driven sustainability initiatives
- Help prioritize investments in renewable energy and efficiency improvements
- Encourage transparency and accountability in urban environmental planning


## General Info
---

## Technologies
- Basic / Tools: GitKraken, Jira, Slack, Bitbucket, VS Code
- Languages: Python, HTML, JavaScript
- Database:____
- Cloud Storage: AWS S3
- Data/APIs: TBD (Focused dataset/API integration if a reliable source is found)
- Frameworks: React (frontend)
- Deployment: Docker

## Features
- **Dataset Upload & Validation**
  - Upload CSV/JSON energy datasets
  - Schema checks + helpful error messages for bad files
- **Neighborhood Dashboard**
  - Select neighborhood and view key metrics:
    - Energy consumption over time (kWh)
    - Renewable adoption (if available)
    - Efficiency indicator (e.g., kWh/household or kWh/sq-ft if included)
- **Time Range Filtering**
  - Filter by date range (weekly/monthly/quarterly)
  - Compare two neighborhoods across the same window
- **Hotspot Identification**
  - “Top N neighborhoods” table for highest usage and/or worst trend
  - Quick trend indicators (rising/falling consumption)
- **Basic Reporting**
  - Summary stats: totals, averages, percent change
  - Export a simple report (CSV/JSON) or screenshot-ready “summary view”
