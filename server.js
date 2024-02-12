const app = express();
app.use(express.static('public'));
// Define routes for main.html
app.get('/main.html', (req, res) => {
    res.sendFile(__dirname + '/public/main.html');
});

// Define routes for sports.html
app.get('/sports.html', (req, res) => {
    res.sendFile(__dirname + '/public/sports.html');
});

// Define routes for contact.html
app.get('/contact.html', (req, res) => {
    res.sendFile(__dirname + '/public/contact.html');
});

// Define routes for aboutUs.html
app.get('/aboutUs.html', (req, res) => {
    res.sendFile(__dirname + '/public/aboutUs.html');
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});