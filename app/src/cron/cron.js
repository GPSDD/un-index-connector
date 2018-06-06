const CronJob = require('cron').CronJob;
const logger = require('logger');
const ResourceWatchService = require('services/resourcewatch.service');
const config = require('config');

logger.info('Initializing cron');
new CronJob(config.cron, async () => {
    return await ResourceWatchService.cronUpdate();
}, null,
  true, /* Start the job right now */
  'Europe/Madrid' /* Time zone of this job. */
);
