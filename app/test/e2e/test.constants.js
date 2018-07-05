const ROLES = {
    USER: {
        id: '1a10d7c6e0a37126611fd7a7',
        role: 'USER',
        provider: 'local',
        email: 'user@control-tower.org',
        extraUserData: {
            apps: [
                'un',
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
                'un',
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
                'un',
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

const UN_DATASET_CREATE_REQUEST = {
    connector: {
        __v: 0,
        name: 'fake un dataset',
        slug: 'fake-un-dataset',
        connectorType: 'rest',
        provider: 'un',
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
        tableName: 'fake-un-dataset-name',
        connectorUrl: null,
        attributesPath: null,
        dataPath: null,
        application: 'data4sdgs',
        type: null,
        _id: '47e9a243-9aea-44e5-94fc-44866e83a7b0',
        id: '47e9a243-9aea-44e5-94fc-44866e83a7b0',
        connector_url: null,
        attributes_path: null,
        data_path: null,
        table_name: 'fake-un-dataset-name'
    },
    userId: '1a10d7c6e0a37126611fd7a7',
    loggedUser: {
        id: 'microservice'
    }
};

const UN_API_DATASET_RESPONSE = {
    size: 1,
    totalElements: 2923,
    totalPages: 2923,
    pageNumber: 1,
    attributes: [
        {
            id: 'Nature',
            codes: [
                {
                    code: 'NA',
                    description: 'Not Available',
                    sdmx: 'NA'
                }
            ]
        },
        {
            id: 'UnitMultiplier',
            codes: [
                {
                    code: 'MILLION',
                    description: 'Millions',
                    sdmx: '6'
                }
            ]
        }
    ],
    dimensions: [
        {
            id: 'Units',
            codes: [
                {
                    code: 'CON_USD',
                    description: 'Constant USD',
                    sdmx: 'CON_USD'
                }
            ]
        }
    ],
    data: [
        {
            goal: [
                '6'
            ],
            target: [
                '6.a'
            ],
            indicator: [
                '6.a.1'
            ],
            series: 'DC_TOF_WASHL',
            seriesDescription: 'Total official development assistance (gross disbursement) for water supply and sanitation, by recipient countries (millions of constant 2016 United States dollars)',
            seriesCount: '2923',
            geoAreaCode: '4',
            geoAreaName: 'Afghanistan',
            timePeriodStart: 2000,
            value: '4.2785',
            valueType: 'Float',
            time_detail: null,
            source: 'Creditor Reporting System (CRS) database, 2018, The Organisation for Economic Co-operation and Development (OECD)',
            footnotes: [
                'Commitments; Based on OECD, CRS databased, 2018; Constant 2016 USD million'
            ],
            attributes: {
                Nature: 'NA',
                UnitMultiplier: 'MILLION'
            },
            dimensions: {
                Units: 'CON_USD'
            }
        }
    ]
};

const UN_API_DATASET_RESPONSE_NO_DATA = {
    size: 1,
    totalElements: 0,
    totalPages: 0,
    pageNumber: 1,
    attributes: [
        {
            id: 'Nature',
            codes: [
                {
                    code: 'E',
                    description: 'Estimated',
                    sdmx: 'E'
                }
            ]
        },
        {
            id: 'UnitMultiplier',
            codes: [
                {
                    code: 'UNIT',
                    description: 'Units',
                    sdmx: '0'
                }
            ]
        }
    ],
    dimensions: [
        {
            id: 'Age',
            codes: [
                {
                    code: 'ALLAGE',
                    description: 'All age ranges or no breaks by age',
                    sdmx: '000_099_Y'
                }
            ]
        },
        {
            id: 'Bounds',
            codes: [
                {
                    code: 'MP',
                    description: 'P',
                    sdmx: 'P'
                }
            ]
        },
        {
            id: 'Freq',
            codes: [
                {
                    code: 'ANNUAL',
                    description: 'Annual',
                    sdmx: 'A'
                }
            ]
        },
        {
            id: 'Location',
            codes: [
                {
                    code: 'ALLAREA',
                    description: 'All areas',
                    sdmx: 'T'
                }
            ]
        },
        {
            id: 'Sex',
            codes: [
                {
                    code: 'BOTHSEX',
                    description: 'Both',
                    sdmx: 'T'
                }
            ]
        },
        {
            id: 'Units',
            codes: [
                {
                    code: 'INDEX',
                    description: 'Index',
                    sdmx: 'INDEX'
                }
            ]
        }
    ],
    data: []
};

const UN_FAKE_DATASET_CREATE_REQUEST = {
    connector: {
        __v: 0,
        name: 'Fake dataset',
        slug: 'fake-dataset_17',
        connectorType: 'rest',
        provider: 'un',
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

module.exports = {
    ROLES,
    UN_DATASET_CREATE_REQUEST,
    UN_API_DATASET_RESPONSE,
    UN_API_DATASET_RESPONSE_NO_DATA,
    UN_FAKE_DATASET_CREATE_REQUEST
};
