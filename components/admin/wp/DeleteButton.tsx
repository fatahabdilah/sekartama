"use client";

const CONFIRM =
  "You are about to permanently delete this item from your site.\nThis action cannot be undone.\n'Cancel' to stop, 'OK' to delete.";

type Props = {
  action: (formData: FormData) => Promise<void>;
  id: string;
  label?: string;
  className?: string;
  /** Inside another form (the Publish box): submit that form to `action` instead of nesting a form. */
  inForm?: boolean;
};

/** "Delete Permanently" (row actions and the Publish box), with WordPress's confirm prompt. */
export default function DeleteButton({ action, id, label = "Delete Permanently", className = "button-link submitdelete", inForm }: Props) {
  if (inForm) {
    return (
      <button
        type="submit"
        className={className}
        formAction={action}
        formNoValidate
        onClick={(event) => {
          if (!window.confirm(CONFIRM)) event.preventDefault();
        }}
      >
        {label}
      </button>
    );
  }

  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(CONFIRM)) event.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className={className}>
        {label}
      </button>
    </form>
  );
}
