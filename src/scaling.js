import {SocketCluster} from 'socketcluster';
import path from 'path';
import {config} from '@dbcdk/biblo-config';

module.exports = function startSocketCluster(configuration = {}) {
  return new SocketCluster(Object.assign({
    workers: config.get('Biblo.workers'),
    brokers: config.get('Biblo.brokers'),
    port: config.get('Biblo.port'),
    appName: config.get('Biblo.applicationTitle'),
    initController: path.join(__dirname, 'init.js'),
    workerController: path.join(__dirname, 'app.js'),
    wsEngine: 'uws',
    rebootWorkerOnCrash: config.get('Biblo.rebootWorkers'),
    killMasterOnSignal: true
  }, configuration));
};
