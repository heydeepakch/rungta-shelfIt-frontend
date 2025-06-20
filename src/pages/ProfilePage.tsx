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
  IndianRupee,
  Heart,
  ShoppingCart
} from 'lucide-react';
import { formatDistance } from 'date-fns';
import { Ad } from '../contexts/DataContext';

export const ProfilePage = () => {
  const { user } = useAuth();
  const { getAdsByUser } = useData();
  const [userAds, setUserAds] = useState<Ad[]>([]);
  const [activeAds, setActiveAds] = useState<Ad[]>([]);
  const [soldAds, setSoldAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAds = async () => {
      if (user) {
        setLoading(true);
        const myAds = await getAdsByUser(user._id);
        setUserAds(myAds);
        setActiveAds(myAds.filter(ad => ad.status === 'active'));
        setSoldAds(myAds.filter(ad => ad.status === 'sold'));
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
  const totalRevenue = soldAds.reduce((sum, ad) => sum + ad.price, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col items-center text-center md:text-left">
              <Avatar className="w-20 h-20 sm:w-24 sm:h-24 mb-4">
                <AvatarImage src={user.avatar} alt={user.name || 'User'} />
                <AvatarFallback className="text-lg sm:text-2xl">
                  {(user.name || 'User').split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>

              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{user.name || 'User'}</h1>
                {user.verified && (
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    ✓ Verified
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-1 mb-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{user.rating || 0}</span>
                <span className="text-gray-600">({user.totalSales || 0} sales)</span>
              </div>
            </div>

            {/* User Details */}
            <div className="flex-1 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{user.email || 'No email'}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{user.location || 'No location'}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <GraduationCap className="h-4 w-4" />
                  <span>{user.college || 'No college'}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {joinDate}</span>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-gray-700">
                  <span className="font-medium">{user.major || 'No major'}</span> • <span className="font-medium">{user.year || 'No year'}</span>
                </p>
              </div>
            </div>

            {/* Action Button */}
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link to="/post">
                <Plus className="h-4 w-4 mr-2" />
                Post New Ad
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardContent className="p-4 sm:p-6 text-center">
            <Package className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mx-auto mb-2" />
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{userAds.length}</h3>
            <p className="text-sm sm:text-base text-gray-600">Total Listings</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6 text-center">
            <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 mx-auto mb-2" />
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{activeAds.length}</h3>
            <p className="text-sm sm:text-base text-gray-600">Active Ads</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6 text-center">
            <Eye className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 mx-auto mb-2" />
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{totalViews}</h3>
            <p className="text-sm sm:text-base text-gray-600">Total Views</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6 text-center">
            <IndianRupee className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600 mx-auto mb-2" />
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">₹{totalRevenue}</h3>
            <p className="text-sm sm:text-base text-gray-600">Revenue</p>
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
              <TabsTrigger value="active">Active ({activeAds.length})</TabsTrigger>
              <TabsTrigger value="sold">Sold ({soldAds.length})</TabsTrigger>
              <TabsTrigger value="all">All ({userAds.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="mt-6">
              {activeAds.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeAds.map((ad) => (
                    <AdCard key={ad._id} ad={ad} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No active listings</h3>
                  <p className="text-gray-600 mb-4">You don't have any active listings at the moment.</p>
                  <Button asChild>
                    <Link to="/post">Post Your First Ad</Link>
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="sold" className="mt-6">
              {soldAds.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {soldAds.map((ad) => (
                    <AdCard key={ad._id} ad={ad} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No sold items yet</h3>
                  <p className="text-gray-600">Your sold items will appear here once you make your first sale.</p>
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
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No listings yet</h3>
                  <p className="text-gray-600 mb-4">Start selling items to your college community!</p>
                  <Button asChild>
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
