import React from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/useAppDispatch';
import { fetchPayments } from '../../store/slices/paymentSlice';
import { MainLayout } from '../../components/layouts/MainLayout';
import { Card } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Link } from 'react-router-dom';

export const PaymentsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { items: payments, loading } = useAppSelector((state) => state.payments);
  const [filterStatus, setFilterStatus] = React.useState<string>('All');

  React.useEffect(() => {
    if (user?.id) {
      dispatch(fetchPayments(user.id));
    }
  }, [user?.id, dispatch]);

  const filteredPayments = filterStatus === 'All'
    ? payments
    : payments.filter((p) => p.status === filterStatus);

  const statuses = ['All', 'Pending', 'Under Review', 'Approved', 'Rejected', 'Completed'];

  return (
    <MainLayout>
      <div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-blue-900">Payment History</h1>
          <Link to="/payments/create" className="btn btn-primary">
            Make Payment
          </Link>
        </div>

        {/* Filter Buttons */}
        <Card className="mb-6">
          <div className="flex flex-wrap gap-2">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
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

        {/* Payments Table */}
        <Card>
          {loading ? (
            <LoadingSpinner />
          ) : filteredPayments.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No payments found.</p>
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
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-semibold">{payment.paymentReference}</td>
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
                      <td className="text-center py-3 px-4">
                        <Link
                          to={`/payments/${payment.id}`}
                          className="text-blue-900 hover:underline text-sm font-semibold"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </MainLayout>
  );
};
