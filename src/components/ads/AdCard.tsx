import { Link } from 'react-router-dom';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Ad } from '../../contexts/DataContext';
import { formatDistance } from 'date-fns';
import { Eye, MapPin } from 'lucide-react';

interface AdCardProps {
  ad: Ad;
}

export const AdCard: React.FC<AdCardProps> = ({ ad }) => {
  const timeAgo = formatDistance(new Date(ad.datePosted), new Date(), { addSuffix: true });

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer dark:bg-gray-800 dark:border-gray-700">
      <Link to={`/ad/${ad._id}`}>
        <CardContent className="p-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700 mb-4">
            <img
              src={ad.images[0] || '/placeholder-image.svg'}
              alt={ad.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder-image.svg';
              }}
            />
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base line-clamp-2 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {ad.title}
            </h3>

            <div className="flex items-center justify-between">
              <span className="text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400">
                ₹{ad.price}
              </span>
            </div>

            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
              {ad.description}
            </p>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>{ad.location}</span>
                </div>
                <Badge variant="outline" className="text-xs dark:border-gray-600 dark:text-gray-300">
                  {ad.condition}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-xs sm:text-sm text-gray-400 dark:text-gray-500">
                <span>{timeAgo}</span>
                {/* <div className="flex items-center">
                  <Eye className="h-3 w-3 mr-1" />
                  <span>{ad.views} views</span>
                </div> */}
              </div>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};
