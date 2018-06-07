# Resource Watch Index Adapter


This repository is the microservice that implements the Resource Watch Index Adapter
funcionality

1. [Getting Started](#getting-started)

## Getting Started

### OS X

**First, make sure that you have the [API gateway running
locally](https://github.com/control-tower/control-tower).**

We're using Docker which, luckily for you, means that getting the
application running locally should be fairly painless. First, make sure
that you have [Docker Compose](https://docs.docker.com/compose/install/)
installed on your machine.

```
git clone https://github.com/Vizzuality/gfw-geostore-api.git
cd resource-watch-index-adapter
./adapter.sh develop
```text

You can now access the microservice through the CT gateway.

```

### Configuration

It is necessary to define these environment variables:

* CT_URL => Control Tower URL
* NODE_ENV => Environment (prod, staging, dev)

## Field correspondence


| Field in SDG Metadata     | Field in RW Metadata  | Value         |
|---------------------------|-----------------------|---------------|
| userId                    |                       |               |
| language                  |                       | 'en'          |
| resource                  |                       |               |
| name                      | name                  |               |
| description               | description           |               |
| sourceOrganization        |                       | 'Resource Watch' |
| dataDownloadUrl           |                       | '' with :dataset-id = id of dataset |
| dataSourceUrl             | source (prio1)        | (will depend on source app) (prio 2) |
| dataSourceEndpoint        |                       | 'https://api.resourcewatch.org/v2/countries/all/indicators/:indicator?format=json&per_page=30000' with :indicator = id of indicator|
| license                   | license               |               |
| info                      | info                  |               |
| status                    |                       | 'published'   |
