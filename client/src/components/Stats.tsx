import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText,
  Calendar,
  TrendingUp
} from 'lucide-react';
import type { ActivityData, CategoryData, DecisionsData, StatsSummary } from '../types';
import { CATEGORY_COLORS, COLORS, PERIODS } from '../constants';



const Stats: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<string>('week');
  
  const [summary, setSummary] = useState<StatsSummary | null>(null);
  const [activity, setActivity] = useState<ActivityData[]>([]);
  const [decisions, setDecisions] = useState<DecisionsData | null>(null);
  const [categories, setCategories] = useState<CategoryData>({});

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        const params = { period };
        
        const [summaryRes, activityRes, decisionsRes, categoriesRes] = await Promise.all([
          axios.get('/api/v1/stats/summary', { params }),
          axios.get('/api/v1/stats/chart/activity', { params }),
          axios.get('/api/v1/stats/chart/decisions', { params }),
          axios.get('/api/v1/stats/chart/categories', { params })
        ]);

        setSummary(summaryRes.data);
        setActivity(activityRes.data);
        setDecisions(decisionsRes.data);
        setCategories(categoriesRes.data);
        
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [period]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}м ${remainingSeconds}с`;
  };

  const pieData = decisions ? [
    { name: 'Одобрено', value: decisions.approved, color: COLORS.approved },
    { name: 'Отклонено', value: decisions.rejected, color: COLORS.rejected },
    { name: 'На доработку', value: decisions.requestChanges, color: COLORS.requestChanges }
  ] : [];

  const categoryData = Object.entries(categories).map(([name, value], index) => ({
    name,
    value,
    fill: CATEGORY_COLORS[index % CATEGORY_COLORS.length]
  }));

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Загрузка статистики...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className=" text-centertext-3xl font-bold text-gray-900">Статистика </h1>
          
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Период:</span>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {PERIODS.map(p => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-[15px] p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-[10px]">
                    <FileText className="text-blue-600" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Всего проверено</h3>
                </div>
                <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">За выбранный период:</span>
                    <span className="text-2xl font-bold text-blue-600">
                    {(() => {
                        switch (period) {
                        case 'today': return summary?.totalReviewedToday || 0;
                        case 'week': return summary?.totalReviewedThisWeek || 0;
                        case 'month': return summary?.totalReviewedThisMonth || 0;
                        default: return summary?.totalReviewed || 0;
                        }
                    })()}
                    </span>
                </div>
                </div>
            </div>

            <div className="bg-white rounded-[15px] p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-[10px]">
                    <CheckCircle className="text-green-600" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Одобрено</h3>
                </div>
                <div className="text-3xl font-bold text-green-600 mb-2">
                {summary?.approvedPercentage?.toFixed(1) || 0}%
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${summary?.approvedPercentage || 0}%` }}
                ></div>
                </div>
            </div>

            <div className="bg-white rounded-[15px] p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-[10px]">
                    <XCircle className="text-red-600" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Отклонено</h3>
                </div>
                <div className="text-3xl font-bold text-red-600 mb-2">
                {summary?.rejectedPercentage?.toFixed(1) || 0}%
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                    className="bg-red-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${summary?.rejectedPercentage || 0}%` }}
                ></div>
                </div>
            </div>

            <div className="bg-white rounded-[15px] p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-[10px]">
                    <Clock className="text-purple-600" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Среднее время</h3>
                </div>
                <div className="text-3xl font-bold text-purple-600">
                {summary?.averageReviewTime ? formatTime(summary.averageReviewTime) : '0м 0с'}
                </div>
                <p className="text-sm text-gray-500 mt-2">на проверку</p>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-[15px] p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <TrendingUp size={20} />
              Активность по дням
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [value, 'Количество']}
                    labelFormatter={(label) => `Дата: ${new Date(label).toLocaleDateString('ru-RU')}`}
                  />
                  <Legend />
                  <Bar dataKey="approved" name="Одобрено" fill={COLORS.approved} />
                  <Bar dataKey="rejected" name="Отклонено" fill={COLORS.rejected} />
                  <Bar dataKey="requestChanges" name="На доработку" fill={COLORS.requestChanges} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-[15px] p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <CheckCircle size={20} />
              Распределение решений
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(1)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Доля']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[15px] p-6 shadow-sm">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Calendar size={20} />
            Распределение по категориям
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip formatter={(value) => [value, 'Количество']} />
                <Bar dataKey="value" name="Количество объявлений">
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;