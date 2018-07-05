const nock = require('nock');
const chai = require('chai');
const should = chai.should();
const {
    UN_API_DATASET_RESPONSE,
    UN_API_DATASET_RESPONSE_NO_DATA,
    UN_DATASET_CREATE_REQUEST
} = require('./test.constants');
const { getTestServer } = require('./test-server');

const requester = getTestServer();

describe('UN Dataset creation tests', () => {
    before(() => {
        nock.cleanAll();
    });

    it('Create dataset for UN dataset with no data should fail', async () => {
        // UN responses for info on package and resources
        const noDataDatasetRequest = Object.assign({}, UN_API_DATASET_RESPONSE_NO_DATA);

        nock('https://unstats.un.org')
            .get(`/SDGAPI/v1/sdg/Series/Data?pageSize=1&seriesCode=${UN_DATASET_CREATE_REQUEST.connector.tableName}`)
            .once()
            .reply(200, noDataDatasetRequest);

        nock(`${process.env.CT_URL}`)
            .patch(`/v1/dataset/${UN_DATASET_CREATE_REQUEST.connector.id}`, (request) => {
                const expectedRequestContent = {
                    dataset: {
                        status: 2,
                        errorMessage: `Error - Error obtaining metadata: Error: No data found with dataset: ${UN_DATASET_CREATE_REQUEST.connector.tableName}`
                    }
                };

                request.should.deep.equal(expectedRequestContent);
                return true;
            })
            .once()
            .reply(200);

        const response = await requester
            .post(`/api/v1/un/rest-datasets/un`)
            .send(UN_DATASET_CREATE_REQUEST);

        response.status.should.equal(200);
    });

    it('Create dataset for UN dataset with data should be successful', async () => {
        // UN responses for info on package and resources
        const datasetRequest = Object.assign({}, UN_API_DATASET_RESPONSE);

        nock('https://unstats.un.org')
            .get(`/SDGAPI/v1/sdg/Series/Data?pageSize=1&seriesCode=${UN_DATASET_CREATE_REQUEST.connector.tableName}`)
            .once()
            .reply(200, datasetRequest);

        nock(`${process.env.CT_URL}`)
            .post(`/v1/dataset/${UN_DATASET_CREATE_REQUEST.connector.id}/metadata`, (body) => {
                const expectedRequestBody = {
                    language: 'en',
                    name: 'Total official development assistance (gross disbursement) for water supply and sanitation, by recipient countries (millions of constant 2016 United States dollars)',
                    sourceOrganization: 'Creditor Reporting System (CRS) database, 2018, The Organisation for Economic Co-operation and Development (OECD)',
                    dataSourceUrl: 'https://unstats.un.org/sdgs/indicators/database/',
                    dataSourceEndpoint: `https://unstats.un.org/SDGAPI/v1/sdg/Series/Data?pageSize=20000&seriesCode=${UN_DATASET_CREATE_REQUEST.connector.tableName}`,
                    dataDownloadUrl: `https://unstats.un.org/SDGAPI/v1/sdg/Series/Data?pageSize=20000&seriesCode=${UN_DATASET_CREATE_REQUEST.connector.tableName}`,
                    status: 'published',
                    license: 'Other',
                    userId: '1a10d7c6e0a37126611fd7a7'
                };

                body.should.deep.equal(expectedRequestBody);
                return true;
            })
            .once()
            .reply(200);

        nock(`${process.env.CT_URL}`)
            .patch(`/v1/dataset/${UN_DATASET_CREATE_REQUEST.connector.id}`, (request) => {
                const expectedRequestContent = {
                    dataset: {
                        status: 1
                    }
                };

                request.should.deep.equal(expectedRequestContent);
                return true;
            })
            .once()
            .reply(200);

        nock(`${process.env.CT_URL}`)
            .post(`/v1/dataset/${UN_DATASET_CREATE_REQUEST.connector.id}/vocabulary`, (body) => {
                const expectedRequestBody = {
                    knowledge_graph: {
                        tags: [
                            'SDG_6_Clean_Water_and_Sanitation'
                        ]
                    },
                    legacy: {
                        tags: [
                            'United Nations Statistics Division',
                            'Creditor Reporting System (CRS) database, 2018, The Organisation for Economic Co-operation and Development (OECD)'
                        ]
                    }
                };

                body.should.deep.equal(expectedRequestBody);
                return true;
            })
            .once()
            .reply(200);

        const response = await requester
            .post(`/api/v1/un/rest-datasets/un`)
            .send(UN_DATASET_CREATE_REQUEST);

        response.status.should.equal(200);
    });

    afterEach(() => {
        if (!nock.isDone()) {
            throw new Error(`Not all nock interceptors were used: ${nock.pendingMocks()}`);
        }
    });
});
