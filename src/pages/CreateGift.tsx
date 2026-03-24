import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Gift, Plus, Trash2, Copy, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Footer } from '../components/Footer';

const THEMES = [
  { id: 'romantic', name: 'Romantic', color: 'bg-pink-500' },
  { id: 'birthday', name: 'Birthday', color: 'bg-yellow-400' },
  { id: 'cute', name: 'Cute', color: 'bg-teal-400' },
  { id: 'minimal', name: 'Minimal', color: 'bg-gray-800' },
  { id: 'galaxy', name: 'Galaxy', color: 'bg-indigo-900' },
];

export default function CreateGift() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    gift_id: '',
    password: '',
    sender_name: '',
    recipient_name: '',
    message: '',
    theme: 'romantic',
  });
  const [links, setLinks] = useState([{ title: '', url: '' }]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleAddLink = () => {
    setLinks([...links, { title: '', url: '' }]);
  };

  const handleRemoveLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleLinkChange = (index: number, field: 'title' | 'url', value: string) => {
    const newLinks = [...links];
    newLinks[index][field] = value;
    setLinks(newLinks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Format URLs to ensure they have http:// or https://
    const formattedLinks = links
      .filter(l => l.title && l.url)
      .map(l => {
        let formattedUrl = l.url.trim();
        if (!/^https?:\/\//i.test(formattedUrl)) {
          formattedUrl = `https://${formattedUrl}`;
        }
        return { ...l, url: formattedUrl };
      });

    try {
      const response = await fetch('/api/gifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          links: formattedLinks,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create gift box');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    const url = `${window.location.origin}/open?id=${formData.gift_id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (success) {
    return (
      <div className="flex-1 bg-gray-900 flex flex-col">
        <div className="flex-1 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-800 p-8 rounded-3xl shadow-2xl max-w-md w-full text-center border border-gray-700"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.5 }}
              className="w-20 h-20 bg-green-900/30 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle size={40} />
            </motion.div>
            
            <h2 className="text-3xl font-bold text-white mb-2">{t('create.success')}</h2>
            <p className="text-gray-400 mb-8">{t('create.successDesc')}</p>
            
            <div className="bg-gray-900 p-4 rounded-xl mb-6 text-left border border-gray-700">
              <p className="text-sm text-gray-500 font-medium mb-1">Gift Box ID</p>
              <p className="text-lg font-mono font-bold text-white">{formData.gift_id}</p>
            </div>

            <button
              onClick={copyLink}
              className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2 mb-4"
            >
              {copied ? <CheckCircle size={20} /> : <Copy size={20} />}
              {copied ? t('create.copied') : t('create.copyLink')}
            </button>

            <Link to="/" className="text-indigo-400 font-medium hover:text-indigo-300 hover:underline">
              Return Home
            </Link>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-900 flex flex-col">
      <div className="flex-1 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-700"
            >
              <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                <Gift className="text-indigo-400" />
                {t('create.title')}
              </h2>

              {error && (
                <div className="bg-red-900/50 text-red-200 p-4 rounded-xl mb-6 text-sm font-medium border border-red-500/50">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">{t('create.giftId')}</label>
                    <input
                      type="text"
                      required
                      value={formData.gift_id}
                      onChange={(e) => setFormData({ ...formData, gift_id: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-gray-500"
                      placeholder={t('create.giftIdPlaceholder')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">{t('create.password')}</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        autoComplete="new-password"
                        className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all pr-12 placeholder-gray-500"
                        placeholder={t('create.passwordPlaceholder')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">{t('create.sender')}</label>
                    <input
                      type="text"
                      required
                      value={formData.sender_name}
                      onChange={(e) => setFormData({ ...formData, sender_name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-gray-500"
                      placeholder={t('create.senderPlaceholder')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">{t('create.recipient')}</label>
                    <input
                      type="text"
                      required
                      value={formData.recipient_name}
                      onChange={(e) => setFormData({ ...formData, recipient_name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-gray-500"
                      placeholder={t('create.recipientPlaceholder')}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">{t('create.message')}</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none placeholder-gray-500"
                    placeholder={t('create.messagePlaceholder')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">{t('create.theme')}</label>
                  <div className="flex flex-wrap gap-3">
                    {THEMES.map((theme) => (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, theme: theme.id })}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          formData.theme === theme.id
                            ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20 scale-105'
                            : 'bg-gray-900 text-gray-400 border border-gray-700 hover:bg-gray-700 hover:text-gray-200'
                        }`}
                      >
                        <span className={`inline-block w-3 h-3 rounded-full mr-2 ${theme.color}`} />
                        {t(`theme.${theme.id}`)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-300">{t('create.links')}</label>
                    <button
                      type="button"
                      onClick={handleAddLink}
                      className="text-sm text-indigo-400 font-medium hover:text-indigo-300 flex items-center"
                    >
                      <Plus size={16} className="mr-1" /> {t('create.addLink')}
                    </button>
                  </div>
                  <div className="space-y-3">
                    {links.map((link, index) => (
                      <div key={index} className="flex gap-3 items-start">
                        <div className="flex-1 space-y-3">
                          <input
                            type="text"
                            value={link.title}
                            onChange={(e) => handleLinkChange(index, 'title', e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-indigo-500 text-sm placeholder-gray-500"
                            placeholder={t('create.linkTitlePlaceholder')}
                          />
                          <input
                            type="text"
                            value={link.url}
                            onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-indigo-500 text-sm placeholder-gray-500"
                            placeholder={t('create.linkUrlPlaceholder')}
                          />
                        </div>
                        {links.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveLink(index)}
                            className="p-2 text-gray-500 hover:text-red-400 transition-colors mt-1"
                          >
                            <Trash2 size={20} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-500 transition-colors disabled:opacity-70 flex items-center justify-center shadow-lg shadow-indigo-500/20"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    t('create.submit')
                  )}
                </button>
              </form>
            </motion.div>

            {/* Preview Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden lg:block"
            >
              <div className="sticky top-12">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">{t('create.preview')}</h3>
                <div className={`w-full aspect-[9/16] rounded-[2.5rem] border-8 border-gray-900 overflow-hidden shadow-2xl relative transition-colors duration-500 ${
                  formData.theme === 'romantic' ? 'bg-pink-50' :
                  formData.theme === 'birthday' ? 'bg-yellow-50' :
                  formData.theme === 'cute' ? 'bg-teal-50' :
                  formData.theme === 'minimal' ? 'bg-white' :
                  'bg-indigo-950 text-white'
                }`}>
                  <div className="absolute inset-0 p-8 flex flex-col">
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                      <Gift size={64} className={`mb-6 ${formData.theme === 'galaxy' ? 'text-indigo-300' : 'text-gray-900'}`} />
                      <h4 className={`text-2xl font-bold mb-2 ${formData.theme === 'galaxy' ? 'text-white' : 'text-gray-900'}`}>
                        A gift from {formData.sender_name || '...'}
                      </h4>
                      <p className={`text-sm ${formData.theme === 'galaxy' ? 'text-indigo-200' : 'text-gray-500'}`}>
                        For {formData.recipient_name || '...'}
                      </p>
                    </div>
                    <div className="w-full p-4 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/20 shadow-sm">
                      <p className={`text-sm italic ${formData.theme === 'galaxy' ? 'text-gray-900' : 'text-gray-700'}`}>
                        "{formData.message || 'Your message will appear here...'}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
