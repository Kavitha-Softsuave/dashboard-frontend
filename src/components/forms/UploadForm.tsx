import { Button } from "@/components/ui/button";
import { useUploadFileMutation } from "@/store/api";
import { useAppDispatch } from "@/store/hooks";
import { updateFileId } from "@/store/userSlice";
import React, { useState, useRef } from "react";
import { toast } from "sonner";

interface IProp {
  onClose: () => void;
}

function UploadForm({ onClose }: IProp) {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);
  const dispatch = useAppDispatch();

  const [uploadFile, { isLoading, isError, error, isSuccess }] =
    useUploadFileMutation();

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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("please select one csv file");
    }
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await uploadFile(formData).unwrap();
      if (response?.data) {
        dispatch(updateFileId(response.data?.id));
      }
      onClose();
      toast.success("File uploaded successfully!");
      setFile(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload file.");
    }
  };

  return (
    <div className="w-full flex flex-col  items-center justify-between">
      <form
        onSubmit={handleFormSubmit}
        className="flex flex-col items-center justify-center mx-auto"
      >
        {/* Upload Container */}
        <div
          className={`relative flex flex-col items-center justify-center border-2 my-2 border-dashed rounded-2xl  h-32 cursor-pointer transition-all duration-300 ${
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
              <p className="text-green-600 font-semibold">{file.name}</p>
            </div>
          )}
        </div>
        <Button type="submit" className="w-full my-2" disabled={isLoading}>
          Upload file
        </Button>
      </form>
      <div>
        <p className="text-xs">
          *You can upload only one file per dashboard at a time.
        </p>
      </div>
    </div>
  );
}

export default UploadForm;
