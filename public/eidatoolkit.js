var LOG;
var service_context = 0;

/**
 * Secure is decalared for processing connection on secure layer or not --vishal
 */
var secure;

/**
 * ErrorCodes.
 * This object defines Toolkit error codes
 */
var ErrorCodes = {
    SERVICE_COMMUNICATION_ERROR: 301,
    SERVICE_BUSY: 302,
    INVALID_FIELD: 303,
};

/**
 * ExceptionType.
 * This object defines Toolkit error types
 */
var ExceptionType = {
    TOOLKIT_ERROR: "TOOLKIT_ERROR",
    CARD_PIN_ERROR: "CARD_PIN_ERROR",
};

/**
 * FingerIndexses
 * This object defines finger indexes
 *
 */
this.FINGER_INDEXS = {
    NONE: 0,
    NO_MEANING: 3,
    RIGHT_THUMB: 5,
    RIGHT_INDEX: 9,
    RIGHT_MIDDLE: 13,
    RIGHT_RING: 17,
    RIGHT_LITTLE: 21,
    LEFT_THUMB: 6,
    LEFT_INDEX: 10,
    LEFT_MIDDLE: 14,
    LEFT_RING: 18,
    LEFT_LITTLE: 22,
};

var services;

/**
 * Class ToolkitException.
 * This class defines exception details
 */
function ToolkitException(code, message, errorType, attemptsLeft) {
    this.code;
    this.message;
    this.errorType;
    this.attemptsLeft;
}

/**
 * Class ModifiablePublicData.
 * This class defines ModifiablePublicData fields
 */
function ModifiablePublicData(xmlModifiableDataBody) {
    this.occupationCode = xmlModifiableDataBody.OccupationCode;
    this.occupationArabic = xmlModifiableDataBody.OccupationArabic;
    this.occupationEnglish = xmlModifiableDataBody.OccupationEnglish;
    this.familyID = xmlModifiableDataBody.FamilyId;
    this.occupationTypeArabic = xmlModifiableDataBody.OccupationTypeArabic;
    this.occupationTypeEnglish = xmlModifiableDataBody.OccupationTypeEnglish;
    this.occupationFieldCode = xmlModifiableDataBody.OccupationFieldCode;
    this.companyNameArabic = xmlModifiableDataBody.CompanyNameArabic;
    this.companyNameEnglish = xmlModifiableDataBody.CompanyNameEnglish;
    this.maritalStatusCode = xmlModifiableDataBody.MaritalStatusCode;
    this.husbandIdNumber = xmlModifiableDataBody.HusbandIdNumber;
    this.sponsorTypeCode = xmlModifiableDataBody.SponsorTypeCode;
    this.sponsorUnifiedNumber = xmlModifiableDataBody.SponsorUnifiedNumber;
    this.sponsorName = xmlModifiableDataBody.SponsorName;
    this.residencyTypeCode = xmlModifiableDataBody.ResidencyTypeCode;
    this.residencyNumber = xmlModifiableDataBody.ResidencyNumber;
    this.residencyExpiryDate = xmlModifiableDataBody.ResidencyExpiryDate;
    this.passportNumber = xmlModifiableDataBody.PassportNumber;
    this.passportTypeCode = xmlModifiableDataBody.PassportTypeCode;
    this.passportCountryCode = xmlModifiableDataBody.PassportCountryCode;
    this.passportCountryArabic = xmlModifiableDataBody.PassportCountryArabic;
    this.passportCountryEnglish = xmlModifiableDataBody.PassportCountryEnglish;
    this.passportIssueDate = xmlModifiableDataBody.PassportIssueDate;
    this.passportExpiryDate = xmlModifiableDataBody.PassportExpiryDate;
    this.qualificationLevelCode = xmlModifiableDataBody.QualificationLevelCode;
    this.qualificationLevelArabic =
        xmlModifiableDataBody.QualificationLevelArabic;
    this.qualificationLevelEnglish =
        xmlModifiableDataBody.QualificationLevelEnglish;
    this.degreeDescriptionArabic =
        xmlModifiableDataBody.DegreeDescriptionArabic;
    this.degreeDescriptionEnglish =
        xmlModifiableDataBody.DegreeDescriptionEnglish;
    this.fieldOfStudyArabic = xmlModifiableDataBody.FieldOfStudyArabic;
    this.fieldOfStudyEnglish = xmlModifiableDataBody.FieldOfStudyEnglish;
    this.fieldOfStudyCode = xmlModifiableDataBody.FieldOfStudyCode;
    this.placeOfStudyArabic = xmlModifiableDataBody.PlaceOfStudyArabic;
    this.placeOfStudyEnglish = xmlModifiableDataBody.PlaceOfStudyEnglish;
    this.dateOfGraduation = xmlModifiableDataBody.DateOfGraduation;
    this.motherFullNameArabic = xmlModifiableDataBody.MotherFullNameArabic;
    this.motherFullNameEnglish = xmlModifiableDataBody.MotherFullNameEnglish;
}

/**
 * Class NonModifiablePublicData.
 * This class defines NonModifiablePublicData fields
 */
function NonModifiablePublicData(xmlNonModifiableDataBody) {
    this.iDType = xmlNonModifiableDataBody.IdType;
    this.gender = xmlNonModifiableDataBody.Gender;
    this.dateOfBirth = xmlNonModifiableDataBody.DateOfBirth;
    this.issueDate = xmlNonModifiableDataBody.IssueDate;
    this.expiryDate = xmlNonModifiableDataBody.ExpiryDate;
    this.titleArabic = xmlNonModifiableDataBody.TitleArabic;
    this.titleEnglish = xmlNonModifiableDataBody.TitleEnglish;
    this.fullNameArabic = xmlNonModifiableDataBody.FullNameArabic;
    this.fullNameEnglish = xmlNonModifiableDataBody.FullNameEnglish;
    this.nationalityArabic = xmlNonModifiableDataBody.NationalityArabic;
    this.nationalityEnglish = xmlNonModifiableDataBody.NationalityEnglish;
    this.nationalityCode = xmlNonModifiableDataBody.NationalityCode;
    this.placeOfBirthArabic = xmlNonModifiableDataBody.PlaceOfBirthArabic;
    this.placeOfBirthEnglish = xmlNonModifiableDataBody.PlaceOfBirthEnglish;
}

/**
 * Class HomeAddress.
 * This class defines HomeAddress fields
 */
function HomeAddress(xmlHomeAddressBody) {
    if (!xmlHomeAddressBody) {
        return null;
    }

    this.addressTypeCode = xmlHomeAddressBody.AddressTypeCode;
    this.flatNo = xmlHomeAddressBody.FlatNo;
    this.buildingNameArabic = xmlHomeAddressBody.BuildingNameArabic;
    this.buildingNameEnglish = xmlHomeAddressBody.BuildingNameEnglish;
    this.streetArabic = xmlHomeAddressBody.StreetArabic;
    this.streetEnglish = xmlHomeAddressBody.StreetEnglish;
    this.locationCode = xmlHomeAddressBody.LocationCode;
    this.areaCode = xmlHomeAddressBody.AreaCode;
    this.areaDescArabic = xmlHomeAddressBody.AreaDescArabic;
    this.areaDescEnglish = xmlHomeAddressBody.AreaDescEnglish;
    this.emiratesCode = xmlHomeAddressBody.EmiratesCode;
    this.pOBOX = xmlHomeAddressBody.POBOX;
    this.cityCode = xmlHomeAddressBody.CityCode;
    this.cityDescArabic = xmlHomeAddressBody.CityDescArabic;
    this.cityDescEnglish = xmlHomeAddressBody.CityDescEnglish;
    this.emiratesDescArabic = xmlHomeAddressBody.EmiratesDescArabic;
    this.emiratesDescEnglish = xmlHomeAddressBody.EmiratesDescEnglish;
    this.email = xmlHomeAddressBody.Email;
    this.residentPhoneNumber = xmlHomeAddressBody.ResidentPhoneNumber;
    this.mobilePhoneNumber = xmlHomeAddressBody.MobilePhoneNumber;
}

/**
 * Class WorkAddress.
 * This class defines WorkAddress fields
 */
function WorkAddress(xmlWorkAddressBody) {
    if (!xmlWorkAddressBody) {
        return null;
    }

    this.addressTypeCode = xmlWorkAddressBody.AddressTypeCode;
    this.locationCode = xmlWorkAddressBody.LocationCode;
    this.companyNameArabic = xmlWorkAddressBody.CompanyNameArabic;
    this.companyNameEnglish = xmlWorkAddressBody.CompanyNameEnglish;
    this.emiratesCode = xmlWorkAddressBody.EmiratesCode;
    this.emiratesDescArabic = xmlWorkAddressBody.EmiratesDescArabic;
    this.emiratesDescEnglish = xmlWorkAddressBody.EmiratesDescEnglish;
    this.cityCode = xmlWorkAddressBody.CityCode;
    this.cityDescArabic = xmlWorkAddressBody.CityDescArabic;
    this.cityDescEnglish = xmlWorkAddressBody.CityDescEnglish;
    this.pOBOX = xmlWorkAddressBody.POBOX;
    this.streetArabic = xmlWorkAddressBody.StreetArabic;
    this.streetEnglish = xmlWorkAddressBody.StreetEnglish;
    this.areaCode = xmlWorkAddressBody.AreaCode;
    this.areaDescArabic = xmlWorkAddressBody.AreaDescArabic;
    this.areaDescEnglish = xmlWorkAddressBody.AreaDescEnglish;
    this.buildingNameArabic = xmlWorkAddressBody.BuildingNameArabic;
    this.buildingNameEnglish = xmlWorkAddressBody.BuildingNameEnglish;
    this.landPhoneNumber = xmlWorkAddressBody.LandPhoneNumber;
    this.mobilePhoneNumber = xmlWorkAddressBody.MobilePhoneNumber;
    this.email = xmlWorkAddressBody.Email;
}

/**
 * Class Wife.
 * This class defines Wife fields
 */
function Wife(wifeData) {
    this.wifeIDN = wifeData.WifeIdNumber;
    this.fullNameArabic = wifeData.FullNameArabic;
    this.fullNameEnglish = wifeData.FullNameEnglish;
    this.nationalityCode = wifeData.NationalityCode;
    this.nationalityArabic = wifeData.NationalityArabic;
    this.nationalityEnglish = wifeData.NationalityEnglish;
}

/**
 * Class Resources.
 * This class defines Health Data Resources fields.
 */
function Resource(resourceData) {
    this.ResourceType = resourceData.resourceType;
    if ("Allergy" === this.ResourceType) {
        this.resourceType = resourceData.resourceType;
        this.allergyDisplay = resourceData.AllergyDisplay;
        this.allergyRecordedDate = resourceData.AllergyRecordedDate;
    } else if ("Diagnosis" === this.ResourceType) {
        this.resourceType = resourceData.resourceType;
        this.diagnosisCode = resourceData.DiagnosisCode;
        this.diagnosisDescription = resourceData.DiagnosisDescription;
        this.diagnosisRecordedDate = resourceData.DiagnosisRecordedDate;
    } else if ("BloodGroup" === this.ResourceType) {
        this.resourceType = resourceData.resourceType;
        this.bloodGroup = resourceData.BloodGroup;
        this.recordedDate = resourceData.RecordedDate;
    } else if ("Insurance" === this.ResourceType) {
        this.resourceType = this.ResourceType;
        this.insuranceName = resourceData.InsuranceName;
        this.insuranceNumber = resourceData.InsuranceNumber;
        this.insuranceValidityStartDate =
            resourceData.InsuranceValidityStartDate;
        this.insuranceValidityEndDate = resourceData.InsuranceValidityEndDate;
    }
}

function OrganDonar(response) {
    this.organDonar = response;
}

/**
 * Class Child.
 * This class defines Child fields
 */
function Child(childData) {
    this.childIdNumber = childData.ChildIdNumber;
    this.firstNameArabic = childData.FirstNameArabic;
    this.firstNameEnglish = childData.FirstNameEnglish;
    this.gender = childData.Gender;
    this.dateOfBirth = childData.DateOfBirth;
    this.placeOfBirthArabic = childData.PlaceOfBirthArabic;
    this.placeOfBirthEnglish = childData.PlaceOfBirthEnglish;
    this.motherIdNumber = childData.MotherIdNumber;
    this.motherFullNameArabic = childData.MotherFullNameArabic;
    this.motherFullNameEnglish = childData.MotherFullNameEnglish;
}

/**
 * Class HeadOfFamily.
 * This class defines HeadOfFamily fields
 */
function HeadOfFamily(headData) {
    this.holderIDNumber = headData.HolderIdNumber;
    this.familyID = headData.FamilyId;
    this.emirateNameArabic = headData.EmirateNameArabic;
    this.emirateNameEnglish = headData.EmirateNameEnglish;
    this.firstNameArabic = headData.FirstNameArabic;
    this.firstNameEnglish = headData.FirstNameEnglish;
    this.fatherNameArabic = headData.FatherNameArabic;
    this.fatherNameEnglish = headData.FatherNameEnglish;
    this.grandFatherNameArabic = headData.GrandFatherNameArabic;
    this.grandFatherNameEnglish = headData.GrandFatherNameEnglish;
    this.tribeArabic = headData.TribeArabic;
    this.tribeEnglish = headData.TribeEnglish;
    this.clanArabic = headData.ClanArabic;
    this.clanEnglish = headData.ClanEnglish;
    this.nationalityCode = headData.NationalityCode;
    this.nationalityArabic = headData.NationalityArabic;
    this.nationalityEnglish = headData.NationalityEnglish;
    this.gender = headData.Gender;
    this.dateOfBirth = headData.DateOfBirth;
    this.placeOfBirthArabic = headData.PlaceOfBirthArabic;
    this.placeOfBirthEnglish = headData.PlaceOfBirthEnglish;
    this.motherFullNameArabic = headData.MotherFullNameArabic;
    this.motherFullNameEnglish = headData.MotherFullNameEnglish;
}

/**
 * Class Toolkit.
 * This class provides all methods required to access the Toolkit services
 */
