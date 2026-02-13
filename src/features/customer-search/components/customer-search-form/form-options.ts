import { formOptions, revalidateLogic } from "@tanstack/react-form";

export const customerSearchFormOpts = formOptions({
  validationLogic: revalidateLogic({
    mode: "submit",
    modeAfterSubmission: "change",
  }),
  onSubmitInvalid() {
    const InvalidInput = document.querySelector(
      '[aria-invalid="true"]',
    ) as HTMLInputElement;

    InvalidInput?.focus();
  },
});
