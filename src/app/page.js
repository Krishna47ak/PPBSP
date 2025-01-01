"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Calendar } from 'lucide-react';
import CryptoJS from 'crypto-js';

const DetectionDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [confidenceThreshold, setConfidenceThreshold] = useState(0);
  const [detections, setDetections] = useState([]);


  const filteredDetections = detections.filter(detection => {
    const matchesSearch =
      detection.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      detection.frame_id.toString().includes(searchTerm) ||
      detection.detections.some(det => det.label.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesPriority =
      priorityFilter === 'all' ||
      detection.detections.some(det => det.priority === priorityFilter);

    const matchesConfidence =
      detection.detections.some(det => det.confidence_score * 100 >= confidenceThreshold);

    return matchesSearch && matchesPriority && matchesConfidence;
  });

  useEffect(() => {
    const fetchDetections = async () => {
      try {
        const response = await fetch('/api/detections');
        const result = await response.json();

        if (result.success) {
          // Decrypt the data
          const bytes = CryptoJS.AES.decrypt(
            result.data,
            process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'default_encryption_key'
          );
          const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          setDetections(decryptedData);
        }
      } catch (error) {
        console.error('Error fetching detections:', error);
      }
    };

    fetchDetections();
  }, []);



  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">Detection Report Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <label className="block text-sm font-medium mb-2">Search</label>
                <Input
                  placeholder="Search by description, ID, or label..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <label className="block text-sm font-medium mb-2">Priority Filter</label>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <label className="block text-sm font-medium mb-2">
                  Confidence Threshold: {confidenceThreshold}%
                </label>
                <Slider
                  value={[confidenceThreshold]}
                  onValueChange={(values) => setConfidenceThreshold(values[0])}
                  max={100}
                  step={1}
                  className="my-4"
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Total Detections</p>
                  <p className="text-2xl font-bold">{filteredDetections.length}</p>
                </div>
                <Calendar className="w-8 h-8 text-gray-400" />
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDetections.map((detection, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-48 bg-gray-100">
                <img
                  src={`data:image/jpeg;base64,${detection.frame_file}`}
                  alt={`Frame ${detection.frame_id}`}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-lg font-semibold">Frame {detection.frame_id}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(detection.timestamp).toLocaleString()}
                    </p>
                  </div>
                  {detection.detections.map((det, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${det.priority === 'urgent'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                        }`}
                    >
                      {det.priority}
                    </span>
                  ))}
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {detection.description}
                </p>

                {detection.detections.map((det, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-3 rounded-lg mb-2 last:mb-0"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{det.label}</span>
                      <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {(det.confidence_score * 100).toFixed(1)}% confident
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Box: {det.bounding_box.x}, {det.bounding_box.y}, {det.bounding_box.width} x {det.bounding_box.height}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DetectionDashboard;