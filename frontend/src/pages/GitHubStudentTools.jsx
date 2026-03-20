import { useState, useEffect } from 'react';
import {
  GraduationCap,
  Search,
  Filter,
  ExternalLink,
  Code,
  Cloud,
  Database,
  Palette,
  Globe,
  Cpu,
  Mail,
  BookOpen,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';
import api from '../api';
import toast from 'react-hot-toast';

const GitHubStudentTools = () => {
  const [tools, setTools] = useState([]);
  const [filteredTools, setFilteredTools] = useState([]);
  const [categories, setCategories] = useState([]);
  const [accessInfo, setAccessInfo] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAccessInfo, setShowAccessInfo] = useState(false);
  const [expandedTools, setExpandedTools] = useState({});

  // Category icons mapping
  const categoryIcons = {
    'Development Platform': Code,
    'IDE': Code,
    'Cloud Platform': Cloud,
    'Database': Database,
    'Design Tool': Palette,
    'Development Tool': Cpu,
    'Domain & Hosting': Globe,
    'Email Service': Mail,
    'Learning Platform': BookOpen,
    'CI/CD': Cpu,
    'Monitoring': Cpu,
    'Payment Processing': Cpu,
    'Communication API': Mail,
    'Search API': Cpu
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterTools();
  }, [tools, selectedCategory, searchQuery]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [toolsRes, categoriesRes, accessInfoRes] = await Promise.all([
        api.get('/github-student-tools'),
        api.get('/github-student-tools/categories'),
        api.get('/github-student-tools/access-info')
      ]);

      setTools(toolsRes.data.data);
      setCategories(['All', ...categoriesRes.data.data]);
      setAccessInfo(accessInfoRes.data.data);
      toast.success('Student tools loaded successfully!');
    } catch (error) {
      console.error('Error fetching tools:', error);
      toast.error('Failed to load GitHub Student tools');
    } finally {
      setLoading(false);
    }
  };

  const filterTools = () => {
    let filtered = tools;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(tool => tool.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        tool =>
          tool.name.toLowerCase().includes(query) ||
          tool.description.toLowerCase().includes(query) ||
          tool.category.toLowerCase().includes(query)
      );
    }

    setFilteredTools(filtered);
  };

  const toggleToolExpansion = (toolId) => {
    setExpandedTools(prev => ({
      ...prev,
      [toolId]: !prev[toolId]
    }));
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Development Platform': 'bg-blue-100 text-blue-700 border-blue-200',
      'IDE': 'bg-purple-100 text-purple-700 border-purple-200',
      'Cloud Platform': 'bg-cyan-100 text-cyan-700 border-cyan-200',
      'Database': 'bg-green-100 text-green-700 border-green-200',
      'Design Tool': 'bg-pink-100 text-pink-700 border-pink-200',
      'Development Tool': 'bg-indigo-100 text-indigo-700 border-indigo-200',
      'Domain & Hosting': 'bg-orange-100 text-orange-700 border-orange-200',
      'Email Service': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'Learning Platform': 'bg-teal-100 text-teal-700 border-teal-200',
      'CI/CD': 'bg-violet-100 text-violet-700 border-violet-200',
      'Monitoring': 'bg-red-100 text-red-700 border-red-200',
      'Payment Processing': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'Communication API': 'bg-amber-100 text-amber-700 border-amber-200',
      'Search API': 'bg-lime-100 text-lime-700 border-lime-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading GitHub Student tools...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1e40af] to-[#3b82f6] text-white p-6 -mx-4 -mt-4 rounded-b-[2rem] shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
            <GraduationCap size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-wide">GitHub Student Tools</h1>
            <p className="text-sm text-blue-200">Developer Pack Benefits</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <p className="text-sm text-white/90 leading-relaxed">
            Access professional development tools, cloud credits, and learning resources worth thousands of dollars - completely free for students!
          </p>
        </div>
      </div>

      {/* Access Info Button */}
      <button
        onClick={() => setShowAccessInfo(!showAccessInfo)}
        className="w-full bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl flex items-center justify-between active:scale-95 transition-transform"
      >
        <div className="flex items-center">
          <Info size={20} className="mr-2" />
          <span className="font-semibold">How to Access GitHub Student Pack</span>
        </div>
        {showAccessInfo ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {/* Access Info Expandable */}
      {showAccessInfo && accessInfo && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4 animate-fadeIn">
          <div>
            <h3 className="font-bold text-gray-900 mb-2 flex items-center">
              <CheckCircle size={18} className="mr-2 text-green-600" />
              Steps to Access
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 ml-2">
              {accessInfo.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-2 flex items-center">
              <CheckCircle size={18} className="mr-2 text-blue-600" />
              Eligibility Requirements
            </h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 ml-2">
              {accessInfo.eligibility.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Duration:</strong> {accessInfo.duration}
            </p>
            <p className="text-sm text-blue-800 mt-1">
              <strong>Renewal:</strong> {accessInfo.renewalInfo}
            </p>
          </div>

          <a
            href={accessInfo.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-[#2563eb] text-white text-center py-3 rounded-lg font-semibold active:scale-95 transition-transform"
          >
            Visit GitHub Education →
          </a>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search tools by name, category, or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Category Filter */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        <Filter size={18} className="text-gray-500 flex-shrink-0" />
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              selectedCategory === category
                ? 'bg-[#2563eb] text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing <span className="font-bold text-gray-900">{filteredTools.length}</span> of{' '}
        <span className="font-bold text-gray-900">{tools.length}</span> tools
      </div>

      {/* Tools Grid */}
      <div className="space-y-4">
        {filteredTools.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-gray-600">No tools found matching your criteria</p>
          </div>
        ) : (
          filteredTools.map((tool) => {
            const IconComponent = categoryIcons[tool.category] || Code;
            const isExpanded = expandedTools[tool.id];

            return (
              <div
                key={tool.id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <IconComponent size={24} className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900">{tool.name}</h3>
                        <span
                          className={`inline-block text-xs font-medium px-2 py-1 rounded-full border mt-1 ${getCategoryColor(
                            tool.category
                          )}`}
                        >
                          {tool.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 mb-3">{tool.description}</p>

                  {/* Benefits */}
                  <button
                    onClick={() => toggleToolExpansion(tool.id)}
                    className="w-full text-left text-sm font-semibold text-blue-600 flex items-center justify-between mb-2"
                  >
                    <span>View Benefits ({tool.benefits.length})</span>
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>

                  {isExpanded && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-3 animate-fadeIn">
                      <ul className="space-y-2">
                        {tool.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start text-sm text-gray-700">
                            <CheckCircle size={16} className="mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Learn More Button */}
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 active:scale-95 transition-transform"
                  >
                    Learn More
                    <ExternalLink size={14} className="ml-1" />
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default GitHubStudentTools;
