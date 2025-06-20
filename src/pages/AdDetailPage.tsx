import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Calendar,
  Eye,
  Mail,
  Star,
  Flag,
  Edit
} from 'lucide-react';
import { formatDistance } from 'date-fns';
import { Ad } from '../contexts/DataContext';
import ContactSellerModal from '../components/ads/ContactSellerModal';

export const AdDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchAdById, updateAd, deleteAd, incrementViews } = useData();
  const { user } = useAuth();
  const [ad, setAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const loadAd = async () => {
      if (id) {
        setLoading(true);
        const foundAd = await fetchAdById(id);
        if (foundAd) {
          setAd(foundAd);
          incrementViews(id);
        }
        setLoading(false);
      }
    };
    loadAd();
  }, [id, fetchAdById, incrementViews]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: ad?.title,
        text: ad?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleMarkAsSold = async () => {
    if (ad && user && ad.seller._id === user._id) {
      await updateAd(ad._id, { status: 'sold' });
      setAd({ ...ad, status: 'sold' });
      toast.success('Item marked as sold!');
    }
  };

  const handleDeleteAd = async () => {
    if (ad && user && ad.seller._id === user._id) {
      if (window.confirm('Are you sure you want to delete this ad?')) {
        await deleteAd(ad._id);
        toast.success('Ad deleted successfully!');
        navigate('/');
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Or a skeleton loader
  }

  if (!ad) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Ad not found</h2>
          <p className="text-sm sm:text-base text-slate-400 mb-4">The ad you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/')} variant="outline" className="border-slate-600/50 hover:bg-slate-700/50">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const timeAgo = formatDistance(new Date(ad.datePosted), new Date(), { addSuffix: true });
  const isOwner = user && ad.seller._id === user._id;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-300 disabled:pointer-events-none disabled:opacity-50 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-slate-700/30">
            <img
              src={ad.images[currentImageIndex] || '/placeholder-image.svg'}
              alt={ad.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder-image.svg';
              }}
            />
          </div>

          {ad.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {ad.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${currentImageIndex === index ? 'border-blue-400 shadow-lg shadow-blue-400/20' : 'border-slate-600/50 hover:border-blue-400/50'
                    }`}
                >
                  <img
                    src={image}
                    alt={`${ad.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Ad Details */}
        <div className="space-y-4 sm:space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{ad.title}</h1>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-300 disabled:pointer-events-none disabled:opacity-50 h-8 rounded-md px-3 text-xs text-slate-400 hover:text-blue-400 hover:bg-blue-400/10"
                >
                  <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
                <button
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-300 disabled:pointer-events-none disabled:opacity-50 h-8 rounded-md px-3 text-xs text-slate-400 hover:text-red-400 hover:bg-red-400/10"
                >
                  <Flag className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <span className="text-2xl sm:text-3xl font-bold text-blue-400">₹{ad.price}</span>
              <Badge variant="outline" className="border-slate-500/50 text-slate-300 bg-slate-700/30">{ad.condition}</Badge>
              {ad.status === 'sold' && (
                <Badge variant="secondary" className="bg-slate-700/50 text-slate-300">Sold</Badge>
              )}
            </div>

            <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-slate-400">
              <div className="flex items-center">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span>Posted {timeAgo}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span>{ad.location}</span>
              </div>
            </div>
          </div>

          {/* Category */}
          {ad.category && (
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl">{ad.category.icon}</span>
              <span className="font-medium text-slate-300">{ad.category.name}</span>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">Description</h3>
            <p className="text-sm sm:text-base text-slate-400 whitespace-pre-wrap">{ad.description}</p>
          </div>

          {/* Seller Info */}
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <Avatar>
                  <AvatarImage src={ad.seller.avatar || `https://api.dicebear.com/6.x/initials/svg?seed=${ad.seller.name}`} />
                  <AvatarFallback className="bg-slate-700/30 text-foreground">
                    {ad.seller.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold text-foreground">{ad.seller.name}</h4>
                  <p className="text-sm text-slate-400">{ad.college}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                {!isOwner && ad.status === 'active' && (
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200"
                    onClick={() => setShowContactModal(true)}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Contact Seller
                  </Button>
                )}

                {isOwner && (
                  <div className="space-y-2">
                    {ad.status === 'active' && (
                      <button
                        className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-300 disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 border border-slate-600/50 bg-transparent text-slate-300 hover:text-green-400 hover:border-green-400/50 hover:bg-green-400/10"
                        onClick={handleMarkAsSold}
                      >
                        Mark as Sold
                      </button>
                    )}
                    <div className="flex gap-2">
                      <button
                        className="flex-1 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-300 disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 border border-slate-600/50 bg-transparent text-slate-300 hover:text-blue-400 hover:border-blue-400/50 hover:bg-blue-400/10"
                        onClick={() => navigate(`/edit/${ad._id}`)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </button>
                      <button
                        className="flex-1 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-300 disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 border border-red-600/50 bg-transparent text-red-400 hover:text-red-300 hover:bg-red-400/10 hover:border-red-400/50"
                        onClick={handleDeleteAd}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Safety Tips */}
          <Card className="bg-gradient-to-br from-yellow-900/20 to-yellow-800/20 border-yellow-600/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <h4 className="font-semibold text-yellow-300 mb-2">Safety Tips</h4>
              <ul className="text-sm text-yellow-200 space-y-1">
                <li>• Meet in a public place on campus</li>
                <li>• Inspect the item before purchasing</li>
                <li>• Use secure payment methods</li>
                <li>• Trust your instincts</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <ContactSellerModal
          ad={ad}
          onClose={() => setShowContactModal(false)}
        />
      )}
    </div>
  );
};
