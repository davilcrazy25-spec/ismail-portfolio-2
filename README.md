# Ismail Portfolio - Premium Graphic Designer Portfolio

A high-end, premium portfolio website for graphic designer Ismail with modern UI/UX, smooth animations, and an admin dashboard for content management.

## Features

### Frontend
- **Premium Dark Theme** with electric blue/purple accents
- **Glassmorphism Design** with soft shadows and blur effects
- **Smooth Animations** including parallax, scroll reveals, and hover effects
- **Fully Responsive** for mobile, tablet, and desktop
- **Interactive Elements** including portfolio filters, testimonial slider, and contact form
- **Loading Animation** and scroll progress indicator
- **Sticky Navigation** with smooth scrolling

### Sections
- **Hero Section** with animated gradient background
- **About Section** with skills, tools, and professional bio
- **Portfolio Section** with masonry grid and category filters
- **Services Section** with animated service cards
- **Testimonials Section** with auto-rotating slider
- **Contact Section** with modern contact form
- **Footer** with navigation and social links

### Admin Dashboard
- **Secure Login** with JWT authentication
- **Portfolio Management** (Add/Edit/Delete portfolio items)
- **Content Management** (Edit About, Services, Testimonials, Contact info)
- **Image Upload Support** (ready for implementation)
- **Modern UI** matching the main site design

## Tech Stack

### Frontend
- HTML5 with semantic markup
- CSS3 with advanced features (Grid, Flexbox, Animations)
- Vanilla JavaScript (ES6+)
- Font Awesome icons
- Google Fonts (Inter)

### Backend
- Node.js with Express.js
- JWT for authentication
- bcryptjs for password hashing
- Helmet for security
- Rate limiting for API protection
- File-based JSON database

## Installation

### Prerequisites
- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Server**
   ```bash
   npm start
   ```

   For development with auto-restart:
   ```bash
   npm run dev
   ```

3. **Access the Application**
   - Main Website: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin

### Default Admin Credentials
- **Username:** admin
- **Password:** admin123

## Project Structure

```
ismail-portfolio/
├── index.html          # Main portfolio website
├── admin.html          # Admin dashboard
├── style.css           # Main website styles
├── admin.css           # Admin dashboard styles
├── script.js           # Main website JavaScript
├── admin.js            # Admin dashboard JavaScript
├── server.js           # Express server and API endpoints
├── database.json       # Data storage (JSON file)
├── package.json        # Dependencies and scripts
└── README.md           # This file
```

## API Endpoints

### Public Endpoints
- `GET /api/portfolio` - Get all portfolio items
- `GET /api/about` - Get about information
- `GET /api/services` - Get all services
- `GET /api/testimonials` - Get all testimonials
- `GET /api/contact` - Get contact information
- `POST /api/contact` - Submit contact form

### Admin Endpoints (Authentication Required)
- `POST /api/admin/login` - Admin login
- `POST /api/portfolio` - Create portfolio item
- `PUT /api/portfolio/:id` - Update portfolio item
- `DELETE /api/portfolio/:id` - Delete portfolio item
- `PUT /api/about` - Update about information
- `POST /api/services` - Create service
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service
- `POST /api/testimonials` - Create testimonial
- `PUT /api/testimonials/:id` - Update testimonial
- `DELETE /api/testimonials/:id` - Delete testimonial
- `PUT /api/contact` - Update contact information

## Customization

### Changing Colors
Edit the CSS variables in `style.css` and `admin.css`:
```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #a855f7;
    --accent-color: #06b6d4;
    /* ... other colors */
}
```

### Adding Portfolio Items
1. Access the admin panel at `/admin`
2. Login with admin credentials
3. Navigate to Portfolio section
4. Click "Add New" to add portfolio items

### Updating Content
All content can be managed through the admin panel:
- About section bio and experience
- Services offered
- Client testimonials
- Contact information

## Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Helmet.js for security headers
- Input validation and sanitization

## Performance Optimizations

- Lazy loading for images
- Optimized animations using CSS transforms
- Efficient DOM manipulation
- Minimal external dependencies
- Compressed and optimized code

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Deployment

### Production Setup
1. Set environment variables:
   ```bash
   export NODE_ENV=production
   export JWT_SECRET=your-secure-secret-key
   ```

2. Install production dependencies:
   ```bash
   npm install --production
   ```

3. Start the server:
   ```bash
   npm start
   ```

### Using PM2 for Process Management
```bash
npm install -g pm2
pm2 start server.js --name "ismail-portfolio"
pm2 startup
pm2 save
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please contact the project maintainer or create an issue in the repository.

---

**Note:** This is a demonstration portfolio website. In a production environment, consider using a proper database (MongoDB, PostgreSQL) instead of JSON file storage, and implement proper email functionality for the contact form.