function Toolkit(onOpenCB, onCloseCB, onErrorCB, options) {
    this.appOnOpenCB = onOpenCB;
    this.appOnCloseCB = onCloseCB;
    this.appOnErrorCB = onErrorCB;
    this.config_params = btoa(options.toolkitConfig || "");
    LOG = options.debugEnabled ? console.log.bind(console) : function () {};

    /**depending on agent mode assigning request on ws or wss --vishal */
    secure = options.agent_tls_enabled ? "wss://" : "ws://";

    var toolkitThis = this;
    var toolkitOnOpenCB = function (responseEvent) {
        LOG("Toolkit :: toolkitOnOpenCB() :: >>");
        services.ESTABLISH_CONTEXT.config_params = toolkitThis.config_params;
        var user_Agent = (navigator.sayswho = (function () {
            var N = navigator.appName,
                ua = navigator.userAgent,
                tem,
                M = ua.match(
                    /(opera|chrome|safari|firefox|msie)\/?\s*([\d\.]+)/i
                );
            if (M && (tem = ua.match(/version\/([\.\d]+)/i)) != null)
                M[2] = tem[1];
            M = M ? [M[1], M[2]] : [N, navigator.appVersion, "-?"];
            return M.join(" ");
        })());

        if (null == user_Agent) {
            services.SendRequest(
                JSON.stringify(services.ESTABLISH_CONTEXT),
                wsOnContextEstablishedCB,
                toolkitThis.appOnOpenCB
            );
        } else {
            services.ESTABLISH_CONTEXT.user_agent = user_Agent;
            services.SendRequest(
                JSON.stringify(services.ESTABLISH_CONTEXT),
                wsOnContextEstablishedCB,
                toolkitThis.appOnOpenCB
            );
        }
    };

    var toolkitOnCloseCB = function (responseEvent) {
        LOG("Toolkit :: toolkitOnCloseCB() :: >>");
        toolkitThis.appOnCloseCB(responseEvent.code);
    };

    var toolkitOnErrorCB = function (responseEvent) {
        LOG("Toolkit :: toolkitOnErrorCB() :: >>");
        toolkitThis.appOnErrorCB(responseEvent);
    };

    services = new ToolkitService(
        toolkitOnOpenCB,
        toolkitOnCloseCB,
        toolkitOnErrorCB,
        options
    );
    var initialize = function (configParams) {
        LOG("Toolkit :: initialize() :: >>");
        // if (null == configParams || undefined == configParams) {
        //     throw "config options not provided.";
        // }

        configParams = configParams || "";
        LOG("configParams =" + configParams);
        this.config_params = configParams;
        services.establishConnection();
    };

    this.listReaders = function (appCallBack) {
        LOG("Toolkit :: listReaders() :: >>");
        services.LIST_READER_REQUEST.service_context = window.service_context;
        services.SendRequest(
            JSON.stringify(services.LIST_READER_REQUEST),
            toolkitListReaderCB,
            appCallBack
        );
    };

    this.registerDevice = function (
        encodedUserId,
        encodedPassword,
        deviceReferenceId,
        appCallBack
    ) {
        LOG("Toolkit :: registerDevice() :: >>");
        services.REGISTER_DEVICE.service_context = window.service_context;
        services.REGISTER_DEVICE.user_id = encodedUserId;
        services.REGISTER_DEVICE.password = encodedPassword;
        services.REGISTER_DEVICE.device_reference_id = deviceReferenceId;
        var validate = ValidateParams(services.REGISTER_DEVICE, appCallBack);

        if (validate) {
            services.SendRequest(
                JSON.stringify(services.REGISTER_DEVICE),
                toolkitRegisterDeviceCB,
                appCallBack
            );
        }
    };

    this.prepareRequest = function (requestId, appCallBack) {
        LOG("Toolkit :: prepareRequest() :: >>");
        services.PREPARE_REQUEST.service_context = window.service_context;
        services.PREPARE_REQUEST.card_context = 0;
        services.PREPARE_REQUEST.request_id = requestId;
        var validate = ValidateParams(services.PREPARE_REQUEST, appCallBack);
        if (validate) {
            services.SendRequest(
                JSON.stringify(services.PREPARE_REQUEST),
                toolkitPrepareRequestCB,
                appCallBack
            );
        }
    };

    var toolkitPrepareRequestCB = function (appCB, responseEvent) {
        LOG("Toolkit :: toolkitPrepareRequestCB() :: >>");
        try {
            var parsor = new ToolkitResponse(responseEvent);
            var response = parsor.response;
            LOG(
                "Toolkit :: toolkitPrepareRequestCB() :: 1 :: response =" +
                    response
            );
            appCB(response, null);
        } catch (error) {
            LOG("Toolkit :: toolkitPrepareRequestCB() :: Error ");
            appCB(null, error);
        }
    };

    var toolkitRegisterDeviceCB = function (appCallback, responseEvent) {
        LOG("Toolkit :: toolkitRegisterDeviceCB() :: >>");
        try {
            var registerDevResponse = new RegisterDeviceResponse(responseEvent);
            appCallback(registerDevResponse, null);
        } catch (error) {
            LOG("Toolkit :: toolkitRegisterDeviceCB() :: Error ");
            appCallback(null, error);
        }
    };

    var wsOnContextEstablishedCB = function (appCallback, response) {
        LOG("Toolkit :: wsOnContextEstablishedCB() :: >>");
        var result = JSON.parse(response.data);
        LOG(
            "Toolkit :: wsOnContextEstablishedCB() :: 1 :: response status =" +
                result.status
        );

        if ("fail" === result.status) {
            var error = new ToolkitException(
                result.error || ErrorCodes.SERVICE_COMMUNICATION_ERROR,
                result.description,
                ExceptionType.TOOLKIT_ERROR,
                null
            );
            appCallback(null, error);
        }

        if ("success" === result.status) {
            service_context = result.service_context;
            /**
             * Execute the on open callback by passing the response received
             * from server
             */
            appCallback(result.status, null);
        }
    };

    var toolkitListReaderCB = function (appCallBack, responseEvent) {
        LOG("Toolkit :: toolkitListReaderCB() :: >>");
        try {
            var parsor = new ToolkitResponse(responseEvent);
            var result = JSON.parse(responseEvent.data);
            var filterData = result.smartcard_readers;
            LOG(
                "Toolkit :: toolkitListReaderCB() :: 1 :: reader names =" +
                    filterData
            );

            var listArray =
                filterData.indexOf(",") > -1
                    ? filterData.split(",")
                    : filterData;
            var cardReaders = [];
            for (let i = 0; i < listArray.length; i++) {
                var cardRead = new CardReader(listArray[i]);
                cardReaders.push(cardRead);
            }

            var readerArray = cardReaders;
            appCallBack(readerArray, null);
        } catch (error) {
            LOG("Toolkit :: toolkitListReaderCB() :: Error ");
            appCallBack(null, error);
        }
    };

    this.getToolkitVersion = function (appCallBack) {
        LOG("Toolkit :: getToolkitVersion() :: >>");
        services.GET_TOOLKIT_VERSION.service_context = window.service_context;
        services.SendRequest(
            JSON.stringify(services.GET_TOOLKIT_VERSION),
            toolkitVersionCB,
            appCallBack
        );
    };

    var toolkitVersionCB = function (appCB, responseEvent) {
        LOG("Toolkit :: toolkitVersionCB() :: >>");
        var result = JSON.parse(responseEvent.data);
        LOG(
            "Toolkit :: toolkitVersionCB() :: 1 :: response status =" +
                result.status
        );

        if ("fail" === result.status) {
            var error = new ToolkitException(
                result.error,
                result.description,
                ExceptionType.TOOLKIT_ERROR,
                null
            );
            appCB(null, error);
        } else {
            result =
                result.etc_major +
                "." +
                result.etc_minor +
                "." +
                result.etc_patch;
            appCB(result, null);
        }
    };

    this.getReaderWithEmiratesId = function (appCallBack) {
        LOG("Toolkit :: getReaderWithEmiratesId() :: >>");
        services.GET_READER_WITH_EID.service_context = service_context;
        services.SendRequest(
            JSON.stringify(services.GET_READER_WITH_EID),
            getReaderWithEmiratesIdCB,
            appCallBack
        );
    };

    var getReaderWithEmiratesIdCB = function (appCallBack, responseEvent) {
        LOG("Toolkit :: getReaderWithEmiratesIdCB() :: >>");
        try {
            var parsor = new ToolkitResponse(responseEvent);
            LOG(
                "Toolkit :: getReaderWithEmiratesIdCB() :: 3 : parsor =" +
                    parsor
            );

            var result = JSON.parse(responseEvent.data);
            LOG(
                "Toolkit :: getReaderWithEmiratesIdCB() :: 1 :: reader name =" +
                    result.smartcard_reader
            );

            var readerName = result.smartcard_reader;
            var readerSerialNumber = null;
            if (1 === result.serial_number_status)
                readerSerialNumber = result.reader_serial_number;
            var reader = new CardReader(readerName, readerSerialNumber);
            appCallBack(reader, null);
        } catch (error) {
            LOG("Toolkit :: getReaderWithEmiratesIdCB() :: Error =");
            appCallBack(null, error);
        }
    };

    this.getDeviceId = function (appCallBack) {
        LOG("CardReader :: getDeviceId() :: >>");
        services.GET_DEVICE_ID.service_context = window.service_context;
        var validate = ValidateParams(services.GET_DEVICE_ID, appCallBack);
        if (validate) {
            services.SendRequest(
                JSON.stringify(services.GET_DEVICE_ID),
                toolkitDeviceIdCB,
                appCallBack
            );
        }
    };

    this.parseMRZ = function (MRZString, appCallBack) {
        LOG("CardReader :: parseMRZ() :: >>");
        services.PARSEMRZ.service_context = window.service_context;
        services.PARSEMRZ.mrz = MRZString;
        var validate = ValidateParams(services.PARSEMRZ, appCallBack);
        if (validate) {
            var response = services.SendRequest(
                JSON.stringify(services.PARSEMRZ),
                parseMRZCB,
                appCallBack
            );
        }
    };

    var parseMRZCB = function (appCB, responseEvent) {
        LOG("CardReader :: PARSEMRZCB() :: >>");
        try {
            var parsor = new ToolkitResponse(responseEvent);
            appCB(parsor, null);
        } catch (error) {
            LOG("CardReader :: PARSEMRZCB() :: Error ");
            appCB(null, error);
        }
    };

    var toolkitDeviceIdCB = function (appCB, responseEvent) {
        LOG("CardReader :: toolkitDeviceIdCB() :: >>");
        try {
            var parsor = new ToolkitResponse(responseEvent);
            parsor = JSON.parse(responseEvent.data);
            appCB(parsor.device_id, null);
        } catch (error) {
            LOG("CardReader :: toolkitDeviceIdCB() :: Error ");
            appCB(null, error);
        }
    };

    this.getDataProtectionKey = function (appCallBack) {
        services.DATA_PROTECTION_REQUEST.service_context =
            window.service_context;
        services.SendRequest(
            JSON.stringify(services.DATA_PROTECTION_REQUEST),
            getDataProtectionKeyCB,
            appCallBack
        );
    };

    var getDataProtectionKeyCB = function (appCB, responseEvent) {
        LOG("CardReader :: getDataProtectionKeyCB() :: >>");
        try {
            var parsor = new DataProtectionKey(responseEvent);
            appCB(parsor, null);
        } catch (error) {
            LOG("CardReader :: getDataProtectionKeyCB() :: Error ");
            appCB(null, error);
        }
    };

    this.getLicenseExpiryDate = function (appCallBack) {
        services.LICENSEEXPIRAYDATE.service_context = window.service_context;
        services.SendRequest(
            JSON.stringify(services.LICENSEEXPIRAYDATE),
            getLicenseExpiryDateCB,
            appCallBack
        );
    };

    var getLicenseExpiryDateCB = function (appCB, responseEvent) {
        LOG("getLicenseExpiryDateCB() :: >>");
        try {
            var parsor = new ToolkitResponse(responseEvent);
            appCB(parsor, null);
        } catch (error) {
            LOG("getLicenseExpiryDateCB() :: Error ");
            appCB(null, error);
        }
    };

    this.getConfigFilesExpiryDates = function (appCallBack) {
        services.configCertExpiryDate.service_context = window.service_context;
        services.SendRequest(
            JSON.stringify(services.configCertExpiryDate),
            getConfigFilesExpiryDatesCB,
            appCallBack
        );
    };

    var getConfigFilesExpiryDatesCB = function (appCB, responseEvent) {
        LOG("getConfigFilesExpiryDatesCB() :: >>");
        try {
            var parsor = new ToolkitResponse(responseEvent);
            appCB(parsor, null);
        } catch (error) {
            LOG("getConfigFilesExpiryDatesCB() :: Error ");
            appCB(null, error);
        }
    };

    this.getverifyToolkitResponse = function (
        toolkitResponse,
        certDataPath,
        certChainDataPath,
        callBack
    ) {
        services.VerifyToolkitResponse.response = btoa(toolkitResponse);
        services.VerifyToolkitResponse.service_context = window.service_context;
        services.VerifyToolkitResponse.cert_data = null;
        services.VerifyToolkitResponse.chain_data = null;
        services.VerifyToolkitResponse.chain_validation = false;

        if (
            services.VerifyToolkitResponse.cert_data != "" &&
            services.VerifyToolkitResponse.cert_data != null
        ) {
            services.VerifyToolkitResponse.is_valid_cert_data = 1;
        } else {
            services.VerifyToolkitResponse.is_valid_cert_data = 0;
        }

        if (
            services.VerifyToolkitResponse.chain_data != "" &&
            services.VerifyToolkitResponse.chain_data != null
        ) {
            services.VerifyToolkitResponse.chain_validation = 1;
        } else {
            services.VerifyToolkitResponse.chain_validation = 0;
        }

        if (services.VerifyToolkitResponse.cert_data === null) {
            delete services.VerifyToolkitResponse.cert_data;
        }
        if (services.VerifyToolkitResponse.chain_data === null) {
            delete services.VerifyToolkitResponse.chain_data;
        }

        services.SendRequest(
            JSON.stringify(services.VerifyToolkitResponse),
            verifyToolkitResponseCB,
            callBack
        );
    };

    var verifyToolkitResponseCB = function (appCB, responseEvent) {
        LOG("verifyToolkitResponseCB() :: >>");
        try {
            var parsor = new ToolkitResponse(responseEvent);
            appCB(parsor, null);
        } catch (error) {
            LOG("verifyToolkitResponseCB() :: Error ");
            appCB(null, error);
        }
    };

    this.cleanup = function () {
        LOG("Toolkit :: cleanup() :: >>");
        services.CLEANUP_CONTEXT.service_context = window.service_context;
        services.SendRequest(
            JSON.stringify(services.CLEANUP_CONTEXT),
            services.cleanup,
            this.appOnCloseCB
        );
    };

    try {
        initialize(options.toolkitConfig);
    } catch (error) {
        onErrorCB(error);
    }
}

