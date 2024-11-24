import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Ruler } from 'lucide-react';

const navigation = [
  { name: 'Generate Quote', href: '/generate-quote' },
  { name: 'Preset Values', href: '/preset-values' },
  { name: 'Catalog', href: '/catalog' },
  { name: 'Quotes', href: '/quotes' },
  { name: 'Quote Template', href: '/quote-template' },
];

export function Header() {
  const location = useLocation();

  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Ruler className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">CabinetQuote</span>
          </Link>
          
          <div className="hidden md:flex md:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`${
                  location.pathname === item.href
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-500 hover:text-gray-900'
                } inline-flex items-center px-1 pt-1 text-sm font-medium`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Log in
          </Link>
        </div>
      </nav>
    </header>
  );
}