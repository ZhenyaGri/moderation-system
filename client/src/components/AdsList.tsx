import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowRight } from 'lucide-react';

interface Ad {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  status: 'pending' | 'approved' | 'rejected' | 'draft';
  priority: 'normal' | 'urgent';
  images: string[];
  createdAt: string;
  seller: {
    id: string;
    name: string;
    rating: number;
    adsCount: number;
    registrationDate: string;
  };
  moderationHistory: Array<{
    id: string;
    moderatorName: string;
    action: string;
    comment?: string;
    timestamp: string;
  }>;
}

interface Pagination {
 currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

interface AdsResponse {
  ads: Ad[];
  pagination: Pagination;
}

const AdsList: React.FC = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
   const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await axios.get<AdsResponse>('/api/v1/ads', {
          params: {
            page: 1,
            limit: 10,
            
          }
        });
        setAds(response.data.ads || []);
        setPagination(response.data.pagination);
      } catch (error) {
        console.error('Error fetching ads:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className='flex flex-col px-[30px] py-[50px] gap-[25px]'>
      <h1 className=''>Список</h1>
      <div className="flex flex-wrap gap-[20px] justify-center">
        {ads.map(ad => (
          <div key={ad.id} className="flex p-[20px] border w-full max-w-[80%] rounded-[15px] justify-between items-center">
            <div className='flex gap-[15px]'>
                <img 
                    src={ad.images[0]} 
                    alt={ad.title}
                    className="rounded-[15px]"
                    onError={(e) => {
                        e.currentTarget.src = 'https://picsum.photos/300/200?grayscale';
                    }}
                />
                <div className='grid gap-[20px]'>
                    <h3>{ad.title}</h3>
                    <p>{ad.price} ₽</p>
                    <div className='flex gap-[20px]'>
                        <p>{ad.category}</p>
                        <p>{new Date(ad.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>

            </div>
            
            <button className='flex items-center gap-[10px] bg-[#10b981]'>
                Открыть
                <ArrowRight size={18} />
            </button>
            
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center ">
        
        <p className="">
          Всего: {pagination.totalItems} объявлений
        </p>
        
      </div>
    </div>
  );
};

export default AdsList;