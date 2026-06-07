import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ClipboardCheck, Send, ShieldAlert } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { EmployeeLayout } from '../../components/layouts/EmployeeLayout';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { fetchEmployeePaymentSummary, fetchEmployeePayments } from '../../store/slices/employeeSlice';
import { EmployeePaymentReview } from '../../types';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';

export const EmployeeDashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, payments, paymentsLoading, summary } = useAppSelector((state) => state.employee);

  React.useEffect(() => {
    dispatch(fetchEmployeePayments());
    dispatch(fetchEmployeePaymentSummary());
  }, [dispatch]);

  const underReviewCount = summary?.underReviewCount ?? payments.filter((payment) => payment.status === 'Under Review').length;
  const verifiedCount = summary?.verifiedCount ?? payments.filter((payment) => payment.status === 'Verified').length;
  const submittedCount = summary?.submittedCount ?? payments.filter((payment) => payment.status === 'Submitted to SWIFT').length;
  const rejectedCount = summary?.rejectedCount ?? payments.filter((payment) => payment.status === 'Rejected').length;
  const recentPayments = payments.slice(0, 4);

  return (
    <EmployeeLayout>
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900">Welcome, {user?.fullName}</h1>
          <p className="mt-2 text-gray-600">
            Review customer payment instructions before simulated SWIFT submission.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
          <Card>
            <StatCard icon={<ShieldAlert className="h-6 w-6" />} label="Under Review" value={underReviewCount} tone="warning" />
          </Card>
          <Card>
            <StatCard icon={<CheckCircle2 className="h-6 w-6" />} label="Verified" value={verifiedCount} tone="success" />
          </Card>
          <Card>
            <StatCard icon={<Send className="h-6 w-6" />} label="Submitted" value={submittedCount} tone="primary" />
          </Card>
          <Card>
            <StatCard icon={<ClipboardCheck className="h-6 w-6" />} label="Rejected" value={rejectedCount} tone="danger" />
          </Card>
        </div>

        <div className="mb-8">
          <Card title="Employee Actions">
            <Link
              to="/employee/payments"
              className="btn btn-primary inline-flex items-center justify-center gap-2"
            >
              Open Review Queue
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Card>
        </div>

        <Card title="Recent Payment Instructions">
          {paymentsLoading ? (
            <LoadingSpinner />
          ) : recentPayments.length === 0 ? (
            <p className="py-8 text-center text-gray-600">No transactions awaiting review.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Reference</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Customer</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Beneficiary</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">SWIFT/BIC</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Amount</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPayments.map((payment) => (
                    <tr key={payment.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold">{payment.paymentReference}</td>
                      <td className="px-4 py-3">{payment.customerName}</td>
                      <td className="px-4 py-3">{payment.beneficiaryName}</td>
                      <td className="px-4 py-3 font-mono text-sm">{payment.swiftCode}</td>
                      <td className="px-4 py-3 text-right font-semibold">
                        {payment.currency} {payment.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <EmployeeStatusBadge status={payment.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </EmployeeLayout>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  tone: 'primary' | 'success' | 'warning' | 'danger';
}

const statToneClass = {
  primary: 'text-blue-900 bg-blue-50',
  success: 'text-green-700 bg-green-50',
  warning: 'text-yellow-700 bg-yellow-50',
  danger: 'text-red-700 bg-red-50',
};

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, tone }) => (
  <div className="flex items-center gap-4">
    <div className={`grid h-12 w-12 place-items-center rounded-2xl ${statToneClass[tone]}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-semibold text-gray-600">{label}</p>
      <p className="text-3xl font-bold text-blue-900">{value}</p>
    </div>
  </div>
);

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
