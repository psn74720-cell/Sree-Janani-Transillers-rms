import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LayoutDashboard, Package, ShoppingCart, LogOut, Plus } from 'lucide-react';
import ProductionList from '../Production/ProductionList';
import ProductionForm from '../Production/ProductionForm';
import SalesList from '../Sales/SalesList';
import SalesForm from '../Sales/SalesForm';
import Overview from './Overview';

type TabType = 'overview' | 'production' | 'sales';

export default function Dashboard() {
  const { profile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [showProductionForm, setShowProductionForm] = useState(false);
  const [showSalesForm, setShowSalesForm] = useState(false);
  const [productionRefresh, setProductionRefresh] = useState(0);
  const [salesRefresh, setSalesRefresh] = useState(0);

  const handleProductionSuccess = () => {
    setShowProductionForm(false);
    setProductionRefresh((prev) => prev + 1);
  };

  const handleSalesSuccess = () => {
    setShowSalesForm(false);
    setSalesRefresh((prev) => prev + 1);
  };

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: LayoutDashboard },
    { id: 'production' as TabType, label: 'Production', icon: Package },
    { id: 'sales' as TabType, label: 'Sales', icon: ShoppingCart },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">RMS Production</h1>
                  <p className="text-xs text-gray-500">Ready Mix & CLC Brick</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{profile?.full_name}</p>
                <p className="text-xs text-gray-500 capitalize">
                  {profile?.role}
                </p>
              </div>
              <button
                onClick={() => signOut()}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
                title="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex gap-2 bg-white rounded-xl p-1 shadow-sm border border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition ${
                    activeTab === tab.id
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {activeTab !== 'overview' && (
            <button
              onClick={() => {
                if (activeTab === 'production') {
                  setShowProductionForm(true);
                } else if (activeTab === 'sales') {
                  setShowSalesForm(true);
                }
              }}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition duration-200 shadow-sm"
            >
              <Plus className="w-5 h-5" />
              Add {activeTab === 'production' ? 'Production' : 'Sales'}
            </button>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {activeTab === 'overview' && (
            <Overview productionRefresh={productionRefresh} salesRefresh={salesRefresh} />
          )}
          {activeTab === 'production' && <ProductionList refresh={productionRefresh} />}
          {activeTab === 'sales' && <SalesList refresh={salesRefresh} />}
        </div>
      </div>

      {showProductionForm && (
        <ProductionForm
          onSuccess={handleProductionSuccess}
          onCancel={() => setShowProductionForm(false)}
        />
      )}

      {showSalesForm && (
        <SalesForm
          onSuccess={handleSalesSuccess}
          onCancel={() => setShowSalesForm(false)}
        />
      )}
    </div>
  );
}
