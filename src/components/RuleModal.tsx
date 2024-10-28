import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Rule, CATEGORIES } from '../types';

interface RuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (rule: Omit<Rule, 'id' | 'lastUpdated'>) => void;
  editingRule?: Rule;
  categories: string[];
  isDarkMode: boolean;
}

export const RuleModal: React.FC<RuleModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  editingRule, 
  categories,
  isDarkMode 
}) => {
  const [formData, setFormData] = useState<Partial<Rule>>({
    title: '',
    category: '',
    content: '',
    editor: '',
    tags: [],
    fine: { withItems: 0, withoutItems: 0 },
    detentionTime: 0,
    wantedTime: 0,
    criminalCount: 0,
    pdCount: 0,
    details1: '',
    details2: '',
    details1Size: 'text-base',
    details2Size: 'text-base'
  });

  useEffect(() => {
    if (editingRule) {
      setFormData(editingRule);
    } else {
      setFormData({
        title: '',
        category: '',
        content: '',
        editor: '',
        tags: [],
        fine: { withItems: 0, withoutItems: 0 },
        detentionTime: 0,
        wantedTime: 0,
        criminalCount: 0,
        pdCount: 0,
        details1: '',
        details2: '',
        details1Size: 'text-base',
        details2Size: 'text-base'
      });
    }
  }, [editingRule]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Omit<Rule, 'id' | 'lastUpdated'>);
    onClose();
  };

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value) {
      e.preventDefault();
      const newTag = e.currentTarget.value.trim();
      if (newTag && !formData.tags?.includes(newTag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...(prev.tags || []), newTag]
        }));
      }
      e.currentTarget.value = '';
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTextSizeChange = (field: 'details1Size' | 'details2Size', size: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: size
    }));
  };

  const renderCategorySpecificFields = () => {
    if (formData.category === CATEGORIES.ROBBERY) {
      return (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                罰金（物品所持）
              </label>
              <input
                type="number"
                value={formData.fine?.withItems || 0}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  fine: { ...prev.fine, withItems: parseInt(e.target.value) }
                }))}
                className={`mt-1 block w-full rounded-md ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-gray-200' 
                    : 'border-gray-300 text-gray-900'
                } shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                罰金（物品なし）
              </label>
              <input
                type="number"
                value={formData.fine?.withoutItems || 0}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  fine: { ...prev.fine, withoutItems: parseInt(e.target.value) }
                }))}
                className={`mt-1 block w-full rounded-md ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-gray-200' 
                    : 'border-gray-300 text-gray-900'
                } shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                犯罪者人数
              </label>
              <input
                type="number"
                value={formData.criminalCount || 0}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  criminalCount: parseInt(e.target.value)
                }))}
                className={`mt-1 block w-full rounded-md ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-gray-200' 
                    : 'border-gray-300 text-gray-900'
                } shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                PD人数
              </label>
              <input
                type="number"
                value={formData.pdCount || 0}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  pdCount: parseInt(e.target.value)
                }))}
                className={`mt-1 block w-full rounded-md ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-gray-200' 
                    : 'border-gray-300 text-gray-900'
                } shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
              />
            </div>
          </div>
        </>
      );
    }

    if ([CATEGORIES.DRUGS, CATEGORIES.MINOR, CATEGORIES.MURDER].includes(formData.category as any)) {
      return (
        <div>
          <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            罰金
          </label>
          <input
            type="number"
            value={formData.fine?.withItems || 0}
            onChange={e => setFormData(prev => ({
              ...prev,
              fine: { withItems: parseInt(e.target.value) }
            }))}
            className={`mt-1 block w-full rounded-md ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-gray-200' 
                : 'border-gray-300 text-gray-900'
            } shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
          />
        </div>
      );
    }

    return null;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      } rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
              {editingRule ? 'ルールを編集' : '新規ルール作成'}
            </h2>
            <button
              onClick={onClose}
              className={`${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-500'}`}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                タイトル
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className={`mt-1 block w-full rounded-md ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-gray-200' 
                    : 'border-gray-300 text-gray-900'
                } shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                カテゴリー
              </label>
              <select
                value={formData.category}
                onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className={`mt-1 block w-full rounded-md ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-gray-200' 
                    : 'border-gray-300 text-gray-900'
                } shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
                required
              >
                <option value="">カテゴリーを選択</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {renderCategorySpecificFields()}

            {!['基本規則', '業務規則'].includes(formData.category) && (
              <>
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    拘留時間（分）
                  </label>
                  <input
                    type="number"
                    value={formData.detentionTime || 0}
                    onChange={e => setFormData(prev => ({
                      ...prev,
                      detentionTime: parseInt(e.target.value)
                    }))}
                    className={`mt-1 block w-full rounded-md ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-gray-200' 
                        : 'border-gray-300 text-gray-900'
                    } shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    指名手配時間（分）
                  </label>
                  <input
                    type="number"
                    value={formData.wantedTime || 0}
                    onChange={e => setFormData(prev => ({
                      ...prev,
                      wantedTime: parseInt(e.target.value)
                    }))}
                    className={`mt-1 block w-full rounded-md ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-gray-200' 
                        : 'border-gray-300 text-gray-900'
                    } shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
                  />
                </div>
              </>
            )}

            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                詳細(1)
              </label>
              <div className="flex items-center space-x-2 mb-2">
                <select
                  value={formData.details1Size || 'text-base'}
                  onChange={(e) => handleTextSizeChange('details1Size', e.target.value)}
                  className={`rounded-md ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-gray-200' 
                      : 'border-gray-300 text-gray-900'
                  } shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
                >
                  <option value="text-sm">小</option>
                  <option value="text-base">中</option>
                  <option value="text-lg">大</option>
                  <option value="text-xl">特大</option>
                </select>
              </div>
              <textarea
                value={formData.details1}
                onChange={e => setFormData(prev => ({ ...prev, details1: e.target.value }))}
                className={`mt-1 block w-full rounded-md ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-gray-200' 
                    : 'border-gray-300 text-gray-900'
                } shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${formData.details1Size}`}
                rows={3}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                詳細(2)
              </label>
              <div className="flex items-center space-x-2 mb-2">
                <select
                  value={formData.details2Size || 'text-base'}
                  onChange={(e) => handleTextSizeChange('details2Size', e.target.value)}
                  className={`rounded-md ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-gray-200' 
                      : 'border-gray-300 text-gray-900'
                  } shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
                >
                  <option value="text-sm">小</option>
                  <option value="text-base">中</option>
                  <option value="text-lg">大</option>
                  <option value="text-xl">特大</option>
                </select>
              </div>
              <textarea
                value={formData.details2}
                onChange={e => setFormData(prev => ({ ...prev, details2: e.target.value }))}
                className={`mt-1 block w-full rounded-md ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-gray-200' 
                    : 'border-gray-300 text-gray-900'
                } shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${formData.details2Size}`}
                rows={3}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                タグ
              </label>
              <input
                type="text"
                onKeyDown={handleTagInput}
                placeholder="Enterで追加"
                className={`mt-1 block w-full rounded-md ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-gray-200' 
                    : 'border-gray-300 text-gray-900'
                } shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.tags?.map(tag => (
                  <span
                    key={tag}
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-indigo-100 text-indigo-800'
                    }`}
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className={`ml-1 ${
                        isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-indigo-600 hover:text-indigo-500'
                      }`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                編集者
              </label>
              <input
                type="text"
                value={formData.editor}
                onChange={e => setFormData(prev => ({ ...prev, editor: e.target.value }))}
                className={`mt-1 block w-full rounded-md ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-gray-200' 
                    : 'border-gray-300 text-gray-900'
                } shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
                required
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium ${
                  isDarkMode
                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                    : 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                }`}
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                保存
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};