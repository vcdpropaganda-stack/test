import { getJobStatusClasses, getJobStatusLabel, type JobStatus } from "@/lib/jobs";

type JobStatusBadgeProps = {
  status: JobStatus;
};

export function JobStatusBadge({ status }: JobStatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getJobStatusClasses(status)}`}
    >
      {getJobStatusLabel(status)}
    </span>
  );
}
