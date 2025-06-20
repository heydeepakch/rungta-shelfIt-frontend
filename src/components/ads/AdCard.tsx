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
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm hover:border-blue-400/50">
      <Link to={`/ad/${ad._id}`}>
        <CardContent className="p-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-slate-700/30 mb-4">
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
            <h3 className="font-semibold text-foreground text-sm sm:text-base line-clamp-2 mb-2 group-hover:text-blue-400 transition-colors">
              {ad.title}
            </h3>

            <div className="flex items-center justify-between">
              <span className="text-base sm:text-lg font-bold text-blue-400">
                ₹{ad.price}
              </span>
            </div>

            <p className="text-sm sm:text-base text-slate-400 line-clamp-2 mb-3">
              {ad.description}
            </p>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs sm:text-sm text-slate-400">
                <div className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>{ad.location}</span>
                </div>
                <Badge variant="outline" className="text-xs border-slate-500/50 text-slate-300 bg-slate-700/30">
                  {ad.condition}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-xs sm:text-sm text-slate-400">
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
