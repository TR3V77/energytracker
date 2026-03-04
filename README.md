# Energy Tracker

[![Build Status](https://img.shields.io/bitbucket/pipelines/cs3398-rodians-s26/energytracker/main)](https://bitbucket.org/cs3398-rodians-s26/energytracker/addon/pipelines/home)

## Team Members
[Bruce Ngere]
[Daniel Delgado]
[Tobi O'jori]
[Trevor Strother]
[Davos De Hoyos]

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
### Primary audience:
- Central Texas communities
- City planners
- Municipal sustainability departments
- Urban policy makers

### Secondary audience:
- Environmental researchers
- Community advocacy groups
- Educational institutions studying sustainability
- Local inhabitants 


## Why are we doing this?
Cities are increasingly focused on sustainability and reducing environmental impact, but decision-makers often lack clear, accessible tools to analyze localized energy data.

### Our goal is to:
- Make neighborhood energy trends easier to understand
- Support data-driven sustainability initiatives
- Help prioritize investments in renewable energy and efficiency improvements
- Encourage transparency and accountability in urban environmental planning


## General Info
![Project Logo](img/logo.png)

## Technologies
- Tools: GitKraken, Jira, Slack, Bitbucket, VS Code
- Languages: Python, HTML, JavaScript
- Database: PostgreSQL, SQLAlchemy
- Cloud Storage: AWS S3
- Data/APIs: TBD (Focused dataset/API integration if a reliable source is found)
- Frameworks: React (frontend)
- Deployment: Docker

## Features
## Sprint 1

### Contributions

**Daniel:** "Provided backend endpoints and filled in mock data until the database was set up. Then connected the backend API to the database. Did research for datasets as well"

- **Jira Task:** Daniel - Research: Flask Rest API
  - [PROJ-45](https://cs3398-rodians-s26.atlassian.net/jira/software/projects/PROJ/boards/1?selectedIssue=PROJ-45), [Bitbucket](https://bitbucket.org/cs3398-rodians-s26/energytracker/src/RESEARCH/research/)

- **Jira Task: ** Daniel - Backend: Dashboard analytics setup
  - [PROJ-47](https://cs3398-rodians-s26.atlassian.net/jira/software/projects/PROJ/boards/1?selectedIssue=PROJ-47), [Bitbucket](https://bitbucket.org/cs3398-rodians-s26/energytracker/src/RESEARCH/research/)

- **Jira Task:** Daniel - Backend: GET dashboard & analytics endpoints
  - [PROJ-18](https://cs3398-rodians-s26.atlassian.net/jira/software/projects/PROJ/boards/1?selectedIssue=PROJ-18), [Bitbucket](https://bitbucket.org/cs3398-rodians-s26/energytracker/pull-requests/6)

- **Jira Task:** Daniel - Research: Find Real Dataset
  - [PROJ-54](https://cs3398-rodians-s26.atlassian.net/jira/software/projects/PROJ/boards/1?selectedIssue=PROJ-54), [Bitbucket](https://bitbucket.org/cs3398-rodians-s26/energytracker/src/RESEARCH/research/)
  
- **Jira Task:** Daniel - Backend: Integrate DB layer into existing endpoints
  - [PROJ-53](https://cs3398-rodians-s26.atlassian.net/jira/software/projects/PROJ/boards/1?selectedIssue=PROJ-53), [Bitbucket *NOT MERGED*]()
  

**Trevor:** "provied the database and the data in the database for the dashboard"

- **Jira Task:** Trevor - Designed and prepared the PostgreSQL database and queries  
  - [PROJ-16](https://cs3398-rodians-s26.atlassian.net/jira/software/projects/PROJ/boards/1?selectedIssue=PROJ-16), [Bitbucket](https://bitbucket.org/cs3398-rodians-s26/energytracker/pull-requests/7)

- **Jira Task:** Trevor - Defines the API contract and database query strategy for the Energy Tracker Dashboard.
  - [PROJ-58](https://cs3398-rodians-s26.atlassian.net/jira/software/projects/PROJ/boards/1?selectedIssue=PROJ-58), [Bitbucket](https://bitbucket.org/cs3398-rodians-s26/energytracker/pull-requests/10)

- **Jira Task:** Trevor - Implemented multiple SQL verification queries to confirm successful data import and ensure database integrity. 
  - [PROJ-57](https://cs3398-rodians-s26.atlassian.net/jira/software/projects/PROJ/boards/1?selectedIssue=PROJ-57), [Bitbucket](https://bitbucket.org/cs3398-rodians-s26/energytracker/pull-requests/8)

## Report

![Burn Up Chart](img/burnupsprint1.png)

#### CSV Upload & Data Validation
- Upload energy consumption CSV files
- Validate schema (columns, types, missing values)
- Show error messages for bad rows
- Store valid data in PostgreSQL
- Trigger automatic summary calculation

### Interactive Dashboard
- Line charts showing energy usage over time
- Bar charts comparing neighborhoods
- Filters:
  - Neighborhood
  - Date range
  - Energy type (electric, gas, etc.)
- Real-time updates when filters change

### Neighborhood Efficiency Rankings
- Rank neighborhoods by efficiency score
- Example metric: `efficiency_score = total_kwh / number_of_households`
- Show leaderboard:

| Rank | Neighborhood | Efficiency Score |
|------|-------------|-----------------|
| 1 | Downtown | 320 |
| 2 | Riverside | 355 |

**Lower score = more efficient. This demonstrates analytics and SQL skills.**

### Trend Analysis
- Show month-over-month changes
- Show percent increase/decrease
- Example:
  - Downtown usage: Jan 12,000 kWh → Feb 11,000 kWh → Trend: ↓ 8.3%
- Visual indicators: arrows (↑ ↓) and color coding

### Recommendations Engine
- Rule-based recommendations (e.g., if `efficiency_score > threshold` → recommend energy reduction)
- Example output: "Downtown uses 25% more energy than average. Recommend insulation improvements."
- This demonstrates business intelligence logic.

**These features are designed for city planners and sustainability analysts reviewing neighborhood energy data.**

## User Stories 

#### Interactive Dashboard
  - As a user, I would like to view an interactive dashboard showing energy usage charts and summary metrics so that I can understand energy consumption trends across neighborhoods.

#### Neighborhood Efficiency Rankings
  - As a sustainability manager, I would like to see neighborhoods ranked by efficiency score so that I can identify high and low performing areas.

#### Recommendations Engine
  - As a city planner, I would like the dashboard to generate recommendations (e.g., insulation, HVAC upgrades, rebate outreach) based on the neighborhood's metrics so that I can propose actionable next steps.

#### CSV Upload & Data Validation
  - As a data administrator, I would like to see a detailed report after uploading a file showing valid records imported and specific row-level errors so that I can correct and re-upload invalid data.
  - As an analyst, I would like to upload energy data in either CSV or JSON format so that I can import data from different sources and tools without manual conversion.
