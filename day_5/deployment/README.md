# Day 5 NUST Loan Model Application

An interactive teaching application that connects a generated scikit-learn loan model to a Next.js interface through a FastAPI service. Docker Compose runs the complete project.

The interface uses Namibia University of Science and Technology branding and displays monetary values in Namibian dollars (`N$`).

## Features

- editable applicant values and range sliders;
- three example applicant profiles;
- approval probability and confidence result;
- model-factor contribution chart;
- live affordability comparison;
- interactive repayment estimate; and
- printable assessment summary.

## Run with Docker

### Requirements

- Docker Desktop must be installed and running.

### Start

From the repository root:

```powershell
cd day_5\deployment
.\start.ps1
```

The script builds the images and starts the containers. To start them in the background instead, run:

```powershell
docker compose up --build -d
```

### Application addresses

| Service | Address |
| --- | --- |
| Next.js interface | [http://localhost:3000](http://localhost:3000) |
| FastAPI documentation | [http://localhost:8000/docs](http://localhost:8000/docs) |
| FastAPI health check | [http://localhost:8000/health](http://localhost:8000/health) |

### Check container status

```powershell
docker compose ps
```

Both `api` and `web` should show a running status. The API should also show as healthy.

### Stop

```powershell
.\stop.ps1
```

## Run without Docker

Install Python 3.10+ and Node.js 20+, then run:

```powershell
cd day_5\deployment
.\start-local.ps1
```

The script creates a Python virtual environment, installs the required packages, trains the model, installs the frontend packages and starts both development services.

## Project structure

```text
deployment/
|-- backend/
|   |-- app/main.py        FastAPI endpoints
|   |-- model/             generated loan model
|   |-- train_model.py     training script
|   `-- Dockerfile         API container
|-- frontend/
|   |-- app/               Next.js interface and API proxy
|   |-- public/            NUST logo and static assets
|   `-- Dockerfile         web container
|-- docker-compose.yml     complete application stack
|-- start.ps1              Docker startup script
|-- start-local.ps1        local-development startup script
`-- stop.ps1               Docker shutdown script
```

## Model notebook

The notebook [`../Pracs/DIRISA_Deployment_Colab (1).ipynb`](../Pracs/DIRISA_Deployment_Colab%20%281%29.ipynb) regenerates the model used by the API. Despite the original filename, the completed notebook uses local project paths and does not mount Google Drive.

## Disclaimer

The dataset, generated model and application are provided for teaching. They must not be used to make real lending decisions.

[Return to the main repository README](../../README.md)
