import Image from 'next/image';

export default function DetectionCard({ detection }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="relative h-64 mb-4">
        <img
          src={detection.frame_file}
          alt={`Frame ${detection.frame_id}`}
          className="object-contain rounded"
        />
      </div>
      
      <div className="space-y-2">
        <p className="text-gray-600">
          <span className="font-semibold">Frame ID:</span> {detection.frame_id}
        </p>
        <p className="text-gray-600">
          <span className="font-semibold">Timestamp:</span>{' '}
          {new Date(detection.timestamp).toLocaleString()}
        </p>
        <p className="text-gray-600">
          <span className="font-semibold">Description:</span> {detection.description}
        </p>
        
        {detection.detections.map((det, index) => (
          <div key={index} className="bg-gray-50 text-black p-2 rounded">
            <p className="text-sm">
              <span className="font-semibold">Label:</span> {det.label}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Confidence:</span>{' '}
              {(det.confidence_score * 100).toFixed(2)}%
            </p>
            <p className="text-sm">
              <span className="font-semibold">Priority:</span>{' '}
              <span className={`${
                det.priority === 'urgent' ? 'text-red-600' : 'text-green-600'
              }`}>
                {det.priority}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
} 