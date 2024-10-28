import React from 'react';
import { ChevronDown, ChevronUp, Edit, Trash2 } from 'lucide-react';
import { Rule, CATEGORY_COLORS } from '../types';

interface RuleItemProps {
  rule: Rule;
  isExpanded: boolean;
  onToggle: (id: string) => void;
  onEdit: (rule: Rule) => void;
  onDelete: (id: string) => void;
  isDarkMode: boolean;
}

export const RuleItem: React.FC<RuleItemProps> = ({ 
  rule, 
  isExpanded, 
  onToggle, 
  onEdit, 
  onDelete,
  isDarkMode 
}) => {
  const categoryColor = CATEGORY_COLORS[rule.category as keyof typeof CATEGORY_COLORS] || 'bg-gray-100 text-gray-800';

  return (
    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm border overflow-hidden`}>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className={`px-2 py-1 rounded-md text-sm font-medium ${categoryColor}`}>
              {rule.category}
            </span>
            <h3 className={`text-lg font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
              {rule.title}
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit(rule)}
              className={`p-1 ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-500'}`}
            >
              <Edit className="w-5 h-5" />
            </button>
            <button
              onClick={() => onDelete(rule.id)}
              className={`p-1 ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-500'}`}
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => onToggle(rule.id)}
              className={`p-1 ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-500'}`}
            >
              {isExpanded ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {rule.tags && rule.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {rule.tags.map(tag => (
              <span
                key={tag}
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {isExpanded && (
          <div className="mt-4 space-y-4">
            {rule.category === '強盗系' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    罰金（物品所持）
                  </p>
                  <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                    ${rule.fine?.withItems}
                  </p>
                </div>
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    罰金（物品なし）
                  </p>
                  <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                    ${rule.fine?.withoutItems}
                  </p>
                </div>
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    犯罪者人数
                  </p>
                  <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                    {rule.criminalCount}人
                  </p>
                </div>
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    PD人数
                  </p>
                  <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                    {rule.pdCount}人
                  </p>
                </div>
              </div>
            )}

            {['麻薬系', '軽犯罪系', '殺人系'].includes(rule.category) && (
              <div>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  罰金
                </p>
                <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  ${rule.fine?.withItems}
                </p>
              </div>
            )}

            {!['基本規則', '業務規則'].includes(rule.category) && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    拘留時間
                  </p>
                  <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                    {rule.detentionTime}分
                  </p>
                </div>
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    指名手配時間
                  </p>
                  <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                    {rule.wantedTime}分
                  </p>
                </div>
              </div>
            )}

            {rule.details1 && (
              <div>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  詳細(1)
                </p>
                <p className={`mt-1 whitespace-pre-wrap ${isDarkMode ? 'text-gray-200' : 'text-gray-900'} ${rule.details1Size || 'text-base'}`}>
                  {rule.details1}
                </p>
              </div>
            )}

            {rule.details2 && (
              <div>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  詳細(2)
                </p>
                <p className={`mt-1 whitespace-pre-wrap ${isDarkMode ? 'text-gray-200' : 'text-gray-900'} ${rule.details2Size || 'text-base'}`}>
                  {rule.details2}
                </p>
              </div>
            )}

            <div className={`flex justify-between text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <span>編集者: {rule.editor}</span>
              <span>最終更新: {rule.lastUpdated}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};