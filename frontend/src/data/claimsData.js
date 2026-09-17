const claimsData = [
  {
    id: 1,
    reference: 'CLM-2026-001',
    studentNumber: '12345678',
    studentName: 'Tswarelo Motloung',

    moduleCode: 'CMPG311',
    moduleName: 'Databases',
    lecturer: 'Lecturer Name',

    period: '02 Sep 2026 - 12 Sep 2026',
    submittedDate: '13 September 2026',

    hours: 13.5,
    hourlyRate: 45,
    amount: 607.5,

    status: 'Pending',

    banking: {
      bank: 'FNB',
      accountHolder: 'Tswarelo Motloung',
      accountNumber: '**** **** 4582',
      accountType: 'Cheque Account',
      status: 'Verified',
    },

    sessions: [
      {
        id: 1,
        date: '2026-09-02',
        activity: 'Student consultation',
        startTime: '08:00',
        endTime: '12:00',
        hours: 4,
        status: 'Verified',
      },
      {
        id: 2,
        date: '2026-09-05',
        activity: 'Tutorial assistance',
        startTime: '09:00',
        endTime: '13:30',
        hours: 4.5,
        status: 'Verified',
      },
      {
        id: 3,
        date: '2026-09-10',
        activity: 'Student consultation',
        startTime: '10:00',
        endTime: '15:00',
        hours: 5,
        status: 'Pending',
      },
    ],
  },

  {
    id: 2,
    reference: 'CLM-2026-002',
    studentNumber: '87654321',
    studentName: 'Student Example',

    moduleCode: 'CMPG323',
    moduleName: 'Software Engineering',
    lecturer: 'Lecturer Example',

    period: '01 Sep 2026 - 10 Sep 2026',
    submittedDate: '11 September 2026',

    hours: 10,
    hourlyRate: 45,
    amount: 450,

    status: 'Under Review',

    banking: {
      bank: 'Standard Bank',
      accountHolder: 'Student Example',
      accountNumber: '**** **** 1234',
      accountType: 'Savings Account',
      status: 'Verified',
    },

    sessions: [
      {
        id: 1,
        date: '2026-09-03',
        activity: 'Student consultation',
        startTime: '09:00',
        endTime: '13:00',
        hours: 4,
        status: 'Verified',
      },
      {
        id: 2,
        date: '2026-09-08',
        activity: 'Tutorial assistance',
        startTime: '10:00',
        endTime: '16:00',
        hours: 6,
        status: 'Under Review',
      },
    ],
  },

  {
    id: 3,
    reference: 'CLM-2026-003',
    studentNumber: '11223344',
    studentName: 'Another Student',

    moduleCode: 'CMPG321',
    moduleName: 'Advanced Databases',
    lecturer: 'Lecturer Example',

    period: '20 Aug 2026 - 30 Aug 2026',
    submittedDate: '31 August 2026',

    hours: 8,
    hourlyRate: 45,
    amount: 360,

    status: 'Verified',

    banking: {
      bank: 'ABSA',
      accountHolder: 'Another Student',
      accountNumber: '**** **** 7890',
      accountType: 'Cheque Account',
      status: 'Verified',
    },

    sessions: [
      {
        id: 1,
        date: '2026-08-22',
        activity: 'Tutorial assistance',
        startTime: '09:00',
        endTime: '13:00',
        hours: 4,
        status: 'Verified',
      },
      {
        id: 2,
        date: '2026-08-27',
        activity: 'Student consultation',
        startTime: '10:00',
        endTime: '14:00',
        hours: 4,
        status: 'Verified',
      },
    ],
  },

  {
    id: 4,
    reference: 'CLM-2026-004',
    studentNumber: '55667788',
    studentName: 'Example Student',

    moduleCode: 'CMPG314',
    moduleName: 'Operating Systems',
    lecturer: 'Lecturer Example',

    period: '05 Sep 2026 - 12 Sep 2026',
    submittedDate: '13 September 2026',

    hours: 6.5,
    hourlyRate: 45,
    amount: 292.5,

    status: 'Pending',

    banking: {
      bank: 'Nedbank',
      accountHolder: 'Example Student',
      accountNumber: '**** **** 2468',
      accountType: 'Savings Account',
      status: 'Verified',
    },

    sessions: [
      {
        id: 1,
        date: '2026-09-06',
        activity: 'Student consultation',
        startTime: '08:30',
        endTime: '11:30',
        hours: 3,
        status: 'Pending',
      },
      {
        id: 2,
        date: '2026-09-11',
        activity: 'Tutorial assistance',
        startTime: '09:00',
        endTime: '12:30',
        hours: 3.5,
        status: 'Pending',
      },
    ],
  },
];

export default claimsData;