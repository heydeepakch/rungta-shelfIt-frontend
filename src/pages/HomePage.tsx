import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { AdCard } from '../components/ads/AdCard';
import { CategoryGrid } from '../components/categories/CategoryGrid';
import { Search, TrendingUp, Users, Shield, Zap } from 'lucide-react';

export const HomePage = () => {
  const { ads, categories, loading } = useData();
  const [featuredAds, setFeaturedAds] = useState<typeof ads>([]);
  const [recentAds, setRecentAds] = useState<typeof ads>([]);

  useEffect(() => {
    if (ads.length > 0) {
      // Get featured ads (most viewed, active)
      const activeAds = ads.filter(ad => ad.status === 'active');
      const featured = activeAds
        .sort((a, b) => b.views - a.views)
        .slice(0, 4);

      // Get recent ads
      const recent = activeAds
        .sort((a, b) => new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime())
        .slice(0, 8);

      setFeaturedAds(featured);
      setRecentAds(recent);
    }
  }, [ads]);

  // Debug logging
  useEffect(() => {
    console.log('Categories loaded:', categories);
    console.log('Categories length:', categories?.length);
    if (categories?.length > 0) {
      console.log('First category:', categories[0]);
    }
  }, [categories]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-8 sm:py-12 lg:py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 logo-font">
            Rungta-ShelfIt
            <span className="block text-blue-600 dark:text-blue-400 mt-2">
              Marketplace for things you need!
            </span>
          </h1>
          <p className="text-sm sm:text-md lg:text-lg text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Buy and sell textbooks, electronics and more within your college community.
            Safe, easy and designed for student life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6">
              <Link to="/search">
                <Search className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Browse Items
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
              <Link to="/post">
                Start Selling
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
        <Card className="bg-gradient-to-br from-blue-900/20 via-blue-800/30 to-blue-700/20 border-blue-600/30 backdrop-blur-sm hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 group">
          <CardContent className="pt-4 sm:pt-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg shadow-blue-500/25">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">{ads.length}+</h3>
              <p className="text-sm sm:text-base text-slate-300 font-medium">Active Listings</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-900/20 via-green-800/30 to-green-700/20 border-green-600/30 backdrop-blur-sm hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300 group">
          <CardContent className="pt-4 sm:pt-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg shadow-green-500/25">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">500+</h3>
              <p className="text-sm sm:text-base text-slate-300 font-medium">Students Joined</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-900/20 via-purple-800/30 to-purple-700/20 border-purple-600/30 backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 group">
          <CardContent className="pt-4 sm:pt-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg shadow-purple-500/25">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">100%</h3>
              <p className="text-sm sm:text-base text-slate-300 font-medium">Verified Students</p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Categories Section */}
      <section>
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Shop by Category</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Find exactly what you need for college life. From textbooks to furniture,
            we've got everything organized just for you.
          </p>
        </div>
        {categories && categories.length > 0 ? (
          <CategoryGrid categories={categories} />
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">Loading categories...</p>
          </div>
        )}
      </section>

      {/* Featured Items */}
      {featuredAds.length > 0 && (
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Featured Items</h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Popular items that other students are viewing</p>
            </div>
            <Button asChild variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
              <Link to="/search">View All</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredAds.map((ad) => (
              <AdCard key={ad._id} ad={ad} />
            ))}
          </div>
        </section>
      )}

      {/* Recent Listings */}
      {recentAds.length > 0 && (
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Latest Listings</h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Fresh items just posted by your fellow students</p>
            </div>
            <Button asChild variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
              <Link to="/search">See More</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {recentAds.map((ad) => (
              <AdCard key={ad._id} ad={ad} />
            ))}
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="bg-gray-50 dark:bg-gray-800/50 -mx-4 px-4 py-12 sm:py-16 rounded-lg">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Why Choose Rungta-ShelfIt?</h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Built specifically for the college community</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">Safe & Secure</h3>
              <p className="text-sm sm:text-sm text-gray-600 dark:text-gray-300">
                Verified student community ensures safe transactions and reliable sellers
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-green-100 dark:bg-green-900/30 rounded-full">
                <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">Fast & Easy</h3>
              <p className="text-sm sm:text-sm text-gray-600 dark:text-gray-300">
                Post an ad in minutes, find what you need instantly with smart search
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">Community Focused</h3>
              <p className="text-sm sm:text-sm text-gray-600 dark:text-gray-300">
                Connect with students at your college, support your campus community
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-12 sm:py-16">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Ready to Get Started?</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6 sm:mb-8">
            Join thousands of students already buying and selling on Rungta-ShelfIt
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link to="/register">Create Account</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
              <Link to="/search">Browse Items</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
