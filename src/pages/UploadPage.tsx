import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

function UploadPage() {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const handleFile = (file) => {
    if (file && file.type === "text/csv") {
      setFile(file);
    } else {
      alert("Please upload a CSV file only.");
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFile(droppedFile);
  };

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    handleFile(selectedFile);
  };

  return (
    <div className="">
      <div className="flex items-center justify-between mb-6 bg-[#614b75] text-white">
        <div className="flex items-center gap-4 p-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">Upload File</h1>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center h-[60vh] bg-[#fcfcfc] w-96 mx-auto">
        {/* Upload Container */}
        <div
          className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-2xl w-96 h-64 cursor-pointer transition-all duration-300 ${
            dragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-400 bg-white"
          }`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleChange}
          />

          {!file ? (
            <p className="text-gray-500 text-center">
              Drag & drop your CSV file here <br />
              or <span className="text-blue-600 font-semibold">browse</span>
            </p>
          ) : (
            <div className="flex flex-col items-center break-all px-10">
              <p className="text-green-600 font-semibold">
                {file.name} uploaded successfully!
              </p>
            </div>
          )}
        </div>
        <Button className="w-full my-2">Upload file</Button>
      </div>
    </div>
  );
}

export default UploadPage;
