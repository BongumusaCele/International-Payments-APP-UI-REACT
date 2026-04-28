import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { clearSelectedPayment, fetchPaymentById } from '../../store/slices/paymentSlice';
import { MainLayout } from '../../components/layouts/MainLayout';
import { Card } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Alert } from '../../components/ui/Alert';

export const PaymentDetailPage: React.FC = () => {
  const { paymentId } = useParams<{ paymentId: string }>();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { selectedPayment, loading, error } = useAppSelector((state) => state.payments);

  React.useEffect(() => {
    if (user?.id && paymentId) {
      dispatch(fetchPaymentById({ userId: user.id, paymentId }));
    }

    return () => {
      dispatch(clearSelectedPayment());
    };
  }, [dispatch, paymentId, user?.id]);

  return (
    <MainLayout>
      <div className="max-w-3xl">
        <Link
          to="/payments"
          className="inline-flex items-center gap-2 text-blue-900 hover:text-blue-950 font-semibold mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to payments
        </Link>

        <h1 className="text-3xl font-bold text-blue-900 mb-8">Payment Details</h1>

        {loading ? (
          <Card>
            <LoadingSpinner />
          </Card>
        ) : error ? (
          <Alert type="error" message={error} />
        ) : selectedPayment ? (
          <Card>
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-600">Reference</p>
                <p className="text-2xl font-bold text-blue-900">{selectedPayment.paymentReference}</p>
              </div>
              <StatusBadge status={selectedPayment.status} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600">Recipient</p>
                <p className="font-semibold text-lg">{selectedPayment.beneficiaryName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Amount</p>
                <p className="font-semibold text-lg">
                  {selectedPayment.currency} {selectedPayment.amount.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Provider</p>
                <p className="font-semibold text-lg">{selectedPayment.provider}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Recipient Account</p>
                <p className="font-semibold text-lg">{selectedPayment.recipientAccountNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Bank Name</p>
                <p className="font-semibold text-lg">{selectedPayment.recipientBankName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">SWIFT Code</p>
                <p className="font-semibold text-lg">{selectedPayment.swiftCode}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Created</p>
                <p className="font-semibold">
                  {new Date(selectedPayment.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Updated</p>
                <p className="font-semibold">
                  {new Date(selectedPayment.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
        ) : (
          <Alert type="warning" message="Payment not found." />
        )}
      </div>
    </MainLayout>
  );
};
