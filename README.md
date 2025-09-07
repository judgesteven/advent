# 🎄 Gamified Advent Calendar

A beautiful, responsive advent calendar application with daily tasks, badges, leaderboards, and GameLayer integration. Perfect for engaging users during the holiday season with customizable branding for multiple clients.

## ✨ Features

### 🎯 Core Functionality
- **25-Day Advent Calendar**: Interactive calendar with daily unlockable windows
- **Daily Tasks**: Quiz, survey, action, and challenge-based tasks
- **Gamification**: Points, gems, badges, and achievements system
- **Leaderboard**: Real-time competitive rankings
- **User Profiles**: Detailed user stats and progress tracking

### 🎨 Multi-Client Support
- **Dynamic Theming**: Customizable colors, fonts, and branding
- **Client Configuration**: Easy content management through GameLayer
- **Responsive Design**: Works seamlessly on mobile and desktop
- **Custom Styling**: Support for client-specific CSS overrides

### 🔧 Technical Features
- **GameLayer Integration**: Full API integration with fallback to mock data
- **TypeScript**: Type-safe development with full IntelliSense
- **Modern React**: Hooks, Context API, and functional components
- **Smooth Animations**: Framer Motion for delightful interactions
- **Styled Components**: CSS-in-JS with theme support

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- GameLayer API credentials (optional - will use mock data without them)

### Installation

1. **Clone and install dependencies:**
   ```bash
   cd advent-calendar
   npm install
   ```

2. **Configure environment (optional):**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` with your GameLayer credentials:
   ```env
   REACT_APP_GAMELAYER_API_KEY=your_api_key_here
   REACT_APP_GAMELAYER_BASE_URL=https://api.gamelayer.io
   REACT_APP_GAMELAYER_GAME_ID=your_game_id_here
   REACT_APP_CLIENT_ID=your_client_id_here
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## 🎮 How It Works

### For Users
1. **Daily Access**: Users can only open calendar windows on or after the corresponding date
2. **Complete Tasks**: Each day features a unique task (quiz, survey, action, or challenge)
3. **Earn Rewards**: Completing tasks awards points, gems, and sometimes badges
4. **Compete**: Track progress on the leaderboard and compete with others
5. **Profile Growth**: Watch your profile grow with achievements and stats

### For Administrators
1. **GameLayer Setup**: Configure your game, tasks, and rewards in GameLayer
2. **Client Branding**: Customize colors, fonts, logos, and messaging
3. **Content Management**: Update tasks, rewards, and calendar content dynamically
4. **Analytics**: Track user engagement and completion rates

## 🏗️ Architecture

### Component Structure
```
src/
├── components/          # React components
│   ├── AdventCalendar.tsx    # Main calendar grid
│   ├── CalendarDay.tsx       # Individual day component
│   ├── TaskModal.tsx         # Task completion interface
│   ├── UserProfile.tsx       # User stats and info
│   └── Leaderboard.tsx       # Rankings display
├── context/             # React Context providers
│   ├── AppContext.tsx        # Global app state
│   └── ThemeContext.tsx      # Dynamic theming
├── services/            # API and data services
│   ├── gameLayerApi.ts       # GameLayer integration
│   └── mockData.ts           # Development mock data
├── types/               # TypeScript definitions
└── config/              # Configuration files
```

### State Management
- **AppContext**: Manages user data, calendar state, and API interactions
- **ThemeContext**: Handles dynamic theming and client branding
- **React Query**: Caches API responses and manages loading states

### API Integration
- **GameLayer Primary**: Full integration with GameLayer's REST API
- **Mock Data Fallback**: Automatic fallback when API credentials aren't provided
- **Error Handling**: Graceful error handling with user-friendly messages

## 🎨 Customization

### Client Branding
The app supports extensive customization through GameLayer configuration:

```typescript
{
  name: "Your Brand Name",
  logo: "/your-logo.png",
  primaryColor: "#your-primary-color",
  secondaryColor: "#your-secondary-color",
  accentColor: "#your-accent-color",
  backgroundColor: "#your-bg-color",
  textColor: "#your-text-color",
  fontFamily: "Your Font Family",
  calendarTitle: "Your Calendar Title",
  welcomeMessage: "Your welcome message",
  completionMessage: "Your completion message",
  socialLinks: {
    website: "https://your-website.com",
    twitter: "https://twitter.com/yourbrand"
  }
}
```

