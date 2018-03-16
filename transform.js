const Shared = require('mia-js-core/lib/shared');
const CronJobExecutionModel = Shared.models('generic-cronJobExecutionModel');
const CronServerHeartbeatModel = Shared.models('generic-cronServerHeartbeatModel');
const allModels = Shared.models();
const accessKeys = Shared.config('SomeConfig').accessKeys;
const oneAccessKey = Shared.config('SomeConfig').accessKeys.one;
const anotherAccessKey = Shared.config('SomeConfig.accessKeys.two');
const identity = 'SomeConfig';
Shared.config(identity);
