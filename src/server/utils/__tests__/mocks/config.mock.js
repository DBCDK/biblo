export const configMock = {
  Biblo: {
    applicationTitle: 'applicationTitle',
    endpoint: 'endpoint',
    port: 1234,
    frontPageBucket: 'frontPageBucket',
    workers: 1,
    brokers: 1,
    rebootWorkers: true,
    showInSearchEngines: false
  },
  CacheTimes: {
    short: 1,
    standard: '1',
    extended: 2
  },
  CommunityService: {
    applicationTitle: 'applicationTitle',
    endpoint: 'endpoint',
    port: 1234,
    datasources: {
      db: {
        name: 'name',
        connector: 'connector'
      },
      psqlDs: {
        host: 'host',
        port: 1234,
        database: 'database',
        username: 'username',
        password: 'password',
        name: 'name',
        connector: 'connector'
      }
    },
    elasticSearch: {
      enabled: false,
      host: 'host',
      indexName: 'indexName'
    }
  },
  Redis: {
    host: 'host',
    port: 1234,
    db: '',
    queue_prefix: 'queue_prefix'
  },
  UNILogin: {
    id: 'id',
    secret: 'secret',
    uniloginBasePath: 'uniloginBasePath',
    returURL: 'returURL'
  },
  NewRelic: {
    enabled: false,
    app_name: 'app_name'
  },
  Logger: {
    KAFKA_TOPIC: null,
    KAFKA_HOST: null
  },
  Proxy: {
    NO_PROXY: null,
    https_proxy: null,
    http_proxy: null
  },
  ServiceProvider: {
    aws: {
      key: 'key',
      keyId: 'keyId',
      region: 'region',
      TopicArn: 'TopicArn',
      snsApiVersion: 'snsApiVersion',
      transcoding: {
        pipelineId: 'pipelineId',
        presetId: 'presetId'
      },
      buckets: {
        imageBucket: 'imageBucket',
        videoInputBucket: 'videoInputBucket',
        videoOutputBucket: 'videoOutputBucket',
        pdfBucket: 'pdfBucket',
        imageBuckets: {
          thumbnail: 'thumbnail',
          small: 'small',
          medium: 'medium',
          large: 'large',
          'large-square': 'large-square',
          'medium-square': 'medium-square',
          'small-square': 'small-square'
        }
      },
      cloudfrontUrls: {
        'uxdev-biblo-imagebucket': 'uxdev-biblo-imagebucket',
        'uxdev-biblo-imagebucket-thumbnail': 'uxdev-biblo-imagebucket-thumbnail',
        'uxdev-biblo-imagebucket-small': 'uxdev-biblo-imagebucket-small',
        'uxdev-biblo-imagebucket-medium': 'uxdev-biblo-imagebucket-medium',
        'uxdev-biblo-imagebucket-large': 'uxdev-biblo-imagebucket-large',
        'uxdev-biblo-pdfbucket': 'uxdev-biblo-pdfbucket',
        'uxprod-biblo-imagebucket': 'uxprod-biblo-imagebucket',
        'uxprod-biblo-imagebucket-thumbnail': 'uxprod-biblo-imagebucket-thumbnail',
        'uxprod-biblo-imagebucket-small': 'uxprod-biblo-imagebucket-small',
        'uxprod-biblo-imagebucket-medium': 'uxprod-biblo-imagebucket-medium',
        'uxprod-biblo-imagebucket-large': 'uxprod-biblo-imagebucket-large',
        'uxprod-biblo-pdfbucket': 'uxprod-biblo-pdfbucket'
      },
      DynamoDB: {
        tableName: null,
        apiVersion: 'apiVersion',
        readCap: 1,
        writeCap: 1
      }
    },
    bibloadmin: {
      endpoint: 'endpoint',
      user: 'user',
      password: 'password'
    },
    borchk: {
      wsdl: 'wsdl',
      serviceRequester: 'serviceRequesterk'
    },
    community: {
      endpoint: 'endpoint'
    },
    entitysuggest: {
      endpoint: 'endpoint',
      port: 1234
    },
    openplatform: {
      endpoint: 'endpoint',
      smaug: 'smaug',
      token: 'token',
      clientId: 'clientId',
      clientSecret: 'clientSecret'
    },
    openorder: {
      endpoint: 'endpoint',
      user: 'user',
      group: 'group',
      password: 'password',
      orderSystem: 'orderSystem',
      serviceRequester: 'serviceRequester',
      needBeforeDate: 'needBeforeDate'
    },
    openuserstatus: {
      endpoint: 'endpoint'
    },
    openagency: {
      wsdl: 'wsdl',
      libraryType: 'libraryType'
    }
  },
  Sessions: {
    secret: 'secret'
  },
  Email: {
    transportString: 'transportString',
    email: 'email',
    virusTotal: 'virusTotal',
    IMAP: {
      user: 'user',
      password: 'password',
      host: 'host',
      port: 1234,
      tls: true
    }
  }
};
