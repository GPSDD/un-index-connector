const nock = require('nock');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const {
    RW_API_METADATA_RESPONSE,
    RW_DATASET_CREATE_REQUEST,
    RW_FAKE_DATASET_CREATE_REQUEST,
    RW_API_DATASET_RESPONSE
} = require('./test.constants');
const config = require('config');

let requester;

chai.use(chaiHttp);

describe('E2E test', () => {
    before(() => {

        nock(`${process.env.CT_URL}`)
            .post(`/api/v1/microservice`)
            .once()
            .reply(200);

        // RW responses for info and metadata on real dataset
        nock('https://api.resourcewatch.org')
            .get(`/v1/dataset/${RW_DATASET_CREATE_REQUEST.connector.tableName}?format=json`)
            .once()
            .reply(200, RW_API_DATASET_RESPONSE);
        nock('https://api.resourcewatch.org')
            .get(`/v1/dataset/${RW_DATASET_CREATE_REQUEST.connector.tableName}/metadata?format=json`)
            .once()
            .reply(200, RW_API_METADATA_RESPONSE);


        // RW responses for info and metadata on fake dataset
        nock('https://api.resourcewatch.org')
            .get(`/v1/dataset/${RW_FAKE_DATASET_CREATE_REQUEST.connector.tableName}?format=json`)
            .once()
            .reply(404);

        // Metadata creation request
        nock(`${process.env.CT_URL}`)
            .post(`/v1/dataset/${RW_DATASET_CREATE_REQUEST.connector.id}/metadata`, {
                language: 'en',
                name: 'GDP per capita (current US$)',
                description: 'GDP per capita is gross domestic product divided by midyear population. GDP is the sum of gross value added by all resident producers in the economy plus any product taxes and minus any subsidies not included in the value of the products. It is calculated without making deductions for depreciation of fabricated assets or for depletion and degradation of natural resources. Data are in current U.S. dollars.',
                sourceOrganization: 'Resource Watch API',
                dataSourceUrl: 'https://api.resourcewatch.org/v1/download?sql=select%20*%20from%2003a8da41-d8d0-4095-8fd5-267a25d5fc31',
                dataSourceEndpoint: 'https://api.resourcewatch.org/v1/download?sql=select%20*%20from%2003a8da41-d8d0-4095-8fd5-267a25d5fc31',
                dataDownloadUrl: 'https://api.resourcewatch.org/v1/download?sql=select%20*%20from%2003a8da41-d8d0-4095-8fd5-267a25d5fc31',
                status: 'published',
                license: 'Other',
                userId: '1a10d7c6e0a37126611fd7a7',
                info: {
                    dataDownload: 'http://api.worldbank.org/v2/en/indicator/NY.GDP.PCAP.CD?downloadformat=csv',
                    organization: 'World Bank Group'
                }
            })
            .reply(200);

        // Metadata update request for real dataset
        nock(`${process.env.CT_URL}`)
            .patch(`/v1/dataset/${RW_DATASET_CREATE_REQUEST.connector.id}`, {
                dataset: {
                    status: 1
                }
            })
            .once()
            .reply(200);

        // Metadata update request for fake dataset
        nock(`${process.env.CT_URL}`)
            .patch(`/v1/dataset/${RW_FAKE_DATASET_CREATE_REQUEST.connector.id}`, {
                dataset: {
                    status: 2,
                    errorMessage: 'Error - Error obtaining metadata'
                }
            })
            .once()
            .reply(200);

        const server = require('../../src/app');
        requester = chai.request(server).keepOpen();
    });

    it('Create a dataset for an dataset that doesn\'t exist should return an error', async () => {
        const response = await requester
            .post(`/api/v1/resourcewatch/rest-datasets/resourcewatch`)
            .send(RW_FAKE_DATASET_CREATE_REQUEST);
        response.status.should.equal(200);
    });

    it('Create dataset should be successful (happy case)', async () => {
        const response = await requester
            .post(`/api/v1/resourcewatch/rest-datasets/resourcewatch`)
            .send(RW_DATASET_CREATE_REQUEST);

        response.status.should.equal(200);
    });

    after(() => {
        if (!nock.isDone()) {
            throw new Error(`Not all nock interceptors were used: ${nock.pendingMocks()}`);
        }
    });
});