/**
 * Class ToolkitService
 * This class defines methods and constants used in toolkit service communication
 */
function ToolkitService(onOpenCB, onCloseCB, onErrorCB, options) {
    /* set the call backs */
    this.onOpenCB = onOpenCB;
    this.onCloseCB = onCloseCB;
    this.onErrorCB = onErrorCB;
    this.jnlp_address = options["jnlp_address"];

    var DEFAULT_URLS;
    LOG(
        "ToolkitService :: 1 : options.agent_host_name =" +
            options.agent_host_name
    );

    /* Use agent host name if provided */
    if (options.agent_tls_enabled) {
        /* default ports for secured communication */
        if (
            options.agent_host_name != undefined &&
            options.agent_host_name != ""
        ) {
            DEFAULT_URLS = [
                options.agent_host_name + ":9004",
                options.agent_host_name + ":9005",
                options.agent_host_name + ":9020",
            ];
        } else {
            DEFAULT_URLS = [
                "toolkitagent.emiratesid.ae:9004",
                "toolkitagent.emiratesid.ae:9005",
                "toolkitagent.emiratesid.ae:9020",
            ];
        }
    } else {
        /* default ports for un-secured communication */
        DEFAULT_URLS = ["127.0.0.1:9004", "127.0.0.1:9005", "127.0.0.1:9020"];
    }

    LOG("ToolkitService :: 2 : DEFAULT_URLS =" + DEFAULT_URLS);
    this.CONFIRM_TEXT_WINDOWS =
        "ICA agent is not running. Please install ICA agent and try again. To install ICA agent click OK.";

    /*     Request format for list reader command */
    this.LIST_READER_REQUEST = {
        cmd: 3,
        service_context: "",
    };

    /*  Request format for connect reader command */
    this.CONNECT_READER = {
        cmd: 4,
        service_context: "",
        smartcard_reader: "",
    };

    /*   Request format for disconnect reader command*/
    this.DISCONNECT_REQUEST = {
        cmd: 5,
        service_context: "",
        card_context: "",
    };

    /*  Request format
     for register device command */
    this.REGISTER_DEVICE = {
        cmd: 35,
        service_context: "",
        user_id: "",
        password: "",
        device_reference_id: "",
    };

    /* Request format to read public data command */
    this.PUBLIC_DATA_REQUEST = {
        cmd: 6,
        service_context: "",
        card_context: "",
        read_photography: "",
        read_non_modifiable_data: "",
        read_modifiable_data: "",
        request_id: "",
        signature_image: "",
        address: "",
    };

    /*  Request format to read family book data command */
    this.FAMILY_BOOK_DATA_REQUEST = {
        cmd: 22,
        service_context: "",
        pin: "",
    };

    /* Request format for read check card status command */
    this.CHECK_CARD_STATUS_REQUEST = {
        cmd: 8,
        service_context: "",
        request_id: "",
        card_context: "",
    };

    /* Request format for get finger index command */
    this.GET_FINGER_INDEX = {
        cmd: 9,
        service_context: "",
        card_context: "",
    };

    /* Request format for verify biometric command */
    this.VERIFY_BIOMETRIC = {
        cmd: 10,
        service_context: "",
        finger_index: "",
        sensor_timeout: "",
        request_id: "",
        card_context: "",
    };

    /* Request format for Pin reset command */
    this.PIN_RESET = {
        cmd: 13,
        service_context: "",
        pin: "",
        finger_index: "",
        sensor_timeout: "",
        ref_data_id: "",
    };

    this.PIN_RESET_WITHOUT_BIO = {
        cmd: 53,
        pin: "",
        service_context: "",
    };

    /* Request format for MatchOnCard command */
    this.MATCH_ON_CARD = {
        cmd: 11,
        service_context: "",
        finger_index: "",
        sensor_timeout: "",
        ref_data_id: "",
        card_context: "",
    };

    /* Request format for reading certificate */
    this.READ_CERTIFICATE = {
        cmd: 7,
        service_context: "",
        card_context: "",
        pin: "",
    };

    /* Request format for PKI Auth command */
    this.AUTHENTICATE_PKI = {
        cmd: 15,
        service_context: "",
        pin: "",
    };

    /* Request format for sign data command */
    this.SIGN_DATA = {
        cmd: 16,
        service_context: "",
        data: "",
        pin: "",
        data_hash: "",
    };

    /*  Request format for sign challenge command */
    this.SIGN_CHALLENGE = {
        cmd: 32,
        card_context: "",
        service_context: "",
        data: "",
        pin: "",
        data_hash: "",
    };

    /*  Request format for verify signature data command */
    this.VERIFY_SIGNATURE = {
        cmd: 17,
        service_context: "",
        data: "",
        cert_data: "",
        signature: "",
        data_hash: "",
    };

    /*  Request format for establish context command */
    this.ESTABLISH_CONTEXT = {
        cmd: 1,
        config_params: "",
    };

    /*  Request format for clean up context command */
    this.CLEANUP_CONTEXT = {
        cmd: 2,
        service_context: "",
    };

    /*  Request format for Unblock PIN command */
    this.UNBLOCK_PIN = {
        cmd: 25,
        service_context: "",
        pin: "",
        finger_index: "",
        ref_data_id: "",
        sensor_timeout: "",
    };

    /* Request format for Card Genuine command */
    this.CARD_GENUINE = {
        cmd: 24,
        request_id: "",
        service_context: "",
        card_context: "",
    };

    /* Request format for Device Id command */
    this.GET_DEVICE_ID = {
        cmd: 38,
        service_context: "",
    };

    this.SIGN_XADES = {
        cmd: 26,
        input_path: "",
        output_path: "",
        signature_level: "",
        packaging_mode: "",
        user_pin: "",
        tsa_url: "",
        ocsp_url: "",
        cert_path: "",
        country_code: "",
        locality: "",
        postal_code: "",
        state_or_province: "",
        street: "",
        service_context: "",
    };

    this.VERIFY_XADES = {
        cmd: 27,
        input_path: "",
        ocsp_url: "",
        cert_path: "",
        report_type: "",
        sign_data: "",
        deattached: "",
        service_context: "",
    };

    this.SIGN_PADES = {
        cmd: 28,
        input_path: "",
        output_path: "",
        signature_level: "",
        packaging_mode: "",
        user_pin: "",
        tsa_url: "",
        ocsp_url: "",
        cert_path: "",
        country_code: "",
        locality: "",
        postal_code: "",
        state_or_province: "",
        street: "",
        sign_reason: "",
        signer_location: "",
        signer_contact_info: "",
        signature_xaxis: "",
        signature_yaxis: "",
        signature_image: "",
        background_color: "",
        font_color: "",
        font_name: "",
        font_size: "",
        signature_text: "",
        sign_visible: "",
        name_position: "",
        page_number: "",
        service_context: "",
    };

    this.VERIFY_PADES = {
        cmd: 29,
        input_path: "",
        ocsp_url: "",
        cert_path: "",
        report_type: "",
        deattached: "",
        service_context: "",
    };

    this.SIGN_CADES = {
        cmd: 30,
        input_path: "",
        signature_level: "",
        packaging_mode: "",
        user_pin: "",
        tsa_url: "",
        ocsp_url: "",
        cert_path: "",
        country_code: "",
        locality: "",
        postal_code: "",
        state_or_province: "",
        street: "",
        service_context: "",
    };

    this.VERIFY_CADES = {
        cmd: 31,
        input_path: "",
        report_type: "",
        ocsp_url: "",
        cert_path: "",
        sign_data: "",
        service_context: "",
        deattached: "",
    };

    this.READ_FAMILY_BOOK = {
        cmd: 22,
        service_context: "",
        pin: "",
    };

    /*  Request format for getting Toolkit Version command */
    this.GET_TOOLKIT_VERSION = {
        cmd: 33,
        service_context: "",
    };

    /* Request format for getting reader name having EID card command */
    this.GET_READER_WITH_EID = {
        cmd: 54,
        service_context: "",
    };

    /* Request  for getting Interface */
    this.GET_INTERFACE = {
        cmd: 19,
        card_context: "",
        service_context: "",
    };

    /*Request for NFC Parmas*/
    this.SET_NFC_PARAMS = {
        cmd: 18,
        card_context: "",
        service_context: "",
        cardnumber: "",
        dob: "",
        expirydate: "",
        mrz: "",
    };

    /*Request for NFC Parmas*/
    /* Request format for Prepare Request command */
    this.PREPARE_REQUEST = {
        cmd: 36,
        card_context: "",
        service_context: "",
        request_id: "",
    };

    /*Request for DataProtection Key */
    this.DATA_PROTECTION_REQUEST = {
        cmd: 44,
        service_context: "",
    };

    this.PARSEMRZ = {
        cmd: 46,
        mrz: "",
        service_context: "",
    };

    this.VERIFY_BIOMETRIC_CARD = {
        cmd: 47,
        service_context: "",
        finger_index: "",
        sensor_timeout: "",
        request_id: "",
        card_context: "",
    };

    this.DATA_EF_TYPE = {
        cmd: 48,
        public_data_ef_type: "",
        service_context: "",
        card_context: "",
    };

    this.PARSE_EF_DATA = {
        cmd: 55,
        service_context: "",
        ef_data: "",
    };

    this.CSN = {
        cmd: 20,
        card_context: "",
        service_context: "",
    };

    this.CardVersion = {
        cmd: 21,
        card_context: "",
        service_context: "",
    };

    this.LICENSEEXPIRAYDATE = {
        cmd: 49,
        service_context: "",
    };

    this.READDATA = {
        cmd: 52,
        card_context: "",
        service_context: "",
        request_id: "",
        file_type: "",
    };

    this.UPDATEDATA = {
        cmd: 50,
        card_context: "",
        service_context: "",
        request_id: "",
        file_type: "",
    };

    this.configCertExpiryDate = {
        cmd: 51,
        service_context: "",
    };

    this.VerifyToolkitResponse = {
        cmd: 45,
        response: "",
        cert_data: "",
        chain_data: "",
        is_valid_cert_data: "",
        chain_validation: "",
    };

    var webSocket = null;
    var isWSConnected = false;
    var initializingWsIndex = -1;
    var wsUrl = "";
    var webSocketProtocol = "eida-toolkit";
    this.readerContext = null;
    this.onMessageCB = null;
    var self = this;

    var callbackParams = {
        cmd: "",
        sequence: "",
        appCallBack: null,
        toolkitCB: null,
    };

    var sequenceCounter = 0;
    var isRequestPending = false;

    /**
     * This function is to download agent by using web start. Agent will be
     * downloaded only for the windows machines.
     */
    var downloadAgent = function () {
        LOG("ToolkitService :: downloadAgent() :: >>");

        /*  get the device type */
        var deviceType = checkDeviceType();
        LOG(
            "ToolkitService :: downloadAgent() :: 1 :: deviceType =" +
                deviceType
        );

        /*
         * If device is a windows machine then send a request to download agent
         * service by using web start
         */
        if ("Windows" === deviceType) {
            hideLoader();
            var result = confirm(self.CONFIRM_TEXT_WINDOWS);
            if (true == result) {
                displayProgress(
                    "Agent is not running, web socket initializaion failed, run downloaded JNLP file ..."
                );
                displayProgress(
                    "After agent starts, refresh and initialize ..."
                );
                window.location.href = self.jnlp_address;
            } else {
                /* execute the error call back */
                displayProgress("You have canceled to download agent ...");
                self.onErrorCB("Web socket connection failed.");
            }
        }

        /*
         * If device is a Linux machine then send a request to download agent
         * service by using web start
         */
        if ("Linux" === deviceType) {
            hideLoader();
            var result = confirm(self.CONFIRM_TEXT_WINDOWS);
            if (true == result) {
                displayProgress(
                    "Agent is not running, web socket initializaion failed, run downloaded JNLP file ..."
                );
                displayProgress(
                    "After agent starts, refresh and initialize ..."
                );
                window.location.href = self.jnlp_address;
            } else {
                /* execute the error call back */
                displayProgress("You have canceled to download agent ...");
                self.onErrorCB("Web socket connection failed.");
            }
        }

        /*
         * If device is a iOS machine then send a request to download agent
         * service by using web start
         */
        if ("iOS" === deviceType) {
            hideLoader();
            var result = confirm(self.CONFIRM_TEXT_WINDOWS);
            if (true == result) {
                displayProgress(
                    "Agent is not running, web socket initializaion failed, run downloaded JNLP file ..."
                );
                displayProgress(
                    "After agent starts, refresh and initialize ..."
                );
                window.location.href = self.jnlp_address;
            } else {
                /* execute the error call back */
                displayProgress("You have canceled to download agent ...");
                self.onErrorCB("Web socket connection failed.");
            }
        }

        LOG(
            "ToolkitService :: downloadAgent() :: 2 :: Failed to connect to service.."
        );
        return "-1";
    };

    /**
     * This method is to send request to server
     *
     * @param request
     * request to send to server
     */
    this.SendRequest = function (request, toolkitListReaderCB, appCallBack) {
        LOG("ToolkitService :: SendRequest() :: >>");
        LOG(
            "ToolkitService :: SendRequest() :: 1 :: isRequestPending =" +
                isRequestPending
        );

        if (!isRequestPending) {
            /*  return if webSocket connection is not opened. */
            if (
                webSocket === undefined ||
                webSocket.readyState === WebSocket.CLOSED
            ) {
                return "webSocket connection is not open";
            }

            /* send the message only if webSocket connection is open */
            if (webSocket.readyState === WebSocket.OPEN) {
                /**
                 * Assign callBack to onMessageCB object so that it can be
                 * called by onMessage handler once response is received from
                 * server.
                 */
                request = JSON.parse(request);
                sequenceCounter = sequenceCounter + 1;
                request.sequence = sequenceCounter;
                callbackParams.cmd = request.cmd;
                callbackParams.sequence = request.sequence;
                callbackParams.appCallBack = appCallBack;
                callbackParams.toolkitCB = toolkitListReaderCB;
                request = JSON.stringify(request);
                LOG(
                    "ToolkitService :: SendRequest() :: 2 :: request =" +
                        request
                );

                isRequestPending = true;

                /*  send the request to server */
                webSocket.send(request);
                return "";
            }

            var error = new ToolkitException(
                ErrorCodes.SERVICE_COMMUNICATION_ERROR,
                "Service communication failed..",
                ExceptionType.TOOLKIT_ERROR,
                null
            );

            appCallBack(null, error);
        } else {
            var error = new ToolkitException(
                ErrorCodes.SERVICE_BUSY,
                "Preivious Request is already in progress..",
                ExceptionType.TOOLKIT_ERROR,
                null
            );

            appCallBack(null, error);
        }
    };

    /**
     * find the device type by checking userAgent
     */
    var checkDeviceType = function () {
        var ua = navigator.userAgent;
        LOG("s ua =" + ua);
        if (ua.match(/(iPhone|iPod|iPad)/)) return "iPhone";

        if (ua.match(/BlackBerry/)) return "BlackBerry";

        if (ua.match(/Android/)) return "Android";

        if (ua.match(/Windows/)) return "Windows";

        if (ua.match(/Linux/)) return "Linux";
    };

    /**
     * This function initializes the new web socket connection only if
     * connection is not already initialized. Defines web socket listener
     * methods.
     */
    var initializeWS = function () {
        try {
            LOG("ToolkitService :: initializeWS() :: >>");
            LOG(
                "ToolkitService :: initializeWS() :: 1 :: trying to connect toolkit service on url =" +
                    wsUrl
            );

            /*  Ensures only one connection is open at a time */
            if (
                webSocket !== null &&
                webSocket !== undefined &&
                webSocket.readyState !== WebSocket.OPEN &&
                webSocket.readyState == WebSocket.OPEN
            ) {
                LOG(
                    "ToolkitService :: initializeWS() :: 2 :: WebSocket is already active..."
                );
                return "WebSocket is already active...";
            }

            /* Create a new instance of the webSocket */
            /** secure is assigned to url  --vishal*/
            webSocket = new WebSocket(secure + wsUrl, webSocketProtocol);

            /* onOpen listener used when connection is established with server */
            webSocket.onopen = function (event) {
                LOG(
                    "ToolkitService :: initializeWS() :: 3 :: WebSocket connected....."
                );

                /*  set flag to 'true' as web socket is connected and call the onOpen callback*/
                isWSConnected = true;
                self.onOpenCB(event);
            };

            /*  onMessage listener to handle request received from server */
            webSocket.onmessage = function (event) {
                LOG("ToolkitService :: initializeWS() :: onmessage() :: >>");

                /**
                 * Execute the on message callback by passing the response
                 * received from server
                 */
                processResponse(event);
            };

            /*  onClose listener to handle connection closed event */
            webSocket.onclose = function (event) {
                LOG("ToolkitService :: initializeWS() :: onclose() :: >>");
                LOG(
                    "ToolkitService :: initializeWS() :: onclose() :: 1 :: isWSConnected =" +
                        isWSConnected
                );

                if (false == isWSConnected && 1006 == event.code) {
                    self.establishConnection();
                    return;
                }

                /*  invoke call back only it is available */
                if (
                    true == isWSConnected &&
                    null !== self.onCloseCB &&
                    undefined !== self.onCloseCB
                ) {
                    LOG("ToolkitService :: initializeWS() :: onclose() :: 2 ");

                    /* reset all objects */
                    self.readerContext = null;
                    self.webSocket = null;
                    self.onMessageCB = null;
                    self.onErrorCB = null;
                    self.onOpenCB = null;
                    isWSConnected = false;
                    initializingWsIndex = -1;
                    wsUrl = "";

                    /**
                     * Execute the on close callback.
                     */
                    self.onCloseCB(event);
                    self.onCloseCB = null;
                }
            };

            /* onError listener to handle any errors in the communication*/
            webSocket.onerror = function (event) {
                LOG("ToolkitService :: initializeWS() :: onerror() :: >> ");
                LOG(
                    "ToolkitService :: initializeWS() :: onerror() :: 1 :: isWSConnected =" +
                        isWSConnected
                );

                /* invoke call back only it is available */
                if (
                    null !== self.onErrorCB &&
                    undefined !== self.onErrorCB &&
                    true == isWSConnected
                ) {
                    /**
                     * Execute the on error callback.
                     */
                    self.onErrorCB(
                        "Error in web socket connection..clossing web socket"
                    );
                }
            };
        } catch (e) {
            return "Webcomponent Initialization Failed, Details: " + e;
        }
        return "";
    };

    this.cleanup = function (appCallBack, responseEvent) {
        LOG("ToolkitService :: cleanup() >>");

        if (
            webSocket != null ||
            webSocket != undefined ||
            webSocket.readyState != WebSocket.CLOSED
        ) {
            webSocket.close();
        }
    };

    this.establishConnection = function () {
        LOG("ToolkitService :: establishConnection() >>");

        /**
         * set initializing flag to 'false'. This flag is used while attempting
         * to establish web socket connection on set of ports. Once web socket
         * connection is established, this flag will be set to 'true' in onOpen
         * handler.
         */
        isWSConnected = false;

        /*increment index by 1*/
        initializingWsIndex = initializingWsIndex + 1;
        wsUrl = DEFAULT_URLS[initializingWsIndex];
        LOG("s establishConnection() :: wsUrl =" + wsUrl);

        /**
         * wsUrl will be undefined when all the WS urls from predefined set of
         * WS urls are checked for connection and not able to connect to any WS
         * urls. Send request request to download toolkit agent as service is
         * not installed.
         */
        if (undefined == wsUrl) {
            initializingWsIndex = -1;
            LOG(
                "ToolkitService :: establishConnection() :: 1 :: Web socket connection failed ..."
            );
            downloadAgent();
            return "";
        }

        LOG("ToolkitService :: establishConnection() :: 2 ");
        var ret = initializeWS();
    };

    var processResponse = function (event) {
        LOG("ToolkitService :: processResponse() :: >>");
        LOG("ToolkitService :: processResponse() 1 ::" + event.data);
        var result = JSON.parse(event.data);
        LOG(
            "ToolkitService :: processResponse() :: 2 :: sequence id =" +
                result.sequence +
                " : callbackParams.sequence =" +
                callbackParams.sequence
        );

        isRequestPending = false;
        if (callbackParams.sequence == result.sequence) {
            if (undefined !== callbackParams.toolkitCB) {
                callbackParams.toolkitCB(callbackParams.appCallBack, event);
            }
        }
    };
}

