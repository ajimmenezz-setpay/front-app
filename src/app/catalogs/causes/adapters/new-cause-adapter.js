export const NewCauseAdapter = cause => ({
  reason: cause?.cause,
  description: cause?.description,
  applicantProfileId: cause?.requesterProfile?.value || '',
  assignedProfileId: cause?.receptorProfile?.value || '',
  color: cause?.color
})
