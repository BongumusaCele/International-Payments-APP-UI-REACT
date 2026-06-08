import React from 'react';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmployeeLayout } from '../../components/layouts/EmployeeLayout';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import {
  clearEmployeeError,
  fetchEmployeePaymentSummary,
  fetchEmployeePayments,
  rejectEmployeePayment,
  submitEmployeePaymentToSwift,
  verifyEmployeePayment,
} from '../../store/slices/employeeSlice';
import { EmployeePaymentReview } from '../../types';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { validationMessages, validationPatterns } from '../../utils/validation';

type PaymentStatusFilter = 'All' | EmployeePaymentReview['status'];
type PendingActionType = 'verify' | 'submit' | 'reject';

const statuses: PaymentStatusFilter[] = ['All', 'Under Review', 'Verified', 'Submitted to SWIFT', 'Rejected'];

type PendingAction = {
  type: PendingActionType;
  payment: EmployeePaymentReview;
};

type ButtonVariant = 'primary' | 'secondary' | 'outline';

interface ActionCopy {
  title: string;
  confirmationLabel: string;
  confirmLabel: string;
  buttonVariant: ButtonVariant;
}

const actionCopy: Record<PendingActionType, ActionCopy> = {
  verify: {
    title: 'Verify Transaction',
    confirmationLabel: 'I confirm the payee account information and SWIFT/BIC details are appropriate and correct.',
    confirmLabel: 'Confirm Verify',
    buttonVariant: 'primary',
  },
  submit: {
    title: 'Submit Transaction to SWIFT',
    confirmationLabel: 'I confirm this transaction has been verified and is ready for simulated SWIFT submission.',
    confirmLabel: 'Confirm Submit',
    buttonVariant: 'secondary',
  },
  reject: {
    title: 'Reject Transaction',
    confirmationLabel: 'I confirm this transaction should be rejected and returned for correction.',
    confirmLabel: 'Confirm Reject',
    buttonVariant: 'outline',
  },
};

const getFilteredPayments = (
  payments: EmployeePaymentReview[],
  filterStatus: PaymentStatusFilter
) => {
  if (filterStatus === 'All') {
    return payments;
  }

  return payments.filter((payment) => payment.status === filterStatus);
};

const getFilterButtonClass = (isActive: boolean) => {
  const baseClass = 'rounded-lg px-4 py-2 font-medium transition-colors';

  if (isActive) {
    return `${baseClass} bg-blue-900 text-white`;
  }

  return `${baseClass} bg-gray-200 text-gray-800 hover:bg-gray-300`;
};

