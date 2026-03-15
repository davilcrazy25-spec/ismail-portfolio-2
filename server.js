const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Serve static files
app.use(express.static(path.join(__dirname)));

// Database file path
const DB_PATH = path.join(__dirname, 'database.json');

// Helper functions
async function readDatabase() {
    try {
        const data = await fs.readFile(DB_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading database:', error);
        return {
            portfolio: [],
            about: { title: '', bio: '', experience: 0 },
            services: [],
            testimonials: [],
            contact: { email: '', phone: '', whatsapp: '', location: '' },
            admin: { username: 'admin', password: '' }
        };
    }
}

async function writeDatabase(data) {
    try {
        await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing database:', error);
        return false;
    }
}

// Authentication middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
}

// Routes

// Serve main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve admin page
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// API Routes

// Get all data at once
app.get('/api/data', async (req, res) => {
    try {
        const db = await readDatabase();
        res.json(db);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching data' });
    }
});

// Portfolio CRUD
app.get('/api/portfolio', async (req, res) => {
    try {
        const db = await readDatabase();
        res.json(db.portfolio);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching portfolio items' });
    }
});

app.post('/api/portfolio', authenticateToken, async (req, res) => {
    try {
        const db = await readDatabase();
        const newItem = {
            id: Date.now(),
            ...req.body
        };
        db.portfolio.push(newItem);
        
        const success = await writeDatabase(db);
        if (success) {
            res.json(newItem);
        } else {
            res.status(500).json({ message: 'Error saving portfolio item' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error creating portfolio item' });
    }
});

app.put('/api/portfolio/:id', authenticateToken, async (req, res) => {
    try {
        const db = await readDatabase();
        const id = parseInt(req.params.id);
        const index = db.portfolio.findIndex(item => item.id === id);
        
        if (index === -1) {
            return res.status(404).json({ message: 'Portfolio item not found' });
        }
        
        db.portfolio[index] = { ...db.portfolio[index], ...req.body };
        
        const success = await writeDatabase(db);
        if (success) {
            res.json(db.portfolio[index]);
        } else {
            res.status(500).json({ message: 'Error updating portfolio item' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating portfolio item' });
    }
});

app.delete('/api/portfolio/:id', authenticateToken, async (req, res) => {
    try {
        const db = await readDatabase();
        const id = parseInt(req.params.id);
        const index = db.portfolio.findIndex(item => item.id === id);
        
        if (index === -1) {
            return res.status(404).json({ message: 'Portfolio item not found' });
        }
        
        db.portfolio.splice(index, 1);
        
        const success = await writeDatabase(db);
        if (success) {
            res.json({ message: 'Portfolio item deleted successfully' });
        } else {
            res.status(500).json({ message: 'Error deleting portfolio item' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting portfolio item' });
    }
});

// About CRUD
app.get('/api/about', async (req, res) => {
    try {
        const db = await readDatabase();
        res.json(db.about);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching about information' });
    }
});

app.put('/api/about', authenticateToken, async (req, res) => {
    try {
        const db = await readDatabase();
        db.about = { ...db.about, ...req.body };
        
        const success = await writeDatabase(db);
        if (success) {
            res.json(db.about);
        } else {
            res.status(500).json({ message: 'Error updating about information' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating about information' });
    }
});

// Services CRUD
app.get('/api/services', async (req, res) => {
    try {
        const db = await readDatabase();
        res.json(db.services);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching services' });
    }
});

app.post('/api/services', authenticateToken, async (req, res) => {
    try {
        const db = await readDatabase();
        const newService = {
            id: Date.now(),
            ...req.body
        };
        db.services.push(newService);
        
        const success = await writeDatabase(db);
        if (success) {
            res.json(newService);
        } else {
            res.status(500).json({ message: 'Error saving service' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error creating service' });
    }
});

app.put('/api/services/:id', authenticateToken, async (req, res) => {
    try {
        const db = await readDatabase();
        const id = parseInt(req.params.id);
        const index = db.services.findIndex(service => service.id === id);
        
        if (index === -1) {
            return res.status(404).json({ message: 'Service not found' });
        }
        
        db.services[index] = { ...db.services[index], ...req.body };
        
        const success = await writeDatabase(db);
        if (success) {
            res.json(db.services[index]);
        } else {
            res.status(500).json({ message: 'Error updating service' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating service' });
    }
});

app.delete('/api/services/:id', authenticateToken, async (req, res) => {
    try {
        const db = await readDatabase();
        const id = parseInt(req.params.id);
        const index = db.services.findIndex(service => service.id === id);
        
        if (index === -1) {
            return res.status(404).json({ message: 'Service not found' });
        }
        
        db.services.splice(index, 1);
        
        const success = await writeDatabase(db);
        if (success) {
            res.json({ message: 'Service deleted successfully' });
        } else {
            res.status(500).json({ message: 'Error deleting service' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting service' });
    }
});

// Testimonials CRUD
app.get('/api/testimonials', async (req, res) => {
    try {
        const db = await readDatabase();
        res.json(db.testimonials);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching testimonials' });
    }
});

app.post('/api/testimonials', authenticateToken, async (req, res) => {
    try {
        const db = await readDatabase();
        const newTestimonial = {
            id: Date.now(),
            ...req.body
        };
        db.testimonials.push(newTestimonial);
        
        const success = await writeDatabase(db);
        if (success) {
            res.json(newTestimonial);
        } else {
            res.status(500).json({ message: 'Error saving testimonial' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error creating testimonial' });
    }
});

app.put('/api/testimonials/:id', authenticateToken, async (req, res) => {
    try {
        const db = await readDatabase();
        const id = parseInt(req.params.id);
        const index = db.testimonials.findIndex(testimonial => testimonial.id === id);
        
        if (index === -1) {
            return res.status(404).json({ message: 'Testimonial not found' });
        }
        
        db.testimonials[index] = { ...db.testimonials[index], ...req.body };
        
        const success = await writeDatabase(db);
        if (success) {
            res.json(db.testimonials[index]);
        } else {
            res.status(500).json({ message: 'Error updating testimonial' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating testimonial' });
    }
});

app.delete('/api/testimonials/:id', authenticateToken, async (req, res) => {
    try {
        const db = await readDatabase();
        const id = parseInt(req.params.id);
        const index = db.testimonials.findIndex(testimonial => testimonial.id === id);
        
        if (index === -1) {
            return res.status(404).json({ message: 'Testimonial not found' });
        }
        
        db.testimonials.splice(index, 1);
        
        const success = await writeDatabase(db);
        if (success) {
            res.json({ message: 'Testimonial deleted successfully' });
        } else {
            res.status(500).json({ message: 'Error deleting testimonial' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting testimonial' });
    }
});

// Contact CRUD
app.get('/api/contact', async (req, res) => {
    try {
        const db = await readDatabase();
        res.json(db.contact);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching contact information' });
    }
});

app.put('/api/contact', authenticateToken, async (req, res) => {
    try {
        const db = await readDatabase();
        db.contact = { ...db.contact, ...req.body };
        
        const success = await writeDatabase(db);
        if (success) {
            res.json(db.contact);
        } else {
            res.status(500).json({ message: 'Error updating contact information' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating contact information' });
    }
});

// Contact form submission
app.post('/api/contact', async (req, res) => {
    try {
        // In a real application, you would send an email or save to a database
        // For now, we'll just log the submission
        console.log('Contact form submission:', req.body);
        res.json({ message: 'Message sent successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending message' });
    }
});

// Admin Authentication
app.post('/api/admin/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const db = await readDatabase();
        
        // Check if admin exists
        if (username !== db.admin.username) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        // For demo purposes, we'll use a simple password check
        // In production, you should use bcrypt to compare hashed passwords
        const validPassword = password === 'admin123'; // Default password
        
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        // Create JWT token
        const token = jwt.sign(
            { username: db.admin.username },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.json({ token, username: db.admin.username });
    } catch (error) {
        res.status(500).json({ message: 'Login failed' });
    }
});

// Initialize admin password if not exists
async function initializeAdmin() {
    try {
        const db = await readDatabase();
        
        // Hash the default password if not already hashed
        if (db.admin.password === '' || !db.admin.password.startsWith('$2a$')) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            db.admin.password = hashedPassword;
            await writeDatabase(db);
            console.log('Admin password initialized');
        }
    } catch (error) {
        console.error('Error initializing admin:', error);
    }
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Start server
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Main site: http://localhost:${PORT}`);
    console.log(`Admin panel: http://localhost:${PORT}/admin`);
    console.log('Default admin credentials: username: admin, password: admin123');
    
    // Initialize admin password
    await initializeAdmin();
});

module.exports = app;
