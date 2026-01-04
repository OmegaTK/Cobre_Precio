const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const DATA_FILE = path.join(__dirname, '../data.json');
const FORECAST_FILE = path.join(__dirname, '../modelos/registro_historico_pronosticos.txt');
const HISTORY_FILE = path.join(__dirname, '../cobre_precio.csv');

console.log('Starting dashboard data update...');

try {
    if (!fs.existsSync(FORECAST_FILE)) {
        throw new Error(`Forecast file not found: ${FORECAST_FILE}`);
    }
    const forecastContent = fs.readFileSync(FORECAST_FILE, 'utf8').trim();
    const forecastLines = forecastContent.split('\n');

    const forecasts = [];
    for (let i = 1; i < forecastLines.length; i++) {
        const parts = forecastLines[i].split('|');
        if (parts.length >= 3) {
            forecasts.push({
                date: parts[0],
                scenario: parts[1],
                value: parseFloat(parts[2]),
                direction: parts[3],
                confidence: parts[4].replace('%', '')
            });
        }
    }

    if (forecasts.length === 0) throw new Error('No forecasts found');

    const latestDate = forecasts[forecasts.length - 1].date;
    const latestForecasts = forecasts.filter(f => f.date === latestDate);

    console.log(`Found ${latestForecasts.length} forecasts for date ${latestDate}`);

    const scenarios = {};
    let bestForecast = null;

    latestForecasts.forEach(f => {
        const key = f.scenario.toLowerCase(); // base, alcista, bajista, conservador

        scenarios[key] = {
            name: f.scenario,
            value: f.value,
            direction: f.direction,
            confidence: parseInt(f.confidence) || 0,
            color: getColor(f.scenario)
        };

        if (f.scenario === 'BASE') {
            bestForecast = {
                scenario: f.scenario,
                value: f.value,
                precision: parseInt(f.confidence) > 80 ? "Alta precisión" : "Moderada"
            };
        }
    });

    if (!fs.existsSync(HISTORY_FILE)) {
        throw new Error(`History file not found: ${HISTORY_FILE}`);
    }

    const historyContent = fs.readFileSync(HISTORY_FILE, 'utf8').trim();
    const historyLines = historyContent.split('\n');
    const header = historyLines[0].split(',');
    const dateIdx = header.indexOf('fecha');
    const priceIdx = header.indexOf('cobre_precio');

    if (dateIdx === -1 || priceIdx === -1) {
        throw new Error('Could not find "fecha" or "cobre_precio" columns in CSV');
    }

    const history = [];
    for (let i = 1; i < historyLines.length; i++) {
        const parts = historyLines[i].split(',');
        if (parts.length > priceIdx && parts.length > dateIdx) {
            const date = parts[dateIdx].trim();
            const price = parseFloat(parts[priceIdx]);
            if (!isNaN(price)) {
                history.push({ date, value: price });
            }
        }
    }

    history.sort((a, b) => new Date(a.date) - new Date(b.date));

    const lastEntry = history[history.length - 1];

    Object.keys(scenarios).forEach(key => {
        const sc = scenarios[key];
        const change = ((sc.value - lastEntry.value) / lastEntry.value) * 100;
        sc.change = parseFloat(change.toFixed(2));
    });

    const chartHistory = history.slice(-30);

    const finalData = {
        lastUpdate: new Date().toISOString().split('T')[0],
        forecastDate: latestDate,
        currentPrice: {
            value: lastEntry.value,
            date: lastEntry.date
        },
        bestForecast: bestForecast || { scenario: "N/A", value: 0 },
        scenarios: scenarios,
        chartData: {
            dates: chartHistory.map(h => h.date),
            prices: chartHistory.map(h => h.value)
        }
    };

    fs.writeFileSync(DATA_FILE, JSON.stringify(finalData, null, 4));
    console.log(`Successfully updated data.json with forecasts for ${latestDate}`);

} catch (error) {
    console.error('Error updating dashboard data:', error);
    process.exit(1);
}

function getColor(scenario) {
    switch (scenario) {
        case 'ALCISTA': return 'success';
        case 'BAJISTA': return 'danger';
        case 'BASE': return 'primary';
        case 'CONSERVADOR': return 'secondary';
        default: return 'info';
    }
}
