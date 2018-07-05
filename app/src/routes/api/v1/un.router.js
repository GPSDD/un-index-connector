const Router = require('koa-router');
const logger = require('logger');
const ctRegisterMicroservice = require('ct-register-microservice-node');
const UNIndexService = require('services/un.service');
const FieldSerializer = require('serializers/field.serializer');

const router = new Router({
    prefix: '/un',
});

class UNIndexRouter {

    static async dataAccessNotSupported(ctx) {
        ctx.set('Content-type', 'application/json');
        ctx.body = {
            errors: [{
                status: 400,
                detail: 'This dataset does not support data access through this API. Refer to the dataset\'s metadata for information on how to access the data from the original provider'
            }]
        };
        ctx.status = 400;
    }

    static async fields(ctx) {
        logger.info('Obtaining fields');
        const fields = await UNIndexService.getFields(ctx.request.body.dataset.connectorUrl, ctx.request.body.dataset.tableName);
        ctx.body = FieldSerializer.serialize(fields, ctx.request.body.dataset.tableName);
    }

    static async registerDataset(ctx) {
        logger.info('Registering dataset with data', ctx.request.body);
        try {
            await UNIndexService.register(ctx.request.body.connector, ctx.request.body.userId);
            await ctRegisterMicroservice.requestToMicroservice({
                method: 'PATCH',
                uri: `/dataset/${ctx.request.body.connector.id}`,
                body: {
                    dataset: {
                        status: 1
                    }
                },
                json: true
            });
        } catch (e) {
            logger.error(e);
            await ctRegisterMicroservice.requestToMicroservice({
                method: 'PATCH',
                uri: `/dataset/${ctx.request.body.connector.id}`,
                body: {
                    dataset: {
                        status: 2,
                        errorMessage: `${e.name} - ${e.message}`
                    }
                },
                json: true
            });
        }
        ctx.body = {};
    }

}

router.post('/query/:dataset', UNIndexRouter.dataAccessNotSupported);
router.post('/download/:dataset', UNIndexRouter.dataAccessNotSupported);
router.post('/fields/:dataset', UNIndexRouter.dataAccessNotSupported);
router.post('/rest-datasets/un', UNIndexRouter.registerDataset);

module.exports = router;