function CardReader(readerName, readerSerialNumber) {
    this.readerName = readerName;
    this.readerSerialNumber = readerSerialNumber;
    readerContext = null;
    var connected = false;
    this.connect = function (appCallBack) {
        LOG("CardReader :: connect() :: >>");
        services.CONNECT_READER.smartcard_reader = this.readerName;
        services.CONNECT_READER.service_context = service_context;
        services.SendRequest(
            JSON.stringify(services.CONNECT_READER),
            toolkitConnectCB,
            appCallBack
        );
    };

    this.getReaderName = function () {
        return this.readerName;
    };

    this.getReaderSerialNumber = function () {
        return this.readerSerialNumber;
    };

    this.readPublicData = function (
        requestId,
        readNonModifiableData,
        readModifiableData,
        readPhotography,
        readSignatureImage,
        readAddress,
        appCallBack
    ) {
        LOG("CardReader :: readPublicData() :: >>");
        LOG("CardReader :: readPublicData() :: 1 :: connected =" + connected);
        if (!connected) {
            var error = new ToolkitException(
                ErrorCodes.READER_NOT_CONNECTED_ERROR,
                "Reader not connected..",
                ExceptionType.TOOLKIT_ERROR,
                null
            );
        }

        /*  send PUBLIC_DATA_REQUEST by specifying parameters	 */
        services.PUBLIC_DATA_REQUEST.service_context = window.service_context;
        services.PUBLIC_DATA_REQUEST.card_context = readerContext;
        services.PUBLIC_DATA_REQUEST.read_photography = readPhotography;
        services.PUBLIC_DATA_REQUEST.read_non_modifiable_data =
            readNonModifiableData;
        services.PUBLIC_DATA_REQUEST.read_modifiable_data = readModifiableData;
        services.PUBLIC_DATA_REQUEST.request_id = requestId;
        services.PUBLIC_DATA_REQUEST.signature_image = readSignatureImage;
        services.PUBLIC_DATA_REQUEST.address = readAddress;
        var validate = ValidateParams(
            services.PUBLIC_DATA_REQUEST,
            appCallBack
        );
        if (validate) {
            services.SendRequest(
                JSON.stringify(services.PUBLIC_DATA_REQUEST),
                toolkitPubDataCB,
                appCallBack
            );
        }
    };

    /**
     * This function is used to read public data from a reader having specified readerContext.
     * This function sends a read public data request to the server and executes
     * the callBack function once response is received from server.
     *
     *
     * @param readerContext reader context to read data from
     * @param refresh if true reads data from card else returns cached data
     * @param readPhotography if true then reads photo data
     * @param readNonModifiableData if true then reads non modifiable data
     * @param readModifiableData if true then reads modifiable data
     * @param signatureValidation if true then reads signature image data
     * @param callBack callBack function to be executed after response is received
     *  from server.
     *
     * Executes onErrorCB callback if any error occurred during communication
     * with server
     *
     */
    this.readFamilyBookData = function (encodedPin, appCallBack) {
        LOG("CardReader :: readFamilyBookData() :: >>");
        LOG(
            "CardReader :: readFamilyBookData() :: 1 :: connected =" + connected
        );
        if (!connected) {
            var error = new ToolkitException(
                ErrorCodes.READER_NOT_CONNECTED_ERROR,
                "Reader not connected..",
                ExceptionType.TOOLKIT_ERROR,
                null
            );
        }

        /*  send FAMILY_BOOK_DATA_REQUEST by specifying parameters	 */
        services.FAMILY_BOOK_DATA_REQUEST.service_context =
            window.service_context;
        services.FAMILY_BOOK_DATA_REQUEST.pin = encodedPin;
        var validate = ValidateParams(
            services.FAMILY_BOOK_DATA_REQUEST,
            appCallBack
        );

        if (validate) {
            services.SendRequest(
                JSON.stringify(services.FAMILY_BOOK_DATA_REQUEST),
                toolkitFamilyBookCB,
                appCallBack
            );
        }
    };

    var toolkitFamilyBookCB = function (appCB, responseEvent) {
        LOG("CardReader :: toolkitFamilyBookCB() :: >>");
        try {
            var parsor = new CardFamilyBookData(responseEvent);
            appCB(parsor, null);
        } catch (error) {
            LOG("CardReader :: toolkitFamilyBookCB() :: Error ");
            appCB(null, error);
        }
    };

    this.getInterfaceType = function (appCallBack) {
        LOG("CardReader :: getInterfaceType() :: >>");
        LOG("CardReader :: getInterfaceType() :: 1 :: connected =" + connected);
        if (!connected) {
            var error = new ToolkitException(
                ErrorCodes.READER_NOT_CONNECTED_ERROR,
                "Reader not connected..",
                ExceptionType.TOOLKIT_ERROR,
                null
            );
        }

        /*  send FAMILY_BOOK_DATA_REQUEST by specifying parameters	 */
        services.GET_INTERFACE.service_context = window.service_context;
        services.GET_INTERFACE.card_context = window.readerContext;
        var validate = ValidateParams(services.GET_INTERFACE, appCallBack);
        if (validate) {
            services.SendRequest(
                JSON.stringify(services.GET_INTERFACE),
                toolkitgetInterfaceTypeCB,
                appCallBack
            );
        }
    };

    var toolkitgetInterfaceTypeCB = function (appCB, responseEvent) {
        LOG("CardReader :: toolkitInterfaceCB() :: >>");
        try {
            var parsor = new ToolkitResponse(responseEvent);
            parsor = JSON.parse(responseEvent.data);
            appCB(parsor.interface_type, null);
        } catch (error) {
            LOG("CardReader :: toolkitInterfaceCB() :: Error ");
            appCB(null, error);
        }
    };

    this.getPkiCertificates = function (encodedPin, appCallBack) {
        LOG("CardReader :: getPkiCertificates() :: >>");
        LOG(
            "CardReader :: getPkiCertificates() :: 1 :: connected =" + connected
        );
        if (!connected) {
            var error = new ToolkitException(
                ErrorCodes.READER_NOT_CONNECTED_ERROR,
                "Reader not connected..",
                ExceptionType.TOOLKIT_ERROR,
                null
            );
        }

        /*  send READ_CERTIFICATE by specifying parameters */
        services.READ_CERTIFICATE.service_context = window.service_context;
        services.READ_CERTIFICATE.card_context = readerContext;
        services.READ_CERTIFICATE.pin = encodedPin;
        var validate = ValidateParams(services.READ_CERTIFICATE, appCallBack);
        if (validate) {
            services.SendRequest(
                JSON.stringify(services.READ_CERTIFICATE),
                toolkitReadCertCB,
                appCallBack
            );
        }
    };

    var toolkitReadCertCB = function (appCB, responseEvent) {
        LOG("CardReader :: toolkitReadCertCB() :: >>");
        try {
            var certificates = new CardCertificates(responseEvent);
            appCB(certificates, null);
        } catch (error) {
            LOG("CardReader :: toolkitReadCertCB() :: Error ");
            appCB(null, error);
        }
    };

    this.checkCardStatus = function (requestId, appCallBack) {
        LOG("CardReader :: checkCardStatus() :: >>");
        LOG("CardReader :: checkCardStatus() :: 1 :: connected =" + connected);
        if (!connected) {
            var error = new ToolkitException(
                ErrorCodes.READER_NOT_CONNECTED_ERROR,
                "Reader not connected..",
                ExceptionType.TOOLKIT_ERROR,
                null
            );
        }

        /*   send CHECK_CARD_STATUS_REQUEST by specifying parameters	 */
        services.CHECK_CARD_STATUS_REQUEST.card_context = readerContext;
        services.CHECK_CARD_STATUS_REQUEST.service_context =
            window.service_context;
        services.CHECK_CARD_STATUS_REQUEST.request_id = requestId;
        var validate = ValidateParams(
            services.CHECK_CARD_STATUS_REQUEST,
            appCallBack
        );

        if (validate) {
            services.SendRequest(
                JSON.stringify(services.CHECK_CARD_STATUS_REQUEST),
                toolkitCardStatusCB,
                appCallBack
            );
        }
    };

    var toolkitCardStatusCB = function (appCB, responseEvent) {
        LOG("CardReader :: toolkitCardStatusCB() :: >>");
        try {
            var parsor = new ToolkitResponse(responseEvent);
            appCB(parsor, null);
        } catch (error) {
            LOG("CardReader :: toolkitCardStatusCB() :: Error ");
            appCB(null, error);
        }
    };

    this.getFingerData = function (appCallBack) {
        LOG("CardReader :: getFingerData() :: >>");
        LOG("CardReader :: getFingerData() :: 1 :: connected =" + connected);
        if (!connected) {
            var error = new ToolkitException(
                ErrorCodes.READER_NOT_CONNECTED_ERROR,
                "Reader not connected..",
                ExceptionType.TOOLKIT_ERROR,
                null
            );
        }

        services.GET_FINGER_INDEX.service_context = window.service_context;
        services.GET_FINGER_INDEX.card_context = readerContext;
        services.SendRequest(
            JSON.stringify(services.GET_FINGER_INDEX),
            toolkitFingerIndexCB,
            appCallBack
        );
    };

    var toolkitFingerIndexCB = function (appCB, responseEvent) {
        LOG("CardReader :: toolkitFingerIndexCB() :: >>");
        var result = JSON.parse(responseEvent.data);
        try {
            var error = null;
            if ("fail" === result.status) {
                error = new ToolkitException(
                    result.error_code,
                    result.error_message,
                    ExceptionType.TOOLKIT_ERROR,
                    null
                );
                throw error;
            }

            if (
                null == result.first_finger_id ||
                undefined == result.first_finger_id ||
                null == result.first_finger_index ||
                undefined == result.first_finger_index ||
                null == result.second_finger_id ||
                undefined == result.second_finger_id ||
                null == result.second_finger_index ||
                undefined == result.second_finger_index
            ) {
                error = new ToolkitException(
                    ErrorCodes.INVALID_TOOLKIT_RESPONSE_XML,
                    "Invalid Toolkit Response XML Format. Element not found : Finger Data",
                    ExceptionType.TOOLKIT_ERROR,
                    null
                );
                throw error;
            }

            var fingerDataArray = [];
            var fingerObj = new FingerData(
                result.first_finger_id,
                result.first_finger_index
            );

            fingerDataArray.push(fingerObj);
            fingerObj = new FingerData(
                result.second_finger_id,
                result.second_finger_index
            );

            fingerDataArray.push(fingerObj);
            appCB(fingerDataArray, null);
        } catch (error) {
            LOG("CardReader :: toolkitFingerIndexCB() :: Error ");
            appCB(null, error);
        }
    };

    this.authenticateBiometricOnServer = function (
        requestId,
        fingerIndex,
        sensorTimeout,
        appCallBack
    ) {
        LOG("CardReader :: authenticateBiometricOnServer() :: >>");
        LOG(
            "CardReader :: authenticateBiometricOnServer() :: 1 :: connected =" +
                connected
        );
        if (!connected) {
            var error = new ToolkitException(
                ErrorCodes.READER_NOT_CONNECTED_ERROR,
                "Reader not connected..",
                ExceptionType.TOOLKIT_ERROR,
                null
            );
        }

        /*  send VERIFY_BIOMETRIC by specifying parameters */
        services.VERIFY_BIOMETRIC.service_context = window.service_context;
        services.VERIFY_BIOMETRIC.finger_index =
            self.FINGER_INDEXS[fingerIndex];
        services.VERIFY_BIOMETRIC.request_id = requestId;
        services.VERIFY_BIOMETRIC.sensor_timeout = sensorTimeout;
        services.VERIFY_BIOMETRIC.card_context = readerContext;
        var validate = ValidateParams(services.VERIFY_BIOMETRIC, appCallBack);
        if (validate) {
            services.SendRequest(
                JSON.stringify(services.VERIFY_BIOMETRIC),
                toolkitVerifyBioCB,
                appCallBack
            );
        }
    };

    var toolkitVerifyBioCB = function (appCB, responseEvent) {
        LOG("CardReader :: toolkitVerifyBioCB() :: >>");
        try {
            var parsor = new ToolkitResponse(responseEvent);
            appCB(parsor, null);
        } catch (error) {
            LOG("CardReader :: toolkitVerifyBioCB() :: Error ");
            appCB(null, error);
        }
    };

    this.authenticatePki = function (encodedPin, appCallBack) {
        LOG("CardReader :: authenticatePki() :: >>");
        LOG("CardReader :: authenticatePki() :: 1 :: connected =" + connected);
        if (!connected) {
            var error = new ToolkitException(
                ErrorCodes.READER_NOT_CONNECTED_ERROR,
                "Reader not connected..",
                ExceptionType.TOOLKIT_ERROR,
                null
            );
        }

        services.AUTHENTICATE_PKI.service_context = window.service_context;
        services.AUTHENTICATE_PKI.pin = encodedPin;
        var validate = ValidateParams(services.AUTHENTICATE_PKI, appCallBack);
        if (validate) {
            services.SendRequest(
                JSON.stringify(services.AUTHENTICATE_PKI),
                toolkitAuthPkiCB,
                appCallBack
            );
        }
    };

    var toolkitAuthPkiCB = function (appCB, responseEvent) {
        LOG("CardReader :: toolkitAuthPkiCB() :: >>");
        try {
            var parsor = new ToolkitResponse(responseEvent);
            appCB(parsor, null);
        } catch (error) {
            LOG("CardReader :: toolkitAuthPkiCB() :: Error ");
            appCB(null, error);
        }
    };

    this.signData = function (input, isInputHash, encodedPin, appCallBack) {
        LOG("CardReader :: signData() :: >>");
        LOG("CardReader :: signData() :: 1 :: connected =" + connected);
        if (!connected) {
            var error = new ToolkitException(
                ErrorCodes.READER_NOT_CONNECTED_ERROR,
                "Reader not connected..",
                ExceptionType.TOOLKIT_ERROR,
                null
            );
        }

        /*  send SIGN_DATA by specifying parameters */
        services.SIGN_DATA.service_context = window.service_context;
        services.SIGN_DATA.pin = encodedPin;
        services.SIGN_DATA.data = btoa(input);
        services.SIGN_DATA.data_hash = isInputHash;
        var validate = ValidateParams(services.SIGN_DATA, appCallBack);
        if (validate) {
            services.SendRequest(
                JSON.stringify(services.SIGN_DATA),
                toolkitSignDataCB,
                appCallBack
            );
        }
    };

    var toolkitSignDataCB = function (appCB, responseEvent) {
        LOG("CardReader :: toolkitSignDataCB() :: >>");
        try {
            var parsor = new SignatureResponse(responseEvent);
            appCB(parsor, null);
        } catch (error) {
            LOG("CardReader :: toolkitSignDataCB() :: Error ");
            appCB(null, error);
        }
    };

    this.verifySignature = function (
        input,
        isInputHash,
        signature,
        certificate,
        appCallBack
    ) {
        LOG("CardReader :: verifySignature() :: >>");
        LOG("CardReader :: verifySignature() :: 1 :: connected =" + connected);
        if (!connected) {
            var error = new ToolkitException(
                ErrorCodes.READER_NOT_CONNECTED_ERROR,
                "Reader not connected..",
                ExceptionType.TOOLKIT_ERROR,
                null
            );
        }

        /*  send VERIFY_SIGNATURE by specifying parameters */
        services.VERIFY_SIGNATURE.service_context = window.service_context;
        services.VERIFY_SIGNATURE.cert_data = certificate;
        services.VERIFY_SIGNATURE.data = btoa(input);
        services.VERIFY_SIGNATURE.data_hash = isInputHash;
        services.VERIFY_SIGNATURE.signature = signature;
        var validate = ValidateParams(services.VERIFY_SIGNATURE, appCallBack);
        if (validate) {
            services.SendRequest(
                JSON.stringify(services.VERIFY_SIGNATURE),
                toolkitVerifySignDataCB,
                appCallBack
            );
        }
    };

    var toolkitVerifySignDataCB = function (appCB, responseEvent) {
        LOG("CardReader :: toolkitVerifySignDataCB() :: >>");
        try {
            var parsor = new ToolkitResponse(responseEvent);
            appCB(parsor.status, null);
        } catch (error) {
            LOG("CardReader :: toolkitVerifySignDataCB() :: Error ");
            appCB(null, error);
        }
    };

    this.isCardGenuine = function (requestId, appCallBack) {
        LOG("CardReader :: isCardGenuine() :: >>");
        LOG("CardReader :: isCardGenuine() :: 1 :: connected =" + connected);
        if (!connected) {
            var error = new ToolkitException(
                ErrorCodes.READER_NOT_CONNECTED_ERROR,
                "Reader not connected..",
                ExceptionType.TOOLKIT_ERROR,
                null
            );
        }

        /*  send CARD_GENUINE by specifying parameters */
        services.CARD_GENUINE.service_context = window.service_context;
        services.CARD_GENUINE.request_id = requestId;
        services.CARD_GENUINE.card_context = readerContext;
        services.SendRequest(
            JSON.stringify(services.CARD_GENUINE),
            toolkitCardGenineCB,
            appCallBack
        );
    };

    var toolkitCardGenineCB = function (appCB, responseEvent) {
        LOG("CardReader :: toolkitCardGenineCB() :: >>");
        try {
            var parsor = new ToolkitResponse(responseEvent);
            appCB(parsor, null);
        } catch (error) {
            LOG("CardReader :: toolkitCardGenineCB() :: Error ");
            appCB(null, error);
        }
    };

    this.matchOnCard = function (
        requestId,
        fingerData,
        sensorTimeout,
        appCallBack
    ) {
        LOG("CardReader :: matchOnCard() :: >>");
        LOG("CardReader :: matchOnCard() :: 1 :: connected =" + connected);
        if (!connected) {
            var error = new ToolkitException(
                ErrorCodes.READER_NOT_CONNECTED_ERROR,
                "Reader not connected..",
                ExceptionType.TOOLKIT_ERROR,
                null
            );
        }

        /*  send MATCH_ON_CARD by specifying parameters */
        services.MATCH_ON_CARD.service_context = window.service_context;
        services.MATCH_ON_CARD.sensor_timeout = sensorTimeout;
        services.MATCH_ON_CARD.finger_index = parseInt(fingerData.getIndex());
        services.MATCH_ON_CARD.ref_data_id = fingerData.fingerId;
        services.MATCH_ON_CARD.card_context = readerContext;
        services.MATCH_ON_CARD.request_id = requestId;
        services.SendRequest(
            JSON.stringify(services.MATCH_ON_CARD),
            matchOnCardCB,
            appCallBack
        );
    };

    var matchOnCardCB = function (appCB, responseEvent) {
        LOG("CardReader :: matchOnCardCB() :: >>");
        try {
            var parsor = new ToolkitResponse(responseEvent);
            appCB(parsor, null);
        } catch (error) {
            LOG("CardReader :: matchOnCardCB() :: Error ");
            appCB(null, error);
        }
    };

    this.unblockPin = function (
        encodedPin,
        fingerData,
        sensorTimeout,
        appCallBack
    ) {
        LOG("CardReader :: unblockPin() :: >>");
        LOG("CardReader :: unblockPin() :: 1 :: connected =" + connected);
        if (!connected) {
            var error = new ToolkitException(
                ErrorCodes.READER_NOT_CONNECTED_ERROR,
                "Reader not connected..",
                ExceptionType.TOOLKIT_ERROR,
                null
            );
        }

        /*  send CARD_GENUINE by specifying parameters */
        services.UNBLOCK_PIN.service_context = window.service_context;
        services.UNBLOCK_PIN.pin = encodedPin;
        services.UNBLOCK_PIN.sensor_timeout = sensorTimeout;
        services.UNBLOCK_PIN.finger_index = parseInt(fingerData.getIndex());
        services.UNBLOCK_PIN.ref_data_id = fingerData.fingerId;
        var validate = ValidateParams(services.UNBLOCK_PIN, appCallBack);
        if (validate) {
            services.SendRequest(
                JSON.stringify(services.UNBLOCK_PIN),
                toolkitUnblockPinCB,
                appCallBack
            );
        }
    };

    var toolkitUnblockPinCB = function (appCB, responseEvent) {
        LOG("CardReader :: toolkitUnblockPinCB() :: >>");
        try {
            var parsor = new ToolkitResponse(responseEvent);
            appCB(parsor, null);
        } catch (error) {
            LOG("CardReader :: toolkitUnblockPinCB() :: Error ");
            appCB(null, error);
        }
    };

    this.xadesSign = function (
        signingContext,
        xmlFilePath,
        signedXmlFilePath,
        appCallBack
    ) {
        LOG("CardReader :: xadesSign() :: >>");
        LOG("CardReader :: xadesSign() :: 1 :: connected =" + connected);
        if (!connected) {
            var error = new ToolkitException(
                ErrorCodes.READER_NOT_CONNECTED_ERROR,
                "Reader not connected..",
                ExceptionType.TOOLKIT_ERROR,
                null
            );
        }

        /*  send CARD_GENUINE by specifying parameters */
        services.SIGN_XADES.input_path = btoa(xmlFilePath);
        services.SIGN_XADES.output_path = btoa(signedXmlFilePath);
        services.SIGN_XADES.signature_level = parseInt(
            signingContext.signatureLevel
        );

        services.SIGN_XADES.packaging_mode = parseInt(
            signingContext.packagingMode
        );

        services.SIGN_XADES.user_pin = signingContext.userPin;
        services.SIGN_XADES.tsa_url = btoa(signingContext.tsaUrl);
        services.SIGN_XADES.ocsp_url = btoa(signingContext.ocspUrl);
        services.SIGN_XADES.cert_path = btoa(signingContext.certPath);
        services.SIGN_XADES.country_code = signingContext.countryCode;
        services.SIGN_XADES.locality = signingContext.locality;
        services.SIGN_XADES.postal_code = signingContext.postalCode;
        services.SIGN_XADES.state_or_province = signingContext.stateOrProvince;
        services.SIGN_XADES.street = signingContext.street;
        services.SIGN_XADES.service_context = window.service_context;

        if (services.SIGN_XADES.packaging_mode != 3) {
            var validate = ValidateParams(services.SIGN_XADES, appCallBack);
        } else {
            validate = true;
        }

        if (validate) {
            services.SendRequest(
                JSON.stringify(services.SIGN_XADES),
                toolkitXadesSignCB,
                appCallBack
            );
        }
    };

    var toolkitXadesSignCB = function (appCB, responseEvent) {
        LOG("CardReader :: toolkitXadesSignCB() :: >>");
        try {
            var parsor = new ToolkitResponse(responseEvent);
            parsor = JSON.parse(responseEvent.data);
            if (parsor.sign_data === null || parsor.sign_data === undefined) {
                parsor.sign_data = "Success";
            }
            appCB(parsor, null);
        } catch (error) {
            LOG("CardReader :: toolkitXadesSignCB() :: Error ");
            appCB(null, error);
        }
    };

    this.xadesVerify = function (
        verificationContext,
        signedXmlFilePath,
        signature,
        appCallBack
    ) {
        LOG("CardReader :: xadesVerify() :: >>");
        LOG("CardReader :: xadesVerify() :: 1 :: connected =" + connected);
        if (!connected) {
            var error = new ToolkitException(
                ErrorCodes.READER_NOT_CONNECTED_ERROR,
                "Reader not connected..",
                ExceptionType.TOOLKIT_ERROR,
                null
            );
        }

        services.VERIFY_XADES.service_context = window.service_context;
        services.VERIFY_XADES.input_path = btoa(signedXmlFilePath);
        services.VERIFY_XADES.ocsp_url = btoa(verificationContext.ocspPath);
        services.VERIFY_XADES.cert_path = btoa(verificationContext.certPath);
        services.VERIFY_XADES.sign_data = signature;
        services.VERIFY_XADES.deattached = verificationContext.detachedValue;
        services.VERIFY_XADES.report_type = parseInt(
            verificationContext.report_type
        );

        if (verificationContext.detachedValue == 0) {
            var validate = true;
        } else {
            var validate = ValidateParams(services.VERIFY_XADES, appCallBack);
        }

        if (validate) {
            services.SendRequest(
                JSON.stringify(services.VERIFY_XADES),
                toolkitXadesVerifyCB,
                appCallBack
            );
        }
    };

    var toolkitXadesVerifyCB = function (appCB, responseEvent) {
        LOG("CardReader :: toolkitXadesVerifyCB() :: >>");
        try {
            var parsor = new ToolkitResponse(responseEvent);
            parsor = JSON.parse(responseEvent.data);
            if (
                parsor.verification_report === null ||
                parsor.verification_report === undefined
            ) {
                var error = {
                    message: "Verification report is empty",
                };
                throw error;
            }

            parsor.verification_report = atob(parsor.verification_report);
            appCB(parsor.verification_report, null);
        } catch (error) {
            LOG("CardReader :: toolkitXadesVerifyCB() :: Error ");
            appCB(null, error);
        }
    };

    this.padesSign = function (
        signingContext,
        pdfFilePath,
        signedPdfFilePath,
        appCallBack
    ) {
        LOG("CardReader :: padesSign() :: >>");
        LOG("CardReader :: padesSign() :: 1 :: connected =" + connected);
        if (!connected) {
            var error = new ToolkitException(
                ErrorCodes.READER_NOT_CONNECTED_ERROR,
                "Reader not connected..",
                ExceptionType.TOOLKIT_ERROR,
                null
            );
        }

        /*   send CARD_GENUINE by specifying parameters */
        services.SIGN_PADES.service_context = window.service_context;
        services.SIGN_PADES.input_path = btoa(pdfFilePath);
        services.SIGN_PADES.output_path = btoa(signedPdfFilePath);
        services.SIGN_PADES.signature_level = parseInt(
            signingContext.signatureLevel
        );

        services.SIGN_PADES.packaging_mode = parseInt(
            signingContext.packagingMode
        );

        services.SIGN_PADES.user_pin = signingContext.userPin;
        services.SIGN_PADES.tsa_url = btoa(signingContext.tsaUrl);
        services.SIGN_PADES.ocsp_url = btoa(signingContext.ocspUrl);
        services.SIGN_PADES.cert_path = btoa(signingContext.certPath);
        services.SIGN_PADES.country_code = signingContext.countryCode;
        services.SIGN_PADES.locality = signingContext.locality;
        services.SIGN_PADES.postal_code = signingContext.postalCode;
        services.SIGN_PADES.state_or_province = signingContext.stateOrProvince;
        services.SIGN_PADES.street = signingContext.street;
        services.SIGN_PADES.name_position = parseInt(
            signingContext.signNmPositionSelect
        );

        services.SIGN_PADES.sign_visible = parseInt(
            signingContext.sigVisibleSelect
        );

        services.SIGN_PADES.page_number = parseInt(
            signingContext.pgNumberTxtBx
        );

        services.SIGN_PADES.signature_text = signingContext.sigTextTxtBx;
        services.SIGN_PADES.font_size = parseInt(signingContext.fontSizeTxtBx);
        services.SIGN_PADES.font_color = signingContext.fontColorTxtBx;
        services.SIGN_PADES.font_name = signingContext.fontNameTxtBx;
        services.SIGN_PADES.background_color = signingContext.bgColorTxtBx;
        services.SIGN_PADES.signature_image = btoa(
            signingContext.sigImgPathTxtBx
        );

        services.SIGN_PADES.signature_yaxis = parseInt(
            signingContext.sigYaxisTxtBx
        );

        services.SIGN_PADES.signature_xaxis = parseInt(
            signingContext.sigXaxisTxtBx
        );

        services.SIGN_PADES.signer_contact_info =
            signingContext.signerContactInfoTxtBx;
        services.SIGN_PADES.signer_location =
            signingContext.signerLocationTxtBx;
        services.SIGN_PADES.sign_reason = signingContext.reasonSignTxtBx;
        var validate = ValidateParams(services.SIGN_PADES, appCallBack);
        if (validate) {
            services.SendRequest(
                JSON.stringify(services.SIGN_PADES),
                toolkitPadesSignCB,
                appCallBack
            );
        }
    };

    var toolkitPadesSignCB = function (appCB, responseEvent) {
        LOG("CardReader :: toolkitPadesSignCB() :: >>");
        try {
            var parsor = new ToolkitResponse(responseEvent);
            var parsor = JSON.parse(responseEvent.data);

            appCB(parsor, null);
        } catch (error) {
            LOG("CardReader :: toolkitPadesSignCB() :: Error ");
            appCB(null, error);
        }
    };

    this.padesVerify = function (
        verificationContext,
        signedPdfFilePath,
        appCallBack
    ) {
        LOG("CardReader :: padesVerify() :: >>");
        LOG("CardReader :: padesVerify() :: 1 :: connected =" + connected);
        if (!connected) {
            var error = new ToolkitException(
                ErrorCodes.READER_NOT_CONNECTED_ERROR,
                "Reader not connected..",
                ExceptionType.TOOLKIT_ERROR,
                null
            );
        }

        services.VERIFY_PADES.service_context = window.service_context;
        services.VERIFY_PADES.input_path = btoa(signedPdfFilePath);
        services.VERIFY_PADES.ocsp_url = btoa(verificationContext.ocspPath);
        services.VERIFY_PADES.cert_path = btoa(verificationContext.certPath);
        services.VERIFY_PADES.deattached = verificationContext.detachedValue;
        services.VERIFY_PADES.report_type = parseInt(
            verificationContext.report_type
        );
        var validate = ValidateParams(services.VERIFY_PADES, appCallBack);
        if (validate) {
            services.SendRequest(
                JSON.stringify(services.VERIFY_PADES),
                toolkitPadesVerifyCB,
                appCallBack
            );
        }
    };

    var toolkitPadesVerifyCB = function (appCB, responseEvent) {
        LOG("CardReader :: toolkitPadesVerifyCB() :: >>");
        try {
            var parsor = new ToolkitResponse(responseEvent);
            parsor = JSON.parse(responseEvent.data);
            if (
                parsor.verification_report === null ||
                parsor.verification_report === undefined
            ) {
                var error = {
                    message: "Verification report is empty",
                };
                throw error;
            }

            parsor.verification_report = atob(parsor.verification_report);
            appCB(parsor.verification_report, null);
        } catch (error) {
            LOG("CardReader :: toolkitPadesVerifyCB() :: Error ");
            appCB(null, error);
        }
    };

    this.cadesSign = function (signingContext, inputFilePath, appCallback) {
        LOG("CardReader :: cadesSign() :: >>");
        LOG("CardReader :: cadesSign() :: 1 :: connected =" + connected);
        if (!connected) {
            var error = new ToolkitException(
                ErrorCodes.READER_NOT_CONNECTED_ERROR,
                "Reader not connected..",
                ExceptionType.TOOLKIT_ERROR,
                null
            );
        }

        services.SIGN_CADES.input_path = btoa(inputFilePath);
        services.SIGN_CADES.signature_level = parseInt(
            signingContext.signatureLevel
        );

        services.SIGN_CADES.packaging_mode = parseInt(
            signingContext.packagingMode
        );

        services.SIGN_CADES.user_pin = signingContext.userPin;
        services.SIGN_CADES.tsa_url = btoa(signingContext.tsaUrl);
        services.SIGN_CADES.ocsp_url = btoa(signingContext.ocspUrl);
        services.SIGN_CADES.cert_path = btoa(signingContext.certPath);
        services.SIGN_CADES.country_code = signingContext.countryCode;
        services.SIGN_CADES.locality = signingContext.locality;
        services.SIGN_CADES.postal_code = signingContext.postalCode;
        services.SIGN_CADES.state_or_province = signingContext.stateOrProvince;
        services.SIGN_CADES.street = signingContext.street;
        services.SIGN_CADES.service_context = window.service_context;
        var validate = ValidateParams(services.SIGN_CADES, appCallback);
        if (validate) {
            services.SendRequest(
                JSON.stringify(services.SIGN_CADES),
                toolkitCadesSignCB,
                appCallback
            );
        }
    };

    var toolkitCadesSignCB = function (appCB, responseEvent) {
        LOG("CardReader :: toolkitCadesSignCB() :: >>");
        try {
            var parsor = new ToolkitResponse(responseEvent);
            var parsor = JSON.parse(responseEvent.data);
            appCB(parsor, null);
        } catch (error) {
            LOG("CardReader :: toolkitCadesSignCB() :: Error ");
            appCB(null, error);
        }
    };

    this.cadesVerify = function (
        verificationContext,
        inputFilePath,
        signature,
        appCallback
    ) {
        LOG("CardReader :: cadesVerify() :: >>");
        LOG("CardReader :: cadesVerify() :: 1 :: connected =" + connected);
        if (!connected) {
            var error = new ToolkitException(
                ErrorCodes.READER_NOT_CONNECTED_ERROR,
                "Reader not connected..",
                ExceptionType.TOOLKIT_ERROR,
                null
            );
        }

        services.VERIFY_CADES.service_context = window.service_context;
        services.VERIFY_CADES.input_path = btoa(inputFilePath);
        services.VERIFY_CADES.ocsp_url = btoa(verificationContext.ocspPath);
        services.VERIFY_CADES.cert_path = btoa(verificationContext.certPath);
        services.VERIFY_CADES.sign_data = signature;
        services.VERIFY_CADES.report_type = parseInt(
            verificationContext.report_type
        );

        services.VERIFY_CADES.deattached = 1;
        var validate = ValidateParams(services.VERIFY_CADES, appCallback);
        if (validate) {
            services.SendRequest(
                JSON.stringify(services.VERIFY_CADES),
                toolkitCadesVerifyCB,
                appCallback
            );
        }
    };

    var toolkitCadesVerifyCB = function (appCB, responseEvent) {
        LOG("CardReader :: toolkitCadesVerifyCB() :: >>");
        try {
            var parsor = new ToolkitResponse(responseEvent);
            parsor = JSON.parse(responseEvent.data);
            if (
                parsor.verification_report === null ||
                parsor.verification_report === undefined
            ) {
                var error = {
                    message: "Verification report is empty",
                };
                throw error;
            }

            parsor.verification_report = atob(parsor.verification_report);
            appCB(parsor.verification_report, null);
        } catch (error) {
            LOG("CardReader :: toolkitCadesVerifyCB() :: Error ");
            appCB(null, error);
        }
    };

    this.signChallenge = function (
        input,
        isInputHash,
        encodedPin,
        appCallBack
    ) {
        LOG("CardReader :: signChallenge() :: >>");
        LOG("CardReader :: signChallenge() :: 1 :: connected =" + connected);
        if (!connected) {
            var error = new ToolkitException(
                ErrorCodes.READER_NOT_CONNECTED_ERROR,
                "Reader not connected..",
                ExceptionType.TOOLKIT_ERROR,
                null
            );
        }

        /*  send SIGN_DATA by specifying parameters */
        services.SIGN_CHALLENGE.service_context = window.service_context;
        services.SIGN_CHALLENGE.pin = encodedPin;
        services.SIGN_CHALLENGE.data = btoa(input);
        services.SIGN_CHALLENGE.card_context = readerContext;
        services.SIGN_CHALLENGE.data_hash = isInputHash;
        var validate = ValidateParams(services.SIGN_CHALLENGE, appCallBack);
        if (validate) {
            services.SendRequest(
                JSON.stringify(services.SIGN_CHALLENGE),
                toolkitSignChallengeCB,
                appCallBack
            );
        }
    };

    var toolkitSignChallengeCB = function (appCB, responseEvent) {
        LOG("CardReader :: toolkitSignChallengeCB() :: >>");
        try {
            var parsor = new SignatureResponse(responseEvent);
            appCB(parsor, null);
        } catch (error) {
            LOG("CardReader :: toolkitSignChallengeCB() :: Error ");
            appCB(null, error);
        }
    };

    this.disconnect = function (appCallback) {
        LOG("CardReader :: disconnect() :: >>");
        LOG("CardReader :: disconnect() :: 1 :: connected =" + connected);
        if (!connected) {
            var error = new ToolkitException(
                ErrorCodes.READER_NOT_CONNECTED_ERROR,
                "Reader not connected..",
                ExceptionType.TOOLKIT_ERROR,
                null
            );
        }

        services.DISCONNECT_REQUEST.service_context = window.service_context;
        services.DISCONNECT_REQUEST.card_context = readerContext;
        services.SendRequest(
            JSON.stringify(services.DISCONNECT_REQUEST),
            disconnectCB,
            appCallback
        );
    };

    var disconnectCB = function (appCB, response) {
        LOG("CardReader :: disconnectCB() :: >>");
        try {
            var parsor = new ToolkitResponse(response);
            appCB("success", null);
        } catch (error) {
            LOG("CardReader :: disconnectCB() :: Error ");
            appCB(null, error);
        }
    };

    this.isConnected = function () {
        return connected;
    };

    var toolkitConnectCB = function (appCB, responseEvent) {
        LOG("CardReader :: toolkitConnectCB() :: >>");
        try {
            var parsor = new ToolkitResponse(responseEvent);
            var result = JSON.parse(responseEvent.data);
            readerContext = result.card_context;
            connected = true;
            appCB("success", null);
        } catch (error) {
            LOG("CardReader :: toolkitConnectCB() :: Error ");
            appCB(null, error);
        }
    };

    var toolkitPubDataCB = function (appCB, responseEvent) {
        LOG("CardReader :: toolkitPubDataCB() :: >>");
        try {
            var publicDataResponse = new CardPublicData(responseEvent);
            appCB(publicDataResponse, null);
        } catch (error) {
            LOG("CardReader :: toolkitPubDataCB() :: Error ");
            appCB(null, error);
        }
    };

    this.prepareRequest = function (requestId, appCallBack) {
        LOG("CardReader :: prepareRequest() :: >>");
        LOG("CardReader :: prepareRequest() :: 1 :: connected =" + connected);
        if (!connected) {
            var error = new ToolkitException(
                ErrorCodes.READER_NOT_CONNECTED_ERROR,
                "Reader not connected..",
                ExceptionType.TOOLKIT_ERROR,
                null
            );
        }

        services.PREPARE_REQUEST.service_context = window.service_context;
        services.PREPARE_REQUEST.card_context = readerContext;
        services.PREPARE_REQUEST.request_id = requestId;

        var validate = ValidateParams(services.PREPARE_REQUEST, appCallBack);
        if (validate) {
            services.SendRequest(
                JSON.stringify(services.PREPARE_REQUEST),
                toolkitPrepareRequestCB,
                appCallBack
            );
        }
    };

    var toolkitPrepareRequestCB = function (appCB, responseEvent) {
        LOG("CardReader :: toolkitPrepareRequestCB() :: >>");
        try {
            var parsor = new ToolkitResponse(responseEvent);
            var response = parsor.response;
            appCB(response, null);
        } catch (error) {
            LOG("CardReader :: toolkitPrepareRequestCB() :: Error ");
            appCB(null, error);
        }
    };

    this.resetPin = function (
        encodedPin,
        fingerData,
        sensorTimeout,
        appCallBack
    ) {
        LOG("CardReader :: resetPin() :: >>");
        LOG("CardReader :: resetPin() :: 1 :: connected =" + connected);
        if (!connected) {
            var error = new ToolkitException(
                ErrorCodes.READER_NOT_CONNECTED_ERROR,
                "Reader not connected..",
                ExceptionType.TOOLKIT_ERROR,
                null
            );
        }

        /*  send VERIFY_BIOMETRIC by specifying parameters */
        services.PIN_RESET.service_context = window.service_context;
        services.PIN_RESET.finger_index = parseInt(
            fingerData.getIndex(fingerData.fingerIndex)
        );

        services.PIN_RESET.sensor_timeout = sensorTimeout;
        services.PIN_RESET.pin = encodedPin;
        services.PIN_RESET.ref_data_id = fingerData.fingerId;
        var validate = ValidateParams(services.PIN_RESET, appCallBack);
        if (validate) {
            services.SendRequest(
                JSON.stringify(services.PIN_RESET),
                toolkitResetPinCB,
                appCallBack
            );
        }
    };

    var toolkitResetPinCB = function (appCB, responseEvent) {
        LOG("CardReader :: toolkitResetPinCB() :: >>");
        try {
            var parsor = new ToolkitResponse(responseEvent);
            appCB(parsor, null);
        } catch (error) {
            LOG("CardReader :: toolkitResetPinCB() :: Error ");
            appCB(null, error);
        }
    };

    this.resetPINWithoutAuthenticateBiometric = function (
        encodedPin,
        appCallBack
    ) {
        LOG("CardReader :: resetPINWithoutAuthenticateBiometric() :: >>");
        LOG(
            "CardReader :: resetPINWithoutAuthenticateBiometric() :: 1 :: connected =" +
                connected
        );
        if (!connected) {
            var error = new ToolkitException(
                ErrorCodes.READER_NOT_CONNECTED_ERROR,
                "Reader not connected..",
                ExceptionType.TOOLKIT_ERROR,
                null
            );
        }

        /*  send VERIFY_BIOMETRIC by specifying parameters */
        services.PIN_RESET_WITHOUT_BIO.service_context = window.service_context;
        services.PIN_RESET_WITHOUT_BIO.pin = encodedPin;
        var validate = ValidateParams(services.PIN_RESET_WITHOUT_BIO, callback);
        if (validate) {
            services.SendRequest(
                JSON.stringify(services.PIN_RESET_WITHOUT_BIO),
                ResetPINWithoutAuthenticateBiometricCB,
                appCallBack
            );
        }
    };

    var ResetPINWithoutAuthenticateBiometricCB = function (
        appCB,
        responseEvent
    ) {
        LOG("CardReader :: resetPINWithoutAuthenticateBiometric() :: >>");
        try {
            var parsor = new ToolkitResponse(responseEvent);
            appCB(parsor, null);
        } catch (error) {
            LOG(
                "CardReader :: resetPINWithoutAuthenticateBiometric() :: Error "
            );
            appCB(null, error);
        }
    };

    this.setNfcAuthenticationParameters = function (variableArgumanets) {
        LOG("CardReader :: setNfcAuthenticationParameters() :: >>");
        LOG(
            "CardReader :: setNfcAuthenticationParameters() :: 1 :: number of arguments =" +
                arguments.length
        );

        if (!connected) {
            var error = new ToolkitException(
                ErrorCodes.READER_NOT_CONNECTED_ERROR,
                "Reader not connected..",
                ExceptionType.TOOLKIT_ERROR,
                null
            );
        }

        var validate;
        services.SET_NFC_PARAMS.service_context = window.service_context;
        services.SET_NFC_PARAMS.card_context = readerContext;
        if (arguments.length === 2) {
            services.SET_NFC_PARAMS.mrz = arguments[0];
            services.SendRequest(
                JSON.stringify(services.SET_NFC_PARAMS),
                setNfcAuthenticationParametersCB,
                arguments[1]
            );
        } else if (arguments.length === 4) {
            services.SET_NFC_PARAMS.cardnumber = arguments[0];
            services.SET_NFC_PARAMS.dob = arguments[1];
            services.SET_NFC_PARAMS.expirydate = arguments[2];
            services.SendRequest(
                JSON.stringify(services.SET_NFC_PARAMS),
                setNfcAuthenticationParametersCB,
                arguments[3]
            );
        }
    };

    var setNfcAuthenticationParametersCB = function (appCB, responseEvent) {
        LOG("CardReader :: setNfcAuthenticationParametersCB() :: >>");
        try {
            var parsor = new ToolkitResponse(responseEvent);
            appCB(parsor.status, null);
        } catch (error) {
            LOG("CardReader :: setNfcAuthenticationParametersCB() :: Error ");
            appCB(null, error);
        }
    };

    this.authenticateBiometricandCardOnServer = function (
        requestId,
        fingerIndex,
        sensorTimeout,
        appCallBack
    ) {
        LOG("CardReader :: authenticateBiometricandCardOnServer() :: >>");
        LOG(
            "CardReader :: authenticateBiometricandCardOnServer() :: 1 :: connected =" +
                connected
        );

        if (!connected) {
            var error = new ToolkitException(
                ErrorCodes.READER_NOT_CONNECTED_ERROR,
                "Reader not connected..",
                ExceptionType.TOOLKIT_ERROR,
                null
            );
        }

        /*  send VERIFY_BIOMETRIC by specifying parameters */
        services.VERIFY_BIOMETRIC_CARD.service_context = window.service_context;
        services.VERIFY_BIOMETRIC_CARD.finger_index =
            self.FINGER_INDEXS[fingerIndex];
        services.VERIFY_BIOMETRIC_CARD.request_id = requestId;
        services.VERIFY_BIOMETRIC_CARD.sensor_timeout = sensorTimeout;
        services.VERIFY_BIOMETRIC_CARD.card_context = readerContext;
        var validate = ValidateParams(
            services.VERIFY_BIOMETRIC_CARD,
            appCallBack
        );

        if (validate) {
            services.SendRequest(
                JSON.stringify(services.VERIFY_BIOMETRIC_CARD),
                toolkitVerifyBioandCardCB,
                appCallBack
            );
        }
    };

    var toolkitVerifyBioandCardCB = function (appCB, responseEvent) {
        LOG("CardReader :: toolkitVerifyBioandCardCB() :: >>");
        try {
            var parsor = new ToolkitResponse(responseEvent);
            appCB(parsor, null);
        } catch (error) {
            LOG("CardReader :: toolkitVerifyBioandCardCB() :: Error ");
            appCB(null, error);
        }
    };

    this.readPublicDataEF = function (publicDataEFType, appCallBack) {
        LOG("CardReader :: readPublicDataEF() :: >>");
        LOG("CardReader :: readPublicDataEF() :: 1 :: connected =" + connected);
        if (!connected) {
            var error = new ToolkitException(
                ErrorCodes.READER_NOT_CONNECTED_ERROR,
                "Reader not connected..",
                ExceptionType.TOOLKIT_ERROR,
                null
            );
        }

        services.DATA_EF_TYPE.service_context = window.service_context;
        services.DATA_EF_TYPE.card_context = readerContext;
        services.DATA_EF_TYPE.public_data_ef_type = parseInt(publicDataEFType);
        var validate = ValidateParams(services.DATA_EF_TYPE, appCallBack);
        if (validate) {
            services.SendRequest(
                JSON.stringify(services.DATA_EF_TYPE),
                readPublicDataEFCB,
                appCallBack
            );
        }
    };

    var readPublicDataEFCB = function (appCB, responseEvent) {
        LOG("CardReader :: readPublicDataEFCB() :: >>");
        try {
            var parsor = new ToolkitResponse(responseEvent);
            appCB(parsor, null);
        } catch (error) {
            LOG("CardReader :: readPublicDataEFCB() :: Error ");
            appCB(null, error);
        }
    };

    this.readData = function (requestId, readDataFileType, appCallBack) {
        LOG("CardReader :: readData() :: >>");
        LOG("CardReader :: readData() :: 1 :: connected =" + connected);
        if (!connected) {
            var error = new ToolkitException(
                ErrorCodes.READER_NOT_CONNECTED_ERROR,
                "Reader not connected..",
                ExceptionType.TOOLKIT_ERROR,
                null
            );
        }

        services.READDATA.service_context = window.service_context;
        services.READDATA.card_context = readerContext;
        services.READDATA.file_type = parseInt(readDataFileType);
        services.READDATA.request_id = requestId;
        let validate = ValidateParams(services.READDATA, appCallBack);
        if (validate) {
            services.SendRequest(
                JSON.stringify(services.READDATA),
                readDataCB,
                appCallBack
            );
        }
    };

    var readDataCB = function (appCB, responseEvent) {
        LOG("CardReader :: readDataCB() :: >>");
        try {
            var parsor = new CardReadData(responseEvent);
            appCB(parsor, null);
        } catch (error) {
            LOG("CardReader :: readDataCB() :: Error ");
            appCB(null, error);
        }
    };

    this.updateData = function (requestId, updateDataFileType, appCallBack) {
        LOG("CardReader :: updateData() :: >>");
        LOG("CardReader :: updateData() :: 1 :: connected =" + connected);
        if (!connected) {
            var error = new ToolkitException(
                ErrorCodes.READER_NOT_CONNECTED_ERROR,
                "Reader not connected..",
                ExceptionType.TOOLKIT_ERROR,
                null
            );
        }

        services.UPDATEDATA.service_context = window.service_context;
        services.UPDATEDATA.card_context = readerContext;
        services.UPDATEDATA.file_type = parseInt(updateDataFileType);
        services.UPDATEDATA.request_id = requestId;
        var validate = ValidateParams(services.UPDATEDATA, appCallBack);
        if (validate) {
            services.SendRequest(
                JSON.stringify(services.UPDATEDATA),
                updateDataCB,
                appCallBack
            );
        }
    };

    var updateDataCB = function (appCB, responseEvent) {
        LOG("CardReader :: updateDataCB() :: >>");
        try {
            var parsor = new ToolkitResponse(responseEvent);
            appCB(parsor, null);
        } catch (error) {
            LOG("CardReader :: readDataCB() :: Error ");
            appCB(null, error);
        }
    };

    this.getCardSerialNumber = function (appCallBack) {
        LOG("CardReader :: getCardSerialNumber() :: >>");
        LOG(
            "CardReader :: getCardSerialNumber() :: 1 :: connected =" +
                connected
        );
        if (!connected) {
            var error = new ToolkitException(
                ErrorCodes.READER_NOT_CONNECTED_ERROR,
                "Reader not connected..",
                ExceptionType.TOOLKIT_ERROR,
                null
            );
        }

        /*  send VERIFY_BIOMETRIC by specifying parameters */
        services.CSN.service_context = window.service_context;
        services.CSN.card_context = readerContext;
        var validate = ValidateParams(services.CSN, appCallBack);
        if (validate) {
            services.SendRequest(
                JSON.stringify(services.CSN),
                getCardSerialNumberCB,
                appCallBack
            );
        }
    };

    var getCardSerialNumberCB = function (appCB, responseEvent) {
        LOG("CardReader :: getCardSerialNumberCB() :: >>");
        try {
            var parsor = new ToolkitResponse(responseEvent);
            appCB(parsor, null);
        } catch (error) {
            LOG("CardReader :: getCardSerialNumberCB() :: Error ");
            appCB(null, error);
        }
    };

    this.getCardVersion = function (appCallBack) {
        LOG("CardReader :: getCardVersion() :: >>");
        if (!connected) {
            var error = new ToolkitException(
                ErrorCodes.READER_NOT_CONNECTED_ERROR,
                "Reader not connected..",
                ExceptionType.TOOLKIT_ERROR,
                null
            );
        }

        services.CardVersion.service_context = window.service_context;
        services.CardVersion.card_context = readerContext;
        var validate = ValidateParams(services.CardVersion, appCallBack);
        if (validate) {
            services.SendRequest(
                JSON.stringify(services.CardVersion),
                getCardVersionCB,
                appCallBack
            );
        }
    };

    var getCardVersionCB = function (appCB, responseEvent) {
        LOG("CardReader :: getCardVersionCB() :: >>");
        try {
            var parsor = new ToolkitResponse(responseEvent);
            appCB(parsor, null);
        } catch (error) {
            LOG("CardReader :: getCardVersionCB() :: Error ");
            appCB(null, error);
        }
    };
}

