const ROLES = {
    USER: {
        id: '1a10d7c6e0a37126611fd7a7',
        role: 'USER',
        provider: 'local',
        email: 'user@control-tower.org',
        extraUserData: {
            apps: [
                'rw',
                'gfw',
                'gfw-climate',
                'prep',
                'aqueduct',
                'forest-atlas',
                'data4sdgs'
            ]
        }
    },
    MANAGER: {
        id: '1a10d7c6e0a37126611fd7a7',
        role: 'MANAGER',
        provider: 'local',
        email: 'user@control-tower.org',
        extraUserData: {
            apps: [
                'rw',
                'gfw',
                'gfw-climate',
                'prep',
                'aqueduct',
                'forest-atlas',
                'data4sdgs'
            ]
        }
    },
    ADMIN: {
        id: '1a10d7c6e0a37126611fd7a7',
        role: 'ADMIN',
        provider: 'local',
        email: 'user@control-tower.org',
        extraUserData: {
            apps: [
                'rw',
                'gfw',
                'gfw-climate',
                'prep',
                'aqueduct',
                'forest-atlas',
                'data4sdgs'
            ]
        }
    }
};

const RW_DATASET_CREATE_REQUEST = {
    connector: {
        __v: 0,
        name: 'Seasonal variability',
        slug: 'Seasonal-variability_17',
        connectorType: 'rest',
        provider: 'resourcewatch',
        userId: '1a10d7c6e0a37126611fd7a7',
        updatedAt: '2018-06-01T11:04:47.231Z',
        createdAt: '2018-06-01T11:04:47.231Z',
        legend: {
            nested: [],
            country: [],
            region: [],
            date: []
        },
        taskId: null,
        'protected': false,
        geoInfo: false,
        env: 'production',
        sandbox: false,
        published: true,
        errorMessage: null,
        verified: false,
        overwrite: false,
        status: 'pending',
        tableName: 'real-rw-dataset-id',
        connectorUrl: null,
        attributesPath: null,
        dataPath: null,
        application: 'data4sdgs',
        type: null,
        _id: '47e9a243-9aea-44e5-94fc-44866e83b0a7',
        id: '47e9a243-9aea-44e5-94fc-44866e83b0a7',
        connector_url: null,
        attributes_path: null,
        data_path: null,
        table_name: 'real-rw-dataset-id'
    },
    userId: '1a10d7c6e0a37126611fd7a7',
    loggedUser: {
        id: 'microservice'
    }
};

const RW_FAKE_DATASET_CREATE_REQUEST = {
    connector: {
        __v: 0,
        name: 'Fake dataset',
        slug: 'fake-dataset_17',
        connectorType: 'rest',
        provider: 'worldbank',
        userId: '1a10d7c6e0a37126611fd7a7',
        updatedAt: '2018-06-01T11:04:47.231Z',
        createdAt: '2018-06-01T11:04:47.231Z',
        legend: {
            nested: [],
            country: [],
            region: [],
            date: []
        },
        taskId: null,
        'protected': false,
        geoInfo: false,
        env: 'production',
        sandbox: false,
        published: true,
        errorMessage: null,
        verified: false,
        overwrite: false,
        status: 'pending',
        tableName: 'fake-dataset-name',
        connectorUrl: null,
        attributesPath: null,
        dataPath: null,
        application: 'data4sdgs',
        type: null,
        _id: '55866e83-9aea-44e5-94fc-44866e83b052',
        id: '55866e83-9aea-44e5-94fc-44866e83b052',
        connector_url: null,
        attributes_path: null,
        data_path: null,
        table_name: 'fake-dataset-name'
    },
    userId: '1a10d7c6e0a37126611fd7a7',
    loggedUser: {
        id: 'microservice'
    }
};

