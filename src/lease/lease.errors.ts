const LEASE_ERRORS = {
  INVALID_ID: 'Invalid leaseId',
  USER_OVERLAP: 'Tenant has overlapping leases',
  APARTMENT_OVERLAP: 'Apartment has overlapping leases',
  END_BEFORE_START: 'Lease end date must be after start date',
  START_NOT_BEGINNING_OF_MONTH: 'Lease start date must be the first day of the month',
  END_NOT_END_OF_MONTH: 'Lease end date must be the last day of the month',
};

export default LEASE_ERRORS;
