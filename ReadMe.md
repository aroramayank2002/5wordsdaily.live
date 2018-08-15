# 5 Words Daily

A small application to save new swedish words daily
```
https://5wordsdaily.live
```

## Getting Started

This project has dependencies on having a postgress schema.
The schema scripts are not part of this project and might get added in future. (distant ;) )

## About

Technology stack used:
```
React for front end development
Express for REST apis and database interaction
Postgress for Database
Google + Facebook for Authentication

Domain Name from Godaddy
Client certificate ( AWS free tier )
Elastic load balancer ( AWS free tier )
Server instance on elestic beanstalk ( AWS free tier )
RDS ( AWS free tier )
Route 53 ( AWS free tier )
```
## Usage

The following commands are mostly used:

### Development

```
npm run main   (Launches the webpack development server)
npm run start  (Launches the express based rest api server to handle database interaction)
```

### Production deployment

Prerequisite to have eb ( aws elesticbean cli) installed and configured/

```
npm run build               (Build the project for production deployment)
eb deploy Helloworld02-env  (Deploys the project to AWS elesticbeanstalk)
```

## Authors

* **Mayank Arora** - *Initial work* - [aroramayank2002](https://github.com/aroramayank2002)

## Acknowledgments

```
Training guides by AWS.
Postgress development guides.
React development guides.
```