const logger = require('logger');
const requestPromise = require('request-promise');
const config = require('config');
const ctRegisterMicroservice = require('ct-register-microservice-node');

class UNIndexService {

    static async cronUpdate() {
        const timeout = ms => new Promise(res => setTimeout(res, ms))
        try {
            logger.info('Running cron update');
            logger.debug('Obtaining datasets');
            const datasets = await ctRegisterMicroservice.requestToMicroservice({
                method: 'GET',
                uri: `/dataset?provider=un&page[size]=99999`,
                json: true
            });
            if (datasets && datasets.data) {
                for (let i = 0, length = datasets.data.length; i < length; i++) {
                    try {
                        const dataset = datasets.data[i].attributes;
                        dataset.id = datasets.data[i].id;
                        await timeout(1000);
                        await UNIndexService.register(dataset, dataset.userId, true);
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
        logger.debug(`Obtaining metadata of UN dataset ${dataset.tableName}`);

        logger.debug('Obtaining dataset info and metadata UN dataset ', `${config.un.data}`.replace(':dataset-id', dataset.tableName));

        let unDatasetResponse;
        let sourceOrganization = 'United Nations Statistics Division';

        try {
            unDatasetResponse = await requestPromise({
                method: 'GET',
                url: `${config.un.data}`.replace(':dataset-id', dataset.tableName),
                json: true
            });
            logger.debug('UN package response', unDatasetResponse);

            if (!unDatasetResponse || !unDatasetResponse.data || !unDatasetResponse.dimensions) {
                throw new Error(`Incomplete or invalid data loaded from UN API: ${dataset.tableName}`);
            }

            if (unDatasetResponse.dimensions.length === 0 || unDatasetResponse.attributes.length === 0) {
                throw new Error(`No dataset data available from UN API: ${dataset.tableName}. Check you have used the correct dataset name.`);
            }

            let name = dataset.name;

            if (unDatasetResponse.data.length !== 0) {
                sourceOrganization = unDatasetResponse.data[0].source || sourceOrganization;
                name = unDatasetResponse.data[0].seriesDescription;
            } else {
                throw new Error(`No data found with dataset: ${dataset.tableName}`);
            }

            const dataDownloadURL = config.un.dataSourceEndpoint.replace(':dataset-id', dataset.tableName);
            const dataSourceUrl = config.un.dataSourceUrl.replace(':dataset-id', dataset.tableName);

            const metadata = {
                language: 'en',
                name,
                sourceOrganization,
                dataSourceUrl,
                dataSourceEndpoint: dataDownloadURL,
                dataDownloadUrl: dataDownloadURL,
                status: 'published',
                license: 'Other',
                userId
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
            throw new Error(`Error obtaining metadata: ${err}`);
        }

        if (!update && unDatasetResponse && unDatasetResponse.data && unDatasetResponse.data.length > 0) {
            try {
                const tags = {
                    1: 'SDG_1_No_Poverty',
                    2: 'SDG_2_Zero_Hunger',
                    3: 'SDG_3_Good_Health_and_Well-being',
                    4: 'SDG_4_Quality_Education',
                    5: 'SDG_5_Gender_Equality',
                    6: 'SDG_6_Clean_Water_and_Sanitation',
                    7: 'SDG_7_Affordable_and_Clean_Energy',
                    8: 'SDG_8_Decent_Work_and_Economic_Growth',
                    9: 'SDG_9_Industry_Innovation_and_Infrastructure',
                    10: 'SDG_10_Reduced_Inequalities',
                    11: 'SDG_11_Sustainable_Cities_and_Communities',
                    12: 'SDG_12_Responsible_Consumption_and_Production',
                    13: 'SDG_13_Climate_Action',
                    14: 'SDG_14_Life_below_Water',
                    15: 'SDG_15_Life_on_Land',
                    16: 'SDG_16_Peace_Justice_and_Strong_Institutions',
                    17: 'SDG_17_Partnership_for_Goals'
                }
                const unTags = unDatasetResponse.data[0].goal;

                const body = {
                    legacy: {
                        tags: ['United Nations Statistics Division', sourceOrganization]
                    }
                };

                if (unTags && unTags.length > 0) {
                    body.knowledge_graph = {
                        tags: unTags.map(e => tags[parseInt(e, 10)])
                    };
                }
                if (body.knowledge_graph && body.knowledge_graph.tags.length > 0) {
                    logger.debug('Tagging dataset for UN dataset', dataset.tableName);
                    await ctRegisterMicroservice.requestToMicroservice({
                        method: 'POST',
                        uri: `/dataset/${dataset.id}/vocabulary`,
                        body,
                        json: true
                    });
                }
            } catch (err) {
                logger.error('Error tagging dataset', err);
                throw new Error(`Error tagging dataset: ${err}`);
            }
        }
    }

}

module.exports = UNIndexService;
