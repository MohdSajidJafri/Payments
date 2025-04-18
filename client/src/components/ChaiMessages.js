import React from 'react';

const ChaiMessages = ({ messages }) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-amber-800 mb-6">Chai Messages</h2>
      
      {messages.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No chai messages yet. Be the first to buy a chai!</p>
      ) : (
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className="chai-card bg-amber-50 p-4 rounded-lg border-l-4 border-amber-500"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-amber-800">{msg.name}</h3>
                <span className="text-xs text-gray-500">
                  {new Date(msg.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-2 text-gray-700">{msg.message}</p>
              <div className="mt-2 text-xs text-amber-600 font-medium">
                {msg.amount / 30} chai{msg.amount > 30 ? 's' : ''} (₹{msg.amount})
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChaiMessages;
