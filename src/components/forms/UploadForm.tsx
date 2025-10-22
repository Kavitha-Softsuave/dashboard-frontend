import { Button } from "@/components/ui/button";
import { useUploadFileMutation } from "@/store/api";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateFileId } from "@/store/userSlice";
import React, { useState, useRef } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { resetWidget } from "@/store/widgetSlice";

interface IProp {
  onClose: () => void;
}

function UploadForm({ onClose }: IProp) {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const [uploadFile, { isLoading }] = useUploadFileMutation();

  const handleFile = (selectedFile: File) => {
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
    } else {
      toast.error("Please upload a CSV file only.");
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFile(droppedFile);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) handleFile(selectedFile);
  };

  const handleFormSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!file) {
      toast.error("Please select a CSV file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await uploadFile(formData).unwrap();
      if (response?.data) {
        dispatch(updateFileId(response.data?.id));
      }
      toast.success("File uploaded successfully!");
      setFile(null);
      setShowConfirm(false);
      dispatch(resetWidget());
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload file.");
    }
  };

  const handleUploadClick = (e: React.FormEvent) => {
    e.preventDefault();
    // If user already has a widget/file, show confirmation
    if (user.fileId) {
      setShowConfirm(true);
    } else {
      handleFormSubmit();
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-between">
      <form
        onSubmit={handleUploadClick}
        className="flex flex-col items-center justify-center mx-auto"
      >
        {/* Upload Container */}
        <div
          className={`relative flex flex-col items-center justify-center border-2 my-2 border-dashed rounded-2xl h-32 cursor-pointer transition-all duration-300 ${
            dragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-400 bg-white"
          }`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
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
              or{" "}
              <span className="text-blue-600 font-semibold cursor-pointer">
                browse
              </span>
            </p>
          ) : (
            <div className="flex flex-col items-center break-all px-10">
              <p className="text-green-600 font-semibold">{file.name}</p>
            </div>
          )}
        </div>

        <Button type="submit" className="w-full my-2" disabled={isLoading}>
          {isLoading ? "Uploading..." : "Upload file"}
        </Button>
      </form>

      <div>
        <p className="text-xs text-gray-500 mt-1">
          *You can upload only one file per dashboard at a time.
        </p>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Upload</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            Uploading a new file will remove your previously created widget. Are
            you sure you want to continue?
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirm(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleFormSubmit} disabled={isLoading}>
              {isLoading ? "Uploading..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default UploadForm;
