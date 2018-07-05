const nock = require('nock');
const chai = require('chai');
const should = chai.should();
const {
    UN_FAKE_DATASET_CREATE_REQUEST,
} = require('./test.constants');
const { getTestServer } = require('./test-server');

const requester = getTestServer();

describe('UN fake dataset creation tests ', () => {
    before(() => {

        nock.cleanAll();

        // UN responses for info and metadata on fake dataset
        nock('https://unstats.un.org')
            .get(`/SDGAPI/v1/sdg/Series/Data?pageSize=1&seriesCode=${UN_FAKE_DATASET_CREATE_REQUEST.connector.tableName}`)
            .once()
            .reply(200, {
                size: 1,
                totalElements: 0,
                totalPages: 0,
                pageNumber: 1,
                attributes: [],
                dimensions: [],
                data: []
            });

        // Metadata update request for fake dataset
        nock(`${process.env.CT_URL}`)
            .patch(`/v1/dataset/${UN_FAKE_DATASET_CREATE_REQUEST.connector.id}`, (request) => {
                const expectedRequestContent = {
                    dataset: {
                        status: 2,
                        errorMessage: `Error - Error obtaining metadata: Error: No dataset data available from UN API: ${UN_FAKE_DATASET_CREATE_REQUEST.connector.tableName}. Check you have used the correct dataset name.`
                    }
                };

                request.should.deep.equal(expectedRequestContent);
                return true;
            })
            .once()
            .reply(200);
    });

    it('Create a dataset for an dataset that doesn\'t exist should return an error', async () => {
        const response = await requester
            .post(`/api/v1/un/rest-datasets/un`)
            .send(UN_FAKE_DATASET_CREATE_REQUEST);
        response.status.should.equal(200);
    });

    after(() => {
        if (!nock.isDone()) {
            throw new Error(`Not all nock interceptors were used: ${nock.pendingMocks()}`);
        }
    });
});
