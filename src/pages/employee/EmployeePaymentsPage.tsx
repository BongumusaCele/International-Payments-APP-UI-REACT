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
  submitEmployeePaymentToSwift,
  verifyEmployeePayment,
} from '../../store/slices/employeeSlice';
import { EmployeePaymentReview } from '../../types';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';

const statuses = ['All', 'Under Review', 'Verified', 'Submitted to SWIFT', 'Rejected'];

type PendingAction = {
  type: 'verify' | 'submit';
  payment: EmployeePaymentReview;
};

export const EmployeePaymentsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, payments, paymentsLoading, actionLoadingId, error } = useAppSelector((state) => state.employee);
  const [filterStatus, setFilterStatus] = React.useState('All');
  const [pendingAction, setPendingAction] = React.useState<PendingAction | null>(null);
  const [isConfirmationChecked, setIsConfirmationChecked] = React.useState(false);

  React.useEffect(() => {
    dispatch(fetchEmployeePayments());
    dispatch(fetchEmployeePaymentSummary());
  }, [dispatch]);

  React.useEffect(() => {
    if (!actionLoadingId) {
      dispatch(fetchEmployeePaymentSummary());
    }
  }, [actionLoadingId, dispatch]);

  const filteredPayments = filterStatus === 'All'
    ? payments
    : payments.filter((payment) => payment.status === filterStatus);

  const openConfirmation = (action: PendingAction) => {
    setPendingAction(action);
    setIsConfirmationChecked(false);
    if (error) dispatch(clearEmployeeError());
  };

  const closeConfirmation = () => {
    if (actionLoadingId) return;
    setPendingAction(null);
    setIsConfirmationChecked(false);
  };

  const handleVerify = async (paymentId: string) => {
    if (!user) return;
    const result = await dispatch(verifyEmployeePayment({ paymentId, employee: user }));
    if (verifyEmployeePayment.fulfilled.match(result)) {
      closeConfirmation();
    }
  };

  const handleSubmitToSwift = async (paymentId: string) => {
    if (!user) return;
    const result = await dispatch(submitEmployeePaymentToSwift({ paymentId, employee: user }));
    if (submitEmployeePaymentToSwift.fulfilled.match(result)) {
      closeConfirmation();
    }
  };

  const handleConfirmAction = async () => {
    if (!pendingAction || !isConfirmationChecked) return;

    if (pendingAction.type === 'verify') {
      await handleVerify(pendingAction.payment.id);
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
                className={`rounded-lg px-4 py-2 font-medium transition-colors ${
                  filterStatus === status
                    ? 'bg-blue-900 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </Card>

        <Card>
          {paymentsLoading ? (
            <LoadingSpinner />
          ) : filteredPayments.length === 0 ? (
            <p className="py-8 text-center text-gray-600">No transactions match this filter.</p>
          ) : (
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
                  {filteredPayments.map((payment) => {
                    const isLoading = actionLoadingId === payment.id;
                    const canVerify = payment.status === 'Under Review';
                    const canSubmit = payment.status === 'Verified';

                    return (
                      <tr key={payment.id} className="border-b align-top hover:bg-gray-50">
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
                              onClick={() => openConfirmation({ type: 'verify', payment })}
                              isLoading={isLoading && canVerify}
                              disabled={!canVerify || isLoading}
                              className="w-full"
                            >
                              Verify
                            </Button>
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={() => openConfirmation({ type: 'submit', payment })}
                              isLoading={isLoading && canSubmit}
                              disabled={!canSubmit || isLoading}
                              className="w-full"
                            >
                              Submit to SWIFT
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {pendingAction && (
          <TransactionConfirmationDialog
            action={pendingAction}
            checked={isConfirmationChecked}
            isLoading={actionLoadingId === pendingAction.payment.id}
            onCheckedChange={setIsConfirmationChecked}
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

interface TransactionConfirmationDialogProps {
  action: PendingAction;
  checked: boolean;
  isLoading: boolean;
  onCheckedChange: (checked: boolean) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

const TransactionConfirmationDialog: React.FC<TransactionConfirmationDialogProps> = ({
  action,
  checked,
  isLoading,
  onCheckedChange,
  onCancel,
  onConfirm,
}) => {
  const { payment, type } = action;
  const isSubmitAction = type === 'submit';
  const title = isSubmitAction ? 'Submit Transaction to SWIFT' : 'Verify Transaction';
  const confirmationLabel = isSubmitAction
    ? 'I confirm this transaction has been verified and is ready for simulated SWIFT submission.'
    : 'I confirm the payee account information and SWIFT/BIC details are appropriate and correct.';

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 px-4 py-6">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="employee-confirmation-title"
        className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="border-b border-slate-200 px-6 py-5">
          <p className="text-sm font-black uppercase tracking-wide text-blue-900">
            Employee confirmation required
          </p>
          <h2 id="employee-confirmation-title" className="mt-1 text-2xl font-black text-slate-950">
            {title}
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

          {isSubmitAction && (
            <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-900">
              <p className="font-black">Verification record</p>
              <p className="mt-1">
                Verified by {payment.verifiedBy || 'employee'} {payment.verifiedAt ? `on ${new Date(payment.verifiedAt).toLocaleString()}` : ''}.
              </p>
              {payment.verificationNotes && (
                <p className="mt-1 font-semibold">{payment.verificationNotes}</p>
              )}
            </div>
          )}

          <label className="mt-5 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm font-bold text-blue-950">
            <input
              type="checkbox"
              checked={checked}
              onChange={(event) => onCheckedChange(event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-blue-300 text-blue-900 focus:ring-blue-900"
            />
            <span>{confirmationLabel}</span>
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
            variant={isSubmitAction ? 'secondary' : 'primary'}
            onClick={onConfirm}
            isLoading={isLoading}
            disabled={!checked}
            className="sm:min-w-44"
          >
            {isSubmitAction ? 'Confirm Submit' : 'Confirm Verify'}
          </Button>
        </div>
      </section>
    </div>
  );
};

interface ReviewBlockProps {
  label: string;
  value: string;
  mono?: boolean;
  emphasized?: boolean;
}

const ReviewBlock: React.FC<ReviewBlockProps> = ({ label, value, mono = false, emphasized = false }) => (
  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
    <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
    <p className={`mt-2 break-words text-sm ${mono ? 'font-mono' : 'font-semibold'} ${emphasized ? 'text-blue-900' : 'text-slate-900'}`}>
      {value}
    </p>
  </div>
);
