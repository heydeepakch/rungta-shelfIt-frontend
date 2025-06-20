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
        <p className="text-gray-500">No categories available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
      {categories.map((category) => {
        // Safety check for individual category
        if (!category || !category._id) {
          console.warn('Invalid category found:', category);
          return null;
        }

        return (
          <Link key={category._id} to={`/search?category=${category._id}`}>
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="text-3xl sm:text-4xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">
                  {category.icon || '📦'}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {category.name || 'Unknown Category'}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
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