export const EmployeePaymentsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { payments, paymentsLoading, actionLoadingId, error } = useAppSelector((state) => state.employee);
  const [filterStatus, setFilterStatus] = React.useState<PaymentStatusFilter>('All');
  const [pendingAction, setPendingAction] = React.useState<PendingAction | null>(null);
  const [isConfirmationChecked, setIsConfirmationChecked] = React.useState(false);
  const [rejectionReason, setRejectionReason] = React.useState('');

  React.useEffect(() => {
    dispatch(fetchEmployeePayments());
    dispatch(fetchEmployeePaymentSummary());
  }, [dispatch]);

  React.useEffect(() => {
    if (!actionLoadingId) {
      dispatch(fetchEmployeePaymentSummary());
    }
  }, [actionLoadingId, dispatch]);

  const filteredPayments = getFilteredPayments(payments, filterStatus);

  const openConfirmation = (action: PendingAction) => {
    setPendingAction(action);
    setIsConfirmationChecked(false);
    setRejectionReason('');
    if (error) dispatch(clearEmployeeError());
  };

  const closeConfirmation = () => {
    if (actionLoadingId) return;
    setPendingAction(null);
    setIsConfirmationChecked(false);
    setRejectionReason('');
  };

  const handleVerify = async (paymentId: string) => {
    const result = await dispatch(verifyEmployeePayment({ paymentId }));
    if (verifyEmployeePayment.fulfilled.match(result)) {
      closeConfirmation();
    }
  };

  const handleSubmitToSwift = async (paymentId: string) => {
    const result = await dispatch(submitEmployeePaymentToSwift({ paymentId }));
    if (submitEmployeePaymentToSwift.fulfilled.match(result)) {
      closeConfirmation();
    }
  };

  const handleReject = async (paymentId: string) => {
    const result = await dispatch(
      rejectEmployeePayment({
        paymentId,
        rejectionReason: rejectionReason.trim(),
      })
    );
    if (rejectEmployeePayment.fulfilled.match(result)) {
      closeConfirmation();
    }
  };

  const handleConfirmAction = async () => {
    if (!pendingAction || !isConfirmationChecked) return;

    if (pendingAction.type === 'verify') {
      await handleVerify(pendingAction.payment.id);
      return;
    }

    if (pendingAction.type === 'reject') {
      await handleReject(pendingAction.payment.id);
      return;
    }

    await handleSubmitToSwift(pendingAction.payment.id);
  };

  return (
    <EmployeeLayout>
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900">Payment Review Queue</h1>
          <p className="mt-2 text-gray-600">
            Verify payee account information and SWIFT/BIC details before forwarding payments to the SWIFT simulator.
          </p>
        </div>

        {error && (
          <Alert
            type="error"
            message={error}
            onClose={() => dispatch(clearEmployeeError())}
          />
        )}

        <Card className="mb-6">
          <div className="flex flex-wrap gap-2">
            {statuses.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setFilterStatus(status)}
                className={getFilterButtonClass(filterStatus === status)}
              >
                {status}
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <EmployeePaymentsContent
            payments={filteredPayments}
            isLoading={paymentsLoading}
            actionLoadingId={actionLoadingId}
            onOpenConfirmation={openConfirmation}
          />
        </Card>

        {pendingAction && (
          <TransactionConfirmationDialog
            action={pendingAction}
            checked={isConfirmationChecked}
            isLoading={actionLoadingId === pendingAction.payment.id}
            rejectionReason={rejectionReason}
            onCheckedChange={setIsConfirmationChecked}
            onRejectionReasonChange={setRejectionReason}
            onCancel={closeConfirmation}
            onConfirm={handleConfirmAction}
          />
        )}
      </div>
    </EmployeeLayout>
  );
};

const employeeStatusClass: Record<EmployeePaymentReview['status'], string> = {
  'Under Review': 'bg-orange-100 text-orange-800',
  Verified: 'bg-green-100 text-green-800',
  'Submitted to SWIFT': 'bg-blue-100 text-blue-800',
  Rejected: 'bg-red-100 text-red-800',
};

const EmployeeStatusBadge: React.FC<{ status: EmployeePaymentReview['status'] }> = ({ status }) => (
  <span className={`badge ${employeeStatusClass[status]}`}>
    {status}
  </span>
);

interface EmployeePaymentsContentProps {
  payments: EmployeePaymentReview[];
  isLoading: boolean;
  actionLoadingId: string | null;
  onOpenConfirmation: (action: PendingAction) => void;
}

