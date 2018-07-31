# UN Index Adapter


This repository is the microservice that implements the UN Index Adapter functionality.

1. [Getting Started](#getting-started)

## Getting Started

### Initial import

This connector is used to keep a set of UN Statistics Datasets "in-sync" with the source data (https://unstats.un.org/SDGAPI). Here is the script to [perform the initial import](https://github.com/GPSDD/index-adapter-scripts/blob/master/importUN.py).

### OS X

**First, make sure that you have the [API gateway running
locally](https://github.com/control-tower/control-tower).**

We're using Docker which, luckily for you, means that getting the
application running locally should be fairly painless. First, make sure
that you have [Docker Compose](https://docs.docker.com/compose/install/)
installed on your machine.

```
git clone https://github.com/GPSDD/un-index-adapter.git
cd un-index-adapter
./adapter.sh develop
```text

You can now access the microservice through the CT gateway.

```

### Configuration

It is necessary to define these environment variables:

* CT_URL => Control Tower URL
* NODE_ENV => Environment (prod, staging, dev)

### Cron task

This component executes a periodic task that updates the metadata of each indexed RW dataset. The task is bootstrapped  
[when the application server starts](https://github.com/GPSDD/un-index-adapter/blob/master/app/src/app.js#L19). 
The task's implementation can be found on `app/src/cron/cron` and the configuration is loaded from the 
[config files](https://github.com/GPSDD/un-index-adapter/blob/master/config/default.json#L18)

## Field correspondence

The UN API provides little metadata when compared to other data providers, which justifies the lack of fields like "license" or "description".
It also seems to have datasets with no data (empty `data` section) which this connector handles by not importing those datasets.


| Field in SDG Metadata     | Field in UN data      | Value         |
|---------------------------|-----------------------|---------------|
| userId                    |                       |               |
| language                  |                       | 'en'          |
| resource                  |                       |               |
| name                      | `data[0].seriesDescription` |               |
| description               | | |
| sourceOrganization        | `data[0].source` &#124;&#124; ?          | |
| dataDownloadUrl           | 'https://unstats.un.org/SDGAPI/v1/sdg/Series/Data?pageSize=20000&seriesCode=' + `dataset.tableName` | |
| dataSourceUrl             | 'https://unstats.un.org/sdgs/indicators/database/'        | |
| dataSourceEndpoint        | 'https://unstats.un.org/SDGAPI/v1/sdg/Series/Data?pageSize=20000&seriesCode=' + `dataset.tableName` | |
| license                   |                       | 'Other' |
| status                    |                       | 'published'   |



## Dataset tagging strategy


### Taxonomy

Each dataset is tagged with "United Nations Statistics Division" plus the organisation present in the dataset's data.


### Graph

The `data.goal` value will be tentatively matched to a SDG, and tagged if a match is found. 