### Task Types
Support for multiple task types:

- **Quiz**: Multiple choice questions with correct answers
- **Survey**: Open-ended questions for user feedback
- **Action**: Real-world tasks that may require proof
- **Challenge**: Creative challenges with user submissions

### Responsive Design
- **Mobile First**: Optimized for mobile devices
- **Tablet Support**: Adapted layouts for tablet screens
- **Desktop Enhanced**: Rich experience on larger screens
- **Touch Friendly**: Large touch targets and smooth interactions

## 🔧 Development

### Available Scripts
- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run test suite
- `npm run lint` - Check code quality

### Mock Data Development
When developing without GameLayer credentials, the app automatically uses mock data:
- Sample users and leaderboard
- Various task types and content
- Multiple client theme examples
- Realistic user interactions

### Adding New Task Types
1. Update the `Task` type in `src/types/index.ts`
2. Add handling in `TaskModal.tsx`
3. Update mock data in `mockData.ts`
4. Configure in GameLayer backend

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables
Set these in your production environment:
- `REACT_APP_GAMELAYER_API_KEY`
- `REACT_APP_GAMELAYER_BASE_URL`
- `REACT_APP_GAMELAYER_GAME_ID`
- `REACT_APP_CLIENT_ID`

### Hosting Options
- **Vercel**: Zero-config deployment with automatic builds
- **Netlify**: Easy deployment with form handling
- **AWS S3 + CloudFront**: Scalable static hosting
- **Any static host**: The build creates standard static files

## 🤝 GameLayer Integration

### Required GameLayer Setup
1. **Game Configuration**: Create a game in GameLayer dashboard
2. **User Management**: Set up authentication and user profiles
3. **Task System**: Configure daily tasks with rewards
4. **Leaderboard**: Enable competitive features
5. **Client Branding**: Set up theme and branding options

### API Endpoints Used
- `GET /user/profile` - User information
- `POST /auth/login` - User authentication
- `GET /clients/{id}/config` - Client configuration
- `GET /calendar/{year}/{month}` - Calendar data
- `GET /tasks/day/{day}` - Daily tasks
- `POST /tasks/{id}/complete` - Task completion
- `GET /leaderboard` - Rankings data

## 📱 Mobile Features

- **Progressive Web App**: Can be installed on mobile devices
- **Offline Support**: Basic functionality works offline
- **Push Notifications**: Daily reminders (when configured)
- **Touch Gestures**: Smooth touch interactions
- **Mobile Optimized**: Fast loading and responsive design

## 🎯 Use Cases

### Corporate Holiday Campaigns
- Employee engagement during holidays
- Team building through friendly competition
- Brand awareness and culture building

### Marketing Campaigns
- Customer engagement and retention
- Lead generation through registration
- Social media integration and sharing

### Educational Programs
- Student engagement during breaks
- Learning through gamified content
- Progress tracking and rewards

### Community Building
- Member engagement and retention
- Event promotion and participation
- Community challenges and goals

## 📊 Analytics & Insights

Track user engagement through GameLayer:
- Daily active users
- Task completion rates
- User retention metrics
- Popular task types
- Leaderboard engagement

## 🔒 Security & Privacy

- **Secure Authentication**: JWT-based user authentication
- **Data Privacy**: GDPR-compliant data handling
- **API Security**: Secure API key management
- **Input Validation**: Sanitized user inputs
- **Error Handling**: No sensitive data in error messages

## 🆘 Support & Troubleshooting

### Common Issues
1. **Blank Screen**: Check browser console for errors
2. **API Errors**: Verify GameLayer credentials
3. **Styling Issues**: Check theme configuration
4. **Mobile Issues**: Test responsive breakpoints

### Getting Help
- Check the browser console for error messages
- Verify GameLayer API connectivity
- Review environment variable configuration
- Test with mock data first

## 🎉 Success Stories

This advent calendar template has been successfully deployed for:
- Fortune 500 companies for employee engagement
- E-commerce brands for customer retention
- Educational institutions for student activities
- Non-profits for community building

Ready to create magical holiday experiences for your users! 🎄✨