/**
 * Class ToolkitException. This class defines methods to get exception details
 */
function ToolkitException(code, message, errorType, attemptsLeft) {
    this.code = code;
    this.message = message;
    this.exceptionType = errorType;
    this.attemptsLeft = attemptsLeft;
}

function ToolkitExceptionWithResponse(
    toolkit_response,
    code,
    message,
    errorType,
    attemptsLeft
) {
    this.toolkit_response = toolkit_response;
    this.message = message;
    this.exceptionType = errorType;
    this.attemptsLeft = attemptsLeft;
    this.code = code;
}

function ToolkitResponse(response) {
    LOG("ToolkitResponse :: constructor() :: >>");
    this.tooklitResponse = null;
    this.message = null;
    var header = null;
    var body = null;
    var responseStatus = null;
    this.xmlString = null;
    this.response = null;
    result = JSON.parse(response.data);
    this.status = result.status;
    this.tooklitResponse = result.toolkit_response;

    LOG(
        "ToolkitResponse :: constructor() :: 1 :: response status = " +
            this.status
    );

    LOG(
        "ToolkitResponse :: constructor() :: 2 :: result.toolkit_response = " +
            this.tooklitResponse
    );

    if (0 < result.error_code) {
        if (
            null != result.attempts_left &&
            undefined != result.attempts_left &&
            null != result.toolkit_response &&
            undefined != result.toolkit_response
        ) {
            error = new ToolkitExceptionWithResponse(
                result.toolkit_response,
                result.error_code,
                result.error_message,
                ExceptionType.CARD_PIN_ERROR,
                result.attempts_left
            );
        } else if (
            null != result.attempts_left &&
            undefined != result.attempts_left
        ) {
            error = new ToolkitException(
                result.error_code,
                result.error_message,
                ExceptionType.CARD_PIN_ERROR,
                result.attempts_left
            );
        } else if (
            null != result.toolkit_response &&
            undefined != result.toolkit_response
        ) {
            error = new ToolkitExceptionWithResponse(
                result.toolkit_response,
                result.error_code,
                result.error_message,
                ExceptionType.TOOLKIT_ERROR,
                null
            );
        } else {
            error = new ToolkitException(
                result.error_code,
                result.error_message,
                ExceptionType.TOOLKIT_ERROR,
                null
            );
        }
        throw error;
    }

    if (
        null !== result.toolkit_response &&
        undefined !== result.toolkit_response &&
        result.toolkit_response.length > 0
    ) {
        LOG("ToolkitResponse :: constructor() :: 3 ");
        var domParser = new DOMParser();
        var jsonObj = {
            ValidationGatewayResponse: null,
        };

        try {
            var xmlDoc = domParser.parseFromString(
                result.toolkit_response,
                "text/xml"
            );
            jsonObj = xmlToJson(xmlDoc);
        } catch (e) {}

        if (jsonObj.ValidationGatewayResponse) {
            this.message = jsonObj.ValidationGatewayResponse.Message;
            validateElement(this.message, "Message");
            header = this.message.Header;
            validateElement(header, "Header");
            body = this.message.Body;
            validateElement(body, "Body");
            responseStatus = body.ResponseStatus;
            validateElement(responseStatus, "ResponseStatus");
            if ("Success" !== responseStatus) {
                LOG("ToolkitResponse :: constructor() :: 4 ");
                error = null;
                if (
                    null != result.attempts_left &&
                    undefined != result.attempts_left
                ) {
                    error = new ToolkitException(
                        result.error_code,
                        result.error_message,
                        ExceptionType.TOOLKIT_PIN_AUTHENTICATION_ERROR,
                        result.attempts_left
                    );
                } else {
                    error = new ToolkitException(
                        result.error_code,
                        result.error_message,
                        ExceptionType.TOOLKIT_ERROR,
                        null
                    );
                }
                throw error;
            }

            this.xmlString = result.toolkit_response;
            this.cardNumber = header.CardNumber;
            this.cardSerialNumber = header.CardSerialNumber;
            this.iDNumber = header.IDNumber;
            this.requestId = header.RequestID;
            this.service = header.Service;
            this.timeStamp = header.Timestamp;
            LOG("ToolkitResponse :: constructor() :: 5 ");
        } else {
            LOG("ToolkitResponse :: constructor() :: 6 ");
            this.response = result.toolkit_response;
        }

        LOG("ToolkitResponse :: constructor() :: << ");
    } else if (
        "success" === result.status &&
        undefined === result.toolkit_response
    ) {
        LOG("ToolkitResponse :: constructor() :: 3 ");
        return result;
    }

    function validateElement(element, elementName) {
        LOG("ToolkitResponse :: validateElement() :: >>");
        if (null == element || undefined == element) {
            var error = new ToolkitException(
                ErrorCodes.INVALID_TOOLKIT_RESPONSE_XML,
                "Invalid Toolkit Response XML Format. Element not found :" +
                    elementName,
                ExceptionType.TOOLKIT_ERROR,
                null
            );
            throw error;
        }
    }
}

