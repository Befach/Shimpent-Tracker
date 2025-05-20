import React from 'react';

// Define the stages in order
const SHIPMENT_STAGES = [
  'Product Insurance',
  'Supplier Payment',
  'Packaging Approval from Customer',
  'Pickup at Origin',
  'In Transit to India',
  'Pending Customer Clearance',
  'Customs Clearance',
  'Dispatch to Befach Warehouse',
  'Dispatch to Customer Warehouse'
];

interface ShipmentTimelineProps {
  currentStage: string;
}

const ShipmentTimeline: React.FC<ShipmentTimelineProps> = ({ currentStage }) => {
  // Find the index of the current stage
  const currentStageIndex = SHIPMENT_STAGES.findIndex(stage => stage === currentStage);
  
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-700 mb-4">Shipment Timeline</h3>
      
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        
        {/* Timeline items */}
        <div className="space-y-6">
          {SHIPMENT_STAGES.map((stage, index) => {
            const isCompleted = index <= currentStageIndex;
            const isCurrent = index === currentStageIndex;
            
            return (
              <div key={stage} className="relative flex items-start">
                {/* Timeline dot */}
                <div className={`absolute left-5 w-5 h-5 rounded-full transform -translate-x-1/2 ${
                  isCompleted 
                    ? 'bg-green-500' 
                    : 'bg-gray-300'
                } ${
                  isCurrent 
                    ? 'ring-4 ring-green-100' 
                    : ''
                }`}></div>
                
                {/* Content */}
                <div className="ml-10">
                  <h4 className={`font-medium ${
                    isCompleted 
                      ? 'text-gray-900' 
                      : 'text-gray-500'
                  } ${
                    isCurrent 
                      ? 'text-green-600' 
                      : ''
                  }`}>
                    {stage}
                  </h4>
                  
                  {isCurrent && (
                    <p className="mt-1 text-sm text-green-600">Current status</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ShipmentTimeline; 