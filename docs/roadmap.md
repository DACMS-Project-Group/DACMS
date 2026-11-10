# DACMS Roadmap

Planned changes that are known but intentionally not implemented yet. These are
recorded here so the current behaviour (and the development seed data) is not
mistaken for the intended end state.

## 1. Department-scoped administrators

Today every administrator has unrestricted visibility of all business data:
dashboards, applications, appointments, budgets, timesheets, claims, exports and
notifications are all global. Administrators are also not tied to an
organisational entity (`OE_ID`).

Planned:

- Assign each administrator to one or more organisational entities (schools /
  departments).
- Scope every admin query, dashboard counter and export by the administrator's
  organisational entity.
- Seed data will need one administrator per department instead of two global
  administrators.

Until this lands, treat an administrator account as a "super user" and do not
assume any per-department isolation.

## 2. Validate profile completeness on claim submission

Students can currently submit remuneration claims even when their P&C122F
profile (identity, address, next of kin, bank details, declaration) is
incomplete. Only StudentIDs 1, 11 and 13 in `backend/seed.sql` have a complete
profile on purpose.

Planned: block claim submission until the required profile fields are present,
and point the student at the exact fields that still need attention.

## 3. Weekly reminders for incomplete student profiles

Planned: a scheduled weekly job (in-app notification and/or email) that nudges
students whose personal information is incomplete, with a deep link to the
profile page.

## 4. Validate academic records on application submission

Applications currently trust the marks a student has captured themselves.

Planned:

- Validate the uploaded academic record/transcript when an application is
  submitted (format and authenticity checks, manual review fallback).
- Enforce the "past-year, passed, and not currently enrolled" eligibility rule
  in the API. `DemiApplicationRepository.findOpenListings` and
  `checkEligibility` currently match any grade for the module, regardless of
  `AcademicYear`; only the seed data encodes the rule today.
