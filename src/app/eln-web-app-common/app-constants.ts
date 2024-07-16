export const DefaultSpreadsheetContentLength = 12816000;
export const SchedulerGroupColor = `#004f9b`;
export const NoImageBase64 = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAiACMDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+qMms6XFI0cmpWaOhKsrTqCCOoIzV6ucn1dtC8N3GpeQs0MN5OZ1MwjYRmdwSueGbkYUkZ6A5wCm0ldl06cqk1CG70Rqx6zpcsixx6lZu7kKqrOpJJ6ADNXq4TWtXbXfCekal5Cwwza5YGBRMJGMYu4wC2OFbg5UE46E5yB3dCaaugqU5U5uE91owooopkBXGf8ACQ6bbGSzv9E1m4ktr6aVGXRLiZA3muVdGEZB4PDD14NdnRQNNp3R53rGq2eqQ2NlpWhaxBLJrNldSltFuIUO24jZ3digGcAkkntXolFFANtu7CiiigQUUUUAFFFFABRRRQB//9k="


export const ProjectStates = {
    Completed: 'Completed',
    Closed: 'Closed'
};

export const DialogBoxConfiguration = {
    height: 'auto',
    closeOnEscape: false,
    animationSettings: { effect: 'SlideTop', duration: 400, delay: 0 },
    position: { X: 'center', Y: 'Top' }
}

export const InventoryReserveScheduleConfiguration = {
    showName: false,
    timeScale: false,
    schedulerHeight: 'auto',
    showImage: false,
    showHeaderBar: true,
    showDesignation: false,
    allowAdding: true,
    allowEditing: true,
    allowDeleting: true
}

function identifyDateFormat(): string {
    try {
        const dateFormatMap: { [key: string]: string } = {
            'ar': 'dd/MM/yyyy', // Arabic (Saudi Arabia)
            'bn': 'dd/MM/yyyy', // Bangla (Bangladesh)
            'cs': 'dd.MM.yyyy', // Czech (Czech Republic)
            'da': 'dd-MM-yyyy', // Danish (Denmark)
            'de': 'dd.MM.yyyy', // Austrian German
            'el': 'dd/MM/yyyy', // Modern Greek
            'en': 'yyyy-MM-dd', // Canadian English,British English,Irish English,Indian English,New Zealand English,US English,English (South Africa)
            'es': 'dd/MM/yyyy', // Spanish
            'fa': 'yyyy/MM/dd', // Iranian (Iran)
            'fi': 'dd.MM.yyyy', // Finnish (Finland)
            'fr': 'yyyy-MM-dd', // Canadian French,Standard French (France)
            'he': 'dd/MM/yyyy', // Hebrew (Israel)
            'hi': 'dd/MM/yyyy', // Hindi (India)
            'hu': 'yyyy.MM.dd', // Hungarian (Hungary)
            'id': 'dd/MM/yyyy', // Indonesian (Indonesia)
            'it': 'dd/MM/yyyy', // Standard Italian (Italy)
            'ja': 'yyyy/MM/dd', // Japanese (Japan)
            'ko': 'yyyy-MM-dd', // Korean (South Korea)
            'nl': 'dd-MM-yyyy', // Standard Dutch (Netherlands)
            'no': 'dd.MM.yyyy', // Norwegian (Norway)
            'pl': 'yyyy-MM-dd', // Polish (Poland)
            'pt': 'dd-MM-yyyy', // European Portuguese (Portugal)
            'ro': 'dd.MM.yyyy', // Romanian (Romania)
            'ru': 'dd.MM.yyyy', // Russian (Russia)
            'sk': 'dd.MM.yyyy', // Slovak (Slovakia)
            'sv': 'yyyy-MM-dd', // Swedish (Sweden)
            'ta': 'yyyy-MM-dd', // Sri Lankan Tamil
            'th': 'dd/MM/yyyy', // Thai (Thailand)
            'tr': 'dd.MM.yyyy', // Turkish (Turkey)
            'zh': 'yyyy/MM/dd'  // Taiwan (traditional),  Hong Kong (traditional),Mainland China (simplified)
        };
        const languageCode = navigator.language || navigator.languages[0] || 'en-US';
        const primaryLangCode = languageCode.split('-')[0];
        const dateFormat = dateFormatMap[primaryLangCode.toLowerCase()] || 'dd-MM-yyyy';

        return dateFormat;
    } catch (error) {
        return 'dd-MM-yyyy'; // Default format if an error occurs
    }
}

