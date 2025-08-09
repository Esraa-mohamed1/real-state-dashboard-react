import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

export default function PaymentForm({ initialValues, onSubmit, onCancel, submitting }) {
  const onError = (formErrors) => {
    const items = Object.values(formErrors).map((e) => e.message).filter(Boolean);
    if (items.length) {
      Swal.fire({
        icon: 'warning',
        title: 'Please fix validation errors',
        html: `<ul style="text-align:left;margin:0;padding-left:18px;">${items.map((m) => `<li>${m}</li>`).join('')}</ul>`,
      });
    }
  };

  return (
    // ... existing code ...
      <form onSubmit={handleSubmit(handleFormSubmit, onError)}>
        {/* form fields */}
      </form>
    // ... existing code ...
  );
} 