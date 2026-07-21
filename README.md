# SDC Data Science Training 2026

Practical notebooks and deployment exercises from a five-day data science training programme. The repository progresses from pandas and data preparation to machine learning, natural language processing and deployment with Next.js, FastAPI and Docker.

## Training outline

| Day | Topic | Main practicals |
| --- | --- | --- |
| 1 | Python and pandas | Loading, inspecting, cleaning and exporting data |
| 2 | Statistics and algorithms | Exploratory analysis, preprocessing, statistics and time series |
| 3 | Visualisation and supervised learning | Charts, classification and model evaluation |
| 4 | Unsupervised learning | Clustering, dimensionality reduction and image quantisation |
| 5 | NLP and deployment | Sentiment analysis, FastAPI, Next.js and Docker |

Each day contains its own datasets inside its `Pracs` or `Slides-Notes/Datasets` directory. The notebooks use local relative paths and do not require Google Drive or Google Colab storage.

## Day 5 application

The final practical deploys a generated scikit-learn loan model using:

- a responsive Next.js interface;
- a FastAPI prediction service; and
- Docker Compose for straightforward startup.

The interface is branded for the Namibia University of Science and Technology (NUST). Financial values are displayed in Namibian dollars (`N$`). The application includes example applicant profiles, interactive inputs, an approval-probability gauge, model-contribution charts, affordability comparisons and a repayment estimator.

### Run with Docker

Start Docker Desktop, open PowerShell in the repository and run:

```powershell
cd day_5\deployment
.\start.ps1
```

You can also use Docker Compose directly from the repository root:

```powershell
docker compose -f day_5/deployment/docker-compose.yml up --build -d
```

### Open the application

| Service | Address |
| --- | --- |
| Web application | [http://localhost:3000](http://localhost:3000) |
| API documentation | [http://localhost:8000/docs](http://localhost:8000/docs) |
| API health check | [http://localhost:8000/health](http://localhost:8000/health) |

Stop the application with:

```powershell
cd day_5\deployment
.\stop.ps1
```

See the [Day 5 deployment guide](day_5/deployment/README.md) for local-development instructions and the application structure.

## Screenshots

### NUST loan eligibility interface

<img width="1670" alt="NUST loan eligibility application overview" src="https://github.com/user-attachments/assets/d20a08f2-2738-4ab1-8d42-c667fa5d1309">

### Model result and interactive charts

<img width="919" alt="Loan model result with approval probability and contribution charts" src="https://github.com/user-attachments/assets/34f1eb90-f195-4c39-99f9-635607622a10">

### Docker services

<img width="1512" alt="Docker services running for the Next.js web app and FastAPI service" src="https://github.com/user-attachments/assets/fa1cf658-8ddc-4c79-b033-92f8ead91353">

## Repository structure

```text
.
|-- day_1/                 pandas fundamentals
|-- day_2/                 algorithms, statistics and preprocessing
|-- day_3/                 visualisation and supervised learning
|-- day_4/                 unsupervised learning
|-- day_5/
|   |-- Pracs/             NLP and deployment notebooks
|   `-- deployment/        Next.js, FastAPI and Docker application
`-- docs/screenshots/      optional local README screenshots
```

## Important notes

- Run notebooks from the repository root so relative data paths resolve correctly.
- Generated models and sample datasets are included for teaching and demonstration.
- The loan model must not be used for real lending decisions.

## Author

Max
