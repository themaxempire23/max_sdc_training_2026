# SDC Data Science Training 2026

Practical notebooks and deployment exercises for a five-day data science training programme. The repository moves from working with data in pandas to deploying a machine-learning model with a Next.js interface and Docker.

## Training outline

| Day | Topic                                 | Main practicals                                                 |
| --- | ------------------------------------- | --------------------------------------------------------------- |
| 1   | Python and pandas                     | Loading, inspecting, cleaning and exporting data                |
| 2   | Statistics and algorithms             | Exploratory analysis, preprocessing, statistics and time series |
| 3   | Visualisation and supervised learning | Clear charts, classification and model evaluation               |
| 4   | Unsupervised learning                 | Clustering, dimensionality reduction and image quantisation     |
| 5   | NLP and deployment                    | Sentiment analysis, FastAPI, Next.js and Docker                 |

Each day contains its own datasets inside its `Pracs` or `Slides-Notes/Datasets` directory. The notebooks use local relative paths and do not require Google Drive.

## Day 5 application

The final practical deploys a generated scikit-learn loan model through:

- a Next.js user interface;
- a FastAPI prediction service; and
- Docker Compose for one-command startup.

The interface is branded for the Namibia University of Science and Technology and displays financial amounts in Namibian dollars (`N$`). It includes scenario presets, interactive applicant inputs, an approval-probability gauge, model-factor bars and a repayment estimator.

### Run with Docker

Install and start Docker Desktop, then run:

```powershell
cd day_5\deployment
.\start.ps1
```

Alternatively:

```powershell
docker compose -f day_5/deployment/docker-compose.yml up --build
```

Open the following addresses:

| Service           | Address                      |
| ----------------- | ---------------------------- |
| Web application   | http://localhost:3000        |
| API documentation | http://localhost:8000/docs   |
| API health check  | http://localhost:8000/health |

Stop the application with:

```powershell
cd day_5\deployment
.\stop.ps1
```

More deployment details are available in [`day_5/deployment/README.md`](day_5/deployment/README.md).

## Screenshots

Add three screenshots using the exact filenames below. GitHub will display them automatically after the files are placed in `docs/screenshots/`.

| Application overview                                                                                           | Model result                                                                                            | Docker services                                                                                              |
| -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| <img src="docs/screenshots/01-ui-overview.png" alt="Add the application overview screenshot here" width="420"> | <img src="docs/screenshots/02-model-result.png" alt="Add the model result screenshot here" width="420"> | <img src="docs/screenshots/03-docker-running.png" alt="Add the Docker services screenshot here" width="420"> |

Screenshot guidance is available in [`docs/screenshots/README.md`](docs/screenshots/README.md).

## Repository structure

```text
.
├── day_1/                 pandas fundamentals
├── day_2/                 algorithms, statistics and preprocessing
├── day_3/                 visualisation and supervised learning
├── day_4/                 unsupervised learning
├── day_5/
│   ├── Pracs/             NLP and deployment notebooks
│   └── deployment/        Next.js, FastAPI and Docker application
└── docs/screenshots/      images used by this README
```

## Notes

- Run notebooks from the repository root so their relative data paths resolve correctly.
- Generated models and sample datasets are included for teaching and demonstration.
- The loan model must not be used for real lending decisions.

# ~By Max
