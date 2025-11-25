import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  XCircle, 
  Edit3,
  User,
  Clock,
} from 'lucide-react';
import type { Ad, AdsResponse } from '../types';
import { useListState } from '../hooks/useListState';
import { useFilters } from '../hooks/useFilters';
import { REASON_TEMPLATES } from '../constants';
import { buildNavigationParams } from '../utils/queryParams';

const AdDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ad, setAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnReason, setReturnReason] = useState('');
  const [customReturnReason, setCustomReturnReason] = useState('');
  const [returnComment, setReturnComment] = useState('');
  const { sortBy, sortOrder } = useListState();
  const [filters] = useFilters();
  const [adsList, setAdsList] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const response = await axios.get(`/api/v1/ads/${id}`);
        setAd(response.data);

        const params = buildNavigationParams(sortBy, sortOrder, filters);
        const listResponse = await axios.get<AdsResponse>('/api/v1/ads', { params });
        
        const adsIds = listResponse.data.ads.map((ad: Ad) => ad.id.toString());
        setAdsList(adsIds);
        const index = adsIds.indexOf(id!);
        setCurrentIndex(index);
      } catch (error) {
        console.error('Error fetching ad:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAd();
  }, [id, sortBy, sortOrder, filters]);

  const handleApprove = async () => {
    try {
      await axios.post(`/api/v1/ads/${id}/approve`);
      const response = await axios.get(`/api/v1/ads/${id}`);
      setAd(response.data);
    } catch (error) {
      console.error('Error approving ad:', error);
    }
  };

  const handleNextAd = () => {
    if (currentIndex < adsList.length - 1) {
      const nextId = adsList[currentIndex + 1];
      navigate(`/item/${nextId}`);
    }
  };

  const handlePrevAd = () => {
    if (currentIndex > 0) {
      const prevId = adsList[currentIndex - 1];
      navigate(`/item/${prevId}`);
    }
  };

  const handleReject = async () => {
    if (!rejectReason) return;
    
    try {
      const reason = rejectReason === 'Другое' ? customReason : rejectReason;
      await axios.post(`/api/v1/ads/${id}/reject`, { reason });
      setShowRejectModal(false);
      setRejectReason('');
      setCustomReason('');

      const response = await axios.get(`/api/v1/ads/${id}`);
      setAd(response.data);
    } catch (error) {
      console.error('Error rejecting ad:', error);
    }
  };

  const handleReturnForRevision = async () => {
    if (!returnReason) return;
    
    try {
      const reason = returnReason === 'Другое' ? customReturnReason : returnReason;
      await axios.post(`/api/v1/ads/${id}/request-changes`, { 
        reason: reason,
        comment: returnComment
      });
      
      setShowReturnModal(false);
      setReturnReason('');
      setCustomReturnReason('');
      setReturnComment('');

      const response = await axios.get(`/api/v1/ads/${id}`);
      setAd(response.data);
    } catch (error) {
      console.error('Error returning ad for revision:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Одобрено';
      case 'rejected': return 'Отклонено';
      case 'pending': return 'На модерации';
      case 'draft': return 'Черновик';
      default: return status;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'approved': return 'text-green-600';
      case 'rejected': return 'text-red-600';
      case 'returned': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Загрузка...</div>
      </div>
    );
  }

  if (!ad) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-red-600">Объявление не найдено</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate('/list')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft size={20} />
            К списку
          </button>
          
          <div className="flex items-center gap-4">
            <button onClick={() => handlePrevAd()} className="flex items-center gap-2 px-4 py-2 border rounded-[10px] hover:bg-gray-50 transition-colors">
              <ArrowLeft size={18} />
              Предыдущее
            </button>
            <button onClick={() => handleNextAd()} className="flex items-center gap-2 px-4 py-2 border rounded-[10px] hover:bg-gray-50 transition-colors">
              Следующее
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[15px] p-6 shadow-sm">
              <div className="space-y-4">
                <div className="rounded-[15px] overflow-hidden">
                  <img
                    src={ad.images[activeImage]}
                    alt={ad.title}
                    className="w-full h-96 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://picsum.photos/600/400?grayscale';
                    }}
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto">
                  {ad.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-[10px] overflow-hidden border-2 ${
                        activeImage === index ? 'border-blue-500' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${ad.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://picsum.photos/100/100?grayscale';
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[15px] p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Описание</h2>
              <p className="text-gray-700 leading-relaxed">{ad.description}</p>
            </div>

            <div className="bg-white rounded-[15px] p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Характеристики</h2>
              <div className="grid gap-3">
                {Object.entries(ad.characteristics).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-600">{key}:</span>
                    <span className="text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-[15px] p-6 shadow-sm">
              <div className="flex flex-col justify-between items-center gap-[15px]">
                <h1 className="text-2xl font-bold text-gray-900">{ad.title}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ad.status)}`}>
                  {getStatusText(ad.status)}
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-600">Цена:</span>
                  <span className="text-2xl font-bold text-green-600">{ad.price.toLocaleString()} ₽</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Категория:</span>
                  <span className="font-medium">{ad.category}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Приоритет:</span>
                  <span className={`font-medium ${ad.priority === 'urgent' ? 'text-red-500' : 'text-gray-500'}`}>
                    {ad.priority === 'urgent' ? 'Срочный' : 'Обычный'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Создано:</span>
                  <span className="text-sm text-gray-500">
                    {new Date(ad.createdAt).toLocaleDateString('ru-RU')}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[15px] p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <User size={20} />
                Информация о продавце
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Имя:</span>
                  <span className="font-medium">{ad.seller.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Рейтинг:</span>
                  <span className="font-medium">{ad.seller.rating}/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Объявлений:</span>
                  <span className="font-medium">{ad.seller.totalAds}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Зарегистрирован:</span>
                  <span className="text-sm text-gray-500">
                    {new Date(ad.seller.registeredAt).toLocaleDateString('ru-RU')}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[15px] p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Clock size={20} />
                История модерации
              </h2>
              <div className="space-y-4">
                {ad.moderationHistory.length > 0 ? (
                  ad.moderationHistory.map((history) => (
                    <div key={history.id} className="border-l-4 border-gray-200 pl-4 py-2">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium">{history.moderatorName}</span>
                        <span className={`font-medium ${getActionColor(history.action)}`}>
                          {getStatusText(history.action)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 mb-2">
                        {new Date(history.timestamp).toLocaleString('ru-RU')}
                      </div>
                      {history.reason && (
                        <div className="text-sm text-gray-700">
                          <strong>Причина:</strong> {history.reason}
                        </div>
                      )}
                      {history.comment && (
                        <div className="text-sm text-gray-700 mt-1">
                          <strong>Комментарий:</strong> {history.comment}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 text-center py-4">
                    История модерации отсутствует
                  </div>
                )}
              </div>
            </div>

            
          </div>
        </div>
        <div className="bg-white rounded-[15px] p-6 shadow-sm">
          <div className="flex gap-[15px]">
            <button
              onClick={handleApprove}
              className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-[10px] transition-colors font-semibold"
            >
              <CheckCircle size={20} />
              Одобрить
            </button>
            <button
              onClick={() => setShowRejectModal(true)}
              className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-[10px] transition-colors font-semibold"
            >
              <XCircle size={20} />
              Отклонить
            </button>
            <button
              onClick={() => setShowReturnModal(true)}
              className="w-full flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-4 rounded-[10px] transition-colors font-semibold"
            >
              <Edit3 size={20} />
              Вернуть на доработку
            </button>
          </div>
        </div>
      </div>

      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[15px] p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Укажите причину отклонения</h3>
            
            <div className="space-y-3 mb-4">
              {REASON_TEMPLATES.map((reason) => (
                <label key={reason} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="rejectReason"
                    value={reason}
                    checked={rejectReason === reason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="text-red-500"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>

            {rejectReason === 'Другое' && (
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Укажите причину..."
                className="w-full p-3 border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                rows={3}
              />
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                  setCustomReason('');
                }}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-[10px] hover:bg-gray-50 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason || (rejectReason === 'Другое' && !customReason)}
                className="flex-1 py-2 px-4 bg-red-500 text-white rounded-[10px] hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Отклонить
              </button>
            </div>
          </div>
        </div>
      )}

      {showReturnModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[15px] p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Укажите причину возврата на доработку</h3>
            
            <div className="space-y-3 mb-4">
              {REASON_TEMPLATES.map((reason) => (
                <label key={reason} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="returnReason"
                    value={reason}
                    checked={returnReason === reason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    className="text-yellow-500"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>

            {returnReason === 'Другое' && (
              <textarea
                value={customReturnReason}
                onChange={(e) => setCustomReturnReason(e.target.value)}
                placeholder="Укажите причину..."
                className="w-full p-3 border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none mb-3"
                rows={3}
              />
            )}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Дополнительный комментарий:</label>
              <textarea
                value={returnComment}
                onChange={(e) => setReturnComment(e.target.value)}
                placeholder="Введите комментарий..."
                className="w-full p-3 border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
                rows={3}
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowReturnModal(false);
                  setReturnReason('');
                  setCustomReturnReason('');
                  setReturnComment('');
                }}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-[10px] hover:bg-gray-50 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleReturnForRevision}
                disabled={!returnReason || (returnReason === 'Другое' && !customReturnReason)}
                className="flex-1 py-2 px-4 bg-yellow-500 text-white rounded-[10px] hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Вернуть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdDetail;