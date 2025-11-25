// src/components/AdCard.tsx
import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { Ad } from '../types';
import { useNavigate } from 'react-router-dom';



const AdCard: React.FC<Ad> = (ad) => {
    const navigate = useNavigate();
  
    const handleOpen = () => {
        navigate(`/item/${ad.id}`);
    };
    
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'approved':
        return { 
          text: 'Одобрено', 
          color: 'bg-green-100 text-green-800'
        };
      case 'rejected':
        return { 
          text: 'Отклонено', 
          color: 'bg-red-100 text-red-800'
        };
      case 'pending':
        return { 
          text: 'На модерации', 
          color: 'bg-yellow-100 text-yellow-800'
        };
      default:
        return { 
          text: 'Черновик', 
          color: 'bg-gray-100 text-gray-800'
        };
    }
  };

  const getPriorityConfig = (priority: string) => {
    return priority === 'urgent' 
      ? { 
          text: 'Срочный', 
          color: 'bg-red-100 text-red-800'
        }
      : { 
          text: 'Обычный', 
          color: 'bg-blue-100 text-blue-800'
        };
  };

  const statusConfig = getStatusConfig(ad.status);
  const priorityConfig = getPriorityConfig(ad.priority);

  return (
    <div key={ad.id} className="flex p-[20px] border w-full max-w-[80%] rounded-[15px] justify-between items-center">
      <div className='flex gap-[15px]'>
        <img 
          src={ad.images[0]} 
          alt={ad.title}
          className="rounded-[15px] w-[300px] h-[200px]"
          loading="lazy"
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

          <div className="flex gap-[20px]">
            <span className={`px-3 py-1 rounded-[10px] text-sm ${statusConfig.color}`}>
              {statusConfig.text}
            </span>
            
            <span className={`px-3 py-1 rounded-[10px] text-sm ${priorityConfig.color}`}>
              {priorityConfig.text}
            </span>
          </div>
        </div>
      </div>
      
      <button 
        onClick={() => handleOpen()}
        className='flex items-center gap-[10px] bg-[#10b981] text-white font-semibold py-2 px-4 rounded-[10px] transition-colors duration-200 hover:bg-[#059669]'
      >
        Открыть
        <ArrowRight size={18} />
      </button>
    </div>
  );
};

export default AdCard;