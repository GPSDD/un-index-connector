const nock = require('nock');
const chai = require('chai');
const should = chai.should();
const {
    HDX_FAKE_DATASET_CREATE_REQUEST,
} = require('./test.constants');
const { getTestServer } = require('./test-server');

const requester = getTestServer();

describe('E2E test', () => {
    before(() => {

        nock.cleanAll();

        // HDX responses for info and metadata on fake dataset
        nock('https://api.hdx.org')
            .get(`/v1/dataset/${HDX_FAKE_DATASET_CREATE_REQUEST.connector.tableName}?format=json`)
            .once()
            .reply(404, {
                errors: [
                    {
                        status: 404,
                        detail: `Dataset with id '${HDX_FAKE_DATASET_CREATE_REQUEST.connector.tableName}' doesn't exist`
                    }
                ]
            });

        // Metadata update request for fake dataset
        nock(`${process.env.CT_URL}`)
            .patch(`/v1/dataset/${HDX_FAKE_DATASET_CREATE_REQUEST.connector.id}`, (request) => {
                const expectedRequestContent = {
                    dataset: {
                        status: 2,
                        errorMessage: `Error - Error obtaining metadata: StatusCodeError: 404 - {"errors":[{"status":404,"detail":"Dataset with id '${HDX_FAKE_DATASET_CREATE_REQUEST.connector.tableName}' doesn't exist"}]}`
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
            .post(`/api/v1/hdx/rest-datasets/hdx`)
            .send(HDX_FAKE_DATASET_CREATE_REQUEST);
        response.status.should.equal(200);
    });

    after(() => {
        if (!nock.isDone()) {
            throw new Error(`Not all nock interceptors were used: ${nock.pendingMocks()}`);
        }
    });
});
