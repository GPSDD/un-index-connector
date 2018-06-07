const logger = require('logger');
const requestPromise = require('request-promise');
const config = require('config');
const ctRegisterMicroservice = require('ct-register-microservice-node');

const ACCEPTED_LICENSE_STRINGS = [
    'Public Domain',
    'CC-0',
    'PDDL',
    'CC-BY',
    'CDLA-Permissive-1.0',
    'ODC-BY',
    'CC-BY-SA',
    'CDLA-Sharing-1.0',
    'ODC-ODbL',
    'CC BY-NC',
    'CC BY-ND',
    'CC BY-NC-SA',
    'CC BY-NC-ND',
    'Other'
];

class RWIndexService {

    static async cronUpdate() {
        try {
            logger.info('Running cron update');
            logger.debug('Obtaining datasets');
            const datasets = await ctRegisterMicroservice.requestToMicroservice({
                method: 'GET',
                uri: `/dataset?provider=resourcewatch&page[size]=99999&status=saved`,
                json: true
            });
            if (datasets && datasets.data) {
                for (let i = 0, length = datasets.data.length; i < length; i++) {
                    try {
                        const dataset = datasets.data[i].attributes;
                        dataset.id = datasets.data[i].id;
                        await RWIndexService.register(dataset, dataset.userId, true);
                    } catch (err) {
                        logger.error('Error updating dataset', err);
                    }
                }
            }
        } catch (err) {
            logger.error('Error in cron update', err);
            throw err;
        }
    }

    static async register(dataset, userId, update = false) {
        logger.debug(`Obtaining metadata of indicator ${dataset.tableName}`);

        logger.debug('Obtaining dataset info and metadata of dataset ', `${config.resourcewatch.metadata}`.replace(':dataset-id', dataset.tableName));
        try {
            const rwDatasetResponse = await requestPromise({
                method: 'GET',
                url: `${config.resourcewatch.dataset}`.replace(':dataset-id', dataset.tableName),
                json: true
            });
            logger.debug('RW dataset response', rwDatasetResponse);

            let rwDataset;
            if (rwDatasetResponse && rwDatasetResponse.data && rwDatasetResponse.data.attributes) {
                rwDataset = rwDatasetResponse.data.attributes;
            }

            const rwMetadataResponse = await requestPromise({
                method: 'GET',
                url: `${config.resourcewatch.metadata}`.replace(':dataset-id', dataset.tableName),
                json: true
            });
            logger.debug('RW metadata response', rwMetadataResponse);

            if (!rwMetadataResponse || !rwMetadataResponse.data || rwMetadataResponse.data.length === 0) {
                throw new Error('Dataset metadata response format not valid');
            }

            let rwMetadataList = rwMetadataResponse.data;

            if (dataset.sourceLanguage) {
                rwMetadataList = rwMetadataList.filter(elem => elem.attributes.language === dataset.sourceLanguage);
            }

            if (dataset.sourceApplication) {
                rwMetadataList = rwMetadataList.filter(elem => elem.attributes.application.includes(dataset.sourceApplication));
            }

            if (rwMetadataList.length === 0) {
                throw new Error('Dataset metadata response format not valid');
            }

            const rwMetadata = rwMetadataList[0].attributes;

            let sourceOrganization;
            const dataDownloadURL = config.resourcewatch.dataSourceEndpoint.replace(':dataset-id', rwMetadata.dataset);
            let datasetPage = dataDownloadURL;

            switch (rwMetadata.application) {

                case 'prep':
                    sourceOrganization = 'PREP- Partnership for Resilience & Preparedness';
                    if (rwDataset) {
                        datasetPage = `https://www.prepdata.org/dataset/${rwDataset.slug}`;
                    }
                    break;
                case 'gfw':
                    sourceOrganization = 'Global Forest Watch';
                    break;
                case 'gfw-climate':
                    sourceOrganization = 'Global Forest Watch - Climate';
                    break;
                case 'aqueduct':
                    sourceOrganization = 'Aqueduct';
                    break;
                case 'forest-atlas':
                case 'rw':
                    sourceOrganization = 'Resource Watch';
                    if (rwDataset) {
                        datasetPage = `https://resourcewatch.org/data/explore/${rwDataset.slug}`;
                    }
                    break;
                default:
                    sourceOrganization = 'Resource Watch API';
                    break;

            }

            const metadata = {
                language: rwMetadata.language,
                name: rwMetadata.name,
                description: rwMetadata.description,
                sourceOrganization,
                dataSourceUrl: datasetPage,
                dataSourceEndpoint: dataDownloadURL,
                dataDownloadUrl: dataDownloadURL,
                status: 'published',
                license: ACCEPTED_LICENSE_STRINGS.includes(rwMetadata.license) ? rwMetadata.license : 'Other',
                userId,
                info: rwMetadata.info
            };
            logger.debug('Saving metadata', metadata);
            if (!update) {
                await ctRegisterMicroservice.requestToMicroservice({
                    method: 'POST',
                    uri: `/dataset/${dataset.id}/metadata`,
                    body: metadata,
                    json: true
                });
            } else {
                await ctRegisterMicroservice.requestToMicroservice({
                    method: 'PATCH',
                    uri: `/dataset/${dataset.id}/metadata`,
                    body: metadata,
                    json: true
                });
            }

        } catch (err) {
            logger.error('Error obtaining metadata', err);
            throw new Error('Error obtaining metadata');
        }
    }

}

module.exports = RWIndexService;
