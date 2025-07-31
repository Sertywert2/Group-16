# Team Member List

| No. | Name               |
|-----|--------------------|
| 1   | Bedru Mekiyu       |
| 2   | Robel Wondwosen    |
| 3   | Kirubel Bishaw     |
| 4   | Tsegamlak Bizuneh  |

# MyGovInsights 
## Overview
MyGovInsights  is a full-stack web application designed to empower citizens to provide feedback on public services while equipping government administrators with tools to analyze and act on this data. By fostering transparent communication, the app aims to improve public service delivery and enhance civic engagement.
## Purpose
The primary goal of MyGovInsights is to bridge the gap between citizens and government by:

Enabling citizens to easily share feedback on services like Transportation, Parks, Healthcare, and Roads.
Providing administrators with actionable insights through data visualization and exportable reports.
Promoting inclusivity with accessible design and a user-friendly interface.

## Features
### For Citizens

Feedback Form: Rate public services (1–5 stars), leave optional comments, and provide optional contact details (email or phone).
Accessible Design: ARIA labels and keyboard navigation ensure usability for all citizens.
Dark Mode: Toggle between light and dark themes for comfortable viewing.

### For Administrators

Secure Login: Email-based authentication using JSON Web Tokens (JWT).
Dashboard: View paginated feedback in a table, filter by service or rating, and see average ratings per service via Chart.js visualizations.
Data Export: Download feedback as CSV for external analysis.
Dark Mode: Consistent UI experience with theme toggle.

## Target Audience

Citizens: Individuals seeking to voice their opinions on public services, including those with accessibility needs.
Government Administrators: Officials or analysts responsible for monitoring and improving public service quality.

## Technologies Used

Frontend: React, Tailwind CSS, Chart.js
Backend: Node.js, Express.js
Database: MongoDB (Mongoose)
Authentication: JSON Web Tokens (JWT)
Deployment: Vercel (frontend), Render (backend + database)

## Contributions to Government Services and Citizens

Data-Driven Decisions: Aggregated feedback and visualized stats (e.g., average ratings per service) help identify strengths and weaknesses in public services, enabling targeted improvements.
Efficiency: The CSV export feature allows administrators to integrate feedback into existing workflows or reporting tools, streamlining analysis.
Transparency: By acting on citizen feedback, governments can build trust and demonstrate accountability.

### For Citizens

Empowerment: A simple, accessible form ensures all citizens, regardless of technical or physical ability, can share their experiences.
Impact: Feedback directly informs service improvements, giving citizens a tangible role in shaping their communities.
Inclusivity: Dark mode and accessibility features make the app welcoming to diverse users.

## Installation and Setup

Clone the Repository:git clone https://github.com/your-username/mygovinsights.git
cd mygovinsights


Backend Setup:
Navigate to backend/.
Install dependencies: npm install.
Create a .env file with:MONGO_URI=your-mongodb-uri
PORT=5000
JWT_SECRET=your-secret-key


Start the server: npm run dev.


Frontend Setup:
Navigate to frontend/.
Install dependencies: npm install.
Start the React app: npm start.


MongoDB: Ensure MongoDB is running locally or use a cloud provider like MongoDB Atlas.

## Usage

Citizens: Visit the app, select a service, rate it, and submit feedback anonymously or with contact details.
Admins: Log in with credentials, view feedback in the dashboard, filter results, and export data as needed.

## Future Enhancements

Multilingual support for broader accessibility.
Email notifications for new feedback submissions.
Advanced rate limiting to prevent spam.
Unit and end-to-end testing for robustness.

## Contributing
Contributions are welcome! To contribute:

Fork the repository.
Create a feature branch: git checkout -b feature-name.
Commit changes: git commit -m "Add feature-name".
Push to the branch: git push origin feature-name.
Open a pull request with a clear description of your changes.

Please follow the Code of Conduct and ensure your code adheres to the project’s style guidelines.
## License
This project is licensed under the MIT License.
## Contact
For questions or feedback, reach out via your-email@example.com or open an issue on GitHub.

Built with 💻 and ☕ to improve civic engagement!
