import React from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/useAppDispatch';
import { fetchPayments } from '../../store/slices/paymentSlice';
import { MainLayout } from '../../components/layouts/MainLayout';
import { Card } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Link } from 'react-router-dom';
import { ArrowRight, Plus } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { items: payments, loading } = useAppSelector((state) => state.payments);

  React.useEffect(() => {
    if (user?.id) {
      dispatch(fetchPayments(user.id));
    }
  }, [user?.id, dispatch]);

  const recentPayments = payments.slice(0, 5);
  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const formattedTotalAmount = new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
  }).format(totalAmount);
  const pendingCount = payments.filter((p) => p.status === 'Pending').length;
  const completedCount = payments.filter((p) => p.status === 'Completed').length;

  return (
    <MainLayout>
      <div>
        <h1 className="text-3xl font-bold text-blue-900 mb-8">Welcome, {user?.fullName}!</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-2">Total Payments</p>
              <p className="text-3xl font-bold text-blue-900">{payments.length}</p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-2">Total Amount</p>
              <p className="text-3xl font-bold text-blue-900">{formattedTotalAmount}</p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-2">Pending</p>
              <p className="text-3xl font-bold text-warning">{pendingCount}</p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-2">Completed</p>
              <p className="text-3xl font-bold text-success">{completedCount}</p>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <Card title="Quick Actions">
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/payments/create"
                className="btn btn-primary flex items-center justify-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Make Payment
              </Link>
              <Link
                to="/beneficiaries"
                className="btn btn-secondary flex items-center justify-center gap-2"
              >
                Manage Beneficiaries
              </Link>
            </div>
          </Card>
        </div>

        {/* Recent Payments */}
        <Card title="Recent Payments">
          {loading ? (
            <LoadingSpinner />
          ) : recentPayments.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No payments yet. Create your first payment!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Reference</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Recipient</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Provider</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Amount</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPayments.map((payment) => (
                    <tr key={payment.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{payment.paymentReference}</td>
                      <td className="py-3 px-4">{payment.beneficiaryName}</td>
                      <td className="py-3 px-4">{payment.provider}</td>
                      <td className="text-right py-3 px-4 font-semibold">
                        {payment.currency} {payment.amount.toLocaleString()}
                      </td>
                      <td className="text-center py-3 px-4">
                        <StatusBadge status={payment.status} />
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {payments.length > 5 && (
            <Link
              to="/payments"
              className="flex items-center justify-center gap-2 mt-6 text-blue-900 hover:text-blue-950 font-semibold"
            >
              View all payments
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </Card>
      </div>
    </MainLayout>
  );
};