const EmployeePaymentsContent: React.FC<EmployeePaymentsContentProps> = ({
  payments,
  isLoading,
  actionLoadingId,
  onOpenConfirmation,
}) => {
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (payments.length === 0) {
    return <p className="py-8 text-center text-gray-600">No transactions match this filter.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1120px]">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Reference</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Customer</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Payee Details</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Bank / SWIFT</th>
            <th className="px-4 py-3 text-right font-semibold text-gray-700">Amount</th>
            <th className="px-4 py-3 text-center font-semibold text-gray-700">Status</th>
            <th className="px-4 py-3 text-center font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <EmployeePaymentRow
              key={payment.id}
              payment={payment}
              isLoading={actionLoadingId === payment.id}
              onOpenConfirmation={onOpenConfirmation}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

interface EmployeePaymentRowProps {
  payment: EmployeePaymentReview;
  isLoading: boolean;
  onOpenConfirmation: (action: PendingAction) => void;
}

const EmployeePaymentRow: React.FC<EmployeePaymentRowProps> = ({
  payment,
  isLoading,
  onOpenConfirmation,
}) => {
  const canVerify = payment.status === 'Under Review';
  const canReject = payment.status === 'Under Review';
  const canSubmit = payment.status === 'Verified';

  return (
    <tr className="border-b align-top hover:bg-gray-50">
      <td className="px-4 py-4">
        <p className="font-semibold">{payment.paymentReference}</p>
        <p className="mt-1 text-xs text-gray-500">
          {new Date(payment.createdAt).toLocaleString()}
        </p>
      </td>
      <td className="px-4 py-4">
        <p className="font-semibold">{payment.customerName}</p>
        <p className="mt-1 font-mono text-xs text-gray-500">
          {payment.customerAccountNumber}
        </p>
      </td>
      <td className="px-4 py-4">
        <p className="font-semibold">{payment.beneficiaryName}</p>
        <p className="mt-1 font-mono text-xs text-gray-500">
          {payment.recipientAccountNumber}
        </p>
      </td>
      <td className="px-4 py-4">
        <p className="font-semibold">{payment.recipientBankName}</p>
        <p className="mt-1 text-xs text-gray-500">{payment.country}</p>
        <p className="mt-2 inline-flex rounded bg-slate-100 px-2 py-1 font-mono text-xs font-bold text-slate-700">
          {payment.swiftCode}
        </p>
      </td>
      <td className="px-4 py-4 text-right font-semibold">
        {payment.currency} {payment.amount.toLocaleString()}
      </td>
      <td className="px-4 py-4 text-center">
        <EmployeeStatusBadge status={payment.status} />
        {payment.swiftReference && (
          <p className="mt-2 font-mono text-xs text-blue-900">{payment.swiftReference}</p>
        )}
      </td>
      <td className="px-4 py-4">
        <div className="mx-auto flex max-w-44 flex-col gap-2">
          <Button
            type="button"
            variant="primary"
            onClick={() => onOpenConfirmation({ type: 'verify', payment })}
            isLoading={isLoading && canVerify}
            disabled={!canVerify || isLoading}
            className="w-full"
          >
            Verify
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenConfirmation({ type: 'submit', payment })}
            isLoading={isLoading && canSubmit}
            disabled={!canSubmit || isLoading}
            className="w-full"
          >
            Submit to SWIFT
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenConfirmation({ type: 'reject', payment })}
            isLoading={isLoading && canReject}
            disabled={!canReject || isLoading}
            className="w-full border-red-200 text-red-700 hover:bg-red-50"
          >
            Reject
          </Button>
        </div>
      </td>
    </tr>
  );
};

