import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { AdCard } from '../components/ads/AdCard';
import {
  User,
  Mail,
  MapPin,
  Calendar,
  GraduationCap,
  Star,
  TrendingUp,
  Package,
  Eye,
  Plus,
  Heart,
  ShoppingCart
} from 'lucide-react';
import { formatDistance } from 'date-fns';
import { Ad } from '../contexts/DataContext';

export const ProfilePage = () => {
  const { user } = useAuth();
  const { getAdsByUser } = useData();
  const [userAds, setUserAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAds = async () => {
      if (user) {
        setLoading(true);
        const myAds = await getAdsByUser(user._id);
        setUserAds(myAds);
        setLoading(false);
      }
    };
    fetchUserAds();
  }, [user, getAdsByUser]);

  if (loading) {
    return <div>Loading...</div>; // Or a skeleton loader
  }

  if (!user) {
    return null;
  }

  // Safely format join date with validation
  const formatJoinDate = () => {
    try {
      if (!user.joinDate) {
        return 'Recently';
      }
      const joinDate = new Date(user.joinDate);
      if (isNaN(joinDate.getTime())) {
        return 'Recently';
      }
      return formatDistance(joinDate, new Date(), { addSuffix: true });
    } catch (error) {
      console.error('Error formatting join date:', error);
      return 'Recently';
    }
  };

  const joinDate = formatJoinDate();
  const totalViews = userAds.reduce((sum, ad) => sum + ad.views, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* User Info Card */}
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Avatar and Basic Info */}
            <div className="flex-shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-700/30 rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold text-foreground mb-4">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>

              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">{user.name || 'User'}</h1>
                {user.verified && (
                  <Badge variant="secondary" className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                    ✓ Verified
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-1 mb-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{user.rating || 0}</span>
                <span className="text-slate-400">({user.totalSales || 0} sales)</span>
              </div>
            </div>

            {/* User Details */}
            <div className="flex-1 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-slate-400">
                  <Mail className="h-4 w-4" />
                  <span>{user.email || 'No email'}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <MapPin className="h-4 w-4" />
                  <span>{user.location || 'No location'}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <GraduationCap className="h-4 w-4" />
                  <span>{user.college || 'No college'}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {joinDate}</span>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-slate-400">
                  <span className="font-medium">{user.major || 'No major'}</span> • <span className="font-medium">{user.year || 'No year'}</span>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <Card className="bg-gradient-to-br from-blue-900/20 via-blue-800/30 to-blue-700/20 border-blue-600/30 backdrop-blur-sm hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 group">
          <CardContent className="p-4 sm:p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-500/25">
                <Package className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">{userAds.length}</h3>
              <p className="text-sm sm:text-base text-slate-300 font-medium">Total Listings</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-900/20 via-green-800/30 to-green-700/20 border-green-600/30 backdrop-blur-sm hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300 group">
          <CardContent className="p-4 sm:p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-green-500/25">
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">{userAds.filter(ad => ad.status === 'active').length}</h3>
              <p className="text-sm sm:text-base text-slate-300 font-medium">Active Ads</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900/20 via-purple-800/30 to-purple-700/20 border-purple-600/30 backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 group">
          <CardContent className="p-4 sm:p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-purple-500/25">
                <Eye className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">{totalViews}</h3>
              <p className="text-sm sm:text-base text-slate-300 font-medium">Total Views</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* My Listings */}
      <Card>
        <CardHeader>
          <CardTitle>My Listings</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="active">Active ({userAds.filter(ad => ad.status === 'active').length})</TabsTrigger>
              <TabsTrigger value="sold">Sold ({userAds.filter(ad => ad.status === 'sold').length})</TabsTrigger>
              <TabsTrigger value="all">All ({userAds.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="mt-6">
              {userAds.filter(ad => ad.status === 'active').length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userAds.filter(ad => ad.status === 'active').map((ad) => (
                    <AdCard key={ad._id} ad={ad} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No active listings</h3>
                  <p className="text-slate-400 mb-4">You don't have any active listings at the moment.</p>
                  <Button asChild className="bg-blue-600 hover:bg-blue-700">
                    <Link to="/post">Post Your First Ad</Link>
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="sold" className="mt-6">
              {userAds.filter(ad => ad.status === 'sold').length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userAds.filter(ad => ad.status === 'sold').map((ad) => (
                    <AdCard key={ad._id} ad={ad} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <TrendingUp className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No sold items yet</h3>
                  <p className="text-slate-400">Your sold items will appear here once you make your first sale.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="all" className="mt-6">
              {userAds.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userAds.map((ad) => (
                    <AdCard key={ad._id} ad={ad} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No listings yet</h3>
                  <p className="text-slate-400 mb-4">Start selling items to your college community!</p>
                  <Button asChild className="bg-blue-600 hover:bg-blue-700">
                    <Link to="/post">Post Your First Ad</Link>
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