export const Constants = {
    Version: 'v1',
    DEFAULTLANGUAGE: 'en',
    DefaultConfigurationPanelTitle: "ConfigurationPanel",
    DefaultDateFormat: identifyDateFormat(),
    DefaultVersion: '1.001',
    MomentDefaultDateFormat: identifyDateFormat(),
    MomentDefaultDateTimeFormat: identifyDateFormat() + ' hh:mm a',
    DefaultDateTimeFormat: identifyDateFormat() + ' hh:mm:ss',
    DefaultPagination: [5, 10, 20, 50, 100],
    DefaultTimeFormat: 'hh:mm',
    DefaultTimeoutValue: 500,
    DefaultUserImage: 'ic_userpic.PNG',
    DocumentVersionFormat: '^[0-9]{1,9}[.]{1}[0-9]{1,3}$',
    DefaultInputMaxLength: 128,
    AcknowledgeLabelMaxLength: 4000,
    DescriptionMaxLength: 4000,
    RandomChars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    DuplicationNotAllowed: "This block is not allow to be duplicate.",
    BlockCompleted: "Block completed successfully.",
    DefaultImages: "assets/images/",
    InventoryAllowedFileTypes: '.png, .jpg, .jpeg, .doc, .docx, .pdf , .xls, .xlsx',
    DefaultFontSize: 0.7,
    MaximumFontSize: 1.2,
    DocumentUploadAllowedFileTypes: '.pdf, .xls, .xlsx, .doc, .docx, .pptx, .ppt, .csv',
    MaximumFileSize: 5000000, // 5mb file size
    FileSizeValidation: "File Size should be less than 5 MB",
    MaxBlocksLengthInWorkflow: 25,
    ProjectAutoSaveDefaultTime: 10,
    ProjectAutoSaveConfiguration: 'Auto_Save',
    MaxLengthForVersion: 13,
    Detail: "detail",
    rxForMalformed: /%(?![0-9][0-9a-fA-F]+)/g,
    TaskType: {
        Experiment: "Experiment",
        Sop: "SOP",
        Documentation: "Documentation"
    },
    DocumentationType: {
        Document: '1',
        Spreadsheet: '2'
    },
    KeyboardValues: {
        C: 67,
        P: 80,
        V: 86,
        Y: 89,
        Z: 90
    },
    StorageVar: {
        AuthToken: "AuthToken",
        SelectedTenantId: "SelectedTenant",
        AccessToken: "AccessToken",
        UserInfo: "UserInfo",
        RefreshToken: "RefreshToken",
        AccessTokenExpiryTime: "accessTokenExpiryTime",
        RefreshTokenExpiryTime: "refreshTokenExpiryTime",
        JwtExpiryNotification: "jwtExpiryNotification",
        JwtToken: "Jwt",
        TenantId: "TenantId",
        LoggedInTime: "LoggedInTime",
        NotificationSentTime: "NotificationSentTime"
    },
    BlockModes: {
        TemplateCreation: "TemplateCreation",
        TaskCreation: "TaskCreation",
        TaskExecution: "TaskExecution",
        TaskView: "TaskView"
    },
    AcceptStatus: {
        Pending: "Pending",
        Accepted: "Accepted",
        Rejected: "Rejected"
    },
    GridActions: {
        Project: {
            ExperimentNewTemplate: "Experiment/New",
            ExperimentExistingTemplate: "Experiment/Existing",
            DocumentNewTemplate: "Document/New",
            DocumentExistingTemplate: "Document/Existing",
            SopNewTemplate: "SOP/New",
            SopExistingTemplate: "SOP/Existing",
            AuditTrial: "Audit Trial",
            ArchiveUnarchive: "Archive/Unarchive"
        },
        Skill: {
            Edit: "Edit Skill",
            Delete: "Delete Skill",
            Request: "Skill Request"

        },
        Task: {
            Execute: "Execute",
            AuditTrial: "Audit Trial"
        },
        AssignedTask: {
            Accept: "Accept",
            Reject: "Reject"
        },
        Template: {
            Edit: "Edit",
            VersionHistory: "Version History",
            Delete: "Delete"
        },
        TemplateVersionHistory: {
            TemplateSaveAs: "Create Copy",
            Delete: "Delete"
        },
        Role: {
            AddRole: "Add Role",
            Edit: "Edit",
            Delete: "Delete"
        },
        Document: {
            Edit: "Edit",
            Export: "Export",
            Delete: "Delete",
            VersionHistory: "Version History",
            Archive: "Archive",
            Print: "Print",
            Sign: "Sign Digitally"
        },
        DocumentConfiguration: {
            Edit: "Edit",
            Delete: "Delete"
        },
        Inventory: {
            Edit: "Edit",
            Delete: "Delete",
            Reserve: "Reserve"
        },
        UserGroup: {
            Edit: "Edit",
            Delete: "Delete"
        },
        Dashboard: {
            Accept: "Accept",
        }
    },
    WorkflowEvents: {
        BrowseTemplate: "BrowseTask"
    },
    Controllers: {
        Report: {
            Title: "Report",
            Actions: {
                Create: "Create",
                View: "View"
            }
        },
        Notification: {
            Title: "Notification",
            Actions: {
                Empty: '',
                UpdateReadStatus: 'UpdateStatus',
                GetNotifications: 'List',
                MarkAllAsRead: 'MarkAllAsRead',
                Trigger: 'trigger'
            },
            NotificationMaxCount: 99,
            NotificationsClearedMessage: "Cleared All Notifications",
            DashboardNotificationMaxCount: 6
        },
        Template: {
            Title: "Template",
            Actions: {
                Empty: '',
                Search: 'Search'
            }
        },
        WorkflowConfiguration: {
            Title: "WorkflowConfiguration",
            Actions: {
                Empty: '',
                BlockTypes: 'BlockTypes',
                Modes: 'Modes'
            }
        },
        Project: {
            Title: "Project",
            Actions: {
                Empty: '',
                Search: 'Search',
                Collaborator: 'collaborator',
                Archive: 'archivestate'
            }
        },
        ProjectConfiguration: {
            Title: "ProjectConfiguration",
            Actions: {
                Empty: '',
            }
        },
        Task: {
            Title: "Task",
            Actions: {
                Empty: '',
                List: 'List',
                Search: 'Search',
                AssignedBlock: 'AssignedBlock',
                CurrentState: 'CurrentState',
                NextPosibleState: 'NextPosibleState'
            },
            No: "No ",
            AreAvailable: " are available ",
            CreateNewTask: "Please create new "
        },
        Activity: {
            Title: "Activity",
            Actions: {
                Recent: "recent"
            }
        },
        Document: {
            Title: "Document",
            Actions: {
                Empty: '',
                Search: 'search',
                Versions: 'version',
                ListSections: 'listdocumentsections',
                DocumentSection: 'documentsection',
                GetDocument: 'getDocument',
                GetDocumentVersion: 'getDocumentVersion',
                Download: "download",
                Save: "save",
                Json: "json",
                EditUsingJson: "EditUsingJson",
                Sign: "sign",
                Generate: "generate",
                DocumentNumber: "documentNumber",
                CreateByMinio: "CreateByMinioPath",
                Pdf: "pdf",
                DownloadAuditFile: "downloadAuditFile"
            }
        },
        DocumentSection: {
            Title: "DocumentSection",
            Actions: {
                Empty: ''
            }
        },
        Skill: {
            Title: "Skill",
            Actions: {
                Empty: '',
                Search: 'Search',
                Delete: 'Delete',
                BasicSearch: 'basicSearch'
            }
        },
        SkillRequest: {
            Title: "SkillRequest",
            Actions: {
                Empty: '',
                Search: 'skills',
                Delete: 'Delete',
                Users: 'users',
                Submit: 'submit',
                SkillRequest: 'skillrequest',
                Reject: 'reject',
                Approve: 'approve',
                Download: 'download'
            }
        },
        UserScheduleTask: {
            Title: "UserScheduleTask",
            Actions: {
                Empty: '',
                GetUserSchedule: "assign",
                StatusChange: "updatestatus",
                Add: "add",
                Update: "update",
                Delete: "delete"
            }
        },
        User: {
            Title: "User",
            Actions: {
                Empty: '',
                Search: 'search',
                Delete: 'Delete',
                SyncUsers: 'SyncUsers',
                BasicSearch: 'basicSearch',
                LicenseInfo: 'licenseInfo',
                Detail: 'detail'
            }
        },
        UserFileType: {
            Title: "UserFileTypes",
            Actions: {
                Empty: '',
                Delete: 'Delete'
            }
        },
        UserFile: {
            Title: "UserFile",
            Actions: {
                Empty: '',
                Delete: 'Delete',
                FilesBase64: 'getfilesbyuser'
            }
        },
        UserGroup: {
            Title: "UserGroup",
            Actions: {
                Empty: '',
                Groups: 'groups',
                GetUserGroups: 'search',
                BasicSearch: 'basicSearch'
            }
        },
        Role: {
            Title: "Role",
            Actions: {
                Empty: '',
                Asset: 'asset',
                AssetBasic: 'assetDefault'
            }
        },
        Security: {
            Title: "Security",
            Actions: {
                Token: 'token'
            }
        },
        AccessCheck: {
            Title: "AccessCheck",
            Actions: {
                Logout: 'logout'
            }
        },
        WorkflowExecution: {
            Title: "WorkflowExecution",
            Actions: {
                Empty: '',
                Runtime: 'runtime',
                Definition: 'Definition'
            }
        },
        Authorization: {
            Title: "Role",
            Actions: {
                Empty: '',
                Global: 'global',
                GlobalBasic: 'globalDefault',
                Privilege: 'global/rolePrivilege',
            }
        },
        AuditTrial: {
            Title: "AuditTrail",
            Actions: {
                AuditTrail: "AuditTrail",
                Configuration: "configuration",
                Config: "config",
                Search: "search",
                AuditReport: "auditreport"
            }
        },
        Inventory:
        {
            Instrument: {
                Title: "Instrument",
                Actions: {
                    Empty: '',
                    Search: 'search',
                    CustomLabels: 'customLabels',
                    Category: 'category',
                    GetReservedInstrument: 'getReservesByInstIds',
                    Reserve: 'reserve',
                    GetReserves: 'getReserves'
                }
            },
            Sample: {
                Title: "Sample",
                Actions: {
                    Empty: '',
                    Search: 'search',
                    CustomLabels: 'customLabels',
                    Category: 'category',
                    Reserve: 'reserve',
                    GetReserves: 'getReserves'
                }
            },
            Equipment: {
                Title: "Equipment",
                Actions: {
                    Empty: '',
                    Search: 'search',
                    CustomLabels: 'customLabels',
                    Category: 'category',
                    GetReservedEquipment: 'getReservesByEquipIds',
                    Reserve: 'reserve',
                    GetReserves: 'getReserves'
                }
            },
            Reagent: {
                Title: "Reagent",
                Actions: {
                    Empty: '',
                    Search: 'search',
                    CustomLabels: 'customLabels',
                    Category: 'category',
                    Reserve: 'reserve',
                    GetReserves: 'getReserves'
                }
            }
        },
        Search: {
            Title: "Search",
            Actions: {
                Empty: '',
                Configuration: 'configuration',
                BasicSearch: 'basic',
                AdvancedSearch: 'advance',
                Save: 'save',
                SavedResults: "savedresults"
            }
        },
    },
    ComponentLoader: {
        UndoRedoTypes: {
            None: 0,
            Undo: 1,
            Redo: 2
        },
        UndoRedo: {
            OperationTypes: {
                BlockChange: 1,
                InputChange: 2
            },
            BlockChangeSuboperation: {
                Add: 1,
                ChangeIndex: 2,
                AddChildBlock: 3
            }
        },
        Print: {
            Weight: 1800,
            Height: 500,
            SectionId: 'componentLoader',
            Replace: [
                { Regex: /accordion-item/g, NewStr: 'accordion-item active' },
                { Regex: /accordion-collapse collapse/g, NewStr: 'accordion-collapse collapse show' }
            ],
            HtmlPage: {
                Start: '<html><head><link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet"><link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.6.0/font/bootstrap-icons.css" rel="stylesheet"><link href="../styles.css" rel="stylesheet"><link href="../assets/styles/main.scss" rel="stylesheet"><link href="../assets/styles/_global.css" rel="stylesheet"><link href="../assets/styles/_common.css" rel="stylesheet"></head><body onload="window.print()">',
                End: '</body></html>'
            }
        }
    },
    WorkflowLibrary: {
        CommonFields: {
            IsCompleted: "DefaultIsCompleted",
            Action: "Action",
        },
        DocumentationBlock: {
            ComponentTitle: "DocumentationBlockComponent",
            Fields: {
                EditorType: "DocumentationEditorType",
                Chart: "DocumentationChart",
                DrawingTools: "DocumentationDrawingTools",
                Signature: "DocumentationSignature",
                BrowseTemplate: "DocumentationBrowseTemplate",
                Documentation: "Documentation",
                Name: "DocumentationName",
                AssignUser: "DocumentationAssignUser",
                AuthorName: "DocumentationAuthorName",
                Version: "DocumentationVersion",
                DocumentNumber: "DocumentationDocumentNumber",
                File: "DocumentationFile",
                Tags: "DocumentationTags",
                DocumentId: "DocumentationId",
                IsCompleted: "DefaultIsCompleted"
            }
        }
    },
    States: {
        Completed: 'Completed'
    },
    Wrapper: {
        PdfViewer: {
            MimeType: 'data:application/pdf;base64,',
            ServiceUrl: '/v1/PdfViewer'
        },
        TextEditor: {
            Seprator: '|',
            FixedOptions: {
                Bold: 'bold',
                Italic: 'Italic',
                UnderLine: 'Underline',
                FontSize: 'FontSize',
                JustifyLeft: 'JustifyLeft',
                JustifyCenter: 'JustifyCenter',
                JustifyRight: 'JustifyRight',
                JustifyFull: 'JustifyFull',
                OrderedList: 'OrderedList',
                UnorderedList: 'UnorderedList',
                FontColor: 'FontColor',
                BackgroundColor: 'BackgroundColor',
                Undo: 'Undo',
                Redo: 'Redo'
            },
            ConfigurableOptions: {
                Image: 'Image',
                CreateLink: 'CreateLink',
                SuperScript: 'SuperScript',
                SubScript: 'SubScript',
                Formats: 'Formats',
                Outdent: 'Outdent',
                Indent: 'Indent',
            }
        },
        DocumentEditor: {
            ServiceUrl: `/api/Syncfusion/document/`,
            Seprator: '|',
            ConfigurableOptions: {
                New: 'New',
                Open: 'Open',
                Undo: 'Undo',
                Redo: 'Redo',
                Image: 'Image',
                Table: 'Table',
                Hyperlink: 'Hyperlink',
                Bookmark: 'Bookmark',
                TableOfContents: 'TableOfContents',
                Header: 'Header',
                Footer: 'Footer',
                PageSetup: 'PageSetup',
                PageNumber: 'PageNumber',
                Break: 'Break',
                Find: 'Find',
                Comments: 'Comments',
                TrackChanges: 'TrackChanges',
                LocalClipboard: 'LocalClipboard',
                RestrictEditing: 'RestrictEditing',
                FormFields: 'FormFields',
                UpdateFields: 'UpdateFields',
            }
        },
        SpreadSheetEditor: {
            SaveUrl: `/api/Syncfusion/spreadsheet/save`,
            SaveAsUrl: `/api/Syncfusion/spreadsheet/SaveAs`,
            OpenUrl: `/api/Syncfusion/spreadsheet/open`,
            DocumentationBlockSheetName: "DocumentationBlockSheet"
        }
    }
}