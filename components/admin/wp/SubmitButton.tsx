"use client";

import { useFormStatus } from "react-dom";

type Props = {
  value: string;
  className?: string;
  id?: string;
  name?: string;
  formValue?: string;
  /** Adds WordPress's spinner next to the button while saving (Publish box). */
  spinner?: boolean;
};

export default function SubmitButton({ value, className = "button button-primary", id, name, formValue, spinner }: Props) {
  const { pending, data } = useFormStatus();
  // Only the clicked button spins when a form has several submit buttons.
  const isMine = pending && (!name || data?.get(name) === formValue);
  return (
    <>
      {spinner && <span className={`spinner${isMine ? " is-active" : ""}`} />}
      <button type="submit" className={className} id={id} name={name} value={formValue} disabled={pending}>
        {value}
      </button>
    </>
  );
}
