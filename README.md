# 📉 Dashboard de Pronóstico del Precio del Cobre

Este proyecto es una aplicación web interactiva que visualiza pronósticos del precio del cobre generados mediante modelos avanzados de Machine Learning y Series Temporales en R (ARIMA, XGBoost, Random Forest, etc.).

## ✨ Características

*   **Dashboard Interactivo**: Visualización de escenarios (Base, Alcista, Conservador, Bajista) con gráficos dinámicos.
*   **Panel de Administración**: Interfaz para ejecutar el modelo bajo demanda y actualizar parámetros manualmente.
*   **Análisis Avanzado**: Integración con un script de R (`Cobre4.R`) que realiza limpieza de datos, ingeniería de características y entrenamiento de modelos.
*   **Actualización Automática**: El sistema actualiza automáticamente el dashboard web cada vez que se generan nuevos pronósticos en R.

## 🛠️ Requisitos Previos

Para ejecutar este proyecto necesitas tener instalado:

1.  **Node.js** (v14 o superior): [Descargar Node.js](https://nodejs.org/)
2.  **R** (v4.0 o superior): [Descargar R](https://cloud.r-project.org/)
3.  **RTools** (Solo en Windows, necesario para compilar algunos paquetes): [Descargar RTools](https://cran.r-project.org/bin/windows/Rtools/)

## 📦 Instalación

1.  **Clonar el repositorio**
    ```bash
    git clone https://github.com/tu-usuario/cobre-precio.git
    cd Cobre_Precio-main
    ```

2.  **Instalar dependencias de Node.js**
    ```bash
    npm install
    ```

3.  **Instalar librerías de R**
    Abre R o RStudio y ejecuta el siguiente comando para instalar las dependencias necesarias:
    ```r
    install.packages(c("tidyverse", "lubridate", "readxl", "timetk", "modeltime", 
                       "tidymodels", "tseries", "zoo", "ranger", "xgboost", 
                       "kernlab", "corrplot", "plotly", "gridExtra", "glmnet", "TTR"))
    ```

## 🚀 Ejecución

### 1. Preparar el Entorno
Asegúrate de que los archivos clave estén en su lugar.
> **Nota Importante**: Por configuración actual, el sistema espera encontrar el script `Cobre4.R` y el archivo de datos `cobre_precio.csv` en el directorio padre (`../`) respecto a esta carpeta.
>
> Estructura esperada:
> ```
> 📂 Carpeta_Raiz/
> ├── 📄 Cobre4.R
> ├── 📄 cobre_precio.csv
> └── 📂 Cobre_Precio-main/  (Este repositorio)
>     ├── 📄 server.js
>     └── ...
> ```

### 2. Iniciar el Servidor Web
En la terminal, dentro de la carpeta `Cobre_Precio-main`:

```bash
node server.js
```
Deberías ver un mensaje como: `Server running at http://localhost:3000`

### 3. Usar la Aplicación
Abre tu navegador web:

*   **Dashboard Principal**: Accede a [http://localhost:3000](http://localhost:3000) para ver los pronósticos actuales.
*   **Panel de Admin**: Accede a [http://localhost:3000/admin.html](http://localhost:3000/admin.html) para:
    *   Ver el estado de los indicadores.
    *   Ejecutar manualmente el modelo R (“Ejecutar Modelo R”).
    *   Editar manualmente los valores proyectados.

## 📂 Estructura del Proyecto

*   `server.js`: Servidor Express que maneja la API y sirve los archivos estáticos.
*   `index.html`: Frontend del dashboard principal (Bootstrap 5 + ApexCharts).
*   `admin.html`: Frontend del panel de administración.
*   `data.json`: Archivo JSON que almacena el estado actual de los pronósticos mostrados.
*   `scripts/update_dashboard_data.js`: Script de Node.js que parsea los resultados de R y actualiza `data.json`.
*   `scrapers/`: Scripts para obtener datos en tiempo real (si aplica).
*   `figuras/`: Carpeta donde se guardan los gráficos generados por R.
*   `modelos/`: Carpeta donde se guardan los archivos CSV/TXT con los resultados numéricos de R.

## 🤝 Contribuir
Las contribuciones son bienvenidas. Por favor, abre un issue o envía un pull request para mejoras.

## 📄 Licencia
Este proyecto está bajo la Licencia MIT.