function CardReadData(response) {
    ToolkitResponse.call(this, response);
    this.OrganDonor = new OrganDonar(this.message.Body.HealthData.OrganDonor);
    this.resource = [];
    if (this.message.Body.HealthData.resource) {
        for (let i = 0; i < this.message.Body.HealthData.resource.length; i++) {
            let resources = new Resource(
                this.message.Body.HealthData.resource[i]
            );
            this.resource.push(resources);
        }
    }
}

CardReadData.prototype = Object.create(ToolkitResponse.prototype);
CardReadData.prototype.constructor = CardReadData;

/* Changes XML to JSON */
function xmlToJson(xml) {
    /*   Create the return object */
    var obj = {};
    if (xml.nodeType == 1) {
        if (xml.attributes.length > 0) {
            obj["@attributes"] = {};
            for (var j = 0; j < xml.attributes.length; j++) {
                var attribute = xml.attributes.item(j);
                obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
            }
        }
    } else if (xml.nodeType == 3) {
        obj = xml.nodeValue;
    }

    /*  do children */
    if (xml.hasChildNodes()) {
        if (
            xml.childNodes.length === 1 &&
            xml.childNodes[0].nodeName === "#text"
        ) {
            obj = xml.textContent;
        } else {
            for (var i = 0; i < xml.childNodes.length; i++) {
                var item = xml.childNodes.item(i);
                var nodeName = item.nodeName;
                if ("#text" == nodeName) {
                    nodeName = "text";
                }

                if (typeof obj[nodeName] == "undefined") {
                    obj[nodeName] = xmlToJson(item);
                } else {
                    if (typeof obj[nodeName].push == "undefined") {
                        var old = obj[nodeName];
                        obj[nodeName] = [];
                        obj[nodeName].push(old);
                    }
                    obj[nodeName].push(xmlToJson(item));
                }
            }
        }
    }

    return obj;
}

