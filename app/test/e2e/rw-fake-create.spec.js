const nock = require('nock');
const chai = require('chai');
const should = chai.should();
const {
    RW_FAKE_DATASET_CREATE_REQUEST,
} = require('./test.constants');
const config = require('config');
const { getTestServer } = require('./test-server');

const requester = getTestServer();

describe('E2E test', () => {
    before(() => {

        nock.cleanAll();

        // RW responses for info and metadata on fake dataset
        nock('https://api.resourcewatch.org')
            .get(`/v1/dataset/${RW_FAKE_DATASET_CREATE_REQUEST.connector.tableName}?format=json`)
            .once()
            .reply(404);

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
    });

    it('Create a dataset for an dataset that doesn\'t exist should return an error', async () => {
        const response = await requester
            .post(`/api/v1/resourcewatch/rest-datasets/resourcewatch`)
            .send(RW_FAKE_DATASET_CREATE_REQUEST);
        response.status.should.equal(200);
    });

    after(() => {
        if (!nock.isDone()) {
            throw new Error(`Not all nock interceptors were used: ${nock.pendingMocks()}`);
        }
    });
});
