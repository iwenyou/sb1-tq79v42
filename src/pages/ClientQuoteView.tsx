import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Download, Mail, Phone } from 'lucide-react';
import { getQuoteById, QuoteData } from '../services/quoteService';
import { getProducts, getMaterials } from '../services/catalogService';
import { getDemoQuote } from '../services/demoService';
import { getTemplateSettings } from '../services/templateService';
import { Product, Material } from '../types/catalog';
import { TemplateSettings } from '../types/template';

export function ClientQuoteView() {
  const { id } = useParams<{ id: string }>();
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [template, setTemplate] = useState<TemplateSettings>(getTemplateSettings());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load template settings
    setTemplate(getTemplateSettings());

    // Load demo quote if id is 'demo'
    if (id === 'demo') {
      setQuote(getDemoQuote());
      setProducts(getProducts());
      setMaterials(getMaterials());
      return;
    }

    // Load actual quote
    if (id) {
      const quoteData = getQuoteById(id);
      if (quoteData) {
        setQuote(quoteData);
        setProducts(getProducts());
        setMaterials(getMaterials());
      } else {
        setError('Quote not found');
      }
    }
  }, [id]);

  if (error) {
    return <Navigate to="/404" replace />;
  }

  if (!quote) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const getProductName = (productId?: string) => {
    const product = products.find(p => p.id === productId);
    return product?.name || 'Custom Product';
  };

  const getMaterialName = (materialId?: string) => {
    const material = materials.find(m => m.id === materialId);
    return material?.name || 'Default';
  };

  const handleDownloadPDF = () => {
    // Implement PDF download functionality
    console.log('Downloading PDF...');
  };

  const handleContactEmail = () => {
    window.location.href = `mailto:${template.companyInfo.email}?subject=Quote ${quote.id} Inquiry`;
  };

  const handleContactPhone = () => {
    window.location.href = `tel:${template.companyInfo.phone.replace(/\D/g, '')}`;
  };

  // Apply template styles
  const styles = {
    primaryColor: template.layout.primaryColor,
    fontFamily: template.layout.fontFamily,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8" style={{ fontFamily: styles.fontFamily }}>
      {id === 'demo' && (
        <div className="max-w-4xl mx-auto mb-4">
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  This is a demo quote view. You can use this to preview how your quotes will look to clients.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header */}
          {template.sections.header.enabled && (
            <div className="px-8 py-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  {template.layout.showLogo && template.companyInfo.logo && (
                    <img
                      src={template.companyInfo.logo}
                      alt={template.companyInfo.name}
                      className="h-12 mb-4"
                    />
                  )}
                  <h1 className="text-2xl font-bold text-gray-900" style={{ color: styles.primaryColor }}>
                    {template.companyInfo.name}
                  </h1>
                  {template.layout.showCompanyInfo && (
                    <div className="mt-2 text-sm text-gray-600">
                      {template.companyInfo.address.split('\n').map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                      <p>{template.companyInfo.email}</p>
                      <p>{template.companyInfo.phone}</p>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <h2 className="text-xl font-semibold text-gray-900">Quote #{quote.id?.slice(0, 8)}</h2>
                  <p className="mt-2 text-sm text-gray-600">
                    Date: {new Date(quote.createdAt).toLocaleDateString()}
                  </p>
                  {template.layout.showValidityPeriod && (
                    <p className="text-sm text-gray-600">
                      Valid until: {new Date(new Date(quote.createdAt).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Client Information */}
          {template.sections.clientInfo.enabled && (
            <div className="px-8 py-6 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {template.sections.clientInfo.title}
              </h3>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-sm font-medium text-gray-900">{quote.clientName}</p>
                  <p className="mt-1 text-sm text-gray-600">{quote.email}</p>
                  <p className="text-sm text-gray-600">{quote.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-900 whitespace-pre-line">
                    {quote.installationAddress}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Quote Details */}
          {template.sections.quoteDetails.enabled && quote.spaces.map((space) => (
            <div key={space.id} className="px-8 py-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{space.name}</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      {template.sections.quoteDetails.columns
                        .filter(col => col.enabled)
                        .map(col => (
                          <th key={col.key} className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            {col.label}
                          </th>
                        ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {space.items.map((item) => (
                      <tr key={item.id}>
                        {template.sections.quoteDetails.columns
                          .filter(col => col.enabled)
                          .map(col => (
                            <td key={col.key} className="px-3 py-4 text-sm text-gray-900">
                              {col.key === 'product' && getProductName(item.productId)}
                              {col.key === 'material' && getMaterialName(item.material)}
                              {col.key === 'width' && `${item.width}"`}
                              {col.key === 'height' && `${item.height}"`}
                              {col.key === 'depth' && `${item.depth}"`}
                              {col.key === 'price' && `$${item.price.toFixed(2)}`}
                            </td>
                          ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          {/* Totals */}
          {template.sections.totals.enabled && (
            <div className="px-8 py-6 bg-gray-50">
              <div className="flex justify-end">
                <div className="w-64">
                  <div className="space-y-2">
                    {template.sections.totals.showSubtotal && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="text-gray-900">${quote.total.toFixed(2)}</span>
                      </div>
                    )}
                    {template.sections.totals.showTax && template.layout.showTaxDetails && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tax (13%)</span>
                        <span className="text-gray-900">${(quote.total * 0.13).toFixed(2)}</span>
                      </div>
                    )}
                    {template.sections.totals.showTotal && (
                      <div className="pt-2 border-t border-gray-200">
                        <div className="flex justify-between">
                          <span className="text-base font-medium text-gray-900">Total</span>
                          <span className="text-base font-medium" style={{ color: styles.primaryColor }}>
                            ${(quote.total * 1.13).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          {template.sections.footer.enabled && (
            <div className="px-8 py-6 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                {template.layout.showFooterNotes && (
                  <p className="mb-4">{template.sections.footer.notes}</p>
                )}
                <p className="italic">{template.sections.footer.terms}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          {template.layout.showContactButtons && (
            <div className="px-8 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleContactEmail}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email Us
                </button>
                <button
                  onClick={handleContactPhone}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Us
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-opacity-90"
                  style={{ backgroundColor: styles.primaryColor }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}