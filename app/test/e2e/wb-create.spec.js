const nock = require('nock');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const { RW_API_METADATA_RESPONSE, RW_DATASET_CREATE_REQUEST, RW_API_METADATA, RW_API_FAKE_METADATA_RESPONSE, RW_FAKE_DATASET_CREATE_REQUEST } = require('./test.constants');
const config = require('config');

let requester;

chai.use(chaiHttp);

describe('E2E test', () => {
    before(() => {

        nock(`${process.env.CT_URL}`)
            .post(`/api/v1/microservice`)
            .once()
            .reply(200);

        nock('https://api.resourcewatch.org')
            .get(`/v2/indicators/${RW_DATASET_CREATE_REQUEST.connector.tableName}?format=json`)
            .once()
            .reply(200, RW_API_METADATA_RESPONSE);
        nock('https://api.worldbank.org')
            .get(`/v2/indicators/${RW_FAKE_DATASET_CREATE_REQUEST.connector.tableName}?format=json`)
            .once()
            .reply(200, RW_API_FAKE_METADATA_RESPONSE);

        // Metadata creation request
        nock(`${process.env.CT_URL}`)
            .post(`/v1/dataset/${RW_DATASET_CREATE_REQUEST.connector.id}/metadata`, {
                language: 'en',
                name: RW_API_METADATA.name,
                description: RW_API_METADATA.sourceNote,
                sourceOrganization: 'World Bank Group',
                dataSourceUrl: config.resourcewatch.dataSourceUrl.replace(':indicator', 'per_si_allsi.cov_pop_tot'),
                dataSourceEndpoint: config.resourcewatch.dataSourceEndpoint.replace(':indicator', 'per_si_allsi.cov_pop_tot'),
                status: 'published',
                license: 'CC-BY',
                userId: '1a10d7c6e0a37126611fd7a7',
                info: {
                    topics: RW_API_METADATA.topics && Array.isArray(RW_API_METADATA.topics) ? RW_API_METADATA.topics.map(e => e.value) : []
                }
            })
            .reply(200);

        // Metadata update request
        nock(`${process.env.CT_URL}`)
            .patch(`/v1/dataset/${RW_DATASET_CREATE_REQUEST.connector.id}`, {
                dataset: {
                    status: 1
                }
            })
            .once()
            .reply(200);


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

    it('Create a dataset for an indicator that doesn\'t exist should return an error', async () => {
        const response = await requester
            .post(`/api/v1/worldbank/rest-datasets/worldbank`)
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