/**
 * Class CardPublicData extends class ToolkitResponse.
 * This class defines CardPublicData fields
 */
function CardPublicData(responseJSON) {
    ToolkitResponse.call(this, responseJSON);
    this.cardNumber = this.message.Body.PublicData.CardNumber;
    this.cardHolderPhoto = this.message.Body.PublicData.CardHolderPhoto;
    this.holderSignatureImage =
        this.message.Body.PublicData.HolderSignatureImage;
    this.modifiablePublicData = new ModifiablePublicData(
        this.message.Body.PublicData.ModifiableData
    );
    this.nonModifiablePublicData = new NonModifiablePublicData(
        this.message.Body.PublicData.NonModifiableData
    );
    this.homeAddress = new HomeAddress(
        this.message.Body.PublicData.HomeAddress
    );
    this.workAddress = new WorkAddress(
        this.message.Body.PublicData.WorkAddress
    );
}

CardPublicData.prototype = Object.create(ToolkitResponse.prototype);
CardPublicData.prototype.constructor = CardPublicData;

/**
 * Class RegisterDeviceResponse extends class ToolkitResponse.
 * This class defines RegisterDeviceResponse fields
 */
function DataProtectionKey(responseJSON) {
    ToolkitResponse.call(this, responseJSON);
    var parsor = JSON.parse(responseJSON.data);
    this.publicKey = parsor.data_protection_key;
    this.modulus = parsor.modulus;
    this.exponent = parsor.exponent;
}

