<div align="center">
  <h1>☁️ Droply</h1>
  <p><strong>A modern, full-stack file storage and management platform</strong></p>
  
  ![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=for-the-badge&logo=typescript)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8?style=for-the-badge&logo=tailwindcss)
  ![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
</div>

---

## 📖 About

**Droply** is a cloud-based file storage platform that allows users to securely upload, organize, and manage their files with an intuitive interface. Built with modern web technologies, it provides a seamless experience for file management with features like folder organization, starred files, trash management, and more.

### ✨ Key Features

- 📁 **Folder Management** - Create nested folders to organize your files
- ⭐ **Starred Files** - Quick access to your favorite files
- 🗑️ **Trash System** - Soft delete with restore functionality
- 🔍 **Search & Filter** - Find files quickly with search and sorting options
- 📤 **Drag & Drop Upload** - Easy file uploading with progress tracking
- 👁️ **View Modes** - Switch between grid and list views
- 🎨 **Modern UI** - Clean, dark-themed interface with smooth animations
- 🔐 **Secure Authentication** - User management powered by Clerk
- 📱 **Responsive Design** - Works seamlessly on all devices

---

## 🛠️ Tech Stack

### Frontend
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[HeroUI](https://www.heroui.com/)** - Beautiful React component library
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[Lucide React](https://lucide.dev/)** - Icon library

### Backend
- **[Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)** - Serverless API endpoints
- **[Drizzle ORM](https://orm.drizzle.team/)** - TypeScript ORM for SQL databases
- **[Neon](https://neon.tech/)** - Serverless Postgres database

### Authentication & Storage
- **[Clerk](https://clerk.com/)** - User authentication and management
- **[ImageKit](https://imagekit.io/)** - File storage, optimization, and CDN delivery

### Developer Tools
- **[React Hook Form](https://react-hook-form.com/)** - Form validation
- **[Zod](https://zod.dev/)** - Schema validation
- **[Axios](https://axios-http.com/)** - HTTP client
- **[ESLint](https://eslint.org/)** - Code linting
- **[Prettier](https://prettier.io/)** - Code formatting

---

## � Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn** or **pnpm**
- **Database** - Neon Postgres account
- **Clerk** account for authentication
- **ImageKit** account for file storage

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Abhishek-Sonje/Droply.git
   cd Droply
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   
   # Database (Neon)
   DATABASE_URL=your_neon_database_url
   
   # ImageKit
   NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
   IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
   NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   # or
   npm run db:migrate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
droply/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   └── files/            # File management endpoints
│   ├── dashboard/            # Dashboard pages
│   ├── sign-in/              # Authentication pages
│   └── sign-up/
├── components/               # React components
│   ├── fileCard.tsx          # File/folder card component
│   ├── filesList.tsx         # File listing component
│   ├── fileUploader.tsx      # File upload component
│   ├── Sidebar.tsx           # Navigation sidebar
│   ├── FolderModal.tsx       # Create folder modal
│   └── UploadModal.tsx       # Upload modal
├── contexts/                 # React contexts
│   └── RefreshContext.tsx    # File list refresh context
├── lib/                      # Utilities and configurations
│   └── db/                   # Database schema and config
│       ├── schema.ts         # Drizzle schema
│       └── index.ts          # Database connection
├── schemas/                  # Zod validation schemas
└── public/                   # Static assets
```

---

## 🎯 Features in Detail

### File Management
- Upload single or multiple files with drag-and-drop support
- Create and navigate through folders
- Download files individually
- Move files to trash (soft delete)
- Restore files from trash
- Permanently delete files

### Organization
- **My Files** - All your uploaded files and folders
- **Starred** - Quick access to frequently used files
- **Trash** - Restore or permanently delete files
- **Search** - Find files by name
- **Sort** - By date, name, or size
- **View Modes** - Grid or list view

### User Experience
- Real-time upload progress
- Auto-refresh after uploads
- Responsive design for mobile and desktop
- Dark theme optimized for reduced eye strain
- Smooth animations and transitions

---

## �️ Database Schema

The application uses Drizzle ORM with the following main tables:

- **users** - Extended user information (synced with Clerk)
- **files** - File metadata and organization
  - `id` - Unique identifier
  - `name` - File name
  - `fileUrl` - ImageKit URL
  - `size` - File size in bytes
  - `type` - MIME type
  - `isFolder` - Folder flag
  - `isStarred` - Starred flag
  - `isTrash` - Trash flag
  - `parentId` - Parent folder ID
  - `userId` - Owner user ID
  - `createdAt` - Creation timestamp

---

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push schema changes to database |
| `npm run db:studio` | Open Drizzle Studio |
| `npm run db:generate` | Generate migrations |
| `npm run db:migrate` | Run migrations |

---

## 🌐 API Endpoints

### Files
- `GET /api/files` - Get user's files
- `POST /api/files/upload` - Upload file
- `POST /api/files/create-folder` - Create folder
- `PATCH /api/files/[id]/star` - Toggle star status
- `PATCH /api/files/[id]/trash` - Move to/from trash
- `DELETE /api/files/[id]/delete` - Permanently delete
- `DELETE /api/files/empty-trash` - Empty trash

---

## 🎨 UI Components

Built with [HeroUI](https://www.heroui.com/), a modern React component library:

- Cards
- Modals
- Buttons
- Inputs
- Dropdowns
- Tooltips
- Popovers
- Loading Spinners

---

## 🔐 Authentication

User authentication is handled by [Clerk](https://clerk.com/), providing:

- Email/password authentication
- OAuth providers (Google, GitHub, etc.)
- User management dashboard
- Password reset functionality
- Session management
- Protected routes with middleware

---

## 📦 File Storage

Files are stored and delivered via [ImageKit](https://imagekit.io/):

- Automatic image optimization
- CDN delivery for fast access
- Folder-based organization
- Unique file naming to prevent conflicts
- Secure file URLs

---

## 🛣️ Roadmap

- [ ] File sharing with public/private links
- [ ] Collaborative folders
- [ ] File versioning
- [ ] Advanced search filters
- [ ] Storage usage analytics
- [ ] Mobile app (React Native)
- [ ] Bulk operations
- [ ] File preview for more types
- [ ] Activity logs

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Abhishek Sonje**

- GitHub: [@Abhishek-Sonje](https://github.com/Abhishek-Sonje)
- LinkedIn: [Abhishek Sonje](https://www.linkedin.com/in/abhishek-sonje)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Vercel](https://vercel.com/) for hosting
- [Clerk](https://clerk.com/) for authentication
- [ImageKit](https://imagekit.io/) for file storage
- [HeroUI](https://www.heroui.com/) for UI components
- All contributors and users of this project

---

<div align="center">
  <p>Made with ❤️ by Abhishek Sonje</p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>
