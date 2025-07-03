# Anton's Trading Journal 📈

A comprehensive, professional trading journal application built with Next.js, TypeScript, and Supabase. Track your trades, analyze performance, manage emotions, and improve your trading strategy with advanced analytics.

## ✨ Features

### 🏦 Account Management
- Create and manage multiple trading accounts
- Support for different currencies (USD, EUR, GBP, INR)
- Real-time P&L tracking and ROI calculations
- Account balance management

### 📊 Trade Tracking
- Comprehensive trade entry with all essential fields
- Buy/Sell trade types with lot size tracking
- Entry/Exit prices, Stop Loss, Take Profit
- R-Multiple calculations for risk management
- Trade status tracking (Open, Closed, Stopped Out)

### 🧠 Emotional Intelligence
- Emotional state tracking for each trade
- Mistake logging and lesson learned documentation
- Pattern recognition for emotional trading behaviors
- Performance analysis by emotional state

### 🏷️ Advanced Organization
- Custom tagging system for trade categorization
- Flexible filtering by status, emotion, tags, dates
- Win/Loss filtering for performance analysis
- Screenshot URL storage for chart references

### 📈 Analytics & Insights
- Win rate and streak tracking
- Risk management summaries
- Performance heatmaps with calendar view
- Tag performance analysis
- Emotional pattern insights
- Common mistakes and lessons learned

### 💾 Dual Storage System
- **Local Storage**: Works offline, no setup required
- **Supabase Cloud**: Real-time sync across devices
- One-click migration between storage modes
- Automatic fallback protection

### 🎨 User Experience
- Dark/Light mode toggle
- Responsive design for all devices
- Export/Import functionality (JSON)
- Real-time notifications and feedback
- Professional UI with shadcn/ui components

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (optional, for cloud storage)

### Installation

