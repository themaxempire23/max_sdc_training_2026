# Day 5 Loan Model App

This project connects a trained scikit-learn loan model to a Next.js interface through a small FastAPI service.

## Run with Docker

You only need Docker Desktop.

```powershell
cd day_5\deployment
.\start.ps1
```

Then open:

- App: http://localhost:3000
- API documentation: http://localhost:8000/docs
- API health check: http://localhost:8000/health

Stop the app with:

```powershell
.\stop.ps1
```

## Run without Docker

Install Python 3.10+ and Node.js 20+, then run:

```powershell
cd day_5\deployment
.\start-local.ps1
```

The script creates a Python environment, trains the model, installs the UI packages, and starts both services.

## Project structure

```text
deployment/
├── backend/              FastAPI service and model training code
├── frontend/             Next.js user interface
├── docker-compose.yml    Starts the complete application
├── start.ps1             Docker start command
├── start-local.ps1       Local development command
└── stop.ps1              Docker stop command
```

The deployment notebook in `../Pracs/DIRISA_Deployment_Colab (1).ipynb` regenerates the same model used by the API. The sample model and its decisions are for teaching only, not real lending decisions.
