import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Gift, Plus, Trash2, Copy, CheckCircle, ArrowLeft } from 'lucide-react';

const THEMES = [
  { id: 'romantic', name: 'Romantic', color: 'bg-pink-500' },
  { id: 'birthday', name: 'Birthday', color: 'bg-yellow-400' },
  { id: 'cute', name: 'Cute', color: 'bg-teal-400' },
  { id: 'minimal', name: 'Minimal', color: 'bg-gray-800' },
  { id: 'galaxy', name: 'Galaxy', color: 'bg-indigo-900' },
];

export default function CreateGift() {
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

    try {
      const response = await fetch('/api/gifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          links: links.filter(l => l.title && l.url),
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle size={40} />
          </motion.div>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Gift Created!</h2>
          <p className="text-gray-600 mb-8">Your digital gift box is ready to be shared.</p>
          
          <div className="bg-gray-100 p-4 rounded-xl mb-6 text-left">
            <p className="text-sm text-gray-500 font-medium mb-1">Gift Box ID</p>
            <p className="text-lg font-mono font-bold text-gray-800">{formData.gift_id}</p>
          </div>

          <button
            onClick={copyLink}
            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 mb-4"
          >
            {copied ? <CheckCircle size={20} /> : <Copy size={20} />}
            {copied ? 'Copied!' : 'Copy Gift Link'}
          </button>

          <Link to="/" className="text-indigo-600 font-medium hover:underline">
            Return Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Link to="/" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-8 transition-colors">
          <ArrowLeft size={20} className="mr-2" />
          Back to Home
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 rounded-3xl shadow-xl"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <Gift className="text-indigo-600" />
              Create Gift Box
            </h2>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gift Box ID</label>
                  <input
                    type="text"
                    required
                    value={formData.gift_id}
                    onChange={(e) => setFormData({ ...formData, gift_id: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="e.g., happy-bday-sarah"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Secret password"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sender Name</label>
                  <input
                    type="text"
                    required
                    value={formData.sender_name}
                    onChange={(e) => setFormData({ ...formData, sender_name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Name</label>
                  <input
                    type="text"
                    required
                    value={formData.recipient_name}
                    onChange={(e) => setFormData({ ...formData, recipient_name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Their name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Personal Message</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                  placeholder="Write something sweet..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Theme</label>
                <div className="flex flex-wrap gap-3">
                  {THEMES.map((theme) => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, theme: theme.id })}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        formData.theme === theme.id
                          ? 'bg-gray-900 text-white shadow-md scale-105'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block w-3 h-3 rounded-full mr-2 ${theme.color}`} />
                      {theme.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">Gift Links</label>
                  <button
                    type="button"
                    onClick={handleAddLink}
                    className="text-sm text-indigo-600 font-medium hover:text-indigo-700 flex items-center"
                  >
                    <Plus size={16} className="mr-1" /> Add Link
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
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 text-sm"
                          placeholder="Link Title (e.g., Spotify Playlist)"
                        />
                        <input
                          type="url"
                          value={link.url}
                          onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 text-sm"
                          placeholder="https://..."
                        />
                      </div>
                      {links.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveLink(index)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors mt-1"
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
                className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors disabled:opacity-70 flex items-center justify-center"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Create Gift Box'
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
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Live Preview</h3>
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
  );
}
