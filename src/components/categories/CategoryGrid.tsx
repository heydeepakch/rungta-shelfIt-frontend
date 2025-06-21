import { Link } from 'react-router-dom';
import { Card, CardContent } from '../ui/card';
import { Category } from '../../contexts/DataContext';

interface CategoryGridProps {
  categories: Category[];
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ categories }) => {
  // Safety check for categories
  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-400">No categories available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 justify-items-center max-w-6xl mx-auto">
      {categories.map((category) => {
        // Safety check for individual category
        if (!category || !category._id) {
          console.warn('Invalid category found:', category);
          return null;
        }

        return (
          <Link key={category._id} to={`/search?category=${category._id}`} className="w-full">
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm hover:border-blue-400/50 h-full flex flex-col">
              <CardContent className="p-4 sm:p-6 text-center flex flex-col justify-center flex-1">
                <div className="text-3xl sm:text-4xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">
                  {category.icon || '📦'}
                </div>
                <h3 className="font-semibold text-foreground text-sm sm:text-base group-hover:text-blue-400 transition-colors">
                  {category.name || 'Unknown Category'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 line-clamp-2">
                  {category.description || 'No description available'}
                </p>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
};
