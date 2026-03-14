import { Box } from "@cloudscape-design/components";

interface ContactReasonCellDisplayProps {
  reason?: string | null;
  emailSubject?: string | null;
}

export const ContactReasonCellDisplay: React.FC<
  ContactReasonCellDisplayProps
> = ({ reason, emailSubject }) => {
  return (
    <Box>
      <Box>{reason || "-"}</Box>
      {emailSubject && (
        <Box variant="small">
          <strong>Subject: </strong>
          <span
            style={{
              display: "inline-block",
              maxWidth: "150px",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              verticalAlign: "bottom",
            }}
          >
            {emailSubject}
          </span>
        </Box>
      )}
    </Box>
  );
};
