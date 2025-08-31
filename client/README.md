# Pokemon App - Client

A modern React TypeScript application for managing and exploring Pokemon collections. Built with Vite, Tailwind CSS, and shadcn/ui components.

## 🚀 Features

- **Pokemon Collection Management**: View, add, and delete Pokemon from your collection
- **Paginated Lists**: Browse through Pokemon with smooth pagination
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Modern UI**: Beautiful interface with glassmorphism effects and Pokemon-themed background
- **Type Safety**: Full TypeScript support for robust development
- **Real-time Search**: Add Pokemon by name or Pokedex number
- **Error Handling**: Comprehensive error boundaries and user feedback

## 🛠️ Tech Stack

- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible UI components
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icon library

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd pokemon-app-ts/client
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and update the API URL if needed:
   ```env
   VITE_API_URL=http://localhost:3000
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser** and navigate to `http://localhost:5173`

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:prod` - Type check and build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🎨 Styling

The app uses a combination of:

- **Tailwind CSS** for utility-first styling
- **CSS Custom Properties** for shadcn/ui theming
- **Custom CSS** for Pokemon-specific styling and animations
- **Glassmorphism** effects for modern UI appearance

## 🌐 API Integration

The client communicates with the Pokemon API backend through a service layer:

### Pokemon Service Methods

- `getAllPokemons(page, limit)` - Get paginated Pokemon list
- `createPokemon(pokemonIdOrName)` - Add new Pokemon
- `deletePokemon(id)` - Remove Pokemon from collection
- `getPokemonById(id)` - Get specific Pokemon details
- `validatePokemon(pokemonIdOrName)` - Check if Pokemon exists

### Environment Variables

- `VITE_API_URL` - Backend API base URL (default: http://localhost:3000)
- `VITE_DEV_MODE` - Enable development features
- `VITE_API_TIMEOUT` - API request timeout

## 📱 Features Overview

### Home Page (`/`)
- **Pokemon Grid**: Responsive grid layout displaying Pokemon cards
- **Add Pokemon Form**: Search and add Pokemon by name or ID
- **Pagination**: Navigate through large collections
- **Delete Functionality**: Remove Pokemon with confirmation
- **Error Handling**: User-friendly error messages
- **Loading States**: Smooth loading indicators

### Pokemon Cards
Each Pokemon card displays:
- High-quality official artwork
- Pokemon name and Pokedex number
- Type badges with appropriate colors
- Physical stats (height, weight)
- Abilities list
- Action buttons (View, Delete)

### Responsive Design
- **Mobile**: Single column layout
- **Tablet**: 2-column grid
- **Desktop**: 3-4 column grid
- **Large screens**: Up to 4 columns

## 🚀 Deployment

### Build for Production

```bash
npm run build:prod
```

This will:
1. Run TypeScript type checking
2. Build the application for production
3. Generate optimized assets in the `dist/` directory

### Environment Setup

For production deployment, ensure:
1. Set `VITE_API_URL` to your production API endpoint
2. Configure your web server to serve the `dist/` directory
3. Set up proper routing for SPA (single-page application)

### Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🔧 Development

### Adding New Components

1. Create component in `src/components/`
2. Export from the component file
3. Import and use in other components

### Adding New Pages

1. Create page component in `src/pages/`
2. Add route to `App.tsx`
3. Update navigation as needed

### API Integration

When adding new API endpoints:
1. Update types in `src/types/pokemon.ts`
2. Add methods to `src/services/pokemon.ts`
3. Use in components with proper error handling

## 🐛 Troubleshooting

### Common Issues

**Cannot connect to API**
- Ensure the backend server is running on the correct port
- Check the `VITE_API_URL` environment variable
- Verify CORS is properly configured on the backend

**Images not loading**
- Pokemon images are fetched from external APIs
- Fallback images are provided for missing sprites
- Check network connectivity

**Build errors**
- Run `npm run type-check` to identify TypeScript errors
- Ensure all dependencies are installed
- Check for syntax errors in recent changes

### Performance Optimization

- Images are lazy-loaded for better performance
- Pagination limits the number of Pokemon rendered
- Components use React.memo where appropriate
- API requests include proper error handling and timeouts

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support or questions, please:
1. Check the troubleshooting section
2. Review existing issues
3. Create a new issue with detailed information
