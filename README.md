# 🌱 GreenVerse - বাগানপ্রেমীদের সামাজিক নেটওয়ার্ক

GreenVerse হল একটি বাংলা ভাষায় নির্মিত সামাজিক নেটওয়ার্ক প্ল্যাটফর্ম যেখানে বাগানপ্রেমীরা তাদের অভিজ্ঞতা, টিপস, এবং জ্ঞান শেয়ার করতে পারে।

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Routes](#available-routes)
- [Key Components](#key-components)
- [Development](#development)
- [Contributing](#contributing)

## 🎯 Overview

GreenVerse একটি সম্পূর্ণ বাংলা ভাষায় নির্মিত React-based ওয়েব অ্যাপ্লিকেশন যা বাগানপ্রেমীদের জন্য একটি কমিউনিটি প্ল্যাটফর্ম প্রদান করে। ব্যবহারকারীরা এখানে:

- তাদের বাগানের ছবি এবং আপডেট শেয়ার করতে পারে
- গার্ডেনিং টিপস এবং টিউটোরিয়াল দেখতে পারে
- প্ল্যান্ট, টুলস এবং সরঞ্জাম কিনতে পারে
- গ্রুপে যোগ দিয়ে আলোচনা করতে পারে
- শিক্ষামূলক রিসোর্স পড়তে পারে
- শর্ট ভিডিও (রিলস) দেখতে এবং শেয়ার করতে পারে

## ✨ Features

### 🏠 Core Features

- **Feed**: হোম ফিডে ব্যবহারকারীদের পোস্ট, ছবি এবং আপডেট দেখুন
- **Shop**: বাগানের জন্য প্রয়োজনীয় পণ্য ব্রাউজ করুন এবং কিনুন
- **Groups**: কমিউনিটি গ্রুপে যোগ দিন এবং আলোচনায় অংশ নিন
- **Library**: গার্ডেনিং সম্পর্কিত আর্টিকেল, গাইড এবং ভিডিও পড়ুন
- **My Garden**: আপনার বাগানের গাছগুলোর ট্র্যাক রাখুন
- **Reels**: শর্ট ভিডিও দেখুন এবং শেয়ার করুন

### 🔐 Authentication

- **Login**: ইমেইল/ফোন এবং পাসওয়ার্ড দিয়ে লগইন করুন
- **Signup**: নতুন একাউন্ট তৈরি করুন
- **Social Login**: Google এবং Facebook দিয়ে লগইন করুন

### ⚙️ User Features

- **Notifications**: সব বিজ্ঞপ্তি এক জায়গায় দেখুন
- **Settings**: একাউন্ট সেটিংস, নোটিফিকেশন প্রেফারেন্স এবং ভাষা পরিবর্তন করুন
- **Profile**: ব্যবহারকারী প্রোফাইল দেখুন এবং এডিট করুন

### 🎨 UI/UX Features

- **Responsive Design**: সব ডিভাইসে পারফেক্ট কাজ করে
- **Bengali Language Support**: সম্পূর্ণ বাংলা ইন্টারফেস
- **Modern Scrollbar**: কাস্টম স্ক্রলবার ডিজাইন
- **Active State Navigation**: সক্রিয় পেজ হাইলাইট করা
- **Smooth Transitions**: মসৃণ অ্যানিমেশন এবং ট্রানজিশন

## 🛠 Tech Stack

### Frontend

- **React 19.2.0** - UI লাইব্রেরি
- **TypeScript 5.9.3** - টাইপ সেফটি
- **Vite 7.2.4** - বিল্ড টুল এবং ডেভ সার্ভার
- **React Router 7.12.0** - রাউটিং
- **Tailwind CSS 4.1.18** - CSS ফ্রেমওয়ার্ক

### Development Tools

- **ESLint** - কোড লিন্টিং
- **TypeScript ESLint** - TypeScript-specific linting
- **PostCSS** - CSS প্রসেসিং
- **Autoprefixer** - CSS vendor prefixing

## 📁 Project Structure

```
GreenVerse/
├── client/
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── assets/
│   │   │   └── react.svg
│   │   ├── components/
│   │   │   └── Layout/
│   │   │       ├── Feed.tsx          # Main feed component
│   │   │       ├── LeftSidebar.tsx   # Navigation sidebar
│   │   │       ├── MainLayout.tsx    # Main layout wrapper
│   │   │       └── RightSidebar.tsx  # Right sidebar
│   │   ├── pages/
│   │   │   ├── Group.tsx            # Groups page
│   │   │   ├── Library.tsx          # Library/Resources page
│   │   │   ├── Login.tsx            # Login page
│   │   │   ├── MyGarden.tsx         # My Garden dashboard
│   │   │   ├── Notifications.tsx    # Notifications page
│   │   │   ├── Reels.tsx            # Reels/Short videos page
│   │   │   ├── Settings.tsx         # Settings page
│   │   │   ├── Shop.tsx             # Shop/E-commerce page
│   │   │   └── Signup.tsx           # Signup page
│   │   ├── routes/
│   │   │   └── routes.tsx           # Route configuration
│   │   ├── App.tsx                  # Main App component
│   │   ├── App.css                  # App styles
│   │   ├── index.css                # Global styles
│   │   └── main.tsx                 # Entry point
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.js
│   ├── README.md
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
└── README.md                         # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd GreenVerse
   ```

2. **Navigate to client directory**
   ```bash
   cd client
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🗺 Available Routes

### Public Routes

- `/login` - লগইন পেজ
- `/signup` - সাইনআপ পেজ

### Protected Routes (Requires Authentication)

- `/` - হোম ফিড
- `/reels` - রিলস/শর্ট ভিডিও
- `/shop` - দোকান/ই-কমার্স
- `/group` - গ্রুপ
- `/library` - লাইব্রেরি/রিসোর্স
- `/my-garden` - আমার বাগান ড্যাশবোর্ড
- `/notifications` - বিজ্ঞপ্তি
- `/settings` - সেটিংস

## 🧩 Key Components

### Layout Components

- **MainLayout**: প্রধান লেআউট যা সব পেজে ব্যবহার হয়
  - Header with search and notifications
  - Left sidebar navigation
  - Main content area
  - Right sidebar

- **LeftSidebar**: নেভিগেশন সাইডবার
  - Main navigation links
  - Quick links (Notifications, Settings)
  - Language switcher
  - User profile

- **Feed**: হোম ফিড কম্পোনেন্ট
  - Create post section
  - Category filters
  - Post cards with interactions

- **RightSidebar**: ডান সাইডবার
  - Trending topics
  - Suggested users
  - Advertisements

### Page Components

- **Shop**: ই-কমার্স পেজ
  - Product grid
  - Category filters
  - Product cards with details

- **Group**: গ্রুপ পেজ
  - Group listings
  - Group cards with member count
  - Join group functionality

- **Library**: লাইব্রেরি পেজ
  - Resource listings
  - Filter by type (Article, Guide, Video)
  - Level-based filtering

- **MyGarden**: বাগান ড্যাশবোর্ড
  - Plant tracking
  - Watering reminders
  - Plant status indicators

- **Reels**: রিলস পেজ
  - Short video grid
  - Video thumbnails
  - View counts and likes

- **Notifications**: বিজ্ঞপ্তি পেজ
  - Notification list
  - Filter by type
  - Mark as read functionality

- **Settings**: সেটিংস পেজ
  - Account settings
  - Notification preferences
  - Language selection

## 💻 Development

### Code Style

- TypeScript strict mode enabled
- ESLint for code quality
- Component-based architecture
- Functional components with hooks

### Styling

- Tailwind CSS for utility-first styling
- Custom scrollbar design
- Responsive breakpoints
- Green color scheme (matching garden theme)

### State Management

Currently using local component state. For future scalability, consider:
- Context API for global state
- Redux or Zustand for complex state management
- React Query for server state

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Guidelines

- Follow TypeScript best practices
- Use meaningful component and variable names
- Write comments for complex logic
- Maintain Bengali language support
- Ensure responsive design
- Test on multiple browsers

## 📝 License

This project is private and proprietary.

## 👥 Authors

- **Development Team** - GreenVerse

## 🙏 Acknowledgments

- React community for excellent documentation
- Tailwind CSS for the utility-first CSS framework
- Bengali language support for making the platform accessible

## 📞 Contact

For questions or support, please open an issue in the repository.

---

**Made with ❤️ for the gardening community in Bangladesh**