1. **Clone or download the project**
\`\`\`bash
git clone <your-repo-url>
cd trading-journal-pro
\`\`\`

2. **Install dependencies**
\`\`\`bash
npm install
# or
yarn install
\`\`\`

3. **Environment Setup (Optional - for Supabase)**
Create a `.env.local` file in the root directory:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
\`\`\`

4. **Run the development server**
\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Setup (Optional - for Cloud Storage)

If you want to use Supabase cloud storage:

1. **Create a Supabase project** at [supabase.com](https://supabase.com)

2. **Run the database setup script**
   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Copy and paste the contents of `scripts/create-supabase-tables.sql`
   - Run the script to create tables and indexes

3. **Enable Supabase mode** in the app using the toggle switch

## 📁 Project Structure

\`\`\`
trading-journal-pro/
├── app/
│   ├── globals.css          # Global styles with dark mode support
│   ├── layout.tsx           # Root layout with toast provider
│   └── page.tsx             # Main application component
├── components/ui/           # shadcn/ui components
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   ├── input.tsx
│   ├── switch.tsx
│   ├── tabs.tsx
│   ├── toast.tsx
│   └── ...
├── hooks/
│   └── use-toast.ts         # Toast notification hook
├── lib/
│   ├── supabase.ts          # Supabase client and types
│   ├── storage-service.ts   # Unified storage service
│   └── utils.ts             # Utility functions
├── scripts/
│   └── create-supabase-tables.sql  # Database schema
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
\`\`\`

## 🎯 Usage Guide

### Getting Started
1. **Create Your First Account**
   - Click "Add Account" on the Accounts tab
   - Enter account name, initial balance, and currency
   - Select the account to start trading

2. **Record Your First Trade**
   - Go to "Add Trade" tab
   - Fill in required fields (Symbol, Type, Entry Price)
   - Add optional fields like Stop Loss, Take Profit, Risk Amount
   - Include emotional state and tags for better analysis

3. **Analyze Performance**
   - View real-time statistics on the Trades tab
   - Explore detailed analytics for insights
   - Use the heatmap to visualize daily performance

### Storage Options

#### Local Storage (Default)
- Works immediately without setup
- Data stored in your browser
- Perfect for single-device usage
- No internet required

#### Supabase Cloud Storage
- Toggle "Supabase" switch in top-right
- Sync data across multiple devices
- Real-time updates and backup
- Requires internet connection

### Key Features Explained

#### R-Multiple Calculation
The app automatically calculates R-Multiple (Risk-Reward Ratio):
- **R-Multiple = Profit/Loss ÷ Risk Amount**
- Helps evaluate trade quality beyond just profit/loss
- Essential for professional risk management

#### Emotional Tracking
- Record your emotional state for each trade
- Identify patterns between emotions and performance
- Learn to recognize and control emotional trading

#### Tag System
- Categorize trades with custom tags
- Examples: "FOMO", "News Trade", "High Conviction"
- Analyze performance by trade type

## 🛠️ Development

### Tech Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React

### Key Dependencies
\`\`\`json
{
  "@supabase/supabase-js": "^2.x",
  "next": "14.x",
  "react": "18.x",
  "typescript": "5.x",
  "tailwindcss": "3.x",
  "@radix-ui/react-*": "Various UI primitives"
}
\`\`\`

### Available Scripts
\`\`\`bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
\`\`\`

### Customization

#### Adding New Currencies
Edit the currency options in `app/page.tsx`:
\`\`\`typescript
<SelectContent>
  <SelectItem value="USD">USD</SelectItem>
  <SelectItem value="EUR">EUR</SelectItem>
  <SelectItem value="GBP">GBP</SelectItem>
  <SelectItem value="INR">INR</SelectItem>
  <SelectItem value="JPY">JPY</SelectItem> // Add new currency
</SelectContent>
\`\`\`

#### Modifying Trade Fields
Add new fields to the `Trade` interface in `app/page.tsx` and update the form accordingly.

#### Styling Changes
- Modify `app/globals.css` for global styles
- Update Tailwind classes in components
- Customize dark mode colors in CSS variables

## 🔧 Troubleshooting

### Common Issues

#### "Account creation not working"
- Check that all required fields are filled
- Ensure initial balance is greater than 0
- Verify no duplicate account names

#### "Supabase connection failed"
- Verify environment variables are set correctly
- Check Supabase project URL and API key
- Ensure database tables are created
- Check network connection

#### "Data not syncing"
- Toggle Supabase mode off and on
- Use the manual "Sync" button
- Check browser console for errors
- Verify Supabase project is active

#### "Dark mode not working properly"
- Clear browser cache and localStorage
- Check if system dark mode is interfering
- Verify CSS variables are loaded correctly

### Performance Tips
- Use local storage for better performance
- Enable Supabase only when needed
- Regularly export data as backup
- Clear old trades if performance degrades

## 📊 Data Management

### Export Data
- Click "Export" button on Trades tab
- Downloads JSON file with all trade data
- Use for backup or analysis in other tools

### Import Data
- Currently supports manual data entry
- JSON import feature can be added if needed

### Data Migration
- Local to Supabase: Automatic when toggling Supabase mode
- Supabase to Local: Use "Sync" button to pull data

## 🔐 Security & Privacy

### Local Storage
- Data stored only in your browser
- No external transmission
- Cleared when browser data is cleared

### Supabase Storage
- Data encrypted in transit and at rest
- Row Level Security (RLS) enabled
- No personal data required for basic usage

## 🤝 Contributing

This is a personal trading journal application. If you'd like to contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is for personal use. Modify and distribute as needed for your trading journey.

## 🆘 Support

For issues or questions:
1. Check this README first
2. Look at browser console for errors
3. Verify all setup steps were completed
4. Check Supabase dashboard if using cloud storage

## 🎯 Roadmap

Future enhancements could include:
- [ ] User authentication and multi-user support
- [ ] Advanced charting and visualization
- [ ] Trading strategy backtesting
- [ ] Mobile app version
- [ ] Integration with trading platforms
- [ ] Advanced risk management tools
- [ ] Social features and trade sharing
- [ ] AI-powered trade analysis

---

**Happy Trading! 📈💰**

Remember: This journal is a tool to help you become a better trader. Consistency in logging trades and honest self-reflection are key to improvement.
