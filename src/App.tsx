import React, { useState, useEffect } from 'react';
import { Book, Plus, Search, Tag, LayoutGrid, Moon, Sun } from 'lucide-react';
import { RuleItem } from './components/RuleItem';
import { RuleModal } from './components/RuleModal';
import { Rule, CATEGORIES } from './types';

function App() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'text' | 'tag'>('text');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<Rule | undefined>(undefined);
  const [expandedRuleId, setExpandedRuleId] = useState<string | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [gridCols, setGridCols] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  // WebSocket接続の設定
  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:3000');

    websocket.onopen = () => {
      console.log('WebSocket接続が確立されました');
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'rules') {
        setRules(data.rules);
      }
    };

    websocket.onerror = (error) => {
      console.error('WebSocketエラー:', error);
    };

    websocket.onclose = () => {
      console.log('WebSocket接続が閉じられました');
      // 再接続を試みる
      setTimeout(() => {
        console.log('WebSocket再接続を試みます...');
        setWs(new WebSocket('ws://localhost:3000'));
      }, 3000);
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, []);

  // ダークモードの設定を保存
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const handleSaveRule = (ruleData: Omit<Rule, 'id' | 'lastUpdated'>) => {
    const newRule = {
      ...ruleData,
      id: editingRule?.id || crypto.randomUUID(),
      lastUpdated: new Date().toLocaleString('ja-JP')
    };

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'saveRule',
        rule: newRule
      }));
    }

    setEditingRule(undefined);
    setIsModalOpen(false);
  };

  const handleDeleteRule = (id: string) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'deleteRule',
        id
      }));
    }
  };

  const filteredRules = rules
    .filter(rule => {
      const matchesCategory = !selectedCategory || rule.category === selectedCategory;
      
      let matchesSearch = true;
      if (searchTerm) {
        if (searchType === 'text') {
          matchesSearch = rule.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rule.content?.toLowerCase().includes(searchTerm.toLowerCase());
        } else {
          matchesSearch = rule.tags?.some(tag => 
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          ) || false;
        }
      }
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDarkMode ? 'dark bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-indigo-50'}`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-500/10' : 'bg-blue-500/10'}`}>
                <Book className={`w-8 h-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
              <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                CoCoPD データリンク
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-800 text-gray-200 hover:bg-gray-700 hover:text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 shadow-sm'
                }`}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <div className={`flex items-center space-x-2 rounded-lg p-1 ${
                isDarkMode ? 'bg-gray-800' : 'bg-white shadow-sm'
              }`}>
                {[1, 2, 3].map(cols => (
                  <button
                    key={cols}
                    onClick={() => setGridCols(cols)}
                    className={`p-2 rounded transition-all ${
                      gridCols === cols 
                        ? isDarkMode 
                          ? 'bg-blue-500/20 text-blue-400' 
                          : 'bg-blue-100 text-blue-600'
                        : isDarkMode
                          ? 'hover:bg-gray-700 text-gray-400'
                          : 'hover:bg-gray-100 text-gray-600'
                    }`}
                    title={`${cols}列表示`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  setEditingRule(undefined);
                  setIsModalOpen(true);
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
              >
                <Plus className="w-5 h-5" />
                <span>新規ルール作成</span>
              </button>
            </div>
          </div>
        </header>

        <div className="mb-6 flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
          <div className="relative flex-1">
            <div className="flex items-center">
              <div className="relative flex-1">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <input
                  type="text"
                  placeholder={searchType === 'text' ? "ルールを検索..." : "タグで検索..."}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                  }`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={() => setSearchType(searchType === 'text' ? 'tag' : 'text')}
                className={`ml-2 p-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'hover:bg-gray-700 text-gray-300 bg-gray-800' 
                    : 'hover:bg-gray-100 text-gray-600 bg-white'
                } shadow-sm`}
              >
                {searchType === 'text' ? (
                  <Tag className="w-5 h-5" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          <select
            className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700 text-white' 
                : 'bg-white border-gray-200 text-gray-900'
            }`}
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
          >
            <option value="">すべてのカテゴリー</option>
            {Object.values(CATEGORIES).map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className={`grid gap-4 ${
          gridCols === 1 ? 'grid-cols-1' :
          gridCols === 2 ? 'grid-cols-1 md:grid-cols-2' :
          'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}>
          {filteredRules.map(rule => (
            <RuleItem
              key={rule.id}
              rule={rule}
              isExpanded={expandedRuleId === rule.id}
              onToggle={(id) => setExpandedRuleId(expandedRuleId === id ? null : id)}
              onEdit={(rule) => {
                setEditingRule(rule);
                setIsModalOpen(true);
              }}
              onDelete={handleDeleteRule}
              isDarkMode={isDarkMode}
            />
          ))}
          {filteredRules.length === 0 && (
            <div className={`text-center py-12 col-span-full ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <p>ルールが見つかりませんでした</p>
            </div>
          )}
        </div>

        <RuleModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingRule(undefined);
          }}
          onSave={handleSaveRule}
          editingRule={editingRule}
          categories={Object.values(CATEGORIES)}
          isDarkMode={isDarkMode}
        />
      </div>
    </div>
  );
}

export default App;