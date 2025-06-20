import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { AdCard } from '../components/ads/AdCard';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { Ad } from '../contexts/DataContext';

export const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { categories, searchAds } = useData();
  const [filteredAds, setFilteredAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedCondition, setSelectedCondition] = useState('any');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const performSearch = async () => {
      setLoading(true);
      const results = await searchAds(searchQuery, selectedCategory === 'all' ? undefined : selectedCategory);

      let processedResults = results;

      // Client-side filtering for condition and price range
      if (selectedCondition && selectedCondition !== 'any') {
        processedResults = processedResults.filter(ad => ad.condition === selectedCondition);
      }
      if (priceRange.min) {
        processedResults = processedResults.filter(ad => ad.price >= Number(priceRange.min));
      }
      if (priceRange.max) {
        processedResults = processedResults.filter(ad => ad.price <= Number(priceRange.max));
      }

      // Client-side sorting
      switch (sortBy) {
        case 'price-low':
          processedResults.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          processedResults.sort((a, b) => b.price - a.price);
          break;
        case 'oldest':
          processedResults.sort((a, b) => new Date(a.datePosted).getTime() - new Date(b.datePosted).getTime());
          break;
        case 'popular':
          processedResults.sort((a, b) => b.views - a.views);
          break;
        default: // newest
          processedResults.sort((a, b) => new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime());
      }

      setFilteredAds(processedResults);
      setLoading(false);
    };

    performSearch();
  }, [searchAds, searchQuery, selectedCategory, sortBy, priceRange, selectedCondition]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedCategory) params.set('category', selectedCategory);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedCondition('any');
    setPriceRange({ min: '', max: '' });
    setSortBy('newest');
    setSearchParams({});
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c._id === categoryId);
    return category ? category.name : categoryId;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search for items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="w-full lg:w-48">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.icon} {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filters Toggle */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="lg:w-auto"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
          </Button>

          {/* Search Button */}
          <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
            Search
          </Button>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Sort By */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Sort by</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest first</SelectItem>
                    <SelectItem value="oldest">Oldest first</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="popular">Most viewed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Condition */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Condition</label>
                <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any condition</SelectItem>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Like New">Like New</SelectItem>
                    <SelectItem value="Excellent">Excellent</SelectItem>
                    <SelectItem value="Good">Good</SelectItem>
                    <SelectItem value="Fair">Fair</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Min Price</label>
                <Input
                  type="number"
                  placeholder="₹0"
                  value={priceRange.min || ''}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                  className="w-full"
                />
              </div>
              <div className="text-gray-500">to</div>
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="₹1000"
                  value={priceRange.max || ''}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="outline" onClick={clearFilters}>
                Clear all filters
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Active Filters */}
      {(searchQuery || selectedCategory || selectedCondition || priceRange.min || priceRange.max) && (
        <div className="flex flex-wrap gap-2">
          {searchQuery && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: "{searchQuery}"
              <button
                onClick={() => setSearchQuery('')}
                className="ml-1 hover:bg-gray-300 rounded-full w-4 h-4 flex items-center justify-center text-xs"
              >
                ×
              </button>
            </Badge>
          )}
          {selectedCategory && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Category: {getCategoryName(selectedCategory)}
              <button
                onClick={() => setSelectedCategory('')}
                className="ml-1 hover:bg-gray-300 rounded-full w-4 h-4 flex items-center justify-center text-xs"
              >
                ×
              </button>
            </Badge>
          )}
          {selectedCondition && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Condition: {selectedCondition}
              <button
                onClick={() => setSelectedCondition('')}
                className="ml-1 hover:bg-gray-300 rounded-full w-4 h-4 flex items-center justify-center text-xs"
              >
                ×
              </button>
            </Badge>
          )}
          {(priceRange.min || priceRange.max) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Price: ₹{priceRange.min || '0'} - ₹{priceRange.max || '∞'}
              <button
                onClick={() => setPriceRange({ min: '', max: '' })}
                className="ml-1 hover:bg-gray-300 rounded-full w-4 h-4 flex items-center justify-center text-xs"
              >
                ×
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* Results */}
      <div>
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'Browse All Items'}
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            {searchQuery
              ? `Found ${filteredAds.length} item${filteredAds.length !== 1 ? 's' : ''}`
              : 'Discover great deals from your college community'
            }
          </p>
        </div>

        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
            {filteredAds.length} {filteredAds.length === 1 ? 'item' : 'items'} found
          </h2>
        </div>

        {filteredAds.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAds.map((ad) => (
              <AdCard key={ad._id} ad={ad} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 sm:py-16 text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center">
                  <Search className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No items found</h3>
                  <p className="text-sm sm:text-base text-gray-600 max-w-md">
                    We couldn't find any items matching your search criteria.
                    Try adjusting your filters or search terms.
                  </p>
                </div>
                <Button onClick={clearFilters} variant="outline">
                  Clear all filters
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
