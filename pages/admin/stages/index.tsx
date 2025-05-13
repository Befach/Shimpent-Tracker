import { useState, useEffect } from 'react';
import ClientOnlyAdmin from '../../../components/ClientOnlyAdmin';

export default function ManageStages() {
  const [stages, setStages] = useState([]);
  const [newStage, setNewStage] = useState({ name: '', order: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Load dummy data
    setStages([
      { id: '1', name: 'Order Received', order: 1 },
      { id: '2', name: 'Processing', order: 2 },
      { id: '3', name: 'Shipped', order: 3 },
      { id: '4', name: 'In Transit', order: 4 },
      { id: '5', name: 'Out for Delivery', order: 5 },
      { id: '6', name: 'Delivered', order: 6 }
    ]);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStage({
      ...newStage,
      [name]: value
    });
  };

  const handleAddStage = (e) => {
    e.preventDefault();
    setIsAdding(true);
    setError('');
    
    // Validate form
    if (!newStage.name || !newStage.order) {
      setError('Please fill in all fields');
      setIsAdding(false);
      return;
    }
    
    // Check if order is a number
    if (isNaN(Number(newStage.order))) {
      setError('Order must be a number');
      setIsAdding(false);
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      const newStageWithId = {
        id: String(stages.length + 1),
        name: newStage.name,
        order: Number(newStage.order)
      };
      
      setStages([...stages, newStageWithId]);
      setNewStage({ name: '', order: '' });
      setSuccess('Stage added successfully!');
      setIsAdding(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    }, 1000);
  };

  const handleDeleteStage = (id) => {
    if (window.confirm('Are you sure you want to delete this stage?')) {
      // Simulate API call
      setTimeout(() => {
        setStages(stages.filter(stage => stage.id !== id));
        setSuccess('Stage deleted successfully!');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      }, 500);
    }
  };

  return (
    <ClientOnlyAdmin title="Manage Stages">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Manage Shipment Stages</h1>
        
        {success && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded">
            <p>{success}</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
            <p>{error}</p>
          </div>
        )}
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Add New Stage</h2>
          <form onSubmit={handleAddStage} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Stage Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newStage.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                  placeholder="e.g. Order Confirmed"
                />
              </div>
              
              <div>
                <label htmlFor="order" className="block text-sm font-medium text-gray-700">
                  Order
                </label>
                <input
                  type="number"
                  id="order"
                  name="order"
                  value={newStage.order}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                  placeholder="e.g. 3"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isAdding}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
              >
                {isAdding ? 'Adding...' : 'Add Stage'}
              </button>
            </div>
          </form>
        </div>
        
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Existing Stages</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-lg">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[...stages].sort((a, b) => a.order - b.order).map((stage) => (
                  <tr key={stage.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{stage.order}</td>
                    <td className="px-6 py-4">{stage.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button 
                        onClick={() => handleDeleteStage(stage.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ClientOnlyAdmin>
  );
} 