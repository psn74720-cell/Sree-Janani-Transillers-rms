import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Package, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';

interface OverviewProps {
  productionRefresh: number;
  salesRefresh: number;
}

interface Stats {
  totalProduction: number;
  totalSales: number;
  totalRevenue: number;
  pendingPayments: number;
}

export default function Overview({ productionRefresh, salesRefresh }: OverviewProps) {
  const [stats, setStats] = useState<Stats>({
    totalProduction: 0,
    totalSales: 0,
    totalRevenue: 0,
    pendingPayments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [productionRefresh, salesRefresh]);

  const loadStats = async () => {
    setLoading(true);

    const [productionResult, salesResult, revenueResult, pendingResult] = await Promise.all([
      supabase.from('production_records').select('quantity', { count: 'exact' }),
      supabase.from('sales_records').select('quantity', { count: 'exact' }),
      supabase.from('sales_records').select('total_amount'),
      supabase
        .from('sales_records')
        .select('total_amount')
        .in('payment_status', ['pending', 'partial']),
    ]);

    const productionCount = productionResult.count || 0;
    const salesCount = salesResult.count || 0;
    const totalRevenue = revenueResult.data?.reduce((sum, record) => sum + record.total_amount, 0) || 0;
    const pendingPayments = pendingResult.data?.reduce((sum, record) => sum + record.total_amount, 0) || 0;

    setStats({
      totalProduction: productionCount,
      totalSales: salesCount,
      totalRevenue,
      pendingPayments,
    });

    setLoading(false);
  };

  const statCards = [
    {
      title: 'Total Production Records',
      value: stats.totalProduction,
      icon: Package,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Sales',
      value: stats.totalSales,
      icon: ShoppingCart,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`,
      icon: DollarSign,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Pending Payments',
      value: `₹${stats.pendingPayments.toLocaleString('en-IN')}`,
      icon: TrendingUp,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
        <p className="text-gray-600">
          Monitor your production and sales performance at a glance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className={`${card.bgColor} rounded-xl p-6 border border-gray-200`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-gray-700 text-sm font-medium mb-1">{card.title}</h3>
              <p className="text-3xl font-bold text-gray-900">{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-8 text-white">
        <h3 className="text-2xl font-bold mb-2">Welcome to RMS Production System</h3>
        <p className="text-orange-100 mb-4">
          Manage your Ready Mix Concrete, CLC Brick, and Platform Block production and sales efficiently.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <h4 className="font-semibold mb-1">Track Production</h4>
            <p className="text-sm text-orange-100">
              Record and monitor all production batches with quality grades
            </p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <h4 className="font-semibold mb-1">Manage Sales</h4>
            <p className="text-sm text-orange-100">
              Keep track of customer orders and payment status
            </p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <h4 className="font-semibold mb-1">Role-Based Access</h4>
            <p className="text-sm text-orange-100">
              Owners have full control, employees can add and view records
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
