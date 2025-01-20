import React, { useState, useRef } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const AudioUploader = ({ onUploadComplete }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [audioFile, setAudioFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type.startsWith('audio/')) {
        await handleFileUpload(file);
      }
    }
  };

  const handleFileUpload = async (file) => {
    try {
      setAudioFile(file);
      setUploadProgress(0);

      // Upload to Firebase Storage
      const storage = getStorage();
      const storageRef = ref(storage, `recordings/${Date.now()}_${file.name}`);
      
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      setUploadProgress(100);
      
      if (onUploadComplete) {
        onUploadComplete({ file, url: downloadURL });
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      // Here you would handle the error appropriately
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      handleFileUpload(file);
    }
  };

  return (
    <div className="mt-4">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
          ${uploadProgress > 0 ? 'bg-green-50' : ''}`}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={handleFileSelect}
        />
        
        <div className="text-gray-600">
          {uploadProgress > 0 ? (
            <div className="space-y-2">
              <p className="font-medium text-green-600">מעלה קובץ...</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-500 h-2.5 rounded-full transition-all" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              {uploadProgress === 100 && (
                <p className="text-green-600">הקובץ הועלה בהצלחה!</p>
              )}
            </div>
          ) : (
            <>
              <div className="text-4xl mb-2">📁</div>
              <p className="font-medium">גרור קובץ אודיו לכאן</p>
              <p className="text-sm text-gray-500 mt-1">או לחץ לבחירת קובץ</p>
              {audioFile && (
                <p className="mt-2 text-sm text-gray-600">
                  {audioFile.name}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AudioUploader;