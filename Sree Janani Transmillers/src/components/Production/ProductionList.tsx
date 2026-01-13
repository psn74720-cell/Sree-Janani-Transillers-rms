import { useEffect, useState } from 'react';
import { supabase, ProductionRecord } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Package, Trash2, Calendar, Hash } from 'lucide-react';

interface ProductionListProps {
  refresh: number;
}

export default function ProductionList({ refresh }: ProductionListProps) {
  const { profile } = useAuth();
  const [records, setRecords] = useState<ProductionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecords();
  }, [refresh]);

  const loadRecords = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('production_records')
      .select('*')
      .order('production_date', { ascending: false });

    if (!error && data) {
      setRecords(data);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this production record?')) return;

    const { error } = await supabase.from('production_records').delete().eq('id', id);

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
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 text-lg">No production records yet</p>
        <p className="text-gray-500 text-sm">Add your first production record to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {records.map((record) => (
        <div
          key={record.id}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition duration-200"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-lg mb-1">
                {getProductLabel(record.product_type)}
              </h3>
              <p className="text-3xl font-bold text-orange-500">
                {record.quantity} <span className="text-lg text-gray-600">{record.unit}</span>
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

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Hash className="w-4 h-4" />
              <span>Batch: {record.batch_number}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{new Date(record.production_date).toLocaleDateString()}</span>
            </div>
            {record.quality_grade && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">Grade:</span> {record.quality_grade}
              </div>
            )}
            {record.notes && (
              <div className="text-sm text-gray-600 mt-3 pt-3 border-t border-gray-100">
                {record.notes}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
