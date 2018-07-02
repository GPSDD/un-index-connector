# UN Index Adapter


This repository is the microservice that implements the UN Index Adapter functionality.

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

## Field correspondence

The field correspondence is based on the metadata object for a single package - I.E. [this link](https://data.humdata.org/api/3/action/package_show?id=141121-sierra-leone-health-facilities).
In the UN domain, a `package` entity may refer to multiple data files - identified as `resources`. 
Given that this structure does not match directly to the API structure, we use the following logic to map the UN domain structure to ours:

1. Each UN `package` tentatively corresponds to one API Highways dataset.
2. Within each `package`, if there's one and only `resource` with `format` of type `JSON`, we use that `resource` on step 4. If not, we proceed to step 3.
3. Within each `package`, if there's one and only `resource` with `format` of type `CSV`, we use that `resource` on step 4. If not, the `dataset` status is set to `failed` and no metadata is created.
4. We combine the `package` data and the selected `resource` data to generate metadata as described in the spec table below. 

| Field in SDG Metadata     | Field in UN data     | Value         |
|---------------------------|-----------------------|---------------|
| userId                    |                       |               |
| language                  |                       | 'en'          |
| resource                  |                       |               |
| name                      | ? |               |
| description               | `package.resource.description`        | |
| sourceOrganization        | `package.organization.title`           | |
| dataDownloadUrl           | 'https://data.humdata.org' + `package.resource.hdx_rel_url` | |
| dataSourceUrl             | 'https://data.humdata.org/dataset/' + `package.name`        | |
| dataSourceEndpoint        | 'https://data.humdata.org' + `package.resource.hdx_rel_url` | |
| license                   | Try to match the value of `package.license` to one of the [accepted licenses](https://data.world/license-help), fallback to 'Other'  | |
| status                    |                       | 'published'   |


As for importing `tag` data, the `package.tags.name` will be tentatively matched to the taxonomy entities already present in the graph database, and imported when they match.
In parallel, the API's `legacy` taxonomy will be populated with the `package.organization.title` value. 
