const nock = require('nock');
const chai = require('chai');
const should = chai.should();
const {
    HDX_API_METADATA_RESPONSE,
    HDX_DATASET_CREATE_REQUEST,
    HDX_API_DATASET_RESPONSE,
    HDX_API_VOCABULARY_RESPONSE
} = require('./test.constants');
const { getTestServer } = require('./test-server');

const requester = getTestServer();

describe('E2E test', () => {
    before(() => {

        nock.cleanAll();

        // HDX responses for info and metadata on real dataset
        nock('https://api.hdx.org')
            .get(`/v1/dataset/${HDX_DATASET_CREATE_REQUEST.connector.tableName}?format=json`)
            .times(6)
            .reply(200, HDX_API_DATASET_RESPONSE);
        nock('https://api.hdx.org')
            .get(`/v1/dataset/${HDX_DATASET_CREATE_REQUEST.connector.tableName}/metadata?format=json`)
            .times(6)
            .reply(200, HDX_API_METADATA_RESPONSE);
        nock('https://api.hdx.org')
            .get(`/v1/dataset/${HDX_DATASET_CREATE_REQUEST.connector.tableName}/vocabulary/knowledge_graph`)
            .times(6)
            .reply(200, HDX_API_VOCABULARY_RESPONSE);

        // Metadata update request for real dataset
        nock(`${process.env.CT_URL}`)
            .patch(`/v1/dataset/${HDX_DATASET_CREATE_REQUEST.connector.id}`, {
                dataset: {
                    status: 1
                }
            })
            .times(6)
            .reply(200);
    });

    it('Create dataset with no language and no app should be successful and use the first metadata', async () => {
        nock(`${process.env.CT_URL}`)
            .post(`/v1/dataset/${HDX_DATASET_CREATE_REQUEST.connector.id}/metadata`, (body) => {
                const expectedRequestBody = {
                    language: 'es',
                    name: 'Name for HDX in Spanish',
                    description: 'GDP per capita is gross domestic product divided by midyear population. GDP is the sum of gross value added by all resident producers in the economy plus any product taxes and minus any subsidies not included in the value of the products. It is calculated without making deductions for depreciation of fabricated assets or for depletion and degradation of natural resources. Data are in current U.S. dollars.',
                    sourceOrganization: 'HDX API',
                    dataSourceUrl: 'https://api.hdx.org/v1/download?sql=select%20*%20from%2003a8da41-d8d0-4095-8fd5-267a25d5fc31',
                    dataSourceEndpoint: 'https://api.hdx.org/v1/download?sql=select%20*%20from%2003a8da41-d8d0-4095-8fd5-267a25d5fc31',
                    dataDownloadUrl: 'https://api.hdx.org/v1/download?sql=select%20*%20from%2003a8da41-d8d0-4095-8fd5-267a25d5fc31',
                    status: 'published',
                    license: 'Other',
                    userId: '1a10d7c6e0a37126611fd7a7',
                    info: {
                        dataDownload: 'http://api.worldbank.org/v2/en/indicator/NY.GDP.PCAP.CD?downloadformat=csv',
                        organization: 'World Bank Group'
                    }
                };

                body.should.deep.equal(expectedRequestBody);
                return true;
            })
            .once()
            .reply(200);

        nock(`${process.env.CT_URL}`)
            .post(`/v1/dataset/${HDX_DATASET_CREATE_REQUEST.connector.id}/vocabulary`, (body) => {
                const expectedRequestBody = {
                    knowledge_graph: {
                        tags: [
                            'daily',
                            'vector',
                            'near_real_time',
                            'geospatial',
                            'table',
                            'global',
                            'forest',
                            'fire'
                        ]
                    },
                    legacy: {
                        tags: ['HDX API']
                    }
                };

                body.should.deep.equal(expectedRequestBody);
                return true;
            })
            .once()
            .reply(200);

        const response = await requester
            .post(`/api/v1/hdx/rest-datasets/hdx`)
            .send(HDX_DATASET_CREATE_REQUEST);

        response.status.should.equal(200);
    });

    it('Create dataset from Aqueduct/no language should be successful', async () => {
        const datasetRequest = Object.assign({}, HDX_DATASET_CREATE_REQUEST);
        datasetRequest.connector.sourceApplication = 'aqueduct';

        // Metadata creation request for Aqueduct/<no language>
        nock(`${process.env.CT_URL}`)
            .post(`/v1/dataset/${HDX_DATASET_CREATE_REQUEST.connector.id}/metadata`, (body) => {
                const expectedRequestBody = {
                    language: 'es',
                    name: 'Name for Aqueduct in Spanish',
                    description: 'GDP per capita is gross domestic product divided by midyear population. GDP is the sum of gross value added by all resident producers in the economy plus any product taxes and minus any subsidies not included in the value of the products. It is calculated without making deductions for depreciation of fabricated assets or for depletion and degradation of natural resources. Data are in current U.S. dollars.',
                    sourceOrganization: 'Aqueduct',
                    dataSourceUrl: 'https://api.hdx.org/v1/download?sql=select%20*%20from%2003a8da41-d8d0-4095-8fd5-267a25d5fc31',
                    dataSourceEndpoint: 'https://api.hdx.org/v1/download?sql=select%20*%20from%2003a8da41-d8d0-4095-8fd5-267a25d5fc31',
                    dataDownloadUrl: 'https://api.hdx.org/v1/download?sql=select%20*%20from%2003a8da41-d8d0-4095-8fd5-267a25d5fc31',
                    status: 'published',
                    license: 'Other',
                    userId: '1a10d7c6e0a37126611fd7a7',
                    info: {
                        dataDownload: 'http://api.worldbank.org/v2/en/indicator/NY.GDP.PCAP.CD?downloadformat=csv',
                        organization: 'World Bank Group'
                    }
                };

                body.should.deep.equal(expectedRequestBody);
                return true;
            })
            .once()
            .reply(200);

        nock(`${process.env.CT_URL}`)
            .post(`/v1/dataset/${HDX_DATASET_CREATE_REQUEST.connector.id}/vocabulary`, (body) => {
                const expectedRequestBody = {
                    knowledge_graph: {
                        tags: [
                            'daily',
                            'vector',
                            'near_real_time',
                            'geospatial',
                            'table',
                            'global',
                            'forest',
                            'fire'
                        ]
                    },
                    legacy: {
                        tags: ['HDX API', 'Aqueduct']
                    }
                };

                body.should.deep.equal(expectedRequestBody);
                return true;
            })
            .once()
            .reply(200);

        const response = await requester
            .post(`/api/v1/hdx/rest-datasets/hdx`)
            .send(datasetRequest);

        response.status.should.equal(200);
    });

    it('Create dataset from Aqueduct/English should be successful', async () => {
        const datasetRequest = Object.assign({}, HDX_DATASET_CREATE_REQUEST);
        datasetRequest.connector.sourceApplication = 'aqueduct';
        datasetRequest.connector.sourceLanguage = 'en';

        // Metadata creation request for Aqueduct/<no language>
        nock(`${process.env.CT_URL}`)
            .post(`/v1/dataset/${HDX_DATASET_CREATE_REQUEST.connector.id}/metadata`, (body) => {
                const expectedRequestBody = {
                    language: 'en',
                    name: 'Name for Aqueduct in English',
                    description: 'GDP per capita is gross domestic product divided by midyear population. GDP is the sum of gross value added by all resident producers in the economy plus any product taxes and minus any subsidies not included in the value of the products. It is calculated without making deductions for depreciation of fabricated assets or for depletion and degradation of natural resources. Data are in current U.S. dollars.',
                    sourceOrganization: 'Aqueduct',
                    dataSourceUrl: 'https://api.hdx.org/v1/download?sql=select%20*%20from%2003a8da41-d8d0-4095-8fd5-267a25d5fc31',
                    dataSourceEndpoint: 'https://api.hdx.org/v1/download?sql=select%20*%20from%2003a8da41-d8d0-4095-8fd5-267a25d5fc31',
                    dataDownloadUrl: 'https://api.hdx.org/v1/download?sql=select%20*%20from%2003a8da41-d8d0-4095-8fd5-267a25d5fc31',
                    status: 'published',
                    license: 'Other',
                    userId: '1a10d7c6e0a37126611fd7a7',
                    info: {
                        dataDownload: 'http://api.worldbank.org/v2/en/indicator/NY.GDP.PCAP.CD?downloadformat=csv',
                        organization: 'World Bank Group'
                    }
                };

                body.should.deep.equal(expectedRequestBody);
                return true;
            })
            .once()
            .reply(200);

        nock(`${process.env.CT_URL}`)
            .post(`/v1/dataset/${HDX_DATASET_CREATE_REQUEST.connector.id}/vocabulary`, (body) => {
                const expectedRequestBody = {
                    knowledge_graph: {
                        tags: [
                            'daily',
                            'vector',
                            'near_real_time',
                            'geospatial',
                            'table',
                            'global',
                            'forest',
                            'fire'
                        ]
                    },
                    legacy: {
                        tags: ['HDX API', 'Aqueduct']
                    }
                };

                body.should.deep.equal(expectedRequestBody);
                return true;
            })
            .once()
            .reply(200);

        const response = await requester
            .post(`/api/v1/hdx/rest-datasets/hdx`)
            .send(datasetRequest);

        response.status.should.equal(200);
    });

    it('Create dataset from PREP/English should be successful', async () => {
        const datasetRequest = Object.assign({}, HDX_DATASET_CREATE_REQUEST);
        datasetRequest.connector.sourceApplication = 'prep';
        datasetRequest.connector.sourceLanguage = 'en';

        // Metadata creation request for Aqueduct/<no language>
        nock(`${process.env.CT_URL}`)
            .post(`/v1/dataset/${HDX_DATASET_CREATE_REQUEST.connector.id}/metadata`, (body) => {
                const expectedRequestBody = {
                    language: 'en',
                    name: 'Name for PREP in English',
                    description: 'GDP per capita is gross domestic product divided by midyear population. GDP is the sum of gross value added by all resident producers in the economy plus any product taxes and minus any subsidies not included in the value of the products. It is calculated without making deductions for depreciation of fabricated assets or for depletion and degradation of natural resources. Data are in current U.S. dollars.',
                    sourceOrganization: 'PREP- Partnership for Resilience & Preparedness',
                    dataSourceUrl: 'https://www.prepdata.org/dataset/GDP-per-capita-current-USdollar-1490086842131',
                    dataSourceEndpoint: 'https://api.hdx.org/v1/download?sql=select%20*%20from%2003a8da41-d8d0-4095-8fd5-267a25d5fc31',
                    dataDownloadUrl: 'https://api.hdx.org/v1/download?sql=select%20*%20from%2003a8da41-d8d0-4095-8fd5-267a25d5fc31',
                    status: 'published',
                    license: 'Other',
                    userId: '1a10d7c6e0a37126611fd7a7',
                    info: {
                        dataDownload: 'http://api.worldbank.org/v2/en/indicator/NY.GDP.PCAP.CD?downloadformat=csv',
                        organization: 'World Bank Group'
                    }
                };

                body.should.deep.equal(expectedRequestBody);
                return true;
            })
            .once()
            .reply(200);

        nock(`${process.env.CT_URL}`)
            .post(`/v1/dataset/${HDX_DATASET_CREATE_REQUEST.connector.id}/vocabulary`, (body) => {
                const expectedRequestBody = {
                    knowledge_graph: {
                        tags: [
                            'daily',
                            'vector',
                            'near_real_time',
                            'geospatial',
                            'table',
                            'global',
                            'forest',
                            'fire'
                        ]
                    },
                    legacy: {
                        tags: ['HDX API', 'PREP- Partnership for Resilience & Preparedness']
                    }
                };

                body.should.deep.equal(expectedRequestBody);
                return true;
            })
            .once()
            .reply(200);

        const response = await requester
            .post(`/api/v1/hdx/rest-datasets/hdx`)
            .send(datasetRequest);

        response.status.should.equal(200);
    });

    it('Create dataset from HDX/English should be successful', async () => {
        const datasetRequest = Object.assign({}, HDX_DATASET_CREATE_REQUEST);
        datasetRequest.connector.sourceApplication = 'hdx';
        datasetRequest.connector.sourceLanguage = 'en';

        // Metadata creation request for Aqueduct/<no language>
        nock(`${process.env.CT_URL}`)
            .post(`/v1/dataset/${HDX_DATASET_CREATE_REQUEST.connector.id}/metadata`, (body) => {
                const expectedRequestBody = {
                    language: 'en',
                    name: 'Name for HDX in English',
                    description: 'GDP per capita is gross domestic product divided by midyear population. GDP is the sum of gross value added by all resident producers in the economy plus any product taxes and minus any subsidies not included in the value of the products. It is calculated without making deductions for depreciation of fabricated assets or for depletion and degradation of natural resources. Data are in current U.S. dollars.',
                    sourceOrganization: 'HDX',
                    dataSourceUrl: 'https://hdx.org/data/explore/GDP-per-capita-current-USdollar-1490086842131',
                    dataSourceEndpoint: 'https://api.hdx.org/v1/download?sql=select%20*%20from%2003a8da41-d8d0-4095-8fd5-267a25d5fc31',
                    dataDownloadUrl: 'https://api.hdx.org/v1/download?sql=select%20*%20from%2003a8da41-d8d0-4095-8fd5-267a25d5fc31',
                    status: 'published',
                    license: 'Other',
                    userId: '1a10d7c6e0a37126611fd7a7',
                    info: {
                        dataDownload: 'http://api.worldbank.org/v2/en/indicator/NY.GDP.PCAP.CD?downloadformat=csv',
                        organization: 'World Bank Group'
                    }
                };

                body.should.deep.equal(expectedRequestBody);
                return true;
            })
            .once()
            .reply(200);

        nock(`${process.env.CT_URL}`)
            .post(`/v1/dataset/${HDX_DATASET_CREATE_REQUEST.connector.id}/vocabulary`, (body) => {
                const expectedRequestBody = {
                    knowledge_graph: {
                        tags: [
                            'daily',
                            'vector',
                            'near_real_time',
                            'geospatial',
                            'table',
                            'global',
                            'forest',
                            'fire'
                        ]
                    },
                    legacy: {
                        tags: ['HDX API', 'HDX']
                    }
                };

                body.should.deep.equal(expectedRequestBody);
                return true;
            })
            .once()
            .reply(200);

        const response = await requester
            .post(`/api/v1/hdx/rest-datasets/hdx`)
            .send(datasetRequest);

        response.status.should.equal(200);
    });

    it('Create dataset from GFW/English should be successful', async () => {
        const datasetRequest = Object.assign({}, HDX_DATASET_CREATE_REQUEST);
        datasetRequest.connector.sourceApplication = 'gfw';
        datasetRequest.connector.sourceLanguage = 'en';

        // Metadata creation request for Aqueduct/<no language>
        nock(`${process.env.CT_URL}`)
            .post(`/v1/dataset/${HDX_DATASET_CREATE_REQUEST.connector.id}/metadata`, (body) => {
                const expectedRequestBody = {
                    language: 'en',
                    name: 'Name for GFW in English',
                    description: 'GDP per capita is gross domestic product divided by midyear population. GDP is the sum of gross value added by all resident producers in the economy plus any product taxes and minus any subsidies not included in the value of the products. It is calculated without making deductions for depreciation of fabricated assets or for depletion and degradation of natural resources. Data are in current U.S. dollars.',
                    sourceOrganization: 'Global Forest Watch',
                    dataSourceUrl: 'https://api.hdx.org/v1/download?sql=select%20*%20from%2003a8da41-d8d0-4095-8fd5-267a25d5fc31',
                    dataSourceEndpoint: 'https://api.hdx.org/v1/download?sql=select%20*%20from%2003a8da41-d8d0-4095-8fd5-267a25d5fc31',
                    dataDownloadUrl: 'https://api.hdx.org/v1/download?sql=select%20*%20from%2003a8da41-d8d0-4095-8fd5-267a25d5fc31',
                    status: 'published',
                    license: 'Other',
                    userId: '1a10d7c6e0a37126611fd7a7',
                    info: {
                        dataDownload: 'http://api.worldbank.org/v2/en/indicator/NY.GDP.PCAP.CD?downloadformat=csv',
                        organization: 'World Bank Group'
                    }
                };

                body.should.deep.equal(expectedRequestBody);
                return true;
            })
            .once()
            .reply(200);

        nock(`${process.env.CT_URL}`)
            .post(`/v1/dataset/${HDX_DATASET_CREATE_REQUEST.connector.id}/vocabulary`, (body) => {
                const expectedRequestBody = {
                    knowledge_graph: {
                        tags: [
                            'daily',
                            'vector',
                            'near_real_time',
                            'geospatial',
                            'table',
                            'global',
                            'forest',
                            'fire'
                        ]
                    },
                    legacy: {
                        tags: ['HDX API', 'Global Forest Watch']
                    }
                };

                body.should.deep.equal(expectedRequestBody);
                return true;
            })
            .once()
            .reply(200);

        const response = await requester
            .post(`/api/v1/hdx/rest-datasets/hdx`)
            .send(datasetRequest);

        response.status.should.equal(200);
    });

    after(() => {
        if (!nock.isDone()) {
            throw new Error(`Not all nock interceptors were used: ${nock.pendingMocks()}`);
        }
    });
});