function RegisterDeviceResponse(responseJSON) {
    ToolkitResponse.call(this, responseJSON);
    var error = null;
    if (
        null == this.message.Body.DeviceRegistrationID &&
        undefined == this.message.Body.DeviceRegistrationID
    ) {
        error = new ToolkitException(
            ErrorCodes.INVALID_TOOLKIT_RESPONSE_XML,
            "Invalid Toolkit Response XML Format. Element not found : Device Registration ID",
            ExceptionType.TOOLKIT_ERROR,
            null
        );
        throw error;
    }
    this.deviceRegistrationID = this.message.Body.DeviceRegistrationID;
}

RegisterDeviceResponse.prototype = Object.create(ToolkitResponse.prototype);
RegisterDeviceResponse.prototype.constructor = RegisterDeviceResponse;

function CardFamilyBookData(responseJSON) {
    ToolkitResponse.call(this, responseJSON);
    this.HeadOfFamily = new HeadOfFamily(
        this.message.Body.FamilyBook.HeadOfFamily
    );
    this.wives = [];
    this.children = [];
    if (this.message.Body.FamilyBook.WifeData) {
        if (this.message.Body.FamilyBook.WifeData.Wife.length) {
            for (
                let i = 0;
                i < this.message.Body.FamilyBook.WifeData.Wife.length;
                i++
            ) {
                let wife = new Wife(
                    this.message.Body.FamilyBook.WifeData.Wife[i]
                );
                this.wives.push(wife);
            }
        } else {
            let wife = new Wife(this.message.Body.FamilyBook.WifeData.Wife);
            this.wives.push(wife);
        }
    }

    if (this.message.Body.FamilyBook.ChildData) {
        if (this.message.Body.FamilyBook.ChildData.Child.length) {
            for (
                let i = 0;
                i < this.message.Body.FamilyBook.ChildData.Child.length;
                i++
            ) {
                let child = new Child(
                    this.message.Body.FamilyBook.ChildData.Child[i]
                );
                this.children.push(child);
            }
        } else {
            this.children.push(
                new Child(this.message.Body.FamilyBook.ChildData.Child[i])
            );
        }
    }
}

CardFamilyBookData.prototype = Object.create(ToolkitResponse.prototype);
CardFamilyBookData.prototype.constructor = CardFamilyBookData;

/**
 * Class CardCertificates extends class ToolkitResponse.
 * This class defines CardCertificates fields
 */
function CardCertificates(responseEvent) {
    ToolkitResponse.call(this, responseEvent);
    var error = null;
    if (
        null == this.message.Body.AuthenticationCertificate &&
        undefined == this.message.Body.AuthenticationCertificate
    ) {
        error = new ToolkitException(
            ErrorCodes.INVALID_TOOLKIT_RESPONSE_XML,
            "Invalid Toolkit Response XML Format. Element not found : Authentication Certificate",
            ExceptionType.TOOLKIT_ERROR,
            null
        );
        throw error;
    }

    if (
        null == this.message.Body.SignatureCertificate &&
        undefined == this.message.Body.SignatureCertificate
    ) {
        error = new ToolkitException(
            ErrorCodes.INVALID_TOOLKIT_RESPONSE_XML,
            "Invalid Toolkit Response XML Format. Element not found : Signing Certificate",
            ExceptionType.TOOLKIT_ERROR,
            null
        );

        throw error;
    }

    this.authenticationCertificate =
        this.message.Body.AuthenticationCertificate;
    this.signingCertificate = this.message.Body.SignatureCertificate;
}

CardCertificates.prototype = Object.create(ToolkitResponse.prototype);
CardCertificates.prototype.constructor = CardCertificates;

/**
 * Class FingerData.
 * This class defines FingerData fields
 */
function FingerData(fingerId, fingerIndex) {
    /*  finger index constants */
    var FINGER_INDEX = {
        3: "NO_MEANING",
        5: "RIGHT_THUMB",
        9: "RIGHT_INDEX",
        13: "RIGHT_MIDDLE",
        17: "RIGHT_RING",
        21: "RIGHT_LITTLE",
        6: "LEFT_THUMB",
        10: "LEFT_INDEX",
        14: "LEFT_MIDDLE",
        18: "LEFT_RING",
        22: "LEFT_LITTLE",
    };

    this.fingerId = fingerId;
    this.fingerIndex = FINGER_INDEX[fingerIndex];
    this.getIndex = function () {
        for (var key in FINGER_INDEX) {
            if (this.fingerIndex === FINGER_INDEX[key]) {
                return key;
            }
        }
    };
}

/**
 * Class SignatureResponse extends class ToolkitResponse.
 * This class defines SignatureResponse fields
 */
function SignatureResponse(responseJSON) {
    ToolkitResponse.call(this, responseJSON);
    var error = null;
    if (
        null == this.message.Body.Signature &&
        undefined == this.message.Body.Signature
    ) {
        error = new ToolkitException(
            ErrorCodes.INVALID_FIELD,
            "Invalid Toolkit Response XML Format. Element not found : Signature",
            ExceptionType.TOOLKIT_ERROR,
            null
        );
        throw error;
    }
    this.signature = this.message.Body.Signature;
}

SignatureResponse.prototype = Object.create(ToolkitResponse.prototype);
SignatureResponse.prototype.constructor = SignatureResponse;

var ValidateParams = function (requestObj, appCallBack) {
    let IsValidated = true;
    for (var key in requestObj) {
        if (
            requestObj[key] ||
            requestObj[key] === 0 ||
            requestObj[key] === false
        ) {
        } else {
            IsValidated = false;
            var error = new ToolkitException(
                ErrorCodes.INVALID_FIELD,
                "'" + key + "' value is invalid",
                ExceptionType.TOOLKIT_ERROR,
                null
            );
            appCallBack(null, error);
            break;
        }
    }

    return IsValidated;
};

function parseEFData(efdata, appCallBack) {
    LOG("CardReader :: parseEFData() :: >>");
    services.PARSE_EF_DATA.service_context = window.service_context;
    services.PARSE_EF_DATA.ef_data = efdata;
    var validate = ValidateParams(services.PARSE_EF_DATA, appCallBack);
    if (validate) {
        services.SendRequest(
            JSON.stringify(services.PARSE_EF_DATA),
            parseEFDataCB,
            appCallBack
        );
    }
}

var parseEFDataCB = function (appCB, responseEvent) {
    LOG("CardReader :: parseEFDataCB() :: >>");
    try {
        var parsor = new ToolkitResponse(responseEvent);
        appCB(parsor, null);
    } catch (error) {
        LOG("CardReader :: parseEFDataCB() :: Error ");
        appCB(null, error);
    }
};
