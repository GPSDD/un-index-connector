const CronJob = require('cron').CronJob;
const logger = require('logger');
const hdxService = require('services/un.service');
const config = require('config');

logger.info('Initializing cron');
new CronJob('0 45 3 20 * *', async () => {
    return await hdxService.cronUpdate();
}, null,
  true, /* Start the job right now */
  //'Europe/Madrid' /* Time zone of this job. */
  'America/New_York'
);
