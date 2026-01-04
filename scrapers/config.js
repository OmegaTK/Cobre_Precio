module.exports = {
    // Indices y Metales
    DJCIIM: {
        url: 'https://es.investing.com/indices/dj-commodity-industrial-metals-historical-data',
        selector: '#curr_table', // To be verified
        type: 'investing'
    },
    BCOM: {
        url: 'https://es.investing.com/indices/bloomberg-commodity-historical-data',
        type: 'investing'
    },
    USDCNY: {
        url: 'https://es.investing.com/currencies/usd-cny-historical-data',
        type: 'investing'
    },
    DXY: {
        url: 'https://es.investing.com/indices/usdollar-historical-data',
        type: 'investing'
    },
    VIX: {
        url: 'https://es.investing.com/indices/volatility-s-p-500-historical-data',
        type: 'investing'
    },

    // Metales (Portal Minero + Investing backups)
    PLATA: {
        url: 'https://www.portalminero.com/wp/datos-metales/?metal=Plata',
        backupUrl: 'https://es.investing.com/commodities/silver-historical-data',
        type: 'portalminero'
    },
    ORO: {
        url: 'https://www.portalminero.com/wp/datos-metales/?metal=Oro',
        backupUrl: 'https://es.investing.com/commodities/gold-historical-data',
        type: 'portalminero'
    },
    ESTANO: {
        url: 'https://www.portalminero.com/wp/datos-metales/?metal=Estano',
        type: 'portalminero'
    },
    COBRE: {
        url: 'https://www.portalminero.com/wp/datos-metales/?metal=Cobre',
        type: 'portalminero'
    },
    PLOMO: {
        url: 'https://www.portalminero.com/wp/datos-metales/?metal=Plomo',
        type: 'portalminero'
    },
    NIQUEL: {
        url: 'https://www.portalminero.com/wp/datos-metales/?metal=Niquel',
        type: 'portalminero'
    },
    ZINC: {
        url: 'https://www.portalminero.com/wp/datos-metales/?metal=Zinc',
        type: 'portalminero'
    },
    ALUMINIO: {
        url: 'https://www.portalminero.com/wp/datos-metales/?metal=Aluminio',
        type: 'portalminero'
    },

    // Otros Indicadores
    TPM: {
        url: 'https://datosmacro.expansion.com/tipo-interes/chile',
        type: 'datosmacro'
    },
    IPSA: {
        url: 'https://www.investing.com/indices/ipsa-historical-data',
        type: 'investing'
    },
    SP500: {
        url: 'https://www.investing.com/indices/us-spx-500-historical-data',
        type: 'investing'
    },
    ENE_INV: {
        urlTemplate: 'https://boletin.cochilco.cl/productos/boletin.asp?anio={YEAR}&mes={MONTH}&tabla=tabla4_2',
        type: 'cochilco'
    },
    PETROLEO_CRUD_WT: {
        url: 'https://www.investing.com/commodities/crude-oil-historical-data',
        type: 'investing'
    },
    FUTUROS_PETROLEO_BRENT: {
        url: 'https://www.investing.com/commodities/brent-oil-historical-data',
        type: 'investing'
    },
    BALTIC_DRY_INDEX: {
        url: 'https://www.investing.com/indices/baltic-dry-historical-data',
        type: 'investing'
    },
    T10YFF: {
        url: 'https://fred.stlouisfed.org/data/T10YFF',
        type: 'fred' // This is a text file direct download often, or simple HTML
    },
    DFF: {
        url: 'https://www.investing.com/economic-calendar/federal-funds-rate-170',
        type: 'investing_calendar'
    },
    DOLAR_OBS: {
        url: 'https://si3.bcentral.cl/indicadoressiete/secure/Serie.aspx?gcode=PRE_TCO&param=RABmAFYAWQB3AGYAaQBuAEkALQAzADUAbgBNAGgAaAAkADUAVwBQAC4AbQBYADAARwBOAGUAYwBjACMAQQBaAHAARgBhAGcAUABTAGUAdwA1ADQAMQA0AE0AawBLAF8AdQBDACQASABzAG0AXwA2AHQAawBvAFcAZwBKAEwAegBzAF8AbgBMAHIAYgBDAC4ARQA3AFUAVwB4AFIAWQBhAEEAOABkAHkAZwAxAEEARAA=',
        type: 'bcentral'
    }
};
