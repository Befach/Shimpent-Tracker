# Shipment Tracker

A modern web application for tracking and managing shipments, built with Next.js, Firebase, and Supabase.

## 🚀 Features

- **Real-time Shipment Tracking**: Track shipments in real-time with detailed status updates
- **Admin Dashboard**: Comprehensive dashboard for managing shipments and users
- **Enhanced Tracking**: Advanced tracking features with detailed shipment information
- **Responsive Design**: Mobile-friendly interface that works on all devices
- **Secure Authentication**: Protected routes and secure user authentication
- **Modern UI/UX**: Clean and intuitive user interface built with modern design principles

## 🛠️ Tech Stack

- **Frontend Framework**: Next.js
- **Database**: Supabase
- **Authentication**: Firebase Authentication
- **Styling**: Tailwind CSS
- **Deployment**: Firebase Hosting
- **Type Safety**: TypeScript

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- Git

## 🔧 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/pavan-musthala/shipment-tracker-befach.git
   cd shipment-tracker-befach
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   FIREBASE_API_KEY=your_firebase_api_key
   FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   FIREBASE_PROJECT_ID=your_firebase_project_id
   FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   FIREBASE_APP_ID=your_firebase_app_id
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

```
shipment-tracker/
├── components/     # Reusable UI components
├── contexts/       # React context providers
├── dataconnect/    # Data connection utilities
├── functions/      # Firebase cloud functions
├── lib/           # Utility functions and configurations
├── pages/         # Next.js pages and API routes
│   ├── admin/     # Admin dashboard pages
│   └── track/     # Tracking related pages
├── public/        # Static assets
└── styles/        # Global styles and CSS modules
```

## 🔐 Authentication

The application uses Firebase Authentication for user management. Users can:
- Sign up with email/password
- Sign in with existing credentials
- Reset password
- Access role-based protected routes

## 🚢 Shipment Management

### Admin Features
- Create new shipments
- Edit existing shipments
- View shipment details
- Manage shipment status
- Track shipment history

### User Features
- Track shipments using tracking ID
- View shipment status and details
- Receive real-time updates

## 🎨 UI/UX Features

- Responsive design for all screen sizes
- Dark/Light mode support
- Loading states and animations
- Error handling and user feedback
- Intuitive navigation

## 🚀 Deployment

The application is configured for deployment on Firebase Hosting. To deploy:

1. Build the application:
   ```bash
   npm run build
   # or
   yarn build
   ```

2. Deploy to Firebase:
   ```bash
   firebase deploy
   ```

### Automatic Deployment
The application is configured with GitHub Actions for automatic deployment. Any push to the main branch will trigger:
1. Building the application
2. Running tests
3. Deploying to Firebase Hosting

The deployment status can be monitored in the GitHub Actions tab of the repository.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Pavan Musthala - Initial work

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Firebase team for the backend services
- Supabase team for the database solution
- All contributors who have helped shape this project
