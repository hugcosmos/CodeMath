import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';
import { useState, useEffect } from 'react';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'zh-CN', label: '中文', short: '中' },
    { code: 'en', label: 'English', short: 'EN' },
  ];

  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setIsOpen(false);
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div 
      className="fixed top-6 right-6 z-50"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 group"
      >
        <Globe className="w-4 h-4 text-gray-600 group-hover:text-gray-900" />
        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 min-w-[24px]">
          {currentLanguage.short}
        </span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 py-2 bg-white rounded-2xl shadow-xl border border-gray-100 min-w-[140px] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                i18n.language === lang.code 
                  ? 'bg-amber-50 text-amber-700' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>{lang.label}</span>
              {i18n.language === lang.code && (
                <Check className="w-4 h-4" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
