import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Gift, Plus, Trash2, Copy, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Footer } from '../components/Footer';

const THEMES = [
  { id: 'romantic', name: 'Romantic', color: 'bg-pink-300' },
  { id: 'birthday', name: 'Birthday', color: 'bg-yellow-200' },
  { id: 'cute', name: 'Cute', color: 'bg-teal-300' },
  { id: 'minimal', name: 'Minimal', color: 'bg-white' },
  { id: 'galaxy', name: 'Galaxy', color: 'bg-purple-300' },
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
      <div className="flex-1 bg-[#fdfcf7] flex flex-col">
        {/* Neobrutalist Grid Background */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-40 z-0"
          style={{ backgroundImage: 'radial-gradient(circle, #000000 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }}
        ></div>
        
        <div className="flex-1 flex items-center justify-center p-4 z-10 pt-28">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-8 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-md w-full text-center border-[3px] border-black"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.5 }}
              className="w-20 h-20 bg-[#bbf7d0] text-black border-[3px] border-black rounded-full flex items-center justify-center mx-auto mb-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
            >
              <CheckCircle size={40} className="stroke-[2.5px]" />
            </motion.div>
            
            <h2 className="text-3xl font-extrabold text-black mb-2 uppercase">{t('create.success')}</h2>
            <p className="text-gray-700 font-mono font-medium mb-8">{t('create.successDesc')}</p>
            
            <div className="bg-[#fef08a] p-4 rounded-xl mb-6 text-left border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-xs uppercase font-mono font-bold text-black/50 mb-1">Gift Box ID</p>
              <p className="text-lg font-mono font-extrabold text-black">{formData.gift_id}</p>
            </div>

            <button
              onClick={copyLink}
              className="w-full py-4 bg-[#fbcfe8] text-black border-[3px] border-black rounded-xl font-extrabold text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all flex items-center justify-center gap-2 mb-6 cursor-pointer"
            >
              {copied ? <CheckCircle size={20} className="stroke-[2.5px]" /> : <Copy size={20} className="stroke-[2.5px]" />}
              {copied ? t('create.copied') : t('create.copyLink')}
            </button>

            <Link to="/" className="text-black font-extrabold hover:underline font-mono text-sm block">
              ← Return Home
            </Link>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#fdfcf7] flex flex-col relative select-none">
      {/* Neobrutalist Grid Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40 z-0"
        style={{ backgroundImage: 'radial-gradient(circle, #000000 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }}
      ></div>

      <div className="flex-1 py-28 px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Form Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-8 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-[3px] border-black"
            >
              <h2 className="text-3xl font-extrabold text-black mb-8 flex items-center gap-3 uppercase">
                <span className="bg-[#fbcfe8] border-[2.5px] border-black p-2 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <Gift className="text-black stroke-[2.5px]" />
                </span>
                {t('create.title')}
              </h2>

              {error && (
                <div className="bg-red-200 text-black px-4 py-3 rounded-xl mb-6 text-sm font-mono font-bold border-[2.5px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-black/70 mb-2">{t('create.giftId')}</label>
                    <input
                      type="text"
                      required
                      value={formData.gift_id}
                      onChange={(e) => setFormData({ ...formData, gift_id: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white border-[3px] border-black text-black font-semibold focus:bg-[#fef08a] focus:outline-none transition-all"
                      placeholder={t('create.giftIdPlaceholder')}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-black/70 mb-2">{t('create.password')}</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        autoComplete="off"
                        style={{ WebkitTextSecurity: showPassword ? 'none' : 'disc' }}
                        className="w-full px-4 py-3 rounded-xl bg-white border-[3px] border-black text-black font-semibold focus:bg-[#fef08a] focus:outline-none transition-all pr-12"
                        placeholder={t('create.passwordPlaceholder')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-black hover:text-indigo-600 transition-colors cursor-pointer"
                      >
                        {showPassword ? <EyeOff size={20} className="stroke-[2.5px]" /> : <Eye size={20} className="stroke-[2.5px]" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-black/70 mb-2">{t('create.sender')}</label>
                    <input
                      type="text"
                      required
                      value={formData.sender_name}
                      onChange={(e) => setFormData({ ...formData, sender_name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white border-[3px] border-black text-black font-semibold focus:bg-[#fef08a] focus:outline-none transition-all"
                      placeholder={t('create.senderPlaceholder')}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-black/70 mb-2">{t('create.recipient')}</label>
                    <input
                      type="text"
                      required
                      value={formData.recipient_name}
                      onChange={(e) => setFormData({ ...formData, recipient_name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white border-[3px] border-black text-black font-semibold focus:bg-[#fef08a] focus:outline-none transition-all"
                      placeholder={t('create.recipientPlaceholder')}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-black/70 mb-2">{t('create.message')}</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border-[3px] border-black text-black font-semibold focus:bg-[#fef08a] focus:outline-none transition-all resize-none"
                    placeholder={t('create.messagePlaceholder')}
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-black/70 mb-3">{t('create.theme')}</label>
                  <div className="flex flex-wrap gap-3">
                    {THEMES.map((theme) => (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, theme: theme.id })}
                        className={`px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all border-[3px] border-black cursor-pointer flex items-center ${
                          formData.theme === theme.id
                            ? 'bg-[#fef08a] text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] scale-102 font-extrabold'
                            : 'bg-white text-black hover:bg-gray-50'
                        }`}
                      >
                        <span className={`inline-block w-4 h-4 rounded-full mr-2 border-[2.5px] border-black ${theme.color}`} />
                        {t(`theme.${theme.id}`)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3 border-b-[2px] border-dashed border-black/20 pb-2">
                    <label className="block text-xs font-mono font-bold uppercase text-black/70">{t('create.links')}</label>
                    <button
                      type="button"
                      onClick={handleAddLink}
                      className="text-xs bg-[#bbf7d0] border-[2.2px] border-black px-2.5 py-1 rounded-lg text-black font-extrabold hover:bg-[#86efac] flex items-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                    >
                      <Plus size={14} className="mr-1 stroke-[2.5px]" /> {t('create.addLink')}
                    </button>
                  </div>
                  <div className="space-y-4">
                    {links.map((link, index) => (
                      <div key={index} className="flex gap-3 items-start bg-gray-50/50 border-[2px] border-black/10 p-3 rounded-2xl relative">
                        <div className="flex-1 space-y-3">
                          <input
                            type="text"
                            value={link.title}
                            onChange={(e) => handleLinkChange(index, 'title', e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-white border-[2.2px] border-black text-black text-sm focus:outline-none focus:bg-[#fef08a] font-semibold"
                            placeholder={t('create.linkTitlePlaceholder')}
                          />
                          <input
                            type="text"
                            value={link.url}
                            onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-white border-[2.2px] border-black text-black text-sm focus:outline-none focus:bg-[#fef08a] font-semibold"
                            placeholder={t('create.linkUrlPlaceholder')}
                          />
                        </div>
                        {links.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveLink(index)}
                            className="p-1.5 text-black border-[2.2px] border-black bg-white rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-red-200 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer mt-1"
                          >
                            <Trash2 size={16} className="stroke-[2.5px]" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-[#fde047] text-black border-[3px] border-black rounded-xl font-extrabold text-lg shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[5px] hover:translate-y-[5px] transition-all disabled:opacity-75 flex items-center justify-center cursor-pointer uppercase tracking-wider"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-[2.5px] border-black border-t-transparent rounded-full animate-spin" />
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
              className="hidden lg:block sticky top-28"
            >
              <h3 className="text-xs font-mono font-bold text-black uppercase tracking-wider mb-4 bg-white border-[2px] border-black px-3 py-1.5 rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] inline-block">
                {t('create.preview')}
              </h3>
              
              <div className={`w-full aspect-[9/16] rounded-[2.5rem] border-[4px] border-black overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative transition-all duration-500 bg-white`}>
                {/* Embedded theme backgrounds in Neobrutalism format */}
                <div className={`absolute inset-0 p-8 flex flex-col justify-between transition-all duration-500 ${
                  formData.theme === 'romantic' ? 'bg-[#fbcfe8]' :
                  formData.theme === 'birthday' ? 'bg-[#fef08a]' :
                  formData.theme === 'cute' ? 'bg-[#bbf7d0]' :
                  formData.theme === 'minimal' ? 'bg-[#fdfcf7]' :
                  'bg-indigo-300'
                }`}>
                  <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <div className="bg-white border-[3px] border-black p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6 text-black">
                      <Gift size={48} className="stroke-[2.5px]" />
                    </div>
                    <h4 className="text-xl font-extrabold text-black uppercase leading-tight bg-white border-[2.5px] border-black px-3 py-1.5 rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-4">
                      From: {formData.sender_name || '...'}
                    </h4>
                    <p className="text-sm font-mono font-bold text-black/80 bg-white border-[2.1px] border-black px-2.5 py-1 rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      For: {formData.recipient_name || '...'}
                    </p>
                  </div>
                  <div className="w-full p-4 rounded-xl bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black">
                    <p className="text-xs font-mono font-bold uppercase text-black/40 mb-1">Personal Message</p>
                    <p className="text-sm font-bold italic line-clamp-3">
                      "{formData.message || 'Your message will appear here...'}"
                    </p>
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
