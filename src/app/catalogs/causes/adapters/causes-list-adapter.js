export const CausesListAdapter = causes =>
  causes?.map(cause => ({
    id: cause?.id,
    cause: cause?.name,
    description: cause?.description,
    color: cause?.color?.trim(),
    status: cause?.active === '1',
    requesterProfile: { id: cause?.applicantProfileId, name: cause?.applicantProfileName },
    receptorProfile: { id: cause?.assignedProfileId, name: cause?.assignedProfileName }
  })) || []