interface TransactionConfirmationDialogProps {
  action: PendingAction;
  checked: boolean;
  isLoading: boolean;
  rejectionReason: string;
  onCheckedChange: (checked: boolean) => void;
  onRejectionReasonChange: (reason: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

const TransactionConfirmationDialog: React.FC<TransactionConfirmationDialogProps> = ({
  action,
  checked,
  isLoading,
  rejectionReason,
  onCheckedChange,
  onRejectionReasonChange,
  onCancel,
  onConfirm,
}) => {
  const { payment, type } = action;
  const isRejectAction = type === 'reject';
  const copy = actionCopy[type];
  const trimmedRejectionReason = rejectionReason.trim();
  const isRejectionReasonValid = !isRejectAction || validationPatterns.rejectionReason.test(trimmedRejectionReason);
  const showRejectionReasonError = isRejectAction && trimmedRejectionReason.length > 0 && !isRejectionReasonValid;
  const canConfirm = checked && isRejectionReasonValid;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 px-4 py-6">
      <dialog
        open
        aria-modal="true"
        aria-labelledby="employee-confirmation-title"
        className="m-0 w-full max-w-3xl overflow-hidden rounded-2xl bg-white p-0 shadow-2xl"
      >
        <div className="border-b border-slate-200 px-6 py-5">
          <p className="text-sm font-black uppercase tracking-wide text-blue-900">
            Employee confirmation required
          </p>
          <h2 id="employee-confirmation-title" className="mt-1 text-2xl font-black text-slate-950">
            {copy.title}
          </h2>
          <p className="mt-2 text-sm font-semibold text-slate-600">
            Review the transaction details before continuing. This step prevents accidental verification or SWIFT submission.
          </p>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
          <div className="grid gap-4 md:grid-cols-2">
            <ReviewBlock label="Payment Reference" value={payment.paymentReference} />
            <ReviewBlock label="Current Status" value={payment.status} />
            <ReviewBlock label="Customer" value={payment.customerName} />
            <ReviewBlock label="Customer Account" value={payment.customerAccountNumber} mono />
            <ReviewBlock label="Payee Name" value={payment.beneficiaryName} />
            <ReviewBlock label="Payee Account" value={payment.recipientAccountNumber} mono />
            <ReviewBlock label="Recipient Bank" value={payment.recipientBankName} />
            <ReviewBlock label="Country" value={payment.country} />
            <ReviewBlock label="SWIFT/BIC Code" value={payment.swiftCode} mono emphasized />
            <ReviewBlock label="Amount" value={`${payment.currency} ${payment.amount.toLocaleString()}`} emphasized />
          </div>

          {type === 'submit' && <VerificationRecord payment={payment} />}

          {isRejectAction && (
            <RejectionReasonField
              rejectionReason={rejectionReason}
              showError={showRejectionReasonError}
              onChange={onRejectionReasonChange}
            />
          )}

          <label className="mt-5 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm font-bold text-blue-950">
            <input
              type="checkbox"
              checked={checked}
              onChange={(event) => onCheckedChange(event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-blue-300 text-blue-900 focus:ring-blue-900"
            />
            <span>{copy.confirmationLabel}</span>
          </label>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-6 py-5 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="sm:min-w-32"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant={copy.buttonVariant}
            onClick={onConfirm}
            isLoading={isLoading}
            disabled={!canConfirm}
            className="sm:min-w-44"
          >
            {copy.confirmLabel}
          </Button>
        </div>
      </dialog>
    </div>
  );
};

interface ReviewBlockProps {
  label: string;
  value: string;
  mono?: boolean;
  emphasized?: boolean;
}

const getReviewBlockValueClass = (mono: boolean, emphasized: boolean) => {
  const fontClass = mono ? 'font-mono' : 'font-semibold';
  const colorClass = emphasized ? 'text-blue-900' : 'text-slate-900';

  return `mt-2 break-words text-sm ${fontClass} ${colorClass}`;
};

const getRejectionReasonFieldClass = (showError: boolean) => {
  const baseClass = 'mt-2 w-full rounded-xl border px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:ring-2';

  if (showError) {
    return `${baseClass} border-red-500 focus:border-red-600 focus:ring-red-600/20`;
  }

  return `${baseClass} border-slate-300 focus:border-blue-900 focus:ring-blue-900/20`;
};

const getRejectionReasonHintClass = (showError: boolean) => {
  const baseClass = 'mt-2 text-xs font-semibold';

  if (showError) {
    return `${baseClass} text-red-600`;
  }

  return `${baseClass} text-slate-500`;
};

const getRejectionReasonHint = (showError: boolean) => {
  if (showError) {
    return validationMessages.rejectionReason;
  }

  return 'Minimum 5 characters. Only basic punctuation is accepted by the backend.';
};

const formatVerificationRecord = (payment: EmployeePaymentReview) => {
  const verifier = payment.verifiedBy || 'employee';

  if (!payment.verifiedAt) {
    return `Verified by ${verifier}.`;
  }

  return `Verified by ${verifier} on ${new Date(payment.verifiedAt).toLocaleString()}.`;
};

const VerificationRecord: React.FC<{ payment: EmployeePaymentReview }> = ({ payment }) => (
  <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-900">
    <p className="font-black">Verification record</p>
    <p className="mt-1">{formatVerificationRecord(payment)}</p>
    {payment.verificationNotes && (
      <p className="mt-1 font-semibold">{payment.verificationNotes}</p>
    )}
  </div>
);

interface RejectionReasonFieldProps {
  rejectionReason: string;
  showError: boolean;
  onChange: (reason: string) => void;
}

const RejectionReasonField: React.FC<RejectionReasonFieldProps> = ({
  rejectionReason,
  showError,
  onChange,
}) => (
  <div className="mt-5">
    <label htmlFor="rejection-reason" className="text-sm font-black text-slate-700">
      Rejection reason
    </label>
    <textarea
      id="rejection-reason"
      value={rejectionReason}
      onChange={(event) => onChange(event.target.value)}
      rows={4}
      minLength={5}
      maxLength={250}
      required
      placeholder="Explain why this transaction cannot be verified."
      className={getRejectionReasonFieldClass(showError)}
    />
    <p className={getRejectionReasonHintClass(showError)}>
      {getRejectionReasonHint(showError)}
    </p>
  </div>
);

const ReviewBlock: React.FC<ReviewBlockProps> = ({ label, value, mono = false, emphasized = false }) => (
  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
    <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
    <p className={getReviewBlockValueClass(mono, emphasized)}>
      {value}
    </p>
  </div>
);
