import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, FileText, Send } from 'lucide-react';
import { MainLayout } from '../../components/layouts/MainLayout';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Payment } from '../../types';

interface PaymentSuccessLocationState {
  payment?: Payment;
}

export const PaymentSuccessPage: React.FC = () => {
  const location = useLocation();
  const { payment } = (location.state || {}) as PaymentSuccessLocationState;

  return (
    <MainLayout>
      <div className="mx-auto max-w-3xl">
        <Card>
          <div className="text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-700">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <h1 className="text-3xl font-bold text-blue-900">Payment submitted</h1>
            <p className="mt-3 text-gray-600">
              Your payment has been recorded and is now pending processing.
            </p>
          </div>

          {payment ? (
            <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-5">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm text-gray-600">Reference</p>
                  <p className="text-xl font-bold text-blue-900">{payment.paymentReference}</p>
                </div>
                <StatusBadge status={payment.status} />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-600">Recipient</p>
                  <p className="font-semibold">{payment.beneficiaryName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="font-semibold">
                    {payment.currency} {payment.amount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Provider</p>
                  <p className="font-semibold">{payment.provider}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Created</p>
                  <p className="font-semibold">{new Date(payment.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-5 text-center text-gray-600">
              Payment details are available from your payment history.
            </p>
          )}

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            {payment && (
              <Link
                to={`/payments/${payment.id}`}
                className="btn btn-primary flex flex-1 items-center justify-center gap-2"
              >
                <FileText className="h-4 w-4" />
                View Details
              </Link>
            )}
            <Link
              to="/payments/create"
              className="btn btn-secondary flex flex-1 items-center justify-center gap-2"
            >
              <Send className="h-4 w-4" />
              Make Another Payment
            </Link>
            <Link
              to="/payments"
              className="btn btn-outline flex flex-1 items-center justify-center"
            >
              Payment History
            </Link>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};
