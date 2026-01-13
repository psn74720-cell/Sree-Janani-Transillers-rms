import { useEffect, useState } from 'react';
import { supabase, SalesRecord } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { ShoppingCart, Trash2, Calendar, User, DollarSign } from 'lucide-react';

interface SalesListProps {
  refresh: number;
}

export default function SalesList({ refresh }: SalesListProps) {
  const { profile } = useAuth();
  const [records, setRecords] = useState<SalesRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecords();
  }, [refresh]);

  const loadRecords = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('sales_records')
      .select('*')
      .order('sale_date', { ascending: false });

    if (!error && data) {
      setRecords(data);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sales record?')) return;

    const { error } = await supabase.from('sales_records').delete().eq('id', id);

    if (!error) {
      loadRecords();
    }
  };

  const getProductLabel = (type: string) => {
    switch (type) {
      case 'ready_mix_concrete':
        return 'Ready Mix Concrete';
      case 'clc_brick':
        return 'CLC Brick';
      case 'platform_block':
        return 'Platform Block';
      default:
        return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'partial':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 text-lg">No sales records yet</p>
        <p className="text-gray-500 text-sm">Add your first sale to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {records.map((record) => (
        <div
          key={record.id}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition duration-200"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-gray-900 text-lg">
                  {getProductLabel(record.product_type)}
                </h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    record.payment_status
                  )}`}
                >
                  {record.payment_status.charAt(0).toUpperCase() + record.payment_status.slice(1)}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {record.quantity} {record.unit}
              </p>
            </div>
            {profile?.role === 'owner' && (
              <button
                onClick={() => handleDelete(record.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                title="Delete record"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="w-4 h-4" />
              <div>
                <div className="font-medium text-gray-900">{record.customer_name}</div>
                {record.customer_contact && (
                  <div className="text-xs">{record.customer_contact}</div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{new Date(record.sale_date).toLocaleDateString()}</span>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <DollarSign className="w-4 h-4" />
                <span>₹{record.unit_price.toLocaleString('en-IN')} per {record.unit}</span>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700 font-medium">Total Amount:</span>
                <span className="text-xl font-bold text-orange-600">
                  ₹{record.total_amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {record.notes && (
              <div className="text-sm text-gray-600 pt-2 border-t border-gray-100">
                {record.notes}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
