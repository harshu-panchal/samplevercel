import { useState, useEffect } from 'react';
import { FiPlus, FiSearch, FiEdit, FiTrash2, FiEye, FiEyeOff, FiCalendar } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useCampaignStore } from '../../store/campaignStore';
import CampaignForm from '../../components/Admin/Campaigns/CampaignForm';
import ExportButton from '../../components/Admin/ExportButton';
import Badge from '../../components/Badge';
import { formatDateTime } from '../../utils/adminHelpers';
import toast from 'react-hot-toast';

const Campaigns = () => {
  const {
    campaigns,
    initialize,
    deleteCampaign,
    toggleCampaignStatus,
  } = useCampaignStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);

  useEffect(() => {
    initialize();
  }, []);

  // Filtered campaigns
  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      !searchQuery ||
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (campaign.description &&
        campaign.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = selectedType === 'all' || campaign.type === selectedType;

    const now = new Date();
    const isActive = campaign.isActive &&
      new Date(campaign.startDate) <= now &&
      new Date(campaign.endDate) >= now;

    const matchesStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'active' && isActive) ||
      (selectedStatus === 'inactive' && !isActive) ||
      (selectedStatus === 'upcoming' && new Date(campaign.startDate) > now) ||
      (selectedStatus === 'ended' && new Date(campaign.endDate) < now);

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleCreate = () => {
    setEditingCampaign(null);
    setShowForm(true);
  };

  const handleEdit = (campaign) => {
    setEditingCampaign(campaign);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      deleteCampaign(id);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingCampaign(null);
  };

  const getCampaignStatus = (campaign) => {
    const now = new Date();
    if (!campaign.isActive) return 'inactive';
    if (new Date(campaign.startDate) > now) return 'upcoming';
    if (new Date(campaign.endDate) < now) return 'ended';
    return 'active';
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'success',
      inactive: 'error',
      upcoming: 'warning',
      ended: 'error',
    };
    return colors[status] || 'error';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="lg:hidden">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Campaigns</h1>
          <p className="text-gray-600">Manage promotional campaigns and offers</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 gradient-green text-white rounded-lg hover:shadow-glow-green transition-all font-semibold"
        >
          <FiPlus />
          Create Campaign
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search campaigns..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Types</option>
            <option value="flash_sale">Flash Sale</option>
            <option value="daily_deal">Daily Deal</option>
            <option value="special_offer">Special Offer</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="upcoming">Upcoming</option>
            <option value="ended">Ended</option>
            <option value="inactive">Inactive</option>
          </select>

          {/* Export Button */}
          <ExportButton
            data={filteredCampaigns}
            headers={[
              { label: 'ID', accessor: (row) => row.id },
              { label: 'Name', accessor: (row) => row.name },
              { label: 'Type', accessor: (row) => row.type },
              { label: 'Discount', accessor: (row) => `${row.discountValue}${row.discountType === 'percentage' ? '%' : ''}` },
              { label: 'Start Date', accessor: (row) => formatDateTime(row.startDate) },
              { label: 'End Date', accessor: (row) => formatDateTime(row.endDate) },
              { label: 'Status', accessor: (row) => getCampaignStatus(row) },
            ]}
            filename="campaigns"
          />
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCampaigns.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500">No campaigns found</p>
          </div>
        ) : (
          filteredCampaigns.map((campaign) => {
            const status = getCampaignStatus(campaign);
            return (
              <div
                key={campaign.id}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-lg mb-1">{campaign.name}</h3>
                    <Badge variant={getStatusColor(status)}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Badge>
                  </div>
                  <button
                    onClick={() => toggleCampaignStatus(campaign.id)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title={campaign.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {campaign.isActive ? <FiEye /> : <FiEyeOff />}
                  </button>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-semibold text-gray-800">
                      {campaign.type.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Discount:</span>
                    <span className="font-semibold text-primary-600">
                      {campaign.discountValue}
                      {campaign.discountType === 'percentage' ? '%' : ' $'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Products:</span>
                    <span className="font-semibold text-gray-800">
                      {campaign.productIds.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <FiCalendar />
                    <span>{formatDateTime(campaign.startDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <FiCalendar />
                    <span>{formatDateTime(campaign.endDate)}</span>
                  </div>
                </div>

                {campaign.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {campaign.description}
                  </p>
                )}

                <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleEdit(campaign)}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold flex items-center justify-center gap-2"
                  >
                    <FiEdit />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(campaign.id)}
                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Campaign Form Modal */}
      {showForm && (
        <CampaignForm
          campaign={editingCampaign}
          onClose={handleFormClose}
          onSave={() => {
            initialize();
          }}
        />
      )}
    </motion.div>
  );
};

export default Campaigns;

