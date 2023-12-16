# EMPAQ - CC

As the CC team, we decided to create two backend services because we are using two languages:
1. The main backend server is written in Express.js because it has a lot of documentation and references available, making it easier for us to work with.
1. The machine learning server is written in Flask because deploying the python machine learning model directly is faster than recreating the model in the form of TensorFlow.js.

## Branches

### 1. deploygcp

Branch `deploygcp` contains the codebase for deploying the main backend service on Google App Engine. This service handles authentication and database.

#### Deployment on Google App Engine

- Detailed documentation on the main backend service can be found in the [deploygcp branch](https://github.com/CH2-PS191/cc-ch2-ps191/tree/deployml).

### 2. deployml

Branch `deployml` contains the codebase for deploying the machine learning service on Cloud Run. Application deployed on this branch is used to deploy the Tensorflow NLP model.

#### Deployment on Cloud Run

- Detailed documentation on the machine learning service can be found in the [deployml branch](https://github.com/CH2-PS191/cc-ch2-ps191/tree/deployml).
