const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

app.get('/api/data', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading data');
        }
        res.json(JSON.parse(data));
    });
});

app.post('/api/data', (req, res) => {
    const newData = req.body;
    fs.writeFile(DATA_FILE, JSON.stringify(newData, null, 2), (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error saving data');
        }
        res.json({ message: 'Data updated successfully' });
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

const INDICATORS_FILE = path.join(__dirname, 'indicators.json');

function getIndicators() {
    if (!fs.existsSync(INDICATORS_FILE)) return {};
    try {
        return JSON.parse(fs.readFileSync(INDICATORS_FILE, 'utf8'));
    } catch (e) {
        return {};
    }
}

function saveIndicator(key, value) {
    const data = getIndicators();
    data[key] = {
        value: value,
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString()
    };
    fs.writeFileSync(INDICATORS_FILE, JSON.stringify(data, null, 2));
}

app.get('/api/indicators', (req, res) => {
    res.json(getIndicators());
});

app.post('/api/scrape/:key', (req, res) => {
    const key = req.params.key;
    console.log(`Scraping request for: ${key}`);

    const { exec } = require('child_process');
    const command = `node scrapers/scrape.js ${key}`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing scraper: ${error}`);
            return res.status(500).json({ error: 'Scraping failed', details: stderr });
        }

        try {
            const result = JSON.parse(stdout);

            if (result.value) {
                saveIndicator(key, result.value);
            }

            res.json(result);
        } catch (e) {
            console.error('Invalid JSON output from scraper:', stdout);
            res.status(500).json({ error: 'Invalid scraper output', raw: stdout });
        }
    });
});

// EXECUTE: Run R Model
app.post('/api/run-model', (req, res) => {
    console.log('Request to run R model...');
    const { exec } = require('child_process');

    const command = `Rscript ../Cobre4.R`;

    exec(command, { cwd: path.join(__dirname, '..') }, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing R script: ${error}`);
            return res.status(500).json({ error: 'Model execution failed', details: stderr });
        }

        console.log('R Model executed successfully');

        console.log('Updating dashboard data...');
        const updateCmd = `node scripts/update_dashboard_data.js`;
        exec(updateCmd, (err, stdout, stderr) => {
            if (err) {
                console.error('Error updating dashboard data:', err);
                return res.json({ message: 'Model executed but data update failed', output: stdout, details: stderr });
            }
            console.log('Dashboard data updated');
            res.json({ message: 'Model executed and dashboard updated successfully', output: stdout });
        });
    });
});