const RW_API_DATASET_RESPONSE = {
    data: {
        id: '03a8da41-d8d0-4095-8fd5-267a25d5fc31',
        type: 'dataset',
        attributes: {
            name: 'GDP per capita (current US$)',
            slug: 'GDP-per-capita-current-USdollar-1490086842131',
            type: null,
            subtitle: null,
            application: [
                'data4sdgs'
            ],
            dataPath: null,
            attributesPath: null,
            connectorType: 'document',
            provider: 'csv',
            userId: '58333dcfd9f39b189ca44c75',
            connectorUrl: 'http://staging-api.globalforestwatch.org:8080/world_bank/GDP%20per%20capita%20(current%20US%24).csv',
            tableName: 'index_03a8da41d8d040958fd5267a25d5fc31',
            status: 'saved',
            published: true,
            overwrite: false,
            verified: false,
            blockchain: {},
            mainDateField: null,
            env: 'production',
            geoInfo: false,
            'protected': false,
            legend: {
                date: [],
                region: [],
                country: [],
                nested: []
            },
            clonedHost: {},
            errorMessage: null,
            taskId: null,
            updatedAt: '2017-01-19T10:34:32.524Z',
            widgetRelevantProps: [],
            layerRelevantProps: []
        }
    }
};

const RW_API_METADATA_RESPONSE = {
    data: [
        {
            id: '588217d53d81e10b00e6a59f',
            type: 'metadata',
            attributes: {
                dataset: '03a8da41-d8d0-4095-8fd5-267a25d5fc31',
                application: 'data4sdgs',
                resource: {
                    type: 'rw',
                    id: '03a8da41-d8d0-4095-8fd5-267a25d5fc31'
                },
                language: 'es',
                name: 'Name for RW in Spanish',
                description: 'GDP per capita is gross domestic product divided by midyear population. GDP is the sum of gross value added by all resident producers in the economy plus any product taxes and minus any subsidies not included in the value of the products. It is calculated without making deductions for depreciation of fabricated assets or for depletion and degradation of natural resources. Data are in current U.S. dollars.',
                source: 'World Bank national accounts data, and OECD National Accounts data files.',
                license: 'Open',
                info: {
                    dataDownload: 'http://api.worldbank.org/v2/en/indicator/NY.GDP.PCAP.CD?downloadformat=csv',
                    organization: 'World Bank Group'
                },
                createdAt: '2017-01-20T13:59:49.788Z',
                updatedAt: '2017-01-20T13:59:49.788Z',
                status: 'published'
            }
        },
        {
            id: '588217d53d81e10b00e6a59f',
            type: 'metadata',
            attributes: {
                dataset: '03a8da41-d8d0-4095-8fd5-267a25d5fc31',
                application: 'aqueduct',
                resource: {
                    type: 'dataset',
                    id: '03a8da41-d8d0-4095-8fd5-267a25d5fc31'
                },
                language: 'es',
                name: 'Name for Aqueduct in Spanish',
                description: 'GDP per capita is gross domestic product divided by midyear population. GDP is the sum of gross value added by all resident producers in the economy plus any product taxes and minus any subsidies not included in the value of the products. It is calculated without making deductions for depreciation of fabricated assets or for depletion and degradation of natural resources. Data are in current U.S. dollars.',
                source: 'World Bank national accounts data, and OECD National Accounts data files.',
                license: 'Open',
                info: {
                    dataDownload: 'http://api.worldbank.org/v2/en/indicator/NY.GDP.PCAP.CD?downloadformat=csv',
                    organization: 'World Bank Group'
                },
                createdAt: '2017-01-20T13:59:49.788Z',
                updatedAt: '2017-01-20T13:59:49.788Z',
                status: 'published'
            }
        },
        {
            id: '588217d53d81e10b00e6a59f',
            type: 'metadata',
            attributes: {
                dataset: '03a8da41-d8d0-4095-8fd5-267a25d5fc31',
                application: 'aqueduct',
                resource: {
                    type: 'dataset',
                    id: '03a8da41-d8d0-4095-8fd5-267a25d5fc31'
                },
                language: 'en',
                name: 'Name for Aqueduct in English',
                description: 'GDP per capita is gross domestic product divided by midyear population. GDP is the sum of gross value added by all resident producers in the economy plus any product taxes and minus any subsidies not included in the value of the products. It is calculated without making deductions for depreciation of fabricated assets or for depletion and degradation of natural resources. Data are in current U.S. dollars.',
                source: 'World Bank national accounts data, and OECD National Accounts data files.',
                license: 'Open',
                info: {
                    dataDownload: 'http://api.worldbank.org/v2/en/indicator/NY.GDP.PCAP.CD?downloadformat=csv',
                    organization: 'World Bank Group'
                },
                createdAt: '2017-01-20T13:59:49.788Z',
                updatedAt: '2017-01-20T13:59:49.788Z',
                status: 'published'
            }
        },
        {
            id: '588217d53d81e10b00e6a59f',
            type: 'metadata',
            attributes: {
                dataset: '03a8da41-d8d0-4095-8fd5-267a25d5fc31',
                application: 'rw',
                resource: {
                    type: 'dataset',
                    id: '03a8da41-d8d0-4095-8fd5-267a25d5fc31'
                },
                language: 'en',
                name: 'Name for RW in English',
                description: 'GDP per capita is gross domestic product divided by midyear population. GDP is the sum of gross value added by all resident producers in the economy plus any product taxes and minus any subsidies not included in the value of the products. It is calculated without making deductions for depreciation of fabricated assets or for depletion and degradation of natural resources. Data are in current U.S. dollars.',
                source: 'World Bank national accounts data, and OECD National Accounts data files.',
                license: 'Open',
                info: {
                    dataDownload: 'http://api.worldbank.org/v2/en/indicator/NY.GDP.PCAP.CD?downloadformat=csv',
                    organization: 'World Bank Group'
                },
                createdAt: '2017-01-20T13:59:49.788Z',
                updatedAt: '2017-01-20T13:59:49.788Z',
                status: 'published'
            }
        },
        {
            id: '588217d53d81e10b00e6a59f',
            type: 'metadata',
            attributes: {
                dataset: '03a8da41-d8d0-4095-8fd5-267a25d5fc31',
                application: 'gfw',
                resource: {
                    type: 'dataset',
                    id: '03a8da41-d8d0-4095-8fd5-267a25d5fc31'
                },
                language: 'en',
                name: 'Name for GFW in English',
                description: 'GDP per capita is gross domestic product divided by midyear population. GDP is the sum of gross value added by all resident producers in the economy plus any product taxes and minus any subsidies not included in the value of the products. It is calculated without making deductions for depreciation of fabricated assets or for depletion and degradation of natural resources. Data are in current U.S. dollars.',
                source: 'World Bank national accounts data, and OECD National Accounts data files.',
                license: 'Open',
                info: {
                    dataDownload: 'http://api.worldbank.org/v2/en/indicator/NY.GDP.PCAP.CD?downloadformat=csv',
                    organization: 'World Bank Group'
                },
                createdAt: '2017-01-20T13:59:49.788Z',
                updatedAt: '2017-01-20T13:59:49.788Z',
                status: 'published'
            }
        },
        {
            id: '588217d53d81e10b00e6a59f',
            type: 'metadata',
            attributes: {
                dataset: '03a8da41-d8d0-4095-8fd5-267a25d5fc31',
                application: 'prep',
                resource: {
                    type: 'dataset',
                    id: '03a8da41-d8d0-4095-8fd5-267a25d5fc31'
                },
                language: 'en',
                name: 'Name for PREP in English',
                description: 'GDP per capita is gross domestic product divided by midyear population. GDP is the sum of gross value added by all resident producers in the economy plus any product taxes and minus any subsidies not included in the value of the products. It is calculated without making deductions for depreciation of fabricated assets or for depletion and degradation of natural resources. Data are in current U.S. dollars.',
                source: 'World Bank national accounts data, and OECD National Accounts data files.',
                license: 'Open',
                info: {
                    dataDownload: 'http://api.worldbank.org/v2/en/indicator/NY.GDP.PCAP.CD?downloadformat=csv',
                    organization: 'World Bank Group'
                },
                createdAt: '2017-01-20T13:59:49.788Z',
                updatedAt: '2017-01-20T13:59:49.788Z',
                status: 'published'
            }
        }
    ]
};

module.exports = {
    ROLES,
    RW_API_DATASET_RESPONSE,
    RW_API_METADATA_RESPONSE,
    RW_DATASET_CREATE_REQUEST,
    RW_FAKE_DATASET_CREATE_REQUEST
};
